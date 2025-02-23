import React from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

interface ETicketProps {
   ticketData: {
      name: string;
      vehicleNumber: string;
      parkingName: string;
      parkingSlot: string;
      arriveTime: string;
      exitTime: string;
      date: string;
      totalPayment: string;
   };
}

const ETicket: React.FC<ETicketProps> = (
   {
      //   ticketData,
      //   onNavigate = () => {},
   }
) => {
   const ticketData = {
      name: "Esther Howard",
      vehicleNumber: "GR 456-EFGH",
      parkingName: "SecurePark H...",
      parkingSlot: "A06 (1st Floor)",
      arriveTime: "07:00 AM",
      exitTime: "08:00 AM",
      date: "04 Oct",
      totalPayment: "$7.00",
   };

   const handleNavigate = () => {
      // Handle navigation to parking slot
   };
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Unique Generated E-Ticket </Text>
         </View>

         <View style={styles.content}>
            <View style={styles.qrContainer}>
               <QRCode
                  value={JSON.stringify(ticketData)}
                  size={200}
                  backgroundColor="white"
               />
            </View>

            <View style={styles.ticketDetails}>
               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Name</Text>
                     <Text style={styles.value}>{ticketData.name}</Text>
                  </View>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Vehicle Number Plate</Text>
                     <Text style={styles.value}>
                        {ticketData.vehicleNumber}
                     </Text>
                  </View>
               </View>

               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Parking</Text>
                     <Text style={styles.value} numberOfLines={1}>
                        {ticketData.parkingName}
                     </Text>
                  </View>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Parking Slot</Text>
                     <Text style={styles.value}>{ticketData.parkingSlot}</Text>
                  </View>
               </View>

               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Arrive Time</Text>
                     <Text style={styles.value}>{ticketData.arriveTime}</Text>
                  </View>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Exit Time</Text>
                     <Text style={styles.value}>{ticketData.exitTime}</Text>
                  </View>
               </View>

               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Date</Text>
                     <Text style={styles.value}>{ticketData.date}</Text>
                  </View>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Total Payment</Text>
                     <Text style={styles.value}>{ticketData.totalPayment}</Text>
                  </View>
               </View>
            </View>

            <TouchableOpacity
               style={styles.navigateButton}
               onPress={handleNavigate}
            >
               <Text style={styles.navigateButtonText}>
                  Navigate to Parking Slot
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
   qrContainer: {
      alignItems: "center",
      padding: 24,
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   ticketDetails: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   detailRow: {
      flexDirection: "row",
      marginBottom: 24,
   },
   detailColumn: {
      flex: 1,
   },
   label: {
      color: "#666",
      fontSize: 14,
      marginBottom: 4,
   },
   value: {
      color: "#333",
      fontSize: 16,
      fontWeight: "500",
   },
   navigateButton: {
      backgroundColor: "#8B5CF6",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 24,
   },
   navigateButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default ETicket;
