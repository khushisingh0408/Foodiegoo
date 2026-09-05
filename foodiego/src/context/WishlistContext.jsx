import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("foodieGoWishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const token = localStorage.getItem("foodieGoToken");

  const saveWishlistToStorage = (updatedWishlist) => {
    setWishlist(updatedWishlist);
    localStorage.setItem("foodieGoWishlist", JSON.stringify(updatedWishlist));
  };

  const fetchBackendWishlist = useCallback(async () => {
    const currentToken = localStorage.getItem("foodieGoToken");
    if (!currentToken) return;

    const res = await api.get("/wishlist");
    if (res.success && Array.isArray(res.wishlist)) {
      setWishlist(res.wishlist);
      localStorage.setItem("foodieGoWishlist", JSON.stringify(res.wishlist));
    }
  }, []);

  useEffect(() => {
    const currentToken = localStorage.getItem("foodieGoToken");
    if (currentToken) {
      const localWishlist = JSON.parse(localStorage.getItem("foodieGoWishlist") || "[]");
      if (localWishlist.length > 0) {
        api.post("/wishlist/sync", { localWishlist }).then((res) => {
          if (res.success && res.wishlist) {
            setWishlist(res.wishlist);
            localStorage.setItem("foodieGoWishlist", JSON.stringify(res.wishlist));
          }
        });
      } else {
        fetchBackendWishlist();
      }
    }
  }, [token, fetchBackendWishlist]);

  const addToWishlist = async (food) => {
    const alreadyExists = wishlist.find((item) => item.id === food.id);

    if (!alreadyExists) {
      const updatedWishlist = [...wishlist, food];
      saveWishlistToStorage(updatedWishlist);

      if (localStorage.getItem("foodieGoToken")) {
        const res = await api.post("/wishlist", {
          foodId: food.id,
          name: food.name,
          price: food.price,
          rating: food.rating,
          image: food.image,
          category: food.category,
        });

        if (res.success && res.wishlist) {
          setWishlist(res.wishlist);
          localStorage.setItem("foodieGoWishlist", JSON.stringify(res.wishlist));
        }
      }
    }
  };

  const removeFromWishlist = async (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);
    saveWishlistToStorage(updatedWishlist);

    if (localStorage.getItem("foodieGoToken")) {
      const res = await api.delete(`/wishlist/${id}`);
      if (res.success && res.wishlist) {
        setWishlist(res.wishlist);
        localStorage.setItem("foodieGoWishlist", JSON.stringify(res.wishlist));
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        fetchBackendWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;