"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setStep("otp");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every((digit) => digit)) {
      setStep("login");
      setEmail("");
      setPassword("");
      setOtp(["", "", "", "", "", ""]);
    }
  };

  if (showSplash) {
    return (
      <div
        className="min-h-screen bg-blue-50 flex flex-col items-center justify-center"
        dir="rtl"
      >
        <div className="flex flex-col items-center animate-pulse">
          <img src="file.svg" alt="llog" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col" dir="rtl">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full flex justify-between items-center mb-16">
          <span className="text-gray-600 font-semibold text-sm">
            الإنكليزية
          </span>
        </div>

        {step === "login" ? (
          <>
            <div className="mb-16 flex justify-center">
              <img src="file.svg" alt="llog" />
            </div>
            <div className=" flex text-right">
              <h1 className="text-4xl font-bold text-gray-800 text-right mb-12">
                تسجيل الدخول
              </h1>
            </div>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-md">
              {/* Email Field */}
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="بريد الكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-200 border-0 rounded-full text-right placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex items-center justify-end gap-3 text-lg"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "16px center",
                    paddingLeft: "50px",
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة السر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-200 border-0 rounded-full text-right placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "16px center",
                    paddingLeft: "50px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-center mb-8">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  هل نسيت كلمة المرور؟{" "}
                  <span className="underline">تغيير كلمة المرور</span>
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-full transition-all duration-200 mb-8 shadow-lg text-lg"
              >
                تسجيل الدخول
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mb-16">
              <p className="text-gray-700 text-sm">
                لا تملك حساب مسبقا؟{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-bold"
                >
                  إنشاء حساب
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
              رمز التحقق{" "}
            </h1>
            <p className="text-center text-gray-600 mb-12">
              ادخل رمز التحقق المرسل الى رقم هاتفك{" "}
            </p>

            <form onSubmit={handleOtpSubmit} className="w-full max-w-md">
              <div className="mb-8">
                <label className="block text-right text-gray-700 font-medium mb-4">
                  أدخل رمز التحقق
                </label>
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-200 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!otp.every((digit) => digit)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-4 rounded-full transition-all duration-200 mb-6 shadow-lg text-lg"
              >
                تحقق
              </button>

              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors"
              >
                العودة للخلف
              </button>
            </form>
          </>
        )}
      </div>

      <footer className="text-center py-8 border-t border-blue-200">
        <p className="text-gray-500 text-sm mb-2">POWERED BY</p>
        <p className="text-gray-500 font-bold text-lg mb-1">Sham Cash ©</p>
        <p className="text-gray-500 text-sm mb-6">v 2.1.3</p>
      </footer>
    </div>
  );
}
