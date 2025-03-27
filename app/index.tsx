import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useRouter } from "expo-router";
import Onboarding from "react-native-onboarding-swiper";
import * as SecureStore from "expo-secure-store";
const OnboardOneImage = require('../assets/images/onboardone.png') as any;
const OnboardTwoImage = require('../assets/images/onboardtwo.png') as any;
const OnboardThreeImage = require('../assets/images/onboardthree.png') as any;

const index = () => {
   const router = useRouter();

   const handleDone = async () => {
      // Replace with your main app route
      await SecureStore.setItemAsync("onboarding_completed", "true");
      router.replace("/(auth)");
   };

   return (
    <Onboarding
    onDone={handleDone}
    onSkip={handleDone}
    pages={[
       {
          backgroundColor: "#6B4EFF",
          image: (
             <Image
                source={OnboardOneImage}
                style={styles.image}
             />
          ),
          title: "Find Your Perfect Spot",
          subtitle: "Find, reserve, pay, and manage your parking – all within Parkhive.",
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
       },
       {
          backgroundColor: "#6B4EFF",
          image: (
             <Image
                source={OnboardTwoImage}
                style={styles.image}
             />
          ),
          title: "Reserve Your Parking ",
          subtitle: "Guarantee your parking spot in advance. Parkhive allows you to book parking with just a few taps.",
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
       },
       {
          backgroundColor: "#6B4EFF",
          image: (
             <Image
                source={OnboardThreeImage}
                style={styles.imageLast}
             />
          ),
          title: "Find & Reserve Parking",
          subtitle: " Guarantee your parking spot in advance. Parkhive allows you to book parking with just a few taps.",
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
       },
    ]}
 />
   );
};

const styles = StyleSheet.create({
   image: {
      width: 400,
      height: 400,
      resizeMode: "contain",
   },
   imageLast: {
      width: 300,
      height: 400,
      resizeMode: "contain",
   },
   title: {
      fontSize: 24,
      fontWeight: 900,

      textAlign: "center",
      marginTop: -60,
      marginBottom: -10,
   },
   subtitle: {
      fontSize: 16,
      fontWeight: 300,
      textAlign: "center",
      paddingHorizontal: 10,
   },
});

export default index;
