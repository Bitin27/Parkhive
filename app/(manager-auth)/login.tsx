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
   const [emailError, setEmailError] = useState("");
   const [passwordError, setPasswordError] = useState("");

   const router = useRouter();

   // Email validation function
   const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
         setEmailError("Email is required");
         return false;
      } else if (!emailRegex.test(email)) {
         setEmailError("Please enter a valid email address");
         return false;
      }
      setEmailError("");
      return true;
   };

   // Password validation function
   const validatePassword = (password) => {
      if (!password) {
         setPasswordError("Password is required");
         return false;
      } else if (password.length < 8) {
         setPasswordError("Password must be at least 8 characters long");
         return false;
      } else if (!/[A-Z]/.test(password)) {
         setPasswordError("Password must contain at least one uppercase letter");
         return false;
      } else if (!/[a-z]/.test(password)) {
         setPasswordError("Password must contain at least one lowercase letter");
         return false;
      } else if (!/[0-9]/.test(password)) {
         setPasswordError("Password must contain at least one number");
         return false;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
         setPasswordError("Password must contain at least one special character");
         return false;
      }
      setPasswordError("");
      return true;
   };

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
      setEmailError("");
      setPasswordError("");
   };

   const handleSubmit = () => {
      // Basic required field validation
      if (!email || !password) {
         Alert.alert("Error", "Email and password are required");
         return;
      }

      // For sign-up, validate all fields
      if (isSignUp) {
         if (!firstName || !lastName) {
            Alert.alert("Error", "First name and last name are required");
            return;
         }

         // Validate email and password format for sign-up
         const isEmailValid = validateEmail(email);
         const isPasswordValid = validatePassword(password);

         if (!isEmailValid || !isPasswordValid) {
            return; // Stop submission if validation fails
         }

         signUpMutation.mutate();
      } else {
         // For login, we still validate email format but not password strength
         if (!validateEmail(email)) {
            return;
         }
         signInMutation.mutate();
      }
   };

   const switchToUserLogin = () => {
      router.replace("/(auth)");
   };

   // Handle input changes with validation
   const handleEmailChange = (text) => {
      setEmail(text);
      if (isSignUp) {
         validateEmail(text);
      }
   };

   const handlePasswordChange = (text) => {
      setPassword(text);
      if (isSignUp) {
         validatePassword(text);
      }
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
               style={[styles.input, emailError ? styles.inputError : null]}
               placeholder="Email"
               value={email}
               onChangeText={handleEmailChange}
               keyboardType="email-address"
               autoCapitalize="none"
               editable={!loading}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <TextInput
               style={[styles.input, passwordError ? styles.inputError : null]}
               placeholder="Password"
               value={password}
               onChangeText={handlePasswordChange}
               secureTextEntry
               editable={!loading}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
      marginBottom: 8,
   },
   inputError: {
      borderWidth: 1,
      borderColor: "#ff3b30",
   },
   errorText: {
      color: "#ff3b30",
      fontSize: 12,
      marginBottom: 8,
      marginLeft: 4,
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