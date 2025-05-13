// Check their subscription status
// no subscription, show the subscription button to subscribe
// if subscription is active, show the subscription details + cancel button + upgrade button
// if subscription is canceled, and is existing customer, show resubscribe button

import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Button } from "@mui/material";
import BuyButton from "../components/BuyButton";

export function Subscription() {
    const { user } = useAuth();
    const email = user?.email || '';
    const [loading, setLoading] = useState(true);
    const [isCustomer, setIsCustomer] = useState(false);
    const [customerId, setCustomerId] = useState(null);
    const [ isSubscriptionActive, setIsSubscriptionActive] = useState(false);
    const priceId = 'price_1RMevXAlnDo7ux3vKn9XwLxT';
    const stripeLoginLink = "https://billing.stripe.com/p/login/test_fZu5kCa5ZfM9dbjeTQ1VK00";
    const encodedEmail = encodeURIComponent(email);
    const loginUrl = `${stripeLoginLink}?prefilled_email=${encodedEmail}`;

    const fetchCustomerAndSubscription = async () => {
    try {
        setLoading(true);
        const { data: customerData, error: customerError } = await supabase.functions.invoke('get-stripe-customer-id', {
            body: { email },
        });

        if (customerError) {
            console.error('Error fetching customer ID:', customerError);
            setIsCustomer(false);
            setCustomerId(null);
            setLoading(false);
            return;
        }

        const customerId = customerData?.customerId;

        if (!customerId) {
            console.warn('No customer ID found for the email');
            setIsCustomer(false);
            setCustomerId(null);
            setLoading(false);
            return;
        }

        console.log('Customer ID:', customerId);
        setCustomerId(customerId);
        setIsCustomer(true);

        // Fetch Subscription Data
        const { data: subscriptionData, error: subscriptionError } = await supabase.functions.invoke('get-user-subscription', {
            body: { customerId: customerId, priceId: priceId },
        });

        if (subscriptionError) {
            console.error('Error fetching subscription:', subscriptionError);
            setIsSubscriptionActive(false);
            setLoading(false);
            return;
        }

        if (subscriptionData) {
            setIsSubscriptionActive(true);
            console.log('Subscription Data:', subscriptionData);
            setLoading(false);
            return;
            // Handle subscription data as needed
        }

    } catch (error) {
        console.error('Error in fetchCustomerAndSubscription:', error);
        setIsCustomer(false);
        setCustomerId(null);
        setIsSubscriptionActive(false);
        setLoading(false);
    }
    };

    useEffect(() => {
        fetchCustomerAndSubscription();
    }
    , [email]);

    if (loading) {
        return <div>Loading</div>
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Subscription Page</h1>
            <p className="text-lg">This is the subscription page.</p>
            {isCustomer ? (
                <div>
                    <p className="text-black">Customer ID: {customerId}</p>
                    {isSubscriptionActive ? (
                        <div>
                            <p className="text-black">Subscription is active</p>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => window.location.href = loginUrl}
                                className="mt-4"
                            >
                                จัดการการสมัครใช้งาน
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-black">No active subscription</p>
                            {/* Add Resubscribe button here */}
                            <BuyButton email={email} />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <p className="text-black">I am not the customer</p>
                    <BuyButton email={email} />
                </div>
            )}
        </div>
    );

}