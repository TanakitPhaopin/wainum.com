import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  isSubscribed: false,
  customerId: null,
  checkSubscription: () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const priceId = 'price_1RMevXAlnDo7ux3vKn9XwLxT';

  // Todo: Update Subscribtion status in the database
  const checkSubscriptionStatus = async (email) => {
    try {
      setLoading(true);
      // Fetch Customer ID
      const { data: customerData, error: customerError } = await supabase.functions.invoke(
        "get-stripe-customer-id",
        { body: { email } }
      );

      if (customerError) {
        console.error("Error fetching customer ID:", customerError);
        setIsSubscribed(false);
        setCustomerId(null);
        return;
      }

      const customerId = customerData?.customerId;
      setCustomerId(customerId);

      if (!customerId) {
        setIsSubscribed(false);
        return;
      }

      // Fetch Subscription Data
      const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke(
        "get-user-subscription",
        { body: { customerId, priceId } }
      );

      if (subscriptionError) {
        console.error("Error fetching subscription:", subscriptionError);
        setIsSubscribed(false);
        return;
      }

      setIsSubscribed(!!subscriptionData);
    } catch (error) {
      console.error("Error checking subscription:", error);
      setIsSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        const email = data.session.user.email;
        checkSubscriptionStatus(email);
      } else {
        console.log("No user session found");
        setLoading(false);
      }
    });

    // Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        if (newSession?.user) {
          const email = newSession.user.email;
          checkSubscriptionStatus(email);
        } else {
          console.log("User logged out or session expired");
          setIsSubscribed(false);
          setCustomerId(null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log("Cleaning up auth listener");
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user: session?.user ?? null, 
      session, 
      loading, 
      isSubscribed, 
      customerId, 
      checkSubscription: checkSubscriptionStatus }
    }>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
