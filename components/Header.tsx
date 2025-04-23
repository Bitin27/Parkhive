


import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { supabaseClient } from "../app/lib/supabase";

type HeaderProps = {
   title: string;
   showManagerOption?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, showManagerOption = true }) => {
   const router = useRouter();

   const switchToManager = () => {
      router.push("/manager/dashboard");
   };

   const handleSignOut = async () => {
      await supabaseClient.auth.signOut();
      router.replace("/(auth)");
   };

   return (
      <View style={styles.header}>
         <Text style={styles.title}>{title}</Text>
         <View style={styles.buttonContainer}>
            {showManagerOption && (
               <TouchableOpacity
                  style={styles.managerButton}
                  onPress={switchToManager}
               >
                  <Text style={styles.managerButtonText}>Manager Mode</Text>
               </TouchableOpacity>
            )}
       
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#6B4EFF",
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#ffffff",
      letterSpacing: 0.3,
   },
   buttonContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   managerButton: {
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 6,
      marginRight: 10,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
   },
   managerButtonText: {
      color: "#ffffff",
      fontSize: 13,
      fontWeight: "600",
   },
   signOutButton: {
      backgroundColor: "#ffffff",
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 6,
   },
   signOutButtonText: {
      color: "#2589cc",
      fontSize: 13,
      fontWeight: "600",
   },
});

export default Header;