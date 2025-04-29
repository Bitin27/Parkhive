
import React, { useState, useEffect } from "react";
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Modal,
   ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

interface ScanData {
   ticketId: string;
   name: string;
   vehicleType: string;
   parkingZone: string;
   parkingSection: string;
   parkingSlot: string;
   arrivalTime: string;
   exitTime: string;
   date: string;
   totalAmount: string;
   paymentMethod: string;
   paymentStatus: string;
   timestamp: string;
   userId: string;
}

export default function QRScannerScreen({ navigation }: { navigation: any }) {
   const [hasPermission, requestPermission] = useCameraPermissions();
   const [scanning, setScanning] = useState(true);
   const [scanData, setScanData] = useState<ScanData | null>(null);
   const [loading, setLoading] = useState(false);

   // Handle QR code scanning
   const handleBarCodeScanned = ({ data }: { data: string }) => {
      try {
         setLoading(true);
         setScanning(false);

         // Parse the JSON data
         const parsedData = JSON.parse(data);
         setScanData(parsedData);

         setLoading(false);
      } catch (error) {
         setLoading(false);
         alert("Invalid QR code format");
         setScanning(true);
      }
   };

   // Request permissions if not granted
   if (!hasPermission) {
      return (
         <View style={styles.permissionContainer}>
            <Ionicons name="scan-outline" size={60} color="#007BFF" />
            <Text style={styles.permissionText}>
               Camera permission is required to scan QR codes
            </Text>
            <TouchableOpacity
               onPress={requestPermission}
               style={styles.permissionButton}
            >
               <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         {scanning ? (
            <>
               <View style={styles.cameraContainer}>
                  <CameraView
                     style={styles.camera}
                     onBarcodeScanned={handleBarCodeScanned}
                     barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                  />
                  <View style={styles.overlay}>
                     <View style={styles.scanFrame}>
                        <View style={styles.cornerTL} />
                        <View style={styles.cornerTR} />
                        <View style={styles.cornerBL} />
                        <View style={styles.cornerBR} />
                     </View>
                     <Text style={styles.scanText}>
                        Position the QR code within the frame
                     </Text>
                  </View>
               </View>
            </>
         ) : (
            <View style={styles.resultContainer}>
               {loading ? (
                  <ActivityIndicator size="large" color="#007BFF" />
               ) : scanData ? (
                  <>
                     <View style={styles.resultCard}>
                        <View style={styles.resultHeader}>
                           <Text style={styles.resultTitle}>Scanned Data</Text>
                        </View>
                        <View style={styles.resultBody}>
                           <DetailRow
                              label="Ticket ID"
                              value={scanData.ticketId}
                           />
                           <DetailRow label="Name" value={scanData.name} />
                           <DetailRow
                              label="Vehicle Type"
                              value={scanData.vehicleType}
                           />
                           <DetailRow
                              label="Location"
                              value={`${scanData.parkingZone}, Section ${scanData.parkingSection}, Slot ${scanData.parkingSlot}`}
                           />
                           <DetailRow
                              label="Arrival Time"
                              value={scanData.arrivalTime}
                           />
                           <DetailRow
                              label="Exit Time"
                              value={scanData.exitTime}
                           />
                           <DetailRow
                              label="Date"
                              value={
                                 scanData.date !== "Invalid Date"
                                    ? scanData.date
                                    : "Today"
                              }
                           />
                           <DetailRow
                              label="Amount"
                              value={`₹${scanData.totalAmount}`}
                              highlight={true}
                           />
                           <DetailRow
                              label="Payment"
                              value={scanData.paymentStatus}
                              valueColor={
                                 scanData.paymentStatus === "Paid"
                                    ? "#28A745"
                                    : "#dc3545"
                              }
                           />
                        </View>
                     </View>
                     <TouchableOpacity
                        onPress={() => setScanning(true)}
                        style={styles.scanAgainButton}
                     >
                        <Text style={styles.buttonText}>Scan Again</Text>
                     </TouchableOpacity>
                  </>
               ) : (
                  <Text style={styles.errorText}>No data received</Text>
               )}
            </View>
         )}
      </View>
   );
}

// Component for displaying each detail row
const DetailRow = ({
   label,
   value,
   highlight = false,
   valueColor = "#333",
}: {
   label: string;
   value: string;
   highlight?: boolean;
   valueColor?: string;
}) => (
   <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text
         style={[
            styles.detailValue,
            highlight && styles.highlightValue,
            { color: valueColor },
         ]}
      >
         {value}
      </Text>
   </View>
);

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: "#fff",
   },
   permissionText: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 20,
      marginBottom: 30,
      color: "#555",
   },
   permissionButton: {
      backgroundColor: "#007BFF",
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 8,
      elevation: 2,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
   cameraContainer: {
      flex: 1,
      position: "relative",
   },
   camera: {
      flex: 1,
      width: "100%",
   },
   overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
   },
   scanFrame: {
      width: 250,
      height: 250,
      position: "relative",
   },
   cornerTL: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 30,
      height: 30,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderColor: "#fff",
   },
   cornerTR: {
      position: "absolute",
      top: 0,
      right: 0,
      width: 30,
      height: 30,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderColor: "#fff",
   },
   cornerBL: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: 30,
      height: 30,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderColor: "#fff",
   },
   cornerBR: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderColor: "#fff",
   },
   scanText: {
      color: "#fff",
      fontSize: 14,
      marginTop: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
   },
   resultContainer: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      justifyContent: "center",
   },
   resultCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      width: "100%",
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
   },
   resultHeader: {
      backgroundColor: "#2471A3",
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#eaeaea",
   },
   resultTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#fff",
      textAlign: "center",
   },
   resultBody: {
      padding: 20,
   },
   detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#eaeaea",
   },
   detailLabel: {
      fontSize: 14,
      color: "#666",
      flex: 1,
   },
   detailValue: {
      fontSize: 14,
      color: "#333",
      fontWeight: "500",
      flex: 1,
      textAlign: "right",
   },
   highlightValue: {
      fontSize: 16,
      fontWeight: "bold",
   },
   scanAgainButton: {
      backgroundColor: "#28A745",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 8,
      marginTop: 30,
      minWidth: 150,
      alignItems: "center",
      elevation: 2,
   },
   errorText: {
      fontSize: 16,
      color: "#dc3545",
      marginBottom: 20,
   },
});
