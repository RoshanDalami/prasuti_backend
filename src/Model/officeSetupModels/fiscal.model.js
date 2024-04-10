import mongoose, { Schema } from "mongoose";

const fiscalSchema = new Schema(
  {
    fiscalYear: {
      type: String,
    },
    startYear: {
      type: Number,
    },
    endYear: {
      type: Number,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Fiscal = mongoose.models.Fiscal || mongoose.model("Fiscal", fiscalSchema);

export { Fiscal };
