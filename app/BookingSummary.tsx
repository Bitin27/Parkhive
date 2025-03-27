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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

interface BookingSummaryProps {
   onChangePayment?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
   onChangePayment = () => {},
}) => {
   const router = useRouter();

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
   }>();

   // Calculate parking duration and total cost
   const parkingDetails = useMemo(() => {
      // Safely parse the hourly rate with fallback
      const hourlyRate = parseFloat(price || "0") || 20.0; // Default to $20.00 if invalid
      const hourlyAmount = hourlyRate.toFixed(2);

      // Get current time for defaults
      const now = new Date();
      const oneHourLater = new Date(now);
      oneHourLater.setHours(oneHourLater.getHours() + 1);

      // Safely format a time string from a Date object
      const formatTimeString = (date: any) => {
         return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
         });
      };

      // Default values
      const defaultArrivalTime = formatTimeString(now);
      const defaultExitTime = formatTimeString(oneHourLater);

      // Safely parse arrival time
      let arrival;
      try {
         // Try various date formats
         if (arrivalTime) {
            // First try direct parsing
            arrival = new Date(`2000/01/01 ${arrivalTime}`);

            // Check if valid
            if (isNaN(arrival.getTime())) {
               // Try extracting just the time part
               const timeMatch = arrivalTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
               if (timeMatch) {
                  const hours = parseInt(timeMatch[1]);
                  const minutes = parseInt(timeMatch[2]);
                  const period = timeMatch[3]
                     ? timeMatch[3].toUpperCase()
                     : null;

                  arrival = new Date(2000, 0, 1);
                  if (period === "PM" && hours < 12) {
                     arrival.setHours(hours + 12, minutes);
                  } else if (period === "AM" && hours === 12) {
                     arrival.setHours(0, minutes);
                  } else {
                     arrival.setHours(hours, minutes);
                  }
               } else {
                  // Fallback to current time
                  arrival = now;
               }
            }
         } else {
            arrival = now;
         }
      } catch (e) {
         // Fallback to current time on any error
         arrival = now;
      }

      // Safely parse exit time
      let exit;
      try {
         if (exitTime) {
            // First try direct parsing
            exit = new Date(`2000/01/01 ${exitTime}`);

            // Check if valid
            if (isNaN(exit.getTime())) {
               // Try extracting just the time part
               const timeMatch = exitTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
               if (timeMatch) {
                  const hours = parseInt(timeMatch[1]);
                  const minutes = parseInt(timeMatch[2]);
                  const period = timeMatch[3]
                     ? timeMatch[3].toUpperCase()
                     : null;

                  exit = new Date(2000, 0, 1);
                  if (period === "PM" && hours < 12) {
                     exit.setHours(hours + 12, minutes);
                  } else if (period === "AM" && hours === 12) {
                     exit.setHours(0, minutes);
                  } else {
                     exit.setHours(hours, minutes);
                  }
               } else {
                  // Fallback to arrival + 1 hour
                  exit = new Date(arrival);
                  exit.setHours(exit.getHours() + 1);
               }
            }
         } else {
            // Fallback to arrival + 1 hour
            exit = new Date(arrival);
            exit.setHours(exit.getHours() + 1);
         }
      } catch (e) {
         // Fallback to arrival + 1 hour on any error
         exit = new Date(arrival);
         exit.setHours(exit.getHours() + 1);
      }

      // Ensure exit time is after arrival time
      if (exit <= arrival) {
         exit = new Date(arrival);
         exit.setHours(exit.getHours() + 1);
      }

      // Calculate time difference in milliseconds
      const diffMs = exit.getTime() - arrival.getTime();

      // Convert to hours and minutes
      const durationHours = Math.floor(diffMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor(
         (diffMs % (1000 * 60 * 60)) / (1000 * 60)
      );

      // Format the duration string with safety check
      let durationString;
      try {
         durationString = `${durationHours.toString().padStart(2, "0")}:${durationMinutes.toString().padStart(2, "0")}`;
      } catch (e) {
         durationString = "01:00"; // Default to 1 hour
      }

      // Calculate total parking fee (hourly rate * duration)
      const durationInHours = Math.max(durationHours + durationMinutes / 60, 1); // Minimum 1 hour
      const parkingFee = hourlyRate * durationInHours;

      // Service fee (20% of parking fee or minimum $1)
      const serviceFee = Math.max(parkingFee * 0.2, 1.0);

      // Total amount
      const totalAmount = parkingFee + serviceFee;

      return {
         durationString,
         hourlyAmount,
         parkingFee: parkingFee.toFixed(2),
         serviceFee: serviceFee.toFixed(2),
         totalAmount: totalAmount.toFixed(2),
         formattedArrivalTime: formatTimeString(arrival),
         formattedExitTime: formatTimeString(exit),
      };
   }, [arrivalTime, exitTime, price]);

   // Format date for display
   const formattedDate = useMemo(() => {
      if (!date) return "Today";
      try {
         const dateObj = new Date(date);
         if (isNaN(dateObj.getTime())) return "Today";
         return dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
         });
      } catch (e) {
         return "Today";
      }
   }, [date]);

   const onContinue = () => {
      // Pass all data to the E-ticket screen
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
         },
      });
   };

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
                  value={`${formattedDate} | ${parkingDetails.formattedExitTime}`}
               />
               <DetailRow label="Vehicle" value={vehicleType || "Any"} />
               <DetailRow label="Slot" value={`${slotName} (${sectionName})`} />
            </View>

            <View style={styles.divider} />

            <View style={styles.priceSection}>
               <DetailRow
                  label="Amount"
                  value={`Rs${parkingDetails.hourlyAmount} /hr`}
               />
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
                     ${parkingDetails.totalAmount}
                  </Text>
               </View>
            </View>

            <View style={styles.paymentMethod}>
               <View style={styles.paypalContainer}>
                  <MaterialIcons name="payment" size={24} color="#8B5CF6" />
                  <Text style={styles.paypalText}>Paypal</Text>
               </View>
               <TouchableOpacity onPress={onChangePayment}>
                  <Text style={styles.changeText}>Change</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>

         <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>Generate E-Ticket</Text>
         </TouchableOpacity>
      </SafeAreaView>
   );
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
   paymentMethod: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#F9FAFB",
      borderRadius: 16,
      marginTop: 8,
      marginBottom: 80,
   },
   paypalContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   paypalText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "500",
      color: "#1F2937",
   },
   changeText: {
      color: "#8B5CF6",
      fontSize: 16,
      fontWeight: "500",
   },
   continueButton: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      padding: 16,
      borderRadius: 16,
      backgroundColor: "#8B5CF6",
      alignItems: "center",
      shadowColor: "#8B5CF6",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
   },
   continueButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default BookingSummary;
