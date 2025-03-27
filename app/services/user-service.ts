// import pb from '../lib/pocketbase'
// export const createOrUpdateUser = async (userData : any) => {
//     try {
//       // First check if the user already exists by email
//       const existingUsers = await pb.collection('users').getList(1, 1, {
//         filter: `email="${userData.email}"`,
//       });
      
//       if (existingUsers.items.length > 0) {
//         // User exists, update the record
//         const userId = existingUsers.items[0].id;
//         return await pb.collection('users').update(userId, userData);
//       } else {
//         // Create new user
//         return await pb.collection('users').create(userData);
//       }
//     } catch (error) {
//       console.error('Error creating/updating user in PocketBase:', error);
//       throw error;
//     }
//   };

import pb from '../lib/pocketbase';

export const createOrUpdateUser = async (userData: any) => {
  try {
    console.log("Starting PocketBase user creation/update process");
    
    // Make sure pb is initialized
    if (!pb || !pb.collection) {
      console.error("PocketBase client is not properly initialized");
      throw new Error("PocketBase client is not properly initialized");
    }
    
    // Validate userData
    if (!userData.email) {
      console.error("Email is required for user creation/update");
      throw new Error("Email is required for user creation/update");
    }
    
    try {
      // First check if the user already exists by email
      console.log(`Checking if user with email ${userData.email} exists`);
      const existingUsers = await pb.collection('users').getList(1, 1, {
        filter: `email="${userData.email}"`,
      });
      
      // Prepare the data - ensuring all required fields are present
      const dataToSave = {
        name: userData.name || '',
        email: userData.email,
        phone: userData.phone || '',
        status: userData.status || 'active',
        // Add any other required fields with fallbacks
      };
      
      if (existingUsers.items.length > 0) {
        // User exists, update the record
        const userId = existingUsers.items[0].id;
        console.log(`User exists with ID: ${userId}, updating...`);
        return await pb.collection('users').update(userId, dataToSave);
      } else {
        // Create new user
        console.log("User doesn't exist, creating new record...");
        return await pb.collection('users').create(dataToSave);
      }
    } catch (error) {
      console.error("PocketBase operation failed:", error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating/updating user in PocketBase:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
};