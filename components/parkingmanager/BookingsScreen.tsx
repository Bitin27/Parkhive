

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { supabaseClient } from "../../app/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";


type Booking = {
  created_at: string;
  zone_id: string;
  start_time: string; 
  user_id: number;
  vehicle_id: string;
  slot_id: number;
  estimated_end_time: string; 
  actual_end_time: string | null;
  total_amount: number;
  additional_charges: number;
  payment_method: string;
  manager_id: number | null;
  // Nested data
  parking_slots?: {
    id: number;
    name: string;
    price_per_hour: number;
  };
  users?: {
    id: number;
    full_name: string;
    email: string;
  };
  parkingzones?: {
    id: string;
    name: string;
  };
  // Transformed data for easier access
  slot_name?: string;
  user_name?: string;
  zone_name?: string;
};

type BookingsScreenProps = {
  managerId: number;
};

const BookingsScreen = ({ managerId }: BookingsScreenProps) => {
  const [filter, setFilter] = useState<"active" | "all">("all"); // Default to "all" as requested
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const queryClient = useQueryClient();

 
  const fetchBookings = async () => {
    console.log("Fetching all bookings");

    let query = supabaseClient.from("bookings").select(`
            *,
            parking_slots(id, name, price_per_hour),
            users(id, full_name, email),
            parkingzones(id, name)
         `);

    if (filter === "active") {
      query = query.is("actual_end_time", null);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching bookings:", error);
      throw new Error(error.message);
    }

    console.log(`Found ${data?.length || 0} bookings`);

    // Transform the data to get slot name and user name
    return (
      data?.map((booking) => ({
        ...booking,
        slot_name:
          booking.parking_slots?.name || `Slot #${booking.slot_id}`,
        user_name: booking.users?.full_name || `User #${booking.user_id}`,
        zone_name: booking.parkingzones?.name || `Zone #${booking.zone_id}`,
      })) || []
    );
  };

  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["bookings", filter],
    queryFn: fetchBookings,
  });

 
  const endBookingMutation = useMutation({
    mutationFn: async (bookingData: {
      slotId: number;
      userId: number;
      createdAt: string;
    }) => {
      // Find the booking to get details
      const booking = bookings?.find(
        (b) =>
          b.slot_id === bookingData.slotId &&
          b.user_id === bookingData.userId &&
          b.created_at === bookingData.createdAt
      );

      if (!booking) throw new Error("Booking not found");

      const now = new Date();
      const estimatedEnd = new Date(booking.estimated_end_time);
      let additionalCharges = 0;

      // If current time is after estimated end time, calculate overstay charges
      if (now > estimatedEnd) {
        const overtimeHours = Math.ceil(
          (now.getTime() - estimatedEnd.getTime()) / (1000 * 60 * 60)
        );
        // Get price_per_hour from the related slot
        const pricePerHour = booking.parking_slots?.price_per_hour || 0;
        additionalCharges = overtimeHours * pricePerHour;
      }

      console.log(
        "Ending booking for slot:",
        bookingData.slotId,
        "user:",
        bookingData.userId,
        "with additional charges:",
        additionalCharges
      );

      // Update the booking record using composite key
      const { data, error } = await supabaseClient
        .from("bookings")
        .update({
          actual_end_time: now.toISOString(),
          additional_charges: additionalCharges,
          manager_id: managerId,
          total_amount: (booking.total_amount || 0) + additionalCharges,
        })
        .eq("slot_id", bookingData.slotId)
        .eq("user_id", bookingData.userId)
        .eq("created_at", bookingData.createdAt)
        .select();

      if (error) {
        console.error("Error ending booking:", error);
        throw new Error(error.message);
      }

      // Also update the slot status to available
      const slotUpdateResult = await supabaseClient
        .from("parking_slots")
        .update({ status: "available" })
        .eq("id", booking.slot_id);

      if (slotUpdateResult.error) {
        console.error(
          "Error updating slot status:",
          slotUpdateResult.error
        );
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setModalVisible(false);
      setSelectedBooking(null);
      Alert.alert("Success", "Booking ended successfully");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      Alert.alert("Error", error.message);
    },
  });

  const handleEndBooking = (booking: Booking) => {
    Alert.alert("End Booking", "Are you sure you want to end this booking?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Booking",
        style: "destructive",
        onPress: () =>
          endBookingMutation.mutate({
            slotId: booking.slot_id,
            userId: booking.user_id,
            createdAt: booking.created_at,
          }),
      },
    ]);
  };

  const openBookingDetails = (booking: Booking) => {
    console.log("Selected Booking:", booking); // Debugging: Log the selected booking
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  // Format timestamp function (for estimated_end_time, actual_end_time)
  const formatTimestamp = (dateString: string | null | undefined) => {
    if (!dateString) {
      return "N/A";
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (!isNaN(date.getTime())) {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      }
      
      return "Invalid Date";
    } catch (error) {
      console.error("Error formatting timestamp:", error, dateString);
      return "Invalid Date";
    }
  };

  // Format time function (specifically for start_time which is a time field, not a timestamp)
  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) {
      return "N/A";
    }
    
    try {
      // Handle PostgreSQL time format (e.g. "14:30:00+00")
      if (typeof timeString === 'string') {
        // Extract just the time portion
        const timeMatch = timeString.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
        
        if (timeMatch) {
          const hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          const seconds = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
          
          const date = new Date();
          date.setHours(hours, minutes, seconds, 0);
          
          // Return only the time portion
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
        }
      }
      
      // Try to parse as a full ISO date and extract time
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      }
      
      // If all else fails, return the raw value
      return timeString;
    } catch (error) {
      console.error("Error formatting time:", error, timeString);
      return "Invalid Time";
    }
  };

  // Add a retry button for development/debugging
  const handleRetry = () => {
    refetchBookings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "active" && styles.activeFilter,
          ]}
          onPress={() => setFilter("active")}
        >
          <Text
            style={
              filter === "active" ? styles.activeFilterText : styles.filterText
            }
          >
            Active Bookings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={filter === "all" ? styles.activeFilterText : styles.filterText}
          >
            All Bookings
          </Text>
        </TouchableOpacity>
      </View>

      {bookingsLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : bookingsError ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Error loading bookings</Text>
          <Text style={styles.errorDetails}>{bookingsError.toString()}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : bookings?.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            No {filter === "active" ? "active " : ""}bookings found
          </Text>
          {filter === "active" && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => setFilter("all")}
            >
              <Text style={styles.viewAllButtonText}>View All Bookings</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => `${item.slot_id}-${item.user_id}-${item.created_at}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => openBookingDetails(item)}
            >
              <View style={styles.bookingHeader}>
                <Text style={styles.slotName}>
                  {item.slot_name || `Slot #${item.slot_id}`}
                </Text>
                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.status,
                      item.actual_end_time
                        ? styles.statusCompleted
                        : styles.statusActive,
                    ]}
                  >
                    {item.actual_end_time ? "Completed" : "Active"}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {item.user_name || `User #${item.user_id}`}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    {formatTime(item.start_time)} -
                    {item.actual_end_time
                      ? formatTime(item.actual_end_time)
                      : formatTime(item.estimated_end_time) +
                      " (Est.)"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    ${item.total_amount}
                    {item.additional_charges > 0
                      ? ` (+ $${item.additional_charges} extra)`
                      : ""}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Booking Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedBooking && (
              <View style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Location</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Zone:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.zone_name || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Slot:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.slot_name ||
                        `#${selectedBooking.slot_id}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Time</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Start Time:</Text>
                    <Text style={styles.detailValue}>
                      {formatTime(selectedBooking.start_time)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Expected End:</Text>
                    <Text style={styles.detailValue}>
                      {formatTimestamp(selectedBooking.estimated_end_time)}
                    </Text>
                  </View>
                  {selectedBooking.actual_end_time && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Actual End:</Text>
                      <Text style={styles.detailValue}>
                        {formatTimestamp(selectedBooking.actual_end_time)}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Payment</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Base Amount:</Text>
                    <Text style={styles.detailValue}>
                      ${selectedBooking.total_amount - selectedBooking.additional_charges}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Additional Charges:</Text>
                    <Text style={styles.detailValue}>
                      ${selectedBooking.additional_charges}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total Amount:</Text>
                    <Text style={styles.detailValue}>
                      ${selectedBooking.total_amount}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Payment Method:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.payment_method}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>User</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.user_name || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>ID:</Text>
                    <Text style={styles.detailValue}>
                      {selectedBooking.user_id}
                    </Text>
                  </View>
                </View>

                {!selectedBooking.actual_end_time && (
                  <TouchableOpacity
                    style={styles.endButton}
                    onPress={() => handleEndBooking(selectedBooking)}
                  >
                    <Text style={styles.endButtonText}>End Booking</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  activeFilter: {
    backgroundColor: "#3498db",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  activeFilterText: {
    fontSize: 14,
    color: "#fff",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 5,
    textAlign: "center",
  },
  errorDetails: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#777",
    marginTop: 10,
  },
  viewAllButton: {
    backgroundColor: "#3498db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  viewAllButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  slotName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  statusActive: {
    backgroundColor: "#27ae60",
  },
  statusCompleted: {
    backgroundColor: "#777",
  },
  bookingDetails: {
    marginLeft: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  endButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  endButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  modalBody: {
    marginBottom: 15,
  },
  detailSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  detailItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#555",
    width: 120,
  },
  detailValue: {
    color: "#777",
    flex: 1,
  },
});

export default BookingsScreen;