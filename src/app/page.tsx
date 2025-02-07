"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  const handleAdminClick = () => {
    // Navigate to the admin page when the button is clicked
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Main Title */}
      <h1 className="text-5xl font-bold text-gray-800">Hekto</h1>
      
      {/* Tagline */}
      <h2 className="text-2xl mt-4 text-gray-600">
        Building the Future of Furniture Shopping
      </h2>
      
      {/* Description Paragraph */}
      <p className="mt-4 max-w-xl text-center text-gray-500">
        Welcome to Hekto, your one-stop destination for modern and stylish furniture.
        Our curated collection is designed to bring comfort, quality, and elegance to your home.
        Explore our range of premium pieces and discover how we are shaping the future of furniture shopping.
      </p>
      
      {/* Button to go to Admin Page */}
     <Link href="/admin">
     <button
        onClick={handleAdminClick}
        className="mt-8 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
      >
        Admin Page
      </button>
     </Link>
    </div>
  );
}
