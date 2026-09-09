import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    condition: {
      type: String,
      enum: ["Like New", "Good", "Fair", "Needs Repair"],
      required: true,
    },
    images: [{ type: String }],
    stock: { type: Number, default: 1 },
    isSold: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
