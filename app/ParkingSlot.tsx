import React, { useState } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
   SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ParkingSlot {
   id: string;
   isOccupied: boolean;
   section: string;
}

interface FloorData {
   id: string;
   name: string;
   slots: ParkingSlot[];
}

const floors: FloorData[] = [
   {
      id: "1",
      name: "1st Floor",
      slots: [
         { id: "A03", isOccupied: true, section: "A" },
         { id: "A04", isOccupied: true, section: "A" },
         { id: "A06", isOccupied: false, section: "A" },
         { id: "B01", isOccupied: true, section: "B" },
         { id: "B02", isOccupied: true, section: "B" },
         { id: "B06", isOccupied: false, section: "B" },
      ],
   },
   {
      id: "2",
      name: "2nd Floor",
      slots: [
         // Add slots for 2nd floor
      ],
   },
   {
      id: "3",
      name: "3rd Floor",
      slots: [
         // Add slots for 3rd floor
      ],
   },
];

const ParkingSlotSelection: React.FC = () => {
   const [selectedFloor, setSelectedFloor] = useState("1");
   const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

   const router = useRouter();
   const handleSlot = () => {
      router.push("/BookingSummary");
   };
   const renderParkingSlot = (slot: ParkingSlot) => {
      const isSelected = selectedSlot === slot.id;
      const isAvailable = !slot.isOccupied;

      return (
         <TouchableOpacity
            key={slot.id}
            style={[
               styles.parkingSlot,
               isSelected && styles.selectedSlot,
               !isAvailable && styles.occupiedSlot,
            ]}
            onPress={() => isAvailable && setSelectedSlot(slot.id)}
            disabled={!isAvailable}
         >
            {slot.isOccupied && (
               <View style={styles.carIcon}>
                  <MaterialIcons name="directions-car" size={24} color="#666" />
               </View>
            )}
            <Text
               style={[
                  styles.slotText,
                  isSelected && styles.selectedSlotText,
                  !isAvailable && styles.occupiedSlotText,
               ]}
            >
               {slot.id}
            </Text>
         </TouchableOpacity>
      );
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Parking Slot</Text>
         </View>

         <View style={styles.floorSelector}>
            {floors.map((floor) => (
               <TouchableOpacity
                  key={floor.id}
                  style={[
                     styles.floorTab,
                     selectedFloor === floor.id && styles.selectedFloorTab,
                  ]}
                  onPress={() => setSelectedFloor(floor.id)}
               >
                  <Text
                     style={[
                        styles.floorTabText,
                        selectedFloor === floor.id &&
                           styles.selectedFloorTabText,
                     ]}
                  >
                     {floor.name}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>

         <ScrollView style={styles.slotsContainer}>
            <View style={styles.entryIndicator}>
               <Text style={styles.entryText}>Entry</Text>
               <MaterialIcons name="arrow-downward" size={24} color="#666" />
            </View>

            <View style={styles.parkingLayout}>
               <View style={styles.drivingPath} />

               <View style={styles.sectionContainer}>
                  <Text style={styles.sectionLabel}>A</Text>
                  <View style={styles.slotsRow}>
                     {floors[0].slots
                        .filter((slot) => slot.section === "A")
                        .map(renderParkingSlot)}
                  </View>
               </View>

               <View style={styles.drivingArrow}>
                  <MaterialIcons name="arrow-forward" size={24} color="#666" />
               </View>

               <View style={styles.sectionContainer}>
                  <Text style={styles.sectionLabel}>B</Text>
                  <View style={styles.slotsRow}>
                     {floors[0].slots
                        .filter((slot) => slot.section === "B")
                        .map(renderParkingSlot)}
                  </View>
               </View>
            </View>
         </ScrollView>

         <TouchableOpacity
            style={[
               styles.continueButton,
               !selectedSlot && styles.continueButtonDisabled,
            ]}
            disabled={!selectedSlot}
            onPress={handleSlot}
         >
            <Text style={styles.continueButtonText}>Continue</Text>
         </TouchableOpacity>
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
   floorSelector: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
   },
   floorTab: {
      marginRight: 24,
      paddingBottom: 8,
   },
   selectedFloorTab: {
      borderBottomWidth: 2,
      borderBottomColor: "#8B5CF6",
   },
   floorTabText: {
      color: "#666",
      fontSize: 16,
   },
   selectedFloorTabText: {
      color: "#8B5CF6",
      fontWeight: "500",
   },
   slotsContainer: {
      flex: 1,
   },
   entryIndicator: {
      alignItems: "center",
      padding: 16,
   },
   entryText: {
      fontSize: 16,
      color: "#666",
      marginBottom: 8,
   },
   parkingLayout: {
      padding: 16,
   },
   drivingPath: {
      position: "absolute",
      left: 40,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: "#E5E7EB",
   },
   sectionContainer: {
      marginBottom: 32,
   },
   sectionLabel: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 12,
   },
   slotsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
   },
   parkingSlot: {
      width: "45%",
      aspectRatio: 2,
      marginHorizontal: "2.5%",
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: "#F3F4F6",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E5E7EB",
   },
   selectedSlot: {
      backgroundColor: "#EEE7FE",
      borderColor: "#8B5CF6",
   },
   occupiedSlot: {
      backgroundColor: "#F3F4F6",
      borderColor: "#E5E7EB",
   },
   slotText: {
      fontSize: 16,
      color: "#333",
   },
   selectedSlotText: {
      color: "#8B5CF6",
   },
   occupiedSlotText: {
      color: "#666",
   },
   carIcon: {
      marginBottom: 4,
   },
   drivingArrow: {
      alignSelf: "center",
      marginVertical: 8,
   },
   continueButton: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: "#8B5CF6",
      alignItems: "center",
   },
   continueButtonDisabled: {
      backgroundColor: "#E5E7EB",
   },
   continueButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default ParkingSlotSelection;
