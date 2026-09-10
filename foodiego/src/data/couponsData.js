export const coupons = [
  {
    code: "FOODIE50",
    title: "50% OFF up to ₹120",
    description: "Use code FOODIE50 on orders above ₹199",
    discountType: "percentage",
    discountValue: 50,
    maxDiscount: 120,
    minOrder: 199,
    tag: "POPULAR",
    badgeColor: "#ff5200"
  },
  {
    code: "WELCOME100",
    title: "Flat ₹100 OFF",
    description: "Welcome deal for FoodieGo food lovers on orders above ₹249",
    discountType: "flat",
    discountValue: 100,
    maxDiscount: 100,
    minOrder: 249,
    tag: "NEW USER",
    badgeColor: "#10b981"
  },
  {
    code: "FREEDEL",
    title: "FREE Delivery",
    description: "Free delivery on all orders above ₹149",
    discountType: "free_delivery",
    discountValue: 40,
    maxDiscount: 40,
    minOrder: 149,
    tag: "FREE DELIVERY",
    badgeColor: "#3b82f6"
  },
  {
    code: "FEAST20",
    title: "20% OFF up to ₹200",
    description: "Special weekend feast discount on orders above ₹499",
    discountType: "percentage",
    discountValue: 20,
    maxDiscount: 200,
    minOrder: 499,
    tag: "PARTY SAVER",
    badgeColor: "#8b5cf6"
  },
  {
    code: "SUPER300",
    title: "Flat ₹200 OFF on ₹799+",
    description: "Mega family savings on orders above ₹799",
    discountType: "flat",
    discountValue: 200,
    maxDiscount: 200,
    minOrder: 799,
    tag: "MEGA DEAL",
    badgeColor: "#ec4899"
  }
];

export function calculateDiscount(couponCode, cartTotal, deliveryFee = 40) {
  if (!couponCode) return { discount: 0, isValid: false, message: "" };
  
  const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
  if (!coupon) {
    return { discount: 0, isValid: false, message: "Invalid coupon code." };
  }

  if (cartTotal < coupon.minOrder) {
    return { 
      discount: 0, 
      isValid: false, 
      message: `Minimum order of ₹${coupon.minOrder} required for code ${coupon.code}. Add ₹${coupon.minOrder - cartTotal} more!` 
    };
  }

  let discount = 0;
  if (coupon.discountType === "flat") {
    discount = Math.min(coupon.discountValue, cartTotal);
  } else if (coupon.discountType === "percentage") {
    discount = Math.min(Math.round((cartTotal * coupon.discountValue) / 100), coupon.maxDiscount);
  } else if (coupon.discountType === "free_delivery") {
    discount = deliveryFee;
  }

  return {
    discount,
    isValid: true,
    coupon,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${discount}. 🎉`
  };
}
