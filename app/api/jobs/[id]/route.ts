import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Job from "@/models/Job";
import { getAuthPayload } from "@/lib/getAuthUser";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    /* ===== auth ===== */
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const jobId = id;
    console.log(jobId);

    /* ===== หา job ===== */
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    /* ===== เช็คเจ้าของ ===== */
    if (job.owner.toString() !== payload.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /* ===== ลบ ===== */
    await Job.findByIdAndDelete(jobId);

    return NextResponse.json({
      message: "Job deleted successfully",
      id: jobId,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    /* ===== auth ===== */
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    /* ===== หา job ===== */
    const job = await Job.findById(id).lean();
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    /* ===== เช็คเจ้าของ ===== */
    if (job.owner.toString() !== payload.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      job: {
        id: job._id,
        companyName: job.companyName,
        companyWebsite: job.companyWebsite,
        position: job.position,
        jobType: job.jobType,
        salary: job.salary,
        description: job.description,
        qualification: job.qualification,
        isPublic: job.isPublic,
        formConfig: job.formConfig,
        createdAt: job.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    /* ===== auth ===== */
    const payload = await getAuthPayload();
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    /* ===== หา job ===== */
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    /* ===== owner only ===== */
    if (job.owner.toString() !== payload.userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    /* ===== body ===== */
    const body = await req.json();

    /* ===== allow fields ===== */
    const allowedFields = [
      "companyName",
      "companyWebsite",
      "position",
      "jobType",
      "salary",
      "description",
      "qualification",
      "isPublic",
      "formConfig",
    ];

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        job[key] = body[key];
      }
    }

    await job.save();

    return NextResponse.json({
      message: "Job updated successfully",
      job: {
        id: job._id,
        companyName: job.companyName,
        position: job.position,
        isPublic: job.isPublic,
        updatedAt: job.updatedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
