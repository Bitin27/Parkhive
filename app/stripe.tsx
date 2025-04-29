




import React, { useState, useEffect } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   ActivityIndicator,
   SafeAreaView,
   Alert,
   ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import { supabaseClient } from "../app/lib/supabase";
import { useMutation } from "@tanstack/react-query";

const StripePayment = () => {
   const [isLoading, setIsLoading] = useState(false);
   const { initPaymentSheet, presentPaymentSheet } = useStripe();
   const router = useRouter();
   const params = useLocalSearchParams();

   // Get all params from router
   const {
      zoneId,
      zoneName,
      sectionId,
      sectionName,
      slotId,
      slotName,
      price,
      date,
      arrivalTime,
      exitTime,
      vehicleType,
      totalAmount,
      userId,
      vehicleId,
      userEmail
   } = params;

   // Use price or totalAmount for payment, with price as priority
   const paymentAmount =  totalAmount || "0";

   // Initialize Stripe on component mount
   useEffect(() => {
      initStripe({
         publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      });
   }, []);

   // Format time for Postgres time with time zone format
   const formatTimeForPostgres = (timeStr) => {
      if (!timeStr) return null;
      // Return just the time string - Postgres will handle timezone
      return timeStr;
   };

   
   // Mutation to save booking data to Supabase and update slot status
   const createBookingMutation = useMutation({
      mutationFn: async (paymentId) => {
         try {
            // Process start_time as just a time string
            const formattedArrivalTime = formatTimeForPostgres(arrivalTime);

            // For estimated_end_time, we should directly use exitTime
            // No need to combine with date since exitTime should already be in proper format
            let estimatedEndTime = null;

            if (exitTime) {
               // Create a proper timestamp for the current day with the exit time
               const now = new Date();
               const today = now.toISOString().split("T")[0]; // YYYY-MM-DD format of today
               const endDateTimeStr = `${today}T${exitTime}`;
               const endDateTime = new Date(endDateTimeStr);

               if (!isNaN(endDateTime.getTime())) {
                  estimatedEndTime = endDateTime.toISOString();
               } else {
                  console.warn(
                     `Could not parse exit time: ${exitTime}, using null instead`
                  );
               }
            }

            // Create booking data object
            const bookingData = {
               zone_id: zoneId,
               // For time with time zone, just pass the time string directly
               start_time: formattedArrivalTime,
               user_id: parseInt(userId, 10),
               vehicle_id: vehicleId,
               slot_id: parseInt(slotId, 10),
               estimated_end_time: estimatedEndTime,
               actual_end_time: null,
               total_amount: parseFloat(paymentAmount),
               additional_charges: 0,
               qr_code_data: {
                  zoneId,
                  slotId,
                  // Store date in qr_code_data JSON as received, without validation
                  date,
                  arrivalTime,
                  exitTime,
               },
               payment_method: "stripe",
               payment_id: paymentId,
            };

            console.log(
               "Inserting booking with data:",
               JSON.stringify(bookingData, null, 2)
            );

            // First, insert the booking
            const { data: bookingResult, error: bookingError } =
               await supabaseClient
                  .from("bookings")
                  .insert(bookingData)
                  .select();

            if (bookingError) {
               console.error("Booking error:", bookingError);
               throw bookingError;
            }

            console.log("Booking created successfully:", bookingResult);

            // Second, update the parking slot status to "occupied"
            const { error: slotUpdateError } = await supabaseClient
               .from("parking_slots")
               .update({
                  status: "occupied",
                  updated_at: new Date().toISOString(),
               })
               .eq("id", slotId);

            if (slotUpdateError) {
               console.error("Slot update error:", slotUpdateError);
               throw new Error(
                  `Slot status update failed: ${slotUpdateError.message}`
               );
            }

            console.log("Parking slot updated to occupied");
            return bookingResult;
         } catch (error) {
            console.error("Error in createBookingMutation:", error);
            throw error;
         }
      },
      onSuccess: () => {
         setIsLoading(false);
         Alert.alert("Success", "Your parking has been booked successfully!");
         const eTicketParams = {
            zoneId,
            zoneName,
            sectionId,
            sectionName,
            slotId,
            slotName,
            price,
            date,
            arrivalTime,
            exitTime,
            vehicleType,
            totalAmount: paymentAmount,
            paymentMethod: "stripe",
            isExitTimeProvided: exitTime ? "true" : "false",
         };
         // Navigate to ETicket with all parameters
         router.push({
            pathname: "/Eticket",
            params: eTicketParams,
         });
      },
      onError: (error) => {
         setIsLoading(false);
         Alert.alert("Error", `Booking failed: ${error.message}`);
      },
   });

   // Initialize payment sheet
   const initializePaymentSheet = async () => {
      try {
         setIsLoading(true);

         // Call supabaseClient Edge Function to create payment intent
         const { data, error } = await supabaseClient.functions.invoke(
            "create-payment-intent",
            {
               body: {
                  amount: Math.round(parseFloat(paymentAmount) * 100), // Convert to cents
                  currency: "usd",
                  description: `Park at ${zoneName}}by ${userEmail}`,
                  email :  userEmail
               },
            }
         );

         if (error) {
            throw new Error(error.message);
         }

         const { clientSecret, ephemeralKey, customer } = data;

         const { error: initError } = await initPaymentSheet({
            merchantDisplayName: "parkhive",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: clientSecret,
            allowsDelayedPaymentMethods: false,
            defaultBillingDetails: {
               name: "Parking User",
            },
         });

         if (initError) {
            throw new Error(initError.message);
         }

         setIsLoading(false);
      } catch (error) {
         setIsLoading(false);
         Alert.alert("Payment setup failed", error.message);
      }
   };

   // Open payment sheet and process payment
   const handlePayment = async () => {
      try {
         setIsLoading(true);

         // Validate input data
         if (!date || !arrivalTime || !exitTime) {
            throw new Error("Missing date or time information");
         }

         // Initialize payment sheet
         await initializePaymentSheet();

         // Present the payment sheet
         const { error: paymentError, paymentOption } =
            await presentPaymentSheet();

         if (paymentError) {
            throw new Error(paymentError.message);
         } else {
            // Check if slot is still available before creating booking
            const { data: slotData, error: slotError } = await supabaseClient
               .from("parking_slots")
               .select("status")
               .eq("id", slotId)
               .single();

            if (slotError) {
               throw new Error(
                  `Could not verify slot availability: ${slotError.message}`
               );
            }

            if (slotData.status === "occupied") {
               throw new Error(
                  "This parking slot is no longer available. Please choose another one."
               );
            }

            console.log("Payment successful - creating booking...");
            // Payment successful - create booking in Supabase and update slot status
            createBookingMutation.mutate(paymentOption?.id || "stripe_payment");
         }
      } catch (error) {
         console.error("Payment error:", error);
         setIsLoading(false);
         Alert.alert("Payment failed", error.message);
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
               <Text style={styles.title}>Confirm Parking Payment</Text>

               <View style={styles.infoCard}>
                  <Text style={styles.cardTitle}>Parking Details</Text>

                  <View style={styles.infoRow}>
                     <Text style={styles.infoLabel}>Zone:</Text>
                     <Text style={styles.infoValue}>{zoneName || "-"}</Text>
                  </View>

                  <View style={styles.infoRow}>
                     <Text style={styles.infoLabel}>Section:</Text>
                     <Text style={styles.infoValue}>{sectionName || "-"}</Text>
                  </View>

                  <View style={styles.infoRow}>
                     <Text style={styles.infoLabel}>Slot:</Text>
                     <Text style={styles.infoValue}>{slotName || "-"}</Text>
                  </View>

                  <View style={styles.infoRow}>
                     <Text style={styles.infoLabel}>Date:</Text>
                     <Text style={styles.infoValue}>{date || "-"}</Text>
                  </View>

                  <View style={styles.infoRow}>
                     <Text style={styles.infoLabel}>Time:</Text>
                     <Text style={styles.infoValue}>
                        {arrivalTime} - {exitTime}
                     </Text>
                  </View>

                  <View style={styles.infoRow}>
                     <Text style={styles.infoLabel}>Vehicle Type:</Text>
                     <Text style={styles.infoValue}>{vehicleType || "-"}</Text>
                  </View>
               </View>

               <View style={styles.amountContainer}>
                  <Text style={styles.amountLabel}>Amount to Pay:</Text>
                  <Text style={styles.amountValue}>
                     ${parseFloat(paymentAmount).toFixed(2)}
                  </Text>
               </View>

               <TouchableOpacity
                  style={styles.payButton}
                  onPress={handlePayment}
                  disabled={isLoading}
               >
                  {isLoading ? (
                     <ActivityIndicator color="#fff" />
                  ) : (
                     <Text style={styles.payButtonText}>Pay with Stripe</Text>
                  )}
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => router.back()}
               >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#f8f8f8",
   },
   scrollContainer: {
      flexGrow: 1,
      padding: 20,
   },
   formContainer: {
      flex: 1,
      justifyContent: "center",
   },
   title: {
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 20,
      textAlign: "center",
      color: "#333",
   },
   infoCard: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      color: "#333",
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      paddingBottom: 8,
   },
   infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
   },
   infoLabel: {
      fontSize: 15,
      color: "#666",
      flex: 1,
   },
   infoValue: {
      fontSize: 15,
      color: "#333",
      fontWeight: "500",
      flex: 2,
      textAlign: "right",
   },
   amountContainer: {
      backgroundColor: "#e6f7ff",
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#00A1DB",
   },
   amountLabel: {
      fontSize: 16,
      color: "#333",
   },
   amountValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#00A1DB",
   },
   payButton: {
      backgroundColor: "#00A1DB",
      borderRadius: 8,
      padding: 15,
      alignItems: "center",
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   payButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
   },
   cancelButton: {
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      padding: 15,
      alignItems: "center",
      marginBottom: 20,
   },
   cancelButtonText: {
      color: "#555",
      fontSize: 16,
   },
});

export default StripePayment;