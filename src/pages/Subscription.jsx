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
    const { user, customerId, isSubscribed } = useAuth();

    const email = user?.email || '';
    const stripeLoginLink = "https://billing.stripe.com/p/login/test_fZu5kCa5ZfM9dbjeTQ1VK00";
    const encodedEmail = encodeURIComponent(email);
    const loginUrl = `${stripeLoginLink}?prefilled_email=${encodedEmail}`;

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Subscription Page</h1>
            <p className="text-lg">This is the subscription page.</p>
            {customerId ? (
                <div>
                    <p className="text-black">Customer ID: {customerId}</p>
                    {isSubscribed ? (
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