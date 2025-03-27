// import {
//    View,
//    Text,
//    StyleSheet,
//    TouchableOpacity,
//    Image,
//    ScrollView,
//    TextInput,
//    SafeAreaView,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { ParkingCard } from "@/components/ParkingCard";
// import Header from "@/components/Header";

// import { Link } from "expo-router";

// export default function Home() {
//    const parkingData = [
//       {
//          id: 1,
//          name: "Dharahara Underground Parking",
//          rating: "4.0",
//          price: "25.00",
//          time: "5",
//          spots: "28",
//          image: require("../../../assets/images/Dharahara.png"),
//       },
//       {
//          id: 2,
//          name: "Boudhanath Stupa Parking",
//          rating: "4.8",
//          price: "25.00",
//          time: "10",
//          spots: "200",
//          image: require("../../../assets/images/Boudha.png"),
//       },

//       {
//          id: 3,
//          name: "Kathmandu View Tower Underground Parking",
//          rating: "4.8",
//          price: "25.00",
//          time: "20",
//          spots: "500",
//          image: require("../../../assets/images/viewtower.png"),
//       },

//       {
//          id: 4,
//          name: "Tamrakar Complex",
//          rating: "4.8",
//          price: "25.00",
//          time: "20",
//          spots: "500",
//          image: require("../../../assets/images/TamrakarParking.png"),
//       },
//    ];

//    return (
//       <SafeAreaView style={styles.container}>
//          <ScrollView style={styles.scrollView}>
//             <Header />
//             {/* Popular Parking Section */}
//             <View style={styles.section}>
//                <View style={styles.sectionHeader}>
//                   <Text style={styles.sectionTitle}>Popular Parking</Text>
//                   <TouchableOpacity>
//                      <Text style={styles.seeAllText}>See All</Text>
//                   </TouchableOpacity>
//                </View>
//                <ScrollView
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.parkingCardsContainer}
//                >
//                   {parkingData.map((parking) => (
//                      <ParkingCard {...parking} key={parking.id} />
//                   ))}
//                </ScrollView>
//             </View>

//             {/* Nearby Parking Section */}
//             <View style={styles.section}>
//                <View style={styles.sectionHeader}>
//                   <Text style={styles.sectionTitle}>Nearby Parking</Text>
//                   <TouchableOpacity>
//                      <Text style={styles.seeAllText}>See All</Text>
//                   </TouchableOpacity>
//                </View>
//                <View style={styles.nearbyList}>
//                   {parkingData.map((parking) => (
//                      <ParkingCard key={parking.id} {...parking} />
//                   ))}
//                </View>
//             </View>
//          </ScrollView>
//       </SafeAreaView>
//    );
// }

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#fff",
//    },
//    scrollView: {
//       flex: 1,
//    },
//    header: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//    },
//    locationContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    locationText: {
//       fontSize: 16,
//       fontWeight: "600",
//       marginHorizontal: 8,
//       color: "#000",
//    },
//    notificationButton: {
//       padding: 8,
//    },
//    searchContainer: {
//       flexDirection: "row",
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       gap: 12,
//    },
//    searchBar: {
//       flex: 1,
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "#F5F5F5",
//       borderRadius: 12,
//       paddingHorizontal: 12,
//       paddingVertical: 10,
//    },
//    searchInput: {
//       flex: 1,
//       marginLeft: 8,
//       fontSize: 16,
//       color: "#000",
//    },
//    filterButton: {
//       backgroundColor: "#6B4EFF",
//       padding: 12,
//       borderRadius: 12,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    section: {
//       paddingHorizontal: 16,
//       marginTop: 20,
//    },
//    sectionHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 16,
//    },
//    sectionTitle: {
//       fontSize: 20,
//       fontWeight: "600",
//       color: "#000",
//    },
//    seeAllText: {
//       color: "#6B4EFF",
//       fontSize: 14,
//       fontWeight: "500",
//    },
//    parkingCardsContainer: {
//       paddingRight: 16,
//    },
//    nearbyList: {
//       gap: 16,
//    },
// });


import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
   ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ParkingCard } from "@/components/ParkingCard";
import Header from "@/components/Header";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../../lib/supabase"; // Adjust this import based on your setup

export default function Home() {
   // React Query hook to fetch parking data
   const {
      data: parkingData,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["parkingZones"],
      queryFn: async () => {
         // Query the parkingzones table
         const { data, error } = await supabaseClient
            .from("parkingzones")
            .select("*");

         if (error) {
            throw new Error(error.message);
         }

         // Transform the data to match the format expected by ParkingCard
         return data.map((zone) => ({
            id: zone.id,
            name: zone.name || "Unnamed Zone",
            rating: "4.0", // You may want to add this to your table or calculate it
            price: "5.00", // You may want to add pricing to your table
            time: "5", // Distance or time to the parking zone
            spots: "28", // Available spots - you may want to add this to your table
            // You'll need to handle images differently, perhaps with URLs in your database
            image: require("../../../assets/images/Dharahara.png"),
            address: zone.address,
            description: zone.description,
            latitude: zone.latitude,
            longitude: zone.longitude,
         }));
      },
   });

   if (isLoading) {
      return (
         <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#6B4EFF" />
               <Text style={styles.loadingText}>Loading parking zones...</Text>
            </View>
         </SafeAreaView>
      );
   }

   if (error) {
      return (
         <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.errorContainer}>
               <MaterialIcons name="error" size={48} color="#FF4D4F" />
               <Text style={styles.errorText}>
                  Error loading parking zones: {error.message}
               </Text>
               <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => refetch()}
               >
                  <Text style={styles.retryButtonText}>Retry</Text>
               </TouchableOpacity>
            </View>
         </SafeAreaView>
      );
   }

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
                  {parkingData &&
                     parkingData.map((parking) => (
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
                  {parkingData &&
                     parkingData.map((parking) => (
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
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: "#555",
   },
   errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
   },
   errorText: {
      marginTop: 10,
      fontSize: 16,
      color: "#555",
      textAlign: "center",
   },
   retryButton: {
      marginTop: 20,
      backgroundColor: "#6B4EFF",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
   },
   retryButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "500",
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
