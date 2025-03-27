

// import React from "react";
// import {
//    View,
//    Text,
//    Image,
//    StyleSheet,
//    TouchableOpacity,
//    ScrollView,
//    SafeAreaView,
//    StatusBar,
// } from "react-native";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import Swiper from "react-native-swiper";
// import { useRouter } from "expo-router";

// const ParkingDetailsScreen = () => {
//    const parkingData = {
//       name: "Dharahara Underground Parking",
//       address: "P826+3VR, Sundhara Rd",
//       rating: 5,
//       reviews: 700,
//       timeAway: 5,
//       availableSpots: 284,
//       price: 5.0,
      
//       images: [
//          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.setopati.com%2Fuploads%2Fposts%2Fdharahara-parking-(10)-1706419003.jpeg&f=1&nofb=1&ipt=5b572026cb3c0e511d06e112279b24714940d6ba0bda504a84b52eaa8283df35&ipo=images",
//          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.YrwIvg8FjgSWGmEsqwNrQgHaE8%26pid%3DApi&f=1&ipt=11743a55c715feebcec0cc4921095956a8eb1fc20fb3726f9ff5d708d3ad2e7d&ipo=images",
//          "https://placeholder.com/parking3",
         
//       ],
//       description:
//          "The Dharahara Underground Parking is a modern parking facility located beneath the newly reconstructed Dharahara Tower in Kathmandu. It provides a spacious and secure parking area for both two-wheelers and four-wheelers, helping to ease traffic congestion in the city.",
//       operatorName: "Ram Maharjan",
//       operatorImage: "https://placeholder.com/operator",
//    };
//    const router = useRouter();
//    const bookSlot = () => {
//       router.push("/VehicleSelection");
//    };
//    return (
//       <SafeAreaView style={styles.container}>
//          <StatusBar barStyle="dark-content" />

//          {/* Header */}
//          <View style={styles.header}>
//             {/* <TouchableOpacity style={styles.iconButton}>
//                <Ionicons name="arrow-back" size={24} color="black" />
//             </TouchableOpacity> */}
//             <View style={styles.headerRight}>
//                <TouchableOpacity style={styles.iconButton}>
//                   <Ionicons name="share-outline" size={24} color="black" />
//                </TouchableOpacity>
//                <TouchableOpacity style={styles.iconButton}>
//                   <Ionicons name="heart-outline" size={24} color="black" />
//                </TouchableOpacity>
//             </View>
//          </View>

//          {/* Main Content */}
//          <ScrollView style={styles.scrollView} bounces={false}>
//             {/* Image Slider */}
//             <View style={styles.swiperContainer}>
//                <Swiper
//                   dotStyle={styles.dot}
//                   activeDotStyle={styles.activeDot}
//                   showsButtons={false}
//                   autoplay={false}
//                   loop={false}
//                >
//                   {parkingData.images.map((image, index) => (
//                      <Image
//                         key={index}
//                         source={{ uri: image }}
//                         style={styles.image}
//                         resizeMode="cover"
//                      />
//                   ))}
//                </Swiper>
//             </View>

//             <View style={styles.content}>
//                {/* Title Section */}
//                <View style={styles.typeContainer}>
//                   <Text style={styles.type}>Car Parking</Text>
//                   <View style={styles.ratingContainer}>
//                      <Ionicons name="star" size={16} color="#FFD700" />
//                      <Text style={styles.rating}>
//                         {parkingData.rating} ({parkingData.reviews} reviews)
//                      </Text>
//                   </View>
//                </View>

//                <Text style={styles.name}>{parkingData.name}</Text>
//                <Text style={styles.address}>{parkingData.address}</Text>

//                {/* Navigation Tabs */}
//                <View style={styles.tabs}>
//                   <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//                      <Text style={[styles.tabText, styles.activeTabText]}>
//                         About
//                      </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.tab}>
//                      <Text style={styles.tabText}>Gallery</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.tab}>
//                      <Text style={styles.tabText}>Review</Text>
//                   </TouchableOpacity>
//                </View>

//                {/* Info Section */}
//                <View style={styles.infoRow}>
//                   <View style={styles.infoItem}>
//                      <Ionicons name="time-outline" size={20} color="#6B46FF" />
//                      <Text style={styles.infoText}>
//                         {parkingData.timeAway} Mins Away
//                      </Text>
//                   </View>
//                   <View style={styles.infoItem}>
//                      <MaterialCommunityIcons
//                         name="car-parking-lights"
//                         size={20}
//                         color="#6B46FF"
//                      />
//                      <Text style={styles.infoText}>
//                         {parkingData.availableSpots} Spots Available
//                      </Text>
//                   </View>
//                </View>

//                {/* Description Section */}
//                <View style={styles.section}>
//                   <Text style={styles.sectionTitle}>Description</Text>
//                   <Text style={styles.description}>
//                      {parkingData.description}
//                   </Text>
//                   <TouchableOpacity>
//                      <Text style={styles.readMore}>Read more</Text>
//                   </TouchableOpacity>
//                </View>

//                {/* Operator Section */}
//                <View style={styles.section}>
//                   <Text style={styles.sectionTitle}>Operated by</Text>
//                   <View style={styles.operatorContainer}>
//                      <Image
//                         source={{ uri: parkingData.operatorImage }}
//                         style={styles.operatorImage}
//                      />
//                      <Text style={styles.operatorName}>
//                         {parkingData.operatorName}
//                      </Text>
//                      <View style={styles.operatorButtons}>
//                         <TouchableOpacity style={styles.messageButton}>
//                            <Ionicons
//                               name="chatbubble-ellipses"
//                               size={20}
//                               color="#6B46FF"
//                            />
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.callButton}>
//                            <Ionicons name="call" size={20} color="#6B46FF" />
//                         </TouchableOpacity>
//                      </View>
//                   </View>
//                </View>
//             </View>
//          </ScrollView>

//          {/* Bottom Bar */}
//          <View style={styles.bottomBar}>
//             <View style={styles.priceContainer}>
//                <Text style={styles.priceLabel}>Total Price</Text>
//                <Text style={styles.price}>
//                   Rs{parkingData.price.toFixed(2)}/hr
//                </Text>
//             </View>
//             <TouchableOpacity style={styles.bookButton} onPress={bookSlot}>
//                <Text style={styles.bookButtonText}>Book Slot</Text>
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
//    scrollView: {
//       flex: 1,
//    },
//    header: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       padding: 16,
//       position: "absolute",
//       top: 0,
//       left: 0,
//       right: 0,
//       zIndex: 1,
//    },
//    headerRight: {
//       flexDirection: "row",
//    },
//    iconButton: {
//       width: 40,
//       height: 40,
//       backgroundColor: "#fff",
//       borderRadius: 20,
//       justifyContent: "center",
//       alignItems: "center",
//       marginLeft: 8,
//       shadowColor: "#000",
//       shadowOffset: {
//          width: 0,
//          height: 2,
//       },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    swiperContainer: {
//       height: 250,
//    },
//    image: {
//       width: "100%",
//       height: "100%",
//    },
//    dot: {
//       backgroundColor: "rgba(255,255,255,.3)",
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       marginLeft: 3,
//       marginRight: 3,
//    },
//    activeDot: {
//       backgroundColor: "#fff",
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//       marginLeft: 3,
//       marginRight: 3,
//    },
//    content: {
//       flex: 1,
//       padding: 16,
//    },
//    typeContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 8,
//    },
//    type: {
//       color: "#6B46FF",
//       fontSize: 16,
//       fontWeight: "600",
//    },
//    ratingContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    rating: {
//       marginLeft: 4,
//       color: "#666",
//    },
//    name: {
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 4,
//    },
//    address: {
//       color: "#666",
//       marginBottom: 16,
//    },
//    tabs: {
//       flexDirection: "row",
//       marginBottom: 16,
//       borderBottomWidth: 1,
//       borderBottomColor: "#eee",
//    },
//    tab: {
//       paddingVertical: 12,
//       marginRight: 24,
//    },
//    activeTab: {
//       borderBottomWidth: 2,
//       borderBottomColor: "#6B46FF",
//    },
//    tabText: {
//       color: "#666",
//    },
//    activeTabText: {
//       color: "#6B46FF",
//       fontWeight: "600",
//    },
//    infoRow: {
//       flexDirection: "row",
//       marginBottom: 24,
//    },
//    infoItem: {
//       flexDirection: "row",
//       alignItems: "center",
//       marginRight: 24,
//    },
//    infoText: {
//       marginLeft: 8,
//       color: "#666",
//    },
//    section: {
//       marginBottom: 24,
//    },
//    sectionTitle: {
//       fontSize: 18,
//       fontWeight: "600",
//       marginBottom: 8,
//    },
//    description: {
//       color: "#666",
//       lineHeight: 20,
//    },
//    readMore: {
//       color: "#6B46FF",
//       marginTop: 8,
//    },
//    operatorContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    operatorImage: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       marginRight: 12,
//    },
//    operatorName: {
//       flex: 1,
//       fontSize: 16,
//       fontWeight: "500",
//    },
//    operatorButtons: {
//       flexDirection: "row",
//    },
//    messageButton: {
//       width: 40,
//       height: 40,
//       backgroundColor: "#F0EEFF",
//       borderRadius: 20,
//       justifyContent: "center",
//       alignItems: "center",
//       marginRight: 8,
//    },
//    callButton: {
//       width: 40,
//       height: 40,
//       backgroundColor: "#F0EEFF",
//       borderRadius: 20,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    bottomBar: {
//       flexDirection: "row",
//       padding: 16,
//       borderTopWidth: 1,
//       borderTopColor: "#eee",
//       alignItems: "center",
//       backgroundColor: "#fff",
//    },
//    priceContainer: {
//       flex: 1,
//    },
//    priceLabel: {
//       color: "#666",
//    },
//    price: {
//       fontSize: 20,
//       fontWeight: "bold",
//    },
//    bookButton: {
//       backgroundColor: "#6B46FF",
//       paddingVertical: 12,
//       paddingHorizontal: 32,
//       borderRadius: 24,
//    },
//    bookButtonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "600",
//    },
// });

// export default ParkingDetailsScreen;


import React from "react";
import {
   View,
   Text,
   Image,
   StyleSheet,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
   StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { useRouter, useLocalSearchParams } from "expo-router";

const ParkingDetailsScreen = () => {
   const router = useRouter();
   // Get data from route params
   const params : any = useLocalSearchParams();

   // Extract parking data from params
   const parkingData = {
      id: params.id,
      name: params.name || "Unnamed Parking",
      address: params.address || "Address not available",
      rating: parseFloat(params.rating) || 4.0,
      reviews: parseInt(params.reviews) || 0,
      timeAway: parseInt(params.time) || 5,
      availableSpots: parseInt(params.spots) || 0,
      price: parseFloat(params.price) || 5.0,
      description: params.description || "No description available",
      // Use placeholder images or default images
      images: [
         require("../assets/images/location.png"),
         require("../assets/images/location.png"),
         require("../assets/images/location.png"),
      ],
      operatorName: "Parking Operator",
      operatorImage: require("../assets/images/location.png"), // Use a default image
   };

   const bookSlot = () => {
      router.push({
         pathname: "/VehicleSelection",
         params: {
            parkingId: parkingData.id,
            parkingName: parkingData.name,
            price: parkingData.price,
         },
      });
   };

   const handleBackPress = () => {
      router.back();
   };

   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" />

         {/* Header */}
         <View style={styles.header}>
            <TouchableOpacity
               style={styles.iconButton}
               onPress={handleBackPress}
            >
               <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
               <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="share-outline" size={24} color="black" />
               </TouchableOpacity>
               <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="heart-outline" size={24} color="black" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Main Content */}
         <ScrollView style={styles.scrollView} bounces={false}>
            {/* Image Slider */}
            <View style={styles.swiperContainer}>
               <Swiper
                  dotStyle={styles.dot}
                  activeDotStyle={styles.activeDot}
                  showsButtons={false}
                  autoplay={false}
                  loop={false}
               >
                  {parkingData.images.map((image, index) => (
                     <Image
                        key={index}
                        source={image}
                        style={styles.image}
                        resizeMode="cover"
                     />
                  ))}
               </Swiper>
            </View>

            <View style={styles.content}>
               {/* Title Section */}
               <View style={styles.typeContainer}>
                  <Text style={styles.type}>Car Parking</Text>
                  <View style={styles.ratingContainer}>
                     <Ionicons name="star" size={16} color="#FFD700" />
                     <Text style={styles.rating}>
                        {parkingData.rating} ({parkingData.reviews} reviews)
                     </Text>
                  </View>
               </View>

               <Text style={styles.name}>{parkingData.name}</Text>
               <Text style={styles.address}>{parkingData.address}</Text>

               {/* Navigation Tabs */}
               <View style={styles.tabs}>
                  <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                     <Text style={[styles.tabText, styles.activeTabText]}>
                        About
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tab}>
                     <Text style={styles.tabText}>Gallery</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.tab}>
                     <Text style={styles.tabText}>Review</Text>
                  </TouchableOpacity>
               </View>

               {/* Info Section */}
               <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                     <Ionicons name="time-outline" size={20} color="#6B46FF" />
                     <Text style={styles.infoText}>
                        {parkingData.timeAway} Mins Away
                     </Text>
                  </View>
                  <View style={styles.infoItem}>
                     <MaterialCommunityIcons
                        name="car-parking-lights"
                        size={20}
                        color="#6B46FF"
                     />
                     <Text style={styles.infoText}>
                        {parkingData.availableSpots} Spots Available
                     </Text>
                  </View>
               </View>

               {/* Description Section */}
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.description}>
                     {parkingData.description}
                  </Text>
                  <TouchableOpacity>
                     <Text style={styles.readMore}>Read more</Text>
                  </TouchableOpacity>
               </View>

               {/* Operator Section */}
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Operated by</Text>
                  <View style={styles.operatorContainer}>
                     <Image
                        source={parkingData.operatorImage}
                        style={styles.operatorImage}
                     />
                     <Text style={styles.operatorName}>
                        {parkingData.operatorName}
                     </Text>
                     <View style={styles.operatorButtons}>
                        <TouchableOpacity style={styles.messageButton}>
                           <Ionicons
                              name="chatbubble-ellipses"
                              size={20}
                              color="#6B46FF"
                           />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.callButton}>
                           <Ionicons name="call" size={20} color="#6B46FF" />
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </View>
         </ScrollView>

         {/* Bottom Bar */}
         <View style={styles.bottomBar}>
            <View style={styles.priceContainer}>
               <Text style={styles.priceLabel}>Total Price</Text>
               <Text style={styles.price}>
                  ${parkingData.price.toFixed(2)}/hr
               </Text>
            </View>
            <TouchableOpacity style={styles.bookButton} onPress={bookSlot}>
               <Text style={styles.bookButtonText}>Book Slot</Text>
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
   scrollView: {
      flex: 1,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
   },
   headerRight: {
      flexDirection: "row",
   },
   iconButton: {
      width: 40,
      height: 40,
      backgroundColor: "#fff",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   swiperContainer: {
      height: 250,
   },
   image: {
      width: "100%",
      height: "100%",
   },
   dot: {
      backgroundColor: "rgba(255,255,255,.3)",
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
   },
   activeDot: {
      backgroundColor: "#fff",
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
   },
   content: {
      flex: 1,
      padding: 16,
   },
   typeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
   },
   type: {
      color: "#6B46FF",
      fontSize: 16,
      fontWeight: "600",
   },
   ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   rating: {
      marginLeft: 4,
      color: "#666",
   },
   name: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 4,
   },
   address: {
      color: "#666",
      marginBottom: 16,
   },
   tabs: {
      flexDirection: "row",
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
   },
   tab: {
      paddingVertical: 12,
      marginRight: 24,
   },
   activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: "#6B46FF",
   },
   tabText: {
      color: "#666",
   },
   activeTabText: {
      color: "#6B46FF",
      fontWeight: "600",
   },
   infoRow: {
      flexDirection: "row",
      marginBottom: 24,
   },
   infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 24,
   },
   infoText: {
      marginLeft: 8,
      color: "#666",
   },
   section: {
      marginBottom: 24,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
   },
   description: {
      color: "#666",
      lineHeight: 20,
   },
   readMore: {
      color: "#6B46FF",
      marginTop: 8,
   },
   operatorContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   operatorImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
   },
   operatorName: {
      flex: 1,
      fontSize: 16,
      fontWeight: "500",
   },
   operatorButtons: {
      flexDirection: "row",
   },
   messageButton: {
      width: 40,
      height: 40,
      backgroundColor: "#F0EEFF",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
   },
   callButton: {
      width: 40,
      height: 40,
      backgroundColor: "#F0EEFF",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
   },
   bottomBar: {
      flexDirection: "row",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: "#eee",
      alignItems: "center",
      backgroundColor: "#fff",
   },
   priceContainer: {
      flex: 1,
   },
   priceLabel: {
      color: "#666",
   },
   price: {
      fontSize: 20,
      fontWeight: "bold",
   },
   bookButton: {
      backgroundColor: "#6B46FF",
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 24,
   },
   bookButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default ParkingDetailsScreen;
