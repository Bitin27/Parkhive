// import { Tabs } from "expo-router";
// import { MaterialIcons } from "@expo/vector-icons";

// export default function TabsLayout() {
//    return (
//       <Tabs
//          screenOptions={{
//             tabBarActiveTintColor: "#6B4EFF",
//             tabBarInactiveTintColor: "gray",
//             tabBarStyle: {
//                paddingBottom: 5,
//                paddingTop: 5,
//                backgroundColor: "#6B4EFF",
//                borderTopLeftRadius: 30,
//                borderTopRightRadius: 30,
//                position: "absolute",
//                left: 0,
//                right: 0,
//                bottom: 0,
//                height: 65,
//                elevation: 0,
//                borderTopWidth: 0,
//             },
//             tabBarLabelStyle: {
//                fontSize: 12,
//                fontWeight: "500",
//                paddingBottom: 5,
//             },
//             tabBarItemStyle: {
//                paddingTop: 5,
//             },
//             tabBarInactiveBackgroundColor: "#6B4EFF",
//             tabBarActiveBackgroundColor: "#6B4EFF",
//             headerShown: false,
//          }}
//       >
//          <Tabs.Screen
//             name="home/index"
//             options={{
//                title: "Home",
//                tabBarIcon: ({ color }) => (
//                   <MaterialIcons name="home" size={24} color="#fff" />
//                ),
//             }}
//          />
//          <Tabs.Screen
//             name="explore/index"
//             options={{
//                title: "Explore",
//                tabBarIcon: ({ color }) => (
//                   <MaterialIcons name="explore" size={24} color={color} />
//                ),
//             }}
//          />

//          <Tabs.Screen
//             name="bookings/index"
//             options={{
//                title: "Bookings",
//                tabBarIcon: ({ color }) => (
//                   <MaterialIcons name="book" size={24} color={color} />
//                ),
//             }}
//          />
//          <Tabs.Screen
//             name="profile/index"
//             options={{
//                title: "Profile",
//                tabBarIcon: ({ color }) => (
//                   <MaterialIcons name="person" size={24} color={color} />
//                ),
//             }}
//          />
//       </Tabs>
//    );
// }

import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
   return (
      <Tabs
         screenOptions={{
            // Change active tint color to white for better contrast against purple
            tabBarActiveTintColor: "#FFFFFF",
            // Make inactive tint color a lighter gray for better visibility
            tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
            tabBarStyle: {
               paddingBottom: 5,
               paddingTop: 5,
               backgroundColor: "#6B4EFF",
               borderTopLeftRadius: 30,
               borderTopRightRadius: 30,
               position: "absolute",
               left: 0,
               right: 0,
               bottom: 0,
               height: 65,
               elevation: 0,
               borderTopWidth: 0,
            },
            tabBarLabelStyle: {
               fontSize: 12,
               fontWeight: "500",
               paddingBottom: 5,
            },
            tabBarItemStyle: {
               paddingTop: 5,
            },
            headerShown: false,
         }}
      >
         <Tabs.Screen
            name="home/index"
            options={{
               title: "Home",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons name="home" size={24} color={color} />
               ),
            }}
        />
         <Tabs.Screen
            name="explore/index"
            options={{
               title: "Explore",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons name="explore" size={24} color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="bookings/index"
            options={{
               title: "Bookings",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons name="book" size={24} color={color} />
               ),
            }}
         />
         <Tabs.Screen
            name="profile/index"
            options={{
               title: "Profile",
               tabBarIcon: ({ color }) => (
                  <MaterialIcons name="person" size={24} color={color} />
               ),
            }}
         />
      </Tabs>
   );
}
