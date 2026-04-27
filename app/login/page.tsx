"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, ListTodo } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, user } = useAuthStore();

  const [mode,          setMode]          = useState<"login" | "signup">("login");
  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName,    setSignupName]    = useState("");
  const [signupEmail,   setSignupEmail]   = useState("");
  const [signupPass,    setSignupPass]    = useState("");
  const [showPass,      setShowPass]      = useState(false);

  useEffect(() => { if (user) router.push("/"); }, [user]);

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("All fields required"); return;
    }
    const res = login(loginEmail, loginPassword);
    if (!res.success) toast.error(res.message);
    else { toast.success(res.message); router.push("/"); }
  };

  const handleSignup = () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPass.trim()) {
      toast.error("Please fill in all fields"); return;
    }
    const res = register({ name: signupName, email: signupEmail, password: signupPass });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message + " Please sign in.");
      setLoginEmail(signupEmail);
      setLoginPassword("");
      setSignupName(""); setSignupEmail(""); setSignupPass("");
      setMode("login");
    }
  };

  const isLogin = mode === "login";
  const inputCls = "pl-9 bg-slate-50 border-slate-200 h-11 text-slate-800 placeholder:text-slate-400 focus-visible:ring-teal-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">

      {/* ══ MOBILE (< md) ══ */}
      <div className="md:hidden w-full max-w-sm flex flex-col rounded-3xl shadow-2xl overflow-hidden">

        {/* Teal header */}
        <div className="relative bg-gradient-to-br from-teal-400 to-teal-600 px-8 pt-8 pb-10 text-white text-center overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 right-4 w-10 h-10 rotate-45 bg-white/10" />
          <div className="relative flex items-center justify-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">MyTasks</span>
          </div>
          <h3 className="text-xl font-bold relative">
            {isLogin ? "Welcome Back!" : "Hello, Friend!"}
          </h3>
          <p className="text-white/80 text-sm mt-1 relative">
            {isLogin ? "Sign in to continue" : "Create an account and get started"}
          </p>
          <div className="relative flex gap-2 mt-5 bg-white/10 rounded-full p-1">
            {(["login", "signup"] as const).map((m) => (
              <button key={m}
                onClick={() => { setMode(m); setShowPass(false); }}
                className={`flex-1 py-1.5 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${
                  mode === m ? "bg-white text-teal-600 shadow" : "text-white/80 hover:text-white"
                }`}>
                {m === "login" ? "SIGN IN" : "SIGN UP"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white px-8 py-7 flex flex-col gap-4">
          {isLogin ? (
            <>
              <h2 className="text-xl font-bold text-teal-500 text-center">Sign in</h2>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="email" placeholder="Email" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className={inputCls} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type={showPass ? "text" : "password"} placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className={`${inputCls} pr-9`} />
                  <button type="button" tabIndex={-1} onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 text-right cursor-pointer hover:text-teal-500 transition-colors">
                  Forgot your password?
                </p>
              </div>
              <Button onClick={handleLogin}
                className="w-full h-11 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-bold tracking-widest text-sm">
                SIGN IN
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-teal-500 text-center">Create Account</h2>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Name" value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    className={inputCls} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="email" placeholder="Email" value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    className={inputCls} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="password" placeholder="Password" value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                    className={inputCls} />
                </div>
              </div>
              <Button onClick={handleSignup}
                className="w-full h-11 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-bold tracking-widest text-sm">
                SIGN UP
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ══ DESKTOP (≥ md) ══ */}
      <div className="hidden md:flex relative w-full max-w-3xl h-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LOGIN FORM */}
        <div className={`absolute inset-y-0 flex flex-col items-center justify-center px-10 w-1/2 transition-all duration-700 ease-in-out
          ${isLogin ? "left-0 opacity-100 z-20 pointer-events-auto" : "-left-1/2 opacity-0 z-10 pointer-events-none"}`}>
          <h2 className="text-2xl font-bold text-teal-500 mb-6">Sign in</h2>
          <div className="w-full space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input type="email" placeholder="Email" value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={inputCls} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input type={showPass ? "text" : "password"} placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={`${inputCls} pr-9`} />
              <button type="button" tabIndex={-1} onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 text-right cursor-pointer hover:text-teal-500 transition-colors">
              Forgot your password?
            </p>
          </div>
          <Button onClick={handleLogin}
            className="mt-5 w-full h-11 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-bold tracking-widest text-sm">
            SIGN IN
          </Button>
        </div>

        {/* SIGNUP FORM */}
        <div className={`absolute inset-y-0 flex flex-col items-center justify-center px-10 w-1/2 transition-all duration-700 ease-in-out
          ${!isLogin ? "right-0 opacity-100 z-20 pointer-events-auto" : "-right-1/2 opacity-0 z-10 pointer-events-none"}`}>
          <h2 className="text-2xl font-bold text-teal-500 mb-6">Create Account</h2>
          <div className="w-full space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Name" value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className={inputCls} />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input type="email" placeholder="Email" value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className={inputCls} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input type="password" placeholder="Password" value={signupPass}
                onChange={(e) => setSignupPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className={inputCls} />
            </div>
          </div>
          <Button onClick={handleSignup}
            className="mt-5 w-full h-11 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-bold tracking-widest text-sm">
            SIGN UP
          </Button>
        </div>

        {/* SLIDING TEAL PANEL */}
        <div className={`absolute inset-y-0 w-1/2 z-30 transition-all duration-700 ease-in-out
          ${isLogin ? "left-1/2" : "left-0"}`}>
          <div className="relative w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex flex-col items-center justify-center px-10 text-white overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full" />
            <div className="absolute top-1/3 right-6 w-14 h-14 rotate-45 bg-white/10" />
            <div className="absolute bottom-20 right-1/4 w-8 h-8 rotate-12 bg-white/10" />
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">MyTasks</span>
            </div>
            <div className="relative text-center">
              {isLogin ? (
                <>
                  <h3 className="text-2xl font-bold mb-3">Hello, Friend!</h3>
                  <p className="text-white/80 text-sm mb-8 leading-relaxed">
                    Enter your personal details<br />and start your journey with us
                  </p>
                  <button onClick={() => { setMode("signup"); setShowPass(false); }}
                    className="px-8 py-2.5 rounded-full border-2 border-white text-white font-bold text-sm tracking-widest hover:bg-white hover:text-teal-600 transition-all duration-200">
                    SIGN UP
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold mb-3">Welcome Back!</h3>
                  <p className="text-white/80 text-sm mb-8 leading-relaxed">
                    To keep connected with us please<br />login with your personal info
                  </p>
                  <button onClick={() => { setMode("login"); setShowPass(false); }}
                    className="px-8 py-2.5 rounded-full border-2 border-white text-white font-bold text-sm tracking-widest hover:bg-white hover:text-teal-600 transition-all duration-200">
                    SIGN IN
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
