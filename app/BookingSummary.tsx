// import React from "react";
// import {
//    View,
//    Text,
//    TouchableOpacity,
//    StyleSheet,
//    SafeAreaView,
//    Image,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// interface BookingSummaryProps {
//    onContinue?: () => void;
//    onChangePayment?: () => void;
// }

// const BookingSummary: React.FC<BookingSummaryProps> = ({
//    onChangePayment = () => {},
// }) => {
//    const router = useRouter();
//    const onContinue = () => {
//       router.push("/Eticket");
//    };
//    return (
//       <SafeAreaView style={styles.container}>
//          <View style={styles.header}>
//             <Text style={styles.headerTitle}>Review Summary</Text>
//          </View>

//          <View style={styles.content}>
//             <View style={styles.parkingCard}>
//                <Image
//                   source={{ uri: "placeholder-parking-image" }}
//                   style={styles.parkingImage}
//                />
//                <View style={styles.parkingInfo}>
//                   <View style={styles.parkingHeader}>
//                      <Text style={styles.parkingType}>Car Parking</Text>
//                      <View style={styles.ratingContainer}>
//                         <MaterialIcons name="star" size={16} color="#FFB800" />
//                         <Text style={styles.rating}>4.9</Text>
//                      </View>
//                   </View>
//                   <Text style={styles.parkingName}>SecurePark Hub</Text>
//                   <View style={styles.locationContainer}>
//                      <MaterialIcons name="location-on" size={16} color="#666" />
//                      <Text style={styles.location}>New York, USA</Text>
//                   </View>
//                </View>
//             </View>

//             <View style={styles.detailsSection}>
//                <DetailRow label="Arriving Time" value="October 04 | 07:00 AM" />
//                <DetailRow label="Exit Time" value="October 04 | 08:00 AM" />
//                <DetailRow label="Vehicle" value="Toyota Fortuner (SUV)" />
//                <DetailRow label="Slot" value="A06 (1st Floor)" />
//             </View>

//             <View style={styles.divider} />

//             <View style={styles.priceSection}>
//                <DetailRow label="Amount" value="$5.00 /hr" />
//                <DetailRow label="Total Hours" value="01:00" />
//                <DetailRow label="Fees" value="$2.00" />
//                <View style={styles.totalRow}>
//                   <Text style={styles.totalLabel}>Total</Text>
//                   <Text style={styles.totalAmount}>$7.00</Text>
//                </View>
//             </View>

//             <View style={styles.paymentMethod}>
//                <View style={styles.paypalContainer}>
//                   <MaterialIcons name="payment" size={24} color="#8B5CF6" />
//                   <Text style={styles.paypalText}>Paypal</Text>
//                </View>
//                <TouchableOpacity onPress={onChangePayment}>
//                   <Text style={styles.changeText}>Change</Text>
//                </TouchableOpacity>
//             </View>
//          </View>

//          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
//             <Text style={styles.continueButtonText}>Generate E-Ticket</Text>
//          </TouchableOpacity>
//       </SafeAreaView>
//    );
// };

// const DetailRow: React.FC<{ label: string; value: string }> = ({
//    label,
//    value,
// }) => (
//    <View style={styles.detailRow}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={styles.detailValue}>{value}</Text>
//    </View>
// );

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#fff",
//    },
//    header: {
//       flexDirection: "row",
//       alignItems: "center",
//       padding: 16,
//    },
//    backButton: {
//       marginRight: 16,
//    },
//    headerTitle: {
//       fontSize: 18,
//       fontWeight: "600",
//    },
//    content: {
//       flex: 1,
//       padding: 16,
//    },
//    parkingCard: {
//       flexDirection: "row",
//       backgroundColor: "#fff",
//       borderRadius: 12,
//       padding: 12,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    parkingImage: {
//       width: 80,
//       height: 80,
//       borderRadius: 8,
//       marginRight: 12,
//    },
//    parkingInfo: {
//       flex: 1,
//    },
//    parkingHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//    },
//    parkingType: {
//       color: "#8B5CF6",
//       fontSize: 14,
//    },
//    ratingContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    rating: {
//       marginLeft: 4,
//       color: "#666",
//    },
//    parkingName: {
//       fontSize: 18,
//       fontWeight: "600",
//       marginVertical: 4,
//    },
//    locationContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    location: {
//       marginLeft: 4,
//       color: "#666",
//    },
//    detailsSection: {
//       marginBottom: 24,
//    },
//    detailRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginBottom: 16,
//    },
//    detailLabel: {
//       color: "#666",
//       fontSize: 16,
//    },
//    detailValue: {
//       color: "#333",
//       fontSize: 16,
//       fontWeight: "500",
//    },
//    divider: {
//       height: 1,
//       backgroundColor: "#E5E7EB",
//       marginBottom: 24,
//    },
//    priceSection: {
//       marginBottom: 24,
//    },
//    totalRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginTop: 8,
//    },
//    totalLabel: {
//       fontSize: 18,
//       fontWeight: "600",
//    },
//    totalAmount: {
//       fontSize: 18,
//       fontWeight: "600",
//       color: "#8B5CF6",
//    },
//    paymentMethod: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       padding: 16,
//       backgroundColor: "#F9FAFB",
//       borderRadius: 12,
//    },
//    paypalContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    paypalText: {
//       marginLeft: 8,
//       fontSize: 16,
//       fontWeight: "500",
//    },
//    changeText: {
//       color: "#8B5CF6",
//       fontSize: 16,
//    },
//    continueButton: {
//       margin: 16,
//       padding: 16,
//       borderRadius: 12,
//       backgroundColor: "#8B5CF6",
//       alignItems: "center",
//    },
//    continueButtonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "600",
//    },
// });

// export default BookingSummary;
import React, { useMemo } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   SafeAreaView,
   ScrollView,
   StatusBar,
   Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabaseClient } from "../app/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface BookingSummaryProps {
   onChangePayment?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
   onChangePayment = () => {},
}) => {
   const router = useRouter();
   const queryClient = useQueryClient();

   // Retrieve all parameters from the previous screen
   const {
      zoneId,
      zoneName,
      sectionId,
      sectionName,
      slotId,
      slotName,
      price,
      date,
      arrivalTime,
      exitTime,
      vehicleType,
      userId,
      vehicleId,
   } = useLocalSearchParams<{
      zoneId: string;
      zoneName: string;
      sectionId: string;
      sectionName: string;
      slotId: string;
      slotName: string;
      price: string;
      date: string;
      arrivalTime: string;
      exitTime: string;
      vehicleType: string;
      userId: string;
      vehicleId: string;
   }>();

   // Helper function to safely parse dates and times
   const parseDateTime = (dateStr?: string, timeStr?: string): Date => {
      const now = new Date();

      // Parse date (fallback to today)
      let dateObj = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(dateObj.getTime())) dateObj = new Date();

      // If no time provided, use current time
      if (!timeStr) return dateObj;

      // Parse time (HH:MM or HH:MM AM/PM)
      const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
      if (!timeMatch) return dateObj;

      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3]?.toUpperCase();

      // Convert 12-hour to 24-hour format
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      // Set time on date object
      dateObj.setHours(hours, minutes, 0, 0);
      return dateObj;
   };

   // Calculate parking details
   const parkingDetails = useMemo(() => {
      // Parse and validate inputs
      const arrivalDateTime = parseDateTime(date, arrivalTime);
      const exitDateTime = exitTime ? parseDateTime(date, exitTime) : undefined;
      const isExitTimeProvided = Boolean(exitTime && exitTime.trim() !== "");

      // Calculate duration if exit time provided
      let durationString = "TBD";
      let totalAmount = "0.00";
      let parkingFee = "0.00";
      let serviceFee = "0.00";

      if (isExitTimeProvided && exitDateTime) {
         const diffMs = exitDateTime.getTime() - arrivalDateTime.getTime();
         const durationHours = Math.max(diffMs / (1000 * 60 * 60), 1); // Min 1 hour
         const hourlyRate = parseFloat(price || "20");
         parkingFee = (hourlyRate * durationHours).toFixed(2);
         serviceFee = (parseFloat(parkingFee) * 0.2).toFixed(2); // 20% service fee
         totalAmount = (
            parseFloat(parkingFee) + parseFloat(serviceFee)
         ).toFixed(2);

         const hours = Math.floor(durationHours);
         const minutes = Math.floor((durationHours % 1) * 60);
         durationString = `${hours}h ${minutes}m`;
      }

      // Format times for display
      const formatDisplayTime = (date: Date) => {
         return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
         });
      };

      return {
         arrivalDateTime,
         exitDateTime,
         isExitTimeProvided,
         formattedArrivalTime: formatDisplayTime(arrivalDateTime),
         formattedExitTime: exitDateTime
            ? formatDisplayTime(exitDateTime)
            : "TBD",
         durationString,
         totalAmount,
         parkingFee,
         serviceFee,
         hourlyRate: parseFloat(price || "20").toFixed(2),
      };
   }, [date, arrivalTime, exitTime, price]);

   // Format date for display
   const formattedDate = useMemo(() => {
      if (!date) return "Today";
      try {
         const dateObj = new Date(date);
         return dateObj.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
         });
      } catch {
         return "Today";
      }
   }, [date]);

   // Generate QR code data
   const generateQRCodeData = () => ({
      bookingId: `BK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      zone: zoneName,
      section: sectionName,
      slot: slotName,
      vehicle: vehicleType,
      arrivalTime: parkingDetails.formattedArrivalTime,
      exitTime: parkingDetails.formattedExitTime,
      totalAmount: parkingDetails.totalAmount,
   });

   // Create booking mutation with proper time formatting
   const createBookingMutation = useMutation({
      mutationFn: async (paymentMethod: string) => {
         // Format time for time with time zone column (start_time)
         const formatTimeForDB = (date: Date) => {
            return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:00+00`;
         };

         // Format timestamp for timestamp with time zone columns
         const formatTimestampForDB = (date: Date) => {
            return date.toISOString();
         };

         const { data, error } = await supabaseClient
            .from("bookings")
            .insert({
               zone_id: zoneId,
               start_time: formatTimeForDB(parkingDetails.arrivalDateTime),
               user_id: userId || null,
               vehicle_id: vehicleId || null,
               slot_id: parseInt(slotId),
               estimated_end_time:
                  parkingDetails.isExitTimeProvided &&
                  parkingDetails.exitDateTime
                     ? formatTimestampForDB(parkingDetails.exitDateTime)
                     : null,
               actual_end_time: null,
               total_amount: parseFloat(parkingDetails.totalAmount),
               additional_charges: 0,
               qr_code_data: generateQRCodeData(),
               payment_method: paymentMethod,
            })
            .select();

         if (error) {
            console.error("Booking error details:", {
               message: error.message,
               details: error.details,
               code: error.code,
               hint: error.hint,
            });
            throw new Error(`Booking failed: ${error.message}`);
         }

         // Update slot status
         const { error: slotError } = await supabaseClient
            .from("parking_slots")
            .update({ status: "occupied" })
            .eq("id", parseInt(slotId));

         if (slotError)
            throw new Error(`Slot update failed: ${slotError.message}`);

         return data;
      },
      onSuccess: (data) => {
         queryClient.invalidateQueries({ queryKey: ["parkingSlots"] });
         queryClient.invalidateQueries({ queryKey: ["bookings"] });

         router.push({
            pathname: "/Eticket",
            params: {
               zoneId,
               zoneName,
               sectionId,
               sectionName,
               slotId,
               slotName,
               price,
               date: formattedDate,
               arrivalTime: parkingDetails.formattedArrivalTime,
               exitTime: parkingDetails.formattedExitTime,
               vehicleType,
               totalAmount: parkingDetails.totalAmount,
               paymentMethod: "cash",
            },
         });
      },
      onError: (error) => {
         Alert.alert(
            "Booking Error",
            error.message.includes("invalid input syntax")
               ? "Please check your time settings and try again"
               : error.message
         );
      },
   });

   const handleEsewaPay = () => {
      router.push({
         pathname: "/esewa",
         params: {
            zoneId,
            zoneName,
            sectionId,
            sectionName,
            slotId,
            slotName,
            price,
            date: formattedDate,
            arrivalTime: parkingDetails.formattedArrivalTime,
            exitTime: parkingDetails.formattedExitTime,
            vehicleType,
            totalAmount: parkingDetails.totalAmount,
         },
      });
   };

   const handleCashPay = () => {
      createBookingMutation.mutate("cash");
   };

   const DetailRow: React.FC<{ label: string; value: string }> = ({
      label,
      value,
   }) => (
      <View style={styles.detailRow}>
         <Text style={styles.detailLabel}>{label}</Text>
         <Text style={styles.detailValue}>{value}</Text>
      </View>
   );

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Review Summary</Text>
         </View>

         <ScrollView style={styles.content}>
            <View style={styles.parkingCard}>
               <View style={styles.parkingImageContainer}>
                  <MaterialIcons
                     name="local-parking"
                     size={40}
                     color="#8B5CF6"
                  />
               </View>
               <View style={styles.parkingInfo}>
                  <View style={styles.parkingHeader}>
                     <Text style={styles.parkingType}>
                        {vehicleType !== "Any"
                           ? `${vehicleType} Parking`
                           : "Parking"}
                     </Text>
                  </View>
                  <Text style={styles.parkingName}>
                     {zoneName || "Parking Zone"}
                  </Text>
                  <View style={styles.locationContainer}>
                     <MaterialIcons name="location-on" size={16} color="#666" />
                     <Text style={styles.location} numberOfLines={1}>
                        {`Section ${sectionName}`}
                     </Text>
                  </View>
               </View>
            </View>

            <View style={styles.detailsSection}>
               <DetailRow
                  label="Arriving Time"
                  value={`${formattedDate} | ${parkingDetails.formattedArrivalTime}`}
               />
               <DetailRow
                  label="Exit Time"
                  value={
                     parkingDetails.isExitTimeProvided
                        ? `${formattedDate} | ${parkingDetails.formattedExitTime}`
                        : "To be determined by parking manager"
                  }
               />
               <DetailRow label="Vehicle" value={vehicleType || "Any"} />
               <DetailRow label="Slot" value={`${slotName} (${sectionName})`} />
            </View>

            <View style={styles.divider} />

            <View style={styles.priceSection}>
               <DetailRow
                  label="Amount"
                  value={`Rs${parkingDetails.hourlyRate} /hr`}
               />

               {parkingDetails.isExitTimeProvided ? (
                  <>
                     <DetailRow
                        label="Total Hours"
                        value={parkingDetails.durationString}
                     />
                     <DetailRow
                        label="Parking Fee"
                        value={`Rs ${parkingDetails.parkingFee}`}
                     />
                     <DetailRow
                        label="Service Fee"
                        value={`Rs ${parkingDetails.serviceFee}`}
                     />
                     <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalAmount}>
                           Rs{parkingDetails.totalAmount}
                        </Text>
                     </View>
                  </>
               ) : (
                  <View style={styles.pendingCalculationContainer}>
                     <Text style={styles.pendingCalculationText}>
                        Total will be calculated when exit time is determined
                     </Text>
                  </View>
               )}
            </View>
         </ScrollView>

         <View style={styles.paymentButtonsContainer}>
            <TouchableOpacity
               style={[styles.paymentButton, styles.esewaButton]}
               onPress={handleEsewaPay}
               disabled={createBookingMutation.isPending}
            >
               <Text style={styles.paymentButtonText}>Pay with Esewa</Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.paymentButton, styles.cashButton]}
               onPress={handleCashPay}
               disabled={createBookingMutation.isPending}
            >
               <Text style={styles.paymentButtonText}>
                  {createBookingMutation.isPending
                     ? "Processing..."
                     : "Pay in Cash"}
               </Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#F3F4F6",
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#1F2937",
   },
   content: {
      flex: 1,
      padding: 20,
   },
   parkingCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
   },
   parkingImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: "#F3F4F6",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
   },
   parkingInfo: {
      flex: 1,
   },
   parkingHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   parkingType: {
      color: "#8B5CF6",
      fontSize: 14,
      fontWeight: "500",
   },
   parkingName: {
      fontSize: 18,
      fontWeight: "600",
      marginVertical: 6,
      color: "#1F2937",
   },
   locationContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   location: {
      marginLeft: 4,
      color: "#6B7280",
      fontSize: 14,
   },
   detailsSection: {
      marginBottom: 24,
   },
   detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
   },
   detailLabel: {
      color: "#6B7280",
      fontSize: 16,
   },
   detailValue: {
      color: "#1F2937",
      fontSize: 16,
      fontWeight: "500",
   },
   divider: {
      height: 1,
      backgroundColor: "#E5E7EB",
      marginBottom: 24,
   },
   priceSection: {
      marginBottom: 24,
   },
   totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
   },
   totalLabel: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1F2937",
   },
   totalAmount: {
      fontSize: 18,
      fontWeight: "600",
      color: "#8B5CF6",
   },
   pendingCalculationContainer: {
      backgroundColor: "#F3F4F6",
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
   },
   pendingCalculationText: {
      color: "#6B7280",
      fontSize: 14,
      textAlign: "center",
      fontStyle: "italic",
   },
   paymentButtonsContainer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      flexDirection: "row",
      justifyContent: "space-between",
   },
   paymentButton: {
      width: "48%",
      padding: 16,
      borderRadius: 16,
      alignItems: "center",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
   },
   esewaButton: {
      backgroundColor: "#60B74C",
      shadowColor: "#60B74C",
   },
   cashButton: {
      backgroundColor: "#8B5CF6",
      shadowColor: "#8B5CF6",
   },
   paymentButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default BookingSummary;
