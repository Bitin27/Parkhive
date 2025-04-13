
// import 'react-native-url-polyfill/auto'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { createClient } from '@supabase/supabase-js'

// export const supabaseClient = createClient(
//   process.env.EXPO_PUBLIC_SUPABASE_URL || "",
//   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
//   {
//     auth: {
//       storage: AsyncStorage,
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: false,
//     },
//   })
    
// import "@react-native-async-storage/async-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// export const supabaseClient = createClient(
//    supabaseUrl as any,
//    supabaseAnonKey as any,
//    {
//       auth: {
//          storage: AsyncStorage,
//          autoRefreshToken: true,
//          persistSession: true,
//          detectSessionInUrl: false,
//       },
//    }
// );


import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseClient = createClient(
   supabaseUrl as string,
   supabaseAnonKey as string,
   {
      auth: {
         storage: {
            getItem: (key: string) => SecureStore.getItemAsync(key),
            setItem: (key: string, value: string) =>
               SecureStore.setItemAsync(key, value),
            removeItem: (key: string) => SecureStore.deleteItemAsync(key),
         },
         autoRefreshToken: true,
         persistSession: true,
         detectSessionInUrl: false,
      },
   }
);

export const storeManagerData = async (data: any) => {
   try {
      // Only store essential fields to reduce size
      const essentialData = {
         managerid: data.managerid || data.ManagerID,
         firstname: data.firstname || data.FirstName,
         lastname: data.lastname || data.LastName,
         email: data.email || data.Email,
         verificationstatus: data.verificationstatus || data.VerificationStatus,
         roleid: data.roleid || data.RoleID,
      };
      await SecureStore.setItemAsync(
         "managerData",
         JSON.stringify(essentialData)
      );
      return true;
   } catch (error) {
      console.error("Error storing manager data:", error);
      return false;
   }
};

export const getStoredManagerData = async () => {
   try {
      const data = await SecureStore.getItemAsync("managerData");
      return data ? JSON.parse(data) : null;
   } catch (error) {
      console.error("Error getting manager data:", error);
      return null;
   }
};

export const clearManagerData = async () => {
   try {
      await SecureStore.deleteItemAsync("managerData");
      return true;
   } catch (error) {
      console.error("Error clearing manager data:", error);
      return false;
   }
};

// Manager authentication functions
export const signInManager = async (email: string, password: string) => {
   try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
         email,
         password,
      });

      if (error) throw error;

      const { data: managerData, error: managerError } = await supabaseClient
         .from("parkingmanagers")
         .select("*")
         .eq("email", email)
         .single();

      if (managerError) {
         console.error("Manager lookup error:", managerError);
         await supabaseClient.auth.signOut();
         throw new Error("Not authorized as a parking manager");
      }

      await storeManagerData(managerData);
      return { auth: data, manager: managerData };
   } catch (error) {
      console.error("Sign in manager error:", error);
      throw error;
   }
};

export const signUpManager = async (
   firstName: string,
   lastName: string,
   email: string,
   password: string,
   phone: string,
   address: string
) => {
   try {
      const { data, error } = await supabaseClient.auth.signUp({
         email,
         password,
         options: {
            data: {
               first_name: firstName,
               last_name: lastName,
               is_manager: true,
            },
         },
      });

      if (error) throw error;

      if (data.user) {
         const { data: maxIdData, error: maxIdError } = await supabaseClient
            .from("parkingmanagers")
            .select("managerid")
            .order("managerid", { ascending: false })
            .limit(1);

         if (maxIdError) {
            console.error("Error getting max manager ID:", maxIdError);
            throw new Error(
               `Failed to generate manager ID: ${maxIdError.message}`
            );
         }

         const nextManagerId =
            maxIdData && maxIdData.length > 0 ? maxIdData[0].managerid + 1 : 1;

         const { data: newManager, error: managerError } = await supabaseClient
            .from("parkingmanagers")
            .insert({
               managerid: nextManagerId,
               firstname: firstName,
               lastname: lastName,
               email: email,
               passwordhash: "SUPABASE_AUTH_MANAGED",
               phone: phone || null,
               address: address || null,
               verificationstatus: "Pending",
               roleid: 2,
            })
            .select()
            .single();

         if (managerError) {
            console.error("Manager creation error:", managerError);
            await supabaseClient.auth.signOut();
            throw new Error(
               `Failed to create manager account: ${managerError.message}`
            );
         }

         if (newManager) {
            await storeManagerData(newManager);
         }

         return data;
      }
   } catch (error) {
      console.error("Sign up manager error:", error);
      throw error;
   }
};

// Check if current user is a manager
export const checkIfManager = async () => {
   try {
      const {
         data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) return null;

      // First check if we have stored manager data
      const storedData = await getStoredManagerData();
      if (storedData && storedData.email === user.email) {
         return storedData;
      }

      // If not, query the database
      const { data, error } = await supabaseClient
         .from("parkingmanagers")
         .select("*")
         .eq("email", user.email)
         .single();

      if (error) {
         console.error("Check manager error:", error);
         return null;
      }

      if (data) {
         await storeManagerData(data);
         return data;
      }

      return null;
   } catch (error) {
      console.error("Exception checking if manager:", error);
      return null;
   }
};

// User authentication functions
export const signInUser = async (email: string, password: string) => {
   try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
         email,
         password,
      });

      if (error) throw error;
      return data;
   } catch (error) {
      console.error("Sign in user error:", error);
      throw error;
   }
};

export const signUpUser = async (
   email: string,
   password: string,
   fullName: string
) => {
   try {
      const { data, error } = await supabaseClient.auth.signUp({
         email,
         password,
         options: {
            data: {
               full_name: fullName,
            },
         },
      });

      if (error) throw error;

      if (data.user) {
         const { error: insertError } = await supabaseClient
            .from("users")
            .insert({
               clerk_id: data.user.id,
               email: data.user.email,
               full_name: fullName,
               role_id: 1,
            });

         if (insertError) throw insertError;
      }

      return data;
   } catch (error) {
      console.error("Sign up user error:", error);
      throw error;
   }
};

export const signOut = async () => {
   try {
      const { error } = await supabaseClient.auth.signOut();
      await clearManagerData();
      if (error) throw error;
   } catch (error) {
      console.error("Sign out error:", error);
      throw error;
   }
};

export const getCurrentUser = async () => {
   try {
      const { data, error } = await supabaseClient.auth.getUser();
      if (error) throw error;
      return data?.user;
   } catch (error) {
      console.error("Get current user error:", error);
      return null;
   }
};
