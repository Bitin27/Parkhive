// import React, { useState } from "react";
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

// interface BookingProps {
//    onContinue?: (bookingDetails: {
//       date: string;
//       arrivalTime: string;
//       exitTime: string;
//    }) => void;
// }

// const ParkingBooking: React.FC<BookingProps> = ({ onContinue = () => {} }) => {
//    const [selectedDate, setSelectedDate] = useState("1st March");
//    const [selectedArrivalTime, setSelectedArrivalTime] = useState("7:00 AM");
//    const [selectedExitTime, setSelectedExitTime] = useState("8:00 AM");

//    const dates = [
//       { day: "Fri", date: "1 Mar" },
//       { day: "Sat", date: "2 Mar" },
//       { day: "Sun", date: "3 Mar" },
//       { day: "Mon", date: "4 Mar" },
//       { day: "Tue", date: "5 Mar" },
//    ];
   
//    const arrivalTimes = ["7:00 AM", "7:30 AM", "8:00 AM"];
//    const exitTimes = ["7:30 AM", "8:00 AM", "8:30 AM"];
//    const router = useRouter();
//    const handleContinue = () => {
//       router.push("/ParkingSlot");
//       onContinue({
//          date: selectedDate,
//          arrivalTime: selectedArrivalTime,
//          exitTime: selectedExitTime,
//       });
//    };

//    return (
//       <SafeAreaView style={styles.container}>
//          <View style={styles.header}>
//             <TouchableOpacity style={styles.backButton}>
//                <MaterialIcons name="arrow-back" size={24} color="black" />
//             </TouchableOpacity>
//          </View>

//          <View style={styles.content}>
//             <View style={styles.parkingInfo}>
//                <Text style={styles.parkingType}>Car Parking</Text>
//                <View style={styles.ratingContainer}>
//                   <MaterialIcons name="star" size={16} color="#FFB800" />
//                   <Text style={styles.rating}>4.5 (365 reviews)</Text>
//                </View>
//             </View>

//             <Text style={styles.parkingName}>Dharahara Underground Parking</Text>
//             <Text style={styles.address}>P826+3VR, Sundhara Rd</Text>

//             <View style={styles.bookingSection}>
//                <Text style={styles.sectionTitle}>BOOK A SLOT</Text>

//                <Text style={styles.label}>Day</Text>
//                <View style={styles.optionsRow}>
//                   {dates.map(({ day, date }) => (
//                      <TouchableOpacity
//                         key={date}
//                         style={[
//                            styles.dateOption,
//                            selectedDate === date && styles.selectedOption,
//                         ]}
//                         onPress={() => setSelectedDate(date)}
//                      >
//                         <Text
//                            style={[
//                               styles.dayText,
//                               selectedDate === date && styles.selectedText,
//                            ]}
//                         >
//                            {day}
//                         </Text>
//                         <Text
//                            style={[
//                               styles.dateText,
//                               selectedDate === date && styles.selectedText,
//                            ]}
//                         >
//                            {date}
//                         </Text>
//                      </TouchableOpacity>
//                   ))}
//                </View>

//                <Text style={styles.label}>Arriving Time</Text>
//                <View style={styles.optionsRow}>
//                   {arrivalTimes.map((time) => (
//                      <TouchableOpacity
//                         key={time}
//                         style={[
//                            styles.timeOption,
//                            selectedArrivalTime === time &&
//                               styles.selectedOption,
//                         ]}
//                         onPress={() => setSelectedArrivalTime(time)}
//                      >
//                         <Text
//                            style={[
//                               styles.timeText,
//                               selectedArrivalTime === time &&
//                                  styles.selectedText,
//                            ]}
//                         >
//                            {time}
//                         </Text>
//                      </TouchableOpacity>
//                   ))}
//                </View>

//                <Text style={styles.label}>Exit Time</Text>
//                <View style={styles.optionsRow}>
//                   {exitTimes.map((time) => (
//                      <TouchableOpacity
//                         key={time}
//                         style={[
//                            styles.timeOption,
//                            selectedExitTime === time && styles.selectedOption,
//                         ]}
//                         onPress={() => setSelectedExitTime(time)}
//                      >
//                         <Text
//                            style={[
//                               styles.timeText,
//                               selectedExitTime === time && styles.selectedText,
//                            ]}
//                         >
//                            {time}
//                         </Text>
//                      </TouchableOpacity>
//                   ))}
//                </View>
//             </View>

//             <TouchableOpacity
//                style={styles.continueButton}
//                onPress={handleContinue}
//             >
//                <Text style={styles.continueButtonText}>Continue</Text>
//             </TouchableOpacity>
//          </View>
//       </SafeAreaView>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#fff",
//    },
//    header: {
//       padding: 16,
//    },
//    backButton: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: "#fff",
//       justifyContent: "center",
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    content: {
//       padding: 16,
//    },
//    parkingInfo: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 8,
//    },
//    parkingType: {
//       color: "#8B5CF6",
//       fontSize: 16,
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
//       fontSize: 24,
//       fontWeight: "600",
//       marginBottom: 4,
//    },
//    address: {
//       color: "#666",
//       marginBottom: 24,
//    },
//    bookingSection: {
//       marginBottom: 24,
//    },
//    sectionTitle: {
//       fontSize: 14,
//       color: "#666",
//       marginBottom: 16,
//    },
//    label: {
//       fontSize: 16,
//       fontWeight: "500",
//       marginBottom: 12,
//    },
//    optionsRow: {
//       flexDirection: "row",
//       marginBottom: 24,
//    },
//    dateOption: {
//       flex: 1,
//       marginRight: 8,
//       padding: 12,
//       borderRadius: 12,
//       backgroundColor: "#F3F4F6",
//       alignItems: "center",
//    },
//    timeOption: {
//       flex: 1,
//       marginRight: 8,
//       padding: 12,
//       borderRadius: 12,
//       backgroundColor: "#F3F4F6",
//       alignItems: "center",
//    },
//    selectedOption: {
//       backgroundColor: "#8B5CF6",
//    },
//    dayText: {
//       fontSize: 14,
//       color: "#666",
//    },
//    dateText: {
//       fontSize: 14,
//       fontWeight: "500",
//       marginTop: 4,
//    },
//    timeText: {
//       fontSize: 14,
//       fontWeight: "500",
//    },
//    selectedText: {
//       color: "#fff",
//    },
//    continueButton: {
//       backgroundColor: "#8B5CF6",
//       padding: 16,
//       borderRadius: 12,
//       alignItems: "center",
//    },
//    continueButtonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "600",
//    },
// });

// export default ParkingBooking;


import React, { useState } from "react";
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
   const { zoneId } = useLocalSearchParams<{ zoneId: string }>();
   console.log("Same zone id", zoneId);

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

   const handleContinue = () => {
      // Only proceed if arrival time is set
      if (!arrivalTime) {
         alert("Please select an arrival time");
         return;
      }

      router.push({
         pathname: "/ParkingSlot",
         params: {
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
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === "ios");
      setDate(currentDate);
   };

   const onArrivalTimeChange = (event: any, selectedTime?: Date) => {
      const currentTime = selectedTime || arrivalTime;
      setShowArrivalPicker(Platform.OS === "ios");
      setArrivalTime(currentTime);
   };

   const onExitTimeChange = (event: any, selectedTime?: Date) => {
      const currentTime = selectedTime || exitTime || new Date();
      setShowExitPicker(Platform.OS === "ios");
      setExitTime(currentTime);
   };

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView style={styles.content}>
            <View style={styles.parkingInfo}>
               <Text style={styles.parkingType}>Car Parking</Text>
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
