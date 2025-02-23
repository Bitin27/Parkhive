// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// type Vehicle = {
//    id: string;
//    name: string;
//    type: string;
//    code: string;
// };

// interface VehicleSelectionProps {
//    onVehicleSelect: (vehicle: Vehicle) => void;
// }

// const vehicles: Vehicle[] = [
//    {
//       id: "1",
//       name: "Toyota Fortuner",
//       type: "SUV",
//       code: "GR 123-ABCD",
//    },
//    {
//       id: "2",
//       name: "Audi",
//       type: "Sedan",
//       code: "GR 123-ABCD",
//    },
//    {
//       id: "3",
//       name: "Honda CBR",
//       type: "Bike",
//       code: "GR A12-BCDE",
//    },
// ];

// const VehicleSelection: React.FC<VehicleSelectionProps> = ({
//    onVehicleSelect,
// }) => {
//    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

//    const handleVehicleSelect = (vehicle: Vehicle) => {
//       setSelectedVehicle(vehicle.id);
//       onVehicleSelect(vehicle);
//    };

//    const getVehicleIcon = (type: string) => {
//       switch (type.toLowerCase()) {
//          case "bike":
//             return "motorcycle";
//          case "suv":
//             return "car-estate";
//          case "sedan":
//             return "car";
//          default:
//             return "car";
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
//                   selectedVehicle === vehicle.id && styles.selectedVehicle,
//                ]}
//                onPress={() => handleVehicleSelect(vehicle)}
//             >
//                <View style={styles.iconContainer}>
//                   <MaterialCommunityIcons
//                      name={getVehicleIcon(vehicle.type)}
//                      size={24}
//                      color={
//                         selectedVehicle === vehicle.id ? "#FFFFFF" : "#666666"
//                      }
//                   />
//                </View>
//                <View style={styles.vehicleInfo}>
//                   <Text
//                      style={[
//                         styles.vehicleName,
//                         selectedVehicle === vehicle.id && styles.selectedText,
//                      ]}
//                   >
//                      {vehicle.name}
//                   </Text>
//                   <Text
//                      style={[
//                         styles.vehicleDetails,
//                         selectedVehicle === vehicle.id && styles.selectedText,
//                      ]}
//                   >
//                      {vehicle.type} • {vehicle.code}
//                   </Text>
//                </View>
//                {selectedVehicle === vehicle.id && (
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
//                selectedVehicle
//                   ? styles.continueButtonActive
//                   : styles.continueButtonDisabled,
//             ]}
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
//    },
//    continueButtonActive: {
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
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
   const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

   const handleVehicleSelect = (vehicle: Vehicle) => {
      setSelectedVehicle(vehicle.id);
      onVehicleSelect(vehicle);
   };

   const getVehicleIcon = (type: string): string => {
      return type.toLowerCase() === "bike" ? "motorbike" : "car";
   };
   const router = useRouter();
   const handleEvent = () => {
      router.push("/ParkingBooking");
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Select Vehicle</Text>
         {vehicles.map((vehicle) => (
            <TouchableOpacity
               key={vehicle.id}
               style={[
                  styles.vehicleItem,
                  selectedVehicle === vehicle.id && styles.selectedVehicle,
               ]}
               onPress={() => handleVehicleSelect(vehicle)}
            >
               <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                     name={getVehicleIcon(vehicle.type)}
                     size={24}
                     color={
                        selectedVehicle === vehicle.id ? "#FFFFFF" : "#666666"
                     }
                  />
               </View>
               <View style={styles.vehicleInfo}>
                  <Text
                     style={[
                        styles.vehicleName,
                        selectedVehicle === vehicle.id && styles.selectedText,
                     ]}
                  >
                     {vehicle.name}
                  </Text>
                  <Text
                     style={[
                        styles.vehicleDetails,
                        selectedVehicle === vehicle.id && styles.selectedText,
                     ]}
                  >
                     {vehicle.type} • {vehicle.code}
                  </Text>
               </View>
               {selectedVehicle === vehicle.id && (
                  <MaterialCommunityIcons
                     name="check-circle"
                     size={24}
                     color="#FFFFFF"
                     style={styles.checkIcon}
                  />
               )}
            </TouchableOpacity>
         ))}
         <TouchableOpacity
            style={[styles.continueButton]}
            onPress={handleEvent}
         >
            <Text style={styles.continueButtonText}>Continue</Text>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 16,
      backgroundColor: "#FFFFFF",
   },
   title: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 16,
      color: "#333333",
   },
   vehicleItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      marginBottom: 12,
      backgroundColor: "#F5F5F5",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#EEEEEE",
   },
   selectedVehicle: {
      backgroundColor: "#6C63FF",
      borderColor: "#6C63FF",
   },
   iconContainer: {
      width: 40,
      height: 40,
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
   },
   vehicleInfo: {
      flex: 1,
   },
   vehicleName: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333333",
   },
   vehicleDetails: {
      fontSize: 14,
      color: "#666666",
      marginTop: 4,
   },
   selectedText: {
      color: "#FFFFFF",
   },
   checkIcon: {
      marginLeft: 12,
   },
   continueButton: {
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 16,
      backgroundColor: "#6C63FF",
   },

   continueButtonDisabled: {
      backgroundColor: "#CCCCCC",
   },
   continueButtonText: {
      color: "#000",
      fontSize: 16,
      fontWeight: "600",
   },
});

export default VehicleSelection;
