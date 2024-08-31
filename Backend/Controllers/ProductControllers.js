import { Product } from "../Models/Product.model.js";
import { Category } from "../Models/Category.model.js";
import { Material } from "../Models/Material.model.js";
import { ProductMedia } from "../Models/ProductMedia.model.js";
import bcrypt from "bcryptjs";

// GET Products
export const getProductsWithPriceRange = async (req, res) => {
  try {
    // Fetch products
    const products = await Product.find({})
      .populate("category")
      .populate("material")
      .populate("image");

    // Fetch price range data
    const priceRangeResults = await Product.aggregate([
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 500, 1000, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          priceRange: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-500" },
                { case: { $eq: ["$_id", 500] }, then: "501-1000" },
                { case: { $eq: ["$_id", 1000] }, then: "1000+" },
              ],
              default: "Unknown",
            },
          },
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      products,
      priceRanges: priceRangeResults,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching data",
      error: error.message,
    });
  }
};

// GET Single Product
export const getSingleProduct = async (req, res) => {
  if (!req.params)
    return res
      .status(404)
      .json({ message: `Error while finding product for requested Id` });
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("category")
      .populate("material")
      .populate("image");

    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while fetching the data", error: error.message });
  }
};

// POST Product
export const createProduct = async (req, res) => {
  try {
    const { categoryData, materialData, sku, name, price, status, imageData } =
      req.body;
    console.log(imageData);
    const category = new Category(categoryData);
    await category.save();

    const material = new Material(materialData);
    await material.save();

    const image = new ProductMedia(imageData);
    await image.save();

    const saltRounds = 10;
    const hashedSKU = await bcrypt.hash(sku, saltRounds);

    const product = new Product({
      category: category._id,
      material: material._id,
      image: image._id,
      sku: hashedSKU,
      name,
      price,
      status,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

// PATCH Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!data) {
      return res.status(400).json({ message: "No data provided" });
    }
    const { categoryData, materialData, sku, name, price, status, imageData } =
      data;

    const existingProduct = await Product.findById(id)
      .populate("category")
      .populate("material")
      .populate("image");
    const { category, material, image } = existingProduct;

    const updatedCategory = await Category.findByIdAndUpdate(
      category._id,
      categoryData,
      { new: true }
    );
    const updatedMaterial = await Material.findByIdAndUpdate(
      material._id,
      materialData,
      { new: true }
    );
    const updatedMedia = await ProductMedia.findByIdAndUpdate(
      image._id,
      imageData,
      { new: true }
    );

    const updatedData = {
      category: updatedCategory,
      material: updatedMaterial,
      sku,
      name,
      price,
      status,
      image: updatedMedia,
    };
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: "Please provide the product ID to delete" });
  }

  try {
    const product = await Product.findById(id);
    console.log(product);
    const { category, material, image } = product;
    await Category.findByIdAndDelete(category);
    await Material.findByIdAndDelete(material);
    await ProductMedia.findByIdAndDelete(image);
    await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product Deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error occurred while deleting product: ${error}` });
  }
};
