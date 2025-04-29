import {
   Alert,
   Image,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   Dimensions,
   Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState, useRef } from "react";
import { useSSO, useAuth, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { supabaseClient } from "../lib/supabase";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export const useWarmUpBrowser = () => {
   React.useEffect(() => {
      void WebBrowser.warmUpAsync();
      return () => {
         void WebBrowser.coolDownAsync();
      };
   }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const [isSyncingDb, setIsSyncingDb] = useState(false);
   const [authError, setAuthError] = useState(null);
   const [userInfo, setUserInfo] = useState(null);
   const syncAttemptedRef = useRef(false);
   const navigationAttemptedRef = useRef(false);

   useWarmUpBrowser();
   const { startSSOFlow } = useSSO();
   const { isSignedIn } = useAuth();
   const { user } = useUser();

  
   useEffect(() => {
      console.log("Auth status changed - isSignedIn:", isSignedIn);
      console.log("Auth status changed - user:", user?.id);

      // Store user info if available
      if (user) {
         setUserInfo({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
         });
      }
   }, [isSignedIn, user]);

   // Sync user data with Supabase
   const syncUserWithSupabase = async (userData: any) => {
      if (!userData || !userData.id || !userData.email) {
         console.error("Cannot sync: Invalid user data", userData);
         return false;
      }

      try {
         setIsSyncingDb(true);
         console.log("=== SUPABASE SYNC STARTED ===");
         console.log("Syncing user data:", userData);

         // Prepare user data for Supabase
         const supabaseUserData = {
            clerk_id: userData.id,
            email: userData.email || "",
            full_name:
               `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
               "User",
            username: userData.email?.split("@")[0] || `user_${Date.now()}`,
            updates_at: new Date().toISOString(),
         };

         // First check if user exists by clerk_id
         const { data: existingUserById, error: checkIdError } =
            await supabaseClient
               .from("users")
               .select("id")
               .eq("clerk_id", supabaseUserData.clerk_id)
               .maybeSingle();

         if (checkIdError) {
            console.error(
               "Error checking for existing user by ID:",
               checkIdError
            );
            return false;
         }

         // If not found by clerk_id, check by email
         if (!existingUserById) {
            const { data: existingUserByEmail, error: checkEmailError } =
               await supabaseClient
                  .from("users")
                  .select("id, clerk_id")
                  .eq("email", supabaseUserData.email)
                  .maybeSingle();

            if (checkEmailError) {
               console.error(
                  "Error checking for existing user by email:",
                  checkEmailError
               );
               return false;
            }

            // If user exists by email but with different clerk_id, update their clerk_id
            if (existingUserByEmail) {
               console.log("User found by email, updating clerk_id");
               const { data, error } = await supabaseClient
                  .from("users")
                  .update({
                     clerk_id: supabaseUserData.clerk_id,
                     full_name: supabaseUserData.full_name,
                     updates_at: supabaseUserData.updates_at,
                  })
                  .eq("id", existingUserByEmail.id)
                  .select();

               if (error) {
                  console.error("Update error:", error);
                  return false;
               }
               console.log(
                  "Supabase sync successful - updated existing user by email:",
                  data
               );
               return true;
            }

            // If user doesn't exist by either clerk_id or email, insert new user
            const newUserData = {
               ...supabaseUserData,
               created_at: new Date().toISOString(),
            };

            const { data, error } = await supabaseClient
               .from("users")
               .insert(newUserData)
               .select();

            if (error) {
               console.error("Insert error:", error);
               return false;
            }
            console.log("Supabase sync successful - inserted new user:", data);
            return true;
         } else {
            // User exists by clerk_id, update them
            const { data, error } = await supabaseClient
               .from("users")
               .update(supabaseUserData)
               .eq("clerk_id", supabaseUserData.clerk_id)
               .select();

            if (error) {
               console.error("Update error:", error);
               return false;
            }
            console.log(
               "Supabase sync successful - updated existing user by clerk_id:",
               data
            );
            return true;
         }
      } catch (error) {
         console.error("Supabase sync error:", error);
         return false;
      } finally {
         setIsSyncingDb(false);
      }
   };

   // Navigation effect - only triggers once when userInfo becomes available
   useEffect(() => {
      let isMounted = true;

      const handleNavigation = async () => {
         // Prevent multiple navigation/sync attempts
         if (
            !userInfo ||
            syncAttemptedRef.current ||
            navigationAttemptedRef.current ||
            !isMounted
         ) {
            return;
         }

         syncAttemptedRef.current = true;

         try {
            
            const syncSuccess = await syncUserWithSupabase(userInfo);

            if (!isMounted) return;

            navigationAttemptedRef.current = true;

            if (syncSuccess) {
               console.log("Navigation to home after successful sync");
               router.replace("/(tabs)/home");
            } else {
               
               console.warn("Navigating despite sync issues");
               Alert.alert(
                  "Profile Sync Warning",
                  "We had trouble updating your profile. Some features may be limited.",
                  [
                     {
                        text: "Continue Anyway",
                        onPress: () => router.replace("/(tabs)/home"),
                     },
                  ]
               );
            }
         } catch (error) {
            console.error("Navigation handling error:", error);
            if (isMounted) {
               setIsLoading(false);
               syncAttemptedRef.current = false; // Allow retry on error
            }
         }
      };

      if (userInfo && !isSyncingDb) {
         handleNavigation();
      }

      return () => {
         isMounted = false;
      };
   }, [userInfo, isSyncingDb, router]);

   // Extract user info from Google SSO result
   const extractUserInfo = (result) => {
      let extractedInfo = null;

      // Try to get info from signUp object
      if (result.signUp && result.signUp.emailAddress) {
         extractedInfo = {
            id: result.signUp.id.replace("sua_", "user_"), // Create synthetic ID if needed
            email: result.signUp.emailAddress,
            firstName: result.signUp.firstName,
            lastName: result.signUp.lastName,
         };
      }
      // Or try from signIn object if available
      else if (result.signIn && result.signIn.userData) {
         extractedInfo = {
            id: result.signIn.id.replace("sia_", "user_"), // Create synthetic ID if needed
            email: result.signIn.identifier || result.signIn.userData.email,
            firstName: result.signIn.userData.firstName,
            lastName: result.signIn.userData.lastName,
         };
      }

      // Ensure we have email - critical for database operations
      if (!extractedInfo?.email) {
         console.warn("No email found in extracted user info");
         return null;
      }

      return extractedInfo;
   };

   const handleGoogleLogin = React.useCallback(async () => {
      // Prevent multiple attempts
      if (isLoading || isSyncingDb) {
         return;
      }

      try {
         console.log("Starting Google SSO flow...");
         setIsLoading(true);
         setAuthError(null);

         // Reset navigation flags
         syncAttemptedRef.current = false;
         navigationAttemptedRef.current = false;

         // Use a basic redirect URL
         const redirectUrl = Linking.createURL("/(tabs)/home", {
            scheme: "myapp",
         });
         console.log("Redirect URL for Google login:", redirectUrl);

         // Start SSO flow
         const result = await startSSOFlow({
            strategy: "oauth_google",
            redirectUrl: redirectUrl,
         });

         console.log(
            "Google SSO flow result:",
            JSON.stringify(result, null, 2)
         );

         
         if (result.createdSessionId) {
            console.log("Setting session active");
            await result.setActive({ session: result.createdSessionId });
            
         }
         // If not, try to extract user info directly from the result
         else {
            console.warn(
               "No session ID was created, extracting user info directly"
            );
            const extractedUserInfo = extractUserInfo(result);

            if (extractedUserInfo) {
               console.log("Extracted user info:", extractedUserInfo);
               setUserInfo(extractedUserInfo);
            } else {
               // Last resort - use email from the result to generate user info
               if (result.signUp && result.signUp.emailAddress) {
                  const fallbackUserInfo = {
                     id: `user_${Date.now()}`,
                     email: result.signUp.emailAddress,
                     firstName: result.signUp.firstName || "",
                     lastName: result.signUp.lastName || "",
                  };
                  setUserInfo(fallbackUserInfo);
               } else {
                  setIsLoading(false);
                  Alert.alert(
                     "Login Error",
                     "Could not retrieve your information from Google. Please try again."
                  );
               }
            }
         }
      } catch (err) {
         console.error("Google OAuth error:", err);
         setAuthError(err);
         setIsLoading(false);
         Alert.alert(
            "Login Error",
            "Failed to login with Google. Please try again."
         );
      }
   }, [startSSOFlow, isLoading, isSyncingDb]);

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
               <Image
                  source={require("../../assets/images/login.png")}
                  style={styles.image}
                  resizeMode="contain"
               />
            </View>

            <View style={styles.textContainer}>
               <Text style={styles.title}>Sign In to Parkhive Securely</Text>
               <Text style={styles.subtitle}>
                 Enjoy single sign-on convenience by clicking the button.
               </Text>
            </View>

            <View style={styles.buttonsContainer}>
               <TouchableOpacity
                  style={[
                     styles.button,
                     styles.googleButton,
                     (isLoading || isSyncingDb) && styles.disabledButton,
                  ]}
                  onPress={handleGoogleLogin}
                  activeOpacity={0.8}
                  disabled={isLoading || isSyncingDb}
               >
                  <View style={styles.buttonContent}>
                     <AntDesign
                        name="google"
                        size={20}
                        color="white"
                        style={styles.icon}
                     />
                     <Text style={styles.buttonText}>
                        {isLoading || isSyncingDb
                           ? "Signing in..."
                           : "Sign in with Google"}
                     </Text>
                  </View>
               </TouchableOpacity>
            </View>
         </View>
      </SafeAreaView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
   },
   contentContainer: {
      flex: 1,
      padding: 24,
      justifyContent: "space-between",
      alignItems: "center",
   },
   imageContainer: {
      width: "100%",
      height: windowHeight * 0.4,
      marginTop: Platform.OS === "ios" ? 20 : 40,
   },
   image: {
      width: "100%",
      height: "100%",
   },
   textContainer: {
      width: "100%",
      alignItems: "center",
      marginVertical: 32,
   },
   title: {
      fontSize: 24,
      fontWeight: "900",
      color: "#1C418A",
      textAlign: "center",
      marginBottom: 10,
      letterSpacing: 0.5,
      textTransform: "uppercase",
   },
   subtitle: {
      fontSize: 16,
      color: "#666666",
      textAlign: "center",
      lineHeight: 24,
      paddingHorizontal: 20,
   },
   buttonsContainer: {
      width: "100%",
      alignItems: "center",
      marginBottom: 32,
   },
   button: {
      borderRadius: 12,
      width: windowWidth * 0.85,
      paddingVertical: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   googleButton: {
      backgroundColor: "#1C418A",
   },
   disabledButton: {
      opacity: 0.7,
   },
   buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   icon: {
      marginRight: 12,
   },
   buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
   },
});
