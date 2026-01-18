import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "hr"],
      default: "hr",
    },
  },
  { timestamps: true },
);

export default models.User || mongoose.model("User", UserSchema);
