"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  createStoryPaymentOrder,
  verifyRazorpayPayment,
} from "@/app/actions/payment";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutClientProps {
  story: {
    id: string;
    email?: string | null;
    status: string;
    paymentStatus: string;
    slug?: string | null;
    template: {
      name: string;
      category: string;
      price: number;
    };
  };
  initialEmail?: string;
}

export default function CheckoutClient({
  story,
  initialEmail = "",
}: CheckoutClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState(story.email || initialEmail);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, startSimulate] = useTransition();

  const priceInRupees = Math.round(story.template.price / 100);

  const handlePay = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please provide a valid email address to receive your links");
      return;
    }

    setIsProcessing(true);

    try {
      const orderRes = await createStoryPaymentOrder(story.id, email);
      if (!orderRes.success || !orderRes.orderId) {
        toast.error(orderRes.error || "Failed to create payment order");
        setIsProcessing(false);
        return;
      }

      // If Razorpay SDK is loaded
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency,
          name: "MemoryFlix",
          description: `${story.template.name} — Interactive Story`,
          order_id: orderRes.orderId,
          prefill: {
            email,
          },
          theme: {
            color: "#f43f5e",
          },
          handler: async function (response: any) {
            toast.loading("Verifying and publishing your story...", { id: "payment-verify" });
            try {
              const verifyRes = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                storyId: story.id,
              });

              if (verifyRes.success && verifyRes.story?.slug) {
                toast.success("Story Published Successfully! ✨", { id: "payment-verify" });
                router.push(`/s/${verifyRes.story.slug}`);
              } else {
                toast.error("Payment verification pending. Check your email shortly.", {
                  id: "payment-verify",
                });
                router.push(`/create/${story.id}/preview`);
              }
            } catch (vErr) {
              toast.error("Verification error, but your payment was captured.", {
                id: "payment-verify",
              });
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback simulate
        handleSimulateSuccess(orderRes.orderId);
      }
    } catch (err: any) {
      toast.error(err.message || "Payment process encountered an error");
      setIsProcessing(false);
    }
  };

  const handleSimulateSuccess = (orderId?: string) => {
    startSimulate(async () => {
      try {
        const targetOrderId = orderId || `order_test_${Date.now()}`;
        const verifyRes = await verifyRazorpayPayment({
          razorpay_order_id: targetOrderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: "mock_signature_dev",
          storyId: story.id,
        });

        if (verifyRes.success && verifyRes.story?.slug) {
          toast.success("Test Payment Succeeded! Publishing Story ✨");
          router.push(`/s/${verifyRes.story.slug}`);
        } else {
          toast.error("Test fulfillment failed");
        }
      } catch (err) {
        toast.error("Test payment error");
      }
    });
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 flex flex-col justify-between">
        {/* Header */}
        <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <Link
            href={`/create/${story.id}/preview`}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Preview
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Checkout
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-xl w-full mx-auto px-4 sm:px-8 py-12">
          <div className="rounded-3xl p-6 sm:p-10 bg-zinc-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-500/10 border border-rose-500/30 text-rose-300">
                <Sparkles className="w-3.5 h-3.5" /> Final Step
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Publish & Unlock Story
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Your personalized tribute will be hosted live forever.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">
                  {story.template.name}
                </span>
                <span className="font-bold text-white">₹{priceInRupees}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>7 Full Animated Chapters</span>
                <span className="text-emerald-400">Included</span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>30-Day Private Edit Link</span>
                <span className="text-emerald-400">Included</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-200">Total Due</span>
                <span className="text-xl font-extrabold text-rose-400">
                  ₹{priceInRupees}
                </span>
              </div>
            </div>

            {/* Email Confirmation Field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                Where should we send your Share & Edit links?
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <p className="text-[11px] text-zinc-500">
                We will email your secret editing token and public link immediately after payment.
              </p>
            </div>

            {/* Primary Payment Button */}
            <button
              onClick={handlePay}
              disabled={isProcessing || isSimulating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-500/30 flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Pay with Razorpay (₹{priceInRupees})
                </>
              )}
            </button>

            {/* Test Mode Simulator Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => handleSimulateSuccess()}
                disabled={isProcessing || isSimulating}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline font-mono cursor-pointer"
              >
                {isSimulating ? "Simulating Test Payment..." : "⚡ Quick Test Mode (Simulate Instant Payment)"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Safe & Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 bg-zinc-950/60 py-4 text-center text-xs text-zinc-600">
          MemoryFlix &copy; {new Date().getFullYear()} — Handcrafted with love.
        </footer>
      </div>
    </>
  );
}
