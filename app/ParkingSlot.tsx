

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
// import { useUser } from "@clerk/clerk-expo";

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

//    const { user } = useUser();
//    const email = user?.primaryEmailAddress?.emailAddress;

//    console.log("User email:", email);

//    // Add this query to fetch the user ID by email
//    const { data: userData, isLoading: userLoading } = useQuery({
//       queryKey: ["userId", email],
//       queryFn: async () => {
//          if (!email) return null;

//          console.log("Fetching user ID for email:", email);

//          const { data, error } = await supabaseClient
//             .from("users")
//             .select("id")
//             .eq("email", email)
//             .single();

//          if (error) {
//             console.error("Error fetching user ID:", error);
//             throw error;
//          }

//          console.log("User data from Supabase:", data);
//          return data;
//       },
//       enabled: !!email,
//    });

//    // You can now access the user ID with
//    const userId = userData?.id;
//    console.log("User ID:", userId);

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

//          // Find first available slot
//          const firstSection = sections[0];
//          const firstAvailableSlot = firstSection.slots.find(
//             (slot) =>
//                slot.slot_status !== "occupied" &&
//                slot.slot_status !== "under review" &&
//                slot.slot_price
//          );

//          if (firstAvailableSlot) {
//             setSelectedSlot(firstAvailableSlot.slot_id);
//          } else if (firstSection.slots.length > 0) {
//             // Just select first slot even if unavailable
//             setSelectedSlot(firstSection.slots[0].slot_id);
//          }
//       }
//    }, [sections, selectedSection]);

//    // Get currently selected slot details
//    const selectedSlotDetails = React.useMemo(() => {
//       if (!data || selectedSlot === null) return null;
//       return data.find((slot) => slot.slot_id === selectedSlot);
//    }, [data, selectedSlot]);

//    // Check if a slot is bookable
//    const isSlotBookable = (slot: ParkingSlot): boolean => {
//       return (
//          slot.slot_price !== null &&
//          slot.slot_status !== "occupied" &&
//          slot.slot_status !== "under review"
//       );
//    };

//    const handleSlotSelect = (slotId: number) => {
//       setSelectedSlot(slotId);
//       console.log("Selected slot:", slotId);
//    };

//    const handleSectionSelect = (sectionId: number) => {
//       setSelectedSection(sectionId);
//       console.log("Selected section:", sectionId);

//       // Select the first available slot in the new section
//       const sectionSlots =
//          sections.find((s) => s.id === sectionId)?.slots || [];
//       const firstAvailableSlot = sectionSlots.find((slot) =>
//          isSlotBookable(slot)
//       );

//       if (firstAvailableSlot) {
//          setSelectedSlot(firstAvailableSlot.slot_id);
//       } else if (sectionSlots.length > 0) {
//          // Just select first slot even if unavailable
//          setSelectedSlot(sectionSlots[0].slot_id);
//       } else {
//          setSelectedSlot(null);
//       }
//    };

//    // Handle booking and navigation to next screen
//    const handleBookSlot = () => {
//       if (!selectedSlotDetails || !isSlotBookable(selectedSlotDetails)) return;

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
//             userId: userId || "",
//             userEmail: email,
//          },
//       });
//    };

//    // Get style for a slot based on its status
//    const getSlotStyle = (slot: ParkingSlot) => {
//       if (selectedSlot === slot.slot_id) {
//          return [styles.slotButton, styles.selectedSlot];
//       }

//       if (slot.slot_status === "occupied") {
//          return [styles.slotButton, styles.occupiedSlot];
//       }

//       if (slot.slot_status === "under review") {
//          return [styles.slotButton, styles.underReviewSlot];
//       }

//       if (!slot.slot_price) {
//          return [styles.slotButton, styles.unavailableSlot];
//       }

//       return [styles.slotButton];
//    };

//    // Get text style for a slot based on its status
//    const getSlotTextStyle = (slot: ParkingSlot) => {
//       if (selectedSlot === slot.slot_id) {
//          return [styles.slotButtonText, styles.selectedSlotText];
//       }

//       if (slot.slot_status === "occupied") {
//          return [styles.slotButtonText, styles.occupiedSlotText];
//       }

//       if (slot.slot_status === "under review") {
//          return [styles.slotButtonText, styles.underReviewSlotText];
//       }

//       if (!slot.slot_price) {
//          return [styles.slotButtonText, styles.unavailableSlotText];
//       }

//       return [styles.slotButtonText];
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

//                      {/* Slot status legend */}
//                      <View style={styles.legendContainer}>
//                         <View style={styles.legendItem}>
//                            <View style={styles.legendColor} />
//                            <Text style={styles.legendText}>Available</Text>
//                         </View>
//                         <View style={styles.legendItem}>
//                            <View
//                               style={[
//                                  styles.legendColor,
//                                  styles.legendOccupied,
//                               ]}
//                            />
//                            <Text style={styles.legendText}>Occupied</Text>
//                         </View>
//                         <View style={styles.legendItem}>
//                            <View
//                               style={[
//                                  styles.legendColor,
//                                  styles.legendUnderReview,
//                               ]}
//                            />
//                            <Text style={styles.legendText}>Under Review</Text>
//                         </View>
//                      </View>

//                      <View style={styles.slotsGrid}>
//                         {sections
//                            .find((s) => s.id === selectedSection)
//                            ?.slots.map((slot) => (
//                               <TouchableOpacity
//                                  key={slot.slot_id}
//                                  style={getSlotStyle(slot)}
//                                  onPress={() =>
//                                     isSlotBookable(slot) &&
//                                     handleSlotSelect(slot.slot_id)
//                                  }
//                                  disabled={!isSlotBookable(slot)}
//                               >
//                                  <Text style={getSlotTextStyle(slot)}>
//                                     {slot.slot_name}
//                                  </Text>
//                                  {slot.slot_status === "occupied" && (
//                                     <Text style={styles.statusLabel}>
//                                        Occupied
//                                     </Text>
//                                  )}
//                                  {slot.slot_status === "under review" && (
//                                     <Text style={styles.statusLabel}>
//                                        Under Review
//                                     </Text>
//                                  )}
//                                  {slot.slot_price &&
//                                     slot.slot_status !== "occupied" &&
//                                     slot.slot_status !== "under review" && (
//                                        <Text style={styles.slotPrice}>
//                                           ${slot.slot_price}/hr
//                                        </Text>
//                                     )}
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
//                         <Text
//                            style={[
//                               styles.detailValue,
//                               selectedSlotDetails.slot_status === "occupied" &&
//                                  styles.occupiedStatusText,
//                               selectedSlotDetails.slot_status ===
//                                  "under review" && styles.underReviewStatusText,
//                            ]}
//                         >
//                            {selectedSlotDetails.slot_status || "Available"}
//                         </Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Vehicle Type:</Text>
//                         <Text style={styles.detailValue}>{vehicleType}</Text>
//                      </View>
//                      <View style={styles.divider} />

//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>Price:</Text>
//                         <Text style={styles.detailValue}>
//                            Rs.{selectedSlotDetails.slot_price}/hour
//                         </Text>
//                      </View>
//                      <View style={styles.detailRow}>
//                         <Text style={styles.detailLabel}>User's Email:</Text>
//                         <Text style={styles.detailValue}>{email}</Text>
//                      </View>
//                   </View>

//                   <TouchableOpacity
//                      style={[
//                         styles.bookButton,
//                         !isSlotBookable(selectedSlotDetails) &&
//                            styles.disabledBookButton,
//                      ]}
//                      onPress={handleBookSlot}
//                      activeOpacity={0.8}
//                      disabled={!isSlotBookable(selectedSlotDetails)}
//                   >
//                      <Text style={styles.bookButtonText}>
//                         {isSlotBookable(selectedSlotDetails)
//                            ? "Book This Slot"
//                            : selectedSlotDetails.slot_status === "occupied"
//                              ? "Slot is Occupied"
//                              : "Slot Under Review"}
//                      </Text>
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
//    // Legend styles
//    legendContainer: {
//       flexDirection: "row",
//       justifyContent: "space-around",
//       marginBottom: 16,
//       padding: 10,
//       backgroundColor: "#f5f5f5",
//       borderRadius: 8,
//    },
//    legendItem: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    legendColor: {
//       width: 14,
//       height: 14,
//       backgroundColor: "#e8f0fe",
//       borderRadius: 3,
//       marginRight: 6,
//    },
//    legendOccupied: {
//       backgroundColor: "#ff5252",
//    },
//    legendUnderReview: {
//       backgroundColor: "#ffc107",
//    },
//    legendText: {
//       fontSize: 12,
//       color: "#546e7a",
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
//    occupiedSlot: {
//       backgroundColor: "#ff5252",
//    },
//    underReviewSlot: {
//       backgroundColor: "#ffc107",
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
//    occupiedSlotText: {
//       color: "white",
//    },
//    underReviewSlotText: {
//       color: "#333",
//    },
//    statusLabel: {
//       fontSize: 10,
//       color: "white",
//       textAlign: "center",
//       marginTop: 2,
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
//    occupiedStatusText: {
//       color: "#ff5252",
//       fontWeight: "bold",
//    },
//    underReviewStatusText: {
//       color: "#ff9800",
//       fontWeight: "bold",
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
//    disabledBookButton: {
//       backgroundColor: "#ccc",
//       shadowColor: "#999",
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
   Alert,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../app/lib/supabase"; // Adjust path as needed
import { useLocalSearchParams, useRouter } from "expo-router"; // Using Expo Router for navigation
import { useUser } from "@clerk/clerk-expo";

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

   const { user } = useUser();
   const email = user?.primaryEmailAddress?.emailAddress;

   console.log("User email:", email);

   // Add this query to fetch the user ID by email
   const { data: userData, isLoading: userLoading } = useQuery({
      queryKey: ["userId", email],
      queryFn: async () => {
         if (!email) return null;

         console.log("Fetching user ID for email:", email);

         const { data, error } = await supabaseClient
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

         if (error) {
            console.error("Error fetching user ID:", error);
            throw error;
         }

         console.log("User data from Supabase:", data);
         return data;
      },
      enabled: !!email,
   });

   // You can now access the user ID with
   const userId = userData?.id;
   console.log("User ID:", userId);

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

   const handleSlotSelect = (slotId: number, slot: ParkingSlot) => {
      // Show alert for occupied slots
      if (slot.slot_status === "occupied") {
         Alert.alert("Slot Occupied", "This parking slot is currently occupied and cannot be booked.");
         return;
      }
      
      // Show alert for under review slots
      if (slot.slot_status === "under review") {
         Alert.alert("Slot Under Review", "This parking slot is currently under review and cannot be booked.");
         return;
      }
      
      // If slot is available, proceed with selection
      if (isSlotBookable(slot)) {
         setSelectedSlot(slotId);
         console.log("Selected slot:", slotId);
      }
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
            userId: userId || "",
            userEmail: email,
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
                                 onPress={() => handleSlotSelect(slot.slot_id, slot)}
                                 // Removed disabled property to allow slot clicks for showing messages
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
                     <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>User's Email:</Text>
                        <Text style={styles.detailValue}>{email}</Text>
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