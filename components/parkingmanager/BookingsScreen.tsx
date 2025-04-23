
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
               <ActivityIndicator size="large" color="#2589cc" />
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
                           <View style={styles.statusIndicator}>
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
                     </View>

                     <View style={styles.bookingDetails}>
                        <View style={styles.detailRow}>
                           <Ionicons
                              name="person-outline"
                              size={16}
                              color="#2589cc"
                           />
                           <Text style={styles.detailText}>
                              {item.user_name || `User #${item.user_id}`}
                           </Text>
                        </View>
                        <View style={styles.detailRow}>
                           <Ionicons
                              name="time-outline"
                              size={16}
                              color="#2589cc"
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
                              color="#2589cc"
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
      backgroundColor: "#f8f9fa",
   },
   filterContainer: {
      flexDirection: "row",
      padding: 16,
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderBottomColor: "#eeeeee",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
   },
   filterButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 25,
      marginRight: 10,
      backgroundColor: "#f0f0f0",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
   },
   activeFilter: {
      backgroundColor: "#2589cc",
   },
   filterText: {
      color: "#666",
      fontWeight: "500",
   },
   activeFilterText: {
      color: "white",
      fontWeight: "600",
   },
   centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
   },
   errorText: {
      color: "#e74c3c",
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10,
   },
   errorDetails: {
      color: "#666",
      textAlign: "center",
      marginBottom: 20,
      maxWidth: "80%",
   },
   loadingText: {
      marginTop: 12,
      color: "#666",
      fontSize: 16,
   },
   emptyText: {
      marginTop: 16,
      color: "#666",
      fontSize: 18,
      fontWeight: "500",
      textAlign: "center",
   },
   retryButton: {
      backgroundColor: "#2589cc",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 20,
   },
   retryButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
   },
   viewAllButton: {
      backgroundColor: "#2589cc",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 20,
   },
   viewAllButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
   },
   bookingCard: {
      backgroundColor: "white",
      margin: 10,
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
   },
   bookingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   slotName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
   },
   statusContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   statusIndicator: {
      borderRadius: 6,
      overflow: "hidden",
   },
   status: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.3,
   },
   statusActive: {
      backgroundColor: "#e1f5fe",
      color: "#0277bd",
   },
   statusCompleted: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
   },
   bookingDetails: {
      marginBottom: 14,
      backgroundColor: "#fafafa",
      padding: 12,
      borderRadius: 8,
   },
   detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
   },
   detailText: {
      marginLeft: 10,
      color: "#444",
      fontSize: 14,
   },
   totalAmount: {
      fontWeight: "bold",
      marginTop: 10,
      fontSize: 16,
   },
   endButton: {
      backgroundColor: "#2589cc",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
   },
   endButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 16,
   },
   // Modal styles
   modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.6)",
   },
   modalContent: {
      backgroundColor: "white",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: "85%",
      overflow: "hidden",
   },
   modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: "#eeeeee",
      backgroundColor: "#2589cc",
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
   },
   closeButton: {
      padding: 6,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 20,
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
   },
   modalBody: {
      padding: 20,
   },
   detailSection: {
      marginBottom: 22,
      backgroundColor: "#fafafa",
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      color: "#2589cc",
      borderBottomWidth: 1,
      borderBottomColor: "#eeeeee",
      paddingBottom: 8,
   },
   detailItem: {
      flexDirection: "row",
      paddingVertical: 8,
      paddingHorizontal: 4,
   },
   detailLabel: {
      flex: 1,
      fontWeight: "600",
      color: "#555",
      fontSize: 15,
   },
   detailValue: {
      flex: 2,
      color: "#333",
      fontSize: 15,
   },
   modalEndButton: {
      backgroundColor: "#2589cc",
      paddingVertical: 16,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   modalEndButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
   },
});

export default BookingsScreen;


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
//    SafeAreaView,
//    StatusBar,
// } from "react-native";
// import { supabaseClient } from "../../app/lib/supabase";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Ionicons } from "@expo/vector-icons";

// // Define booking type - unchanged
// type Booking = {
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

//    // Fetch all bookings directly - unchanged
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

//    // End a booking - unchanged
//    const endBookingMutation = useMutation({
//       mutationFn: async (bookingData: {
//          slotId: number;
//          userId: number;
//          createdAt: string;
//       }) => {
//          // Find the booking to get details
//          const booking = bookings?.find(
//             (b) =>
//                b.slot_id === bookingData.slotId &&
//                b.user_id === bookingData.userId &&
//                b.created_at === bookingData.createdAt
//          );

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
//             "Ending booking for slot:",
//             bookingData.slotId,
//             "user:",
//             bookingData.userId,
//             "with additional charges:",
//             additionalCharges
//          );

//          // Update the booking record using composite key
//          const { data, error } = await supabaseClient
//             .from("bookings")
//             .update({
//                actual_end_time: now.toISOString(),
//                additional_charges: additionalCharges,
//                manager_id: managerId,
//                total_amount: (booking.total_amount || 0) + additionalCharges,
//             })
//             .eq("slot_id", bookingData.slotId)
//             .eq("user_id", bookingData.userId)
//             .eq("created_at", bookingData.createdAt)
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

//    const handleEndBooking = (booking: Booking) => {
//       Alert.alert("End Booking", "Are you sure you want to end this booking?", [
//          { text: "Cancel", style: "cancel" },
//          {
//             text: "End Booking",
//             style: "destructive",
//             onPress: () =>
//                endBookingMutation.mutate({
//                   slotId: booking.slot_id,
//                   userId: booking.user_id,
//                   createdAt: booking.created_at,
//                }),
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

//    const getStatusStyles = (status: "active" | "completed") => {
//       if (status === "active") {
//          return {
//             container: styles.statusActiveContainer,
//             text: styles.statusActiveText,
//             dotColor: "#4ADE80",
//          };
//       } else {
//          return {
//             container: styles.statusCompletedContainer,
//             text: styles.statusCompletedText,
//             dotColor: "#A3A3A3",
//          };
//       }
//    };

//    return (
//       <SafeAreaView style={styles.safeArea}>
//          <StatusBar backgroundColor="#5D5FEF" barStyle="light-content" />
//          <View style={styles.container}>
//             <View style={styles.headerContainer}>
//                <Text style={styles.headerTitle}>Bookings</Text>
//             </View>

//             <View style={styles.filterContainer}>
//                <TouchableOpacity
//                   style={[
//                      styles.filterButton,
//                      filter === "active" && styles.activeFilter,
//                   ]}
//                   onPress={() => setFilter("active")}
//                >
//                   <Text
//                      style={
//                         filter === "active"
//                            ? styles.activeFilterText
//                            : styles.filterText
//                      }
//                   >
//                      Active Bookings
//                   </Text>
//                </TouchableOpacity>
//                <TouchableOpacity
//                   style={[
//                      styles.filterButton,
//                      filter === "all" && styles.activeFilter,
//                   ]}
//                   onPress={() => setFilter("all")}
//                >
//                   <Text
//                      style={
//                         filter === "all"
//                            ? styles.activeFilterText
//                            : styles.filterText
//                      }
//                   >
//                      All Bookings
//                   </Text>
//                </TouchableOpacity>
//             </View>

//             {bookingsLoading ? (
//                <View style={styles.centerContent}>
//                   <ActivityIndicator size="large" color="#5D5FEF" />
//                   <Text style={styles.loadingText}>Loading bookings...</Text>
//                </View>
//             ) : bookingsError ? (
//                <View style={styles.centerContent}>
//                   <Ionicons name="alert-circle" size={56} color="#EF4444" />
//                   <Text style={styles.errorText}>Error loading bookings</Text>
//                   <Text style={styles.errorDetails}>
//                      {bookingsError.toString()}
//                   </Text>
//                   <TouchableOpacity
//                      style={styles.retryButton}
//                      onPress={handleRetry}
//                   >
//                      <Text style={styles.retryButtonText}>Retry</Text>
//                   </TouchableOpacity>
//                </View>
//             ) : bookings?.length === 0 ? (
//                <View style={styles.centerContent}>
//                   <Ionicons 
//                      name="calendar-outline" 
//                      size={80} 
//                      color="#D1D5DB" 
//                   />
//                   <Text style={styles.emptyText}>
//                      No {filter === "active" ? "active " : ""}bookings found
//                   </Text>
//                   {filter === "active" && (
//                      <TouchableOpacity
//                         style={styles.viewAllButton}
//                         onPress={() => setFilter("all")}
//                      >
//                         <Text style={styles.viewAllButtonText}>
//                            View All Bookings
//                         </Text>
//                      </TouchableOpacity>
//                   )}
//                </View>
//             ) : (
//                <FlatList
//                   data={bookings}
//                   keyExtractor={(item) =>
//                      `${item.slot_id}-${item.user_id}-${item.created_at}`
//                   }
//                   contentContainerStyle={styles.listContainer}
//                   renderItem={({ item }) => (
//                      <TouchableOpacity
//                         style={styles.bookingCard}
//                         onPress={() => openBookingDetails(item)}
//                         activeOpacity={0.7}
//                      >
//                         <View style={styles.bookingHeader}>
//                            <View style={styles.slotContainer}>
//                               <Text style={styles.zoneLabel}>
//                                  {item.zone_name || `Zone ${item.zone_id}`}
//                               </Text>
//                               <Text style={styles.slotName}>
//                                  {item.slot_name || `Slot #${item.slot_id}`}
//                               </Text>
//                            </View>
                           
//                            <View style={styles.statusContainer}>
//                               <View 
//                                  style={
//                                     item.actual_end_time 
//                                        ? getStatusStyles("completed").container 
//                                        : getStatusStyles("active").container
//                                  }
//                               >
//                                  <View style={[
//                                     styles.statusDot, 
//                                     { backgroundColor: item.actual_end_time ? 
//                                        getStatusStyles("completed").dotColor : 
//                                        getStatusStyles("active").dotColor 
//                                     }
//                                  ]} />
//                                  <Text 
//                                     style={
//                                        item.actual_end_time 
//                                           ? getStatusStyles("completed").text 
//                                           : getStatusStyles("active").text
//                                     }
//                                  >
//                                     {item.actual_end_time ? "Completed" : "Active"}
//                                  </Text>
//                               </View>
//                            </View>
//                         </View>

//                         <View style={styles.bookingDetails}>
//                            <View style={styles.detailRow}>
//                               <Ionicons
//                                  name="person"
//                                  size={18}
//                                  color="#5D5FEF"
//                               />
//                               <Text style={styles.detailText}>
//                                  {item.user_name || `User #${item.user_id}`}
//                               </Text>
//                            </View>
//                            <View style={styles.detailRow}>
//                               <Ionicons
//                                  name="time"
//                                  size={18}
//                                  color="#5D5FEF"
//                               />
//                               <Text style={styles.detailText}>
//                                  {new Date(item.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} -{" "}
//                                  {item.actual_end_time
//                                     ? new Date(item.actual_end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
//                                     : new Date(item.estimated_end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " (Est.)"}
//                               </Text>
//                            </View>
//                            <View style={styles.detailRow}>
//                               <Ionicons
//                                  name="cash"
//                                  size={18}
//                                  color="#5D5FEF"
//                               />
//                               <Text style={styles.detailText}>
//                                  ${item.total_amount}
//                                  {item.additional_charges > 0
//                                     ? ` (+ $${item.additional_charges} extra)`
//                                     : ""}
//                               </Text>
//                            </View>
//                         </View>

//                         {/* Chevron icon to indicate the card is clickable */}
//                         <View style={styles.chevronContainer}>
//                            <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
//                         </View>
//                      </TouchableOpacity>
//                   )}
//                />
//             )}

//             {/* Booking Details Modal */}
//             <Modal
//                animationType="slide"
//                transparent={true}
//                visible={modalVisible}
//                onRequestClose={() => {
//                   setModalVisible(false);
//                }}
//             >
//                <View style={styles.modalContainer}>
//                   <View style={styles.modalContent}>
//                      <View style={styles.modalHeader}>
//                         <Text style={styles.modalTitle}>Booking Details</Text>
//                         <TouchableOpacity
//                            style={styles.closeButton}
//                            onPress={() => setModalVisible(false)}
//                         >
//                            <Ionicons name="close" size={24} color="white" />
//                         </TouchableOpacity>
//                      </View>

//                      {selectedBooking && (
//                         <View style={styles.modalBody}>
//                            <View style={styles.modalStatusBanner}>
//                               <View 
//                                  style={[
//                                     styles.statusIndicatorLarge,
//                                     { backgroundColor: selectedBooking.actual_end_time ? "#E5E7EB" : "#DCFCE7" }
//                                  ]}
//                               >
//                                  <Ionicons 
//                                     name={selectedBooking.actual_end_time ? "checkmark-circle" : "time"} 
//                                     size={24} 
//                                     color={selectedBooking.actual_end_time ? "#6B7280" : "#22C55E"} 
//                                  />
//                                  <Text 
//                                     style={[
//                                        styles.statusTextLarge,
//                                        { color: selectedBooking.actual_end_time ? "#6B7280" : "#166534" }
//                                     ]}
//                                  >
//                                     {selectedBooking.actual_end_time ? "Completed" : "Active"}
//                                  </Text>
//                               </View>
//                            </View>

//                            <View style={styles.detailSection}>
//                               <Text style={styles.sectionTitle}>Location</Text>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="location" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Zone</Text>
//                                     <Text style={styles.detailValue}>
//                                        {selectedBooking.zone_name || "Unknown"}
//                                     </Text>
//                                  </View>
//                               </View>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="car" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Slot</Text>
//                                     <Text style={styles.detailValue}>
//                                        {selectedBooking.slot_name ||
//                                           `#${selectedBooking.slot_id}`}
//                                     </Text>
//                                  </View>
//                               </View>
//                            </View>

//                            <View style={styles.detailSection}>
//                               <Text style={styles.sectionTitle}>Time</Text>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="play-circle" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Start Time</Text>
//                                     <Text style={styles.detailValue}>
//                                        {formatDate(selectedBooking.start_time)}
//                                     </Text>
//                                  </View>
//                               </View>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="timer-outline" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Expected End</Text>
//                                     <Text style={styles.detailValue}>
//                                        {formatDate(
//                                           selectedBooking.estimated_end_time
//                                        )}
//                                     </Text>
//                                  </View>
//                               </View>
//                               {selectedBooking.actual_end_time && (
//                                  <View style={styles.detailItem}>
//                                     <View style={styles.detailIconContainer}>
//                                        <Ionicons name="stop-circle" size={20} color="#5D5FEF" />
//                                     </View>
//                                     <View>
//                                        <Text style={styles.detailLabelModal}>Actual End</Text>
//                                        <Text style={styles.detailValue}>
//                                           {formatDate(
//                                              selectedBooking.actual_end_time
//                                           )}
//                                        </Text>
//                                     </View>
//                                  </View>
//                               )}
//                            </View>

//                            <View style={styles.detailSection}>
//                               <Text style={styles.sectionTitle}>Payment</Text>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="pricetag" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Base Amount</Text>
//                                     <Text style={styles.detailValue}>
//                                        $
//                                        {selectedBooking.total_amount -
//                                           (selectedBooking.additional_charges || 0)}
//                                     </Text>
//                                  </View>
//                               </View>
//                               {selectedBooking.additional_charges > 0 && (
//                                  <View style={styles.detailItem}>
//                                     <View style={styles.detailIconContainer}>
//                                        <Ionicons name="add-circle" size={20} color="#5D5FEF" />
//                                     </View>
//                                     <View>
//                                        <Text style={styles.detailLabelModal}>Extra Charges</Text>
//                                        <Text style={styles.detailValue}>
//                                           ${selectedBooking.additional_charges}
//                                        </Text>
//                                     </View>
//                                  </View>
//                               )}
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="cash" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Total Amount</Text>
//                                     <Text style={styles.detailValueBold}>
//                                        ${selectedBooking.total_amount}
//                                     </Text>
//                                  </View>
//                               </View>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="card" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Payment Method</Text>
//                                     <Text style={styles.detailValue}>
//                                        {selectedBooking.payment_method ||
//                                           "Not specified"}
//                                     </Text>
//                                  </View>
//                               </View>
//                            </View>

//                            <View style={styles.detailSection}>
//                               <Text style={styles.sectionTitle}>User</Text>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="person" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>Name</Text>
//                                     <Text style={styles.detailValue}>
//                                        {selectedBooking.user_name || "Unknown"}
//                                     </Text>
//                                  </View>
//                               </View>
//                               <View style={styles.detailItem}>
//                                  <View style={styles.detailIconContainer}>
//                                     <Ionicons name="id-card" size={20} color="#5D5FEF" />
//                                  </View>
//                                  <View>
//                                     <Text style={styles.detailLabelModal}>ID</Text>
//                                     <Text style={styles.detailValue}>
//                                        {selectedBooking.user_id}
//                                     </Text>
//                                  </View>
//                               </View>
//                            </View>

//                            {!selectedBooking.actual_end_time && (
//                               <TouchableOpacity
//                                  style={styles.modalEndButton}
//                                  onPress={() => handleEndBooking(selectedBooking)}
//                               >
//                                  <Ionicons name="checkmark-circle" size={20} color="white" style={styles.buttonIcon} />
//                                  <Text style={styles.modalEndButtonText}>
//                                     End Booking
//                                  </Text>
//                               </TouchableOpacity>
//                            )}
//                         </View>
//                      )}
//                   </View>
//                </View>
//             </Modal>
//          </View>
//       </SafeAreaView>
//    );
// };

// const styles = StyleSheet.create({
//    safeArea: {
//       flex: 1,
//       backgroundColor: "#5D5FEF",
//    },
//    container: {
//       flex: 1,
//       backgroundColor: "#F9FAFB",
//    },
//    headerContainer: {
//       backgroundColor: "#5D5FEF",
//       paddingHorizontal: 20,
//       paddingVertical: 16,
//       borderBottomLeftRadius: 16,
//       borderBottomRightRadius: 16,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.15,
//       shadowRadius: 10,
//       elevation: 5,
//    },
//    headerTitle: {
//       fontSize: 24,
//       fontWeight: "bold",
//       color: "white",
//    },
//    filterContainer: {
//       flexDirection: "row",
//       padding: 16,
//       backgroundColor: "white",
//       borderRadius: 12,
//       margin: 16,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.08,
//       shadowRadius: 4,
//       elevation: 2,
//    },
//    filterButton: {
//       flex: 1,
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: "center",
//       justifyContent: "center",
//    },
//    activeFilter: {
//       backgroundColor: "#3B82F6",
//    },
//    filterText: {
//       color: "#6B7280",
//       fontWeight: "600",
//       fontSize: 14,
//    },
//    activeFilterText: {
//       color: "white",
//       fontWeight: "600",
//       fontSize: 14,
//    },
//    centerContent: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       paddingHorizontal: 24,
//    },
//    errorText: {
//       color: "#EF4444",
//       fontSize: 18,
//       fontWeight: "600",
//       marginTop: 16,
//       marginBottom: 8,
//    },
//    errorDetails: {
//       color: "#6B7280",
//       textAlign: "center",
//       marginBottom: 20,
//       maxWidth: "80%",
//    },
//    loadingText: {
//       marginTop: 16,
//       color: "#6B7280",
//       fontSize: 16,
//       fontWeight: "500",
//    },
//    emptyText: {
//       marginTop: 16,
//       color: "#6B7280",
//       fontSize: 18,
//       fontWeight: "500",
//       textAlign: "center",
//    },
//    retryButton: {
//       backgroundColor: "#3B82F6",
//       paddingVertical: 12,
//       paddingHorizontal: 24,
//       borderRadius: 8,
//       marginTop: 20,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 2,
//    },
//    retryButtonText: {
//       color: "white",
//       fontWeight: "600",
//       fontSize: 16,
//    },
//    viewAllButton: {
//       backgroundColor: "#3B82F6",
//       paddingVertical: 12,
//       paddingHorizontal: 24,
//       borderRadius: 8,
//       marginTop: 20,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 2,  
//    },
//    viewAllButtonText: {
//       color: "white",
//       fontWeight: "600",
//       fontSize: 16,
//    },
//    listContainer: {
//       paddingBottom: 16,
//    },
//    bookingCard: {
//       backgroundColor: "white",
//       marginHorizontal: 16,
//       marginTop: 12,
//       borderRadius: 16,
//       padding: 16,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.08,
//       shadowRadius: 8,
//       elevation: 2,
//       position: "relative",
//    },
//    bookingHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 16,
//    },
//    slotContainer: {
//       flex: 1,
//    },
//    zoneLabel: {
//       fontSize: 13,
//       color: "#6B7280",
//       marginBottom: 4,
//    },
//    slotName: {
//       fontSize: 18,
//       fontWeight: "bold",
//       color: "#111827",
//    },
//    statusContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    statusActiveContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "#ECFDF5",
//       paddingVertical: 6,
//       paddingHorizontal: 10,
//       borderRadius: 16,
//    },
//    statusCompletedContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "#F3F4F6",
//       paddingVertical: 6,
//       paddingHorizontal: 10,
//       borderRadius: 16,
//    },
//    statusDot: {
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       marginRight: 6,
//    },
//    statusActiveText: {
//       fontSize: 12,
//       fontWeight: "600",
//       color: "#065F46",
//    },
//    statusCompletedText: {
//       fontSize: 12,
//       fontWeight: "600",
//       color: "#6B7280",
//    },
//    bookingDetails: {
//       backgroundColor: "#F9FAFB",
//       padding: 14,
//       borderRadius: 12,
//       marginBottom: 6,
//    },
//    detailRow: {
//       flexDirection: "row",
//       alignItems: "center",
//       marginBottom: 12,
//    },
//    detailText: {
//       marginLeft: 12,
//       color: "#4B5563",
//       fontSize: 14,
//       fontWeight: "500",
//    },
//    chevronContainer: {
//       position: "absolute",
//       right: 16,
//       top: "50%",
//       transform: [{ translateY: -10 }],
//    },
//    modalContainer: {
//       flex: 1,
//       justifyContent: "flex-end",
//       backgroundColor: "rgba(0,0,0,0.5)",
//    },
//    modalContent: {
//       backgroundColor: "white",
//       borderTopLeftRadius: 24,
//       borderTopRightRadius: 24,
//       maxHeight: "90%",
//    },
//    modalHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: 20,
//       backgroundColor: "#5D5FEF",
//       borderTopLeftRadius: 24,
//       borderTopRightRadius: 24,
//    },
//    modalTitle: {
//             fontSize: 20,
//             fontWeight: "bold",
//             color: "white",
//          },
//          closeButton: {
//             padding: 6,
//             backgroundColor: "rgba(255,255,255,0.2)",
//             borderRadius: 20,
//             width: 36,
//             height: 36,
//             alignItems: "center",
//             justifyContent: "center",
//          },
//          modalBody: {
//             padding: 20,
//          },
//          detailSection: {
//             marginBottom: 22,
//             backgroundColor: "#fafafa",
//             padding: 16,
//             borderRadius: 12,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.03,
//             shadowRadius: 2,
//             elevation: 1,
//          },
//          sectionTitle: {
//             fontSize: 18,
//             fontWeight: "bold",
//             marginBottom: 12,
//             color: "#2589cc",
//             borderBottomWidth: 1,
//             borderBottomColor: "#eeeeee",
//             paddingBottom: 8,
//          },
//          detailItem: {
//             flexDirection: "row",
//             paddingVertical: 8,
//             paddingHorizontal: 4,
//          },
//          detailLabel: {
//             flex: 1,
//             fontWeight: "600",
//             color: "#555",
//             fontSize: 15,
//          },
//          detailValue: {
//             flex: 2,
//             color: "#333",
//             fontSize: 15,
//          },
//          modalEndButton: {
//             backgroundColor: "#2589cc",
//             paddingVertical: 16,
//             borderRadius: 10,
//             alignItems: "center",
//             marginTop: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//             elevation: 3,
//          },
//          modalEndButtonText: {
//             color: "white",
//             fontWeight: "bold",
//             fontSize: 16,
//          },
//       });
      
//       export default BookingsScreen;