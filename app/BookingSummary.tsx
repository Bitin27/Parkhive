import React from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   SafeAreaView,
   Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface BookingSummaryProps {
   onContinue?: () => void;
   onChangePayment?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
   onChangePayment = () => {},
}) => {
   const router = useRouter();
   const onContinue = () => {
      router.push("/Eticket");
   };
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Review Summary</Text>
         </View>

         <View style={styles.content}>
            <View style={styles.parkingCard}>
               <Image
                  source={{ uri: "placeholder-parking-image" }}
                  style={styles.parkingImage}
               />
               <View style={styles.parkingInfo}>
                  <View style={styles.parkingHeader}>
                     <Text style={styles.parkingType}>Car Parking</Text>
                     <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={16} color="#FFB800" />
                        <Text style={styles.rating}>4.9</Text>
                     </View>
                  </View>
                  <Text style={styles.parkingName}>SecurePark Hub</Text>
                  <View style={styles.locationContainer}>
                     <MaterialIcons name="location-on" size={16} color="#666" />
                     <Text style={styles.location}>New York, USA</Text>
                  </View>
               </View>
            </View>

            <View style={styles.detailsSection}>
               <DetailRow label="Arriving Time" value="October 04 | 07:00 AM" />
               <DetailRow label="Exit Time" value="October 04 | 08:00 AM" />
               <DetailRow label="Vehicle" value="Toyota Fortuner (SUV)" />
               <DetailRow label="Slot" value="A06 (1st Floor)" />
            </View>

            <View style={styles.divider} />

            <View style={styles.priceSection}>
               <DetailRow label="Amount" value="$5.00 /hr" />
               <DetailRow label="Total Hours" value="01:00" />
               <DetailRow label="Fees" value="$2.00" />
               <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>$7.00</Text>
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
         </View>

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
      padding: 16,
   },
   backButton: {
      marginRight: 16,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: "600",
   },
   content: {
      flex: 1,
      padding: 16,
   },
   parkingCard: {
      flexDirection: "row",
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 12,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   parkingImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 12,
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
   },
   ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   rating: {
      marginLeft: 4,
      color: "#666",
   },
   parkingName: {
      fontSize: 18,
      fontWeight: "600",
      marginVertical: 4,
   },
   locationContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   location: {
      marginLeft: 4,
      color: "#666",
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
      color: "#666",
      fontSize: 16,
   },
   detailValue: {
      color: "#333",
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
      marginTop: 8,
   },
   totalLabel: {
      fontSize: 18,
      fontWeight: "600",
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
      borderRadius: 12,
   },
   paypalContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   paypalText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: "500",
   },
   changeText: {
      color: "#8B5CF6",
      fontSize: 16,
   },
   continueButton: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "#8B5CF6",
      alignItems: "center",
   },
   continueButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default BookingSummary;
