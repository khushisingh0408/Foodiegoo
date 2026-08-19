import { createContext, useState } from "react";

export const WishlistContext = createContext();

function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("foodieGoWishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const saveWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "foodieGoWishlist",
      JSON.stringify(updatedWishlist)
    );
  };

  const addToWishlist = (food) => {
    const alreadyExists = wishlist.find(
      (item) => item.id === food.id
    );

    if (!alreadyExists) {
      const updatedWishlist = [...wishlist, food];

      saveWishlist(updatedWishlist);
    }
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item.id !== id
    );

    saveWishlist(updatedWishlist);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;