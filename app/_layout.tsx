// import * as SecureStore from "expo-secure-store";

// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';
// import { ClerkProvider } from "@clerk/clerk-expo";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient({
//    defaultOptions: {
//       queries: {
//          staleTime: 60 * 1000, // 1 minute
//          retry: 1,
//       },
//    },
// });

// import { useColorScheme } from '@/hooks/useColorScheme';
// const tokenCache = {
//   async getToken(key: string) {
//      try {
//         const item = await SecureStore.getItemAsync(key);
//         if (item) {
//            console.log(`${key} was used 🔐 \n`);
//         } else {
//            console.log("No values stored under key: " + key);
//         }
//         return item;
//      } catch (error) {
//         console.error("SecureStore get item error: ", error);
//         await SecureStore.deleteItemAsync(key);
//         return null;
//      }
//   },
//   async saveToken(key: string, value: string) {
//      try {
//         return SecureStore.setItemAsync(key, value);
//      } catch (err) {
//         return;
//      }
//   },
// };
// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;


// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//   <QueryClientProvider client={queryClient}>
//      <ClerkProvider   publishableKey={publishableKey as string}
//     tokenCache={tokenCache}>
//       <Stack>
        
//       <Stack.Screen
//                name="index"
//                options={{
//                   headerShown: false,
//                   headerBackButtonDisplayMode: "default",
//                }}
//             />
//              <Stack.Screen
//                name="(auth)/index"
//                options={{ headerShown: false }}
//             />
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             <Stack.Screen name="parkingDetail" />
//             <Stack.Screen name="vehicleSelection" />
//             <Stack.Screen name="ParkingBooking" />
//             <Stack.Screen name="ParkingSlot" />
//             <Stack.Screen name="ETicket" />

//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ClerkProvider>
//   </QueryClientProvider>
//   );
// }

import * as SecureStore from "expo-secure-store";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         staleTime: 60 * 1000, // 1 minute
         retry: 1,
      },
   },
});

const tokenCache = {
  async getToken(key: string) {
     try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
           console.log(`${key} was used 🔐`);
        } else {
           console.log("No values stored under key: " + key);
        }
        return item;
     } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
     }
  },
  async saveToken(key: string, value: string) {
     try {
        return SecureStore.setItemAsync(key, value);
     } catch (err) {
        return;
     }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

// Auth routing component
function AuthRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Check if the path is in the auth group
  const isAuthGroup = segments[0] === "(auth)";
  const isTabsGroup = segments[0] === "(tabs)";

  useEffect(() => {
    // Wait for clerk to load
    if (!isLoaded) return;

    if (isSignedIn) {
      // If user is signed in but on an auth screen, redirect to home
      if (isAuthGroup) {
        router.replace("/(tabs)/home");
      }
    } else {
      // If user is not signed in and not on an auth screen, redirect to login
      if (!isAuthGroup && segments[0]) {
        router.replace("/(auth)");
      }
    }
  }, [isSignedIn, isLoaded, segments]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={publishableKey as string} tokenCache={tokenCache}>
        <AuthRedirect />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              headerBackButtonDisplayMode: "default",
            }}
          />
          <Stack.Screen
            name="(auth)/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="parkingDetail" />
          <Stack.Screen name="vehicleSelection" />
          <Stack.Screen name="ParkingBooking" />
          <Stack.Screen name="ParkingSlot" />
          <Stack.Screen name="Eticket" />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="manager/dashboard" options={{ title : "Parking Manager Dashboard"}} />
          <Stack.Screen name="stripe" />
        </Stack>
        <StatusBar style="auto" />
      </ClerkProvider>
    </QueryClientProvider>
  );
}