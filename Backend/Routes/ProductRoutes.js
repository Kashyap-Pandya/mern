import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductsWithPriceRange,
  getSingleProduct,
  updateProduct,
} from "../Controllers/ProductControllers.js";

const router = express.Router();

// GET Products
router.get("/", getProductsWithPriceRange);

// GET Single Product
router.get("/:id", getSingleProduct);

// POST Product
router.post("/", createProduct);

// PATCH Product
router.patch("/:id", updateProduct);

// DELETE Product
router.delete("/:id", deleteProduct);

export default router;
