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
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    /* ===== เอกสาร (Local file path) ===== */
    resumeUrl: {
      type: String,
      required: true,
    },

    portfolioFileUrl: {
      type: String,
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

ApplicantSchema.index({ job: 1, email: 1 }, { unique: true });

export default models.Applicant || mongoose.model("Applicant", ApplicantSchema);
