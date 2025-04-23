

// This is the solutions from the parking manager
import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   Alert,
   ActivityIndicator,
} from "react-native";
import {
   supabaseClient,
   getStoredManagerData,
   storeManagerData,
   clearManagerData,
} from "../../app/lib/supabase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BookingsScreen from "../../components/parkingmanager/BookingsScreen";
import ParkingSlotsScreen from "../../components/parkingmanager/ParkingSlotsScreen";
import QRScannerScreen from "../../components/parkingmanager/QRScannerScreen";

// Define manager data type
type ParkingManager = {
   managerid: number;
   firstname: string;
   lastname: string;
   email: string;
   phone: string | null;
   address: string | null;
   verificationstatus: string;
   roleid: number;
};

type TabType = "bookings" | "slots" | "scanner";

const ManagerDashboard = () => {
   const [managerData, setManagerData] = useState<ParkingManager | null>(null);
   const [activeTab, setActiveTab] = useState<TabType>("bookings");
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   // Load manager data on component mount
   useEffect(() => {
      const loadManagerData = async () => {
         try {
            // Check if user is authenticated
            const {
               data: { session },
            } = await supabaseClient.auth.getSession();

            if (!session) {
               router.replace("/(manager-auth)/login");
               return;
            }

            // Get manager data from SecureStore or fetch it
            const storedData = await getStoredManagerData();
            if (storedData) {
               setManagerData(storedData);
            } else {
               // Fetch from database if not in local storage
               const { data, error } = await supabaseClient
                  .from("parkingmanagers")
                  .select("*")
                  .eq("email", session.user.email)
                  .single();

               if (error) throw error;

               // Store the data for future use
               await storeManagerData(data);
               setManagerData(data);
            }
         } catch (error) {
            console.error("Error loading manager data:", error);
            Alert.alert("Error", "Failed to load manager data");
            router.replace("/(manager-auth)/login");
         } finally {
            setLoading(false);
         }
      };

      loadManagerData();
   }, []);

   // Sign out function
   const handleSignOut = async () => {
      try {
         await supabaseClient.auth.signOut();
         await clearManagerData();
         router.replace("/(manager-auth)/login");
      } catch (error) {
         console.error("Error signing out:", error);
         Alert.alert("Error", "Failed to sign out");
      }
   };

   // Switch to user app
   const switchToUserApp = () => {
      router.replace("/");
   };

   if (loading) {
      return (
         <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading dashboard...</Text>
         </View>
      );
   }

   if (!managerData) {
      return (
         <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load manager data</Text>
            <TouchableOpacity
               style={styles.retryButton}
               onPress={() => router.replace("/(manager-auth)/login")}
            >
               <Text style={styles.retryButtonText}>Return to Login</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <View style={styles.container}>
         {/* Header */}
         <View style={styles.header}>
            <Text style={styles.welcomeText}>
               Hello, {managerData.firstname} {managerData.lastname}
            </Text>
            <View style={styles.headerButtons}>
               {/* <TouchableOpacity
                  style={styles.switchButton}
                  onPress={switchToUserApp}
               >
                  <Text style={styles.switchButtonText}>Switch to User</Text>
               </TouchableOpacity> */}
               <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
               >
                  <Text style={styles.signOutButtonText}>Sign Out</Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Main Content Area */}
         <View style={styles.content}>
            {activeTab === "bookings" && (
               <BookingsScreen managerId={managerData.managerid} />
            )}
            {activeTab === "slots" && <ParkingSlotsScreen />}
            {activeTab === "scanner" && <QRScannerScreen />}
         </View>

         {/* Bottom Navigation */}
         <View style={styles.tabBar}>
            <TouchableOpacity
               style={[
                  styles.tab,
                  activeTab === "bookings" && styles.activeTab,
               ]}
               onPress={() => setActiveTab("bookings")}
            >
               <Ionicons
                  name="calendar"
                  size={24}
                  color={activeTab === "bookings" ? "#3498db" : "#8e8e93"}
               />
               <Text
                  style={[
                     styles.tabText,
                     activeTab === "bookings" && styles.activeTabText,
                  ]}
               >
                  Bookings
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.tab, activeTab === "slots" && styles.activeTab]}
               onPress={() => setActiveTab("slots")}
            >
               <Ionicons
                  name="car"
                  size={24}
                  color={activeTab === "slots" ? "#3498db" : "#8e8e93"}
               />
               <Text
                  style={[
                     styles.tabText,
                     activeTab === "slots" && styles.activeTabText,
                  ]}
               >
                  Slots
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.tab, activeTab === "scanner" && styles.activeTab]}
               onPress={() => setActiveTab("scanner")}
            >
               <Ionicons
                  name="qr-code"
                  size={24}
                  color={activeTab === "scanner" ? "#3498db" : "#8e8e93"}
               />
               <Text
                  style={[
                     styles.tabText,
                     activeTab === "scanner" && styles.activeTabText,
                  ]}
               >
                  Scanner
               </Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
   },
   loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
   },
   loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: "#3498db",
   },
   errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
      padding: 20,
   },
   errorText: {
      fontSize: 16,
      color: "#e74c3c",
      marginBottom: 16,
   },
   retryButton: {
      backgroundColor: "#3498db",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
   },
   retryButtonText: {
      color: "white",
      fontWeight: "600",
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: "#3498db",
      paddingTop: 30, // Extra padding for status bar
   },
   welcomeText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
   },
   headerButtons: {
      flexDirection: "row",
   },
   switchButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
      marginRight: 8,
   },
   switchButtonText: {
      color: "white",
      fontSize: 12,
   },
   signOutButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
   },
   signOutButtonText: {
      color: "white",
      fontSize: 12,
   },
   content: {
      flex: 1,
   },
   tabBar: {
      flexDirection: "row",
      height: 60,
      backgroundColor: "white",
      borderTopWidth: 1,
      borderTopColor: "#e0e0e0",
   },
   tab: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   activeTab: {
      borderTopWidth: 2,
      borderTopColor: "#3498db",
   },
   tabText: {
      fontSize: 12,
      marginTop: 2,
      color: "#8e8e93",
   },
   activeTabText: {
      color: "#3498db",
      fontWeight: "500",
   },
});

export default ManagerDashboard;
