"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Applicant = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  portfolio?: string;
  status: string;
  resume: string;
  createdAt: string;
};

export function AppDescription() {
  const pathname = usePathname();
  const [selected, setSelected] = useState<Applicant | null>(null);

  /* mock ผู้สมัคร */
  const applicants: Applicant[] = [
    {
      id: "app_001",
      fullname: "สมชาย ใจดี",
      email: "somchai@email.com",
      phone: "089-999-9999",
      portfolio: "https://github.com/somchai",
      resume: "/resume/somchai.pdf",
      status: "ติดต่อแล้ว",
      createdAt: "2024-01-10",
    },
    {
      id: "app_002",
      fullname: "สุดา เก่งมาก",
      email: "suda@email.com",
      phone: "081-222-3333",
      resume: "/resume/suda.pdf",
      status: "ยังไม่ติดต่อ",
      createdAt: "2024-01-11",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 p-6 text-black space-y-6">
      <nav className="fixed   ">
        <Link
          href="/admin"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white p-2 px-6 rounded shadow font-semibold  cursor-pointer hover:opacity-90">
          ← ย้อนกลับ
        </Link>
      </nav>
      {/* ================= HEADER: COMPANY / JOB ================= */}
      <div className="bg-white rounded shadow mt-14 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Frontend Developer</h1>
          <p className="text-gray-600">บริษัท ABC จำกัด</p>

          <div className="flex gap-3 mt-2 text-sm">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
              เปิดรับสมัคร
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
              ผู้สมัครทั้งหมด {applicants.length} คน
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={{
              pathname: "/admin/job/job_001",
              query: { from: pathname },
            }}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:opacity-90">
            แก้ไขลิงก์งาน
          </Link>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-90">
            ปิดรับสมัคร
          </button>
        </div>
      </div>
      {/* ================= GRID CONTENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ================= LEFT: TABLE ================= */}
        <div className="md:col-span-1 bg-white rounded shadow">
          <div className="p-4 font-semibold border-b">ผู้สมัครทั้งหมด</div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ชื่อ</th>
                <th className="text-left p-3">วันที่สมัคร</th>
                <th className="text-left p-3">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className={`cursor-pointer hover:bg-blue-50 ${
                    selected?.id === app.id ? "bg-blue-100" : ""
                  }`}>
                  <td className="p-3">
                    <p className="font-medium">{app.fullname}</p>
                    <p className="text-xs text-gray-500">{app.email}</p>
                  </td>
                  <td className="p-3">{app.createdAt}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        app.status === "ติดต่อแล้ว"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= RIGHT: DETAIL ================= */}
        <div className="md:col-span-2 bg-white rounded shadow p-6">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-lg">
              ← กรุณาเลือกผู้สมัครจากตารางด้านซ้าย
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="text-xl font-bold">รายละเอียดผู้สมัคร</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">ชื่อ - นามสกุล</p>
                  <p className="font-medium">{selected.fullname}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">อีเมล</p>
                  <p className="font-medium">{selected.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">เบอร์โทร</p>
                  <p className="font-medium">{selected.phone}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">วันที่สมัคร</p>
                  <p className="font-medium">{selected.createdAt}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Portfolio</p>
                {selected.portfolio ? (
                  <a
                    href={selected.portfolio}
                    target="_blank"
                    className="text-blue-600 underline">
                    {selected.portfolio}
                  </a>
                ) : (
                  <p className="text-gray-400">- ไม่ได้แนบ -</p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm">Resume</p>
                <a
                  href={selected.resume}
                  target="_blank"
                  className="inline-block mt-1 px-4 py-2 bg-green-600 text-white rounded hover:opacity-90">
                  ดาวน์โหลด Resume
                </a>
              </div>

              {/* action HR */}
              <div className="flex gap-3 pt-4 border-t">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                  ติดต่อแล้ว
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded">
                  ยังไม่ติดต่อ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="fixed bottom-5  py-1 px-2 right-5 text-sm font-bold flex items-center gap-2 text-sky-700">
        nanthawatcola1994@gmail.com
        <p className="font-semibold text-sm bg-sky-600 px-1  text-white rounded">
          developer
        </p>
        <p className="font-semibold text-sm bg-sky-600 px-1  text-white rounded">
          beta 1.0
        </p>
      </footer>
    </div>
  );
}
