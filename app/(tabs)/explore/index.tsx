

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";

// Parking locations in Kathmandu
const parkingLocations = [
  {
    id: "1",
    name: "Dharahara Underground Parking",
    coordinate: {
      latitude: 27.7010,
      longitude: 85.3132,
    },
  },
  {
    id: "2",
    name: "Bishal Bazar Parking",
    coordinate: {
      latitude: 27.7041,
      longitude: 85.3094,
    },
  },
  {
    id: "3",
    name: "RB Complex Parking",
    coordinate: {
      latitude: 27.7012,
      longitude: 85.3096,
    },
  },
  {
    id: "4",
    name: "Kathmandu Tower Parking",
    coordinate: {
      latitude: 27.700001,
      longitude: 85.333336,
    },
  },
  {
    id: "5",
    name: "Tamarakar Complex Parking",
    coordinate: {
      latitude: 27.7023,
      longitude: 85.3100,
    },
  },
  {
    id: "6",
    name: "Ranjana Complex Parking",
    coordinate: {
      latitude: 27.7038,
      longitude: 85.3103,
    },
  },
  {
    id: "7",
    name: "Bhatbhateni Supermarket Parking",
    coordinate: {
      latitude: 27.6908,
      longitude: 85.2847,
    },
  },
];

// Map center coordinates for Kathmandu
const initialRegion = {
  latitude: 27.7010,
  longitude: 85.3132, // Centered at Dharahara
  latitudeDelta: 0.0422,
  longitudeDelta: 0.0421,
};

export default function ParkingApp() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(parkingLocations);
  const [selectedParking, setSelectedParking] = useState(null);
  const mapRef = useRef(null);

  // Handle search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredLocations(parkingLocations);
    } else {
      const filtered = parkingLocations.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  };

  // Handle marker selection
  const handleMarkerSelect = (location) => {
    setSelectedParking(location);
    // Animate to the selected parking location
    mapRef.current?.animateToRegion(
      {
        latitude: location.coordinate.latitude,
        longitude: location.coordinate.longitude,
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
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {/* Parking Markers */}
          {parkingLocations.map((location) => (
            <Marker
              key={location.id}
              coordinate={location.coordinate}
              title={location.name}
              onPress={() => handleMarkerSelect(location)}
            >
              <View
                style={[
                  styles.customMarker,
                  selectedParking?.id === location.id && styles.selectedMarker,
                ]}
              />
            </Marker>
          ))}
        </MapView>

        {/* Search bar */}
        <View style={styles.searchContainer}>
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
            onChangeText={handleSearch}
            placeholderTextColor="#8E8E93"
          />
        </View>

        {/* Current location button */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => mapRef.current?.animateToRegion(initialRegion, 1000)}
        >
          <MaterialIcons name="my-location" size={22} color="#6B4EFF" />
        </TouchableOpacity>

        {/* Search Results */}
        {searchQuery.trim() !== "" && (
          <FlatList
            data={filteredLocations}
            keyExtractor={(item) => item.id}
            style={styles.searchResults}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleMarkerSelect(item)}
              >
                <Text style={styles.resultText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
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
  },
  selectedMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF4E6B",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  searchContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
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
  searchResults: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultText: {
    fontSize: 14,
    color: "#333",
  },
});