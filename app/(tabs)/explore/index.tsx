// import React, { useState, useRef, useEffect } from "react";
// import {
//    View,
//    Text,
//    StyleSheet,
//    TouchableOpacity,
//    Image,
//    TextInput,
//    FlatList,
//    SafeAreaView,
//    Platform,
//    StatusBar,
//    Dimensions,
// } from "react-native";
// import MapView, {
//    Marker,
//    Polygon,
//    Circle,
//    PROVIDER_GOOGLE,
// } from "react-native-maps";
// import { MaterialIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";
// import { ParkingCard } from "../../../components/ParkingCard"; // Import your existing component

// const { width } = Dimensions.get("window");

// // Sample parking data
// const parkingData = [
//    {
//       id: "1",
//       name: "DriveGuard Solutions",
//       rating: 4.9,
//       price: 5.0,
//       time: "08",
//       spots: 28,
//       coordinate: {
//          latitude: 40.7128,
//          longitude: -74.006,
//       },
//       image: require("../../../assets/images/login.png"),
//    },
//    {
//       id: "2",
//       name: "AutoNet",
//       rating: 4.8,
//       price: 4.5,
//       time: "07",
//       spots: 15,
//       coordinate: {
//          latitude: 40.7138,
//          longitude: -74.007,
//       },
//       image: require("../../../assets/images/login.png"),
//    },
// ];

// // Map center coordinates (New York City as example)
// const initialRegion = {
//    latitude: 40.7128,
//    longitude: -74.006,
//    latitudeDelta: 0.0922,
//    longitudeDelta: 0.0421,
// };

// // Polygon coordinates for highlighted area
// const polygonCoordinates = [
//    { latitude: 40.7128, longitude: -74.007 },
//    { latitude: 40.7138, longitude: -74.005 },
//    { latitude: 40.7118, longitude: -74.002 },
//    { latitude: 40.7108, longitude: -74.004 },
// ];

// export default function ParkingApp() {
//    const [searchQuery, setSearchQuery] = useState("");
//    const [selectedCard, setSelectedCard] = useState(null);
//    const mapRef = useRef(null);
//    const flatListRef = useRef(null);

//    // Handle card selection
//    const handleCardSelect = (item: any, index: any) => {
//       setSelectedCard(item.id);
//       // Animate to the selected parking location
//       mapRef.current?.animateToRegion(
//          {
//             latitude: item.coordinate.latitude,
//             longitude: item.coordinate.longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//          },
//          1000
//       );
//    };

//    return (
//       <SafeAreaView style={styles.container}>
//          <View style={styles.content}>
//             {/* Map View */}
//             <View style={styles.mapContainer}>
//                <MapView
//                   ref={mapRef}
//                   style={styles.map}
//                   provider={PROVIDER_GOOGLE}
//                   initialRegion={initialRegion}
//                   showsUserLocation
//                   showsMyLocationButton={false}
//                   showsCompass={false}
//                   toolbarEnabled={false}
//                >
//                   {/* Highlighted area */}
//                   <Polygon
//                      coordinates={polygonCoordinates}
//                      fillColor="rgba(107, 78, 255, 0.1)"
//                      strokeColor="#6B4EFF"
//                      strokeWidth={2}
//                   />

//                   {/* Main circle in the center */}
//                   <Circle
//                      center={{
//                         latitude: 40.7122,
//                         longitude: -74.0045,
//                      }}
//                      radius={80}
//                      fillColor="rgba(107, 78, 255, 0.2)"
//                      strokeColor="transparent"
//                   />

//                   {/* Parking markers */}
//                   {parkingData.map((parking) => (
//                      <Marker
//                         key={parking.id}
//                         coordinate={parking.coordinate}
//                         tracksViewChanges={false}
//                      >
//                         <View
//                            style={[
//                               styles.customMarker,
//                               selectedCard === parking.id &&
//                                  styles.selectedMarker,
//                            ]}
//                         >
//                            {selectedCard === parking.id && (
//                               <View style={styles.markerRing} />
//                            )}
//                         </View>
//                      </Marker>
//                   ))}
//                </MapView>

//                {/* Search bar with blur effect */}
//                <BlurView intensity={80} style={styles.searchContainer}>
//                   <MaterialIcons
//                      name="search"
//                      size={20}
//                      color="#6B4EFF"
//                      style={styles.searchIcon}
//                   />
//                   <TextInput
//                      style={styles.searchInput}
//                      placeholder="Search Parking"
//                      value={searchQuery}
//                      onChangeText={setSearchQuery}
//                      placeholderTextColor="#8E8E93"
//                   />
//                </BlurView>

//                {/* Filter button */}
//                <TouchableOpacity style={styles.filterButton}>
//                   <LinearGradient
//                      colors={["#7B5DFF", "#6B4EFF"]}
//                      style={styles.gradientButton}
//                      start={{ x: 0, y: 0 }}
//                      end={{ x: 1, y: 1 }}
//                   >
//                      <MaterialIcons name="tune" size={22} color="#fff" />
//                   </LinearGradient>
//                </TouchableOpacity>

//                {/* Current location button */}
//                <TouchableOpacity
//                   style={styles.locationButton}
//                   onPress={() =>
//                      mapRef.current?.animateToRegion(initialRegion, 1000)
//                   }
//                >
//                   <MaterialIcons name="my-location" size={22} color="#6B4EFF" />
//                </TouchableOpacity>
//             </View>

//             {/* Parking cards with snap effect */}
//             <FlatList
//                ref={flatListRef}
//                data={parkingData}
//                keyExtractor={(item) => item.id}
//                horizontal
//                showsHorizontalScrollIndicator={false}
//                contentContainerStyle={styles.parkingList}
//                snapToInterval={width - 32} // Card width + padding
//                snapToAlignment="start"
//                decelerationRate="fast"
//                renderItem={({ item, index }) => (
//                   <TouchableOpacity
//                      activeOpacity={0.9}
//                      onPress={() => handleCardSelect(item, index)}
//                   >
//                      <ParkingCard
//                         name={item.name}
//                         rating={item.rating}
//                         price={item.price.toFixed(2)}
//                         time={item.time}
//                         spots={item.spots}
//                         image={item.image}
//                      />
//                   </TouchableOpacity>
//                )}
//                onMomentumScrollEnd={(event) => {
//                   const index = Math.floor(
//                      event.nativeEvent.contentOffset.x / (width - 32)
//                   );
//                   if (index >= 0 && index < parkingData.length) {
//                      handleCardSelect(parkingData[index], index);
//                   }
//                }}
//             />
//          </View>
//       </SafeAreaView>
//    );
// }

// const styles = StyleSheet.create({
//    container: {
//       flex: 1,
//       backgroundColor: "#F6F8FA",
//       paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//    },
//    content: {
//       flex: 1,
//    },
//    mapContainer: {
//       height: "70%",
//       position: "relative",
//    },
//    map: {
//       ...StyleSheet.absoluteFillObject,
//    },
//    customMarker: {
//       width: 12,
//       height: 12,
//       borderRadius: 6,
//       backgroundColor: "#6B4EFF",
//       borderWidth: 2,
//       borderColor: "#FFFFFF",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 4,
//       elevation: 3,
//       zIndex: 1,
//    },
//    selectedMarker: {
//       width: 16,
//       height: 16,
//       borderRadius: 8,
//       backgroundColor: "#6B4EFF",
//       borderWidth: 3,
//       borderColor: "#FFFFFF",
//       zIndex: 2,
//    },
//    markerRing: {
//       position: "absolute",
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       backgroundColor: "rgba(107, 78, 255, 0.15)",
//       borderWidth: 1,
//       borderColor: "rgba(107, 78, 255, 0.3)",
//       top: -12,
//       left: -12,
//       zIndex: 0,
//    },
//    searchContainer: {
//       position: "absolute",
//       top: 16,
//       left: 16,
//       right: 70,
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "rgba(255, 255, 255, 0.85)",
//       borderRadius: 24,
//       paddingHorizontal: 16,
//       paddingVertical: 12,
//       shadowColor: "#000",
//       shadowOffset: {
//          width: 0,
//          height: 2,
//       },
//       shadowOpacity: 0.07,
//       shadowRadius: 8,
//       elevation: 3,
//       overflow: "hidden",
//    },
//    searchIcon: {
//       marginRight: 8,
//    },
//    searchInput: {
//       flex: 1,
//       fontSize: 16,
//       color: "#333",
//       fontWeight: "500",
//    },
//    filterButton: {
//       position: "absolute",
//       top: 16,
//       right: 16,
//       shadowColor: "#6B4EFF",
//       shadowOffset: {
//          width: 0,
//          height: 4,
//       },
//       shadowOpacity: 0.2,
//       shadowRadius: 8,
//       elevation: 5,
//    },
//    gradientButton: {
//       width: 46,
//       height: 46,
//       borderRadius: 23,
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    locationButton: {
//       position: "absolute",
//       bottom: 20,
//       right: 16,
//       width: 46,
//       height: 46,
//       borderRadius: 23,
//       backgroundColor: "#FFFFFF",
//       justifyContent: "center",
//       alignItems: "center",
//       shadowColor: "#000",
//       shadowOffset: {
//          width: 0,
//          height: 2,
//       },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       elevation: 3,
//    },
//    parkingList: {
//       paddingHorizontal: 16,
//       paddingTop: 16,
//       paddingBottom: 24,
//    },
// });



import React, { useState, useRef, useEffect } from "react";
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   Image,
   TextInput,
   FlatList,
   SafeAreaView,
   Platform,
   StatusBar,
   Dimensions,
} from "react-native";
import MapView, {
   Marker,
   Polygon,
   Circle,
   PROVIDER_GOOGLE,
} from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ParkingCard } from "../../../components/ParkingCard"; // Import your existing component

const { width } = Dimensions.get("window");

// Sample parking data for Kathmandu
const parkingData = [
   {
      id: "1",
      name: "Thamel Parking",
      rating: 4.7,
      price: 250,
      time: "08",
      spots: 28,
      coordinate: {
         latitude: 27.7152,
         longitude: 85.3080,
      },
      image: require("../../../assets/images/login.png"),
   },
   {
      id: "2",
      name: "Durbar Marg Parking",
      rating: 4.5,
      price: 200,
      time: "07",
      spots: 15,
      coordinate: {
         latitude: 27.7120,
         longitude: 85.3150,
      },
      image: require("../../../assets/images/login.png"),
   },
];

// Map center coordinates (Kathmandu, Nepal)
const initialRegion = {
   latitude: 27.7172,
   longitude: 85.3240,
   latitudeDelta: 0.0422,
   longitudeDelta: 0.0221,
};

// Polygon coordinates for highlighted area in Kathmandu
const polygonCoordinates = [
   { latitude: 27.7152, longitude: 85.3070 },
   { latitude: 27.7172, longitude: 85.3090 },
   { latitude: 27.7142, longitude: 85.3110 },
   { latitude: 27.7132, longitude: 85.3080 },
];

export default function ParkingApp() {
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCard, setSelectedCard] = useState(null);
   const mapRef = useRef(null);
   const flatListRef = useRef(null);

   // Handle card selection
   const handleCardSelect = (item: any, index: any) => {
      setSelectedCard(item.id);
      // Animate to the selected parking location
      mapRef.current?.animateToRegion(
         {
            latitude: item.coordinate.latitude,
            longitude: item.coordinate.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
         },
         1000
      );
   };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            {/* Map View */}
            <View style={styles.mapContainer}>
               <MapView
                  ref={mapRef}
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={initialRegion}
                  showsUserLocation
                  showsMyLocationButton={false}
                  showsCompass={false}
                  toolbarEnabled={false}
               >
                  {/* Highlighted area */}
                  <Polygon
                     coordinates={polygonCoordinates}
                     fillColor="rgba(107, 78, 255, 0.1)"
                     strokeColor="#6B4EFF"
                     strokeWidth={2}
                  />

                  {/* Main circle in the center */}
                  <Circle
                     center={{
                        latitude: 27.7152,
                        longitude: 85.3090,
                     }}
                     radius={80}
                     fillColor="rgba(107, 78, 255, 0.2)"
                     strokeColor="transparent"
                  />

                  {/* Parking markers */}
                  {parkingData.map((parking) => (
                     <Marker
                        key={parking.id}
                        coordinate={parking.coordinate}
                        tracksViewChanges={false}
                     >
                        <View
                           style={[
                              styles.customMarker,
                              selectedCard === parking.id &&
                                 styles.selectedMarker,
                           ]}
                        >
                           {selectedCard === parking.id && (
                              <View style={styles.markerRing} />
                           )}
                        </View>
                     </Marker>
                  ))}
               </MapView>

               {/* Search bar with blur effect */}
               <BlurView intensity={80} style={styles.searchContainer}>
                  <MaterialIcons
                     name="search"
                     size={20}
                     color="#6B4EFF"
                     style={styles.searchIcon}
                  />
                  <TextInput
                     style={styles.searchInput}
                     placeholder="Search Parking"
                     value={searchQuery}
                     onChangeText={setSearchQuery}
                     placeholderTextColor="#8E8E93"
                  />
               </BlurView>

               {/* Filter button */}
               <TouchableOpacity style={styles.filterButton}>
                  <LinearGradient
                     colors={["#7B5DFF", "#6B4EFF"]}
                     style={styles.gradientButton}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 1 }}
                  >
                     <MaterialIcons name="tune" size={22} color="#fff" />
                  </LinearGradient>
               </TouchableOpacity>

               {/* Current location button */}
               <TouchableOpacity
                  style={styles.locationButton}
                  onPress={() =>
                     mapRef.current?.animateToRegion(initialRegion, 1000)
                  }
               >
                  <MaterialIcons name="my-location" size={22} color="#6B4EFF" />
               </TouchableOpacity>
            </View>

            {/* Parking cards with snap effect */}
            <FlatList
               ref={flatListRef}
               data={parkingData}
               keyExtractor={(item) => item.id}
               horizontal
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={styles.parkingList}
               snapToInterval={width - 32} // Card width + padding
               snapToAlignment="start"
               decelerationRate="fast"
               renderItem={({ item, index }) => (
                  <TouchableOpacity
                     activeOpacity={0.9}
                     onPress={() => handleCardSelect(item, index)}
                  >
                     <ParkingCard
                        name={item.name}
                        rating={item.rating}
                        price={item.price.toFixed(2)}
                        time={item.time}
                        spots={item.spots}
                        image={item.image}
                     />
                  </TouchableOpacity>
               )}
               onMomentumScrollEnd={(event) => {
                  const index = Math.floor(
                     event.nativeEvent.contentOffset.x / (width - 32)
                  );
                  if (index >= 0 && index < parkingData.length) {
                     handleCardSelect(parkingData[index], index);
                  }
               }}
            />
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#F6F8FA",
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
   },
   content: {
      flex: 1,
   },
   mapContainer: {
      height: "70%",
      position: "relative",
   },
   map: {
      ...StyleSheet.absoluteFillObject,
   },
   customMarker: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#6B4EFF",
      borderWidth: 2,
      borderColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 1,
   },
   selectedMarker: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: "#6B4EFF",
      borderWidth: 3,
      borderColor: "#FFFFFF",
      zIndex: 2,
   },
   markerRing: {
      position: "absolute",
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(107, 78, 255, 0.15)",
      borderWidth: 1,
      borderColor: "rgba(107, 78, 255, 0.3)",
      top: -12,
      left: -12,
      zIndex: 0,
   },
   searchContainer: {
      position: "absolute",
      top: 16,
      left: 16,
      right: 70,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.07,
      shadowRadius: 8,
      elevation: 3,
      overflow: "hidden",
   },
   searchIcon: {
      marginRight: 8,
   },
   searchInput: {
      flex: 1,
      fontSize: 16,
      color: "#333",
      fontWeight: "500",
   },
   filterButton: {
      position: "absolute",
      top: 16,
      right: 16,
      shadowColor: "#6B4EFF",
      shadowOffset: {
         width: 0,
         height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
   },
   gradientButton: {
      width: 46,
      height: 46,
      borderRadius: 23,
      justifyContent: "center",
      alignItems: "center",
   },
   locationButton: {
      position: "absolute",
      bottom: 20,
      right: 16,
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   parkingList: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 24,
   },
});