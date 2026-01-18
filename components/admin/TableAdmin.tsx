"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuthMe } from "@/hooks/useAuthMe";
import Swal from "sweetalert2";

type Job = {
  id: string;
  companyName: string;
  position: string;
  createdAt: string;
  applicants?: number;
  status: string;
};

const mockJobs: Job[] = [
  {
    id: "job_001",
    companyName: "ABC จำกัด",
    position: "Frontend Developer",
    createdAt: "2026-01-15",
    applicants: 12,
    status: "เปิดรับสมัคร",
  },
  {
    id: "job_002",
    companyName: "XYZ Tech",
    position: "Backend Developer",
    createdAt: "2026-01-10",
    applicants: 5,
    status: "ปิดรับสมัคร",
  },
];

export function TableAdmin() {
  const { loading, unauthorized } = useAuthMe();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [fetching, setFetching] = useState(false);

  /* ===== dropdown state ===== */
  const [openId, setOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ===== fetch jobs ===== */
  useEffect(() => {
    if (unauthorized || loading) return;

    const fetchJobs = async () => {
      try {
        setFetching(true);
        const res = await fetch("/api/jobs", {
          credentials: "include",
        });
        const data = await res.json();

        setJobs(
          data.jobs.map((job: any) => ({
            id: job.id,
            companyName: job.companyName,
            position: job.position,
            createdAt: job.createdAt.slice(0, 10),
            applicants: job.applicants || 0,
            status: job.isPublic ? "เปิดรับสมัคร" : "ปิดรับสมัคร",
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchJobs();
  }, [unauthorized, loading]);

  const displayJobs = unauthorized ? mockJobs : jobs;

  /* ===== delete job ===== */
  const handleDelete = async (jobId: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "ลิงก์รับสมัครงานจะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({
        icon: "success",
        title: "ลบสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });

      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      Swal.fire("ผิดพลาด", err.message, "error");
    }
  };

  /* ===== click outside ===== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const truncateText = (text: string, max = 20) =>
    text.length > max ? text.slice(0, max) + "..." : text;

  return (
    <div className="p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4 mt-5">ลิงก์สมัครงานทั้งหมด</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">บริษัท</th>
              <th className="p-3">ตำแหน่ง</th>
              {/* <th className="p-3">วันที่สร้าง</th> */}
              <th className="p-3">ผู้สมัคร</th>
              <th className="p-3">สถานะ</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {!unauthorized && fetching && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            )}

            {!unauthorized && !fetching && displayJobs.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">
                  ยังไม่มีลิงก์รับสมัครงาน
                </td>
              </tr>
            )}

            {displayJobs.map((job) => (
              <tr key={job.id} className="border-t">
                <td className="p-3"> {truncateText(job.companyName, 20)}</td>
                <td className="p-3 font-medium">
                  {" "}
                  {truncateText(job.position, 20)}
                </td>
                {/* <td className="p-3">{job.createdAt}</td> */}
                <td className="p-3">{job.applicants ?? 0} คน</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      job.status === "เปิดรับสมัคร"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}>
                    {job.status}
                  </span>
                </td>

                {/* ===== Action ===== */}
                <td className="p-3 text-center">
                  <div
                    className="relative inline-block"
                    tabIndex={0}
                    onBlur={() => setOpenId(null)}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenId(openId === job.id ? null : job.id)
                      }
                      className="p-2 rounded hover:bg-gray-200 cursor-pointer bg-gray-100">
                      ...
                    </button>

                    {openId === job.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50 text-left">
                        <Link
                          onMouseDown={(e) => e.preventDefault()}
                          href={`/admin/registerjob/${job.id}`}
                          target="_blank"
                          className="block px-4 py-2 text-sm hover:bg-gray-100">
                          เปิดลิงก์
                        </Link>

                        <Link
                          onMouseDown={(e) => e.preventDefault()}
                          href={`/admin/applicants/${job.id}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-100">
                          ผู้สมัคร
                        </Link>

                        <Link
                          href={`/admin/job/${job.id}`}
                          onMouseDown={(e) => e.preventDefault()}
                          className="block px-4 py-2 text-sm hover:bg-gray-100">
                          รายละเอียด
                        </Link>

                        <button
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleDelete(job.id)}
                          className="w-full text-left px-4 py-2 cursor-pointer text-sm text-red-600 hover:bg-red-50">
                          ลบ
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
