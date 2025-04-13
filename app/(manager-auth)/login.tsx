

// This is the secure store one
import React, { useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   TextInput,
   TouchableOpacity,
   Alert,
   ScrollView,
   ActivityIndicator,
} from "react-native";
import { signInManager, signUpManager } from "../../app/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const ManagerLoginScreen = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isSignUp, setIsSignUp] = useState(false);
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [phone, setPhone] = useState("");
   const [address, setAddress] = useState("");

   const router = useRouter();

   // Sign in mutation
   const signInMutation = useMutation({
      mutationFn: async () => {
         return await signInManager(email, password);
      },
      onSuccess: () => {
         router.replace("/manager/dashboard");
      },
      onError: (error: any) => {
         console.error("Sign in error:", error);
         Alert.alert(
            "Login Error",
            error.message || "Failed to login. Please try again."
         );
      },
   });

   // Sign up mutation
   const signUpMutation = useMutation({
      mutationFn: async () => {
         return await signUpManager(
            firstName,
            lastName,
            email,
            password,
            phone,
            address
         );
      },
      onSuccess: () => {
         Alert.alert(
            "Success",
            "Manager account created. Please wait for verification before logging in."
         );
         setIsSignUp(false);
         clearForm();
      },
      onError: (error: any) => {
         console.error("Sign up error:", error);
         Alert.alert(
            "Registration Error",
            error.message || "Failed to register. Please try again."
         );
      },
   });

   const loading = signInMutation.isPending || signUpMutation.isPending;

   const clearForm = () => {
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setAddress("");
   };

   const handleSubmit = () => {
      if (!email || !password) {
         return Alert.alert("Error", "Email and password are required");
      }

      if (isSignUp) {
         if (!firstName || !lastName) {
            return Alert.alert(
               "Error",
               "First name and last name are required"
            );
         }
         signUpMutation.mutate();
      } else {
         signInMutation.mutate();
      }
   };

   const switchToUserLogin = () => {
      router.replace("/(auth)");
   };

   return (
      <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.card}>
            <Text style={styles.title}>
               {isSignUp ? "Manager Registration" : "Manager Login"}
            </Text>

            {isSignUp && (
               <>
                  <TextInput
                     style={styles.input}
                     placeholder="First Name"
                     value={firstName}
                     onChangeText={setFirstName}
                     autoCapitalize="words"
                     editable={!loading}
                  />
                  <TextInput
                     style={styles.input}
                     placeholder="Last Name"
                     value={lastName}
                     onChangeText={setLastName}
                     autoCapitalize="words"
                     editable={!loading}
                  />
               </>
            )}

            <TextInput
               style={styles.input}
               placeholder="Email"
               value={email}
               onChangeText={setEmail}
               keyboardType="email-address"
               autoCapitalize="none"
               editable={!loading}
            />

            <TextInput
               style={styles.input}
               placeholder="Password"
               value={password}
               onChangeText={setPassword}
               secureTextEntry
               editable={!loading}
            />

            {isSignUp && (
               <>
                  <TextInput
                     style={styles.input}
                     placeholder="Phone Number"
                     value={phone}
                     onChangeText={setPhone}
                     keyboardType="phone-pad"
                     editable={!loading}
                  />
                  <TextInput
                     style={styles.input}
                     placeholder="Address"
                     value={address}
                     onChangeText={setAddress}
                     multiline
                     editable={!loading}
                  />
               </>
            )}

            <TouchableOpacity
               style={[styles.button, loading && styles.disabledButton]}
               onPress={handleSubmit}
               disabled={loading}
            >
               {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
               ) : (
                  <Text style={styles.buttonText}>
                     {isSignUp ? "Register" : "Login"}
                  </Text>
               )}
            </TouchableOpacity>

            <TouchableOpacity
               style={styles.switchButton}
               onPress={() => {
                  setIsSignUp(!isSignUp);
                  clearForm();
               }}
               disabled={loading}
            >
               <Text
                  style={[styles.switchText, loading && styles.disabledText]}
               >
                  {isSignUp
                     ? "Already have an account? Login"
                     : "Don't have an account? Register"}
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               style={styles.userLoginButton}
               onPress={switchToUserLogin}
               disabled={loading}
            >
               <Text
                  style={[styles.userLoginText, loading && styles.disabledText]}
               >
                  Login as User
               </Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 16,
      backgroundColor: "#f5f5f5",
   },
   card: {
      backgroundColor: "white",
      borderRadius: 8,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 24,
      textAlign: "center",
   },
   input: {
      backgroundColor: "#f9f9f9",
      borderRadius: 4,
      padding: 12,
      marginBottom: 16,
   },
   button: {
      backgroundColor: "#3498db",
      borderRadius: 4,
      padding: 12,
      alignItems: "center",
      marginTop: 8,
      minHeight: 48,
      justifyContent: "center",
   },
   disabledButton: {
      backgroundColor: "#87CEFA",
      opacity: 0.7,
   },
   buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
   },
   switchButton: {
      marginTop: 16,
      alignItems: "center",
      padding: 8,
   },
   switchText: {
      color: "#3498db",
   },
   userLoginButton: {
      marginTop: 24,
      padding: 12,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 4,
      alignItems: "center",
   },
   userLoginText: {
      color: "#666",
   },
   disabledText: {
      opacity: 0.5,
   },
});

export default ManagerLoginScreen;
