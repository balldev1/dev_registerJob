"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

export function JobDescription() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const handleBack = () => {
    if (from) {
      router.push(from);
    } else {
      router.push("/admin");
    }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    companyWebsite: "",
    position: "",
    jobType: "Full-time",
    salary: "",
    description: "",
    qualification: "",
    isPublic: true,
    requireResume: true,
    enablePortfolioLink: false,
    enablePortfolioUpload: false,
  });

  /* ===== GET job by id ===== */
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");

        const data = await res.json();
        const job = data.job;

        setForm({
          companyName: job.companyName,
          companyWebsite: job.companyWebsite || "",
          position: job.position,
          jobType: job.jobType,
          salary: job.salary || "",
          description: job.description || "",
          qualification: job.qualification || "",
          isPublic: job.isPublic,
          requireResume: job.formConfig?.requireResume ?? true,
          enablePortfolioLink: job.formConfig?.enablePortfolioLink ?? false,
          enablePortfolioUpload: job.formConfig?.enablePortfolioUpload ?? false,
        });
      } catch (err: any) {
        Swal.fire("ผิดพลาด", err.message, "error");
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ===== PATCH job ===== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        companyName: form.companyName,
        companyWebsite: form.companyWebsite,
        position: form.position,
        jobType: form.jobType,
        salary: form.salary,
        description: form.description,
        qualification: form.qualification,
        isPublic: form.isPublic,
        formConfig: {
          requireResume: form.requireResume,
          enablePortfolioLink: form.enablePortfolioLink,
          enablePortfolioUpload: form.enablePortfolioUpload,
        },
      };

      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({
        icon: "success",
        title: "บันทึกสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });

      // handleBack();
    } catch (err: any) {
      Swal.fire("ผิดพลาด", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <button
        onClick={handleBack}
        className="mb-4 bg-blue-600 text-white px-6 py-2 rounded hover:opacity-90">
        ← ย้อนกลับ
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <h1 className="text-2xl font-bold">แก้ไขลิงก์รับสมัครงาน</h1>

        {/* บริษัท */}
        <input
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="ชื่อบริษัท"
        />

        <input
          name="companyWebsite"
          value={form.companyWebsite}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="เว็บไซต์บริษัท"
        />

        {/* ตำแหน่ง */}
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="ชื่อตำแหน่งงาน"
        />

        <select
          name="jobType"
          value={form.jobType}
          onChange={handleChange}
          className="border p-3 rounded w-full">
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>

        <input
          name="salary"
          value={form.salary}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          placeholder="ช่วงเงินเดือน"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          rows={4}
        />

        <textarea
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          className="border p-3 rounded w-full"
          rows={4}
        />

        {/* config */}
        <label className="flex gap-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          เปิดให้เข้าได้ทุกคน
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="requireResume"
            checked={form.requireResume}
            onChange={handleChange}
          />
          ต้องแนบ Resume
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="enablePortfolioLink"
            checked={form.enablePortfolioLink}
            onChange={handleChange}
          />
          Portfolio Link
        </label>

        <label className="flex gap-2">
          <input
            type="checkbox"
            name="enablePortfolioUpload"
            checked={form.enablePortfolioUpload}
            onChange={handleChange}
          />
          แนบ Portfolio
        </label>

        <button
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-60">
          {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </form>
    </div>
  );
}
