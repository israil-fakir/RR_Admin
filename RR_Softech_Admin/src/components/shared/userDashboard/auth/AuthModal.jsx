import React, { useState } from "react";
import { motion } from "framer-motion";
import RegisterFrom from "./RegisterFrom";
import LoginFrom from "./LoginFrom";
import ForgetPasswordFrom from "./ForgetPasswordFrom";

export default function AuthModal() {
  const [mode, setMode] = useState("login");
  motion;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-md w-full bg-white rounded-2xl shadow-xl p-6"
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
      >
        {/* Logo and close */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold pl-8 lg:pl-0">
                RR <span className="text-orange-400">Softech</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("register")}
              className={`text-sm px-2 py-1 cursor-pointer rounded ${
                mode === "register" ? "bg-blue-50" : "text-gray-500"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => setMode("login")}
              className={`text-sm cursor-pointer px-2 py-1 rounded ${
                mode === "login" ? "bg-blue-50" : "text-gray-500"
              }`}
            >
              Login
            </button>
          </div>
        </div>

        <div>
          {mode === "register" && <RegisterFrom setMode={setMode} />}

          {mode === "login" && <LoginFrom setMode={setMode}   />}

          {mode === "forgetPassword" && (
            <ForgetPasswordFrom setMode={setMode} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
