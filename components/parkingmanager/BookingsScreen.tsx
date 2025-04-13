// import React, { useState } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    FlatList,
//    TouchableOpacity,
//    Alert,
//    ActivityIndicator,
//    Modal,
// } from "react-native";
// import { supabaseClient } from "../../app/lib/supabase";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Ionicons } from "@expo/vector-icons";

// // Define booking type
// type Booking = {
//    id: number;
//    created_at: string;
//    zone_id: string;
//    start_time: string;
//    user_id: number;
//    vehicle_id: string;
//    slot_id: number;
//    estimated_end_time: string;
//    actual_end_time: string | null;
//    total_amount: number;
//    additional_charges: number;
//    payment_method: string;
//    manager_id: number | null;
//    slot_name?: string;
//    user_name?: string;
//    zone_name?: string;
//    vehicle_details?: any;
// };

// type BookingsScreenProps = {
//    managerId: number;
// };

// const BookingsScreen = ({ managerId }: BookingsScreenProps) => {
//    const [filter, setFilter] = useState<"active" | "all">("active");
//    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//    const [modalVisible, setModalVisible] = useState(false);
//    const queryClient = useQueryClient();

//    // Fetch all parking zones managed by this manager
//    const fetchManagedZones = async () => {
//       const { data, error } = await supabaseClient
//          .from("parkingzones")
//          .select("id, name")
//          .eq("manager_id", managerId);

//       if (error) throw new Error(error.message);
//       return data || [];
//    };

//    const { data: managedZones, isLoading: zonesLoading } = useQuery({
//       queryKey: ["managedZones", managerId],
//       queryFn: fetchManagedZones,
//       enabled: !!managerId,
//    });

//    // Fetch bookings for this manager's zones
//    const fetchBookings = async () => {
//       if (!managedZones?.length) return [];

//       const zoneIds = managedZones.map((zone) => zone.id);

//       let query = supabaseClient
//          .from("bookings")
//          .select(
//             `
//         *,
//         parking_slots(id, name, price_per_hour),
//         users(id, full_name, email, phone),
//         parkingzones(id, name)
//       `
//          )
//          .in("zone_id", zoneIds);

//       if (filter === "active") {
//          query = query.is("actual_end_time", null);
//       }

//       const { data, error } = await query.order("created_at", {
//          ascending: false,
//       });

//       if (error) throw new Error(error.message);

//       // Transform the data to get slot name and user name
//       return (
//          data?.map((booking) => ({
//             ...booking,
//             slot_name: booking.parking_slots?.name,
//             user_name: booking.users?.full_name,
//             zone_name: booking.parkingzones?.name,
//             vehicle_details: null, // We'll fetch this separately if needed
//          })) || []
//       );
//    };

//    const {
//       data: bookings,
//       isLoading: bookingsLoading,
//       error: bookingsError,
//    } = useQuery({
//       queryKey: ["bookings", managedZones, filter],
//       queryFn: fetchBookings,
//       enabled: !!managedZones?.length,
//    });

//    // End a booking
//    const endBookingMutation = useMutation({
//       mutationFn: async (bookingId: number) => {
//          // Calculate end time and additional charges based on estimated time
//          const booking = bookings?.find((b) => b.id === bookingId);

//          if (!booking) throw new Error("Booking not found");

//          const now = new Date();
//          const estimatedEnd = new Date(booking.estimated_end_time);
//          let additionalCharges = 0;

//          // If current time is after estimated end time, calculate overstay charges
//          if (now > estimatedEnd) {
//             const overtimeHours = Math.ceil(
//                (now.getTime() - estimatedEnd.getTime()) / (1000 * 60 * 60)
//             );
//             // Get price_per_hour from the related slot
//             additionalCharges =
//                overtimeHours * (booking.parking_slots?.price_per_hour || 0);
//          }

//          // Update the booking record
//          const { data, error } = await supabaseClient
//             .from("bookings")
//             .update({
//                actual_end_time: now.toISOString(),
//                additional_charges: additionalCharges,
//                manager_id: managerId,
//                total_amount: (booking.total_amount || 0) + additionalCharges,
//             })
//             .eq("id", bookingId)
//             .select();

//          if (error) throw new Error(error.message);

//          // Also update the slot status to available
//          await supabaseClient
//             .from("parking_slots")
//             .update({ status: "available" })
//             .eq("id", booking.slot_id);

//          return data;
//       },
//       onSuccess: () => {
//          queryClient.invalidateQueries({ queryKey: ["bookings"] });
//          setModalVisible(false);
//          setSelectedBooking(null);
//          Alert.alert("Success", "Booking ended successfully");
//       },
//       onError: (error: any) => {
//          Alert.alert("Error", error.message);
//       },
//    });

//    const handleEndBooking = (bookingId: number) => {
//       Alert.alert("End Booking", "Are you sure you want to end this booking?", [
//          { text: "Cancel", style: "cancel" },
//          {
//             text: "End Booking",
//             style: "destructive",
//             onPress: () => endBookingMutation.mutate(bookingId),
//          },
//       ]);
//    };

//    const openBookingDetails = (booking: Booking) => {
//       setSelectedBooking(booking);
//       setModalVisible(true);
//    };

//    const isLoading = zonesLoading || bookingsLoading;

//    // Format date function
//    const formatDate = (dateString: string) => {
//       const date = new Date(dateString);
//       return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//    };

//    return (
//       <View style={styles.container}>
//          <View style={styles.filterContainer}>
//             <TouchableOpacity
//                style={[
//                   styles.filterButton,
//                   filter === "active" && styles.activeFilter,
//                ]}
//                onPress={() => setFilter("active")}
//             >
//                <Text
//                   style={
//                      filter === "active"
//                         ? styles.activeFilterText
//                         : styles.filterText
//                   }
//                >
//                   Active Bookings
//                </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                style={[
//                   styles.filterButton,
//                   filter === "all" && styles.activeFilter,
//                ]}
//                onPress={() => setFilter("all")}
//             >
//                <Text
//                   style={
//                      filter === "all"
//                         ? styles.activeFilterText
//                         : styles.filterText
//                   }
//                >
//                   All Bookings
//                </Text>
//             </TouchableOpacity>
//          </View>

//          {isLoading ? (
//             <View style={styles.centerContent}>
//                <ActivityIndicator size="large" color="#3498db" />
//                <Text style={styles.loadingText}>Loading bookings...</Text>
//             </View>
//          ) : bookingsError ? (
//             <View style={styles.centerContent}>
//                <Text style={styles.errorText}>Error loading bookings</Text>
//             </View>
//          ) : bookings?.length === 0 ? (
//             <View style={styles.centerContent}>
//                <Ionicons name="calendar-outline" size={64} color="#ccc" />
//                <Text style={styles.emptyText}>No bookings found</Text>
//             </View>
//          ) : (
//             <FlatList
//                data={bookings}
//                keyExtractor={(item) => item.id.toString()}
//                renderItem={({ item }) => (
//                   <TouchableOpacity
//                      style={styles.bookingCard}
//                      onPress={() => openBookingDetails(item)}
//                   >
//                      <View style={styles.bookingHeader}>
//                         <Text style={styles.slotName}>
//                            {item.slot_name || `Slot #${item.slot_id}`}
//                         </Text>
//                         <View style={styles.statusContainer}>
//                            <Text
//                               style={[
//                                  styles.status,
//                                  item.actual_end_time
//                                     ? styles.statusCompleted
//                                     : styles.statusActive,
//                               ]}
//                            >
//                               {item.actual_end_time ? "Completed" : "Active"}
//                            </Text>
//                         </View>
//                      </View>

//                      <View style={styles.bookingDetails}>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name="person-outline"
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               {item.user_name || `User #${item.user_id}`}
//                            </Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name="time-outline"
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               {new Date(item.start_time).toLocaleTimeString()} -
//                               {item.actual_end_time
//                                  ? new Date(
//                                       item.actual_end_time
//                                    ).toLocaleTimeString()
//                                  : new Date(
//                                       item.estimated_end_time
//                                    ).toLocaleTimeString() + " (Est.)"}
//                            </Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name="cash-outline"
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               ${item.total_amount}
//                               {item.additional_charges > 0
//                                  ? ` (+ $${item.additional_charges} extra)`
//                                  : ""}
//                            </Text>
//                         </View>
//                      </View>

//                      {!item.actual_end_time && (
//                         <TouchableOpacity
//                            style={styles.endButton}
//                            onPress={() => handleEndBooking(item.id)}
//                         >
//                            <Text style={styles.endButtonText}>End Booking</Text>
//                         </TouchableOpacity>
//                      )}
//                   </TouchableOpacity>
//                )}
//             />
//          )}

//          {/* Booking Details Modal */}
//          <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => {
//                setModalVisible(false);
//             }}
//          >
//             <View style={styles.modalContainer}>
//                <View style={styles.modalContent}>
//                   <View style={styles.modalHeader}>
//                      <Text style={styles.modalTitle}>Booking Details</Text>
//                      <TouchableOpacity
//                         style={styles.closeButton}
//                         onPress={() => setModalVisible(false)}
//                      >
//                         <Ionicons name="close" size={24} color="#333" />
//                      </TouchableOpacity>
//                   </View>

//                   {selectedBooking && (
//                      <View style={styles.modalBody}>
//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>Location</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Zone:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.zone_name || "Unknown"}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Slot:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.slot_name ||
//                                     `#${selectedBooking.slot_id}`}
//                               </Text>
//                            </View>
//                         </View>

//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>Time</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Start Time:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  {formatDate(selectedBooking.start_time)}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Expected End:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  {formatDate(
//                                     selectedBooking.estimated_end_time
//                                  )}
//                               </Text>
//                            </View>
//                            {selectedBooking.actual_end_time && (
//                               <View style={styles.detailItem}>
//                                  <Text style={styles.detailLabel}>
//                                     Actual End:
//                                  </Text>
//                                  <Text style={styles.detailValue}>
//                                     {formatDate(
//                                        selectedBooking.actual_end_time
//                                     )}
//                                  </Text>
//                               </View>
//                            )}
//                         </View>

//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>Payment</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Base Amount:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  $
//                                  {selectedBooking.total_amount -
//                                     (selectedBooking.additional_charges || 0)}
//                               </Text>
//                            </View>
//                            {selectedBooking.additional_charges > 0 && (
//                               <View style={styles.detailItem}>
//                                  <Text style={styles.detailLabel}>
//                                     Extra Charges:
//                                  </Text>
//                                  <Text style={styles.detailValue}>
//                                     ${selectedBooking.additional_charges}
//                                  </Text>
//                               </View>
//                            )}
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Total Amount:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  ${selectedBooking.total_amount}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Payment Method:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.payment_method ||
//                                     "Not specified"}
//                               </Text>
//                            </View>
//                         </View>

//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>User</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Name:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.user_name || "Unknown"}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>ID:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.user_id}
//                               </Text>
//                            </View>
//                         </View>

//                         {!selectedBooking.actual_end_time && (
//                            <TouchableOpacity
//                               style={styles.modalEndButton}
//                               onPress={() =>
//                                  handleEndBooking(selectedBooking.id)
//                               }
//                            >
//                               <Text style={styles.modalEndButtonText}>
//                                  End Booking
//                               </Text>
//                            </TouchableOpacity>
//                         )}
//                      </View>
//                   )}
//                </View>
//             </View>
//          </Modal>
//       </View>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//    },
//    filterContainer: {
//       flexDirection: "row",
//       padding: 16,
//    },
//    filterButton: {
//       paddingVertical: 8,
//       paddingHorizontal: 16,
//       borderRadius: 20,
//       marginRight: 8,
//       backgroundColor: "#e0e0e0",
//    },
//    activeFilter: {
//       backgroundColor: "#3498db",
//    },
//    filterText: {
//       color: "#333",
//    },
//    activeFilterText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    centerContent: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    errorText: {
//       color: "red",
//       fontSize: 16,
//    },
//    loadingText: {
//       marginTop: 8,
//       color: "#666",
//    },
//    emptyText: {
//       marginTop: 8,
//       color: "#666",
//       fontSize: 16,
//    },
//    bookingCard: {
//       backgroundColor: "white",
//       margin: 8,
//       marginHorizontal: 16,
//       borderRadius: 8,
//       padding: 16,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 2,
//    },
//    bookingHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 12,
//    },
//    slotName: {
//       fontSize: 16,
//       fontWeight: "bold",
//    },
//    statusContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    status: {
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 4,
//       fontSize: 12,
//       fontWeight: "500",
//    },
//    statusActive: {
//       backgroundColor: "#e3f2fd",
//       color: "#1976d2",
//    },
//    statusCompleted: {
//       backgroundColor: "#e8f5e9",
//       color: "#388e3c",
//    },
//    bookingDetails: {
//       marginBottom: 12,
//    },
//    detailRow: {
//       flexDirection: "row",
//       alignItems: "center",
//       marginBottom: 6,
//    },
//    detailText: {
//       marginLeft: 8,
//       color: "#555",
//    },
//    totalAmount: {
//       fontWeight: "bold",
//       marginTop: 8,
//    },
//    endButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 10,
//       borderRadius: 4,
//       alignItems: "center",
//    },
//    endButtonText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    // Modal styles
//    modalContainer: {
//       flex: 1,
//       justifyContent: "flex-end",
//       backgroundColor: "rgba(0,0,0,0.5)",
//    },
//    modalContent: {
//       backgroundColor: "white",
//       borderTopLeftRadius: 20,
//       borderTopRightRadius: 20,
//       height: "80%",
//    },
//    modalHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: 16,
//       borderBottomWidth: 1,
//       borderBottomColor: "#e0e0e0",
//    },
//    modalTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//    },
//    closeButton: {
//       padding: 4,
//    },
//    modalBody: {
//       padding: 16,
//    },
//    detailSection: {
//       marginBottom: 20,
//    },
//    sectionTitle: {
//       fontSize: 16,
//       fontWeight: "bold",
//       marginBottom: 8,
//       color: "#3498db",
//    },
//    detailItem: {
//       flexDirection: "row",
//       paddingVertical: 6,
//       paddingHorizontal: 4,
//    },
//    detailLabel: {
//       flex: 1,
//       fontWeight: "500",
//       color: "#666",
//    },
//    detailValue: {
//       flex: 2,
//       color: "#333",
//    },
//    modalEndButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: "center",
//       marginTop: 16,
//    },
//    modalEndButtonText: {
//       color: "white",
//       fontWeight: "bold",
//    },
// });

// export default BookingsScreen;
// import React, { useState } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    FlatList,
//    TouchableOpacity,
//    Alert,
//    ActivityIndicator,
//    Modal,
// } from "react-native";
// import { supabaseClient } from "../../app/lib/supabase";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Ionicons } from "@expo/vector-icons";

// // Define booking type
// type Booking = {
//    id: number;
//    created_at: string;
//    zone_id: string;
//    start_time: string;
//    user_id: number;
//    vehicle_id: string;
//    slot_id: number;
//    estimated_end_time: string;
//    actual_end_time: string | null;
//    total_amount: number;
//    additional_charges: number;
//    payment_method: string;
//    manager_id: number | null;
//    // Nested data
//    parking_slots?: {
//       id: number;
//       name: string;
//       price_per_hour: number;
//    };
//    users?: {
//       id: number;
//       full_name: string;
//       email: string;
//       phone: string;
//    };
//    parkingzones?: {
//       id: string;
//       name: string;
//    };
//    // Transformed data for easier access
//    slot_name?: string;
//    user_name?: string;
//    zone_name?: string;
// };

// type BookingsScreenProps = {
//    managerId: number;
// };

// const BookingsScreen = ({ managerId }: BookingsScreenProps) => {
//    const [filter, setFilter] = useState<"active" | "all">("all"); // Default to "all" as requested
//    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//    const [modalVisible, setModalVisible] = useState(false);
//    const queryClient = useQueryClient();

//    // Fetch all bookings directly
//    const fetchBookings = async () => {
//       console.log("Fetching all bookings");

//       let query = supabaseClient.from("bookings").select(`
//             *,
//             parking_slots(id, name, price_per_hour),
//             users(id, full_name, email),
//             parkingzones(id, name)
//          `);

//       if (filter === "active") {
//          query = query.is("actual_end_time", null);
//       }

//       const { data, error } = await query.order("created_at", {
//          ascending: false,
//       });

//       if (error) {
//          console.error("Error fetching bookings:", error);
//          throw new Error(error.message);
//       }

//       console.log(`Found ${data?.length || 0} bookings`);

//       // Transform the data to get slot name and user name
//       return (
//          data?.map((booking) => ({
//             ...booking,
//             slot_name:
//                booking.parking_slots?.name || `Slot #${booking.slot_id}`,
//             user_name: booking.users?.full_name || `User #${booking.user_id}`,
//             zone_name: booking.parkingzones?.name || `Zone #${booking.zone_id}`,
//          })) || []
//       );
//    };

//    const {
//       data: bookings,
//       isLoading: bookingsLoading,
//       error: bookingsError,
//       refetch: refetchBookings,
//    } = useQuery({
//       queryKey: ["bookings", filter],
//       queryFn: fetchBookings,
//    });

//    // End a booking
//    const endBookingMutation = useMutation({
//       mutationFn: async (bookingId: number) => {
//          // Find the booking to get details
//          const booking = bookings?.find((b) => b.id === bookingId);

//          if (!booking) throw new Error("Booking not found");

//          const now = new Date();
//          const estimatedEnd = new Date(booking.estimated_end_time);
//          let additionalCharges = 0;

//          // If current time is after estimated end time, calculate overstay charges
//          if (now > estimatedEnd) {
//             const overtimeHours = Math.ceil(
//                (now.getTime() - estimatedEnd.getTime()) / (1000 * 60 * 60)
//             );
//             // Get price_per_hour from the related slot
//             const pricePerHour = booking.parking_slots?.price_per_hour || 0;
//             additionalCharges = overtimeHours * pricePerHour;
//          }

//          console.log(
//             "Ending booking:",
//             bookingId,
//             "with additional charges:",
//             additionalCharges
//          );

//          // Update the booking record
//          const { data, error } = await supabaseClient
//             .from("bookings")
//             .update({
//                actual_end_time: now.toISOString(),
//                additional_charges: additionalCharges,
//                manager_id: managerId,
//                total_amount: (booking.total_amount || 0) + additionalCharges,
//             })
//             .eq("id", bookingId)
//             .select();

//          if (error) {
//             console.error("Error ending booking:", error);
//             throw new Error(error.message);
//          }

//          // Also update the slot status to available
//          const slotUpdateResult = await supabaseClient
//             .from("parking_slots")
//             .update({ status: "available" })
//             .eq("id", booking.slot_id);

//          if (slotUpdateResult.error) {
//             console.error(
//                "Error updating slot status:",
//                slotUpdateResult.error
//             );
//          }

//          return data;
//       },
//       onSuccess: () => {
//          queryClient.invalidateQueries({ queryKey: ["bookings"] });
//          setModalVisible(false);
//          setSelectedBooking(null);
//          Alert.alert("Success", "Booking ended successfully");
//       },
//       onError: (error: any) => {
//          console.error("Mutation error:", error);
//          Alert.alert("Error", error.message);
//       },
//    });

//    const handleEndBooking = (bookingId: number) => {
//       Alert.alert("End Booking", "Are you sure you want to end this booking?", [
//          { text: "Cancel", style: "cancel" },
//          {
//             text: "End Booking",
//             style: "destructive",
//             onPress: () => endBookingMutation.mutate(bookingId),
//          },
//       ]);
//    };

//    const openBookingDetails = (booking: Booking) => {
//       setSelectedBooking(booking);
//       setModalVisible(true);
//    };

//    // Format date function
//    const formatDate = (dateString: string) => {
//       const date = new Date(dateString);
//       return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//    };

//    // Add a retry button for development/debugging
//    const handleRetry = () => {
//       refetchBookings();
//    };

//    return (
//       <View style={styles.container}>
//          <View style={styles.filterContainer}>
//             <TouchableOpacity
//                style={[
//                   styles.filterButton,
//                   filter === "active" && styles.activeFilter,
//                ]}
//                onPress={() => setFilter("active")}
//             >
//                <Text
//                   style={
//                      filter === "active"
//                         ? styles.activeFilterText
//                         : styles.filterText
//                   }
//                >
//                   Active Bookings
//                </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//                style={[
//                   styles.filterButton,
//                   filter === "all" && styles.activeFilter,
//                ]}
//                onPress={() => setFilter("all")}
//             >
//                <Text
//                   style={
//                      filter === "all"
//                         ? styles.activeFilterText
//                         : styles.filterText
//                   }
//                >
//                   All Bookings
//                </Text>
//             </TouchableOpacity>
//          </View>

//          {bookingsLoading ? (
//             <View style={styles.centerContent}>
//                <ActivityIndicator size="large" color="#3498db" />
//                <Text style={styles.loadingText}>Loading bookings...</Text>
//             </View>
//          ) : bookingsError ? (
//             <View style={styles.centerContent}>
//                <Text style={styles.errorText}>Error loading bookings</Text>
//                <Text style={styles.errorDetails}>
//                   {bookingsError.toString()}
//                </Text>
//                <TouchableOpacity
//                   style={styles.retryButton}
//                   onPress={handleRetry}
//                >
//                   <Text style={styles.retryButtonText}>Retry</Text>
//                </TouchableOpacity>
//             </View>
//          ) : bookings?.length === 0 ? (
//             <View style={styles.centerContent}>
//                <Ionicons name="calendar-outline" size={64} color="#ccc" />
//                <Text style={styles.emptyText}>
//                   No {filter === "active" ? "active " : ""}bookings found
//                </Text>
//                {filter === "active" && (
//                   <TouchableOpacity
//                      style={styles.viewAllButton}
//                      onPress={() => setFilter("all")}
//                   >
//                      <Text style={styles.viewAllButtonText}>
//                         View All Bookings
//                      </Text>
//                   </TouchableOpacity>
//                )}
//             </View>
//          ) : (
//             <FlatList
//                data={bookings}
//                keyExtractor={(item) => item.id?.toString() || item.created_at}
//                renderItem={({ item }) => (
//                   <TouchableOpacity
//                      style={styles.bookingCard}
//                      onPress={() => openBookingDetails(item)}
//                   >
//                      <View style={styles.bookingHeader}>
//                         <Text style={styles.slotName}>
//                            {item.slot_name || `Slot #${item.slot_id}`}
//                         </Text>
//                         <View style={styles.statusContainer}>
//                            <Text
//                               style={[
//                                  styles.status,
//                                  item.actual_end_time
//                                     ? styles.statusCompleted
//                                     : styles.statusActive,
//                               ]}
//                            >
//                               {item.actual_end_time ? "Completed" : "Active"}
//                            </Text>
//                         </View>
//                      </View>

//                      <View style={styles.bookingDetails}>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name="person-outline"
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               {item.user_name || `User #${item.user_id}`}
//                            </Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name="time-outline"
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               {new Date(item.start_time).toLocaleTimeString()} -
//                               {item.actual_end_time
//                                  ? new Date(
//                                       item.actual_end_time
//                                    ).toLocaleTimeString()
//                                  : new Date(
//                                       item.estimated_end_time
//                                    ).toLocaleTimeString() + " (Est.)"}
//                            </Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name="cash-outline"
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               ${item.total_amount}
//                               {item.additional_charges > 0
//                                  ? ` (+ $${item.additional_charges} extra)`
//                                  : ""}
//                            </Text>
//                         </View>
//                      </View>

//                      {!item.actual_end_time && (
//                         <TouchableOpacity
//                            style={styles.endButton}
//                            onPress={() => handleEndBooking(item.id)}
//                         >
//                            <Text style={styles.endButtonText}>End Booking</Text>
//                         </TouchableOpacity>
//                      )}
//                   </TouchableOpacity>
//                )}
//             />
//          )}

//          {/* Booking Details Modal */}
//          <Modal
//             animationType="slide"
//             transparent={true}
//             visible={modalVisible}
//             onRequestClose={() => {
//                setModalVisible(false);
//             }}
//          >
//             <View style={styles.modalContainer}>
//                <View style={styles.modalContent}>
//                   <View style={styles.modalHeader}>
//                      <Text style={styles.modalTitle}>Booking Details</Text>
//                      <TouchableOpacity
//                         style={styles.closeButton}
//                         onPress={() => setModalVisible(false)}
//                      >
//                         <Ionicons name="close" size={24} color="#333" />
//                      </TouchableOpacity>
//                   </View>

//                   {selectedBooking && (
//                      <View style={styles.modalBody}>
//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>Location</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Zone:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.zone_name || "Unknown"}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Slot:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.slot_name ||
//                                     `#${selectedBooking.slot_id}`}
//                               </Text>
//                            </View>
//                         </View>

//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>Time</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Start Time:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  {formatDate(selectedBooking.start_time)}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Expected End:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  {formatDate(
//                                     selectedBooking.estimated_end_time
//                                  )}
//                               </Text>
//                            </View>
//                            {selectedBooking.actual_end_time && (
//                               <View style={styles.detailItem}>
//                                  <Text style={styles.detailLabel}>
//                                     Actual End:
//                                  </Text>
//                                  <Text style={styles.detailValue}>
//                                     {formatDate(
//                                        selectedBooking.actual_end_time
//                                     )}
//                                  </Text>
//                               </View>
//                            )}
//                         </View>

//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>Payment</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Base Amount:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  $
//                                  {selectedBooking.total_amount -
//                                     (selectedBooking.additional_charges || 0)}
//                               </Text>
//                            </View>
//                            {selectedBooking.additional_charges > 0 && (
//                               <View style={styles.detailItem}>
//                                  <Text style={styles.detailLabel}>
//                                     Extra Charges:
//                                  </Text>
//                                  <Text style={styles.detailValue}>
//                                     ${selectedBooking.additional_charges}
//                                  </Text>
//                               </View>
//                            )}
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Total Amount:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  ${selectedBooking.total_amount}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>
//                                  Payment Method:
//                               </Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.payment_method ||
//                                     "Not specified"}
//                               </Text>
//                            </View>
//                         </View>

//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>User</Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Name:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.user_name || "Unknown"}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>ID:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedBooking.user_id}
//                               </Text>
//                            </View>
//                         </View>

//                         {!selectedBooking.actual_end_time && (
//                            <TouchableOpacity
//                               style={styles.modalEndButton}
//                               onPress={() =>
//                                  handleEndBooking(selectedBooking.id)
//                               }
//                            >
//                               <Text style={styles.modalEndButtonText}>
//                                  End Booking
//                               </Text>
//                            </TouchableOpacity>
//                         )}
//                      </View>
//                   )}
//                </View>
//             </View>
//          </Modal>
//       </View>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//    },
//    filterContainer: {
//       flexDirection: "row",
//       padding: 16,
//    },
//    filterButton: {
//       paddingVertical: 8,
//       paddingHorizontal: 16,
//       borderRadius: 20,
//       marginRight: 8,
//       backgroundColor: "#e0e0e0",
//    },
//    activeFilter: {
//       backgroundColor: "#3498db",
//    },
//    filterText: {
//       color: "#333",
//    },
//    activeFilterText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    centerContent: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       paddingHorizontal: 24,
//    },
//    errorText: {
//       color: "red",
//       fontSize: 16,
//       marginBottom: 8,
//    },
//    errorDetails: {
//       color: "#666",
//       textAlign: "center",
//       marginBottom: 16,
//    },
//    loadingText: {
//       marginTop: 8,
//       color: "#666",
//    },
//    emptyText: {
//       marginTop: 8,
//       color: "#666",
//       fontSize: 16,
//       textAlign: "center",
//    },
//    retryButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 8,
//       paddingHorizontal: 16,
//       borderRadius: 4,
//       marginTop: 16,
//    },
//    retryButtonText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    viewAllButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 8,
//       paddingHorizontal: 16,
//       borderRadius: 4,
//       marginTop: 16,
//    },
//    viewAllButtonText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    bookingCard: {
//       backgroundColor: "white",
//       margin: 8,
//       marginHorizontal: 16,
//       borderRadius: 8,
//       padding: 16,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 2,
//    },
//    bookingHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 12,
//    },
//    slotName: {
//       fontSize: 16,
//       fontWeight: "bold",
//    },
//    statusContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    status: {
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 4,
//       fontSize: 12,
//       fontWeight: "500",
//    },
//    statusActive: {
//       backgroundColor: "#e3f2fd",
//       color: "#1976d2",
//    },
//    statusCompleted: {
//       backgroundColor: "#e8f5e9",
//       color: "#388e3c",
//    },
//    bookingDetails: {
//       marginBottom: 12,
//    },
//    detailRow: {
//       flexDirection: "row",
//       alignItems: "center",
//       marginBottom: 6,
//    },
//    detailText: {
//       marginLeft: 8,
//       color: "#555",
//    },
//    totalAmount: {
//       fontWeight: "bold",
//       marginTop: 8,
//    },
//    endButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 10,
//       borderRadius: 4,
//       alignItems: "center",
//    },
//    endButtonText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    // Modal styles
//    modalContainer: {
//       flex: 1,
//       justifyContent: "flex-end",
//       backgroundColor: "rgba(0,0,0,0.5)",
//    },
//    modalContent: {
//       backgroundColor: "white",
//       borderTopLeftRadius: 20,
//       borderTopRightRadius: 20,
//       height: "80%",
//    },
//    modalHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: 16,
//       borderBottomWidth: 1,
//       borderBottomColor: "#e0e0e0",
//    },
//    modalTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//    },
//    closeButton: {
//       padding: 4,
//    },
//    modalBody: {
//       padding: 16,
//    },
//    detailSection: {
//       marginBottom: 20,
//    },
//    sectionTitle: {
//       fontSize: 16,
//       fontWeight: "bold",
//       marginBottom: 8,
//       color: "#3498db",
//    },
//    detailItem: {
//       flexDirection: "row",
//       paddingVertical: 6,
//       paddingHorizontal: 4,
//    },
//    detailLabel: {
//       flex: 1,
//       fontWeight: "500",
//       color: "#666",
//    },
//    detailValue: {
//       flex: 2,
//       color: "#333",
//    },
//    modalEndButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: "center",
//       marginTop: 16,
//    },
//    modalEndButtonText: {
//       color: "white",
//       fontWeight: "bold",
//    },
// });

// export default BookingsScreen;

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

// Define booking type - updated to match actual schema
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

   // Fetch all bookings directly
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

   // End a booking - Fixed to use a composite key with slot_id and user_id instead of id
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
      setSelectedBooking(booking);
      setModalVisible(true);
   };

   // Format date function
   const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
                     filter === "active"
                        ? styles.activeFilterText
                        : styles.filterText
                  }
               >
                  Active Bookings
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={[
                  styles.filterButton,
                  filter === "all" && styles.activeFilter,
               ]}
               onPress={() => setFilter("all")}
            >
               <Text
                  style={
                     filter === "all"
                        ? styles.activeFilterText
                        : styles.filterText
                  }
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
               <Text style={styles.errorDetails}>
                  {bookingsError.toString()}
               </Text>
               <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetry}
               >
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
                     <Text style={styles.viewAllButtonText}>
                        View All Bookings
                     </Text>
                  </TouchableOpacity>
               )}
            </View>
         ) : (
            <FlatList
               data={bookings}
               keyExtractor={(item) =>
                  `${item.slot_id}-${item.user_id}-${item.created_at}`
               }
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
                           <Ionicons
                              name="person-outline"
                              size={16}
                              color="#666"
                           />
                           <Text style={styles.detailText}>
                              {item.user_name || `User #${item.user_id}`}
                           </Text>
                        </View>
                        <View style={styles.detailRow}>
                           <Ionicons
                              name="time-outline"
                              size={16}
                              color="#666"
                           />
                           <Text style={styles.detailText}>
                              {new Date(item.start_time).toLocaleTimeString()} -
                              {item.actual_end_time
                                 ? new Date(
                                      item.actual_end_time
                                   ).toLocaleTimeString()
                                 : new Date(
                                      item.estimated_end_time
                                   ).toLocaleTimeString() + " (Est.)"}
                           </Text>
                        </View>
                        <View style={styles.detailRow}>
                           <Ionicons
                              name="cash-outline"
                              size={16}
                              color="#666"
                           />
                           <Text style={styles.detailText}>
                              ${item.total_amount}
                              {item.additional_charges > 0
                                 ? ` (+ $${item.additional_charges} extra)`
                                 : ""}
                           </Text>
                        </View>
                     </View>

                     {/* {!item.actual_end_time && (
                        <TouchableOpacity
                           style={styles.endButton}
                           onPress={() => handleEndBooking(item)}
                        >
                           <Text style={styles.endButtonText}>End Booking</Text>
                        </TouchableOpacity>
                     )} */}
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
                              <Text style={styles.detailLabel}>
                                 Start Time:
                              </Text>
                              <Text style={styles.detailValue}>
                                 {formatDate(selectedBooking.start_time)}
                              </Text>
                           </View>
                           <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>
                                 Expected End:
                              </Text>
                              <Text style={styles.detailValue}>
                                 {formatDate(
                                    selectedBooking.estimated_end_time
                                 )}
                              </Text>
                           </View>
                           {selectedBooking.actual_end_time && (
                              <View style={styles.detailItem}>
                                 <Text style={styles.detailLabel}>
                                    Actual End:
                                 </Text>
                                 <Text style={styles.detailValue}>
                                    {formatDate(
                                       selectedBooking.actual_end_time
                                    )}
                                 </Text>
                              </View>
                           )}
                        </View>

                        <View style={styles.detailSection}>
                           <Text style={styles.sectionTitle}>Payment</Text>
                           <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>
                                 Base Amount:
                              </Text>
                              <Text style={styles.detailValue}>
                                 $
                                 {selectedBooking.total_amount -
                                    (selectedBooking.additional_charges || 0)}
                              </Text>
                           </View>
                           {selectedBooking.additional_charges > 0 && (
                              <View style={styles.detailItem}>
                                 <Text style={styles.detailLabel}>
                                    Extra Charges:
                                 </Text>
                                 <Text style={styles.detailValue}>
                                    ${selectedBooking.additional_charges}
                                 </Text>
                              </View>
                           )}
                           <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>
                                 Total Amount:
                              </Text>
                              <Text style={styles.detailValue}>
                                 ${selectedBooking.total_amount}
                              </Text>
                           </View>
                           <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>
                                 Payment Method:
                              </Text>
                              <Text style={styles.detailValue}>
                                 {selectedBooking.payment_method ||
                                    "Not specified"}
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
                              style={styles.modalEndButton}
                              onPress={() => handleEndBooking(selectedBooking)}
                           >
                              <Text style={styles.modalEndButtonText}>
                                 End Booking
                              </Text>
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
      backgroundColor: "#f5f5f5",
   },
   filterContainer: {
      flexDirection: "row",
      padding: 16,
   },
   filterButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 8,
      backgroundColor: "#e0e0e0",
   },
   activeFilter: {
      backgroundColor: "#3498db",
   },
   filterText: {
      color: "#333",
   },
   activeFilterText: {
      color: "white",
      fontWeight: "500",
   },
   centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
   },
   errorText: {
      color: "red",
      fontSize: 16,
      marginBottom: 8,
   },
   errorDetails: {
      color: "#666",
      textAlign: "center",
      marginBottom: 16,
   },
   loadingText: {
      marginTop: 8,
      color: "#666",
   },
   emptyText: {
      marginTop: 8,
      color: "#666",
      fontSize: 16,
      textAlign: "center",
   },
   retryButton: {
      backgroundColor: "#3498db",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      marginTop: 16,
   },
   retryButtonText: {
      color: "white",
      fontWeight: "500",
   },
   viewAllButton: {
      backgroundColor: "#3498db",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      marginTop: 16,
   },
   viewAllButtonText: {
      color: "white",
      fontWeight: "500",
   },
   bookingCard: {
      backgroundColor: "white",
      margin: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   bookingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
   },
   slotName: {
      fontSize: 16,
      fontWeight: "bold",
   },
   statusContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   status: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      fontSize: 12,
      fontWeight: "500",
   },
   statusActive: {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
   },
   statusCompleted: {
      backgroundColor: "#e8f5e9",
      color: "#388e3c",
   },
   bookingDetails: {
      marginBottom: 12,
   },
   detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 6,
   },
   detailText: {
      marginLeft: 8,
      color: "#555",
   },
   totalAmount: {
      fontWeight: "bold",
      marginTop: 8,
   },
   endButton: {
      backgroundColor: "#3498db",
      paddingVertical: 10,
      borderRadius: 4,
      alignItems: "center",
   },
   endButtonText: {
      color: "white",
      fontWeight: "500",
   },
   // Modal styles
   modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
   },
   modalContent: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "80%",
   },
   modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
   },
   modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
   },
   closeButton: {
      padding: 4,
   },
   modalBody: {
      padding: 16,
   },
   detailSection: {
      marginBottom: 20,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      color: "#3498db",
   },
   detailItem: {
      flexDirection: "row",
      paddingVertical: 6,
      paddingHorizontal: 4,
   },
   detailLabel: {
      flex: 1,
      fontWeight: "500",
      color: "#666",
   },
   detailValue: {
      flex: 2,
      color: "#333",
   },
   modalEndButton: {
      backgroundColor: "#3498db",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 16,
   },
   modalEndButtonText: {
      color: "white",
      fontWeight: "bold",
   },
});

export default BookingsScreen;
