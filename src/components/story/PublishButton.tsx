"use client";

import { useState } from "react";
import { publishStory } from "@/app/actions/story";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/payment";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PublishButton({ storyId, paymentStatus }: { storyId: string, paymentStatus: string }) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      if (paymentStatus === "UNPAID") {
        // 1. Create Order
        const orderRes = await createRazorpayOrder(storyId);
        if (!orderRes.success) throw new Error(orderRes.error || "Failed to initialize payment.");

        // 2. Open Razorpay Checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_dummy",
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: "MemoryFlix",
          description: "Unlock Story Sharing",
          order_id: orderRes.orderId,
          handler: async function (response: any) {
            try {
              // 3. Verify Payment
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                storyId,
              });

              if (!verifyRes.success) throw new Error(verifyRes.error);
              
              // 4. Publish Story
              await publishStory(storyId);
            } catch (err: any) {
              setError(err.message || "Payment verification failed.");
              setIsPublishing(false);
            }
          },
          prefill: {
            name: "MemoryFlix User",
          },
          theme: {
            color: "#f43f5e"
          },
          modal: {
            ondismiss: function() {
              setIsPublishing(false);
            }
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response: any){
          setError(response.error.description);
          setIsPublishing(false);
        });
        rzp1.open();
      } else {
        // Already paid, just publish
        await publishStory(storyId);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to publish story.");
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePublish}
        disabled={isPublishing}
        className="relative group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-12 py-6 text-xl font-black text-white shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:shadow-[0_0_60px_rgba(244,63,94,0.6)] disabled:opacity-50 transition-all overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10 flex items-center gap-3">
          {isPublishing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              {paymentStatus === "UNPAID" ? (
                <>
                  <Lock className="w-5 h-5 mr-1" /> Pay & Publish (₹99)
                </>
              ) : (
                <>Publish to the World</>
              )}
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </span>
      </motion.button>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm font-bold text-red-400 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
