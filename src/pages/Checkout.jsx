import BuyButton from "../components/BuyButton";
import { useAuth } from "../contexts/AuthContext";

export default function Checkout() {
  const { user } = useAuth();
  const email = user?.email || '';
  return (
    <div>
      <h1>Checkout</h1>
      <p>Checkout page content goes here.</p>
      <BuyButton email={email}/>
    </div>
  );
}