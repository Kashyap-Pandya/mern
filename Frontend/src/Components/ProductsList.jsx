import React, { useState, useEffect, useCallback } from "react";
import { useGetProductsWithPriceRangeQuery } from "../Redux/ApiSlice";
import ProductCard from "./ProductCard";
import SortFeature from "./SortFeature";
import PriceRange from "./PriceRange";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [totalCategories, setTotalCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data, isError, isLoading, error } =
    useGetProductsWithPriceRangeQuery();
  const { priceRanges, products: allProducts } = data || {};

  const DefaultUrl =
    "https://img.freepik.com/free-vector/images-concept-illustration_114360-298.jpg?t=st=1724954059~exp=1724957659~hmac=8eb7c8059240ca12e5a01218f2aadd14933f9f6d1512c4c1be92bf0fb6bb7e79&w=740";

  useEffect(() => {
    if (allProducts) {
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // Add "All" option at the beginning of the categories list
      const categories = [
        "All",
        ...new Set(allProducts.map((product) => product.category.name)),
      ];
      setTotalCategories(categories);
    }
  }, [allProducts]);

  const filterProductsByCategory = useCallback(
    (category) => {
      const filtered =
        category === "All"
          ? products
          : products.filter((product) => product.category.name === category);
      setFilteredProducts(filtered);
    },
    [products]
  );

  const filterProductsWithNoMedia = useCallback(() => {
    const filtered = products.filter(
      (product) => product.image.url === DefaultUrl
    );
    setFilteredProducts(filtered);
  }, [products]);

  const sortProductsByPrice = useCallback(() => {
    const sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
    setFilteredProducts(sorted);
  }, [filteredProducts]);

  if (isLoading) {
    return (
      <div className="productlist min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="productlist min-h-screen flex items-center justify-center">
        <h1 className="font-semibold text-xl tracking-wider">
          {error.status} : {error.error}
        </h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="productlist min-h-screen flex items-center justify-center">
        <h1 className="font-semibold text-xl tracking-wider">
          Create At Least One Product
        </h1>
      </div>
    );
  }

  return (
    <div className="productlist">
      <div className="flex items-center justify-center">
        <SortFeature
          categories={totalCategories}
          sortFunc={filterProductsByCategory}
        />
        <button
          className="px-4 py-2 bg-blue-400"
          onClick={filterProductsWithNoMedia}
        >
          Products with No Media
        </button>
      </div>

      <PriceRange priceRanges={priceRanges} />

      <div className="flex items-center justify-center flex-wrap">
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
