// src/contexts/CouponContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { couponService } from "../services/api/couponService";

const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  // 🎟️ User-side coupon states
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🧮 Calculate discount helper
  const calculateDiscountAmount = (coupon, subtotal) => {
    if (!coupon) return 0;
    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "FIXED" || coupon.discountType === "FIXED_AMOUNT") {
      discount = coupon.discountValue;
    }

    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    return Math.min(discount, subtotal);
  };

  // 🧠 Apply coupon (validate via backend)
  const applyCoupon = useCallback(async ({ code, subtotal, cartItems, userId }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await couponService.validateCoupon({ code, subtotal, cartItems, userId });
      if (res.success && res.data?.isValid) {
        const coupon = res.data.coupon;
        const calculatedDiscount = calculateDiscountAmount(coupon, subtotal);

        setAppliedCoupon({
          ...coupon,
          discountAmount: calculatedDiscount,
        });
        setDiscountAmount(calculatedDiscount);

        toast.success(`Coupon ${code} applied successfully! 🎉`);
        return { success: true, coupon };
      } else {
        const errorMessage = res.data?.error || "Invalid or expired coupon";
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      console.error("❌ Error applying coupon:", err);
      const errorMessage = "Something went wrong while applying the coupon";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ❌ Remove coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setError(null);
    toast.info("Coupon removed");
  }, []);

  // ✅ Get available coupons for user
  const getAvailableCoupons = useCallback(async ({ subtotal, cartItems, userId }) => {
    try {
      const res = await couponService.getAvailableCoupons({ subtotal, cartItems, userId });
      const available = Array.isArray(res?.data?.available) ? res.data.available : [];
      return available;
    } catch (error) {
      console.error("Failed to fetch available coupons:", error);
      return [];
    }
  }, []);

  // ✅ Mark coupon as used (after payment success)
  const markCouponAsUsed = useCallback(async ({ couponId, userId, orderId, discountAmount, couponCode }) => {
    try {
      await couponService.markCouponAsUsed({
        couponId,
        userId,
        orderId,
        discountAmount,
        couponCode,
      });
      console.log("✅ Coupon usage recorded successfully");
    } catch (error) {
      console.error("❌ Failed to record coupon usage:", error);
    }
  }, []);

  // 🧹 Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 🧩 --- ADMIN SECTION ---
  const [adminCoupons, setAdminCoupons] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);

// 👑 Fetch all coupons (for admin)
const fetchAllCoupons = useCallback(async () => {
  setAdminLoading(true);
  setAdminError(null);
  try {
    const res = await couponService.getAllCoupons();
    console.log('API Response:', res); // Debug log
    
    // Handle the nested response structure
    if (res.success && res.data?.coupons) {
      // Backend returns coupons inside data.coupons array
      setAdminCoupons(res.data.coupons);
    } else if (res.success && Array.isArray(res.data)) {
      // Fallback: if data is directly an array
      setAdminCoupons(res.data);
    } else {
      setAdminCoupons([]);
      setAdminError("Failed to fetch coupons - invalid response format");
    }
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    setAdminCoupons([]);
    setAdminError("Failed to fetch coupons");
  } finally {
    setAdminLoading(false);
  }
}, []);

  // 👑 Create new coupon (admin)
  const createCoupon = useCallback(async (couponData) => {
    setAdminError(null);
    try {
      const res = await couponService.createCoupon(couponData);
      if (res.data?.success) {
        toast.success("Coupon created successfully!");
        await fetchAllCoupons();
        return { success: true, data: res.data.data };
      } else {
        const errorMessage = res.data?.message || "Failed to create coupon";
        setAdminError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Error creating coupon";
      setAdminError(errorMessage);
      toast.error(errorMessage);
      console.error("Error:", error);
      return { success: false, error: errorMessage };
    }
  }, [fetchAllCoupons]);

  // 👑 Delete coupon (admin)
  const deleteCoupon = useCallback(async (couponId) => {
    setAdminError(null);
    try {
      const res = await couponService.deleteCoupon(couponId);
      if (res.data?.success) {
        toast.success("Coupon deleted");
        await fetchAllCoupons();
        return { success: true };
      } else {
        const errorMessage = "Failed to delete coupon";
        setAdminError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Error deleting coupon";
      setAdminError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [fetchAllCoupons]);

  // 👑 Clear admin error
  const clearAdminError = useCallback(() => {
    setAdminError(null);
  }, []);

  // 🔁 Expose everything
  return (
    <CouponContext.Provider
      value={{
        // User-side
        appliedCoupon,
        discountAmount,
        loading,
        error,
        applyCoupon,
        removeCoupon,
        getAvailableCoupons, // This was missing in the return value
        markCouponAsUsed,
        clearError,

        // Admin-side
        adminCoupons,
        adminLoading,
        adminError,
        fetchAllCoupons,
        createCoupon,
        deleteCoupon,
        clearAdminError,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => useContext(CouponContext);