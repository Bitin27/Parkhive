import React, { useState } from "react";
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

interface BookingProps {
   onContinue?: (bookingDetails: {
      date: string;
      arrivalTime: string;
      exitTime: string;
   }) => void;
}

const ParkingBooking: React.FC<BookingProps> = ({ onContinue = () => {} }) => {
   const [selectedDate, setSelectedDate] = useState("4 Oct");
   const [selectedArrivalTime, setSelectedArrivalTime] = useState("7:00 AM");
   const [selectedExitTime, setSelectedExitTime] = useState("8:00 AM");

   const dates = [
      { day: "Today", date: "4 Oct" },
      { day: "Mon", date: "5 Oct" },
      { day: "Tue", date: "6 Oct" },
      { day: "Wed", date: "7 Oct" },
   ];

   const arrivalTimes = ["7:00 AM", "7:30 AM", "8:00 AM"];
   const exitTimes = ["7:30 AM", "8:00 AM", "8:30 AM"];
   const router = useRouter();
   const handleContinue = () => {
      router.push("/ParkingSlot");
      onContinue({
         date: selectedDate,
         arrivalTime: selectedArrivalTime,
         exitTime: selectedExitTime,
      });
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
               <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
         </View>

         <View style={styles.content}>
            <View style={styles.parkingInfo}>
               <Text style={styles.parkingType}>Car Parking</Text>
               <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color="#FFB800" />
                  <Text style={styles.rating}>4.5 (365 reviews)</Text>
               </View>
            </View>

            <Text style={styles.parkingName}>GreenPark Innovations</Text>
            <Text style={styles.address}>1012 Ocean avenue, New York, USA</Text>

            <View style={styles.bookingSection}>
               <Text style={styles.sectionTitle}>BOOK A SLOT</Text>

               <Text style={styles.label}>Day</Text>
               <View style={styles.optionsRow}>
                  {dates.map(({ day, date }) => (
                     <TouchableOpacity
                        key={date}
                        style={[
                           styles.dateOption,
                           selectedDate === date && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedDate(date)}
                     >
                        <Text
                           style={[
                              styles.dayText,
                              selectedDate === date && styles.selectedText,
                           ]}
                        >
                           {day}
                        </Text>
                        <Text
                           style={[
                              styles.dateText,
                              selectedDate === date && styles.selectedText,
                           ]}
                        >
                           {date}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>

               <Text style={styles.label}>Arriving Time</Text>
               <View style={styles.optionsRow}>
                  {arrivalTimes.map((time) => (
                     <TouchableOpacity
                        key={time}
                        style={[
                           styles.timeOption,
                           selectedArrivalTime === time &&
                              styles.selectedOption,
                        ]}
                        onPress={() => setSelectedArrivalTime(time)}
                     >
                        <Text
                           style={[
                              styles.timeText,
                              selectedArrivalTime === time &&
                                 styles.selectedText,
                           ]}
                        >
                           {time}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>

               <Text style={styles.label}>Exit Time</Text>
               <View style={styles.optionsRow}>
                  {exitTimes.map((time) => (
                     <TouchableOpacity
                        key={time}
                        style={[
                           styles.timeOption,
                           selectedExitTime === time && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedExitTime(time)}
                     >
                        <Text
                           style={[
                              styles.timeText,
                              selectedExitTime === time && styles.selectedText,
                           ]}
                        >
                           {time}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            <TouchableOpacity
               style={styles.continueButton}
               onPress={handleContinue}
            >
               <Text style={styles.continueButtonText}>Continue</Text>
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
      padding: 16,
   },
   backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
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
   ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   rating: {
      marginLeft: 4,
      color: "#666",
   },
   parkingName: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 4,
   },
   address: {
      color: "#666",
      marginBottom: 24,
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
   optionsRow: {
      flexDirection: "row",
      marginBottom: 24,
   },
   dateOption: {
      flex: 1,
      marginRight: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: "#F3F4F6",
      alignItems: "center",
   },
   timeOption: {
      flex: 1,
      marginRight: 8,
      padding: 12,
      borderRadius: 12,
      backgroundColor: "#F3F4F6",
      alignItems: "center",
   },
   selectedOption: {
      backgroundColor: "#8B5CF6",
   },
   dayText: {
      fontSize: 14,
      color: "#666",
   },
   dateText: {
      fontSize: 14,
      fontWeight: "500",
      marginTop: 4,
   },
   timeText: {
      fontSize: 14,
      fontWeight: "500",
   },
   selectedText: {
      color: "#fff",
   },
   continueButton: {
      backgroundColor: "#8B5CF6",
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
   },
   continueButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default ParkingBooking;
