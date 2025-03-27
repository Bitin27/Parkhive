import { MaterialIcons } from "@expo/vector-icons";
import {
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <View style={styles.locationContainer}>
               <MaterialIcons name="location-on" size={24} color="#fff" />
               <Text style={styles.locationText}>Thamel,Kathmandu</Text>
               <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color="#fff"
               />
            </View>
            <TouchableOpacity style={styles.notificationButton}>
               <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color="#fff"
               />
            </TouchableOpacity>
         </View>

         <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
               <MaterialIcons name="search" size={24} color="#A0A0A0" />
               <TextInput
                  style={styles.searchInput}
                  placeholder="Search Parking"
                  placeholderTextColor="#A0A0A0"
               />
            </View>
            <TouchableOpacity style={styles.filterButton}>
               <MaterialIcons name="tune" size={24} color="#6B4EFF" />
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#6B4EFF",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
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
      color: "#fff",
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
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
   },
});
