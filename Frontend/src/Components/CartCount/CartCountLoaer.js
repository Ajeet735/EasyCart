import { useEffect, useContext } from "react";
import API from "../../api";
import { Context } from "../../main";

const CartCountLoader = () => {
  const { setCartCount, user, isAuthorized } = useContext(Context);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isAuthorized || !user?.user_id) {
        return;
      }

      try {
        const res = await API.get("/users/cart-count", {
          withCredentials: true,
        });
        setCartCount(res.data.count || 0);
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn("Unauthorized - token may have expired or not yet attached");
        } else {
          console.error("Failed to fetch cart count", err);
        }
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [isAuthorized, user?.user_id, setCartCount]);

  return null;
};

export default CartCountLoader;
