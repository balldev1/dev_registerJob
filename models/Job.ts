// models/Job.ts
import mongoose, { Schema, models } from "mongoose";

const JobSchema = new Schema(
  {
    // เจ้าของลิงก์ (HR)
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ข้อมูลบริษัท
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },

    // ข้อมูลตำแหน่ง
    position: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    salary: {
      type: String,
    },

    // รายละเอียด
    description: {
      type: String,
    },
    qualification: {
      type: String,
    },

    // การตั้งค่า
    isPublic: {
      type: Boolean,
      default: true,
    },

    // ตั้งค่าฟอร์มผู้สมัคร
    formConfig: {
      requireResume: {
        type: Boolean,
        default: true,
      },
      enablePortfolioLink: {
        type: Boolean,
        default: false,
      },
      enablePortfolioUpload: {
        type: Boolean,
        default: false,
      },
    },

    // สถานะลิงก์
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

export default models.Job || mongoose.model("Job", JobSchema);
