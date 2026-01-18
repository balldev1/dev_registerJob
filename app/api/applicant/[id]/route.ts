// app/api/jobs/[id]/apply/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";
import Applicant from "@/models/Applicant";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("jjjjjjjjjjj", id);
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      resumeUrl,
      portfolioFileUrl,
    } = body;

    /* ===== connect db ===== */
    await dbConnect();

    /* ===== หา job ===== */
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "ไม่พบงาน" }, { status: 404 });
    }

    /* ===== เช็คสถานะงาน ===== */
    if (!job.isPublic || job.status !== "open") {
      return NextResponse.json(
        { message: "งานนี้ปิดรับสมัครแล้ว" },
        { status: 403 },
      );
    }

    /* ===== validate ตาม formConfig ===== */
    if (job.formConfig?.requireResume && !resumeUrl) {
      return NextResponse.json({ message: "ต้องแนบ Resume" }, { status: 400 });
    }

    if (job.formConfig?.enablePortfolioUpload && !portfolioFileUrl) {
      return NextResponse.json(
        { message: "ต้องแนบ Portfolio" },
        { status: 400 },
      );
    }

    /* ===== ป้องกันสมัครซ้ำ ===== */
    const exists = await Applicant.findOne({ job: id, email });
    if (exists) {
      return NextResponse.json(
        { message: "อีเมลนี้สมัครงานนี้แล้ว" },
        { status: 409 },
      );
    }

    /* ===== create applicant ===== */
    const applicant = await Applicant.create({
      job: id,
      firstName,
      lastName,
      email,
      phone,
      address,
      resumeUrl,
      portfolioFileUrl,
    });

    return NextResponse.json(
      {
        message: "สมัครงานสำเร็จ",
        applicantId: applicant._id,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
