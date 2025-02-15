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
          backgroundColor: "#9FE870",
          image: (
             <Image
                source={OnboardOneImage}
                style={styles.image}
             />
          ),
          title: "Welcome to Ultimate Gaming Experience",
          subtitle: "The ultimate platform where your gaming skills can earn you real rewards",
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
       },
       {
          backgroundColor: "#9FE870",
          image: (
             <Image
                source={OnboardTwoImage}
                style={styles.image}
             />
          ),
          title: "Engage, Compete, and Connect",
          subtitle: "Connect with fellow gamers, share strategies, and participate in exciting tournaments",
          titleStyles: styles.title,
          subTitleStyles: styles.subtitle,
       },
       {
          backgroundColor: "#9FE870",
          image: (
             <Image
                source={OnboardThreeImage}
                style={styles.imageLast}
             />
          ),
          title: "Let's Earn to Play And Start Earning",
          subtitle: "Dive into thrilling matches and earn real rewards as you play",
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
