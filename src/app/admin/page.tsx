"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageSrc, setImageSrc] = useState("/admin.png");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@example.com" && password === "password123") {
      // Ensure this code runs only on the client side
      if (typeof window !== "undefined") {
        localStorage.setItem("isLoggedIn", "true");
      }
      router.push("/admin/dashboard");
    } else {
      setErrorMessage("Invalid email or password!");
    }
  };

  return (
    // Outer container animation (fade in)
    <motion.div
      className="flex items-center justify-center min-h-screen bg-white px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Card container animation (slide up & fade in) */}
      <motion.div
        className="flex flex-col md:flex-row gap-6 bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Image Container */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={imageSrc}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setImageSrc("/admin2.png")}
              onMouseLeave={() => setImageSrc("/admin1.png")}
            >
              <Image
                src={imageSrc}
                alt="Admin"
                width={350}
                height={350}
                className="rounded-lg shadow-md"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Form Container */}
        <motion.form
          onSubmit={handleAdminLogin}
          className="w-full md:w-1/2 p-6 bg-white rounded-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Header */}
          <motion.h2
            className="flex flex-col text-2xl font-semibold mb-6 text-center text-pink-500"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="flex flex-col text-4xl font-bold text-gray-500">
              Hekto
              <span className="text-sm text-gray-400 mb-2">
                Building the Future of Furniture Shopping
              </span>
            </span>
            <span className="flex items-center justify-center gap-2">
              <FaUser className="text-xl" /> Admin Login
            </span>
          </motion.h2>

          {/* Email Input */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </motion.div>

          {/* Password Input */}
          <motion.div
            className="mb-4 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </motion.div>

          {/* Login Button with hover brightness effect */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md transition duration-300 font-medium flex items-center justify-center gap-2 hover:brightness-110"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            Login <FaSignInAlt className="text-lg" />
          </motion.button>

          {/* Error Message */}
          {errorMessage && (
            <motion.p
              className="text-red-500 text-sm mt-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {errorMessage}
            </motion.p>
          )}
        </motion.form>
      </motion.div>
    </motion.div>
  );
}


// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";
// import { FaUser, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

// export default function Admin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [imageSrc, setImageSrc] = useState("/admin.png");
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   const handleAdminLogin = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (email === "admin@example.com" && password === "password123") {
//       // Yeh check ensure karta hai ki code sirf client side par run ho
//       if (typeof window !== "undefined") {
//         localStorage.setItem("isLoggedIn", "true");
//       }
//       router.push("/admin/dashboard");
//     } else {
//       setErrorMessage("Invalid email or password!");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white px-6">
//       <div className="flex bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
//         <div className="w-1/2 flex items-center justify-center">
//           <Image
//             src={imageSrc}
//             alt="Admin"
//             width={350}
//             height={350}
//             className="rounded-lg shadow-md transition-all duration-500 hover:opacity-80"
//             onMouseEnter={() => setImageSrc("/admin2.png")}
//             onMouseLeave={() => setImageSrc("/admin1.png")}
//           />
//         </div>
//         <form onSubmit={handleAdminLogin} className="w-1/2 p-6 bg-white rounded-lg">
//           <h2 className="flex flex-col text-2xl font-semibold mb-6 text-center text-pink-500">
//             <span className="flex flex-col text-4xl font-bold text-gray-500">
//               Hekto
//               <span className="text-sm text-gray-400 mb-2">
//                 Building the Future of Furniture Shopping
//               </span>
//             </span>
//             <span className="flex items-center justify-center gap-2">
//               <FaUser className="text-xl" /> Admin Login
//             </span>
//           </h2>

//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
//               required
//             />
//           </div>

//           <div className="mb-4 relative">
//             <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md hover:from-purple-600 hover:to-pink-500 transition duration-300 font-medium flex items-center justify-center gap-2"
//           >
//             Login <FaSignInAlt className="text-lg" />
//           </button>

//           {errorMessage && (
//             <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }



