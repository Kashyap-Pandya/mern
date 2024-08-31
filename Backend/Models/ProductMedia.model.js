import mongoose from "mongoose";

const productMediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: false,
  },
});

export const ProductMedia = mongoose.model("ProductMedia", productMediaSchema);
