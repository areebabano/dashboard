"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiLogOut } from "react-icons/fi";
import Swal from "sweetalert2";
import {
  FaOpencart,
  FaRegEdit,
  FaDollarSign,
  FaChartLine,
  FaCartPlus,
} from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { Slide } from "react-awesome-reveal";
import Loading from "@/components/Loading";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Enhanced Product Interface
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: any;
  category?: string;
  stock?: number;
}

export default function ProductPage() {
  // State for products and loading/error indicators
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for "Add Product" form
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // States for "Edit Product" form
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const router = useRouter();

  // Add a new product with Swal notification
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const doc = {
        _type: "productData",
        title: newTitle,
        price: parseFloat(newPrice),
        description: newDescription,
      };
      await client.create(doc);
      Swal.fire({
        title: "Added!",
        text: "Product has been added successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setNewTitle("");
      setNewPrice("");
      setNewDescription("");
      fetchProducts();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Error adding product.",
        icon: "error",
      });
    }
  };

  // Delete a product with Swal confirmation
  const handleDeleteProduct = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await client.delete(id);
          fetchProducts();
          Swal.fire({
            title: "Deleted!",
            text: "Your product has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: "Error deleting product.",
            icon: "error",
          });
        }
      }
    });
  };

  // Start editing a product
  const startEditing = (product: Product) => {
    setEditingProduct(product);
    setEditTitle(product.name);
    setEditPrice(product.price.toString());
    setEditDescription(product.description);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProduct(null);
    setEditTitle("");
    setEditPrice("");
    setEditDescription("");
  };

  // Custom toFixed function (similar to Number.prototype.toFixed)
  function customToFixed(num: number, fractionDigits: number): string {
    if (fractionDigits < 0 || fractionDigits > 20)
      throw new RangeError("Fraction digits must be between 0 and 20");
  
    const factor = 10 ** fractionDigits;
    const rounded = Math.round(num * factor);
    let str = rounded.toString();
  
    if (fractionDigits === 0) return str;
  
    while (str.length <= fractionDigits) {
      str = "0" + str;
    }
    
    return str.slice(0, str.length - fractionDigits) + "." + str.slice(-fractionDigits);
  }

  // Update a product with Swal notification
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await client
        .patch(editingProduct._id)
        .set({
          title: editTitle,
          price: parseFloat(editPrice),
          description: editDescription,
        })
        .commit();
      Swal.fire({
        title: "Updated!",
        text: "Product has been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      cancelEditing();
      fetchProducts();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Error updating product.",
        icon: "error",
      });
    }
  };

  // Logout Confirmation using Swal
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/admin");
      }
    });
  };

  // Calculate summary statistics
  const totalProducts = products.length;
  const totalPrice = products.reduce((acc, product) => acc + product.price, 0);
  const averagePrice =
    totalProducts > 0 ? (totalPrice / totalProducts).toFixed(2) : "0.00";

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageAsset, setImageAsset] = useState<any>(null);

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const result = await client.assets.upload("image", file);
      setImageAsset(result);
      Swal.fire({
        icon: "success",
        title: "Image Uploaded!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire("Error", "Failed to upload image", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Enhanced delete animation
  const animatedDelete = async (id: string) => {
    const productElement = document.getElementById(`product-${id}`);
    if (productElement) {
      productElement.style.transform = "translateX(-100%)";
      productElement.style.opacity = "0";
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await handleDeleteProduct(id);
  };

  // Enhanced table row component
  const ProductRow = ({ product }: { product: Product }) => (
    <motion.tr
      id={`product-${product._id}`}
      key={product._id}
      className="border-b hover:bg-gray-50"
      variants={itemVariants}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <td className="px-4 py-2 text-xs font-semibold">{product.name}</td>
      <td className="px-4 py-2 font-bold">${product.price}</td>
      <td className="px-4 py-2 text-xs">{product.description}</td>
      <td className="px-4 py-2">
        {product.image ? (
          <Image
            src={urlFor(product.image).url()}
            alt={product.name}
            width={64}
            height={64}
            className="object-cover rounded"
          />
        ) : (
          "No Image"
        )}
      </td>
      <td className="px-4 py-2">
        <motion.div whileHover={{ scale: 1.05 }} className="flex space-x-2">
          <button
            onClick={() => startEditing(product)}
            className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
          >
            <FaRegEdit className="text-blue-600" />
          </button>
          <button
            onClick={() => animatedDelete(product._id)}
            className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
          >
            <RiDeleteBinLine className="text-red-600" />
          </button>
        </motion.div>
      </td>
    </motion.tr>
  );

  // Fetch products with error handling
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const query = `*[_type == "productData"]{
        _id,
        name,
        price,
        description,
        image,
        category,
        stock
      }`;
      const data: Product[] = await client.fetch(query);
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) return <div><Loading /></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50 font-serif ">
      <Sidebar />

      <div className="w-full max-w-screen-xl mx-auto ml-0 md:ml-64">
        {/* Enhanced Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm p-4 flex justify-between items-center"
        >
          <div className="flex items-center">
            <Slide direction="left" delay={100} triggerOnce>
              <h1 className="ml-12 md:ml-0 text-lg md:text-2xl font-bold inline-flex gap-1">
                <FaOpencart className="w-4 h-4 md:w-8 md:h-8 mr-2 mt-1 md:mt-0 text-white" />
                Hekto Products
              </h1>
            </Slide>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="flex items-center space-x-2">
              <span className="hidden md:inline font-bold">Areeba Bano</span>
              <Image
                src="/admin.jpg"
                width={32}
                height={32}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                alt="Profile"
              />
            </button>
            <FiLogOut
              size={38}
              onClick={handleLogout}
              className="cursor-pointer p-2 rounded-full text-white font-bold hover:text-red-600 hover:bg-white transition-colors duration-300"
            />
          </div>
        </motion.nav>

        {/* Overview Cards */}
<motion.div
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6 px-10 sm:px-6"
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
  {/* Total Products Card */}
  <motion.div
    variants={itemVariants}
    className="bg-white shadow-lg rounded-xl p-4 mt-4 border-2 border-gray-300 hover:border-yellow-500 transition duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex flex-col space-y-2 items-center justify-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-50 rounded-full flex items-center justify-center">
        <FaCartPlus size={40} className="text-yellow-400" />
      </div>
      <h3 className="text-gray-500 text-base sm:text-lg">Total Products</h3>
      <p className="text-3xl font-bold mt-2">{totalProducts}</p>
    </div>
  </motion.div>

  {/* Average Price Card */}
  <motion.div
    variants={itemVariants}
    className="bg-white shadow-lg rounded-xl p-4 mt-4 border-2 border-gray-300 hover:border-green-600 transition duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex flex-col space-y-2 items-center justify-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
        <FaDollarSign size={40} className="text-green-600" />
      </div>
      <h3 className="text-gray-500 text-base sm:text-lg">Average Price</h3>
      <p className="text-md font-bold mt-2">${averagePrice}</p>
    </div>
  </motion.div>

  {/* Total Inventory Value Card */}
  <motion.div
    variants={itemVariants}
    className="bg-white shadow-lg rounded-xl p-4 mt-4 border-2 border-gray-300 hover:border-blue-600 transition duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex flex-col space-y-2 items-center justify-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
        <FaChartLine size={40} className="text-blue-600" />
      </div>
      <h3 className="text-gray-500 text-base sm:text-lg">Total Inventory Value</h3>
      <p className="text-md font-bold mt-2">
        ${customToFixed(totalPrice, 2)}
      </p>
    </div>
  </motion.div>
</motion.div>


        {/* Product Form (Add/Edit) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-6"
        >
          {editingProduct ? (
            <>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-purple-600 w-2 h-8 rounded-full"></span>
                Edit Product
              </h2>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-pink-600 w-2 h-8 rounded-full"></span>
                Add New Product
              </h2>
              {/* Image Upload Section */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Product Image
                </label>
                <motion.label
                  whileHover={{ scale: 1.05 }}
                  className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition"
                >
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  {uploadingImage ? (
                    <div className="animate-pulse">Uploading...</div>
                  ) : imageAsset ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={urlFor(imageAsset).url()}
                        alt="Uploaded"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-gray-400 mb-1 hover:text-pink-600">
                        Click to upload image
                      </div>
                      <div className="text-xs text-gray-400 hover:text-pink-600">
                        Recommended size: 800x800px
                      </div>
                    </div>
                  )}
                </motion.label>
              </div>
              {/* Add Product Form */}
              <div className="bg-white p-6 rounded shadow mb-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
                  >
                    Add Product
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto"
        >
          <AnimatePresence>
            {isLoading ? (
              <div className="p-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-12 bg-gray-100 rounded mb-2 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                  <tr>
                    {["Name", "Price", "Description", "Image", "Actions"].map(
                      (header, i) => (
                        <motion.th
                          key={header}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="px-4 py-2 text-left text-xs md:text-sm"
                        >
                          {header}
                        </motion.th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {products.map((product) => (
                      <ProductRow key={product._id} product={product} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
