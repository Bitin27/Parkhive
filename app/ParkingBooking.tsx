import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   SafeAreaView,
   TextInput,
   ScrollView,
   Platform,
   Modal,
   Button,
   Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

interface BookingProps {
   onContinue?: (bookingDetails: {
      zoneId: string;
      date: string;
      arrivalTime: string;
      exitTime?: string; // Made optional
   }) => void;
}

const ParkingBooking: React.FC<BookingProps> = ({ onContinue = () => {} }) => {
   const [date, setDate] = useState(new Date());
   const [arrivalTime, setArrivalTime] = useState(new Date());
   const [exitTime, setExitTime] = useState<Date | null>(null); // Optional exit time

   const [showDatePicker, setShowDatePicker] = useState(false);
   const [showArrivalPicker, setShowArrivalPicker] = useState(false);
   const [showExitPicker, setShowExitPicker] = useState(false);

   const router = useRouter();
   const { zoneId, vehicleType } = useLocalSearchParams<{
      zoneId: string;
      vehicleType: string;
   }>();
   console.log("Same zone id", zoneId, vehicleType);

   // Initialize with current date/time
   useEffect(() => {
      const now = new Date();
      setDate(now);
      setArrivalTime(now);
   }, []);

   // Format date for display
   const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
         weekday: "short",
         day: "numeric",
         month: "short",
      });
   };

   // Format time for display
   const formatTime = (date: Date) => {
      return date.toLocaleTimeString("en-US", {
         hour: "numeric",
         minute: "2-digit",
         hour12: true,
      });
   };

   // Function to validate if a date is in the past
   const isDateInPast = (checkDate: Date): boolean => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkDate.setHours(0, 0, 0, 0);
      return checkDate < today;
   };

   // Function to validate if time is in the past
   const isTimeInPast = (selectedDate: Date, selectedTime: Date): boolean => {
      const now = new Date();
      
      
      if (selectedDate.getDate() === now.getDate() && 
          selectedDate.getMonth() === now.getMonth() && 
          selectedDate.getFullYear() === now.getFullYear()) {
         return selectedTime < now;
      }
      
      return false;
   };

   // Function to validate exit time is after arrival time
   const isExitTimeBeforeArrival = (arrTime: Date, extTime: Date): boolean => {
      return extTime <= arrTime;
   };

   const handleContinue = () => {
      // Only proceed if arrival time is set
      if (!arrivalTime) {
         alert("Please select an arrival time");
         return;
      }

      // Validate exit time if provided
      if (exitTime && isExitTimeBeforeArrival(arrivalTime, exitTime)) {
         Alert.alert(
            "Invalid Time",
            "Exit time must be after arrival time",
            [{ text: "OK" }]
         );
         return;
      }

      router.push({
         pathname: "/ParkingSlot",
         params: {
            vehicleType,
            zoneId: zoneId,
            date: formatDate(date),
            arrivalTime: formatTime(arrivalTime),
            exitTime: exitTime ? formatTime(exitTime) : undefined,
         },
      });
      onContinue({
         zoneId: zoneId,
         date: formatDate(date),
         arrivalTime: formatTime(arrivalTime),
         exitTime: exitTime ? formatTime(exitTime) : undefined,
      });
   };

   const onDateChange = (event: any, selectedDate?: Date) => {
      if (selectedDate) {
         // Validate if date is in the past
         if (isDateInPast(new Date(selectedDate))) {
            Alert.alert(
               "Invalid Date",
               "Please select today or a future date",
               [{ text: "OK" }]
            );
            return;
         }
         
         setShowDatePicker(Platform.OS === "ios");
         setDate(selectedDate);
      } else {
         setShowDatePicker(Platform.OS === "ios");
      }
   };

   const onArrivalTimeChange = (event: any, selectedTime?: Date) => {
      if (selectedTime) {
         // Create a new date object with the selected time but keeping the selected date
         const newArrivalTime = new Date(date);
         newArrivalTime.setHours(
            selectedTime.getHours(),
            selectedTime.getMinutes(),
            0,
            0
         );
         
         // Validate if arrival time is in the past
         if (isTimeInPast(date, newArrivalTime)) {
            Alert.alert(
               "Invalid Time",
               "Please select a future time",
               [{ text: "OK" }]
            );
            return;
         }
         
         setShowArrivalPicker(Platform.OS === "ios");
         setArrivalTime(newArrivalTime);
         
         // Also check and potentially reset exit time if it's now invalid
         if (exitTime && isExitTimeBeforeArrival(newArrivalTime, exitTime)) {
            const newExitTime = new Date(newArrivalTime);
            newExitTime.setHours(newArrivalTime.getHours() + 1);
            setExitTime(newExitTime);
         }
      } else {
         setShowArrivalPicker(Platform.OS === "ios");
      }
   };

   const onExitTimeChange = (event: any, selectedTime?: Date) => {
      if (selectedTime) {
         
         const newExitTime = new Date(date);
         newExitTime.setHours(
            selectedTime.getHours(),
            selectedTime.getMinutes(),
            0,
            0
         );
         
         
         if (isExitTimeBeforeArrival(arrivalTime, newExitTime)) {
            Alert.alert(
               "Invalid Time",
               "Exit time must be after arrival time",
               [{ text: "OK" }]
            );
            return;
         }
         
         setShowExitPicker(Platform.OS === "ios");
         setExitTime(newExitTime);
      } else {
         setShowExitPicker(Platform.OS === "ios");
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView style={styles.content}>
            <View style={styles.parkingInfo}>
               <Text style={styles.parkingType}>{vehicleType} Parking</Text>
            </View>

            <View style={styles.bookingSection}>
               <Text style={styles.sectionTitle}>BOOK A SLOT</Text>

               {/* Date Input */}
               <Text style={styles.label}>Day</Text>
               <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
               >
                  <Text style={styles.inputText}>{formatDate(date)}</Text>
                  <MaterialIcons
                     name="calendar-today"
                     size={20}
                     color="#8B5CF6"
                  />
               </TouchableOpacity>

               {/* Arrival Time Input */}
               <Text style={styles.label}>Arrival Time</Text>
               <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowArrivalPicker(true)}
               >
                  <Text style={styles.inputText}>
                     {formatTime(arrivalTime)}
                  </Text>
                  <MaterialIcons name="access-time" size={20} color="#8B5CF6" />
               </TouchableOpacity>

               {/* Exit Time Input (Optional) */}
               <Text style={styles.label}>Exit Time (Optional)</Text>
               <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowExitPicker(true)}
               >
                  <Text style={styles.inputText}>
                     {exitTime ? formatTime(exitTime) : "Not specified"}
                  </Text>
                  <MaterialIcons name="access-time" size={20} color="#8B5CF6" />
               </TouchableOpacity>

               {/* Clear exit time if set */}
               {exitTime && (
                  <TouchableOpacity
                     style={styles.clearButton}
                     onPress={() => setExitTime(null)}
                  >
                     <Text style={styles.clearButtonText}>Clear Exit Time</Text>
                  </TouchableOpacity>
               )}
            </View>

            <TouchableOpacity
               style={styles.continueButton}
               onPress={handleContinue}
            >
               <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>

            {/* Date/Time Pickers */}
            {showDatePicker &&
               (Platform.OS === "ios" ? (
                  <Modal
                     transparent={true}
                     visible={showDatePicker}
                     animationType="slide"
                  >
                     <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                           <DateTimePicker
                              testID="datePicker"
                              value={date}
                              mode="date"
                              display="spinner"
                              onChange={onDateChange}
                              minimumDate={new Date()} // Set minimum date to today
                           />
                           <Button
                              title="Done"
                              onPress={() => setShowDatePicker(false)}
                           />
                        </View>
                     </View>
                  </Modal>
               ) : (
                  <DateTimePicker
                     testID="datePicker"
                     value={date}
                     mode="date"
                     display="default"
                     onChange={onDateChange}
                     minimumDate={new Date()} // Set minimum date to today
                  />
               ))}

            {showArrivalPicker &&
               (Platform.OS === "ios" ? (
                  <Modal
                     transparent={true}
                     visible={showArrivalPicker}
                     animationType="slide"
                  >
                     <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                           <DateTimePicker
                              testID="arrivalTimePicker"
                              value={arrivalTime}
                              mode="time"
                              display="spinner"
                              onChange={onArrivalTimeChange}
                           />
                           <Button
                              title="Done"
                              onPress={() => setShowArrivalPicker(false)}
                           />
                        </View>
                     </View>
                  </Modal>
               ) : (
                  <DateTimePicker
                     testID="arrivalTimePicker"
                     value={arrivalTime}
                     mode="time"
                     display="default"
                     onChange={onArrivalTimeChange}
                  />
               ))}

            {showExitPicker &&
               (Platform.OS === "ios" ? (
                  <Modal
                     transparent={true}
                     visible={showExitPicker}
                     animationType="slide"
                  >
                     <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                           <DateTimePicker
                              testID="exitTimePicker"
                              value={exitTime || new Date()}
                              mode="time"
                              display="spinner"
                              onChange={onExitTimeChange}
                           />
                           <Button
                              title="Done"
                              onPress={() => setShowExitPicker(false)}
                           />
                        </View>
                     </View>
                  </Modal>
               ) : (
                  <DateTimePicker
                     testID="exitTimePicker"
                     value={exitTime || new Date()}
                     mode="time"
                     display="default"
                     onChange={onExitTimeChange}
                  />
               ))}
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   content: {
      padding: 16,
   },
   parkingInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
   },
   parkingType: {
      color: "#8B5CF6",
      fontSize: 16,
   },
   bookingSection: {
      marginBottom: 24,
   },
   sectionTitle: {
      fontSize: 14,
      color: "#666",
      marginBottom: 16,
   },
   label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 12,
   },
   inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: "#F3F4F6",
      borderRadius: 12,
      marginBottom: 16,
   },
   inputText: {
      fontSize: 16,
      color: "#333",
   },
   continueButton: {
      backgroundColor: "#8B5CF6",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 24,
   },
   continueButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
   clearButton: {
      alignSelf: "flex-end",
      marginBottom: 16,
   },
   clearButtonText: {
      color: "#8B5CF6",
      fontSize: 14,
   },
   centeredView: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
   },
   modalView: {
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
   },
});

export default ParkingBooking;