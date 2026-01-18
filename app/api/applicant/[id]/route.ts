// app/api/jobs/[id]/apply/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";
import Applicant from "@/models/Applicant";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import { getAuthPayload } from "@/lib/getAuthUser";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid job id" }, { status: 400 });
    }

    const formData = await req.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;

    const resume = formData.get("resume") as File | null;
    const portfolio = formData.get("portfolio") as File | null;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ message: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    await dbConnect();

    /* ===== หา job ===== */
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "ไม่พบงาน" }, { status: 404 });
    }

    if (!job.isPublic || job.status !== "open") {
      return NextResponse.json(
        { message: "งานนี้ปิดรับสมัครแล้ว" },
        { status: 403 },
      );
    }

    if (job.formConfig?.requireResume && !resume) {
      return NextResponse.json({ message: "ต้องแนบ Resume" }, { status: 400 });
    }

    /* ===== prevent duplicate ===== */
    const exists = await Applicant.findOne({
      job: id,
      email: email.toLowerCase(),
    });

    if (exists) {
      return NextResponse.json(
        { message: "อีเมลนี้สมัครงานนี้แล้ว" },
        { status: 409 },
      );
    }

    /* ===== prepare upload path ===== */
    const uploadDir = path.join(
      process.cwd(),
      "uploads",
      "jobs",
      id,
      "applicants",
    );

    await fs.mkdir(uploadDir, { recursive: true });

    let resumeUrl: string | undefined;
    let portfolioFileUrl: string | undefined;

    /* ===== save resume ===== */
    if (resume) {
      const ext = path.extname(resume.name);
      const fileName = `resume-${Date.now()}${ext}`;
      const buffer = Buffer.from(await resume.arrayBuffer());

      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      resumeUrl = `uploads/jobs/${id}/applicants/${fileName}`;
    }

    /* ===== save portfolio ===== */
    if (portfolio) {
      const ext = path.extname(portfolio.name);
      const fileName = `portfolio-${Date.now()}${ext}`;
      const buffer = Buffer.from(await portfolio.arrayBuffer());

      await fs.writeFile(path.join(uploadDir, fileName), buffer);
      portfolioFileUrl = `uploads/jobs/${id}/applicants/${fileName}`;
    }

    /* ===== create applicant ===== */
    const applicant = await Applicant.create({
      job: id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    /* ===== auth ===== */
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    /* ===== หา applicant + job ===== */
    const applicant = await Applicant.findById(id).populate("job");
    if (!applicant || !applicant.resumeUrl) {
      return NextResponse.json({ message: "ไม่พบไฟล์" }, { status: 404 });
    }

    const job = applicant.job as any;

    /* ===== เช็คเจ้าของงาน ===== */
    if (job.owner.toString() !== payload.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /* ===== load file ===== */
    const filePath = path.join(process.cwd(), applicant.resumeUrl);
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="resume.pdf"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
