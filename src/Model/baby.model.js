import mongoose, { Schema } from "mongoose";
const babySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fiscalYear: {
      type: Schema.Types.ObjectId,
      ref: "Fiscal",
    },
    babyName: {
      type: String,
      required: true,
    },
    dateOfBaby: {
      type: String,
      required: [true, "Baby birth date is required"],
    },
    engDateOfBaby: {
      type: String,
      required: [true, "Baby english date is requied"],
    },
    gestationalAge: {
      type: String,
      required: [true, "Gestational Age is requied"],
    },
    ipNumber: {
      type: String,
      required: [true, "Ip number is required"],
    },
    babyWeight: {
      type: String,
      required: [true, "Baby weight is required"],
    },
    diagnosis: {
      type: [String],
      required: [true, "Diagnosis recipient is required"],
    },
    indications: {
      type: [String],
      required: [true, "Indications is required"],
    },
    babyStatus: {
      type: String,
      required: true,
    },
    milkConsumed: {
      type: Number,
      required: true,
      default: 0,
    },
    milkConsumedToday: {
      type: Number,
      required: true,
      default: 0,
    },
    status:{
      type:Boolean,
      default : true
    },
    gender:{
      type:String
    },
    parity:{
      type:String
    }
  },
  { timestamps: true }
);

const BabyDetail =
  mongoose.models.BabyDetail || mongoose.model("BabyDetail", babySchema);

export { BabyDetail };
