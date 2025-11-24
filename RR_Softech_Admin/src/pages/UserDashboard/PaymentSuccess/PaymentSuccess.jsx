import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  motion

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-green-200 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-emerald-300 rounded-full opacity-40 blur-3xl"></div>

        {/* Success Icon Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="w-24 h-24 text-emerald-600" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-gray-800 mb-3"
        >
          Payment Successful!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-6"
        >
          Thank you for your payment. Your transaction is completed successfully.
        </motion.p>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-gray-50 rounded-xl p-5 shadow-inner mb-8"
        >
          <p className="text-gray-700 text-sm">
            Your order is being processed.  
            A confirmation receipt has been sent to your email.
          </p>
        </motion.div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/customer/orders")}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-md hover:bg-emerald-700 transition"
          >
            Back to Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
