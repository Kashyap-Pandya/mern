import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export const Material = mongoose.model("Material", MaterialSchema);
