"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export function LinkRegisterJob() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;

    const payload = {
      companyName: form.companyName.value,
      companyWebsite: form.companyWebsite.value,
      position: form.position.value,
      jobType: form.jobType.value,
      salary: form.salary.value,
      description: form.description.value,
      qualification: form.qualification.value,
      isPublic: form.isPublic.checked,
      requireResume: form.requireResume.checked,
      enablePortfolioLink: form.enablePortfolioLink.checked,
      enablePortfolioUpload: form.enablePortfolioUpload.checked,
    };

    try {
      // Loading
      Swal.fire({
        title: "กำลังสร้างลิงก์...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Create job failed");
      }

      //  Success (แสดง 3 วิ)
      Swal.fire({
        icon: "success",
        title: "สร้างลิงก์สำเร็จ 🎉",
        html: `
        <p class="text-sm">ลิงก์รับสมัครงาน</p>
        <a href="${data.link}" target="_blank"
           class="text-blue-600 underline break-all">
          http://locahost:3000.com/admin${data.link}
        </a>
      `,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      form.reset();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message,
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 px-8 bg-gray-200 text-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-white p-6 rounded-sm shadow-lg shadow-gray-600 space-y-6">
        <h1 className="text-2xl font-bold">
          สร้างลิงก์รับสมัครงาน
          <p className="text-gray-500 text-sm">
            กรอกข้อมูลบริษัทและตำแหน่งงานเพื่อสร้างฟอร์มสมัครงาน
          </p>
        </h1>

        {/* ข้อมูลบริษัท */}
        <section className="space-y-3">
          <h2 className="font-semibold">ข้อมูลบริษัท</h2>
          <input
            name="companyName"
            className="border p-3 rounded w-full"
            placeholder="ชื่อบริษัท"
            required
          />
          <input
            name="companyWebsite"
            className="border p-3 rounded w-full"
            placeholder="เว็บไซต์บริษัท"
          />
        </section>

        {/* ข้อมูลตำแหน่ง */}
        <section className="space-y-3">
          <h2 className="font-semibold">ข้อมูลตำแหน่งงาน</h2>
          <input
            name="position"
            className="border p-3 rounded w-full"
            placeholder="ชื่อตำแหน่งงาน"
            required
          />

          <select name="jobType" className="border p-3 rounded w-full">
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>

          <input
            name="salary"
            className="border p-3 rounded w-full"
            placeholder="ช่วงเงินเดือน (เช่น 30,000 - 50,000)"
          />
        </section>

        {/* รายละเอียด */}
        <section className="space-y-3">
          <h2 className="font-semibold">รายละเอียดงาน</h2>
          <textarea
            name="description"
            className="border p-3 rounded w-full"
            rows={4}
            placeholder="รายละเอียดงาน"
          />
          <textarea
            name="qualification"
            className="border p-3 rounded w-full"
            rows={4}
            placeholder="คุณสมบัติผู้สมัคร"
          />
        </section>

        {/* การเผยแพร่ */}
        <section className="space-y-2">
          <h2 className="font-semibold">ตั้งค่าการเผยแพร่</h2>
          <label className="flex items-center gap-2">
            <input name="isPublic" type="checkbox" defaultChecked />
            เปิดให้เข้าได้ทุกคน
          </label>
        </section>

        {/* ตั้งค่าฟอร์ม */}
        <section className="space-y-2">
          <h2 className="font-semibold">ตั้งค่าฟอร์มผู้สมัคร</h2>

          <label className="flex items-center gap-2">
            <input name="requireResume" type="checkbox" defaultChecked />
            ผู้สมัครต้องแนบ Resume (PDF)
          </label>

          <label className="flex items-center gap-2">
            <input name="enablePortfolioLink" type="checkbox" />
            เปิดช่อง Portfolio Link
          </label>

          <label className="flex items-center gap-2">
            <input name="enablePortfolioUpload" type="checkbox" />
            เปิดให้แนบ Portfolio (PDF / รูป)
          </label>
        </section>

        <button
          disabled={loading}
          className="bg-blue-600 text-white w-full py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-60">
          {loading ? "กำลังสร้าง..." : "สร้างลิงก์รับสมัครงาน"}
        </button>
      </form>
    </div>
  );
}
