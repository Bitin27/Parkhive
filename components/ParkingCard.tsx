import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function ParkingCard({ name, rating, price, time, spots, image }: any) {
   const router = useRouter();
   return (
      <TouchableOpacity style={styles.card}>
         <View style={styles.imageContainer}>
            <Image source={image} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.ratingContainer}>
               <MaterialIcons name="star" size={16} color="#FFD700" />
               <Text style={styles.ratingText}>{rating}</Text>
            </View>
            <TouchableOpacity style={styles.heartButton}>
               <MaterialIcons name="favorite-border" size={20} color="red" />
            </TouchableOpacity>
         </View>
         <View style={styles.cardContent}>
            <Text style={styles.cardType}>Car Parking</Text>
            <Text style={styles.cardName}>{name}</Text>
            <View style={styles.cardDetails}>
               <View style={styles.detailItem}>
                  <MaterialIcons name="access-time" size={16} color="#6B4EFF" />
                  <Text style={styles.detailText}>{time} Mins</Text>
               </View>
               <View style={styles.detailItem}>
                  <MaterialIcons
                     name="local-parking"
                     size={16}
                     color="#6B4EFF"
                  />
                  <Text style={styles.detailText}>{spots} Spots</Text>
               </View>
            </View>
            <View style={styles.priceContainer}>
               <Text style={styles.priceAmount}>${price}</Text>
               <Text style={styles.priceUnit}>/hr</Text>
            </View>
         </View>
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   card: {
      width: 280,
      backgroundColor: "white",
      borderRadius: 16,
      marginRight: 16,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 8,
   },
   imageContainer: {
      position: "relative",
   },
   cardImage: {
      width: "100%",
      height: 160,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
   },
   ratingContainer: {
      position: "absolute",
      top: 12,
      left: 12,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
   },
   ratingText: {
      marginLeft: 4,
      color: "#000",
      fontWeight: "600",
   },
   heartButton: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      padding: 8,
      borderRadius: 8,
   },
   cardContent: {
      padding: 16,
   },
   cardType: {
      color: "#6B4EFF",
      fontSize: 12,
      fontWeight: "500",
   },
   cardName: {
      fontSize: 18,
      fontWeight: "600",
      color: "#000",
      marginTop: 4,
   },
   cardDetails: {
      flexDirection: "row",
      gap: 16,
      marginTop: 12,
   },
   detailItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
   },
   detailText: {
      color: "#666",
      fontSize: 14,
   },
   priceContainer: {
      flexDirection: "row",
      alignItems: "baseline",
      marginTop: 12,
   },
   priceAmount: {
      color: "#6B4EFF",
      fontSize: 20,
      fontWeight: "600",
   },
   priceUnit: {
      color: "#666",
      fontSize: 14,
      marginLeft: 2,
   },
});
