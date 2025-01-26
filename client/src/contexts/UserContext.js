import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Global variable for the user

  // Function to log in the user
  const loginUser = (userData) => {
    setUser({
      ...userData,
      userType: userData.userType || "Student", // Default to "Student" if not provided
      publicKey: userData.publicKey || "", // Ensure publicKey is included
    });
  };

  // Function to log out the user
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
