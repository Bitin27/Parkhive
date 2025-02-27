import React, { useState } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
   Alert,
} from "react-native";

const ParkingSlotSelector = () => {
   const [selectedSlot, setSelectedSlot] = useState(null);

   // Mock data for parking slots
   const parkingSections = {
      A: Array(10)
         .fill(null)
         .map((_, i) => ({ id: `A${i + 1}`, occupied: Math.random() > 0.7 })),
      B: Array(10)
         .fill(null)
         .map((_, i) => ({ id: `B${i + 1}`, occupied: Math.random() > 0.7 })),
      C: Array(10)
         .fill(null)
         .map((_, i) => ({ id: `C${i + 1}`, occupied: Math.random() > 0.7 })),
      D: Array(10)
         .fill(null)
         .map((_, i) => ({ id: `D${i + 1}`, occupied: Math.random() > 0.7 })),
      
      E: Array(10)
         .fill(null)
         .map((_, i) => ({ id: `E${i + 1}`, occupied: Math.random() > 0.7 })),
   };

   const handleSlotSelection = (slotId: any, occupied: any) => {
      if (occupied) {
         Alert.alert("Slot Occupied", "Please select another parking slot");
         return;
      }
      setSelectedSlot(slotId);
      Alert.alert(
         "Confirm Selection",
         `Do you want to park in slot ${slotId}?`,
         [
            {
               text: "Cancel",
               onPress: () => setSelectedSlot(null),
               style: "cancel",
            },
            {
               text: "Confirm",
               onPress: () => console.log("Parking slot confirmed:", slotId),
            },
         ]
      );
   };

   const renderParkingSection = (section: any, slots: any) => (
      <View style={styles.sectionContainer} key={section}>
         <Text style={styles.sectionTitle}>Section {section}</Text>
         <View style={styles.slotsContainer}>
            {slots.map((slot: any) => (
               <TouchableOpacity
                  key={slot.id}
                  style={[
                     styles.slot,
                     slot.occupied && styles.occupiedSlot,
                     selectedSlot === slot.id && styles.selectedSlot,
                  ]}
                  onPress={() => handleSlotSelection(slot.id, slot.occupied)}
               >
                  <Text
                     style={[
                        styles.slotText,
                        slot.occupied && styles.occupiedSlotText,
                        selectedSlot === slot.id && styles.selectedSlotText,
                     ]}
                  >
                     {slot.id}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </View>
   );

   return (
      <ScrollView style={styles.container}>
         <Text style={styles.header}>Select Parking Slot</Text>
         {Object.entries(parkingSections).map(([section, slots]) =>
            renderParkingSection(section, slots)
         )}
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   header: {
      fontSize: 24,
      fontWeight: "bold",
      padding: 20,
      textAlign: "center",
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
   },
   sectionContainer: {
      marginVertical: 10,
      paddingHorizontal: 15,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 10,
      color: "#333",
   },
   slotsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      gap: 10,
   },
   slot: {
      width: 70,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#ddd",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
   },
   slotText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
   },
   occupiedSlot: {
      backgroundColor: "#f0f0f0",
      borderColor: "#ccc",
   },
   occupiedSlotText: {
      color: "#999",
   },
   selectedSlot: {
      backgroundColor: "#007AFF",
      borderColor: "#0055FF",
   },
   selectedSlotText: {
      color: "#fff",
   },
});

export default ParkingSlotSelector;