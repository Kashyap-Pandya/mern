import React from "react";
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../Redux/ApiSlice";
import { useToast } from "@chakra-ui/react";

const formSchema = z.object({
  status: z.enum(["Available", "Out of Stock", "Discontinued"], {
    message: "Please provide status",
  }),
  sku: z.string().min(20, "SKU is required"),
  name: z.string().min(3, "Name is required"),
  price: z.number().min(1, "Price is required"),
  imageData: z.object({
    url: z.string(),
  }),
  categoryData: z.object({
    name: z.string().min(1, "Category name is required"),
  }),
  materialData: z.object({
    name: z.string().min(1, "Material name is required"),
  }),
});

function Form({ isFormVisible, controlFormVisibility, data }) {
  const { category, material, name, sku, price, status, image, _id } =
    data || {};
  const { name: categoryName } = category || {};
  const { name: materialName } = material || {};
  const { url } = image || {};

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      status: status || "Available",
      sku: sku || "",
      name: name || "",
      price: price || "",
      imageData: {
        url:
          url ||
          "https://img.freepik.com/free-vector/images-concept-illustration_114360-298.jpg?t=st=1724954059~exp=1724957659~hmac=8eb7c8059240ca12e5a01218f2aadd14933f9f6d1512c4c1be92bf0fb6bb7e79&w=740",
      },
      categoryData: {
        name: categoryName || "",
      },
      materialData: {
        name: materialName || "",
      },
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const toast = useToast();

  const onFormSubmit = async (formData) => {
    console.log("Form submitted with data:");
    try {
      if (_id) {
        try {
          console.log("updating the product");
          await updateProduct({ id: _id, ...formData }).unwrap();
          toast({
            title: "Product edited successfully.",
            description: "We've edited your Product for you.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to edit Product",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      } else {
        await addProduct(formData).unwrap();
        reset();
        toast({
          title: "Product created successfully.",
          description: "We've created your Product for you.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
      controlFormVisibility(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create Product",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className={`p-4 m-4 z-50  absolute top-8 left-8 bg-gray-300 w-fit ${
          isFormVisible === "true" ? "blur-none" : ""
        } `}
      >
        {/* status */}
        <div className="mb-2">
          <label className="label">Status</label>
          <select
            {...register("status")}
            className="w-fit px-3 py-2 border rounded-md"
          >
            <option value=""></option>
            <option value="Available">Available</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Discontinued">Discontinued</option>
          </select>
          {errors?.status && (
            <p className="text-red-500">{errors.status.message}</p>
          )}
        </div>
        {/* sku */}
        {!data?.sku && (
          <div className="mb-2">
            <label className="label">SKU</label>
            <input
              disabled={!!data}
              {...register("sku")}
              className={`input ${
                data ? "cursor-not-allowed" : "cursor-pointer"
              } `}
            />
            {errors?.sku && (
              <p className="text-red-500">{errors.sku.message}</p>
            )}
          </div>
        )}
        {/* name */}
        <div className="mb-2">
          <label className="label">Name</label>
          <input {...register("name")} className="input" />
          {errors?.name && (
            <p className="text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* category */}
        <div className="mb-2">
          <label className="label">Category</label>
          <input {...register("categoryData.name")} className="input" />
          {errors.categoryData?.name && (
            <p className="text-red-500">{errors.categoryData.name.message}</p>
          )}
        </div>

        {/* material */}
        <div className="mb-2">
          <label className="label">Material</label>
          <input {...register("materialData.name")} className="input" />
          {errors.materialData?.name && (
            <p className="text-red-500">{errors.materialData.name.message}</p>
          )}
        </div>

        {/* price */}
        <div className="mb-2">
          <label className="label">Price</label>
          <input
            {...register("price", { valueAsNumber: true })}
            className="input"
          />
          {errors?.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* image */}
        <div className="mb-2">
          <label className="label">Image</label>
          <input {...register("imageData.url")} className="input" />
          {/* {errors.imageData?.url && (
            <p className="text-red-500">{errors.imageData.url.message}</p>
          )} */}
        </div>
        <div className="form-actions">
          <button
            onClick={() => controlFormVisibility(false)}
            className="bg-red-400 px-4 py-2 m-4 tracking-wider font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-400 px-4 py-2 m-4 tracking-wider font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
