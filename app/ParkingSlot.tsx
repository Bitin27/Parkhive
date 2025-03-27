
// import React, { useState } from "react";
// import {
//    View,
//    Text,
//    TouchableOpacity,
//    StyleSheet,
//    ScrollView,
//    Alert,
// } from "react-native";
// import { useRouter } from "expo-router";

// const ParkingSlotSelector = () => {
//    const [selectedSlot, setSelectedSlot] = useState(null);
//    const router = useRouter();

//    // Mock data for parking slots
//    const parkingSections = {
//       A: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `A${i + 1}`, occupied: Math.random() > 0.7 })),
//       B: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `B${i + 1}`, occupied: Math.random() > 0.7 })),
//       C: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `C${i + 1}`, occupied: Math.random() > 0.7 })),
//       D: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `D${i + 1}`, occupied: Math.random() > 0.7 })),
//       E: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `E${i + 1}`, occupied: Math.random() > 0.7 })),
//    };

//    const handleSlotSelection = (slotId: any, occupied: any) => {
//       if (occupied) {
//          Alert.alert("Slot Occupied", "Please select another parking slot");
//          return;
//       }
//       setSelectedSlot(slotId);
//       Alert.alert(
//          "Confirm Selection",
//          `Do you want to park in slot ${slotId}?`,
//          [
//             {
//                text: "Cancel",
//                onPress: () => setSelectedSlot(null),
//                style: "cancel",
//             },
//             {
//                text: "Confirm",
//                onPress: () => {
//                   console.log("Parking slot confirmed:", slotId);
//                   // Navigate to ETicket page with the selected slot information using Expo Router
//                   router.push({
//                      pathname: "/Eticket",
//                      params: {
//                         slotId: slotId,
//                         bookingTime: new Date().toISOString(),
//                         // Add any other data you want to pass to the ETicket page
//                      }
//                   });
//                },
//             },
//          ]
//       );
//    };

//    const renderParkingSection = (section: any, slots : any) => (
//       <View style={styles.sectionContainer} key={section}>
//          <Text style={styles.sectionTitle}>Section {section}</Text>
//          <View style={styles.slotsContainer}>
//             {slots.map((slot : any) => (
//                <TouchableOpacity
//                   key={slot.id}
//                   style={[
//                      styles.slot,
//                      slot.occupied && styles.occupiedSlot,
//                      selectedSlot === slot.id && styles.selectedSlot,
//                   ]}
//                   onPress={() => handleSlotSelection(slot.id, slot.occupied)}
//                >
//                   <Text
//                      style={[
//                         styles.slotText,
//                         slot.occupied && styles.occupiedSlotText,
//                         selectedSlot === slot.id && styles.selectedSlotText,
//                      ]}
//                   >
//                      {slot.id}
//                   </Text>
//                </TouchableOpacity>
//             ))}
//          </View>
//       </View>
//    );

//    return (
//       <ScrollView style={styles.container}>
//          <Text style={styles.header}>Select Parking Slot</Text>
//          {Object.entries(parkingSections).map(([section, slots]) =>
//             renderParkingSection(section, slots)
//          )}
//       </ScrollView>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//    },
//    header: {
//       fontSize: 24,
//       fontWeight: "bold",
//       padding: 20,
//       textAlign: "center",
//       backgroundColor: "#fff",
//       borderBottomWidth: 1,
//       borderBottomColor: "#e0e0e0",
//    },
//    sectionContainer: {
//       marginVertical: 10,
//       paddingHorizontal: 15,
//    },
//    sectionTitle: {
//       fontSize: 18,
//       fontWeight: "600",
//       marginBottom: 10,
//       color: "#333",
//    },
//    slotsContainer: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "flex-start",
//       gap: 10,
//    },
//    slot: {
//       width: 70,
//       height: 70,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "#fff",
//       borderRadius: 8,
//       borderWidth: 1,
//       borderColor: "#ddd",
//       elevation: 2,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//    },
//    slotText: {
//       fontSize: 16,
//       fontWeight: "500",
//       color: "#333",
//    },
//    occupiedSlot: {
//       backgroundColor: "#f0f0f0",
//       borderColor: "#ccc",
//    },
//    occupiedSlotText: {
//       color: "#999",
//    },
//    selectedSlot: {
//       backgroundColor: "#007AFF",
//       borderColor: "#0055FF",
//    },
//    selectedSlotText: {
//       color: "#fff",
//    },
// });

// export default ParkingSlotSelector;


import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   ActivityIndicator,
   SafeAreaView,
   StatusBar,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../app/lib/supabase"; // Adjust path as needed
import { useLocalSearchParams, useRouter } from "expo-router"; // Using Expo Router for navigation

type ParkingSlot = {
   zone_id: string;
   zone_name: string;
   zone_address: string;
   section_id: number;
   section_name: string;
   section_description: string;
   slot_id: number;
   slot_name: string;
   slot_status: string | null;
   slot_vehicle_type: string | null;
   slot_price: number | null;
};

type Section = {
   id: number;
   name: string;
   description: string;
   slots: ParkingSlot[];
};

const ParkingZoneViewer: React.FC = () => {
   const router = useRouter();
   const { zoneId, date, arrivalTime, exitTime } = useLocalSearchParams<{
      zoneId: string;
      date: string;
      arrivalTime: string;
      exitTime: string;
   }>();

   const [selectedSection, setSelectedSection] = useState<number | null>(null);
   const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

   console.log("URL Params:", { zoneId, date, arrivalTime, exitTime });

   // Fetch parking zone details using React Query
   const { data, isLoading, error } = useQuery({
      queryKey: ["parkingZoneDetails", zoneId],
      queryFn: async () => {
         console.log("Fetching data for zone ID:", zoneId);

         const { data, error } = await supabaseClient.rpc(
            "get_parking_zone_details",
            {
               zone_id_param: zoneId,
            }
         );

         if (error) {
            console.error("Supabase RPC error:", error);
            throw error;
         }

         console.log("Fetched data:", data);
         return data as ParkingSlot[];
      },
      enabled: !!zoneId,
   });

   // Process data to group by sections
   const sections = React.useMemo(() => {
      if (!data) return [];

      const sectionMap = new Map<number, Section>();

      data.forEach((slot) => {
         if (!sectionMap.has(slot.section_id)) {
            sectionMap.set(slot.section_id, {
               id: slot.section_id,
               name: slot.section_name,
               description: slot.section_description,
               slots: [],
            });
         }

         sectionMap.get(slot.section_id)?.slots.push(slot);
      });

      return Array.from(sectionMap.values());
   }, [data]);

   // Set first section and slot as selected by default when data loads
   useEffect(() => {
      if (sections.length > 0 && selectedSection === null) {
         setSelectedSection(sections[0].id);

         if (sections[0].slots.length > 0) {
            setSelectedSlot(sections[0].slots[0].slot_id);
         }
      }
   }, [sections, selectedSection]);

   // Get currently selected slot details
   const selectedSlotDetails = React.useMemo(() => {
      if (!data || selectedSlot === null) return null;
      return data.find((slot) => slot.slot_id === selectedSlot);
   }, [data, selectedSlot]);

   const handleSlotSelect = (slotId: number) => {
      setSelectedSlot(slotId);
      console.log("Selected slot:", slotId);
   };

   const handleSectionSelect = (sectionId: number) => {
      setSelectedSection(sectionId);
      console.log("Selected section:", sectionId);

      // Select the first slot in the new section
      const sectionSlots =
         sections.find((s) => s.id === sectionId)?.slots || [];
      if (sectionSlots.length > 0) {
         setSelectedSlot(sectionSlots[0].slot_id);
      } else {
         setSelectedSlot(null);
      }
   };

   // Handle booking and navigation to next screen
   const handleBookSlot = () => {
      if (!selectedSlotDetails) return;

      // Navigate to booking confirmation page with all required parameters
      router.push({
         pathname: "/BookingSummary",
         params: {
            zoneId: selectedSlotDetails.zone_id,
            zoneName: selectedSlotDetails.zone_name,
            sectionId: selectedSlotDetails.section_id.toString(),
            sectionName: selectedSlotDetails.section_name,
            slotId: selectedSlotDetails.slot_id.toString(),
            slotName: selectedSlotDetails.slot_name,
            price: selectedSlotDetails.slot_price?.toString() || "0",
            date: date || "",
            arrivalTime: arrivalTime || "",
            exitTime: exitTime || "",
            vehicleType: selectedSlotDetails.slot_vehicle_type || "Any",
         },
      });
   };

   if (isLoading) {
      return (
         <SafeAreaView style={styles.safeArea}>
            <View style={styles.centered}>
               <ActivityIndicator size="large" color="#0059ff" />
               <Text style={styles.loadingText}>
                  Loading parking zone details...
               </Text>
            </View>
         </SafeAreaView>
      );
   }

   if (error) {
      console.error("Error fetching data:", error);
      return (
         <SafeAreaView style={styles.safeArea}>
            <View style={styles.centered}>
               <Text style={styles.errorText}>
                  Error loading parking zone details
               </Text>
               <Text>{(error as Error).message}</Text>
            </View>
         </SafeAreaView>
      );
   }

   if (!data || data.length === 0) {
      return (
         <SafeAreaView style={styles.safeArea}>
            <View style={styles.centered}>
               <Text style={styles.noDataText}>
                  No parking data found for this zone.
               </Text>
            </View>
         </SafeAreaView>
      );
   }

   const zoneDetails = data[0];

   return (
      <SafeAreaView style={styles.safeArea}>
         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
         <ScrollView style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.title}>{zoneDetails.zone_name}</Text>
               <Text style={styles.subtitle}>{zoneDetails.zone_address}</Text>

               <View style={styles.bookingDetails}>
                  <Text style={styles.bookingDetailText}>
                     <Text style={styles.bookingDetailLabel}>Date: </Text>
                     {date || "Not specified"}
                  </Text>
                  <Text style={styles.bookingDetailText}>
                     <Text style={styles.bookingDetailLabel}>Time: </Text>
                     {arrivalTime || "00:00"} - {exitTime || "00:00"}
                  </Text>
               </View>
            </View>

            {/* Section Selection */}
            <Text style={styles.sectionTitle}>Select Section</Text>
            <ScrollView
               horizontal
               showsHorizontalScrollIndicator={false}
               style={styles.sectionScroll}
            >
               {sections.map((section) => (
                  <TouchableOpacity
                     key={section.id}
                     style={[
                        styles.sectionButton,
                        selectedSection === section.id &&
                           styles.selectedSection,
                     ]}
                     onPress={() => handleSectionSelect(section.id)}
                  >
                     <Text
                        style={[
                           styles.sectionButtonText,
                           selectedSection === section.id &&
                              styles.selectedSectionText,
                        ]}
                     >
                        {section.name}
                     </Text>
                  </TouchableOpacity>
               ))}
            </ScrollView>

            {/* Slots Grid */}
            <Text style={styles.sectionTitle}>Select Parking Slot</Text>
            <View style={styles.slotsContainer}>
               {selectedSection !== null && (
                  <>
                     <Text style={styles.sectionDescription}>
                        {sections.find((s) => s.id === selectedSection)
                           ?.description || ""}
                     </Text>

                     <View style={styles.slotsGrid}>
                        {sections
                           .find((s) => s.id === selectedSection)
                           ?.slots.map((slot) => (
                              <TouchableOpacity
                                 key={slot.slot_id}
                                 style={[
                                    styles.slotButton,
                                    selectedSlot === slot.slot_id &&
                                       styles.selectedSlot,
                                    !slot.slot_price && styles.unavailableSlot,
                                 ]}
                                 onPress={() =>
                                    slot.slot_price &&
                                    handleSlotSelect(slot.slot_id)
                                 }
                                 disabled={!slot.slot_price}
                              >
                                 <Text
                                    style={[
                                       styles.slotButtonText,
                                       selectedSlot === slot.slot_id &&
                                          styles.selectedSlotText,
                                       !slot.slot_price &&
                                          styles.unavailableSlotText,
                                    ]}
                                 >
                                    {slot.slot_name}
                                 </Text>
                                 {slot.slot_price && (
                                    <Text style={styles.slotPrice}>
                                       ${slot.slot_price}/hr
                                    </Text>
                                 )}
                              </TouchableOpacity>
                           ))}
                     </View>
                  </>
               )}
            </View>

            {/* Selected Slot Details */}
            {selectedSlotDetails && (
               <View style={styles.selectedSlotDetails}>
                  <Text style={styles.sectionTitle}>Selected Slot Details</Text>
                  <View style={styles.detailsCard}>
                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Slot:</Text>
                        <Text style={styles.detailValue}>
                           {selectedSlotDetails.slot_name}
                        </Text>
                     </View>
                     <View style={styles.divider} />

                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Section:</Text>
                        <Text style={styles.detailValue}>
                           {selectedSlotDetails.section_name}
                        </Text>
                     </View>
                     <View style={styles.divider} />

                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <Text style={styles.detailValue}>
                           {selectedSlotDetails.slot_status || "Available"}
                        </Text>
                     </View>
                     <View style={styles.divider} />

                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vehicle Type:</Text>
                        <Text style={styles.detailValue}>
                           {selectedSlotDetails.slot_vehicle_type || "Any"}
                        </Text>
                     </View>
                     <View style={styles.divider} />

                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Price:</Text>
                        <Text style={styles.detailValue}>
                           ${selectedSlotDetails.slot_price}/hour
                        </Text>
                     </View>
                  </View>

                  <TouchableOpacity
                     style={styles.bookButton}
                     onPress={handleBookSlot}
                     activeOpacity={0.8}
                  >
                     <Text style={styles.bookButtonText}>Book This Slot</Text>
                  </TouchableOpacity>
               </View>
            )}
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: "#f8f9fa",
   },
   container: {
      flex: 1,
      padding: 16,
   },
   centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   header: {
      marginBottom: 20,
      backgroundColor: "white",
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 4,
      color: "#0e2140",
   },
   subtitle: {
      fontSize: 16,
      color: "#546e7a",
      marginBottom: 12,
   },
   bookingDetails: {
      marginTop: 12,
      padding: 12,
      backgroundColor: "#f0f7ff",
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: "#0059ff",
   },
   bookingDetailText: {
      fontSize: 15,
      marginBottom: 4,
      color: "#3a3a3a",
   },
   bookingDetailLabel: {
      fontWeight: "600",
      color: "#0e2140",
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 12,
      color: "#0e2140",
   },
   sectionScroll: {
      flexDirection: "row",
      marginBottom: 20,
   },
   sectionButton: {
      padding: 14,
      marginRight: 12,
      backgroundColor: "white",
      borderRadius: 10,
      minWidth: 80,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
   },
   selectedSection: {
      backgroundColor: "#0059ff",
   },
   sectionButtonText: {
      fontWeight: "600",
      color: "#546e7a",
   },
   selectedSectionText: {
      color: "white",
   },
   sectionDescription: {
      marginBottom: 16,
      fontStyle: "italic",
      color: "#546e7a",
      lineHeight: 20,
   },
   slotsContainer: {
      backgroundColor: "white",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
   },
   slotsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
   },
   slotButton: {
      width: "30%",
      aspectRatio: 1,
      margin: "1.5%",
      padding: 8,
      backgroundColor: "#e8f0fe",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
   },
   selectedSlot: {
      backgroundColor: "#0059ff",
      borderWidth: 0,
   },
   unavailableSlot: {
      backgroundColor: "#f0f0f0",
      opacity: 0.6,
   },
   slotButtonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#0e2140",
   },
   selectedSlotText: {
      color: "white",
   },
   unavailableSlotText: {
      color: "#999",
   },
   slotPrice: {
      fontSize: 12,
      marginTop: 4,
      color: "#546e7a",
   },
   selectedSlotDetails: {
      backgroundColor: "white",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
   },
   detailsCard: {
      backgroundColor: "#f8f9fa",
      padding: 16,
      borderRadius: 10,
      marginBottom: 20,
   },
   detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
   },
   detailLabel: {
      fontWeight: "600",
      fontSize: 16,
      color: "#546e7a",
      flex: 1,
   },
   detailValue: {
      fontSize: 16,
      color: "#0e2140",
      flex: 2,
      textAlign: "right",
   },
   divider: {
      height: 1,
      backgroundColor: "#e0e0e0",
   },
   bookButton: {
      backgroundColor: "#0059ff",
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
      shadowColor: "#0059ff",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
   },
   bookButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
   },
   errorText: {
      color: "#d32f2f",
      fontSize: 16,
      marginBottom: 8,
      textAlign: "center",
   },
   loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: "#546e7a",
   },
   noDataText: {
      fontSize: 16,
      color: "#546e7a",
      textAlign: "center",
   },
});

export default ParkingZoneViewer;
