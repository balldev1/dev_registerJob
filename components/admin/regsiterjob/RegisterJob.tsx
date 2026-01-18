"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type JobDetail = {
  id: string;
  title: string;
  companyName: string;
  website?: string;
  type?: string;
  salary?: string;
  details?: {
    label: string;
    value: string;
  }[];
};

export function RegisterJob() {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    resume: null as File | null,
    portfolio: null as File | null,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== fetch job by id ===== */
  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        const jobData = data.job;

        setJob({
          id: jobData.id,
          title: jobData.position,
          companyName: jobData.companyName,
          website: jobData.companyWebsite,
          type: jobData.jobType,
          salary: jobData.salary,
          details: [
            {
              label: "รายละเอียดงาน",
              value: jobData.description,
            },
            {
              label: "คุณสมบัติ",
              value: jobData.qualification,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;
  }

  if (!job) {
    return <div className="p-10 text-center text-red-500">ไม่พบงาน</div>;
  }

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    // จำกัดขนาดไฟล์ 5MB (แนะนำ)
    if (files[0].size > 5 * 1024 * 1024) {
      alert("ไฟล์ต้องไม่เกิน 5MB");
      return;
    }

    setForm({ ...form, [name]: files[0] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      if (form.phone) formData.append("phone", form.phone);
      if (form.address) formData.append("address", form.address);
      if (form.resume) formData.append("resume", form.resume);
      if (form.portfolio) formData.append("portfolio", form.portfolio);

      const res = await fetch(`/api/applicant/${id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("✅ สมัครงานสำเร็จ");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        resume: null,
        portfolio: null,
      });
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 py-10 px-4 text-black">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* ================= GRID 1 : JOB INFO ================= */}
          <div className="bg-white rounded shadow p-6 space-y-4 h-fit">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-gray-600">{job.companyName}</p>

              {job.website && (
                <a
                  href={job.website}
                  target="_blank"
                  className="text-sm text-blue-600 underline">
                  {job.website}
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {job.type && (
                <div>
                  <span className="text-gray-500">ประเภทงาน</span>
                  <p className="font-medium">{job.type}</p>
                </div>
              )}

              {job.salary && (
                <div>
                  <span className="text-gray-500">เงินเดือน</span>
                  <p className="font-medium">{job.salary}</p>
                </div>
              )}
            </div>

            {job.details?.map((item, index) => (
              <div key={index}>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className="mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* ================= GRID 2 : FORM ================= */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold">แบบฟอร์มสมัครงาน</h2>

            {/* ===== First name ===== */}
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              placeholder="ชื่อ"
              required
            />

            {/* ===== Last name ===== */}
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              placeholder="นามสกุล"
              required
            />

            {/* ===== Email ===== */}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              placeholder="อีเมล"
              required
            />

            {/* ===== Phone ===== */}
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              placeholder="เบอร์โทรศัพท์"
            />

            {/* ===== Address ===== */}
            <textarea
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              placeholder="ที่อยู่"
            />

            {/* ===== Resume Upload ===== */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Resume (PDF / PNG)
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.png,.jpg"
                onChange={handleFileChange}
                className="border p-3 rounded w-full"
                required
              />
              {form.resume && (
                <p className="text-xs text-gray-500 mt-1">
                  เลือกไฟล์: {form.resume.name}
                </p>
              )}
            </div>

            {/* ===== Portfolio Upload (optional) ===== */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Portfolio (ถ้ามี)
              </label>
              <input
                type="file"
                name="portfolio"
                accept=".pdf,.png,.jpg,.zip"
                onChange={handleFileChange}
                className="border p-3 rounded w-full"
              />
              {form.portfolio && (
                <p className="text-xs text-gray-500 mt-1">
                  เลือกไฟล์: {form.portfolio.name}
                </p>
              )}
            </div>

            {/* ===== Submit ===== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:opacity-90 disabled:opacity-50">
              {loading ? "กำลังส่ง..." : "ส่งใบสมัคร"}
            </button>

            {message && (
              <p className="text-center text-sm mt-2 text-gray-700">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
