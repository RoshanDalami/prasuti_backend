import mongoose, { Schema } from "mongoose";

const bottleList = new Schema({
  name: {
    type: String,
    required: true,
  },

  volume: {
    type: Number,
    required: true,
  },
  remainingVoluem: {
    type: Number,
  },
  expireDate: {
    type: String,
    required: true,
  },

  poolingId: {
    type: String,
    required: true,
  },
  poolingCondition: {
    type: Number,
    required: true,
  },
  poolingDate: {
    type: String,
    required: true,
  },
    isActive:{
      type:Boolean,
        default:true
    }
});

const bottleSchema = new Schema(
  {
    poolingId: {
      type: Schema.Types.ObjectId,
      ref: "Pasteurization",
    },
    poolingCondition: {
      type: Number,
      required: true,
    },
    expireDate: {
      type: String,
      required: true,
    },
    totalVolume: {
      type: Number,
      required: true,
    },
    poolingDate: {
      type: String,
      required: true,
    },
    fiscalYear: {
      type: Schema.Types.ObjectId,
      ref: "Fiscal",
    },

    bottleList: [bottleList],
  },
  { timestamps: true }
);

const Bottle = mongoose.models.Bottle || mongoose.model("Bottle", bottleSchema);

export { Bottle };
