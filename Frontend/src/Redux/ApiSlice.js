import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const URL = "http://localhost:8000/";

export const ProductApi = createApi({
  reducerPath: "ProductApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${URL}`,
  }),
  endpoints: (builder) => ({
    getProductsWithPriceRange: builder.query({
      query: () => "api/products",
      providesTags: ["product"],
    }),
    getSingleProduct: builder.query({
      query: (id) => `api/products/${id}`,
      providesTags: ["product"],
    }),
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: "api/Products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `api/products/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: updatedData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `api/products/${id}`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsWithPriceRangeQuery,
  useGetSingleProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = ProductApi;
