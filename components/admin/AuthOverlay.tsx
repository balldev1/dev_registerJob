// components/admin/AuthOverlay.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export function AuthOverlay() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        tab === "login" ? "/api/auth/login" : "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "เกิดข้อผิดพลาด");
        return;
      }

      // login / register success
      window.location.reload();
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className=" bg-linear-to-r from-sky-50 via-wihte to-sky-50 rounded-xl w-[500px] shadow-xl overflow-hidden text-black">
        <div className="flex items-center justify-center px-10 py-6  bg-linear-to-r from-sky-100 via-wihte to-sky-100 shadow shadow-gray-500">
          <Image src="/logo2.png" width={120} height={120} alt="hexyong logo" />
        </div>
        {/* ===== Tabs ===== */}
        <div className="flex border-b">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-6 cursor-pointer font-medium ${
              tab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}>
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-6  cursor-pointer  font-medium ${
              tab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}>
            สมัครเข้าใช้งาน
          </button>
        </div>
        {/* ===== Content ===== */}
        <form onSubmit={handleSubmit} className="p-6 mt-4 space-y-6">
          <input
            type="email"
            placeholder="อีเมล"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full border p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50">
            {loading
              ? "กำลังดำเนินการ..."
              : tab === "login"
                ? "เข้าสู่ระบบ"
                : "สมัครเข้าใช้งาน"}
          </button>

          <p className="text-xs text-gray-400 text-center">
            ระบบรับสมัครงานสำหรับ HR
          </p>
        </form>
      </div>
    </div>
  );
}
