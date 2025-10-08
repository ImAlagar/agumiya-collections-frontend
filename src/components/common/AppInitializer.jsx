import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { useCart } from "../../contexts/CartContext";

export default function AppInitializer() {
  const { user } = useAuth();
  const { clearCart } = useCart();

  useEffect(() => {
    // If user logs out, clear the cart
    if (!user) {
      clearCart();
    }
  }, [user]);

  return null; // doesn’t render anything
}
