
// import React, { useState, useEffect } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    FlatList,
//    TouchableOpacity,
//    Alert,
//    ActivityIndicator,
//    Modal,
//    TextInput,
//    RefreshControl,
// } from "react-native";
// import { supabaseClient } from "../../app/lib/supabase";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Ionicons } from "@expo/vector-icons";

// // Define types
// type ParkingSlot = {
//    id: number;
//    name: string;
//    status: "available" | "occupied" | "under review" | null;
//    vehicle_type: string | null;
//    price_per_hour: number | null;
//    section_id: number;
// };

// type ParkingSlotScreenProps = {
//    userId?: number; // Optional user ID for booking
//    isManager?: boolean; // Add a prop to determine if user is a manager
// };

// const ParkingSlotScreen = ({ userId, isManager = true }: ParkingSlotScreenProps) => {
//    const [statusFilter, setStatusFilter] = useState<
//       "all" | "available" | "occupied" | "under review"
//    >("all");
//    const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
//    const [modalVisible, setModalVisible] = useState(false);
//    const [vehicleInfo, setVehicleInfo] = useState("");
//    const queryClient = useQueryClient();

//    // Fetch all parking slots
//    const fetchParkingSlots = async () => {
//       let query = supabaseClient.from("parking_slots").select("*");

//       // Apply status filter if not "all"
//       if (statusFilter !== "all") {
//          query = query.eq("status", statusFilter);
//       }

//       const { data, error } = await query;

//       if (error) throw new Error(error.message);
      
//       // Ensure all slots have a valid status
//       return (data || []).map(slot => ({
//          ...slot,
//          status: slot.status || 'unknown'
//       }));
//    };

//    const {
//       data: parkingSlots,
//       isLoading,
//       error,
//       refetch,
//    } = useQuery({
//       queryKey: ["parkingSlots", statusFilter],
//       queryFn: fetchParkingSlots,
//    });

//    // Book a parking slot (change status to occupied)
//    const bookSlotMutation = useMutation({
//       mutationFn: async ({
//          slotId,
//          vehicleInfo,
//       }: {
//          slotId: number;
//          vehicleInfo: string;
//       }) => {
//          const { data, error } = await supabaseClient
//             .from("parking_slots")
//             .update({
//                status: "occupied",
//                vehicle_type: vehicleInfo,
//                updated_at: new Date().toISOString(),
//             })
//             .eq("id", slotId)
//             .select();

//          if (error) throw new Error(error.message);
//          return data;
//       },
//       onSuccess: () => {
//          queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
//          setModalVisible(false);
//          setSelectedSlot(null);
//          setVehicleInfo("");
//          Alert.alert("Success", "Parking slot booked successfully");
//       },
//       onError: (error: any) => {
//          Alert.alert("Error", error.message);
//       },
//    });

//    // Release a parking slot (change status back to available)
//    const releaseSlotMutation = useMutation({
//       mutationFn: async (slotId: number) => {
//          const { data, error } = await supabaseClient
//             .from("parking_slots")
//             .update({
//                status: "available",
//                vehicle_type: null, // Clear vehicle info
//                updated_at: new Date().toISOString(),
//             })
//             .eq("id", slotId)
//             .select();

//          if (error) throw new Error(error.message);
//          return data;
//       },
//       onSuccess: () => {
//          queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
//          setModalVisible(false);
//          setSelectedSlot(null);
//          Alert.alert("Success", "Parking slot released successfully");
//       },
//       onError: (error: any) => {
//          Alert.alert("Error", error.message);
//       },
//    });

//    const handleBookSlot = () => {
//       if (!selectedSlot) return;

//       if (!vehicleInfo.trim()) {
//          Alert.alert("Error", "Please enter vehicle information");
//          return;
//       }

//       bookSlotMutation.mutate({
//          slotId: selectedSlot.id,
//          vehicleInfo,
//       });
//    };
   
//    const handleReleaseSlot = () => {
//       if (!selectedSlot) return;
      
//       Alert.alert(
//          "Release Confirmation",
//          "Are you sure you want to mark this slot as available?",
//          [
//             {
//                text: "Cancel",
//                style: "cancel"
//             },
//             {
//                text: "Release",
//                onPress: () => releaseSlotMutation.mutate(selectedSlot.id)
//             }
//          ]
//       );
//    };

//    const openSlotDetails = (slot: ParkingSlot) => {
//       setSelectedSlot(slot);
//       setModalVisible(true);
//    };

//    const getStatusColor = (status: string | null) => {
//       if (!status) return "#9E9E9E"; // Grey for null status
      
//       switch (status) {
//          case "available":
//             return "#4CAF50"; // Green
//          case "occupied":
//             return "#F44336"; // Red
//          case "under review":
//             return "#FF9800"; // Orange
//          default:
//             return "#9E9E9E"; // Grey
//       }
//    };

//    const getStatusIcon = (status: string | null) => {
//       if (!status) return "help-circle-outline"; // Default icon for null status
      
//       switch (status) {
//          case "available":
//             return "checkmark-circle-outline";
//          case "occupied":
//             return "close-circle-outline";
//          case "under review":
//             return "alert-circle-outline";
//          default:
//             return "help-circle-outline";
//       }
//    };

//    // Check if slot is bookable (i.e., available)
//    const isSlotBookable = (slot: ParkingSlot) => {
//       return slot.status === "available";
//    };

//    // Format status text with capitalization
//    const formatStatus = (status: string | null) => {
//       if (!status) return "Unknown";
//       return status.charAt(0).toUpperCase() + status.slice(1);
//    };

//    return (
//       <View style={styles.container}>
//          {/* Status Filter */}
//          <View style={styles.filterContainer}>
//             <ScrollableChips
//                options={[
//                   { label: "All Slots", value: "all" },
//                   { label: "Available", value: "available" },
//                   { label: "Occupied", value: "occupied" },
//                   { label: "Under Review", value: "under review" },
//                ]}
//                selectedValue={statusFilter}
//                onSelect={(value) => setStatusFilter(value)}
//             />
//          </View>

//          {isLoading ? (
//             <View style={styles.centerContent}>
//                <ActivityIndicator size="large" color="#3498db" />
//                <Text style={styles.loadingText}>Loading parking slots...</Text>
//             </View>
//          ) : error ? (
//             <View style={styles.centerContent}>
//                <Text style={styles.errorText}>Error loading parking slots</Text>
//             </View>
//          ) : !parkingSlots || parkingSlots.length === 0 ? (
//             <View style={styles.centerContent}>
//                <Ionicons name="car-outline" size={64} color="#ccc" />
//                <Text style={styles.emptyText}>No parking slots found</Text>
//                {statusFilter !== "all" && (
//                   <TouchableOpacity onPress={() => setStatusFilter("all")}>
//                      <Text style={styles.viewAllText}>View all slots</Text>
//                   </TouchableOpacity>
//                )}
//             </View>
//          ) : (
//             <FlatList
//                data={parkingSlots}
//                keyExtractor={(item) => item.id.toString()}
//                refreshControl={
//                   <RefreshControl
//                      refreshing={isLoading}
//                      onRefresh={refetch}
//                      colors={["#3498db"]}
//                   />
//                }
//                renderItem={({ item }) => (
//                   <TouchableOpacity
//                      style={styles.slotCard}
//                      onPress={() => openSlotDetails(item)}
//                   >
//                      <View style={styles.slotHeader}>
//                         <Text style={styles.slotName}>
//                            {item.name || `Slot #${item.id}`}
//                         </Text>
//                         <View
//                            style={[
//                               styles.statusIndicator,
//                               { backgroundColor: getStatusColor(item.status) },
//                            ]}
//                         />
//                      </View>

//                      <View style={styles.slotDetails}>
//                         <View style={styles.detailRow}>
//                            <Ionicons
//                               name={getStatusIcon(item.status)}
//                               size={16}
//                               color="#666"
//                            />
//                            <Text style={styles.detailText}>
//                               {formatStatus(item.status)}
//                            </Text>
//                         </View>
//                         {item.vehicle_type && (
//                            <View style={styles.detailRow}>
//                               <Ionicons
//                                  name="car-outline"
//                                  size={16}
//                                  color="#666"
//                               />
//                               <Text style={styles.detailText}>
//                                  {item.vehicle_type}
//                               </Text>
//                            </View>
//                         )}
//                         {item.price_per_hour && (
//                            <View style={styles.detailRow}>
//                               <Ionicons
//                                  name="cash-outline"
//                                  size={16}
//                                  color="#666"
//                               />
//                               <Text style={styles.detailText}>
//                                  ${item.price_per_hour}/hour
//                               </Text>
//                            </View>
//                         )}
//                      </View>

//                      {isSlotBookable(item) && (
//                         <TouchableOpacity
//                            style={styles.bookButton}
//                            onPress={() => openSlotDetails(item)}
//                         >
//                            <Text style={styles.bookButtonText}>
//                               Book This Slot
//                            </Text>
//                         </TouchableOpacity>
//                      )}
//                   </TouchableOpacity>
//                )}
//             />
//          )}

//          {/* Slot Booking Modal */}
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
//                      <Text style={styles.modalTitle}>
//                         {selectedSlot?.status === "available"
//                            ? "Book Parking Slot"
//                            : "Parking Slot Details"}
//                      </Text>
//                      <TouchableOpacity
//                         style={styles.closeButton}
//                         onPress={() => setModalVisible(false)}
//                      >
//                         <Ionicons name="close" size={24} color="#333" />
//                      </TouchableOpacity>
//                   </View>

//                   {selectedSlot && (
//                      <View style={styles.modalBody}>
//                         <View style={styles.detailSection}>
//                            <Text style={styles.sectionTitle}>
//                               Slot Information
//                            </Text>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Slot Name:</Text>
//                               <Text style={styles.detailValue}>
//                                  {selectedSlot.name ||
//                                     `Slot #${selectedSlot.id}`}
//                               </Text>
//                            </View>
//                            <View style={styles.detailItem}>
//                               <Text style={styles.detailLabel}>Status:</Text>
//                               <View style={styles.statusContainer}>
//                                  <View
//                                     style={[
//                                        styles.statusDot,
//                                        {
//                                           backgroundColor: getStatusColor(
//                                              selectedSlot.status
//                                           ),
//                                        },
//                                     ]}
//                                  />
//                                  <Text style={styles.detailValue}>
//                                     {formatStatus(selectedSlot.status)}
//                                  </Text>
//                               </View>
//                            </View>
//                            {selectedSlot.price_per_hour && (
//                               <View style={styles.detailItem}>
//                                  <Text style={styles.detailLabel}>
//                                     Price Per Hour:
//                                  </Text>
//                                  <Text style={styles.detailValue}>
//                                     ${selectedSlot.price_per_hour}
//                                  </Text>
//                               </View>
//                            )}
//                            {selectedSlot.vehicle_type && (
//                               <View style={styles.detailItem}>
//                                  <Text style={styles.detailLabel}>
//                                     Vehicle Info:
//                                  </Text>
//                                  <Text style={styles.detailValue}>
//                                     {selectedSlot.vehicle_type}
//                                  </Text>
//                               </View>
//                            )}
//                         </View>

//                         {/* Booking form if slot is available */}
//                         {isSlotBookable(selectedSlot) && (
//                            <View style={styles.bookingSection}>
//                               <Text style={styles.sectionTitle}>
//                                  Book This Slot
//                               </Text>
//                               <View style={styles.inputGroup}>
//                                  <Text style={styles.inputLabel}>
//                                     Vehicle Information
//                                  </Text>
//                                  <TextInput
//                                     style={styles.input}
//                                     value={vehicleInfo}
//                                     onChangeText={setVehicleInfo}
//                                     placeholder="Enter vehicle model, license plate, etc."
//                                  />
//                               </View>

//                               <TouchableOpacity
//                                  style={styles.bookConfirmButton}
//                                  onPress={handleBookSlot}
//                                  disabled={bookSlotMutation.isPending}
//                               >
//                                  {bookSlotMutation.isPending ? (
//                                     <ActivityIndicator
//                                        size="small"
//                                        color="white"
//                                     />
//                                  ) : (
//                                     <Text style={styles.bookConfirmButtonText}>
//                                        Confirm Booking
//                                     </Text>
//                                  )}
//                               </TouchableOpacity>
//                            </View>
//                         )}

//                         {/* Release button for occupied slots (for managers only) */}
//                         {isManager && selectedSlot.status === "occupied" && (
//                            <View style={styles.releaseSection}>
//                               <Text style={styles.sectionTitle}>
//                                  Management Actions
//                               </Text>
//                               <TouchableOpacity
//                                  style={styles.releaseButton}
//                                  onPress={handleReleaseSlot}
//                                  disabled={releaseSlotMutation.isPending}
//                               >
//                                  {releaseSlotMutation.isPending ? (
//                                     <ActivityIndicator
//                                        size="small"
//                                        color="white"
//                                     />
//                                  ) : (
//                                     <Text style={styles.releaseButtonText}>
//                                        Release Slot
//                                     </Text>
//                                  )}
//                               </TouchableOpacity>
//                               <Text style={styles.releaseNote}>
//                                  This will mark the parking slot as available and clear vehicle information.
//                               </Text>
//                            </View>
//                         )}

//                         {/* Information for non-available slots */}
//                         {!isSlotBookable(selectedSlot) && !isManager && (
//                            <View style={styles.unavailableMessage}>
//                               <Ionicons
//                                  name={
//                                     selectedSlot.status === "occupied"
//                                        ? "information-circle"
//                                        : "alert-circle"
//                                  }
//                                  size={24}
//                                  color={getStatusColor(selectedSlot.status)}
//                               />
//                               <Text style={styles.unavailableText}>
//                                  {selectedSlot.status === "occupied"
//                                     ? "This slot is currently occupied."
//                                     : selectedSlot.status === "under review"
//                                     ? "This slot is under review and not available for booking."
//                                     : "This slot is not available for booking."}
//                               </Text>
//                            </View>
//                         )}
//                      </View>
//                   )}
//                </View>
//             </View>
//          </Modal>
//       </View>
//    );
// };

// // ScrollableChips component
// const ScrollableChips = ({
//    options,
//    selectedValue,
//    onSelect,
// }: {
//    options: Array<{ label: string; value: string }>;
//    selectedValue: string;
//    onSelect: (value: any) => void;
// }) => {
//    return (
//       <View style={styles.chipsContainer}>
//          <FlatList
//             horizontal
//             data={options}
//             keyExtractor={(item) => item.value}
//             showsHorizontalScrollIndicator={false}
//             renderItem={({ item }) => (
//                <TouchableOpacity
//                   style={[
//                      styles.chip,
//                      selectedValue === item.value && styles.selectedChip,
//                   ]}
//                   onPress={() => onSelect(item.value)}
//                >
//                   <Text
//                      style={[
//                         styles.chipText,
//                         selectedValue === item.value && styles.selectedChipText,
//                      ]}
//                   >
//                      {item.label}
//                   </Text>
//                </TouchableOpacity>
//             )}
//          />
//       </View>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//    },
//    filterContainer: {
//       paddingVertical: 12,
//       paddingHorizontal: 16,
//       backgroundColor: "white",
//       borderBottomWidth: 1,
//       borderBottomColor: "#e0e0e0",
//    },
//    chipsContainer: {
//       marginBottom: 8,
//    },
//    chip: {
//       paddingVertical: 8,
//       paddingHorizontal: 16,
//       borderRadius: 20,
//       marginRight: 8,
//       backgroundColor: "#e0e0e0",
//    },
//    selectedChip: {
//       backgroundColor: "#3498db",
//    },
//    chipText: {
//       color: "#333",
//    },
//    selectedChipText: {
//       color: "white",
//       fontWeight: "500",
//    },
//    centerContent: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    errorText: {
//       color: "red",
//       fontSize: 16,
//       textAlign: "center",
//       marginTop: 8,
//    },
//    loadingText: {
//       marginTop: 8,
//       color: "#666",
//       fontSize: 14,
//    },
//    emptyText: {
//       marginTop: 8,
//       color: "#666",
//       fontSize: 16,
//       textAlign: "center",
//    },
//    viewAllText: {
//       marginTop: 12,
//       color: "#3498db",
//       fontSize: 14,
//       textDecorationLine: "underline",
//    },
//    slotCard: {
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
//    slotHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 12,
//    },
//    slotName: {
//       fontSize: 16,
//       fontWeight: "bold",
//    },
//    statusIndicator: {
//       width: 12,
//       height: 12,
//       borderRadius: 6,
//    },
//    slotDetails: {
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
//    bookButton: {
//       backgroundColor: "#4CAF50",
//       paddingVertical: 10,
//       borderRadius: 4,
//       alignItems: "center",
//    },
//    bookButtonText: {
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
//       maxHeight: "80%",
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
//    bookingSection: {
//       marginTop: 8,
//       paddingTop: 16,
//       borderTopWidth: 1,
//       borderTopColor: "#e0e0e0",
//    },
//    releaseSection: {
//       marginTop: 8,
//       paddingTop: 16,
//       borderTopWidth: 1,
//       borderTopColor: "#e0e0e0",
//    },
//    sectionTitle: {
//       fontSize: 16,
//       fontWeight: "bold",
//       marginBottom: 12,
//       color: "#333",
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
//    statusContainer: {
//       flex: 2,
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    statusDot: {
//       width: 10,
//       height: 10,
//       borderRadius: 5,
//       marginRight: 8,
//    },
//    inputGroup: {
//       marginBottom: 16,
//    },
//    inputLabel: {
//       fontSize: 14,
//       fontWeight: "500",
//       color: "#333",
//       marginBottom: 6,
//    },
//    input: {
//       backgroundColor: "#f5f5f5",
//       paddingVertical: 10,
//       paddingHorizontal: 12,
//       borderRadius: 4,
//       borderWidth: 1,
//       borderColor: "#e0e0e0",
//    },
//    bookConfirmButton: {
//       backgroundColor: "#4CAF50",
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: "center",
//       marginTop: 8,
//    },
//    bookConfirmButtonText: {
//       color: "white",
//       fontWeight: "bold",
//    },
//    releaseButton: {
//       backgroundColor: "#3498db",
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: "center",
//       marginTop: 8,
//    },
//    releaseButtonText: {
//       color: "white",
//       fontWeight: "bold",
//    },
//    releaseNote: {
//       marginTop: 8,
//       fontSize: 12,
//       color: "#666",
//       fontStyle: "italic",
//    },
//    unavailableMessage: {
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "#f8f8f8",
//       padding: 16,
//       borderRadius: 8,
//       marginTop: 16,
//    },
//    unavailableText: {
//       marginLeft: 8,
//       color: "#555",
//       flex: 1,
//    },
// });

// export default ParkingSlotScreen;



import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   TouchableOpacity,
   Alert,
   ActivityIndicator,
   Modal,
   TextInput,
   RefreshControl,
} from "react-native";
import { supabaseClient } from "../../app/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

// Define types
type ParkingSlot = {
   id: number;
   name: string;
   status: "available" | "occupied" | "under review" | null;
   vehicle_type: string | null;
   price_per_hour: number | null;
   section_id: number;
};

type ParkingSlotScreenProps = {
   userId?: number; // Optional user ID for booking
   isManager?: boolean; // Add a prop to determine if user is a manager
};

const ParkingSlotScreen = ({ userId, isManager = true }: ParkingSlotScreenProps) => {
   const [statusFilter, setStatusFilter] = useState<
      "all" | "available" | "occupied" | "under review"
   >("all");
   const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
   const [modalVisible, setModalVisible] = useState(false);
   const [vehicleInfo, setVehicleInfo] = useState("");
   const queryClient = useQueryClient();

   // Fetch all parking slots
   const fetchParkingSlots = async () => {
      let query = supabaseClient.from("parking_slots").select("*");

      // Apply status filter if not "all"
      if (statusFilter !== "all") {
         query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);
      
      // Ensure all slots have a valid status
      return (data || []).map(slot => ({
         ...slot,
         status: slot.status || 'unknown'
      }));
   };

   const {
      data: parkingSlots,
      isLoading,
      error,
      refetch,
   } = useQuery({
      queryKey: ["parkingSlots", statusFilter],
      queryFn: fetchParkingSlots,
   });

   // Book a parking slot (change status to occupied)
   const bookSlotMutation = useMutation({
      mutationFn: async ({
         slotId,
         vehicleInfo,
      }: {
         slotId: number;
         vehicleInfo: string;
      }) => {
         const { data, error } = await supabaseClient
            .from("parking_slots")
            .update({
               status: "occupied",
               vehicle_type: vehicleInfo,
               updated_at: new Date().toISOString(),
            })
            .eq("id", slotId)
            .select();

         if (error) throw new Error(error.message);
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
         setModalVisible(false);
         setSelectedSlot(null);
         setVehicleInfo("");
         Alert.alert("Success", "Parking slot booked successfully");
      },
      onError: (error: any) => {
         Alert.alert("Error", error.message);
      },
   });

   // Release a parking slot (change status back to available)
   const releaseSlotMutation = useMutation({
      mutationFn: async (slotId: number) => {
         const { data, error } = await supabaseClient
            .from("parking_slots")
            .update({
               status: "available",
               vehicle_type: null, // Clear vehicle info
               updated_at: new Date().toISOString(),
            })
            .eq("id", slotId)
            .select();

         if (error) throw new Error(error.message);
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
         setModalVisible(false);
         setSelectedSlot(null);
         Alert.alert("Success", "Parking slot released successfully");
      },
      onError: (error: any) => {
         Alert.alert("Error", error.message);
      },
   });

   const handleBookSlot = () => {
      if (!selectedSlot) return;

      if (!vehicleInfo.trim()) {
         Alert.alert("Error", "Please enter vehicle information");
         return;
      }

      bookSlotMutation.mutate({
         slotId: selectedSlot.id,
         vehicleInfo,
      });
   };
   
   const handleReleaseSlot = () => {
      if (!selectedSlot) return;
      
      Alert.alert(
         "Release Confirmation",
         "Are you sure you want to mark this slot as available?",
         [
            {
               text: "Cancel",
               style: "cancel"
            },
            {
               text: "Release",
               onPress: () => releaseSlotMutation.mutate(selectedSlot.id)
            }
         ]
      );
   };

   const openSlotDetails = (slot: ParkingSlot) => {
      setSelectedSlot(slot);
      setModalVisible(true);
   };

   const getStatusColor = (status: string | null) => {
      if (!status) return "#9E9E9E"; // Grey for null status
      
      switch (status) {
         case "available":
            return "#4CAF50"; // Green
         case "occupied":
            return "#F44336"; // Red
         case "under review":
            return "#FF9800"; // Orange
         default:
            return "#9E9E9E"; // Grey
      }
   };

   const getStatusIcon = (status: string | null) => {
      if (!status) return "help-circle-outline"; // Default icon for null status
      
      switch (status) {
         case "available":
            return "checkmark-circle-outline";
         case "occupied":
            return "close-circle-outline";
         case "under review":
            return "alert-circle-outline";
         default:
            return "help-circle-outline";
      }
   };

   // Check if slot is bookable (i.e., available)
   const isSlotBookable = (slot: ParkingSlot) => {
      return slot.status === "available";
   };

   // Format status text with capitalization
   const formatStatus = (status: string | null) => {
      if (!status) return "Unknown";
      return status.charAt(0).toUpperCase() + status.slice(1);
   };

   return (
      <View style={styles.container}>
         {/* Status Filter */}
         <View style={styles.filterContainer}>
            <ScrollableChips
               options={[
                  { label: "All Slots", value: "all" },
                  { label: "Available", value: "available" },
                  { label: "Occupied", value: "occupied" },
                  { label: "Under Review", value: "under review" },
               ]}
               selectedValue={statusFilter}
               onSelect={(value) => setStatusFilter(value)}
            />
         </View>

         {isLoading ? (
            <View style={styles.centerContent}>
               <ActivityIndicator size="large" color="#5D5FEF" />
               <Text style={styles.loadingText}>Loading parking slots...</Text>
            </View>
         ) : error ? (
            <View style={styles.centerContent}>
               <Text style={styles.errorText}>Error loading parking slots</Text>
            </View>
         ) : !parkingSlots || parkingSlots.length === 0 ? (
            <View style={styles.centerContent}>
               <Ionicons name="car-outline" size={72} color="#5D5FEF" opacity={0.5} />
               <Text style={styles.emptyText}>No parking slots found</Text>
               {statusFilter !== "all" && (
                  <TouchableOpacity onPress={() => setStatusFilter("all")}>
                     <Text style={styles.viewAllText}>View all slots</Text>
                  </TouchableOpacity>
               )}
            </View>
         ) : (
            <FlatList
               data={parkingSlots}
               keyExtractor={(item) => item.id.toString()}
               refreshControl={
                  <RefreshControl
                     refreshing={isLoading}
                     onRefresh={refetch}
                     colors={["#5D5FEF"]}
                  />
               }
               contentContainerStyle={styles.listContainer}
               renderItem={({ item }) => (
                  <TouchableOpacity
                     style={styles.slotCard}
                     onPress={() => openSlotDetails(item)}
                  >
                     <View style={styles.slotHeader}>
                        <Text style={styles.slotName}>
                           {item.name || `Slot #${item.id}`}
                        </Text>
                        <View
                           style={[
                              styles.statusIndicator,
                              { backgroundColor: getStatusColor(item.status) },
                           ]}
                        />
                     </View>

                     <View style={styles.slotDetails}>
                        <View style={styles.detailRow}>
                           <Ionicons
                              name={getStatusIcon(item.status)}
                              size={18}
                              color="#5D5FEF"
                           />
                           <Text style={styles.detailText}>
                              {formatStatus(item.status)}
                           </Text>
                        </View>
                        {item.vehicle_type && (
                           <View style={styles.detailRow}>
                              <Ionicons
                                 name="car-outline"
                                 size={18}
                                 color="#5D5FEF"
                              />
                              <Text style={styles.detailText}>
                                 {item.vehicle_type}
                              </Text>
                           </View>
                        )}
                        {item.price_per_hour && (
                           <View style={styles.detailRow}>
                              <Ionicons
                                 name="cash-outline"
                                 size={18}
                                 color="#5D5FEF"
                              />
                              <Text style={styles.detailText}>
                                 ${item.price_per_hour}/hour
                              </Text>
                           </View>
                        )}
                     </View>

                     {isSlotBookable(item) && (
                        <TouchableOpacity
                           style={styles.bookButton}
                           onPress={() => openSlotDetails(item)}
                        >
                           <Text style={styles.bookButtonText}>
                              Book This Slot
                           </Text>
                        </TouchableOpacity>
                     )}
                  </TouchableOpacity>
               )}
            />
         )}

         {/* Slot Booking Modal */}
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
                     <Text style={styles.modalTitle}>
                        {selectedSlot?.status === "available"
                           ? "Book Parking Slot"
                           : "Parking Slot Details"}
                     </Text>
                     <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                     >
                        <Ionicons name="close" size={24} color="#5D5FEF" />
                     </TouchableOpacity>
                  </View>

                  {selectedSlot && (
                     <View style={styles.modalBody}>
                        <View style={styles.detailSection}>
                           <Text style={styles.sectionTitle}>
                              Slot Information
                           </Text>
                           <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>Slot Name:</Text>
                              <Text style={styles.detailValue}>
                                 {selectedSlot.name ||
                                    `Slot #${selectedSlot.id}`}
                              </Text>
                           </View>
                           <View style={styles.detailItem}>
                              <Text style={styles.detailLabel}>Status:</Text>
                              <View style={styles.statusContainer}>
                                 <View
                                    style={[
                                       styles.statusDot,
                                       {
                                          backgroundColor: getStatusColor(
                                             selectedSlot.status
                                          ),
                                       },
                                    ]}
                                 />
                                 <Text style={styles.detailValue}>
                                    {formatStatus(selectedSlot.status)}
                                 </Text>
                              </View>
                           </View>
                           {selectedSlot.price_per_hour && (
                              <View style={styles.detailItem}>
                                 <Text style={styles.detailLabel}>
                                    Price Per Hour:
                                 </Text>
                                 <Text style={styles.detailValue}>
                                    ${selectedSlot.price_per_hour}
                                 </Text>
                              </View>
                           )}
                           {selectedSlot.vehicle_type && (
                              <View style={styles.detailItem}>
                                 <Text style={styles.detailLabel}>
                                    Vehicle Info:
                                 </Text>
                                 <Text style={styles.detailValue}>
                                    {selectedSlot.vehicle_type}
                                 </Text>
                              </View>
                           )}
                        </View>

                        {/* Booking form if slot is available */}
                        {isSlotBookable(selectedSlot) && (
                           <View style={styles.bookingSection}>
                              <Text style={styles.sectionTitle}>
                                 Book This Slot
                              </Text>
                              <View style={styles.inputGroup}>
                                 <Text style={styles.inputLabel}>
                                    Vehicle Information
                                 </Text>
                                 <TextInput
                                    style={styles.input}
                                    value={vehicleInfo}
                                    onChangeText={setVehicleInfo}
                                    placeholder="Enter vehicle model, license plate, etc."
                                    placeholderTextColor="#A0A0A0"
                                 />
                              </View>

                              <TouchableOpacity
                                 style={styles.bookConfirmButton}
                                 onPress={handleBookSlot}
                                 disabled={bookSlotMutation.isPending}
                              >
                                 {bookSlotMutation.isPending ? (
                                    <ActivityIndicator
                                       size="small"
                                       color="white"
                                    />
                                 ) : (
                                    <Text style={styles.bookConfirmButtonText}>
                                       Confirm Booking
                                    </Text>
                                 )}
                              </TouchableOpacity>
                           </View>
                        )}

                        {/* Release button for occupied slots (for managers only) */}
                        {isManager && selectedSlot.status === "occupied" && (
                           <View style={styles.releaseSection}>
                              <Text style={styles.sectionTitle}>
                                 Management Actions
                              </Text>
                              <TouchableOpacity
                                 style={styles.releaseButton}
                                 onPress={handleReleaseSlot}
                                 disabled={releaseSlotMutation.isPending}
                              >
                                 {releaseSlotMutation.isPending ? (
                                    <ActivityIndicator
                                       size="small"
                                       color="white"
                                    />
                                 ) : (
                                    <Text style={styles.releaseButtonText}>
                                       Release Slot
                                    </Text>
                                 )}
                              </TouchableOpacity>
                              <Text style={styles.releaseNote}>
                                 This will mark the parking slot as available and clear vehicle information.
                              </Text>
                           </View>
                        )}

                        {/* Information for non-available slots */}
                        {!isSlotBookable(selectedSlot) && !isManager && (
                           <View style={styles.unavailableMessage}>
                              <Ionicons
                                 name={
                                    selectedSlot.status === "occupied"
                                       ? "information-circle"
                                       : "alert-circle"
                                 }
                                 size={28}
                                 color={getStatusColor(selectedSlot.status)}
                              />
                              <Text style={styles.unavailableText}>
                                 {selectedSlot.status === "occupied"
                                    ? "This slot is currently occupied."
                                    : selectedSlot.status === "under review"
                                    ? "This slot is under review and not available for booking."
                                    : "This slot is not available for booking."}
                              </Text>
                           </View>
                        )}
                     </View>
                  )}
               </View>
            </View>
         </Modal>
      </View>
   );
};

// ScrollableChips component
const ScrollableChips = ({
   options,
   selectedValue,
   onSelect,
}: {
   options: Array<{ label: string; value: string }>;
   selectedValue: string;
   onSelect: (value: any) => void;
}) => {
   return (
      <View style={styles.chipsContainer}>
         <FlatList
            horizontal
            data={options}
            keyExtractor={(item) => item.value}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
               <TouchableOpacity
                  style={[
                     styles.chip,
                     selectedValue === item.value && styles.selectedChip,
                  ]}
                  onPress={() => onSelect(item.value)}
               >
                  <Text
                     style={[
                        styles.chipText,
                        selectedValue === item.value && styles.selectedChipText,
                     ]}
                  >
                     {item.label}
                  </Text>
               </TouchableOpacity>
            )}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f9fafc",
   },
   filterContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderBottomColor: "#eaeaea",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
   },
   chipsContainer: {
      marginBottom: 4,
   },
   chip: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 24,
      marginRight: 10,
      backgroundColor: "#f0f0f7",
      borderWidth: 1,
      borderColor: "#e8e8f5",
   },
   selectedChip: {
      backgroundColor: "#5D5FEF",
      borderColor: "#5D5FEF",
   },
   chipText: {
      color: "#555",
      fontWeight: "500",
      fontSize: 14,
   },
   selectedChipText: {
      color: "white",
      fontWeight: "600",
   },
   listContainer: {
      padding: 12,
   },
   centerContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   errorText: {
      color: "#F44336",
      fontSize: 16,
      textAlign: "center",
      marginTop: 12,
      fontWeight: "500",
   },
   loadingText: {
      marginTop: 12,
      color: "#666",
      fontSize: 15,
   },
   emptyText: {
      marginTop: 16,
      color: "#555",
      fontSize: 18,
      textAlign: "center",
      fontWeight: "500",
   },
   viewAllText: {
      marginTop: 14,
      color: "#3B82F6",
      fontSize: 15,
      fontWeight: "500",
      textDecorationLine: "underline",
   },
   slotCard: {
      backgroundColor: "white",
      margin: 8,
      borderRadius: 12,
      padding: 18,
      shadowColor: "#5D5FEF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: "#f0f0f7",
   },
   slotHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
   },
   slotName: {
      fontSize: 17,
      fontWeight: "700",
      color: "#333",
   },
   statusIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
   },
   slotDetails: {
      marginBottom: 16,
   },
   detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
   },
   detailText: {
      marginLeft: 10,
      color: "#444",
      fontSize: 15,
   },
   bookButton: {
      backgroundColor: "#5D5FEF",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
      shadowColor: "#5D5FEF",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
   },
   bookButtonText: {
      color: "white",
      fontWeight: "600",
      fontSize: 15,
   },
   // Modal styles
   modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
   },
   modalContent: {
      backgroundColor: "white",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 10,
   },
   modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#eaeaea",
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#333",
   },
   closeButton: {
      padding: 6,
      borderRadius: 20,
      backgroundColor: "#f5f5f7",
   },
   modalBody: {
      padding: 20,
   },
   detailSection: {
      marginBottom: 24,
      backgroundColor: "#f9fafc",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#eaeaea",
   },
   bookingSection: {
      marginTop: 8,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: "#eaeaea",
   },
   releaseSection: {
      marginTop: 8,
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: "#eaeaea",
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 16,
      color: "#333",
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
   statusContainer: {
      flex: 2,
      flexDirection: "row",
      alignItems: "center",
   },
   statusDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 10,
   },
   inputGroup: {
      marginBottom: 20,
   },
   inputLabel: {
      fontSize: 15,
      fontWeight: "600",
      color: "#333",
      marginBottom: 8,
   },
   input: {
      backgroundColor: "#f5f5f7",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#e0e0e8",
      fontSize: 15,
      color: "#333",
   },
   bookConfirmButton: {
      backgroundColor: "#5D5FEF",
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
      shadowColor: "#5D5FEF",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 4,
   },
   bookConfirmButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
   },
   releaseButton: {
      backgroundColor: "#3B82F6",
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 10,
      shadowColor: "#3B82F6",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 4,
   },
   releaseButtonText: {
      color: "white",
      fontWeight: "700",
      fontSize: 16,
   },
   releaseNote: {
      marginTop: 12,
      fontSize: 13,
      color: "#666",
      fontStyle: "italic",
      lineHeight: 18,
   },
   unavailableMessage: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f5f5f7",
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      borderWidth: 1,
      borderColor: "#e5e5e5",
   },
   unavailableText: {
      marginLeft: 12,
      color: "#555",
      flex: 1,
      fontSize: 15,
      lineHeight: 20,
   },
});

export default ParkingSlotScreen;