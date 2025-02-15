
import React from "react";
import {
   View,
   Text,
   StyleSheet,
   Image,
   TouchableOpacity,
   SafeAreaView,
   StatusBar,
   Dimensions,
} from "react-native";

const windowHeight = Dimensions.get("window").height;

const SignInScreen = () => {
   return (
      <SafeAreaView style={styles.container}>
         <StatusBar barStyle="dark-content" />

         {/* Illustration Section */}
         <View style={styles.illustrationContainer}>
            <Image
               source={require("../../assets/images/splash-icon.png")} // Replace with your actual image path
               style={styles.illustration}
               resizeMode="contain"
            />
         </View>

         {/* Bottom Dark Section */}
         <View style={styles.darkSection}>
            <View style={styles.contentContainer}>
               <Text style={styles.titleContainer}>
                  <Text style={styles.titleMain}>Sign In To </Text>
                  <Text style={styles.titleHighlight}>Parkhive</Text>
                  <Text style={styles.titleMain}> Securely</Text>
               </Text>

               <Text style={styles.subtitle}>
                  Enjoy Single Sign-On Convenience By{"\n"}Clicking The Button
               </Text>

               <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
                  <Text style={styles.loginButtonText}>LOGIN NOW</Text>
               </TouchableOpacity>
            </View>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
   },
   timeText: {
      position: "absolute",
      top: 15,
      left: 25,
      fontSize: 15,
      fontWeight: "600",
   },
   illustrationContainer: {
      height: windowHeight * 0.5,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
   },
   illustration: {
      width: "100%",
      height: "80%",
   },
   darkSection: {
      flex: 1,
      backgroundColor: "#252A2E",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
   },
   contentContainer: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: windowHeight * 0.08,
   },
   titleContainer: {
      fontFamily: "Kodchasan-Bold",

      fontSize: 28,
      textAlign: "center",
      marginBottom: 12,
      lineHeight: 34,
   },
   titleMain: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "600",
   },
   titleHighlight: {
      color: "#9FFF00",
      fontSize: 28,
      fontWeight: "600",
   },
   subtitle: {
      color: "#FFFFFF",
      textAlign: "center",
      fontSize: 16,
      opacity: 0.7,
      marginBottom: 32,
      lineHeight: 24,
   },
   loginButton: {
      backgroundColor: "#9FFF00",
      paddingVertical: 18,
      borderRadius: 12,
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: windowHeight * 0.05,
   },
   loginButtonText: {
      color: "#000000",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.5,
   },
});

export default SignInScreen;
