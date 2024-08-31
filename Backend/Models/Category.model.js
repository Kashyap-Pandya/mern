import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { collection: "categories" }
);
export const Category = mongoose.model("Category", categorySchema);
