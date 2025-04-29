// import {
//    View,
//    Text,
//    StyleSheet,
//    Image,
//    TouchableOpacity,
//    Alert,
//    ActivityIndicator,
// } from "react-native";
// import React from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//    Bell,
//    ChevronRight,
//    HelpCircleIcon,
//    LogOutIcon,
//    CarFront,
//    User,
//    CreditCard,
//    Clock,
//    FileText,
// } from "lucide-react-native";
// import { useUser, useAuth } from "@clerk/clerk-expo";
// import { useRouter } from "expo-router";

// export default function Profile() {
//    const { user, isLoaded: isUserLoaded } = useUser();
//    const { signOut } = useAuth();
//    const router = useRouter();

//    const fullName = user?.fullName || user?.firstName || "Guest";
//    const userName =
//       user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
//       `user${user?.id?.slice(0, 5)}` ||
//       "@guest";

//    const handleLogout = async () => {
//       Alert.alert("Logout", "Are you sure you want to logout?", [
//          {
//             text: "Cancel",
//             style: "cancel",
//          },
//          {
//             text: "Logout",
//             style: "destructive",
//             onPress: async () => {
//                try {
//                   await signOut();
//                   router.replace("/(auth)");
//                } catch (error) {
//                   console.error("Error signing out:", error);
//                   Alert.alert("Error", "Failed to logout. Please try again.");
//                }
//             },
//          },
//       ]);
//    };

//    const getInitials = () => {
//       if (!user) return "G";
//       const names = fullName.split(" ");
//       return names.length > 1
//          ? `${names[0][0]}${names[names.length - 1][0]}`
//          : names[0][0];
//    };

//    const renderAvatar = () => {
//       if (!isUserLoaded) {
//          return (
//             <View style={[styles.avatar, styles.avatarLoading]}>
//                <ActivityIndicator color="#1e3a8a" size="large" />
//             </View>
//          );
//       }

//       if (user?.imageUrl) {
//          return (
//             <Image
//                source={{ uri: user.imageUrl }}
//                style={styles.avatar}
//                onLoadStart={() => <ActivityIndicator color="#1e3a8a" />}
//             />
//          );
//       }

//       return (
//          <View style={[styles.avatar, styles.avatarFallback]}>
//             <Text style={styles.avatarText}>{getInitials()}</Text>
//          </View>
//       );
//    };

//    // Function to navigate to parking history
//    const navigateToParkingHistory = () => {
//       router.push("/");
//    };

//    // Function to navigate to vehicle management
//    const navigateToVehicles = () => {
//       router.push("/");
//    };

//    // Function to navigate to payment methods
//    const navigateToPayments = () => {
//       router.push("/");
//    };

//    return (
//       <SafeAreaView style={styles.safeArea}>
//          <View style={styles.container}>
//             <Text style={styles.welcome}>Profile Settings</Text>

//             <View style={styles.profileSection}>
//                <View style={styles.avatarContainer}>{renderAvatar()}</View>
//                <View style={styles.welcomeText}>
//                   {!isUserLoaded ? (
//                      <ActivityIndicator color="white" />
//                   ) : (
//                      <>
//                         <Text style={styles.name}>{fullName}</Text>
//                         <Text style={styles.username}>@{userName}</Text>
//                      </>
//                   )}
//                </View>
//             </View>
//          </View>

//          {/* Parking Summary */}
//          <View style={styles.summary}>
//             <View style={styles.summaryItem}>
//                <Text style={styles.summaryTitle}>Active Bookings</Text>
//                <Text style={styles.summarySub}>1</Text>
//             </View>
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryItem}>
//                <Text style={styles.summaryTitle}>Total Parkings</Text>
//                <Text style={styles.summarySub}>12</Text>
//             </View>
//             <View style={styles.summaryDivider} />
//             <View style={styles.summaryItem}>
//                <Text style={styles.summaryTitle}>Wallet Balance</Text>
//                <Text style={styles.summarySub}>$25.50</Text>
//             </View>
//          </View>

//          <View style={styles.body}>
//             <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={navigateToVehicles}>
//                <CarFront color="#1e3a8a" size={22} />
//                <Text style={styles.menuText}>My Vehicles</Text>
//                <ChevronRight color="#777" size={20} style={styles.chevron} />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={navigateToParkingHistory}>
//                <Clock color="#1e3a8a" size={22} />
//                <Text style={styles.menuText}>Parking History</Text>
//                <ChevronRight color="#777" size={20} style={styles.chevron} />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={navigateToPayments}>
//                <CreditCard color="#1e3a8a" size={22} />
//                <Text style={styles.menuText}>Payment Methods</Text>
//                <ChevronRight color="#777" size={20} style={styles.chevron} />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
//                <Bell color="#1e3a8a" size={22} />
//                <Text style={styles.menuText}>Notifications</Text>
//                <ChevronRight color="#777" size={20} style={styles.chevron} />
//             </TouchableOpacity>


//             <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
//                <HelpCircleIcon color="#1e3a8a" size={22} />
//                <Text style={styles.menuText}>Help & Support</Text>
//                <ChevronRight color="#777" size={20} style={styles.chevron} />
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
//                <FileText color="#1e3a8a" size={22} />
//                <Text style={styles.menuText}>Terms & Privacy</Text>
//                <ChevronRight color="#777" size={20} style={styles.chevron} />
//             </TouchableOpacity>

//             <TouchableOpacity
//                style={[styles.menuItem, styles.logoutItem]}
//                activeOpacity={0.7}
//                onPress={handleLogout}
//             >
//                <LogOutIcon color="#e11d48" size={22} />
//                <Text style={styles.logoutText}>Logout</Text>
//             </TouchableOpacity>
//          </View>
//       </SafeAreaView>
//    );
// }

// const styles = StyleSheet.create({
//    safeArea: {
//       flex: 1,
//       backgroundColor: "#f8fafc",
//    },
//    container: {
//       backgroundColor: "#1e3a8a",
//       borderBottomLeftRadius: 30,
//       borderBottomRightRadius: 30,
//       padding: 20,
//       paddingBottom: 30,
//    },
//    profileSection: {
//       flexDirection: "column",
//       alignItems: "center",
//       marginTop: 5,
//    },
//    avatarContainer: {
//       marginBottom: 10,
//    },
//    avatar: {
//       width: 90,
//       height: 90,
//       backgroundColor: "#e5e7eb",
//       borderRadius: 45,
//       borderWidth: 3,
//       borderColor: "#ffffff",
//    },
//    welcomeText: {
//       alignItems: "center",
//    },
//    welcome: {
//       color: "white",
//       fontSize: 18,
//       fontWeight: "700",
//       textAlign: "center",
//       marginBottom: 15,
//       marginTop: 5,
//    },
//    name: {
//       color: "white",
//       fontSize: 20,
//       fontWeight: "600",
//    },
//    username: {
//       color: "white",
//       fontSize: 14,
//       opacity: 0.8,
//       marginTop: 2,
//    },
//    body: {
//       marginHorizontal: 16,
//       marginTop: 5,
//       backgroundColor: "white",
//       borderRadius: 15,
//       paddingVertical: 5,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.05,
//       shadowRadius: 3,
//       elevation: 2,
//    },
//    menuItem: {
//       padding: 16,
//       flexDirection: "row",
//       alignItems: "center",
//       borderBottomWidth: 1,
//       borderBottomColor: "#f1f5f9",
//    },
//    menuText: {
//       fontSize: 16,
//       fontWeight: "500",
//       color: "#333",
//       marginLeft: 12,
//       flex: 1,
//    },
//    chevron: {
//       marginLeft: "auto",
//    },
//    logoutItem: {
//       borderBottomWidth: 0,
//    },
//    logoutText: {
//       fontSize: 16,
//       fontWeight: "500",
//       color: "#e11d48",
//       marginLeft: 12,
//    },
//    summary: {
//       backgroundColor: "#ffffff",
//       marginVertical: 15,
//       marginHorizontal: 16,
//       borderRadius: 15,
//       padding: 15,
//       flexDirection: "row",
//       justifyContent: "space-between",
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.05,
//       shadowRadius: 3,
//       elevation: 2,
//    },
//    summaryItem: {
//       flex: 1,
//       alignItems: "center",
//    },
//    summaryDivider: {
//       width: 1,
//       backgroundColor: "#e2e8f0",
//       height: "70%",
//       alignSelf: "center",
//    },
//    summaryTitle: {
//       fontWeight: "600",
//       fontSize: 14,
//       color: "#64748b",
//       marginBottom: 5,
//    },
//    summarySub: {
//       fontSize: 18,
//       fontWeight: "700",
//       color: "#1e3a8a",
//    },
//    avatarFallback: {
//       backgroundColor: "#ffffff",
//       justifyContent: "center",
//       alignItems: "center",
//    },
//    avatarText: {
//       fontSize: 20,
//       fontWeight: "600",
//       color: "#1e3a8a",
//    },
//    avatarLoading: {
//       backgroundColor: "#e5e7eb",
//       justifyContent: "center",
//       alignItems: "center",
//    },
// });




import {
   View,
   Text,
   StyleSheet,
   Image,
   TouchableOpacity,
   Alert,
   ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   ChevronRight,
   HelpCircleIcon,
   LogOutIcon,
   CarFront,
   CreditCard,
   Clock,
   FileText,
} from "lucide-react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Profile() {
   const { user, isLoaded: isUserLoaded } = useUser();
   const { signOut } = useAuth();
   const router = useRouter();

   const fullName = user?.fullName || user?.firstName || "Guest";
   const userName =
      user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      `user${user?.id?.slice(0, 5)}` ||
      "@guest";

   const handleLogout = async () => {
      Alert.alert("Logout", "Are you sure you want to logout?", [
         {
            text: "Cancel",
            style: "cancel",
         },
         {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
               try {
                  await signOut();
                  router.replace("/(auth)");
               } catch (error) {
                  console.error("Error signing out:", error);
                  Alert.alert("Error", "Failed to logout. Please try again.");
               }
            },
         },
      ]);
   };

   const getInitials = () => {
      if (!user) return "G";
      const names = fullName.split(" ");
      return names.length > 1
         ? `${names[0][0]}${names[names.length - 1][0]}`
         : names[0][0];
   };

   const renderAvatar = () => {
      if (!isUserLoaded) {
         return (
            <View style={[styles.avatar, styles.avatarLoading]}>
               <ActivityIndicator color="#1e3a8a" size="large" />
            </View>
         );
      }

      if (user?.imageUrl) {
         return (
            <Image
               source={{ uri: user.imageUrl }}
               style={styles.avatar}
               onLoadStart={() => <ActivityIndicator color="#1e3a8a" />}
            />
         );
      }

      return (
         <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
         </View>
      );
   };

   // Function to navigate to parking history
   const navigateToParkingHistory = () => {
      router.push("/");
   };

   // Function to navigate to vehicle management
   const navigateToVehicles = () => {
      router.push("/");
   };

   // Function to navigate to payment methods
   const navigateToPayments = () => {
      router.push("/");
   };

   return (
      <SafeAreaView style={styles.safeArea}>
         <View style={styles.container}>
            <Text style={styles.welcome}>Profile Settings</Text>

            <View style={styles.profileSection}>
               <View style={styles.avatarContainer}>{renderAvatar()}</View>
               <View style={styles.welcomeText}>
                  {!isUserLoaded ? (
                     <ActivityIndicator color="white" />
                  ) : (
                     <>
                        <Text style={styles.name}>{fullName}</Text>
                        <Text style={styles.username}>@{userName}</Text>
                     </>
                  )}
               </View>
            </View>
         </View>

         <View style={styles.body}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={navigateToVehicles}>
               <CarFront color="#1e3a8a" size={22} />
               <Text style={styles.menuText}>My Vehicles</Text>
               <ChevronRight color="#777" size={20} style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={navigateToParkingHistory}>
               <Clock color="#1e3a8a" size={22} />
               <Text style={styles.menuText}>Parking History</Text>
               <ChevronRight color="#777" size={20} style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={navigateToPayments}>
               <CreditCard color="#1e3a8a" size={22} />
               <Text style={styles.menuText}>Payment Methods</Text>
               <ChevronRight color="#777" size={20} style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
               <HelpCircleIcon color="#1e3a8a" size={22} />
               <Text style={styles.menuText}>Help & Support</Text>
               <ChevronRight color="#777" size={20} style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
               <FileText color="#1e3a8a" size={22} />
               <Text style={styles.menuText}>Terms & Privacy</Text>
               <ChevronRight color="#777" size={20} style={styles.chevron} />
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.menuItem, styles.logoutItem]}
               activeOpacity={0.7}
               onPress={handleLogout}
            >
               <LogOutIcon color="#e11d48" size={22} />
               <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: "#f8fafc",
   },
   container: {
      backgroundColor: "#1e3a8a",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      padding: 20,
      paddingBottom: 30,
   },
   profileSection: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: 5,
   },
   avatarContainer: {
      marginBottom: 10,
   },
   avatar: {
      width: 90,
      height: 90,
      backgroundColor: "#e5e7eb",
      borderRadius: 45,
      borderWidth: 3,
      borderColor: "#ffffff",
   },
   welcomeText: {
      alignItems: "center",
   },
   welcome: {
      color: "white",
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 15,
      marginTop: 5,
   },
   name: {
      color: "white",
      fontSize: 20,
      fontWeight: "600",
   },
   username: {
      color: "white",
      fontSize: 14,
      opacity: 0.8,
      marginTop: 2,
   },
   body: {
      marginHorizontal: 16,
      marginTop: 25,
      backgroundColor: "white",
      borderRadius: 15,
      paddingVertical: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
   },
   menuItem: {
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#f1f5f9",
   },
   menuText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      marginLeft: 12,
      flex: 1,
   },
   chevron: {
      marginLeft: "auto",
   },
   logoutItem: {
      borderBottomWidth: 0,
   },
   logoutText: {
      fontSize: 16,
      fontWeight: "500",
      color: "#e11d48",
      marginLeft: 12,
   },
   avatarFallback: {
      backgroundColor: "#ffffff",
      justifyContent: "center",
      alignItems: "center",
   },
   avatarText: {
      fontSize: 20,
      fontWeight: "600",
      color: "#1e3a8a",
   },
   avatarLoading: {
      backgroundColor: "#e5e7eb",
      justifyContent: "center",
      alignItems: "center",
   },
});