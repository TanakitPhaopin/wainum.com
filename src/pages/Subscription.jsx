import { useAuth } from "../contexts/AuthContext";
import { Button } from "@mui/material";
import BuyButton from "../components/BuyButton";

export function Subscription() {
    const { user, isSubscribed } = useAuth();

    const email = user?.email || '';
    const stripeLoginLink = "https://billing.stripe.com/p/login/test_fZu5kCa5ZfM9dbjeTQ1VK00";
    const encodedEmail = encodeURIComponent(email);
    const loginUrl = `${stripeLoginLink}?prefilled_email=${encodedEmail}`;

    return (
        <div className="flex flex-col items-center justify-center h-max mt-4">
            {isSubscribed ? (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.href = loginUrl}
                    >
                        จัดการซับสคริปชั่น
                    </Button>
                </div>
                ) : (
                    <div>
                        <BuyButton email={email} />
                    </div>
                )}
        </div>
    );

}