// app/api/jobs/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";
import { getAuthPayload } from "@/lib/getAuthUser";

export async function POST(req: Request) {
  try {
    const payload = await getAuthPayload();

    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const body = await req.json();

    const job = await Job.create({
      owner: payload.userId,

      companyName: body.companyName,
      companyWebsite: body.companyWebsite,

      position: body.position,
      jobType: body.jobType,
      salary: body.salary,

      description: body.description,
      qualification: body.qualification,

      isPublic: body.isPublic,

      formConfig: {
        requireResume: body.requireResume,
        enablePortfolioLink: body.enablePortfolioLink,
        enablePortfolioUpload: body.enablePortfolioUpload,
      },
    });

    return NextResponse.json(
      {
        message: "Job link created",
        jobId: job._id,
        link: `/registerjob/${job._id}`,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    const payload = await getAuthPayload();

    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const jobs = await Job.find({ owner: payload.userId })
      .sort({ createdAt: -1 })
      .select("companyName position jobType isPublic slug createdAt");

    return NextResponse.json({
      jobs: jobs.map((job) => ({
        id: job._id,
        companyName: job.companyName,
        position: job.position,
        jobType: job.jobType,
        isPublic: job.isPublic,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/register-job/${job.slug}`,
        createdAt: job.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
