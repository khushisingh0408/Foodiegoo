import api from "./api";

/**
 * Dynamically loads the official Razorpay Checkout JavaScript SDK
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout SDK script.");
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Checkout flow
 * @param {Object} params
 * @param {number} params.amount - Total amount in INR
 * @param {Object} params.customerInfo - { name, email, phone }
 * @param {Function} params.onSuccess - Callback on payment success
 * @param {Function} params.onError - Callback on payment failure
 * @param {Function} params.onDismiss - Callback when modal is closed without paying
 */
export async function initiateRazorpayPayment({
  amount,
  customerInfo,
  onSuccess,
  onError,
  onDismiss
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onError) onError("Failed to load Razorpay payment gateway. Please check your internet connection.");
    return;
  }

  try {
    // 1. Create order on backend
    const createOrderRes = await api.post("/payment/create-order", {
      amount,
      receipt: `rcpt_${Date.now()}`
    });

    if (!createOrderRes.success || !createOrderRes.order) {
      throw new Error(createOrderRes.message || "Failed to initiate payment order on server.");
    }

    const { order, keyId } = createOrderRes;

    // 2. Configure Razorpay options
    const options = {
      key: keyId || "rzp_test_1DP5mmOlF5G5ag",
      amount: order.amount,
      currency: order.currency || "INR",
      name: "FoodieGo Delivery",
      description: "Fast & Fresh Gourmet Food Order",
      image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
      order_id: order.id.startsWith("order_") && !createOrderRes.isSandboxFallback ? order.id : undefined,
      prefill: {
        name: customerInfo?.name || "Foodie Customer",
        email: customerInfo?.email || "customer@foodiego.com",
        contact: customerInfo?.phone || "9876543210"
      },
      notes: {
        order_type: "food_delivery",
        platform: "FoodieGo Web"
      },
      theme: {
        color: "#ff5200",
        backdrop_color: "rgba(15, 23, 42, 0.7)"
      },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          if (onDismiss) onDismiss();
        }
      },
      handler: async function (response) {
        try {
          // 3. Verify payment signature on backend
          const verifyRes = await api.post("/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id || order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.success) {
            onSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id || order.id,
              signature: response.razorpay_signature,
              verified: true,
              method: "Razorpay (UPI / Card / Netbanking)"
            });
          } else {
            throw new Error(verifyRes.message || "Payment verification failed.");
          }
        } catch (err) {
          if (onError) onError(err.message || "Payment verification error.");
        }
      }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Razorpay Payment Failed:", response.error);
      if (onError) {
        onError(
          response.error?.description || "Payment failed. Please try another payment method."
        );
      }
    });

    razorpay.open();
  } catch (err) {
    console.error("Payment initialization error:", err);
    if (onError) onError(err.message || "Could not connect to payment gateway.");
  }
}
