
// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";

// type Vehicle = {
//    id: string;
//    name: string;
//    type: string;
//    code: string;
// };

// interface VehicleSelectionProps {
//    onVehicleSelect?: (vehicle: Vehicle) => void;
// }

// const vehicles: Vehicle[] = [
//    {
//       id: "1",
//       name: "Toyota Camry",
//       type: "Car",
//       code: "GR 123-ABCD",
//    },
//    {
//       id: "2",
//       name: "Honda CBR",
//       type: "Bike",
//       code: "GR A12-BCDE",
//    },
// ];

// const VehicleSelection: React.FC<VehicleSelectionProps> = ({
//    onVehicleSelect = () => {},
// }) => {
//    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//    const router = useRouter();
//    const { parkingId } = useLocalSearchParams<{ parkingId: string }>();
//    console.log("What is this", parkingId);

//    const handleVehicleSelect = (vehicle: Vehicle) => {
//       setSelectedVehicle(vehicle);
//       onVehicleSelect(vehicle);
//    };

//    const getVehicleIcon = (type: string): string => {
//       return type.toLowerCase() === "bike" ? "motorbike" : "car";
//    };

//    const handleContinue = () => {
//       // Only navigate if a vehicle is selected
//       if (selectedVehicle) {
//          // Pass the selected vehicle data as a parameter
//          router.push({
//             pathname: "/ParkingBooking",
//             params: {
//                zoneId: parkingId,
//                vehicleId: selectedVehicle.id,
//                vehicleName: selectedVehicle.name,
//                vehicleType: selectedVehicle.type,
//                vehicleCode: selectedVehicle.code,
//             },
//          });
//       } else {
//          // Optional: Show an alert or message that a vehicle must be selected
//          alert("Please select a vehicle to continue");
//       }
//    };

//    return (
//       <View style={styles.container}>
//          <Text style={styles.title}>Select Vehicle</Text>
//          {vehicles.map((vehicle) => (
//             <TouchableOpacity
//                key={vehicle.id}
//                style={[
//                   styles.vehicleItem,
//                   selectedVehicle?.id === vehicle.id && styles.selectedVehicle,
//                ]}
//                onPress={() => handleVehicleSelect(vehicle)}
//             >
//                <View style={styles.iconContainer}>
//                   <MaterialCommunityIcons
//                      name={getVehicleIcon(vehicle.type)}
//                      size={24}
//                      color={
//                         selectedVehicle?.id === vehicle.id
//                            ? "#FFFFFF"
//                            : "#666666"
//                      }
//                   />
//                </View>
//                <View style={styles.vehicleInfo}>
//                   <Text
//                      style={[
//                         styles.vehicleName,
//                         selectedVehicle?.id === vehicle.id &&
//                            styles.selectedText,
//                      ]}
//                   >
//                      {vehicle.name}
//                   </Text>
//                   <Text
//                      style={[
//                         styles.vehicleDetails,
//                         selectedVehicle?.id === vehicle.id &&
//                            styles.selectedText,
//                      ]}
//                   >
//                      {vehicle.type} • {vehicle.code}
//                   </Text>
//                </View>
//                {selectedVehicle?.id === vehicle.id && (
//                   <MaterialCommunityIcons
//                      name="check-circle"
//                      size={24}
//                      color="#FFFFFF"
//                      style={styles.checkIcon}
//                   />
//                )}
//             </TouchableOpacity>
//          ))}
//          <TouchableOpacity
//             style={[
//                styles.continueButton,
//                !selectedVehicle && styles.continueButtonDisabled,
//             ]}
//             onPress={handleContinue}
//             disabled={!selectedVehicle}
//          >
//             <Text style={styles.continueButtonText}>Continue</Text>
//          </TouchableOpacity>
//       </View>
//    );
// };

// const styles = StyleSheet.create({
//    container: {
//       padding: 16,
//       backgroundColor: "#FFFFFF",
//    },
//    title: {
//       fontSize: 20,
//       fontWeight: "600",
//       marginBottom: 16,
//       color: "#333333",
//    },
//    vehicleItem: {
//       flexDirection: "row",
//       alignItems: "center",
//       padding: 16,
//       marginBottom: 12,
//       backgroundColor: "#F5F5F5",
//       borderRadius: 12,
//       borderWidth: 1,
//       borderColor: "#EEEEEE",
//    },
//    selectedVehicle: {
//       backgroundColor: "#6C63FF",
//       borderColor: "#6C63FF",
//    },
//    iconContainer: {
//       width: 40,
//       height: 40,
//       backgroundColor: "#FFFFFF",
//       borderRadius: 20,
//       justifyContent: "center",
//       alignItems: "center",
//       marginRight: 12,
//    },
//    vehicleInfo: {
//       flex: 1,
//    },
//    vehicleName: {
//       fontSize: 16,
//       fontWeight: "500",
//       color: "#333333",
//    },
//    vehicleDetails: {
//       fontSize: 14,
//       color: "#666666",
//       marginTop: 4,
//    },
//    selectedText: {
//       color: "#FFFFFF",
//    },
//    checkIcon: {
//       marginLeft: 12,
//    },
//    continueButton: {
//       padding: 16,
//       borderRadius: 12,
//       alignItems: "center",
//       marginTop: 16,
//       backgroundColor: "#6C63FF",
//    },
//    continueButtonDisabled: {
//       backgroundColor: "#CCCCCC",
//    },
//    continueButtonText: {
//       color: "#FFFFFF",
//       fontSize: 16,
//       fontWeight: "600",
//    },
// });

// export default VehicleSelection;




import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

type Vehicle = {
   id: string;
   name: string;
   type: string;
   code: string;
};

interface VehicleSelectionProps {
   onVehicleSelect?: (vehicle: Vehicle) => void;
}

const vehicles: Vehicle[] = [
   {
      id: "1",
      name: "Toyota Camry",
      type: "Car",
      code: "GR 123-ABCD",
   },
   {
      id: "2",
      name: "Honda CBR",
      type: "Bike",
      code: "GR A12-BCDE",
   },
];

const VehicleSelection: React.FC<VehicleSelectionProps> = ({
   onVehicleSelect = () => {},
}) => {
   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
   const router = useRouter();
   const { parkingId } = useLocalSearchParams<{ parkingId: string }>();
   console.log("What is this", parkingId);

   const handleVehicleSelect = (vehicle: Vehicle) => {
      setSelectedVehicle(vehicle);
      onVehicleSelect(vehicle);
   };

   const getVehicleIcon = (type: string): string => {
      return type.toLowerCase() === "bike" ? "motorbike" : "car";
   };

   const handleContinue = () => {
      // Only navigate if a vehicle is selected
      if (selectedVehicle) {
         // Pass the selected vehicle data as a parameter
         router.push({
            pathname: "/ParkingBooking",
            params: {
               zoneId: parkingId,
               vehicleId: selectedVehicle.id,
               vehicleName: selectedVehicle.name,
               vehicleType: selectedVehicle.type,
               vehicleCode: selectedVehicle.code,
            },
         });
      } else {
         // Optional: Show an alert or message that a vehicle must be selected
         alert("Please select a vehicle to continue");
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Select Vehicle</Text>
         <View style={styles.vehiclesContainer}>
            {vehicles.map((vehicle) => (
               <TouchableOpacity
                  key={vehicle.id}
                  style={[
                     styles.vehicleItem,
                     selectedVehicle?.id === vehicle.id && styles.selectedVehicle,
                  ]}
                  onPress={() => handleVehicleSelect(vehicle)}
                  activeOpacity={0.8}
               >
                  <View style={[
                     styles.iconContainer,
                     selectedVehicle?.id === vehicle.id && styles.selectedIconContainer,
                  ]}>
                     <MaterialCommunityIcons
                        name={getVehicleIcon(vehicle.type)}
                        size={28}
                        color={
                           selectedVehicle?.id === vehicle.id
                              ? "#FFFFFF"
                              : "#5D5FEF"
                        }
                     />
                  </View>
                  <View style={styles.vehicleInfo}>
                     <Text
                        style={[
                           styles.vehicleName,
                           selectedVehicle?.id === vehicle.id &&
                              styles.selectedText,
                        ]}
                     >
                        {vehicle.name}
                     </Text>
                     <Text
                        style={[
                           styles.vehicleDetails,
                           selectedVehicle?.id === vehicle.id &&
                              styles.selectedText,
                        ]}
                     >
                        {vehicle.type} • {vehicle.code}
                     </Text>
                  </View>
                  {selectedVehicle?.id === vehicle.id && (
                     <View style={styles.checkIconContainer}>
                        <MaterialCommunityIcons
                           name="check-circle"
                           size={24}
                           color="#FFFFFF"
                        />
                     </View>
                  )}
               </TouchableOpacity>
            ))}
         </View>
         <TouchableOpacity
            style={[
               styles.continueButton,
               !selectedVehicle && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedVehicle}
            activeOpacity={0.8}
         >
            <Text style={styles.continueButtonText}>Continue</Text>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#F8F9FC",
   },
   title: {
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 20,
      color: "#1F2937",
      letterSpacing: 0.3,
   },
   vehiclesContainer: {
      marginBottom: 20,
   },
   vehicleItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 5,
      elevation: 2,
   },
   selectedVehicle: {
      backgroundColor: "#5D5FEF",
      borderColor: "#5D5FEF",
   },
   iconContainer: {
      width: 50,
      height: 50,
      backgroundColor: "#F3F4FF",
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
   },
   selectedIconContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
   },
   vehicleInfo: {
      flex: 1,
   },
   vehicleName: {
      fontSize: 18,
      fontWeight: "600",
      color: "#1F2937",
      marginBottom: 4,
   },
   vehicleDetails: {
      fontSize: 14,
      color: "#6B7280",
   },
   selectedText: {
      color: "#FFFFFF",
   },
   checkIconContainer: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
   },
   continueButton: {
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      backgroundColor: "#5D5FEF",
      shadowColor: "#5D5FEF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
   },
   continueButtonDisabled: {
      backgroundColor: "#D1D5DB",
      shadowOpacity: 0,
      elevation: 0,
   },
   continueButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
      letterSpacing: 0.3,
   },
});

export default VehicleSelection;