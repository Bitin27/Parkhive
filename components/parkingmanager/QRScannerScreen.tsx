import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QRScannerScreen() {
   const [hasPermission, requestPermission] = useCameraPermissions();
   const [scannedData, setScannedData] = useState<string | null>(null);

   // Handle QR code scanning
   const handleBarCodeScanned = ({ data }: { data: string }) => {
      setScannedData(data);
      Alert.alert("QR Code Scanned", `Data: ${data}`);
   };

   // Request permissions if not granted
   if (!hasPermission) {
      return (
         <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
               We need your permission to use the camera.
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
         {!scannedData ? (
            <CameraView
               style={styles.camera}
               onBarcodeScanned={handleBarCodeScanned}
               barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
         ) : (
            <View style={styles.resultContainer}>
               <Text style={styles.resultText}>Scanned Data:</Text>
               <Text style={styles.dataText}>{scannedData}</Text>
               <TouchableOpacity
                  onPress={() => setScannedData(null)}
                  style={styles.scanAgainButton}
               >
                  <Text style={styles.buttonText}>Scan Again</Text>
               </TouchableOpacity>
            </View>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
   },
   permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
   },
   permissionText: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
   },
   permissionButton: {
      backgroundColor: "#007BFF",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
   },
   buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
   },
   camera: {
      flex: 1,
      width: "100%",
   },
   resultContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
   },
   resultText: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
   },
   dataText: {
      fontSize: 16,
      color: "#333",
      textAlign: "center",
      marginBottom: 20,
   },
   scanAgainButton: {
      backgroundColor: "#28A745",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
   },
});
