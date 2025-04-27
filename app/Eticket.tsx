

// import React from "react";
// import {
//    View,
//    Text,
//    TouchableOpacity,
//    StyleSheet,
//    SafeAreaView,
//    ScrollView,
//    StatusBar,
//    ActivityIndicator,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import QRCode from "react-native-qrcode-svg";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useUser } from "@clerk/clerk-expo";
// import { isLoaded as isFontLoaded } from "expo-font";

// const ETicket: React.FC = () => {
//    const router = useRouter();
//    const { user, isLoaded: isUserLoaded } = useUser();

//    // Only try to access user data when it's fully loaded
//    const fullName =
//       isUserLoaded && user
//          ? user.fullName || user.firstName || "Guest"
//          : "Loading...";

//    console.log("ETICkET", fullName, isUserLoaded);

//    // Retrieve all parameters from the previous screen
//    const {
//       zoneId,
//       zoneName,
//       sectionId,
//       sectionName,
//       slotId,
//       slotName,
//       price,
//       date,
//       arrivalTime,
//       exitTime,
//       vehicleType,
//       totalAmount,
//       paymentMethod,
//       isExitTimeProvided,
//    } = useLocalSearchParams<{
//       zoneId: string;
//       zoneName: string;
//       sectionId: string;
//       sectionName: string;
//       slotId: string;
//       slotName: string;
//       price: string;
//       date: string;
//       arrivalTime: string;
//       exitTime: string;
//       vehicleType: string;
//       totalAmount: string;
//       paymentMethod: string;
//       isExitTimeProvided: string;
//    }>();

//    console.log("This is from Eticket", date)

//    // Show loading state while user data is being fetched
//    if (!isUserLoaded) {
//       return (
//          <SafeAreaView style={styles.container}>
//             <View style={styles.loadingContainer}>
//                <ActivityIndicator size="large" color="#8B5CF6" />
//                <Text style={styles.loadingText}>
//                   Loading user information...
//                </Text>
//             </View>
//          </SafeAreaView>
//       );
//    }

//    // Prepare ticket data for QR code and display
//    const ticketData = {
//       ticketId: `TK-${Date.now().toString().slice(-6)}`,
//       name: fullName,
//       vehicleType: vehicleType || "Any",
//       parkingZone: zoneName || "Unknown Zone",
//       parkingSection: sectionName || "Unknown Section",
//       parkingSlot: slotName || "Unknown Slot",
//       arrivalTime: arrivalTime || "Not specified",
//       exitTime: isExitTimeProvided === "true" ? exitTime : "To be determined",
//       date: date || "Today",
//       totalAmount: totalAmount || "To be calculated",
//       paymentMethod: paymentMethod || "cash",
//       paymentStatus: paymentMethod === "cash" ? "Pending" : "Paid",
//       timestamp: new Date().toISOString(),
//    };

//    // Generate QR code data
//    const qrCodeData = JSON.stringify({
//       ...ticketData,
//       userId: user?.id || "guest",
//    });

//    const handleNavigate = () => {
//       // Navigate to map/directions (implement this feature later)
//       // For now, just go back to home
//       router.push("/");
//    };

//    return (
//       <SafeAreaView style={styles.container}>
//          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//          <View style={styles.header}>
//             <Text style={styles.headerTitle}>Your E-Ticket</Text>
//          </View>

//          <ScrollView style={styles.content}>
//             {/* Ticket ID */}
//             <View style={styles.ticketIdContainer}>
//                <Text style={styles.ticketIdLabel}>Ticket ID</Text>
//                <Text style={styles.ticketIdValue}>{ticketData.ticketId}</Text>
//             </View>

//             {/* QR Code */}
//             <View style={styles.qrContainer}>
//                <QRCode value={qrCodeData} size={200} backgroundColor="white" />
//                <Text style={styles.qrHint}>
//                   Show this QR code at the parking entrance
//                </Text>
//             </View>

//             {/* Payment Status Badge */}
//             <View
//                style={[
//                   styles.paymentStatusBadge,
//                   paymentMethod === "cash"
//                      ? styles.cashPaymentBadge
//                      : styles.esewaPaymentBadge,
//                ]}
//             >
//                <MaterialIcons
//                   name={paymentMethod === "cash" ? "payments" : "payment"}
//                   size={18}
//                   color="#FFF"
//                />
//                <Text style={styles.paymentStatusText}>
//                   {paymentMethod === "cash"
//                      ? "Cash Payment - Pay on Arrival"
//                      : "Paid with eSewa"}
//                </Text>
//             </View>

//             {/* Ticket Details */}
//             <View style={styles.ticketDetails}>
//                <View style={styles.detailRow}>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Name</Text>
//                      <Text style={styles.value}>{ticketData.name}</Text>
//                   </View>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Vehicle Type</Text>
//                      <Text style={styles.value}>{ticketData.vehicleType}</Text>
//                   </View>
//                </View>

//                <View style={styles.detailRow}>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Parking Zone</Text>
//                      <Text style={styles.value} numberOfLines={1}>
//                         {ticketData.parkingZone}
//                      </Text>
//                   </View>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Parking Slot</Text>
//                      <Text style={styles.value}>
//                         {`${ticketData.parkingSlot} (${ticketData.parkingSection})`}
//                      </Text>
//                   </View>
//                </View>

//                <View style={styles.detailRow}>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Arrival Time</Text>
//                      <Text style={styles.value}>{ticketData.arrivalTime}</Text>
//                   </View>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Exit Time</Text>
//                      <Text style={styles.value}>{ticketData.exitTime}</Text>
//                   </View>
//                </View>

//                <View style={styles.detailRow}>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Date</Text>
//                      <Text style={styles.value}>{ticketData.date}</Text>
//                   </View>
//                   <View style={styles.detailColumn}>
//                      <Text style={styles.label}>Amount</Text>
//                      <Text style={styles.value}>
//                         {isExitTimeProvided === "true"
//                            ? `Rs ${ticketData.totalAmount}`
//                            : "To be calculated"}
//                      </Text>
//                   </View>
//                </View>
//             </View>

//             {/* Cash Payment Instructions */}
//             {paymentMethod === "cash" && (
//                <View style={styles.paymentInstructions}>
//                   <MaterialIcons name="info" size={24} color="#8B5CF6" />
//                   <Text style={styles.instructionsText}>
//                      Please pay the amount in cash upon arrival at the parking
//                      location. The parking attendant will validate your ticket.
//                   </Text>
//                </View>
//             )}

//             {/* Navigation Button */}
//             <TouchableOpacity
//                style={styles.navigateButton}
//                onPress={handleNavigate}
//             >
//                <MaterialIcons name="directions" size={18} color="#FFF" />
//                <Text style={styles.navigateButtonText}>
//                   Navigate to Parking Location
//                </Text>
//             </TouchableOpacity>

//             {/* Save Ticket Button */}
//             <TouchableOpacity
//                style={styles.saveButton}
//                onPress={() => {
//                   // Save ticket functionality to be implemented
//                   alert("Ticket saved to your account");
//                }}
//             >
//                <MaterialIcons name="save-alt" size={18} color="#8B5CF6" />
//                <Text style={styles.saveButtonText}>
//                   Save Ticket to Your Account
//                </Text>
//             </TouchableOpacity>
//          </ScrollView>
//       </SafeAreaView>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#fff",
//    },
//    header: {
//       flexDirection: "row",
//       alignItems: "center",
//       paddingVertical: 16,
//       paddingHorizontal: 20,
//       borderBottomWidth: 1,
//       borderBottomColor: "#F3F4F6",
//    },
//    headerTitle: {
//       fontSize: 20,
//       fontWeight: "600",
//       color: "#1F2937",
//    },
//    content: {
//       flex: 1,
//       padding: 20,
//    },
//    loadingContainer: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    loadingText: {
//       marginTop: 16,
//       fontSize: 16,
//       color: "#6B7280",
//    },
//    ticketIdContainer: {
//       alignItems: "center",
//       marginBottom: 16,
//    },
//    ticketIdLabel: {
//       fontSize: 14,
//       color: "#6B7280",
//    },
//    ticketIdValue: {
//       fontSize: 18,
//       fontWeight: "600",
//       color: "#1F2937",
//    },
//    qrContainer: {
//       alignItems: "center",
//       justifyContent: "center",
//       padding: 24,
//       backgroundColor: "#fff",
//       borderRadius: 16,
//       marginBottom: 24,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 3 },
//       shadowOpacity: 0.1,
//       shadowRadius: 6,
//       elevation: 5,
//    },
//    qrHint: {
//       marginTop: 12,
//       fontSize: 14,
//       color: "#6B7280",
//       textAlign: "center",
//    },
//    paymentStatusBadge: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: 10,
//       borderRadius: 10,
//       marginBottom: 24,
//    },
//    cashPaymentBadge: {
//       backgroundColor: "#F59E0B", // Amber color for cash
//    },
//    esewaPaymentBadge: {
//       backgroundColor: "#60B74C", // Green color for esewa
//    },
//    paymentStatusText: {
//       color: "#FFF",
//       fontWeight: "600",
//       marginLeft: 8,
//    },
//    ticketDetails: {
//       backgroundColor: "#fff",
//       borderRadius: 16,
//       padding: 20,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 3 },
//       shadowOpacity: 0.1,
//       shadowRadius: 6,
//       elevation: 5,
//       marginBottom: 24,
//    },
//    detailRow: {
//       flexDirection: "row",
//       marginBottom: 20,
//    },
//    detailColumn: {
//       flex: 1,
//    },
//    label: {
//       color: "#6B7280",
//       fontSize: 14,
//       marginBottom: 4,
//    },
//    value: {
//       color: "#1F2937",
//       fontSize: 16,
//       fontWeight: "500",
//    },
//    paymentInstructions: {
//       flexDirection: "row",
//       backgroundColor: "#F3F4FF",
//       padding: 16,
//       borderRadius: 12,
//       marginBottom: 24,
//       alignItems: "center",
//    },
//    instructionsText: {
//       flex: 1,
//       marginLeft: 10,
//       color: "#4B5563",
//       fontSize: 14,
//    },
//    navigateButton: {
//       backgroundColor: "#8B5CF6",
//       flexDirection: "row",
//       padding: 16,
//       borderRadius: 12,
//       alignItems: "center",
//       justifyContent: "center",
//       marginBottom: 16,
//       shadowColor: "#8B5CF6",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 6,
//       elevation: 8,
//    },
//    navigateButtonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "600",
//       marginLeft: 8,
//    },
//    saveButton: {
//       backgroundColor: "#F9FAFB",
//       flexDirection: "row",
//       padding: 16,
//       borderRadius: 12,
//       alignItems: "center",
//       justifyContent: "center",
//       borderWidth: 1,
//       borderColor: "#E5E7EB",
//       marginBottom: 32,
//    },
//    saveButtonText: {
//       color: "#8B5CF6",
//       fontSize: 16,
//       fontWeight: "600",
//       marginLeft: 8,
//    },
// });

// export default ETicket;






import React from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   SafeAreaView,
   ScrollView,
   StatusBar,
   ActivityIndicator,
   Alert,
   Share,
   Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { isLoaded as isFontLoaded } from "expo-font";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const ETicket: React.FC = () => {
   const router = useRouter();
   const { user, isLoaded: isUserLoaded } = useUser();

   // Only try to access user data when it's fully loaded
   const fullName =
      isUserLoaded && user
         ? user.fullName || user.firstName || "Guest"
         : "Loading...";

   console.log("ETICkET", fullName, isUserLoaded);

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
      totalAmount,
      paymentMethod,
      isExitTimeProvided,
      userEmail,
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
      totalAmount: string;
      paymentMethod: string;
      isExitTimeProvided: string;
      userEmail : string,
   }>();

   console.log("This is from Eticket", date)

   // QR code ref to access its methods
   const qrCodeRef = React.useRef();

   // Show loading state while user data is being fetched
   if (!isUserLoaded) {
      return (
         <SafeAreaView style={styles.container}>
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#8B5CF6" />
               <Text style={styles.loadingText}>
                  Loading user information...
               </Text>
            </View>
         </SafeAreaView>
      );
   }

   // Prepare ticket data for QR code and display
   const ticketData = {
      ticketId: `TK-${Date.now().toString().slice(-6)}`,
      name: fullName,
      vehicleType: vehicleType || "Any",
      parkingZone: zoneName || "Unknown Zone",
      parkingSection: sectionName || "Unknown Section",
      parkingSlot: slotName || "Unknown Slot",
      arrivalTime: arrivalTime || "Not specified",
      exitTime: isExitTimeProvided === "true" ? exitTime : "To be determined",
      date: date ,
      totalAmount: totalAmount || "To be calculated",
      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentMethod === "cash" ? "Pending" : "Paid",
      timestamp: new Date().toISOString(),
      userEmail : userEmail
   };

   // Generate QR code data
   const qrCodeData = JSON.stringify({
      ...ticketData,
      userId: user?.id,
   });

  // Function to save ticket to mobile device
const saveTicketToMobile = async () => {
   try {
     // Request permissions first
     const { status } = await MediaLibrary.requestPermissionsAsync();
     
     if (status !== 'granted') {
       Alert.alert('Permission Required', 'Please grant permission to save the ticket to your device.');
       return;
     }
 
     // For simplicity, we'll share the ticket details instead of trying to save a file
     const ticketDetailsText = `
 Parking Ticket
 -----------------
 Ticket ID: ${ticketData.ticketId}
 Name: ${ticketData.name}
 Vehicle Type: ${ticketData.vehicleType}
 Parking Zone: ${ticketData.parkingZone}
 Parking Section: ${ticketData.parkingSection}
 Parking Slot: ${ticketData.parkingSlot}
 Date: ${ticketData.date}
 Arrival Time: ${ticketData.arrivalTime}
 Exit Time: ${ticketData.exitTime}
 Total Amount: ${isExitTimeProvided === "true" ? `Rs ${ticketData.totalAmount}` : "To be calculated"}
 Payment Method: ${paymentMethod}
 Payment Status: ${ticketData.paymentStatus}
     `;
     
     // Use Share API instead, which is more reliable across platforms
     await Share.share({
       message: ticketDetailsText,
       title: `Parking Ticket - ${ticketData.ticketId}`,
     });
     
     Alert.alert('Success', 'Ticket information ready to share or save');
   } catch (error) {
     console.error('Error sharing ticket:', error);
     Alert.alert('Error', 'Failed to share ticket information. Please try again.');
   }
 };

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Your E-Ticket</Text>
         </View>

         <ScrollView style={styles.content}>
            {/* Ticket ID */}
            <View style={styles.ticketIdContainer}>
               <Text style={styles.ticketIdLabel}>Ticket ID</Text>
               <Text style={styles.ticketIdValue}>{ticketData.ticketId}</Text>
            </View>

            {/* QR Code */}
            <View style={styles.qrContainer}>
               <QRCode 
                  value={qrCodeData} 
                  size={200} 
                  backgroundColor="white"
                  getRef={(ref) => (qrCodeRef.current = ref)}
               />
               <Text style={styles.qrHint}>
                  Show this QR code at the parking entrance
               </Text>
            </View>

            {/* Payment Status Badge */}
            <View
               style={[
                  styles.paymentStatusBadge,
                  paymentMethod === "cash"
                     ? styles.cashPaymentBadge
                     : styles.esewaPaymentBadge,
               ]}
            >
               <MaterialIcons
                  name={paymentMethod === "cash" ? "payments" : "payment"}
                  size={18}
                  color="#FFF"
               />
               <Text style={styles.paymentStatusText}>
                  {paymentMethod === "cash"
                     ? "Cash Payment - Pay on Arrival"
                     : "Paid with stripe"}
               </Text>
            </View>

            {/* Ticket Details */}
            <View style={styles.ticketDetails}>
               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Name</Text>
                     <Text style={styles.value}>{ticketData.name}</Text>
                  </View>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Vehicle Type</Text>
                     <Text style={styles.value}>{ticketData.vehicleType}</Text>
                  </View>
               </View>

               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Parking Zone</Text>
                     <Text style={styles.value} numberOfLines={1}>
                        {ticketData.parkingZone}
                     </Text>
                  </View>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Parking Slot</Text>
                     <Text style={styles.value}>
                        {`${ticketData.parkingSlot} (${ticketData.parkingSection})`}
                     </Text>
                  </View>
               </View>

               <View style={styles.detailRow}>
                  <View style={styles.detailColumn}>
                     <Text style={styles.label}>Arrival Time</Text>
                     <Text style={styles.value}>{ticketData.arrivalTime}</Text>
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
                     <Text style={styles.label}>Amount</Text>
                     <Text style={styles.value}>
                        {isExitTimeProvided === "true"
                           ? `Rs ${ticketData.totalAmount}`
                           : "To be calculated"}
                     </Text>
                  </View>
               </View>
            </View>

            {/* Cash Payment Instructions */}
            {paymentMethod === "cash" && (
               <View style={styles.paymentInstructions}>
                  <MaterialIcons name="info" size={24} color="#8B5CF6" />
                  <Text style={styles.instructionsText}>
                     Please pay the amount in cash upon arrival at the parking
                     location. The parking attendant will validate your ticket.
                  </Text>
               </View>
            )}

            {/* Save Ticket Button */}
            <TouchableOpacity
               style={styles.saveButton}
               onPress={saveTicketToMobile}
            >
               <MaterialIcons name="save-alt" size={18} color="#8B5CF6" />
               <Text style={styles.saveButtonText}>
                  Save Ticket to Your Device
               </Text>
            </TouchableOpacity>
         </ScrollView>
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
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: "#6B7280",
   },
   ticketIdContainer: {
      alignItems: "center",
      marginBottom: 16,
   },
   ticketIdLabel: {
      fontSize: 14,
      color: "#6B7280",
   },
   ticketIdValue: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1F2937",
   },
   qrContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      backgroundColor: "#fff",
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
   },
   qrHint: {
      marginTop: 12,
      fontSize: 14,
      color: "#6B7280",
      textAlign: "center",
   },
   paymentStatusBadge: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      borderRadius: 10,
      marginBottom: 24,
   },
   cashPaymentBadge: {
      backgroundColor: "#F59E0B", // Amber color for cash
   },
   esewaPaymentBadge: {
      backgroundColor: "#60B74C", // Green color for stripe
   },
   paymentStatusText: {
      color: "#FFF",
      fontWeight: "600",
      marginLeft: 8,
   },
   ticketDetails: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
      marginBottom: 24,
   },
   detailRow: {
      flexDirection: "row",
      marginBottom: 20,
   },
   detailColumn: {
      flex: 1,
   },
   label: {
      color: "#6B7280",
      fontSize: 14,
      marginBottom: 4,
   },
   value: {
      color: "#1F2937",
      fontSize: 16,
      fontWeight: "500",
   },
   paymentInstructions: {
      flexDirection: "row",
      backgroundColor: "#F3F4FF",
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
      alignItems: "center",
   },
   instructionsText: {
      flex: 1,
      marginLeft: 10,
      color: "#4B5563",
      fontSize: 14,
   },
   saveButton: {
      backgroundColor: "#F9FAFB",
      flexDirection: "row",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      marginBottom: 32,
   },
   saveButtonText: {
      color: "#8B5CF6",
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
   },
});

export default ETicket;