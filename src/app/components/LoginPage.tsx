"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "user@example.com" && password === "password") {
      localStorage.setItem("token", "your-secure-token");
      router.push("/");
    } else {
      alert("Invalid credentials!");
    }
  };
  return (
    <form className="flex items-center justify-center min-h-screen mx-auto">
      <div className="flex bg-white rounded-lg shadow-lg w-[800px] overflow-hidden">
        {/* Left Section - Sign In */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In</h2>
          <p className="text-sm text-gray-500 mb-4">
            or use your email password
          </p>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#" className="text-xs text-blue-500">
            Forgot Your Password?
          </a>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded mt-2"
          >
            Login
          </button>
        </div>

        {/* Right Section - Register */}
        <div className="w-1/2 bg-blue-600 text-white flex flex-col items-center justify-center p-8">
          <h2 className="text-2xl font-bold mb-2">Hello, Friend!</h2>
          <p className="text-center mb-4">
            Register with your personal details to use all of site features
          </p>
          <button className="bg-white text-blue-600 py-2 px-6 rounded">
            SIGN UP
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
