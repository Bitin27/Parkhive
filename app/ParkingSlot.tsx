
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


// import React, { useState, useEffect } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    TouchableOpacity,
//    ScrollView,
//    ActivityIndicator,
//    SafeAreaView,
//    StatusBar,
// } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "../app/lib/supabase"; // Adjust path as needed
// import { useLocalSearchParams, useRouter } from "expo-router"; // Using Expo Router for navigation

// type ParkingSlot = {
//    zone_id: string;
//    zone_name: string;
//    zone_address: string;
//    section_id: number;
//    section_name: string;
//    section_description: string;
//    slot_id: number;
//    slot_name: string;
//    slot_status: string | null;
//    slot_vehicle_type: string | null;
//    slot_price: number | null;
// };

// type Section = {
//    id: number;
//    name: string;
//    description: string;
//    slots: ParkingSlot[];
// };

// const ParkingZoneViewer: React.FC = () => {
//    const router = useRouter();
//    const { zoneId, date, arrivalTime, exitTime } = useLocalSearchParams<{
//       zoneId: string;
//       date: string;
//       arrivalTime: string;
//       exitTime: string;
//    }>();

//    const [selectedSection, setSelectedSection] = useState<number | null>(null);
//    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

//    console.log("URL Params:", { zoneId, date, arrivalTime, exitTime });

//    // Fetch parking zone details using React Query
//    const { data, isLoading, error } = useQuery({
//       queryKey: ["parkingZoneDetails", zoneId],
//       queryFn: async () => {
//          console.log("Fetching data for zone ID:", zoneId);

//          const { data, error } = await supabaseClient.rpc(
//             "get_parking_zone_details",
//             {
//                zone_id_param: zoneId,
//             }
//          );

//          if (error) {
//             console.error("Supabase RPC error:", error);
//             throw error;
//          }

//          console.log("Fetched data:", data);
//          return data as ParkingSlot[];
//       },
//       enabled: !!zoneId,
//    });

//    // Process data to group by sections
//    const sections = React.useMemo(() => {
//       if (!data) return [];

//       const sectionMap = new Map<number, Section>();

//       data.forEach((slot) => {
//          if (!sectionMap.has(slot.section_id)) {
//             sectionMap.set(slot.section_id, {
//                id: slot.section_id,
//                name: slot.section_name,
//                description: slot.section_description,
//                slots: [],
//             });
//          }

//          sectionMap.get(slot.section_id)?.slots.push(slot);
//       });

//       return Array.from(sectionMap.values());
//    }, [data]);

//    // Set first section and slot as selected by default when data loads
//    useEffect(() => {
//       if (sections.length > 0 && selectedSection === null) {
//          setSelectedSection(sections[0].id);

//          if (sections[0].slots.length > 0) {
//             setSelectedSlot(sections[0].slots[0].slot_id);
//          }
//       }
//    }, [sections, selectedSection]);

//    // Get currently selected slot details
//    const selectedSlotDetails = React.useMemo(() => {
//       if (!data || selectedSlot === null) return null;
//       return data.find((slot) => slot.slot_id === selectedSlot);
//    }, [data, selectedSlot]);

//    const handleSlotSelect = (slotId: number) => {
//       setSelectedSlot(slotId);
//       console.log("Selected slot:", slotId);
//    };

//    const handleSectionSelect = (sectionId: number) => {
//       setSelectedSection(sectionId);
//       console.log("Selected section:", sectionId);

//       // Select the first slot in the new section
//       const sectionSlots =
//          sections.find((s) => s.id === sectionId)?.slots || [];
//       if (sectionSlots.length > 0) {
//          setSelectedSlot(sectionSlots[0].slot_id);
//       } else {
//          setSelectedSlot(null);
//       }
//    };

//    // Handle booking and navigation to next screen
//    const handleBookSlot = () => {
//       if (!selectedSlotDetails) return;

//       // Navigate to booking confirmation page with all required parameters
//       router.push({
//          pathname: "/BookingSummary",
//          params: {
//             zoneId: selectedSlotDetails.zone_id,
//             zoneName: selectedSlotDetails.zone_name,
//             sectionId: selectedSlotDetails.section_id.toString(),
//             sectionName: selectedSlotDetails.section_name,
//             slotId: selectedSlotDetails.slot_id.toString(),
//             slotName: selectedSlotDetails.slot_name,
//             price: selectedSlotDetails.slot_price?.toString() || "0",
//             date: date || "",
//             arrivalTime: arrivalTime || "",
//             exitTime: exitTime || "",
//             vehicleType: selectedSlotDetails.slot_vehicle_type || "Any",
//          },
//       });
//    };

//    if (isLoading) {
//       return (
//          <SafeAreaView style={styles.safeArea}>
//             <View style={styles.centered}>
//                <ActivityIndicator size="large" color="#0059ff" />
//                <Text style={styles.loadingText}>
//                   Loading parking zone details...
//                </Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    if (error) {
//       console.error("Error fetching data:", error);
//       return (
//          <SafeAreaView style={styles.safeArea}>
//             <View style={styles.centered}>
//                <Text style={styles.errorText}>
//                   Error loading parking zone details
//                </Text>
//                <Text>{(error as Error).message}</Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    if (!data || data.length === 0) {
//       return (
//          <SafeAreaView style={styles.safeArea}>
//             <View style={styles.centered}>
//                <Text style={styles.noDataText}>
//                   No parking data found for this zone.
//                </Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    const zoneDetails = data[0];

//    return (
//       <SafeAreaView style={styles.safeArea}>
//          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//          <ScrollView style={styles.container}>
//             <View style={styles.header}>
//                <Text style={styles.title}>{zoneDetails.zone_name}</Text>
//                <Text style={styles.subtitle}>{zoneDetails.zone_address}</Text>

//                <View style={styles.bookingDetails}>
//                   <Text style={styles.bookingDetailText}>
//                      <Text style={styles.bookingDetailLabel}>Date: </Text>
//                      {date || "Not specified"}
//                   </Text>
//                   <Text style={styles.bookingDetailText}>
//                      <Text style={styles.bookingDetailLabel}>Time: </Text>
//                      {arrivalTime || "00:00"} - {exitTime || "00:00"}
//                   </Text>
//                </View>
//             </View>

//             {/* Section Selection */}
//             <Text style={styles.sectionTitle}>Select Section</Text>
//             <ScrollView
//                horizontal
//                showsHorizontalScrollIndicator={false}
//                style={styles.sectionScroll}
//             >
//                {sections.map((section) => (
//                   <TouchableOpacity
//                      key={section.id}
//                      style={[
//                         styles.sectionButton,
//                         selectedSection === section.id &&
//                            styles.selectedSection,
//                      ]}
//                      onPress={() => handleSectionSelect(section.id)}
//                   >
//                      <Text
//                         style={[
//                            styles.sectionButtonText,
//                            selectedSection === section.id &&
//                               styles.selectedSectionText,
//                         ]}
//                      >
//                         {section.name}
//                      </Text>
//                   </TouchableOpacity>
//                ))}
//             </ScrollView>

//             {/* Slots Grid */}
//             <Text style={styles.sectionTitle}>Select Parking Slot</Text>
//             <View style={styles.slotsContainer}>
//                {selectedSection !== null && (
//                   <>
//                      <Text style={styles.sectionDescription}>
//                         {sections.find((s) => s.id === selectedSection)
//                            ?.description || ""}
//                      </Text>

//                      <View style={styles.slotsGrid}>
//                         {sections
//                            .find((s) => s.id === selectedSection)
//                            ?.slots.map((slot) => (
//                               <TouchableOpacity
//                                  key={slot.slot_id}
//                                  style={[
//                                     styles.slotButton,
//                                     selectedSlot === slot.slot_id &&
//                                        styles.selectedSlot,
//                                     !slot.slot_price && styles.unavailableSlot,
//                                  ]}
//                                  onPress={() =>
//                                     slot.slot_price &&
//                                     handleSlotSelect(slot.slot_id)
//                                  }
//                                  disabled={!slot.slot_price}
//                               >
//                                  <Text
//                                     style={[
//                                        styles.slotButtonText,
//                                        selectedSlot === slot.slot_id &&
//                                           styles.selectedSlotText,
//                                        !slot.slot_price &&
//                                           styles.unavailableSlotText,
//                                     ]}
//                                  >
//                                     {slot.slot_name}
//                                  </Text>
//                                  {slot.slot_price && (
//                                     <Text style={styles.slotPrice}>
//                                        ${slot.slot_price}/hr
//                                     </Text>
//                                  )}
//                               </TouchableOpacity>
//                            ))}
//                      </View>
//                   </>
//                )}
//             </View>

//             {/* Selected Slot Details */}
//             {selectedSlotDetails && (
//                <View style={styles.selectedSlotDetails}>
//                   <Text style={styles.sectionTitle}>Selected Slot Details</Text>
//                   <View style={styles.detailsCard}>
//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Slot:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.slot_name}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Section:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.section_name}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Status:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.slot_status || "Available"}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Vehicle Type:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.slot_vehicle_type || "Any"}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Price:</Text>
//                         <Text style={styles.detailValue}>
//                            ${selectedSlotDetails.slot_price}/hour
//                         </Text>
//                      </View>
//                   </View>

//                   <TouchableOpacity
//                      style={styles.bookButton}
//                      onPress={handleBookSlot}
//                      activeOpacity={0.8}
//                   >
//                      <Text style={styles.bookButtonText}>Book This Slot</Text>
//                   </TouchableOpacity>
//                </View>
//             )}
//          </ScrollView>
//       </SafeAreaView>
//    );
// };

// const styles = StyleSheet.create({
//    safeArea: {
//       flex: 1,
//       backgroundColor: "#f8f9fa",
//    },
//    container: {
//       flex: 1,
//       padding: 16,
//    },
//    centered: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    header: {
//       marginBottom: 20,
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 12,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    title: {
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 4,
//       color: "#0e2140",
//    },
//    subtitle: {
//       fontSize: 16,
//       color: "#546e7a",
//       marginBottom: 12,
//    },
//    bookingDetails: {
//       marginTop: 12,
//       padding: 12,
//       backgroundColor: "#f0f7ff",
//       borderRadius: 8,
//       borderLeftWidth: 4,
//       borderLeftColor: "#0059ff",
//    },
//    bookingDetailText: {
//       fontSize: 15,
//       marginBottom: 4,
//       color: "#3a3a3a",
//    },
//    bookingDetailLabel: {
//       fontWeight: "600",
//       color: "#0e2140",
//    },
//    sectionTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginTop: 20,
//       marginBottom: 12,
//       color: "#0e2140",
//    },
//    sectionScroll: {
//       flexDirection: "row",
//       marginBottom: 20,
//    },
//    sectionButton: {
//       padding: 14,
//       marginRight: 12,
//       backgroundColor: "white",
//       borderRadius: 10,
//       minWidth: 80,
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.08,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    selectedSection: {
//       backgroundColor: "#0059ff",
//    },
//    sectionButtonText: {
//       fontWeight: "600",
//       color: "#546e7a",
//    },
//    selectedSectionText: {
//       color: "white",
//    },
//    sectionDescription: {
//       marginBottom: 16,
//       fontStyle: "italic",
//       color: "#546e7a",
//       lineHeight: 20,
//    },
//    slotsContainer: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 12,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.08,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    slotsGrid: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "flex-start",
//    },
//    slotButton: {
//       width: "30%",
//       aspectRatio: 1,
//       margin: "1.5%",
//       padding: 8,
//       backgroundColor: "#e8f0fe",
//       borderRadius: 10,
//       justifyContent: "center",
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.05,
//       shadowRadius: 1,
//       elevation: 1,
//    },
//    selectedSlot: {
//       backgroundColor: "#0059ff",
//       borderWidth: 0,
//    },
//    unavailableSlot: {
//       backgroundColor: "#f0f0f0",
//       opacity: 0.6,
//    },
//    slotButtonText: {
//       fontWeight: "bold",
//       fontSize: 16,
//       color: "#0e2140",
//    },
//    selectedSlotText: {
//       color: "white",
//    },
//    unavailableSlotText: {
//       color: "#999",
//    },
//    slotPrice: {
//       fontSize: 12,
//       marginTop: 4,
//       color: "#546e7a",
//    },
//    selectedSlotDetails: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 12,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.08,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    detailsCard: {
//       backgroundColor: "#f8f9fa",
//       padding: 16,
//       borderRadius: 10,
//       marginBottom: 20,
//    },
//    detailRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       paddingVertical: 8,
//    },
//    detailLabel: {
//       fontWeight: "600",
//       fontSize: 16,
//       color: "#546e7a",
//       flex: 1,
//    },
//    detailValue: {
//       fontSize: 16,
//       color: "#0e2140",
//       flex: 2,
//       textAlign: "right",
//    },
//    divider: {
//       height: 1,
//       backgroundColor: "#e0e0e0",
//    },
//    bookButton: {
//       backgroundColor: "#0059ff",
//       padding: 16,
//       borderRadius: 10,
//       alignItems: "center",
//       shadowColor: "#0059ff",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 8,
//       elevation: 5,
//    },
//    bookButtonText: {
//       color: "white",
//       fontWeight: "bold",
//       fontSize: 16,
//    },
//    errorText: {
//       color: "#d32f2f",
//       fontSize: 16,
//       marginBottom: 8,
//       textAlign: "center",
//    },
//    loadingText: {
//       marginTop: 12,
//       fontSize: 16,
//       color: "#546e7a",
//    },
//    noDataText: {
//       fontSize: 16,
//       color: "#546e7a",
//       textAlign: "center",
//    },
// });

// export default ParkingZoneViewer;

// import { useLocalSearchParams } from "expo-router";
// import React, { useState } from "react";
// import {
//    View,
//    Text,
//    TouchableOpacity,
//    StyleSheet,
//    ScrollView,
//    Alert,
// } from "react-native";

// const ParkingSlotSelector = () => {
//    const [selectedSlot, setSelectedSlot] = useState(null);
//    const { zoneId } = useLocalSearchParams();
//    console.log("Samezone id sucessfull", zoneId);

//    // Mock data for parking slots
//    const parkingSections = {
//       A: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `A${i + 1}`, occupied: Math.random() > 0.7 })),
//       B: Array(10)
//          .fill(null)
//          .map((_, i) => ({ id: `B${i + 1}`, occupied: Math.random() > 0.7 })),
//       C: Array(8)
//          .fill(null)
//          .map((_, i) => ({ id: `C${i + 1}`, occupied: Math.random() > 0.7 })),
//       D: Array(12)
//          .fill(null)
//          .map((_, i) => ({ id: `D${i + 1}`, occupied: Math.random() > 0.7 })),
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
//                onPress: () => console.log("Parking slot confirmed:", slotId),
//             },
//          ]
//       );
//    };

//    const renderParkingSection = (section: any, slots: any) => (
//       <View style={styles.sectionContainer} key={section}>
//          <Text style={styles.sectionTitle}>Section {section}</Text>
//          <View style={styles.slotsContainer}>
//             {slots.map((slot: any) => (
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
// import { useLocalSearchParams } from "expo-router";
// import React, { useState, useEffect } from "react";
// import {
//    View,
//    Text,
//    TouchableOpacity,
//    StyleSheet,
//    ScrollView,
//    Alert,
// } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "../app/lib/supabase"; // Adjust this path

// const ParkingSlotSelector = () => {
//    const [selectedSlot, setSelectedSlot] = useState(null);
//    const { zoneId } = useLocalSearchParams();
//    console.log("Zone id received:", zoneId);

//    // Fetch parking data from Supabase
//    const {
//       data: parkingData,
//       isLoading,
//       error,
//    } = useQuery({
//       queryKey: ["parkingSlots", zoneId],
//       queryFn: async () => {
//          try {
//             // Fetch all sections for this zone
//             const { data: sections, error: sectionsError } =
//                await supabaseClient
//                   .from("parking_sections")
//                   .select("id, name, description")
//                   .eq("zone_id", zoneId);

//             if (sectionsError) {
//                console.error("Sections fetch error:", sectionsError);
//                throw sectionsError;
//             }

//             console.log("Sections found:", sections?.length || 0);

//             if (!sections || sections.length === 0) {
//                // If no real data, use mock data for testing
//                console.log("No sections found, falling back to mock data");
//                return useMockData();
//             }

//             // For each section, fetch its slots
//             const sectionsWithSlots = {};

//             for (const section of sections) {
//                const { data: slots, error: slotsError } = await supabaseClient
//                   .from("parking_slots")
//                   .select("id, name, status, vehicle_type, price_per_hour")
//                   .eq("section_id", section.id);

//                if (slotsError) {
//                   console.error("Slots fetch error:", slotsError);
//                   throw slotsError;
//                }

//                // If section has no slots or data is empty, create empty array
//                if (!slots || slots.length === 0) {
//                   sectionsWithSlots[section.name] = [];
//                   continue;
//                }

//                // Transform slots into the format your UI expects
//                sectionsWithSlots[section.name] = slots.map((slot) => ({
//                   id: slot.name || `${section.name}${slot.id}`, // Fallback if name is null
//                   occupied: slot.status === "occupied",
//                   slotId: slot.id, // Store the actual database ID
//                   price: slot.price_per_hour,
//                   vehicleType: slot.vehicle_type,
//                }));
//             }

//             console.log("Sections with slots:", Object.keys(sectionsWithSlots));
//             return sectionsWithSlots;
//          } catch (error) {
//             console.error("Error fetching parking data:", error);
//             // If there's an error, fall back to mock data for testing
//             return useMockData();
//          }
//       },
//       enabled: !!zoneId,
//    });

//    // Helper function to generate mock data - identical to your original implementation
//    const useMockData = () => {
//       return {
//          A: Array(10)
//             .fill(null)
//             .map((_, i) => ({
//                id: `A${i + 1}`,
//                occupied: Math.random() > 0.7,
//                slotId: `mock-A${i + 1}`,
//             })),
//          B: Array(10)
//             .fill(null)
//             .map((_, i) => ({
//                id: `B${i + 1}`,
//                occupied: Math.random() > 0.7,
//                slotId: `mock-B${i + 1}`,
//             })),
//          C: Array(8)
//             .fill(null)
//             .map((_, i) => ({
//                id: `C${i + 1}`,
//                occupied: Math.random() > 0.7,
//                slotId: `mock-C${i + 1}`,
//             })),
//          D: Array(12)
//             .fill(null)
//             .map((_, i) => ({
//                id: `D${i + 1}`,
//                occupied: Math.random() > 0.7,
//                slotId: `mock-D${i + 1}`,
//             })),
//       };
//    };

//    const handleSlotSelection = (slotId: any, occupied: any, dbSlotId: any) => {
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
//                   console.log(
//                      "Parking slot confirmed:",
//                      slotId,
//                      "DB ID:",
//                      dbSlotId
//                   );
//                   // Here you would handle the booking logic
//                   // For example, update the slot status in the database
//                   if (dbSlotId && !dbSlotId.startsWith("mock-")) {
//                      updateSlotStatus(dbSlotId, "occupied");
//                   }
//                },
//             },
//          ]
//       );
//    };

//    // Function to update slot status in the database
//    const updateSlotStatus = async (slotId: any, status: any) => {
//       try {
//          const { error } = await supabaseClient
//             .from("parking_slots")
//             .update({ status: status })
//             .eq("id", slotId);

//          if (error) {
//             console.error("Error updating slot status:", error);
//             Alert.alert("Error", "Could not update parking slot status");
//          } else {
//             // Refetch data to update UI
//             // You can also use mutation and optimistic updates with React Query
//             console.log("Slot status updated successfully");
//          }
//       } catch (error) {
//          console.error("Exception updating slot status:", error);
//       }
//    };

//    const renderParkingSection = (section: any, slots: any) => (
//       <View style={styles.sectionContainer} key={section}>
//          <Text style={styles.sectionTitle}>Section {section}</Text>
//          <View style={styles.slotsContainer}>
//             {slots.map((slot: any) => (
//                <TouchableOpacity
//                   key={slot.id}
//                   style={[
//                      styles.slot,
//                      slot.occupied && styles.occupiedSlot,
//                      selectedSlot === slot.id && styles.selectedSlot,
//                   ]}
//                   onPress={() =>
//                      handleSlotSelection(slot.id, slot.occupied, slot.slotId)
//                   }
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

//    // Loading state
//    if (isLoading) {
//       return (
//          <View style={[styles.container, styles.centered]}>
//             <Text>Loading parking slots...</Text>
//          </View>
//       );
//    }

//    // Error state
//    if (error) {
//       return (
//          <View style={[styles.container, styles.centered]}>
//             <Text>Error loading parking data: {error.message}</Text>
//          </View>
//       );
//    }

//    // Empty state (should never happen now due to mock data fallback)
//    if (!parkingData || Object.keys(parkingData).length === 0) {
//       return (
//          <View style={[styles.container, styles.centered]}>
//             <Text>No parking sections available. Please try again later.</Text>
//          </View>
//       );
//    }

//    return (
//       <ScrollView style={styles.container}>
//          <Text style={styles.header}>Select Parking Slot</Text>
//          {Object.entries(parkingData).map(([section, slots]) =>
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
//    centered: {
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
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
// import React, { useState } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    FlatList,
//    TouchableOpacity,
//    Alert,
//    ActivityIndicator,
// } from "react-native";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { supabaseClient } from "../app/lib/supabase"; // Adjust import path as needed

// export default function ParkingSlotSelector() {
//    const { zoneId } = useLocalSearchParams();
//    const router = useRouter();
//    const [selectedSlot, setSelectedSlot] = useState(null);

//    // Fetch parking data
//    const { data, isLoading, error } = useQuery({
//       queryKey: ["parkingData", zoneId],
//       queryFn: async () => {
//          const { data, error } = await supabaseClient
//             .from("parkingzones")
//             .select(
//                `
//           id,
//           name,
//           address,
//           description,
//           parking_sections!inner (
//             id,
//             name,
//             description,
//             parking_slots (
//               id,
//               name,
//               status,
//               vehicle_type,
//               price_per_hour
//             )
//           )
//         `
//             )
//             .eq("id", zoneId)
//             .single();

//          if (error) throw error;
//          return data;
//       },
//    });

//    // Mutation to update slot status
//    const confirmSlotMutation = useMutation({
//       mutationFn: async (slotId) => {
//          const { data, error } = await supabaseClient
//             .from("parking_slots")
//             .update({ status: "occupied" })
//             .eq("id", slotId)
//             .select();

//          if (error) throw error;
//          return data;
//       },
//       onSuccess: () => {
//          Alert.alert("Success", "Parking slot confirmed successfully!", [
//             { text: "OK", onPress: () => router.replace("/") },
//          ]);
//       },
//       onError: (error) => {
//          Alert.alert("Error", error.message);
//       },
//    });

//    const handleSlotSelection = (slot: any) => {
//       if (slot.status === "available") {
//          setSelectedSlot(slot);
//       } else {
//          Alert.alert("Not Available", "This slot is already occupied.");
//       }
//    };

//    const confirmSlot = () => {
//       if (!selectedSlot) {
//          Alert.alert("Error", "Please select a parking slot first.");
//          return;
//       }

//       Alert.alert(
//          "Confirm Parking",
//          `Do you want to confirm parking at ${selectedSlot.name}?`,
//          [
//             { text: "Cancel", style: "cancel" },
//             {
//                text: "Confirm",
//                onPress: () => confirmSlotMutation.mutate(selectedSlot.id),
//             },
//          ]
//       );
//    };

//    if (isLoading) {
//       return (
//          <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0000ff" />
//             <Text>Loading parking data...</Text>
//          </View>
//       );
//    }

//    if (error) {
//       return (
//          <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>Error: {error.message}</Text>
//          </View>
//       );
//    }

//    return (
//       <View style={styles.container}>
//          <View style={styles.header}>
//             <Text style={styles.zoneTitle}>{data.name}</Text>
//             <Text style={styles.zoneAddress}>{data.address}</Text>
//          </View>

//          <FlatList
//             data={data.parking_sections}
//             keyExtractor={(section) => section.id.toString()}
//             renderItem={({ item: section }) => (
//                <View style={styles.sectionContainer}>
//                   <Text style={styles.sectionTitle}>{section.name}</Text>
//                   <Text style={styles.sectionDescription}>
//                      {section.description}
//                   </Text>

//                   <View style={styles.slotsContainer}>
//                      {section.parking_slots &&
//                      section.parking_slots.length > 0 ? (
//                         section.parking_slots.map((slot) => (
//                            <TouchableOpacity
//                               key={slot.id}
//                               style={[
//                                  styles.slotButton,
//                                  {
//                                     backgroundColor:
//                                        slot.status === "available"
//                                           ? "#4CAF50"
//                                           : "#F44336",
//                                  },
//                                  selectedSlot?.id === slot.id &&
//                                     styles.selectedSlot,
//                               ]}
//                               onPress={() => handleSlotSelection(slot)}
//                               disabled={slot.status !== "available"}
//                            >
//                               <Text style={styles.slotText}>{slot.name}</Text>
//                               <Text style={styles.slotDetails}>
//                                  {slot.vehicle_type} - ${slot.price_per_hour}/hr
//                               </Text>
//                               <Text style={styles.slotStatus}>
//                                  {slot.status}
//                               </Text>
//                            </TouchableOpacity>
//                         ))
//                      ) : (
//                         <Text style={styles.noSlotsText}>
//                            No parking slots available in this section
//                         </Text>
//                      )}
//                   </View>
//                </View>
//             )}
//             ListEmptyComponent={
//                <Text style={styles.noDataText}>
//                   No parking sections found for this zone
//                </Text>
//             }
//          />

//          <View style={styles.footerContainer}>
//             {selectedSlot && (
//                <View style={styles.selectedInfo}>
//                   <Text style={styles.selectedText}>
//                      Selected: {selectedSlot.name} ($
//                      {selectedSlot.price_per_hour}/hr)
//                   </Text>
//                </View>
//             )}

//             <TouchableOpacity
//                style={[
//                   styles.confirmButton,
//                   !selectedSlot && styles.disabledButton,
//                ]}
//                onPress={confirmSlot}
//                disabled={!selectedSlot}
//             >
//                <Text style={styles.confirmButtonText}>Confirm Parking</Text>
//             </TouchableOpacity>
//          </View>
//       </View>
//    );
// }

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       padding: 16,
//       backgroundColor: "#f5f5f5",
//    },
//    loadingContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    errorContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    errorText: {
//       color: "red",
//       fontSize: 16,
//       textAlign: "center",
//    },
//    header: {
//       marginBottom: 16,
//    },
//    zoneTitle: {
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 4,
//    },
//    zoneAddress: {
//       fontSize: 16,
//       color: "#666",
//       marginBottom: 8,
//    },
//    sectionContainer: {
//       backgroundColor: "white",
//       borderRadius: 8,
//       padding: 16,
//       marginBottom: 16,
//       elevation: 2,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//    },
//    sectionTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginBottom: 4,
//    },
//    sectionDescription: {
//       fontSize: 14,
//       color: "#666",
//       marginBottom: 12,
//    },
//    slotsContainer: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       marginTop: 8,
//    },
//    slotButton: {
//       width: "30%",
//       padding: 12,
//       margin: "1.5%",
//       borderRadius: 6,
//       alignItems: "center",
//    },
//    selectedSlot: {
//       borderWidth: 2,
//       borderColor: "#2196F3",
//    },
//    slotText: {
//       color: "white",
//       fontWeight: "bold",
//       fontSize: 16,
//    },
//    slotDetails: {
//       color: "white",
//       fontSize: 12,
//       marginTop: 4,
//    },
//    slotStatus: {
//       color: "white",
//       fontSize: 12,
//       fontStyle: "italic",
//       marginTop: 2,
//    },
//    noSlotsText: {
//       fontStyle: "italic",
//       color: "#666",
//       textAlign: "center",
//       width: "100%",
//       padding: 12,
//    },
//    noDataText: {
//       textAlign: "center",
//       fontSize: 16,
//       color: "#666",
//       padding: 20,
//    },
//    footerContainer: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 8,
//       elevation: 4,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 4,
//    },
//    selectedInfo: {
//       marginBottom: 12,
//    },
//    selectedText: {
//       fontSize: 16,
//       fontWeight: "bold",
//    },
//    confirmButton: {
//       backgroundColor: "#2196F3",
//       padding: 16,
//       borderRadius: 6,
//       alignItems: "center",
//    },
//    disabledButton: {
//       backgroundColor: "#B0BEC5",
//    },
//    confirmButtonText: {
//       color: "white",
//       fontWeight: "bold",
//       fontSize: 16,
//    },
// });
// import React, { useEffect, useState } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    FlatList,
//    ActivityIndicator,
//    TouchableOpacity,
//    ScrollView,
// } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "../app/lib/supabase"; // Adjust the import path as needed

// // Define TypeScript types for the data structure
// type Slot = {
//    slot_id: number;
//    slot_name: string;
//    slot_status: string | null;
//    slot_vehicle_type: string | null;
//    slot_price: string | null;
// };

// type Section = {
//    section_id: number;
//    section_name: string;
//    section_description: string;
//    parking_slots: Slot[];
// };

// type ParkingZoneDetails = {
//    zone_id: string;
//    zone_name: string;
//    zone_address: string;
//    parking_sections: Section[];
// };

// const ParkingZoneDetails = () => {
//    const { zoneId, date, arrivalTime, exitTime } = useLocalSearchParams();
//    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

//    // Log the parameters to debug
//    useEffect(() => {
//       console.log("Params from router:", {
//          zoneId,
//          date,
//          arrivalTime,
//          exitTime,
//       });
//    }, [zoneId, date, arrivalTime, exitTime]);

//    // Fetch parking data using React Query
//    const { data, isLoading, error } = useQuery<ParkingZoneDetails | null>({
//       queryKey: ["parkingZoneDetails", zoneId],
//       queryFn: async () => {
//          console.log("Fetching data for zone:", zoneId);

//          const { data, error } = await supabaseClient.rpc(
//             "get_parking_zone_details",
//             {
//                zone_id_param: zoneId,
//             }
//          );

//          if (error) {
//             console.error("Supabase query error:", error);
//             throw error;
//          }

//          console.log("Raw data from Supabase:", data);
//          return processQueryResults(data);
//       },
//       enabled: !!zoneId,
//    });

//    // Process the flat SQL query results into a nested structure
//    const processQueryResults = (results: any[]): ParkingZoneDetails | null => {
//       if (!results || results.length === 0) return null;

//       const zoneInfo = {
//          zone_id: results[0].zone_id,
//          zone_name: results[0].zone_name,
//          zone_address: results[0].zone_address,
//       };

//       const sectionMap = new Map<number, Section>();

//       results.forEach((item) => {
//          if (!item.section_id) return;

//          if (!sectionMap.has(item.section_id)) {
//             sectionMap.set(item.section_id, {
//                section_id: item.section_id,
//                section_name: item.section_name,
//                section_description: item.section_description,
//                parking_slots: [],
//             });
//          }

//          if (item.slot_id) {
//             const section = sectionMap.get(item.section_id)!;
//             section.parking_slots.push({
//                slot_id: item.slot_id,
//                slot_name: item.slot_name,
//                slot_status: item.slot_status,
//                slot_vehicle_type: item.slot_vehicle_type,
//                slot_price: item.slot_price,
//             });
//          }
//       });

//       return {
//          ...zoneInfo,
//          parking_sections: Array.from(sectionMap.values()),
//       };
//    };

//    // Handle slot selection
//    const handleSlotSelect = (slot: Slot) => {
//       setSelectedSlot(slot.slot_id === selectedSlot?.slot_id ? null : slot);
//    };

//    // Determine if a slot is available
//    const isSlotAvailable = (status: string | null) => {
//       return status === null || status.toLowerCase().includes("available");
//    };

//    // Render loading state
//    if (isLoading) {
//       return (
//          <View style={styles.centered}>
//             <ActivityIndicator size="large" color="#0000ff" />
//             <Text>Loading parking details...</Text>
//          </View>
//       );
//    }

//    // Render error state
//    if (error) {
//       return (
//          <View style={styles.centered}>
//             <Text style={styles.errorText}>
//                Error loading data: {error.message}
//             </Text>
//          </View>
//       );
//    }

//    // Render when no data is available
//    if (!data) {
//       return (
//          <View style={styles.centered}>
//             <Text>No parking data available for this zone.</Text>
//          </View>
//       );
//    }

//    // Render a parking slot
//    const renderSlot = ({ item }: { item: Slot }) => {
//       const isAvailable = isSlotAvailable(item.slot_status);
//       const isSelected = selectedSlot?.slot_id === item.slot_id;

//       return (
//          <TouchableOpacity
//             style={[
//                styles.slotContainer,
//                isAvailable ? styles.availableSlot : styles.unavailableSlot,
//                isSelected && styles.selectedSlot,
//             ]}
//             onPress={() => isAvailable && handleSlotSelect(item)}
//             disabled={!isAvailable}
//          >
//             <Text style={[styles.slotName, isSelected && styles.selectedText]}>
//                {item.slot_name}
//             </Text>
//             <Text style={styles.slotStatus}>
//                {item.slot_status || "Available"}
//             </Text>
//             {item.slot_price && (
//                <Text style={styles.slotPrice}>NPR {item.slot_price}/hr</Text>
//             )}
//             {item.slot_vehicle_type && (
//                <Text style={styles.slotVehicleType}>
//                   For: {item.slot_vehicle_type}
//                </Text>
//             )}
//          </TouchableOpacity>
//       );
//    };

//    // Render a section with its slots
//    const renderSection = ({ item }: { item: Section }) => (
//       <View style={styles.sectionContainer}>
//          <View style={styles.sectionHeader}>
//             <Text style={styles.sectionName}>Section {item.section_name}</Text>
//             <Text style={styles.sectionDescription}>
//                {item.section_description}
//             </Text>
//          </View>
//          {item.parking_slots.length > 0 ? (
//             <FlatList
//                data={item.parking_slots}
//                keyExtractor={(slot) => slot.slot_id.toString()}
//                renderItem={renderSlot}
//                horizontal
//                showsHorizontalScrollIndicator={false}
//                contentContainerStyle={styles.slotsContainer}
//             />
//          ) : (
//             <Text style={styles.noSlotsText}>
//                No slots available in this section
//             </Text>
//          )}
//       </View>
//    );

// // Show booking info if available
// const renderBookingInfo = () => {
//    if (date && arrivalTime) {
//       return (
//          <View style={styles.bookingInfoContainer}>
//             <Text style={styles.bookingInfoTitle}>Booking Details</Text>
//             <Text style={styles.bookingInfoText}>Date: {date}</Text>
//             <Text style={styles.bookingInfoText}>
//                Arrival: {arrivalTime}
//             </Text>
//             {exitTime && (
//                <Text style={styles.bookingInfoText}>Exit: {exitTime}</Text>
//             )}
//          </View>
//       );
//    }
//    return null;
// };

//    // Render selected slot information
//    const renderSelectedSlotInfo = () => {
//       if (!selectedSlot) return null;

//       return (
//          <View style={styles.selectedSlotInfoContainer}>
//             <Text style={styles.selectedSlotTitle}>Selected Parking Space</Text>
//             <Text style={styles.selectedSlotText}>
//                Slot: {selectedSlot.slot_name}
//             </Text>
//             <Text style={styles.selectedSlotText}>
//                Price:{" "}
//                {selectedSlot.slot_price
//                   ? `NPR ${selectedSlot.slot_price}/hr`
//                   : "Not specified"}
//             </Text>
//             <TouchableOpacity style={styles.bookButton}>
//                <Text style={styles.bookButtonText}>Book This Space</Text>
//             </TouchableOpacity>
//          </View>
//       );
//    };

//    return (
//       <View style={styles.container}>
//          <ScrollView contentContainerStyle={styles.scrollContainer}>
//             <View style={styles.zoneInfoContainer}>
//                <Text style={styles.zoneName}>{data.zone_name}</Text>
//                <Text style={styles.zoneAddress}>{data.zone_address}</Text>
//             </View>

//             {renderBookingInfo()}

//             <Text style={styles.sectionListTitle}>
//                Available Parking Sections
//             </Text>

//             <FlatList
//                data={data.parking_sections}
//                keyExtractor={(section) => section.section_id.toString()}
//                renderItem={renderSection}
//                scrollEnabled={false}
//                contentContainerStyle={styles.sectionsContainer}
//             />

//             {renderSelectedSlotInfo()}
//          </ScrollView>
//       </View>
//    );
// };

// // Styles remain the same as in your original code
// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//    },
//    scrollContainer: {
//       padding: 16,
//    },
//    centered: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    errorText: {
//       color: "red",
//       fontSize: 16,
//       textAlign: "center",
//       marginTop: 10,
//    },
//    zoneInfoContainer: {
//       backgroundColor: "#fff",
//       padding: 16,
//       borderRadius: 8,
//       marginBottom: 16,
//       elevation: 2,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 1.41,
//    },
//    zoneName: {
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 8,
//    },
//    zoneAddress: {
//       fontSize: 16,
//       color: "#666",
//    },
//    sectionListTitle: {
//       fontSize: 20,
//       fontWeight: "600",
//       marginBottom: 12,
//       marginTop: 8,
//    },
//    bookingInfoContainer: {
//       backgroundColor: "#e6f7ff",
//       padding: 16,
//       borderRadius: 8,
//       marginBottom: 16,
//       elevation: 2,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 1.41,
//    },
//    bookingInfoTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginBottom: 8,
//    },
//    bookingInfoText: {
//       fontSize: 16,
//       marginBottom: 4,
//    },
//    sectionsContainer: {
//       paddingBottom: 16,
//    },
//    sectionContainer: {
//       marginBottom: 16,
//       backgroundColor: "#fff",
//       borderRadius: 8,
//       padding: 16,
//       elevation: 2,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 1.41,
//    },
//    sectionHeader: {
//       marginBottom: 12,
//    },
//    sectionName: {
//       fontSize: 20,
//       fontWeight: "bold",
//    },
//    sectionDescription: {
//       fontSize: 14,
//       color: "#666",
//       marginTop: 4,
//    },
//    slotsContainer: {
//       paddingVertical: 8,
//    },
//    slotContainer: {
//       padding: 12,
//       borderRadius: 6,
//       marginRight: 12,
//       width: 150,
//       minHeight: 120,
//       justifyContent: "space-between",
//    },
//    availableSlot: {
//       backgroundColor: "#e6f7ff",
//       borderWidth: 1,
//       borderColor: "#1890ff",
//    },
//    unavailableSlot: {
//       backgroundColor: "#f5f5f5",
//       borderWidth: 1,
//       borderColor: "#d9d9d9",
//       opacity: 0.7,
//    },
//    selectedSlot: {
//       backgroundColor: "#1890ff",
//       borderWidth: 2,
//       borderColor: "#096dd9",
//    },
//    selectedText: {
//       color: "#fff",
//    },
//    slotName: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginBottom: 4,
//    },
//    slotStatus: {
//       fontSize: 14,
//       marginBottom: 2,
//    },
//    slotPrice: {
//       fontSize: 14,
//       fontWeight: "500",
//       marginBottom: 2,
//    },
//    slotVehicleType: {
//       fontSize: 14,
//       color: "#666",
//    },
//    noSlotsText: {
//       fontStyle: "italic",
//       color: "#666",
//       textAlign: "center",
//       paddingVertical: 12,
//    },
//    selectedSlotInfoContainer: {
//       backgroundColor: "#f0f7ff",
//       padding: 16,
//       borderRadius: 8,
//       marginTop: 16,
//       borderWidth: 1,
//       borderColor: "#1890ff",
//    },
//    selectedSlotTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginBottom: 8,
//       color: "#1890ff",
//    },
//    selectedSlotText: {
//       fontSize: 16,
//       marginBottom: 4,
//    },
//    bookButton: {
//       backgroundColor: "#1890ff",
//       padding: 12,
//       borderRadius: 4,
//       alignItems: "center",
//       marginTop: 12,
//    },
//    bookButtonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "bold",
//    },
// });

// export default ParkingZoneDetails;
// import React, { useState, useEffect } from "react";
// import {
//    View,
//    Text,
//    TouchableOpacity,
//    StyleSheet,
//    ScrollView,
//    Alert,
//    ActivityIndicator,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "../app/lib/supabase";

// interface ParkingSlot {
//    id: number;
//    name: string;
//    status: string;
//    vehicleType: string | null;
//    price: string | null;
//    isAvailable: boolean;
// }

// interface Section {
//    id: number;
//    name: string;
//    description: string;
//    slots: ParkingSlot[];
// }

// const ParkingSlotSelection = () => {
//    const router = useRouter();
//    const { zoneId, date, arrivalTime, exitTime } = useLocalSearchParams<{
//       zoneId: string;
//       date: string;
//       arrivalTime: string;
//       exitTime: string;
//    }>();
//    const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
//    const [sections, setSections] = useState<{ [key: number]: Section }>({});

//    const {
//       data: parkingData,
//       isLoading,
//       error,
//       refetch,
//    } = useQuery({
//       queryKey: ["parkingZoneDetails", zoneId],
//       queryFn: async () => {
//          console.log("Fetching data for zone ID:", zoneId);

//          // Try direct SQL query first instead of RPC
//          const { data: queryData, error: queryError } = await supabaseClient
//             .from("get_parking_zone_details")
//             .select("*")
//             .eq("zone_id", zoneId);

//          if (queryError) {
//             console.error("Direct SQL query error:", queryError);

//             // Fall back to RPC as original code did
//             const { data: rpcData, error: rpcError } = await supabaseClient.rpc(
//                "get_parking_zone_details",
//                { zone_id_param: zoneId }
//             );

//             if (rpcError) {
//                console.error("Supabase RPC error:", rpcError);
//                throw rpcError;
//             }

//             console.log("Raw RPC response:", JSON.stringify(rpcData, null, 2));
//             console.log("Raw data rows:", rpcData?.length || 0);

//             return rpcData || [];
//          }

//          console.log(
//             "Direct SQL query response:",
//             JSON.stringify(queryData, null, 2)
//          );
//          console.log("SQL data rows:", queryData?.length || 0);
//          return queryData || [];
//       },
//    });

//    useEffect(() => {
//       if (parkingData && parkingData.length > 0) {
//          console.log("Processing raw data rows:", parkingData.length);
//          console.log(
//             "First row sample:",
//             JSON.stringify(parkingData[0], null, 2)
//          );

//          const organizedSections: { [key: number]: Section } = {};

//          parkingData.forEach((item: any) => {
//             // Only skip if section_id is explicitly null (not 0)
//             if (item.section_id === null) {
//                console.log(
//                   "Skipping item with null section_id:",
//                   JSON.stringify(item)
//                );
//                return;
//             }

//             // Convert section_id to number if it's a string
//             const sectionId =
//                typeof item.section_id === "string"
//                   ? parseInt(item.section_id, 10)
//                   : item.section_id;

//             if (!organizedSections[sectionId]) {
//                organizedSections[sectionId] = {
//                   id: sectionId,
//                   name: item.section_name || "Unknown",
//                   description: item.section_description || "No description",
//                   slots: [],
//                };
//             }

//             // Convert slot_id to number if it's a string
//             const slotId =
//                typeof item.slot_id === "string"
//                   ? parseInt(item.slot_id, 10)
//                   : item.slot_id;

//             // Only add the slot if it has an ID
//             if (slotId !== null) {
//                // Consider a slot available if it has a price
//                const isAvailable = item.slot_price !== null;

//                // Check if this slot is already added (avoid duplicates)
//                const existingSlot = organizedSections[sectionId].slots.find(
//                   (slot) => slot.id === slotId
//                );

//                if (!existingSlot) {
//                   organizedSections[sectionId].slots.push({
//                      id: slotId,
//                      name: item.slot_name || `Slot ${slotId}`,
//                      status: item.slot_status || "",
//                      vehicleType: item.slot_vehicle_type,
//                      price: item.slot_price,
//                      isAvailable: isAvailable,
//                   });
//                }
//             }
//          });

//          setSections(organizedSections);
//          console.log(
//             "Total sections organized:",
//             Object.keys(organizedSections).length
//          );
//          Object.values(organizedSections).forEach((section) => {
//             console.log(
//                `Section ${section.name} has ${section.slots.length} slots`
//             );
//          });
//       }
//    }, [parkingData]);

//    const handleSlotSelection = (slot: ParkingSlot) => {
//       if (slot.isAvailable) {
//          setSelectedSlot(slot);
//       } else {
//          Alert.alert(
//             "Not Available",
//             "This slot is not available for booking."
//          );
//       }
//    };

//    const handleConfirmBooking = () => {
//       if (!selectedSlot) {
//          Alert.alert(
//             "Selection Required",
//             "Please select a parking slot first."
//          );
//          return;
//       }

//       Alert.alert(
//          "Confirm Booking",
//          `Do you want to confirm booking for slot ${selectedSlot.name} at ${selectedSlot.price} NPR per hour?`,
//          [
//             {
//                text: "Cancel",
//                style: "cancel",
//             },
//             {
//                text: "Confirm",
//                onPress: () => {
//                   // In a real app, you would make an API call here to book the slot
//                   Alert.alert(
//                      "Success",
//                      `Slot ${selectedSlot.name} booked successfully!`,
//                      [
//                         {
//                            text: "OK",
//                            onPress: () => {
//                               // Navigate to confirmation page
//                               router.push({
//                                  pathname: "/booking-confirmation",
//                                  params: {
//                                     slotId: selectedSlot.id.toString(),
//                                     slotName: selectedSlot.name,
//                                     price: selectedSlot.price || "0",
//                                     date,
//                                     arrivalTime,
//                                     exitTime,
//                                     zoneId,
//                                  },
//                               });
//                            },
//                         },
//                      ]
//                   );
//                },
//             },
//          ]
//       );
//    };

//    if (isLoading) {
//       return (
//          <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0066CC" />
//             <Text style={styles.loadingText}>
//                Loading parking information...
//             </Text>
//          </View>
//       );
//    }

//    if (error) {
//       return (
//          <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>
//                Error loading parking data: {error.message}
//             </Text>
//             <TouchableOpacity
//                style={styles.retryButton}
//                onPress={() => refetch()}
//             >
//                <Text style={styles.retryButtonText}>Retry</Text>
//             </TouchableOpacity>
//          </View>
//       );
//    }

//    if (!parkingData || parkingData.length === 0) {
//       return (
//          <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>
//                No parking data found for this zone.
//             </Text>
//             <Text style={styles.errorSubText}>Zone ID: {zoneId}</Text>
//             <TouchableOpacity
//                style={styles.retryButton}
//                onPress={() => refetch()}
//             >
//                <Text style={styles.retryButtonText}>Retry</Text>
//             </TouchableOpacity>
//          </View>
//       );
//    }

//    const zoneInfo = {
//       name: parkingData[0]?.zone_name || "Unknown Zone",
//       address: parkingData[0]?.zone_address || "Unknown Location",
//    };

//    return (
//       <View style={styles.container}>
//          <View style={styles.header}>
//             <Text style={styles.zoneName}>{zoneInfo.name}</Text>
//             <Text style={styles.zoneAddress}>{zoneInfo.address}</Text>
//             <Text style={styles.bookingInfo}>
//                Date: {date || "N/A"} • Arrival: {arrivalTime || "N/A"} • Exit:{" "}
//                {exitTime || "N/A"}
//             </Text>
//          </View>

//          <View style={styles.infoBox}>
//             <Text style={styles.infoText}>
//                Total sections: {Object.keys(sections).length}
//             </Text>
//             <Text style={styles.infoText}>
//                Raw data rows: {parkingData?.length || 0}
//             </Text>
//          </View>

//          <Text style={styles.instructionText}>
//             Select an available parking slot:
//          </Text>

//          {Object.keys(sections).length === 0 ? (
//             <View style={styles.noDataContainer}>
//                <Text style={styles.noDataText}>
//                   No sections or slots found.
//                </Text>
//                <Text style={styles.noDataSubText}>
//                   Please try a different approach to fetch parking data.
//                </Text>
//                <TouchableOpacity
//                   style={styles.debugButton}
//                   onPress={() => {
//                      // Add debug function to directly query and show result in alert
//                      const debugFetch = async () => {
//                         try {
//                            const { data, error } = await supabaseClient
//                               .from("parking_sections")
//                               .select("*")
//                               .eq("zone_id", zoneId);

//                            Alert.alert(
//                               "Debug Info",
//                               `Found ${data?.length || 0} sections directly from table`
//                            );
//                         } catch (e) {
//                            Alert.alert("Debug Error", e.message);
//                         }
//                      };
//                      debugFetch();
//                   }}
//                >
//                   <Text style={styles.retryButtonText}>Debug</Text>
//                </TouchableOpacity>
//                <TouchableOpacity
//                   style={styles.retryButton}
//                   onPress={() => refetch()}
//                >
//                   <Text style={styles.retryButtonText}>Refresh</Text>
//                </TouchableOpacity>
//             </View>
//          ) : (
//             <ScrollView style={styles.sectionsContainer}>
//                {Object.values(sections).map((section) => (
//                   <View key={section.id} style={styles.sectionContainer}>
//                      <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionName}>
//                            Section {section.name}
//                         </Text>
//                         <Text style={styles.sectionDescription}>
//                            {section.description}
//                         </Text>
//                      </View>

//                      <View style={styles.slotsGrid}>
//                         {section.slots.length === 0 ? (
//                            <Text style={styles.noSlotsText}>
//                               No slots in this section
//                            </Text>
//                         ) : (
//                            section.slots.map((slot) => (
//                               <TouchableOpacity
//                                  key={slot.id}
//                                  style={[
//                                     styles.slotButton,
//                                     !slot.isAvailable && styles.slotUnavailable,
//                                     selectedSlot?.id === slot.id &&
//                                        styles.slotSelected,
//                                  ]}
//                                  onPress={() => handleSlotSelection(slot)}
//                                  disabled={!slot.isAvailable}
//                               >
//                                  <Text
//                                     style={[
//                                        styles.slotName,
//                                        !slot.isAvailable &&
//                                           styles.slotUnavailableText,
//                                        selectedSlot?.id === slot.id &&
//                                           styles.slotSelectedText,
//                                     ]}
//                                  >
//                                     {slot.name}
//                                  </Text>
//                                  {slot.price ? (
//                                     <Text
//                                        style={[
//                                           styles.slotPrice,
//                                           !slot.isAvailable &&
//                                              styles.slotUnavailableText,
//                                           selectedSlot?.id === slot.id &&
//                                              styles.slotSelectedText,
//                                        ]}
//                                     >
//                                        {slot.price} NPR/hr
//                                     </Text>
//                                  ) : (
//                                     <Text style={styles.slotUnavailableText}>
//                                        No price
//                                     </Text>
//                                  )}
//                               </TouchableOpacity>
//                            ))
//                         )}
//                      </View>
//                   </View>
//                ))}
//             </ScrollView>
//          )}

//          <View style={styles.footer}>
//             {selectedSlot && (
//                <View style={styles.selectedInfo}>
//                   <Text style={styles.selectedText}>
//                      Selected:{" "}
//                      <Text style={styles.selectedDetails}>
//                         {selectedSlot.name} - {selectedSlot.price} NPR/hr
//                      </Text>
//                   </Text>
//                </View>
//             )}
//             <TouchableOpacity
//                style={[
//                   styles.confirmButton,
//                   !selectedSlot && styles.confirmButtonDisabled,
//                ]}
//                onPress={handleConfirmBooking}
//                disabled={!selectedSlot}
//             >
//                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
//             </TouchableOpacity>
//          </View>
//       </View>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#f5f5f5",
//       padding: 16,
//    },
//    loadingContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    loadingText: {
//       marginTop: 10,
//       fontSize: 16,
//       color: "#555",
//    },
//    errorContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    errorText: {
//       color: "#d32f2f",
//       fontSize: 16,
//       textAlign: "center",
//       marginBottom: 8,
//    },
//    errorSubText: {
//       color: "#666",
//       fontSize: 14,
//       textAlign: "center",
//    },
//    retryButton: {
//       marginTop: 16,
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       backgroundColor: "#0066CC",
//       borderRadius: 8,
//    },
//    debugButton: {
//       marginTop: 16,
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       backgroundColor: "#FF9800",
//       borderRadius: 8,
//    },
//    retryButtonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "bold",
//    },
//    infoBox: {
//       backgroundColor: "#FFF9C4",
//       padding: 10,
//       borderRadius: 8,
//       marginBottom: 15,
//    },
//    infoText: {
//       color: "#5D4037",
//       fontSize: 14,
//    },
//    noDataContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 30,
//    },
//    noDataText: {
//       fontSize: 18,
//       color: "#666",
//       textAlign: "center",
//       marginBottom: 8,
//    },
//    noDataSubText: {
//       fontSize: 14,
//       color: "#888",
//       textAlign: "center",
//    },
//    header: {
//       marginBottom: 20,
//       padding: 16,
//       backgroundColor: "#fff",
//       borderRadius: 8,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    zoneName: {
//       fontSize: 22,
//       fontWeight: "bold",
//       color: "#333",
//       marginBottom: 4,
//    },
//    zoneAddress: {
//       fontSize: 16,
//       color: "#555",
//       marginBottom: 8,
//    },
//    bookingInfo: {
//       fontSize: 14,
//       color: "#666",
//       marginTop: 8,
//    },
//    instructionText: {
//       fontSize: 16,
//       fontWeight: "600",
//       marginVertical: 12,
//       color: "#444",
//    },
//    sectionsContainer: {
//       flex: 1,
//    },
//    sectionContainer: {
//       marginBottom: 20,
//       backgroundColor: "#fff",
//       borderRadius: 8,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//       overflow: "hidden",
//    },
//    sectionHeader: {
//       padding: 12,
//       backgroundColor: "#e8f4fd",
//       borderBottomWidth: 1,
//       borderBottomColor: "#d0e8f2",
//    },
//    sectionName: {
//       fontSize: 18,
//       fontWeight: "bold",
//       color: "#0066CC",
//    },
//    sectionDescription: {
//       fontSize: 14,
//       color: "#666",
//       marginTop: 2,
//    },
//    slotsGrid: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       padding: 12,
//    },
//    noSlotsText: {
//       padding: 20,
//       fontSize: 14,
//       color: "#888",
//       fontStyle: "italic",
//       textAlign: "center",
//       width: "100%",
//    },
//    slotButton: {
//       width: "30%",
//       aspectRatio: 1,
//       margin: "1.65%",
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "#e8f5e9",
//       borderRadius: 8,
//       borderWidth: 1,
//       borderColor: "#b0d9b5",
//       padding: 8,
//    },
//    slotUnavailable: {
//       backgroundColor: "#f5f5f5",
//       borderColor: "#e0e0e0",
//    },
//    slotSelected: {
//       backgroundColor: "#0066CC",
//       borderColor: "#004c99",
//    },
//    slotName: {
//       fontSize: 16,
//       fontWeight: "bold",
//       color: "#2e7d32",
//    },
//    slotPrice: {
//       fontSize: 12,
//       color: "#2e7d32",
//       marginTop: 4,
//    },
//    slotUnavailableText: {
//       color: "#9e9e9e",
//    },
//    slotSelectedText: {
//       color: "#ffffff",
//    },
//    footer: {
//       marginTop: 16,
//       padding: 16,
//       backgroundColor: "#fff",
//       borderRadius: 8,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    selectedInfo: {
//       marginBottom: 12,
//    },
//    selectedText: {
//       fontSize: 16,
//       color: "#333",
//    },
//    selectedDetails: {
//       fontWeight: "bold",
//       color: "#0066CC",
//    },
//    confirmButton: {
//       backgroundColor: "#0066CC",
//       paddingVertical: 14,
//       borderRadius: 8,
//       alignItems: "center",
//    },
//    confirmButtonDisabled: {
//       backgroundColor: "#b0c4de",
//    },
//    confirmButtonText: {
//       color: "#fff",
//       fontSize: 18,
//       fontWeight: "bold",
//    },
// });

// export default ParkingSlotSelection;

// import React, { useState, useEffect } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    TouchableOpacity,
//    ScrollView,
//    ActivityIndicator,
// } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "../app/lib/supabase"; // Adjust path as needed
// import { useLocalSearchParams } from "expo-router"; // Assuming you're using Expo Router

// type ParkingSlot = {
//    zone_id: string;
//    zone_name: string;
//    zone_address: string;
//    section_id: number;
//    section_name: string;
//    section_description: string;
//    slot_id: number;
//    slot_name: string;
//    slot_status: string | null;
//    slot_vehicle_type: string | null;
//    slot_price: number | null;
// };

// type Section = {
//    id: number;
//    name: string;
//    description: string;
//    slots: ParkingSlot[];
// };

// const ParkingZoneViewer: React.FC = () => {
//    const { zoneId, date, arrivalTime, exitTime } = useLocalSearchParams<{
//       zoneId: string;
//       date: string;
//       arrivalTime: string;
//       exitTime: string;
//    }>();

//    const [selectedSection, setSelectedSection] = useState<number | null>(null);
//    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

//    console.log("URL Params:", { zoneId, date, arrivalTime, exitTime });

//    // Fetch parking zone details using React Query
//    const { data, isLoading, error } = useQuery({
//       queryKey: ["parkingZoneDetails", zoneId],
//       queryFn: async () => {
//          console.log("Fetching data for zone ID:", zoneId);

//          const { data, error } = await supabaseClient.rpc(
//             "get_parking_slots_by_zone",
//             {
//                zone_id_param: zoneId,
//             }
//          );

//          if (error) {
//             console.error("Supabase RPC error:", error);
//             throw error;
//          }

//          console.log("Fetched data:", data);
//          return data as ParkingSlot[];
//       },
//       enabled: !!zoneId,
//    });

//    // Process data to group by sections
//    const sections = React.useMemo(() => {
//       if (!data) return [];

//       const sectionMap = new Map<number, Section>();

//       data.forEach((slot) => {
//          if (!sectionMap.has(slot.section_id)) {
//             sectionMap.set(slot.section_id, {
//                id: slot.section_id,
//                name: slot.section_name,
//                description: slot.section_description,
//                slots: [],
//             });
//          }

//          sectionMap.get(slot.section_id)?.slots.push(slot);
//       });

//       return Array.from(sectionMap.values());
//    }, [data]);

//    // Set first section and slot as selected by default when data loads
//    useEffect(() => {
//       if (sections.length > 0 && selectedSection === null) {
//          setSelectedSection(sections[0].id);

//          if (sections[0].slots.length > 0) {
//             setSelectedSlot(sections[0].slots[0].slot_id);
//          }
//       }
//    }, [sections, selectedSection]);

//    // Get currently selected slot details
//    const selectedSlotDetails = React.useMemo(() => {
//       if (!data || selectedSlot === null) return null;
//       return data.find((slot) => slot.slot_id === selectedSlot);
//    }, [data, selectedSlot]);

//    const handleSlotSelect = (slotId: number) => {
//       setSelectedSlot(slotId);
//       console.log("Selected slot:", slotId);
//    };

//    const handleSectionSelect = (sectionId: number) => {
//       setSelectedSection(sectionId);
//       console.log("Selected section:", sectionId);

//       // Select the first slot in the new section
//       const sectionSlots =
//          sections.find((s) => s.id === sectionId)?.slots || [];
//       if (sectionSlots.length > 0) {
//          setSelectedSlot(sectionSlots[0].slot_id);
//       } else {
//          setSelectedSlot(null);
//       }
//    };

//    if (isLoading) {
//       return (
//          <View style={styles.centered}>
//             <ActivityIndicator size="large" color="#0000ff" />
//             <Text>Loading parking zone details...</Text>
//          </View>
//       );
//    }

//    if (error) {
//       console.error("Error fetching data:", error);
//       return (
//          <View style={styles.centered}>
//             <Text style={styles.errorText}>
//                Error loading parking zone details
//             </Text>
//             <Text>{(error as Error).message}</Text>
//          </View>
//       );
//    }

//    if (!data || data.length === 0) {
//       return (
//          <View style={styles.centered}>
//             <Text>No parking data found for this zone.</Text>
//          </View>
//       );
//    }

//    const zoneDetails = data[0];

//    return (
//       <ScrollView style={styles.container}>
//          <View style={styles.header}>
//             <Text style={styles.title}>{zoneDetails.zone_name}</Text>
//             <Text style={styles.subtitle}>{zoneDetails.zone_address}</Text>

//             <View style={styles.bookingDetails}>
//                <Text>Date: {date || "Not specified"}</Text>
//                <Text>
//                   Time: {arrivalTime || "00:00"} - {exitTime || "00:00"}
//                </Text>
//             </View>
//          </View>

//          {/* Section Selection */}
//          <Text style={styles.sectionTitle}>Select Section</Text>
//          <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.sectionScroll}
//          >
//             {sections.map((section) => (
//                <TouchableOpacity
//                   key={section.id}
//                   style={[
//                      styles.sectionButton,
//                      selectedSection === section.id && styles.selectedSection,
//                   ]}
//                   onPress={() => handleSectionSelect(section.id)}
//                >
//                   <Text
//                      style={[
//                         styles.sectionButtonText,
//                         selectedSection === section.id &&
//                            styles.selectedSectionText,
//                      ]}
//                   >
//                      {section.name}
//                   </Text>
//                </TouchableOpacity>
//             ))}
//          </ScrollView>

//          {/* Slots Grid */}
//          <Text style={styles.sectionTitle}>Select Parking Slot</Text>
//          <View style={styles.slotsContainer}>
//             {selectedSection !== null && (
//                <>
//                   <Text style={styles.sectionDescription}>
//                      {sections.find((s) => s.id === selectedSection)
//                         ?.description || ""}
//                   </Text>

//                   <View style={styles.slotsGrid}>
//                      {sections
//                         .find((s) => s.id === selectedSection)
//                         ?.slots.map((slot) => (
//                            <TouchableOpacity
//                               key={slot.slot_id}
//                               style={[
//                                  styles.slotButton,
//                                  selectedSlot === slot.slot_id &&
//                                     styles.selectedSlot,
//                                  !slot.slot_price && styles.unavailableSlot,
//                               ]}
//                               onPress={() =>
//                                  slot.slot_price &&
//                                  handleSlotSelect(slot.slot_id)
//                               }
//                               disabled={!slot.slot_price}
//                            >
//                               <Text
//                                  style={[
//                                     styles.slotButtonText,
//                                     selectedSlot === slot.slot_id &&
//                                        styles.selectedSlotText,
//                                     !slot.slot_price &&
//                                        styles.unavailableSlotText,
//                                  ]}
//                               >
//                                  {slot.slot_name}
//                               </Text>
//                               {slot.slot_price && (
//                                  <Text style={styles.slotPrice}>
//                                     ${slot.slot_price}/hr
//                                  </Text>
//                               )}
//                            </TouchableOpacity>
//                         ))}
//                   </View>
//                </>
//             )}
//          </View>

//          {/* Selected Slot Details */}
//          {selectedSlotDetails && (
//             <View style={styles.selectedSlotDetails}>
//                <Text style={styles.sectionTitle}>Selected Slot Details</Text>
//                <View style={styles.detailsCard}>
//                   <Text style={styles.detailItem}>
//                      <Text style={styles.detailLabel}>Slot: </Text>
//                      {selectedSlotDetails.slot_name}
//                   </Text>
//                   <Text style={styles.detailItem}>
//                      <Text style={styles.detailLabel}>Section: </Text>
//                      {selectedSlotDetails.section_name}
//                   </Text>
//                   <Text style={styles.detailItem}>
//                      <Text style={styles.detailLabel}>Status: </Text>
//                      {selectedSlotDetails.slot_status || "Available"}
//                   </Text>
//                   <Text style={styles.detailItem}>
//                      <Text style={styles.detailLabel}>Vehicle Type: </Text>
//                      {selectedSlotDetails.slot_vehicle_type || "Any"}
//                   </Text>
//                   <Text style={styles.detailItem}>
//                      <Text style={styles.detailLabel}>Price: </Text>$
//                      {selectedSlotDetails.slot_price}/hour
//                   </Text>
//                </View>

//                <TouchableOpacity style={styles.bookButton}>
//                   <Text style={styles.bookButtonText}>Book This Slot</Text>
//                </TouchableOpacity>
//             </View>
//          )}
//       </ScrollView>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       padding: 16,
//       backgroundColor: "#f5f5f5",
//    },
//    centered: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    header: {
//       marginBottom: 20,
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 8,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    title: {
//       fontSize: 22,
//       fontWeight: "bold",
//       marginBottom: 4,
//    },
//    subtitle: {
//       fontSize: 16,
//       color: "#666",
//       marginBottom: 8,
//    },
//    bookingDetails: {
//       marginTop: 8,
//       padding: 8,
//       backgroundColor: "#f0f0f0",
//       borderRadius: 4,
//    },
//    sectionTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginTop: 16,
//       marginBottom: 8,
//    },
//    sectionScroll: {
//       flexDirection: "row",
//       marginBottom: 16,
//    },
//    sectionButton: {
//       padding: 12,
//       marginRight: 10,
//       backgroundColor: "white",
//       borderRadius: 8,
//       minWidth: 60,
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.1,
//       shadowRadius: 1,
//       elevation: 1,
//    },
//    selectedSection: {
//       backgroundColor: "#3498db",
//    },
//    sectionButtonText: {
//       fontWeight: "600",
//    },
//    selectedSectionText: {
//       color: "white",
//    },
//    sectionDescription: {
//       marginBottom: 12,
//       fontStyle: "italic",
//       color: "#666",
//    },
//    slotsContainer: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 8,
//       marginBottom: 20,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    slotsGrid: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "flex-start",
//    },
//    slotButton: {
//       width: "30%",
//       aspectRatio: 1,
//       margin: "1.5%",
//       padding: 8,
//       backgroundColor: "#e0e0e0",
//       borderRadius: 8,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    selectedSlot: {
//       backgroundColor: "#3498db",
//    },
//    unavailableSlot: {
//       backgroundColor: "#f0f0f0",
//       opacity: 0.6,
//    },
//    slotButtonText: {
//       fontWeight: "bold",
//       fontSize: 16,
//    },
//    selectedSlotText: {
//       color: "white",
//    },
//    unavailableSlotText: {
//       color: "#999",
//    },
//    slotPrice: {
//       fontSize: 12,
//       marginTop: 4,
//    },
//    selectedSlotDetails: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 8,
//       marginBottom: 20,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    detailsCard: {
//       backgroundColor: "#f8f8f8",
//       padding: 12,
//       borderRadius: 8,
//       marginBottom: 16,
//    },
//    detailItem: {
//       marginBottom: 8,
//       fontSize: 16,
//    },
//    detailLabel: {
//       fontWeight: "bold",
//    },
//    bookButton: {
//       backgroundColor: "#27ae60",
//       padding: 16,
//       borderRadius: 8,
//       alignItems: "center",
//    },
//    bookButtonText: {
//       color: "white",
//       fontWeight: "bold",
//       fontSize: 16,
//    },
//    errorText: {
//       color: "red",
//       fontSize: 16,
//       marginBottom: 8,
//    },
// });

// export default ParkingZoneViewer;

// import React, { useState, useEffect } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    TouchableOpacity,
//    ScrollView,
//    ActivityIndicator,
//    SafeAreaView,
//    StatusBar,
// } from "react-native";
// import { useQuery } from "@tanstack/react-query";
// import { supabaseClient } from "../app/lib/supabase"; // Adjust path as needed
// import { useLocalSearchParams, useRouter } from "expo-router"; // Using Expo Router for navigation

// type ParkingSlot = {
//    zone_id: string;
//    zone_name: string;
//    zone_address: string;
//    section_id: number;
//    section_name: string;
//    section_description: string;
//    slot_id: number;
//    slot_name: string;
//    slot_status: string | null;
//    slot_vehicle_type: string | null;
//    slot_price: number | null;
// };

// type Section = {
//    id: number;
//    name: string;
//    description: string;
//    slots: ParkingSlot[];
// };

// const ParkingZoneViewer: React.FC = () => {
//    const router = useRouter();
//    const { zoneId, date, arrivalTime, exitTime, vehicleType } =
//       useLocalSearchParams<{
//          zoneId: string;
//          date: string;
//          arrivalTime: string;
//          exitTime: string;
//          vehicleType: string;
//       }>();

//    const [selectedSection, setSelectedSection] = useState<number | null>(null);
//    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

//    console.log("URL Params:", {
//       zoneId,
//       vehicleType,
//       date,
//       arrivalTime,
//       exitTime,
//    });

//    // Fetch parking zone details using React Query
//    const { data, isLoading, error } = useQuery({
//       queryKey: ["parkingZoneDetails", zoneId],
//       queryFn: async () => {
//          console.log("Fetching data for zone ID:", zoneId);

//          const { data, error } = await supabaseClient.rpc(
//             "get_parking_slots_by_zone",
//             {
//                zone_id_param: zoneId,
//             }
//          );

//          if (error) {
//             console.error("Supabase RPC error:", error);
//             throw error;
//          }

//          console.log("Fetched data:", data);
//          return data as ParkingSlot[];
//       },
//       enabled: !!zoneId,
//    });

//    // Process data to group by sections
//    const sections = React.useMemo(() => {
//       if (!data) return [];

//       const sectionMap = new Map<number, Section>();

//       data.forEach((slot) => {
//          if (!sectionMap.has(slot.section_id)) {
//             sectionMap.set(slot.section_id, {
//                id: slot.section_id,
//                name: slot.section_name,
//                description: slot.section_description,
//                slots: [],
//             });
//          }

//          sectionMap.get(slot.section_id)?.slots.push(slot);
//       });

//       return Array.from(sectionMap.values());
//    }, [data]);

//    // Set first section and slot as selected by default when data loads
//    useEffect(() => {
//       if (sections.length > 0 && selectedSection === null) {
//          setSelectedSection(sections[0].id);

//          if (sections[0].slots.length > 0) {
//             setSelectedSlot(sections[0].slots[0].slot_id);
//          }
//       }
//    }, [sections, selectedSection]);

//    // Get currently selected slot details
//    const selectedSlotDetails = React.useMemo(() => {
//       if (!data || selectedSlot === null) return null;
//       return data.find((slot) => slot.slot_id === selectedSlot);
//    }, [data, selectedSlot]);

//    const handleSlotSelect = (slotId: number) => {
//       setSelectedSlot(slotId);
//       console.log("Selected slot:", slotId);
//    };

//    const handleSectionSelect = (sectionId: number) => {
//       setSelectedSection(sectionId);
//       console.log("Selected section:", sectionId);

//       // Select the first slot in the new section
//       const sectionSlots =
//          sections.find((s) => s.id === sectionId)?.slots || [];
//       if (sectionSlots.length > 0) {
//          setSelectedSlot(sectionSlots[0].slot_id);
//       } else {
//          setSelectedSlot(null);
//       }
//    };

//    // Handle booking and navigation to next screen
//    const handleBookSlot = () => {
//       if (!selectedSlotDetails) return;

//       // Navigate to booking confirmation page with all required parameters
//       router.push({
//          pathname: "/BookingSummary",
//          params: {
//             zoneId: selectedSlotDetails.zone_id,
//             zoneName: selectedSlotDetails.zone_name,
//             sectionId: selectedSlotDetails.section_id.toString(),
//             sectionName: selectedSlotDetails.section_name,
//             slotId: selectedSlotDetails.slot_id.toString(),
//             slotName: selectedSlotDetails.slot_name,
//             price: selectedSlotDetails.slot_price?.toString() || "0",
//             date: date || "",
//             arrivalTime: arrivalTime || "",
//             exitTime: exitTime || "",
//             vehicleType,
//          },
//       });
//    };

//    if (isLoading) {
//       return (
//          <SafeAreaView style={styles.safeArea}>
//             <View style={styles.centered}>
//                <ActivityIndicator size="large" color="#0059ff" />
//                <Text style={styles.loadingText}>
//                   Loading parking zone details...
//                </Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    if (error) {
//       console.error("Error fetching data:", error);
//       return (
//          <SafeAreaView style={styles.safeArea}>
//             <View style={styles.centered}>
//                <Text style={styles.errorText}>
//                   Error loading parking zone details
//                </Text>
//                <Text>{(error as Error).message}</Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    if (!data || data.length === 0) {
//       return (
//          <SafeAreaView style={styles.safeArea}>
//             <View style={styles.centered}>
//                <Text style={styles.noDataText}>
//                   No parking data found for this zone.
//                </Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    const zoneDetails = data[0];

//    return (
//       <SafeAreaView style={styles.safeArea}>
//          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//          <ScrollView style={styles.container}>
//             <View style={styles.header}>
//                <Text style={styles.title}>{zoneDetails.zone_name}</Text>
//                <Text style={styles.subtitle}>{zoneDetails.zone_address}</Text>

//                <View style={styles.bookingDetails}>
//                   <Text style={styles.bookingDetailText}>
//                      <Text style={styles.bookingDetailLabel}>Date: </Text>
//                      {date || "Not specified"}
//                   </Text>
//                   <Text style={styles.bookingDetailText}>
//                      <Text style={styles.bookingDetailLabel}>Time: </Text>
//                      {arrivalTime || "00:00"} - {exitTime || "00:00"}
//                   </Text>
//                </View>
//             </View>

//             {/* Section Selection */}
//             <Text style={styles.sectionTitle}>Select Section</Text>
//             <ScrollView
//                horizontal
//                showsHorizontalScrollIndicator={false}
//                style={styles.sectionScroll}
//             >
//                {sections.map((section) => (
//                   <TouchableOpacity
//                      key={section.id}
//                      style={[
//                         styles.sectionButton,
//                         selectedSection === section.id &&
//                            styles.selectedSection,
//                      ]}
//                      onPress={() => handleSectionSelect(section.id)}
//                   >
//                      <Text
//                         style={[
//                            styles.sectionButtonText,
//                            selectedSection === section.id &&
//                               styles.selectedSectionText,
//                         ]}
//                      >
//                         {section.name}
//                      </Text>
//                   </TouchableOpacity>
//                ))}
//             </ScrollView>

//             {/* Slots Grid */}
//             <Text style={styles.sectionTitle}>Select Parking Slot</Text>
//             <View style={styles.slotsContainer}>
//                {selectedSection !== null && (
//                   <>
//                      <Text style={styles.sectionDescription}>
//                         {sections.find((s) => s.id === selectedSection)
//                            ?.description || ""}
//                      </Text>

//                      <View style={styles.slotsGrid}>
//                         {sections
//                            .find((s) => s.id === selectedSection)
//                            ?.slots.map((slot) => (
//                               <TouchableOpacity
//                                  key={slot.slot_id}
//                                  style={[
//                                     styles.slotButton,
//                                     selectedSlot === slot.slot_id &&
//                                        styles.selectedSlot,
//                                     !slot.slot_price && styles.unavailableSlot,
//                                  ]}
//                                  onPress={() =>
//                                     slot.slot_price &&
//                                     handleSlotSelect(slot.slot_id)
//                                  }
//                                  disabled={!slot.slot_price}
//                               >
//                                  <Text
//                                     style={[
//                                        styles.slotButtonText,
//                                        selectedSlot === slot.slot_id &&
//                                           styles.selectedSlotText,
//                                        !slot.slot_price &&
//                                           styles.unavailableSlotText,
//                                     ]}
//                                  >
//                                     {slot.slot_name}
//                                  </Text>
//                                  {slot.slot_price && (
//                                     <Text style={styles.slotPrice}>
//                                        ${slot.slot_price}/hr
//                                     </Text>
//                                  )}
//                               </TouchableOpacity>
//                            ))}
//                      </View>
//                   </>
//                )}
//             </View>

//             {/* Selected Slot Details */}
//             {selectedSlotDetails && (
//                <View style={styles.selectedSlotDetails}>
//                   <Text style={styles.sectionTitle}>Selected Slot Details</Text>
//                   <View style={styles.detailsCard}>
//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Slot:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.slot_name}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Section:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.section_name}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Status:</Text>
//                         <Text style={styles.detailValue}>
//                            {selectedSlotDetails.slot_status || "Available"}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Vehicle Type:</Text>
//                         <Text style={styles.detailValue}>
//                            {/* {selectedSlotDetails.slot_vehicle_type || "Any"} */}
//                            {vehicleType}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Price:</Text>
//                         <Text style={styles.detailValue}>
//                            Rs.{selectedSlotDetails.slot_price}/hour
//                         </Text>
//                      </View>
//                   </View>

//                   <TouchableOpacity
//                      style={styles.bookButton}
//                      onPress={handleBookSlot}
//                      activeOpacity={0.8}
//                   >
//                      <Text style={styles.bookButtonText}>Book This Slot</Text>
//                   </TouchableOpacity>
//                </View>
//             )}
//          </ScrollView>
//       </SafeAreaView>
//    );
// };

// const styles = StyleSheet.create({
//    safeArea: {
//       flex: 1,
//       backgroundColor: "#f8f9fa",
//    },
//    container: {
//       flex: 1,
//       padding: 16,
//    },
//    centered: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 20,
//    },
//    header: {
//       marginBottom: 20,
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 12,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    title: {
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 4,
//       color: "#0e2140",
//    },
//    subtitle: {
//       fontSize: 16,
//       color: "#546e7a",
//       marginBottom: 12,
//    },
//    bookingDetails: {
//       marginTop: 12,
//       padding: 12,
//       backgroundColor: "#f0f7ff",
//       borderRadius: 8,
//       borderLeftWidth: 4,
//       borderLeftColor: "#0059ff",
//    },
//    bookingDetailText: {
//       fontSize: 15,
//       marginBottom: 4,
//       color: "#3a3a3a",
//    },
//    bookingDetailLabel: {
//       fontWeight: "600",
//       color: "#0e2140",
//    },
//    sectionTitle: {
//       fontSize: 18,
//       fontWeight: "bold",
//       marginTop: 20,
//       marginBottom: 12,
//       color: "#0e2140",
//    },
//    sectionScroll: {
//       flexDirection: "row",
//       marginBottom: 20,
//    },
//    sectionButton: {
//       padding: 14,
//       marginRight: 12,
//       backgroundColor: "white",
//       borderRadius: 10,
//       minWidth: 80,
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.08,
//       shadowRadius: 2,
//       elevation: 2,
//    },
//    selectedSection: {
//       backgroundColor: "#0059ff",
//    },
//    sectionButtonText: {
//       fontWeight: "600",
//       color: "#546e7a",
//    },
//    selectedSectionText: {
//       color: "white",
//    },
//    sectionDescription: {
//       marginBottom: 16,
//       fontStyle: "italic",
//       color: "#546e7a",
//       lineHeight: 20,
//    },
//    slotsContainer: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 12,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.08,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    slotsGrid: {
//       flexDirection: "row",
//       flexWrap: "wrap",
//       justifyContent: "flex-start",
//    },
//    slotButton: {
//       width: "30%",
//       aspectRatio: 1,
//       margin: "1.5%",
//       padding: 8,
//       backgroundColor: "#e8f0fe",
//       borderRadius: 10,
//       justifyContent: "center",
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.05,
//       shadowRadius: 1,
//       elevation: 1,
//    },
//    selectedSlot: {
//       backgroundColor: "#0059ff",
//       borderWidth: 0,
//    },
//    unavailableSlot: {
//       backgroundColor: "#f0f0f0",
//       opacity: 0.6,
//    },
//    slotButtonText: {
//       fontWeight: "bold",
//       fontSize: 16,
//       color: "#0e2140",
//    },
//    selectedSlotText: {
//       color: "white",
//    },
//    unavailableSlotText: {
//       color: "#999",
//    },
//    slotPrice: {
//       fontSize: 12,
//       marginTop: 4,
//       color: "#546e7a",
//    },
//    selectedSlotDetails: {
//       backgroundColor: "white",
//       padding: 16,
//       borderRadius: 12,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.08,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    detailsCard: {
//       backgroundColor: "#f8f9fa",
//       padding: 16,
//       borderRadius: 10,
//       marginBottom: 20,
//    },
//    detailRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       paddingVertical: 8,
//    },
//    detailLabel: {
//       fontWeight: "600",
//       fontSize: 16,
//       color: "#546e7a",
//       flex: 1,
//    },
//    detailValue: {
//       fontSize: 16,
//       color: "#0e2140",
//       flex: 2,
//       textAlign: "right",
//    },
//    divider: {
//       height: 1,
//       backgroundColor: "#e0e0e0",
//    },
//    bookButton: {
//       backgroundColor: "#0059ff",
//       padding: 16,
//       borderRadius: 10,
//       alignItems: "center",
//       shadowColor: "#0059ff",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 8,
//       elevation: 5,
//    },
//    bookButtonText: {
//       color: "white",
//       fontWeight: "bold",
//       fontSize: 16,
//    },
//    errorText: {
//       color: "#d32f2f",
//       fontSize: 16,
//       marginBottom: 8,
//       textAlign: "center",
//    },
//    loadingText: {
//       marginTop: 12,
//       fontSize: 16,
//       color: "#546e7a",
//    },
//    noDataText: {
//       fontSize: 16,
//       color: "#546e7a",
//       textAlign: "center",
//    },
// });

// export default ParkingZoneViewer;

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
   const { zoneId, date, arrivalTime, exitTime, vehicleType } =
      useLocalSearchParams<{
         zoneId: string;
         date: string;
         arrivalTime: string;
         exitTime: string;
         vehicleType: string;
      }>();

   const [selectedSection, setSelectedSection] = useState<number | null>(null);
   const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

   console.log("URL Params:", {
      zoneId,
      vehicleType,
      date,
      arrivalTime,
      exitTime,
   });

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

         // Find first available slot
         const firstSection = sections[0];
         const firstAvailableSlot = firstSection.slots.find(
            (slot) =>
               slot.slot_status !== "occupied" &&
               slot.slot_status !== "under review" &&
               slot.slot_price
         );

         if (firstAvailableSlot) {
            setSelectedSlot(firstAvailableSlot.slot_id);
         } else if (firstSection.slots.length > 0) {
            // Just select first slot even if unavailable
            setSelectedSlot(firstSection.slots[0].slot_id);
         }
      }
   }, [sections, selectedSection]);

   // Get currently selected slot details
   const selectedSlotDetails = React.useMemo(() => {
      if (!data || selectedSlot === null) return null;
      return data.find((slot) => slot.slot_id === selectedSlot);
   }, [data, selectedSlot]);

   // Check if a slot is bookable
   const isSlotBookable = (slot: ParkingSlot): boolean => {
      return (
         slot.slot_price !== null &&
         slot.slot_status !== "occupied" &&
         slot.slot_status !== "under review"
      );
   };

   const handleSlotSelect = (slotId: number) => {
      setSelectedSlot(slotId);
      console.log("Selected slot:", slotId);
   };

   const handleSectionSelect = (sectionId: number) => {
      setSelectedSection(sectionId);
      console.log("Selected section:", sectionId);

      // Select the first available slot in the new section
      const sectionSlots =
         sections.find((s) => s.id === sectionId)?.slots || [];
      const firstAvailableSlot = sectionSlots.find((slot) =>
         isSlotBookable(slot)
      );

      if (firstAvailableSlot) {
         setSelectedSlot(firstAvailableSlot.slot_id);
      } else if (sectionSlots.length > 0) {
         // Just select first slot even if unavailable
         setSelectedSlot(sectionSlots[0].slot_id);
      } else {
         setSelectedSlot(null);
      }
   };

   // Handle booking and navigation to next screen
   const handleBookSlot = () => {
      if (!selectedSlotDetails || !isSlotBookable(selectedSlotDetails)) return;

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
            vehicleType,
         },
      });
   };

   // Get style for a slot based on its status
   const getSlotStyle = (slot: ParkingSlot) => {
      if (selectedSlot === slot.slot_id) {
         return [styles.slotButton, styles.selectedSlot];
      }

      if (slot.slot_status === "occupied") {
         return [styles.slotButton, styles.occupiedSlot];
      }

      if (slot.slot_status === "under review") {
         return [styles.slotButton, styles.underReviewSlot];
      }

      if (!slot.slot_price) {
         return [styles.slotButton, styles.unavailableSlot];
      }

      return [styles.slotButton];
   };

   // Get text style for a slot based on its status
   const getSlotTextStyle = (slot: ParkingSlot) => {
      if (selectedSlot === slot.slot_id) {
         return [styles.slotButtonText, styles.selectedSlotText];
      }

      if (slot.slot_status === "occupied") {
         return [styles.slotButtonText, styles.occupiedSlotText];
      }

      if (slot.slot_status === "under review") {
         return [styles.slotButtonText, styles.underReviewSlotText];
      }

      if (!slot.slot_price) {
         return [styles.slotButtonText, styles.unavailableSlotText];
      }

      return [styles.slotButtonText];
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

                     {/* Slot status legend */}
                     <View style={styles.legendContainer}>
                        <View style={styles.legendItem}>
                           <View style={styles.legendColor} />
                           <Text style={styles.legendText}>Available</Text>
                        </View>
                        <View style={styles.legendItem}>
                           <View
                              style={[
                                 styles.legendColor,
                                 styles.legendOccupied,
                              ]}
                           />
                           <Text style={styles.legendText}>Occupied</Text>
                        </View>
                        <View style={styles.legendItem}>
                           <View
                              style={[
                                 styles.legendColor,
                                 styles.legendUnderReview,
                              ]}
                           />
                           <Text style={styles.legendText}>Under Review</Text>
                        </View>
                     </View>

                     <View style={styles.slotsGrid}>
                        {sections
                           .find((s) => s.id === selectedSection)
                           ?.slots.map((slot) => (
                              <TouchableOpacity
                                 key={slot.slot_id}
                                 style={getSlotStyle(slot)}
                                 onPress={() =>
                                    isSlotBookable(slot) &&
                                    handleSlotSelect(slot.slot_id)
                                 }
                                 disabled={!isSlotBookable(slot)}
                              >
                                 <Text style={getSlotTextStyle(slot)}>
                                    {slot.slot_name}
                                 </Text>
                                 {slot.slot_status === "occupied" && (
                                    <Text style={styles.statusLabel}>
                                       Occupied
                                    </Text>
                                 )}
                                 {slot.slot_status === "under review" && (
                                    <Text style={styles.statusLabel}>
                                       Under Review
                                    </Text>
                                 )}
                                 {slot.slot_price &&
                                    slot.slot_status !== "occupied" &&
                                    slot.slot_status !== "under review" && (
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
                        <Text
                           style={[
                              styles.detailValue,
                              selectedSlotDetails.slot_status === "occupied" &&
                                 styles.occupiedStatusText,
                              selectedSlotDetails.slot_status ===
                                 "under review" && styles.underReviewStatusText,
                           ]}
                        >
                           {selectedSlotDetails.slot_status || "Available"}
                        </Text>
                     </View>
                     <View style={styles.divider} />

                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Vehicle Type:</Text>
                        <Text style={styles.detailValue}>{vehicleType}</Text>
                     </View>
                     <View style={styles.divider} />

                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Price:</Text>
                        <Text style={styles.detailValue}>
                           Rs.{selectedSlotDetails.slot_price}/hour
                        </Text>
                     </View>
                  </View>

                  <TouchableOpacity
                     style={[
                        styles.bookButton,
                        !isSlotBookable(selectedSlotDetails) &&
                           styles.disabledBookButton,
                     ]}
                     onPress={handleBookSlot}
                     activeOpacity={0.8}
                     disabled={!isSlotBookable(selectedSlotDetails)}
                  >
                     <Text style={styles.bookButtonText}>
                        {isSlotBookable(selectedSlotDetails)
                           ? "Book This Slot"
                           : selectedSlotDetails.slot_status === "occupied"
                             ? "Slot is Occupied"
                             : "Slot Under Review"}
                     </Text>
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
   // Legend styles
   legendContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
      padding: 10,
      backgroundColor: "#f5f5f5",
      borderRadius: 8,
   },
   legendItem: {
      flexDirection: "row",
      alignItems: "center",
   },
   legendColor: {
      width: 14,
      height: 14,
      backgroundColor: "#e8f0fe",
      borderRadius: 3,
      marginRight: 6,
   },
   legendOccupied: {
      backgroundColor: "#ff5252",
   },
   legendUnderReview: {
      backgroundColor: "#ffc107",
   },
   legendText: {
      fontSize: 12,
      color: "#546e7a",
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
   occupiedSlot: {
      backgroundColor: "#ff5252",
   },
   underReviewSlot: {
      backgroundColor: "#ffc107",
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
   occupiedSlotText: {
      color: "white",
   },
   underReviewSlotText: {
      color: "#333",
   },
   statusLabel: {
      fontSize: 10,
      color: "white",
      textAlign: "center",
      marginTop: 2,
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
   occupiedStatusText: {
      color: "#ff5252",
      fontWeight: "bold",
   },
   underReviewStatusText: {
      color: "#ff9800",
      fontWeight: "bold",
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
   disabledBookButton: {
      backgroundColor: "#ccc",
      shadowColor: "#999",
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
