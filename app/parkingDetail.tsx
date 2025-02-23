// import React, { useState } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    Image,
//    TouchableOpacity,
//    ScrollView,
//    SafeAreaView,
//    StatusBar,
//    FlatList,
//    Linking,
// } from "react-native";
// import { MaterialIcons, Ionicons } from "@expo/vector-icons";

// // Sample image data for the gallery
// const galleryImages = [
//    require("../assets/images/onboardone.png"),
//    require("../assets/images/onboardone.png"),
//    require("../assets/images/onboardone.png"),
//    require("../assets/images/onboardone.png"),
//    require("../assets/images/onboardone.png"),
//    // ... more images
// ];

// export default function ParkingDetailScreen({ route, navigation }: any) {
//    // In Expo, you would get the parking data from route.params
//    const parkingData = route.params?.parkingData || {
//       id: "1",
//       name: "GreenPark Innovations",
//       rating: 4.8,
//       reviewCount: 365,
//       price: 5.0,
//       address: "1012 Ocean avenue, New york, USA",
//       timeAway: "05",
//       spots: 28,
//       description:
//          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
//       operatedBy: "John Doe",
//       operatorAvatar: require("../assets/images/onboardtwo.png"),
//    };

//    const [activeTab, setActiveTab] = useState("About");
//    const [isFavorite, setIsFavorite] = useState(false);

//    // Handle tab selection
//    const handleTabPress = (tabName: any) => {
//       setActiveTab(tabName);
//    };

//    // Handle booking
//    const handleBookSlot = () => {
//       // Implement booking logic
//       console.log("Booking slot...");
//    };

//    // Handle call
//    const handleCall = () => {
//       Linking.openURL(`tel:${"1234567890"}`);
//    };

//    // Handle message
//    const handleMessage = () => {
//       // Implement messaging logic
//       console.log("Opening messages...");
//    };

//    return (
//       <SafeAreaView style={styles.container}>
//          <StatusBar barStyle="dark-content" />

//          {/* Main image and header buttons */}
//          <View style={styles.imageContainer}>
//             <Image
//                source={galleryImages[0]}
//                style={styles.mainImage}
//                resizeMode="cover"
//             />

//             {/* Back button */}
//             <TouchableOpacity
//                style={styles.backButton}
//                onPress={() => navigation.goBack()}
//             >
//                <MaterialIcons name="arrow-back" size={24} color="#000" />
//             </TouchableOpacity>

//             {/* Share and favorite buttons */}
//             <View style={styles.headerButtons}>
//                <TouchableOpacity style={styles.iconButton}>
//                   <Ionicons name="share-outline" size={24} color="#000" />
//                </TouchableOpacity>
//                <TouchableOpacity
//                   style={styles.iconButton}
//                   onPress={() => setIsFavorite(!isFavorite)}
//                >
//                   <Ionicons
//                      name={isFavorite ? "heart" : "heart-outline"}
//                      size={24}
//                      color={isFavorite ? "#FF3B30" : "#000"}
//                   />
//                </TouchableOpacity>
//             </View>

//             {/* Gallery thumbnails */}
//             <View style={styles.thumbnailContainer}>
//                <FlatList
//                   data={galleryImages.slice(0, 5)}
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   renderItem={({ item, index }) => (
//                      <TouchableOpacity style={styles.thumbnail}>
//                         <Image source={item} style={styles.thumbnailImage} />
//                      </TouchableOpacity>
//                   )}
//                   keyExtractor={(_, index) => index.toString()}
//                   ListFooterComponent={
//                      galleryImages.length > 5 ? (
//                         <TouchableOpacity style={styles.moreImages}>
//                            <Text style={styles.moreImagesText}>
//                               +{galleryImages.length - 5}
//                            </Text>
//                         </TouchableOpacity>
//                      ) : null
//                   }
//                />
//             </View>
//          </View>

//          <ScrollView style={styles.contentContainer}>
//             {/* Badge and rating */}
//             <View style={styles.badgeContainer}>
//                <Text style={styles.badge}>Car Parking</Text>
//                <View style={styles.ratingContainer}>
//                   <Ionicons name="star" size={16} color="#FFD700" />
//                   <Text style={styles.ratingText}>
//                      {parkingData.rating} ({parkingData.reviewCount} reviews)
//                   </Text>
//                </View>
//             </View>

//             {/* Name and location */}
//             <Text style={styles.name}>{parkingData.name}</Text>
//             <Text style={styles.address}>{parkingData.address}</Text>

//             {/* Message button */}
//             <TouchableOpacity
//                style={styles.messageButton}
//                onPress={handleMessage}
//             >
//                <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
//             </TouchableOpacity>

//             {/* Tab navigation */}
//             <View style={styles.tabContainer}>
//                {["About", "Gallery", "Review"].map((tab) => (
//                   <TouchableOpacity
//                      key={tab}
//                      style={[styles.tab, activeTab === tab && styles.activeTab]}
//                      onPress={() => handleTabPress(tab)}
//                   >
//                      <Text
//                         style={[
//                            styles.tabText,
//                            activeTab === tab && styles.activeTabText,
//                         ]}
//                      >
//                         {tab}
//                      </Text>
//                   </TouchableOpacity>
//                ))}
//             </View>

//             {/* Content based on active tab */}
//             {activeTab === "About" && (
//                <View style={styles.aboutContainer}>
//                   {/* Time and spots */}
//                   <View style={styles.infoRow}>
//                      <View style={styles.infoItem}>
//                         <MaterialIcons
//                            name="access-time"
//                            size={20}
//                            color="#6B4EFF"
//                         />
//                         <Text style={styles.infoText}>
//                            {parkingData.timeAway} Mins Away
//                         </Text>
//                      </View>
//                      <View style={styles.infoItem}>
//                         <MaterialIcons
//                            name="local-parking"
//                            size={20}
//                            color="#6B4EFF"
//                         />
//                         <Text style={styles.infoText}>
//                            {parkingData.spots} Spots Available
//                         </Text>
//                      </View>
//                   </View>

//                   {/* Description */}
//                   <View style={styles.descriptionContainer}>
//                      <Text style={styles.sectionTitle}>Description</Text>
//                      <Text style={styles.descriptionText}>
//                         {parkingData.description}
//                         <Text style={styles.readMore}> Read more</Text>
//                      </Text>
//                   </View>

//                   {/* Operated by */}
//                   <View style={styles.operatorContainer}>
//                      <Text style={styles.sectionTitle}>Operated by</Text>
//                      <View style={styles.operatorInfo}>
//                         <Image
//                            source={parkingData.operatorAvatar}
//                            style={styles.operatorAvatar}
//                         />
//                         <Text style={styles.operatorName}>
//                            {parkingData.operatedBy}
//                         </Text>
//                         <View style={styles.operatorActions}>
//                            <TouchableOpacity
//                               style={styles.operatorButton}
//                               onPress={handleMessage}
//                            >
//                               <Ionicons
//                                  name="chatbubble-ellipses"
//                                  size={20}
//                                  color="#FFFFFF"
//                               />
//                            </TouchableOpacity>
//                            <TouchableOpacity
//                               style={[styles.operatorButton, styles.callButton]}
//                               onPress={handleCall}
//                            >
//                               <Ionicons name="call" size={20} color="#FFFFFF" />
//                            </TouchableOpacity>
//                         </View>
//                      </View>
//                   </View>
//                </View>
//             )}

//             {/* Gallery tab content would go here */}
//             {/* Review tab content would go here */}
//          </ScrollView>

//          {/* Booking bar */}
//          <View style={styles.bookingBar}>
//             <View>
//                <Text style={styles.totalPriceLabel}>Total Price</Text>
//                <Text style={styles.priceText}>
//                   ${parkingData.price.toFixed(2)}
//                   <Text style={styles.priceUnit}>/hr</Text>
//                </Text>
//             </View>

//             <TouchableOpacity
//                style={styles.bookButton}
//                onPress={handleBookSlot}
//             >
//                <Text style={styles.bookButtonText}>Book Slot</Text>
//             </TouchableOpacity>
//          </View>
//       </SafeAreaView>
//    );
// }

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#FFFFFF",
//    },
//    imageContainer: {
//       position: "relative",
//       height: 240,
//    },
//    mainImage: {
//       width: "100%",
//       height: "100%",
//    },
//    backButton: {
//       position: "absolute",
//       top: 16,
//       left: 16,
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       justifyContent: "center",
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    headerButtons: {
//       position: "absolute",
//       top: 16,
//       right: 16,
//       flexDirection: "row",
//    },
//    iconButton: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: "rgba(255, 255, 255, 0.9)",
//       justifyContent: "center",
//       alignItems: "center",
//       marginLeft: 8,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    thumbnailContainer: {
//       position: "absolute",
//       bottom: 16,
//       left: 16,
//       right: 16,
//    },
//    thumbnail: {
//       width: 60,
//       height: 60,
//       borderRadius: 8,
//       marginRight: 8,
//       overflow: "hidden",
//       borderWidth: 2,
//       borderColor: "#FFFFFF",
//    },
//    thumbnailImage: {
//       width: "100%",
//       height: "100%",
//    },
//    moreImages: {
//       width: 60,
//       height: 60,
//       borderRadius: 8,
//       backgroundColor: "rgba(0, 0, 0, 0.4)",
//       justifyContent: "center",
//       alignItems: "center",
//       borderWidth: 2,
//       borderColor: "#FFFFFF",
//    },
//    moreImagesText: {
//       color: "#FFFFFF",
//       fontWeight: "bold",
//    },
//    contentContainer: {
//       flex: 1,
//       padding: 16,
//    },
//    badgeContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       marginBottom: 8,
//    },
//    badge: {
//       color: "#6B4EFF",
//       fontSize: 14,
//       fontWeight: "500",
//    },
//    ratingContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    ratingText: {
//       color: "#666",
//       fontSize: 14,
//       marginLeft: 4,
//    },
//    name: {
//       fontSize: 24,
//       fontWeight: "bold",
//       color: "#000",
//       marginBottom: 4,
//    },
//    address: {
//       fontSize: 14,
//       color: "#666",
//       marginBottom: 16,
//    },
//    messageButton: {
//       position: "absolute",
//       top: 72,
//       right: 16,
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: "#6B4EFF",
//       justifyContent: "center",
//       alignItems: "center",
//       shadowColor: "#6B4EFF",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.3,
//       shadowRadius: 8,
//       elevation: 5,
//    },
//    tabContainer: {
//       flexDirection: "row",
//       borderBottomWidth: 1,
//       borderBottomColor: "#E5E5E5",
//       marginBottom: 16,
//    },
//    tab: {
//       paddingVertical: 12,
//       marginRight: 24,
//    },
//    activeTab: {
//       borderBottomWidth: 2,
//       borderBottomColor: "#6B4EFF",
//    },
//    tabText: {
//       fontSize: 16,
//       color: "#666",
//    },
//    activeTabText: {
//       color: "#6B4EFF",
//       fontWeight: "500",
//    },
//    aboutContainer: {
//       flex: 1,
//    },
//    infoRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginBottom: 24,
//    },
//    infoItem: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    infoText: {
//       fontSize: 14,
//       color: "#666",
//       marginLeft: 8,
//    },
//    descriptionContainer: {
//       marginBottom: 24,
//    },
//    sectionTitle: {
//       fontSize: 16,
//       fontWeight: "600",
//       color: "#000",
//       marginBottom: 8,
//    },
//    descriptionText: {
//       fontSize: 14,
//       color: "#666",
//       lineHeight: 20,
//    },
//    readMore: {
//       color: "#6B4EFF",
//       fontWeight: "500",
//    },
//    operatorContainer: {
//       marginBottom: 24,
//    },
//    operatorInfo: {
//       flexDirection: "row",
//       alignItems: "center",
//    },
//    operatorAvatar: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//    },
//    operatorName: {
//       fontSize: 14,
//       fontWeight: "500",
//       color: "#000",
//       marginLeft: 12,
//       flex: 1,
//    },
//    operatorActions: {
//       flexDirection: "row",
//    },
//    operatorButton: {
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       backgroundColor: "#6B4EFF",
//       justifyContent: "center",
//       alignItems: "center",
//       marginLeft: 8,
//    },
//    callButton: {
//       backgroundColor: "#4CAF50",
//    },
//    bookingBar: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       borderTopWidth: 1,
//       borderTopColor: "#E5E5E5",
//       backgroundColor: "#FFFFFF",
//    },
//    totalPriceLabel: {
//       fontSize: 12,
//       color: "#666",
//    },
//    priceText: {
//       fontSize: 20,
//       fontWeight: "bold",
//       color: "#6B4EFF",
//    },
//    priceUnit: {
//       fontSize: 14,
//       color: "#666",
//       fontWeight: "normal",
//    },
//    bookButton: {
//       backgroundColor: "#6B4EFF",
//       paddingVertical: 12,
//       paddingHorizontal: 32,
//       borderRadius: 24,
//    },
//    bookButtonText: {
//       color: "#FFFFFF",
//       fontSize: 16,
//       fontWeight: "600",
//    },
// });

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
import { useRouter } from "expo-router";

const ParkingDetailsScreen = () => {
   // Mock data
   const parkingData = {
      name: "GreenPark Innovations",
      address: "1012 Ocean avenue, New york, USA",
      rating: 4.8,
      reviews: 365,
      timeAway: 5,
      availableSpots: 28,
      price: 5.0,
      images: [
         "https://placeholder.com/parking1",
         "https://placeholder.com/parking2",
         "https://placeholder.com/parking3",
      ],
      description:
         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      operatorName: "John Doe",
      operatorImage: "https://placeholder.com/operator",
   };
   const router = useRouter();
   const bookSlot = () => {
      router.push("/VehicleSelection");
   };
   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" />

         {/* Header */}
         <View style={styles.header}>
            {/* <TouchableOpacity style={styles.iconButton}>
               <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity> */}
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
                        source={{ uri: image }}
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
                        source={{ uri: parkingData.operatorImage }}
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
