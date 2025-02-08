"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { 
  FiArrowRight, 
  FiShoppingCart,
  FiGrid,
  FiSettings,
  FiEye,
  FiHeart
} from "react-icons/fi";
import { FaCouch, FaChair, FaLightbulb, FaRegHandPointer } from "react-icons/fa";
import { RiSofaFill } from "react-icons/ri";

export default function HomePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const rotateX = useTransform(cursorY, [0, window.innerHeight], [15, -15]);
  const rotateY = useTransform(cursorX, [0, window.innerWidth], [-15, 15]);

  useEffect(() => {
    const moveCursor = (e: any) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 120 }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="min-h-screen relative overflow-hidden font-serif bg-gradient-to-br from-gray-50 to-gray-100 cursor-none"
      style={{ perspective: 1000 }}
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed w-8 h-8 border-2 border-pink-500 rounded-full pointer-events-none z-50"
        style={{
          x: cursorX,
          y: cursorY,
          rotateX,
          rotateY,
        }}
      />

      {/* Interactive Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-r from-pink-100/50 to-blue-100/50 rounded-lg"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen relative z-10">
        {/* Main Content */}
        <motion.div 
          className="text-center max-w-4xl space-y-8"
          variants={containerVariants}
        >
          {/* 3D Title Effect */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <div className="absolute inset-0 bg-pink-500/10 blur-3xl rounded-full" />
            <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              HEKTO
            </h1>
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            >
              <FiHeart className="text-pink-500 text-4xl" />
            </motion.div>
          </motion.div>

          {/* Interactive Tagline */}
          <motion.h2 
            variants={itemVariants}
            className="text-1xl md:text-3xl font-semibold text-gray-800 flex items-center justify-center gap-3"
          >
            <motion.span 
              className="inline-block"
              whileHover={{ scale: 1.1 }}
            >
              Building the Future of
            </motion.span>
            <motion.div
              className="bg-pink-100 px-4 py-2 rounded-full flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <RiSofaFill className="text-pink-600 animate-pulse" />
              <span className="text-gray-600">Furniture Shopping</span>
            </motion.div>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover furniture that tells your story. Where contemporary design 
            meets timeless comfort in every piece.
          </motion.p>

          {/* Product Showcase Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
            variants={containerVariants}
          >
            {[
              { icon: <FaCouch className="text-5xl text-purple-600 animate-bounce" />, name: "Sofas" },
              { icon: <FaChair className="text-5xl text-green-500 animate-bounce" />, name: "Chairs" },
              { icon: <FaLightbulb className="text-5xl text-pink-600 animate-bounce" />, name: "Lighting" },
              { icon: <FiGrid className="text-5xl text-yellow-400 animate-bounce" />, name: "Collections" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
                whileHover={{ y: -10 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div 
                  className="text-pink-600 mb-4"
                  whileHover={{ scale: 1.2, rotate: -15 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.name}
                </h3>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive CTA */}
          <motion.div variants={itemVariants} className="pt-8">
            <motion.a
              href="/admin"
              className="inline-flex items-center gap-4 mb-8 px-12 py-6 bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-xl font-semibold z-10">
                Explore Dashboard
              </span>
              <motion.div
                className="z-10"
                animate={{ x: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FiArrowRight className="text-2xl" />
              </motion.div>
              
              {/* Particle burst on hover */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: Math.cos((i * 30 * Math.PI) / 180) * 50,
                      y: Math.sin((i * 30 * Math.PI) / 180) * 50,
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 0.6,
                      times: [0, 0.5, 1],
                      repeat: Infinity,
                      delay: i * 0.05
                    }}
                  />
                ))}
              </div>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating Interactive Elements */}
        <motion.div 
          className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 md:gap-6 opacity-50"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {[
            { icon: <FiShoppingCart className="text-blue-700" />, text: "Instant Checkout" },
            { icon: <FiEye className="text-pink-700"/>, text: "3D Preview" },
            { icon: <FiSettings className="text-purple-700"/>, text: "Customize" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-2 py-2 md:px-4 md:py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              {item.icon}
              <span className="text-xs md:text-sm text-gray-600">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Interactive Color Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: `hsl(${Math.random() * 360}deg, 70%, 60%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}