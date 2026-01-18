// models/Applicant.ts
import mongoose, { Schema, models } from "mongoose";

const ApplicantSchema = new Schema(
  {
    /* ===== ความสัมพันธ์ ===== */
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    /* ===== ข้อมูลผู้สมัคร ===== */
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    /* ===== เอกสาร ===== */
    resumeUrl: {
      type: String, // link ไฟล์ resume (S3, Cloudinary ฯลฯ)
    },

    portfolioFileUrl: {
      type: String, // ถ้าเปิด upload portfolio
    },

    /* ===== สถานะการสมัคร ===== */
    status: {
      type: String,
      enum: ["submitted", "reviewed", "shortlisted", "rejected"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  },
);

export default models.Applicant || mongoose.model("Applicant", ApplicantSchema);
