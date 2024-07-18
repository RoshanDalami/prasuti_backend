import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Donation = mongoose.model("Donation", donationSchema);

export { Donation };
