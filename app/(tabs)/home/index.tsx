import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   Image,
   ScrollView,
   TextInput,
   SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ParkingCard } from "@/components/ParkingCard";
import Header from "@/components/Header";

import { Link } from "expo-router";

export default function Home() {
   const parkingData = [
      {
         id: 1,
         name: "ParkEase Pro",
         rating: "4.0",
         price: "5.00",
         time: "5",
         spots: "28",
         image: require("../../../assets/images/location.png"),
      },
      {
         id: 2,
         name: "AutoNest",
         rating: "4.8",
         price: "5.00",
         time: "10",
         spots: "15",
         image: require("../../../assets/images/location.png"),
      },
   ];

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView style={styles.scrollView}>
            <Header />
            {/* Popular Parking Section */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Popular Parking</Text>
                  <TouchableOpacity>
                     <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
               </View>
               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.parkingCardsContainer}
               >
                  {parkingData.map((parking) => (
                     <ParkingCard {...parking} key={parking.id} />
                  ))}
               </ScrollView>
            </View>

            {/* Nearby Parking Section */}
            <View style={styles.section}>
               <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Nearby Parking</Text>
                  <TouchableOpacity>
                     <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.nearbyList}>
                  {parkingData.map((parking) => (
                     <ParkingCard key={parking.id} {...parking} />
                  ))}
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   scrollView: {
      flex: 1,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
   },
   locationContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   locationText: {
      fontSize: 16,
      fontWeight: "600",
      marginHorizontal: 8,
      color: "#000",
   },
   notificationButton: {
      padding: 8,
   },
   searchContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
   },
   searchBar: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
   },
   searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 16,
      color: "#000",
   },
   filterButton: {
      backgroundColor: "#6B4EFF",
      padding: 12,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
   },
   section: {
      paddingHorizontal: 16,
      marginTop: 20,
   },
   sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#000",
   },
   seeAllText: {
      color: "#6B4EFF",
      fontSize: 14,
      fontWeight: "500",
   },
   parkingCardsContainer: {
      paddingRight: 16,
   },
   nearbyList: {
      gap: 16,
   },
});
