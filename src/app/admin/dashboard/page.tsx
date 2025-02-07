"use client"

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { 
  FiDollarSign, FiShoppingCart, FiUsers, FiAlertCircle,
  FiTrendingUp, FiBox, FiPlus, FiActivity, FiLogOut
} from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import { client } from "@/sanity/lib/client";
import { RiExchangeDollarLine } from "react-icons/ri";
import { TbCalendarDollar } from "react-icons/tb";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import { FaSackDollar } from "react-icons/fa6";
import { keyframes } from "@emotion/react";
import {motion } from "framer-motion"
import Image from "next/image";

const activityVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};


const actions = [
  { id: 1, label: "New Transaction", icon: FiPlus, bg: "bg-purple-600", border: "border-purple-700", text: "text-white" },
  { id: 2, label: "Manage Inventory", icon: FiBox, bg: "bg-white", border: "border-blue-600", text: "text-blue-600" },
  { id: 3, label: "View Customers", icon: FiUsers, bg: "bg-white", border: "border-green-600", text: "text-green-600" },
  { id: 4, label: "View Alerts", icon: FiAlertCircle, bg: "bg-white", border: "border-red-600", text: "text-red-600" },
];

// Define TypeScript interfaces
interface Order {
  _id: string;
  status: string;
  total: number;
  // Add other order fields as needed
}

interface Product {
  _id: string;
  stock: number;
  // Add other product fields as needed
}

const Dashboard = () => {
  const [metrics] = useState({
    totalSales: 152890,
    totalOrders: 1234,
    totalCustomers: 892,
    lowStockItems: 15,
    totalIncome: 12000,
    totalExpenses: 8000,
    totalSavings: 4000
  });

  const [activities] = useState([
    { id: 1, type: 'sale', customer: "Emma Wilson", amount: 245.99, status: "Completed", date: "2025-02-07" },
    { id: 2, type: 'expense', description: "Server Costs", amount: -2000, date: "2025-02-06" },
    { id: 3, type: 'order', customer: "James Miller", items: 1, status: "Processing", date: "2025-02-05" }
  ]);

  const financialData = [
    { name: "Income", value: metrics.totalIncome, color: "#10B981" },
    { name: "Expenses", value: metrics.totalExpenses, color: "#EF4444" },
    { name: "Savings", value: metrics.totalSavings, color: "#3B82F6" }
  ];

  const salesData = [
    { name: "Electronics", value: 45000, color: "#4caf50" },
    { name: "Clothing", value: 35000, color: "#ff7043" },
    { name: "Accessories", value: 25000, color: "#64b5f6" }
  ];

  const getActivityIcon = (type: string) => {
    const icons = {
      sale: <FiTrendingUp className="text-green-500" />,
      expense: <FiTrendingUp className="text-red-500 transform rotate-180" />,
      order: <FiShoppingCart className="text-blue-500" />
    };
    return icons[type as keyof typeof icons] || <FiActivity />;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Sanity
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersQuery = '*[_type == "order"]';
        const ordersData = await client.fetch<Order[]>(ordersQuery);
        
        // Fetch products
        const productsQuery = '*[_type == "productData"]';
        const productsData = await client.fetch<Product[]>(productsQuery);

        setOrders(ordersData);
        setProducts(productsData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await client.fetch(
          `*[_type == "order"]{ totalPrice }` // Fetching only amount from Sanity
        );

        // Calculate Total Revenue
        const revenue = orders.reduce((acc:number, order: any) => acc + order.totalPrice, 0);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
  // Calculate metrics
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockItems = products.filter(product => product.stock < 5).length; // Assuming low stock is <5
  const pendingOrders = orders.filter(order => order.status === 'pending').length;


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-50 font-serif">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Navigation */}
        <nav className="bg-pink-600 text-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Slide direction="left" delay={100} triggerOnce>
        
        <h1 className="text-2xl font-bold inline-flex gap-1">
        <FiActivity className="w-8 h-8 mr-2 text-white" />
          Hekto Dashboard</h1>
        </Slide>
        
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2">
          <span className="hidden md:inline font-bold">Areeba Bano</span>
          <Image 
            src="/admin.jpg" 
            width={32} 
            height={32} 
            className="rounded-full" 
            alt="Profile" 
          />
        </button>
        <FiLogOut size={20} className="cursor-pointer hover:text-red-600 font-semibold" />
      </div>
    </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {[
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <FiShoppingCart className="w-12 h-12 text-purple-600" />,
      border: "hover:border-purple-500",
      bg: "bg-purple-100",
      textColor: "text-purple-600",
      subtext: `${pendingOrders} pending orders`,
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: <FiBox className="w-12 h-12 text-blue-600" />,
      border: "hover:border-blue-500",
      bg: "bg-blue-100",
      textColor: "text-blue-600",
      subtext: "+8.2% from last month",
    },
    {
      title: "Low Stock Items",
      value: lowStockItems,
      icon: <FiAlertCircle className="w-12 h-12 text-red-600" />,
      border: "hover:border-red-500",
      bg: "bg-red-100",
      textColor: "text-red-600",
      subtext: "Requires attention",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: <FaSackDollar className="w-12 h-12 text-green-700" />,
      border: "hover:border-green-500",
      bg: "bg-green-100",
      textColor: "text-green-600",
      subtext: (
        <>
         -Last updated: Just now
        </>
      ),
    },
  ].map((card, index) => (
    <Fade direction="up" triggerOnce key={index}>
      <div
        className={`bg-white p-6 rounded-xl shadow-md border-2 border-transparent ${card.border} transition duration-300 flex flex-col items-center text-center justify-between h-[220px]`}
      >
        {/* Icon inside a colored box */}
        <div className={`${card.bg} p-4 rounded-xl flex items-center justify-center`}>
          {card.icon}
        </div>

        {/* Title and Value */}
        <div>
          <p className="text-md font-semibold text-gray-600">{card.title}</p>
          <p className="text-3xl font-bold mt-1">{card.value}</p>
        </div>

        {/* Subtext */}
        <div className={`text-sm ${card.textColor} flex items-center`}>
          {card.subtext}
        </div>
      </div>
    </Fade>
  ))}
</div>


<div className="relative overflow-hidden h-[500px] flex flex-col gap-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {/* Financial Overview Chart */}
    <Zoom triggerOnce>
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg border-2 border-transparent hover:scale-105 transition duration-500"
        whileHover={{ scale: 1.1 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">Financial Overview</h3>
        
        <motion.div
          className="h-64 flex justify-center items-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={financialData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={5}
                strokeWidth={2}
              >
                {financialData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Labels Below the Chart */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {financialData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm ">{entry.name}: ${entry.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Zoom>

    {/* Sales Distribution Chart */}
    <Zoom triggerOnce>
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg border-2 border-transparent hover:scale-105 transition duration-500"
        whileHover={{ scale: 1.1 }}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">Sales Distribution</h3>
        
        <motion.div
          className="h-64 flex justify-center items-center"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={5}
                strokeWidth={2}
              >
                {salesData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Labels Below the Chart */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {salesData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm">{entry.name}: ${entry.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </Zoom>
  </div>
</div>

          {/* Recent Activities */}
          <motion.div 
  className="bg-white rounded-xl shadow-sm p-6"
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* Heading */}
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold">Recent Activities</h3>
    <motion.button
      className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg flex items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FiPlus className="mr-2" /> Add New
    </motion.button>
  </div>

  {/* Activity List */}
  <div className="space-y-4">
    {activities.map((activity, index) => (
      <motion.div
        key={activity.id}
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg"
        variants={activityVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      >
        {/* Activity Details */}
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <p className="font-serif">
              {activity.type === "order" ? `Order #${activity.id}` : activity.description || `Sale to ${activity.customer}`}
            </p>
            <p className="text-sm text-gray-500">{activity.date}</p>
          </div>
        </div>

        {/* Amount & Status */}
        <div className={`font-semibold ${
          activity.amount! < 0 ? "text-red-500" : "text-green-500"
        }`}>
          {activity.amount && `${activity.amount < 0 ? "-" : "+"}$${Math.abs(activity.amount)}`}
          {activity.status && (
            <span className={`ml-4 px-2 py-1 rounded-full text-sm ${
              activity.status === "Completed" ? "bg-green-100 text-green-600" :
              activity.status === "Processing" ? "bg-yellow-100 text-yellow-600" : ""
            }`}>
              {activity.status}
            </span>
          )}
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>;

          {/* Quick Actions */}
        

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
      {actions.map(({ id, label, icon: Icon, bg, border, text }) => (
        <motion.button
          key={id}
          className={`p-6 rounded-xl flex flex-col items-center justify-center transition ${bg} ${border} border-2 ${text} relative h-24 w-full`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Flip Animation on Hover */}
          <motion.div
            className="w-10 h-10 flex justify-center items-center"
            initial={{ rotateY: 0 }}
            whileHover={{ rotateY: 180, transition: { duration: 0.4 } }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>

          {/* Hide Text on Hover */}
          <motion.span
            className={`text-sm mt-2 transition-opacity`}
            initial={{ opacity: 1 }}
            whileHover={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            {label}
          </motion.span>
        </motion.button>
      ))}
    </div>
        </main>

        


      </div>
      
    </div>
    
  );
};

export default Dashboard;


// "use client"

// import React, { useState, useEffect } from "react";
// import { BiSolidDashboard } from "react-icons/bi";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import Sidebar from "@/components/Sidebar";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const [metrics, setMetrics] = useState({
//     totalSales: 152890,
//     totalOrders: 1234,
//     totalProducts: 892,
//     lowStockItems: 15
//   });

//   const [recentOrders, setRecentOrders] = useState([
//     { id: 1, customer: "Emma Wilson", items: 3, total: 245.99, status: "Processing", date: "2025-02-07" },
//     { id: 2, customer: "James Miller", items: 1, total: 89.99, status: "Shipped", date: "2025-02-07" },
//     { id: 3, customer: "Sarah Brown", items: 2, total: 167.50, status: "Delivered", date: "2025-02-06" }
//   ]);

//   const [userProfile, setUserProfile] = useState({
//     name: "John Doe",
//     avatar: "",
//   });

//   const salesData = [
//     { name: "Electronics", value: 45000, color: "#4caf50" },
//     { name: "Clothing", value: 35000, color: "#ff7043" },
//     { name: "Accessories", value: 25000, color: "#64b5f6" },
//     { name: "Home & Living", value: 15000, color: "#9c27b0" }
//   ];

//   return (
//     <div className="flex h-screen bg-white font-serif">
//       <Sidebar />

//       <div className="flex-1 flex flex-col ml-64">
//         <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between items-center">
//           <div className="flex items-center">
//             <BiSolidDashboard className="w-6 h-6 mr-2" />
//             <h2 className="text-2xl font-bold">E-commerce Dashboard</h2>
//           </div>
//           <div className="flex items-center">
//             <span className="mr-4 text-white">{userProfile.name}</span>
//             <img
//               src={userProfile.avatar || "/default-avatar.png"}
//               alt="Profile"
//               className="w-8 h-8 rounded-full mr-2"
//             />
//             <FaSignOutAlt className="cursor-pointer" onClick={() => alert("Logged out!")} />
//           </div>
//         </nav>

//         <div className="pt-16 p-6 bg-gray-50 rounded-lg shadow-lg flex-1">
//           {/* Metrics Section */}
//           <section className="metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Total Sales</h3>
//               <p className="text-3xl font-bold">${metrics.totalSales.toLocaleString()}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Total Orders</h3>
//               <p className="text-3xl font-bold">{metrics.totalOrders}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Total Products</h3>
//               <p className="text-3xl font-bold">{metrics.totalProducts}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Low Stock Items</h3>
//               <p className="text-3xl font-bold">{metrics.lowStockItems}</p>
//             </div>
//           </section>

//           {/* Sales Overview */}
//           <div className="flex flex-col items-center p-6">
//             <h2 className="text-3xl font-bold mb-6">Sales Overview</h2>

//             <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
//               <h3 className="text-xl font-semibold text-center mb-4">Sales by Category</h3>

//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={salesData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     innerRadius={60}
//                     paddingAngle={5}
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
//                   >
//                     {salesData.map((entry, index) => (
//                       <Cell key={index} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Recent Orders */}
//           <section className="recent-activities mb-8">
//             <h3 className="text-2xl font-semibold mb-4">Recent Orders</h3>
//             <ul className="space-y-4">
//               {recentOrders.map((order) => (
//                 <li key={order.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
//                   <div>
//                     <span className="font-semibold">{order.customer}</span>
//                     <span className="text-gray-500 mx-2">·</span>
//                     <span>{order.items} items</span>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium
//                       ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
//                         order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
//                         'bg-green-100 text-green-800'}`}>
//                       {order.status}
//                     </span>
//                     <span className="text-gray-500">{order.date}</span>
//                     <span className="font-bold">${order.total}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </section>

//           {/* Action Buttons */}
//           <section className="action-buttons flex space-x-4 mb-8">
//             <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
//               Add Product
//             </button>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//               Manage Orders
//             </button>
//             <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
//               View Inventory
//             </button>
//           </section>
//         </div>

//         <footer className="bg-pink-600 text-white p-4 mt-auto text-center">
//           <p>&copy; 2025 Your Company. All rights reserved.</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// "use client"

// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   BarChart3,
//   UserCircle, 
//   LogOut,
//   Plus,
//   Target,
//   Wallet,
//   TrendingUp,
//   TrendingDown,
//   DollarSign
// } from "lucide-react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const [totalIncome, setTotalIncome] = useState(12000);
//   const [totalExpenses, setTotalExpenses] = useState(8000);
//   const [totalSavings, setTotalSavings] = useState(4000);
//   const [recentTransactions, setRecentTransactions] = useState([
//     { id: 1, title: "Salary Deposit", amount: 5000, type: "income", date: "2025-02-07" },
//     { id: 2, title: "Rent Payment", amount: -2000, type: "expense", date: "2025-02-05" },
//     { id: 3, title: "Investment Returns", amount: 1200, type: "income", date: "2025-02-03" }
//   ]);

//   const data = [
//     { name: "Income", value: totalIncome, color: "#10B981" },
//     { name: "Expenses", value: totalExpenses, color: "#EF4444" },
//     { name: "Savings", value: totalSavings, color: "#3B82F6" }
//   ];

//   const getTransactionIcon = (type: any) => {
//     return type === "income" ? (
//       <TrendingUp className="w-4 h-4 text-emerald-500" />
//     ) : (
//       <TrendingDown className="w-4 h-4 text-red-500" />
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation */}
//       <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
//         <div className="px-6 py-3 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <BarChart3 className="w-8 h-8 text-blue-600" />
//             <h1 className="text-2xl font-semibold text-gray-800">Financial Dashboard</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" className="flex items-center space-x-2">
//               <UserCircle className="w-5 h-5" />
//               <span>John Doe</span>
//             </Button>
//             <Button variant="ghost" size="icon">
//               <LogOut className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="pt-20 px-6 pb-8">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Total Income</CardTitle>
//               <Wallet className="w-4 h-4 text-emerald-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">${totalIncome.toLocaleString()}</div>
//               <p className="text-xs text-emerald-500 flex items-center mt-1">
//                 <TrendingUp className="w-4 h-4 mr-1" /> +12% from last month
//               </p>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
//               <DollarSign className="w-4 h-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">${totalExpenses.toLocaleString()}</div>
//               <p className="text-xs text-red-500 flex items-center mt-1">
//                 <TrendingDown className="w-4 h-4 mr-1" /> -8% from last month
//               </p>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Total Savings</CardTitle>
//               <Target className="w-4 h-4 text-blue-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">${totalSavings.toLocaleString()}</div>
//               <p className="text-xs text-blue-500 flex items-center mt-1">
//                 <TrendingUp className="w-4 h-4 mr-1" /> On track to meet goal
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Chart and Transactions Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Chart Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Financial Distribution</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       innerRadius={60}
//                       paddingAngle={5}
//                       labelLine={false}
//                       label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
//                     >
//                       {data.map((entry, index) => (
//                         <Cell key={index} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Transactions */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Recent Transactions</CardTitle>
//               <Button size="sm" className="flex items-center">
//                 <Plus className="w-4 h-4 mr-1" /> Add Transaction
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentTransactions.map((transaction) => (
//                   <div
//                     key={transaction.id}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                   >
//                     <div className="flex items-center space-x-4">
//                       {getTransactionIcon(transaction.type)}
//                       <div>
//                         <p className="font-medium text-gray-800">{transaction.title}</p>
//                         <p className="text-sm text-gray-500">{transaction.date}</p>
//                       </div>
//                     </div>
//                     <span className={`font-semibold ${
//                       transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
//                     }`}>
//                       {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Action Buttons */}
//         <div className="mt-8 flex flex-wrap gap-4">
//           <Button className="bg-blue-600 hover:bg-blue-700">
//             <Plus className="w-4 h-4 mr-2" /> New Transaction
//           </Button>
//           <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
//             <Target className="w-4 h-4 mr-2" /> Set New Goal
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;

// "use client";
// import React, { useState, useEffect } from "react";
// import { BiSolidDashboard } from "react-icons/bi";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import { client } from "@/sanity/lib/client"; // Adjust path for your Sanity client
// import Sidebar from "@/components/Sidebar"; // Import Sidebar Component
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"; // Using recharts for graphs

// const Dashboard = () => {
//   const [totalIncome, setTotalIncome] = useState<number>(0);
//   const [totalExpenses, setTotalExpenses] = useState<number>(0);
//   const [totalSavings, setTotalSavings] = useState<number>(0);
//   const [recentTransactions, setRecentTransactions] = useState<any[]>([]); // Assuming transaction data
//   const [userProfile, setUserProfile] = useState<{ name: string; avatar: string }>({
//     name: "John Doe",
//     avatar: "",
//   });

//   const fetchData = async () => {
//     // Simulated data fetching (replace with actual data fetching logic)
//     setTotalIncome(12000);
//     setTotalExpenses(8000);
//     setTotalSavings(4000);
//   };

//   const data = [
//     { name: "Income", value: totalIncome, color: "#4caf50" }, // Green
//     { name: "Expenses", value: totalExpenses, color: "#ff7043" }, // Orange
//     { name: "Savings", value: totalSavings, color: "#64b5f6" }, // Blue
//   ];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="flex h-screen bg-white font-serif">
//       {/* Sidebar should be outside flex container to be fixed */}
//       <Sidebar />

//       <div className="flex-1 flex flex-col ml-64"> {/* Adding left margin equal to sidebar width */}
//         <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between items-center">
//           <div className="flex items-center">
//             <BiSolidDashboard className="w-6 h-6 mr-2" />
//             <h2 className="text-2xl font-bold">Dashboard</h2>
//           </div>
//           <div className="flex items-center">
//             <span className="mr-4 text-white">{userProfile.name}</span>
//             <img
//               src={userProfile.avatar || "/default-avatar.png"}
//               alt="Profile"
//               className="w-8 h-8 rounded-full mr-2"
//             />
//             <FaSignOutAlt className="cursor-pointer" onClick={() => alert("Logged out!")} />
//           </div>
//         </nav>

//         {/* Add padding-top to account for the fixed navbar */}
//         <div className="pt-16 p-6 bg-gray-50 rounded-lg shadow-lg flex-1">
//           <section className="metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Total Income</h3>
//               <p className="text-3xl font-bold">${totalIncome}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Total Expenses</h3>
//               <p className="text-3xl font-bold">${totalExpenses}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h3 className="text-xl font-semibold">Total Savings</h3>
//               <p className="text-3xl font-bold">${totalSavings}</p>
//             </div>
//           </section>

//           <div className="flex flex-col items-center p-6">
//             <h2 className="text-3xl font-bold mb-6">Financial Overview</h2>

//             <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
//               <h3 className="text-xl font-semibold text-center mb-4">Income vs Expenses</h3>

//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={data}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     innerRadius={60} // For Donut chart effect
//                     paddingAngle={5}
//                     labelLine={false}
//                     label={({ name, value }) => `${name}: $${value}`}
//                   >
//                     {data.map((entry, index) => (
//                       <Cell key={index} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <section className="recent-activities mb-8">
//             <h3 className="text-2xl font-semibold mb-4">Recent Transactions</h3>
//             <ul className="space-y-4">
//               {recentTransactions.map((transaction: any) => (
//                 <li key={transaction._id} className="bg-white p-4 rounded-lg shadow-md">
//                   <span className="font-semibold">{transaction.title}</span> -{" "}
//                   <span>{transaction.date}</span> -{" "}
//                   <span className="font-bold">${transaction.amount}</span>
//                 </li>
//               ))}
//             </ul>
//           </section>

//           <section className="action-buttons flex space-x-4 mb-8">
//             <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
//               Add Transaction
//             </button>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
//               Create Budget
//             </button>
//             <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
//               Set Goals
//             </button>
//           </section>
//         </div>

//         <footer className="bg-pink-600 text-white p-4 mt-auto text-center">
//           <p>&copy; 2025 Your Company. All rights reserved.</p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { client } from '@/sanity/lib/client'; // Adjust path to where you placed the sanity.js file
// import { TbShoppingCartDiscount } from 'react-icons/tb';
// import { Slide } from 'react-awesome-reveal'; // Assuming you have this library installed
// import Sidebar from '@/components/Sidebar'; // Import Sidebar component
// import { BiSolidDashboard } from 'react-icons/bi';

// // Define types for the data you are fetching
// interface Order {
//   _id: string;
//   fullName: string;
//   totalPrice: number;
//   orderDate: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   stockCount: number;
// }

// const Dashboard = () => {
//   // Define state variables to store dashboard data with explicit types
//   const [totalProducts, setTotalProducts] = useState<number>(0);
//   const [totalOrders, setTotalOrders] = useState<number>(0);
//   const [totalRevenue, setTotalRevenue] = useState<number>(0);
//   const [totalCustomers, setTotalCustomers] = useState<number>(0);
//   const [pendingOrders, setPendingOrders] = useState<number>(0);
//   const [completedOrders, setCompletedOrders] = useState<number>(0);
//   const [recentOrders, setRecentOrders] = useState<Order[]>([]); // Explicitly typed
//   const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]); // Explicitly typed

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     // Fetch products count from Sanity
//     const productsQuery = `*[_type == "productData"]`; // Replace "product" with your Sanity document type
//     const products = await client.fetch(productsQuery);
//     setTotalProducts(products.length);

//     // Fetch orders count from Sanity
//     const ordersQuery = `*[_type == "order"]{
//          _id,
//          fullName,
//          totalPrice,
//          orderDate
//     }`; // Replace "order" with your Sanity document type
//     const orders = await client.fetch(ordersQuery);
//     setTotalOrders(orders.length);

//     // Example: Fetch revenue and customers, assuming you have these fields in your documents
//     const revenueQuery = `*[_type == "order"]{totalPrice}`; // Adjust based on your structure
//     const revenueData = await client.fetch(revenueQuery);
//     const revenue = revenueData.reduce((acc: any, order: any) => acc + order.totalPrice, 0);
//     setTotalRevenue(revenue);

//     // Set a static value for customers as an example
//     setTotalCustomers(300); // Replace with actual data if available

//     // Fetch pending and completed orders
//     const pendingOrdersData = await client.fetch('*[_type == "order" && status == "pending"]');
//     setPendingOrders(pendingOrdersData.length);

//     const completedOrdersData = await client.fetch('*[_type == "order" && status == "completed"]');
//     setCompletedOrders(completedOrdersData.length);

//     // Fetch recent orders (last 5)
//     const recentOrdersData = await client.fetch(`*[_type == "order"] | order(date desc)[0..4]`);
//     setRecentOrders(recentOrdersData);

//     // Fetch low stock products (adjust the condition to your needs)
//     const lowStockQuery = '*[_type == "product" && stockCount < 10]';
//     const lowStockData = await client.fetch(lowStockQuery);
//     setLowStockProducts(lowStockData);
//   };

//   return (
//     <div className="flex h-screen bg-white overflow-hidden font-serif">
//       {/* Sidebar (Fixed Left Side) */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Navigation Bar */}
//         <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between">
//           <Slide direction="left" delay={100} triggerOnce>
//             <h2 className="text-2xl font-bold flex items-center">
//               <BiSolidDashboard className="w-6 h-6 mr-2" />
//               Hekto Dashboard
//             </h2>
//           </Slide>
//         </nav>

//         {/* Dashboard Main Content */}
//         <div className="main-dashboard p-6 bg-gray-50 rounded-lg shadow-lg">
          

//           {/* Metrics Cards */}
//           <section className="metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold">Total Products</h2>
//               <p className="text-3xl font-bold">{totalProducts}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold">Total Orders</h2>
//               <p className="text-3xl font-bold">{totalOrders}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold">Total Revenue</h2>
//               <p className="text-3xl font-bold">${totalRevenue}</p>
//             </div>
//             <div className="card bg-white p-6 rounded-lg shadow-md text-center">
//               <h2 className="text-xl font-semibold">Total Customers</h2>
//               <p className="text-3xl font-bold">{totalCustomers}</p>
//             </div>
//           </section>

//           {/* Orders and Revenue Stats */}
//           <section className="order-status mb-8">
//             <h3 className="text-2xl font-semibold mb-4">Order Status Overview</h3>
//             <div className="status-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//               <div className="status-card bg-white p-6 rounded-lg shadow-md text-center">
//                 <p className="text-xl">Pending: {pendingOrders}</p>
//               </div>
//               <div className="status-card bg-white p-6 rounded-lg shadow-md text-center">
//                 <p className="text-xl">Completed: {completedOrders}</p>
//               </div>
//             </div>
//           </section>

//           {/* Recent Activity */}
//           <section className="recent-activity mb-8">
//             <h3 className="text-2xl font-semibold mb-4">Recent Orders</h3>
//             <ul className="space-y-4">
//               {recentOrders.map(order => (
//                 <li key={order._id} className="bg-white p-4 rounded-lg shadow-md">
//                   <span className="font-semibold">{order.fullName}</span> - 
//                   <span>{order.orderDate}</span> - 
//                   <span className="font-bold">${order.totalPrice}</span>
//                 </li>
//               ))}
//             </ul>
//           </section>

//           {/* Low Stock Alerts */}
//           <section className="low-stock-alerts mb-8">
//             <h3 className="text-2xl font-semibold mb-4">Low Stock Alerts</h3>
//             <ul className="space-y-4">
//               {lowStockProducts.map(product => (
//                 <li key={product._id} className="bg-white p-4 rounded-lg shadow-md">
//                   <span className="font-semibold">{product.name}</span> - 
//                   <span className="text-red-500">{product.stockCount} left</span>
//                 </li>
//               ))}
//             </ul>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// "use client"

// import Protected from "@/components/Protected";
// import Sidebar from "@/components/Sidebar";
// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import Swal from "sweetalert2";

// interface Order {
//   _id: string;
//   fullName: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   city: string;
//   country: string;
//   postalCode: string;
//   totalPrice: number;
//   discount: number;
//   orderDate: string;
//   orderStatus: string | null;
//   cartItems: {
//       [x: string]: any; name: string; image: string 
// };
// }

// function Dashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//                 _id,
//                 fullName,
//                 email,
//                 phoneNumber,
//                 address,
//                 city,
//                 country,
//                 postalCode,
//                 totalPrice,
//                 discount,
//                 orderDate,
//                 orderStatus,
//                 cartItems[] -> {
//                  name,
//                  image,
//                 }
            
//             }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error Fetching Products", error));
//   }, []);

//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.orderStatus === filter);

//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderID((prev) => (prev === orderId ? null : orderId));
//   };

//   const handleDelete = async (orderId: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     });
//     if (!result.isConfirmed) return;

//     try {
//       await client.delete(orderId);
//       setOrders((prevOrder) =>
//         prevOrder.filter((order) => order._id !== orderId)
//       );
//       Swal.fire("Deleted", "Your Order has been deleted", "success");
//     } catch (error) {
//       Swal.fire("Error", "Failed to delete order", "error");
//     }
//   };

//   const handleStatusChange = async(orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ status: newStatus }).commit();

//       setOrders((prevOrder) =>
//         prevOrder.map((order) =>
//           order._id === orderId ? { ...order, orderStatus: newStatus } : order
//         )
//       );
//       if (newStatus === "dispatch") {
//         Swal.fire(
//           "Order Dispatched",
//           "Your Order has been dispatched",
//           "success"
//         );
//       } else if (newStatus === "success") {
//         Swal.fire(
//           "Order successfully",
//           "Your Order has been completed",
//           "success"
//         );
//       }
//     } catch (error) {
//       Swal.fire("Error", "Failed to update order status", "error");
//     }
//   };

//   return (
//     <Protected>
//   <div className="flex h-screen bg-gray-100">
//     {/* Sidebar (Fixed Left Side) */}
//     <Sidebar />

//     {/* Main Content */}
//     <div className="flex flex-col flex-1">
//       {/* Navigation Bar */}
//       <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between">
//         <h2 className="text-2xl font-bold">Hekto Admin Dashboard</h2>
//         <div className="flex space-x-4">
//           {["All", "pending", "success", "dispatch"].map((status) => (
//             <button
//               key={status}
//               className={`px-4 py-2 rounded-lg transition-all 
//                   ${filter === status ? "bg-white text-pink-600 font-bold" : "text-white"}
//                   `}
//               onClick={() => setFilter(status)}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Orders Table */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         <h2 className="text-2xl font-bold text-center">Orders</h2>
//         <div className="overflow-y-auto bg-white rounded-lg shadow-lg p-4">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th>Order ID</th>
//                 <th>Customer Name</th>
//                 <th>Address</th>
//                 <th>Date</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-300">
//               {filteredOrders.map((order) => (
//                 <React.Fragment key={order._id}>
//                   <tr
//                     className="cursor-pointer hover:bg-pink-200 transition-all"
//                     onClick={() => toggleOrderDetails(order._id)}
//                   >
//                     <td>{order._id}</td>
//                     <td>{order.fullName}</td>
//                     <td>{order.address}</td>
//                     <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                     <td>${order.totalPrice}</td>
//                     <td>
//                       <select
//                         value={order.orderStatus || ""}
//                         onChange={(e) =>
//                           handleStatusChange(order._id, e.target.value)
//                         }
//                         className="bg-gray-200 p-1 rounded"
//                       >
//                         <option value="pending">Pending</option>
//                         <option value="dispatch">Dispatch</option>
//                         <option value="success">Success</option>
//                       </select>
//                     </td>
//                     <td>
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDelete(order._id);
//                         }}
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                   {selectedOrderID === order._id && (
//                     <tr>
//                       <td colSpan={7} className="bg-gray-100 p-4 transition-all">
//                         <h3 className="text-lg font-bold">Order Details</h3>
//                         <p>
//                           Phone: <strong>{order.phoneNumber}</strong>
//                         </p>
//                         <p>
//                           Email: <strong>{order.email}</strong>
//                         </p>
//                         <p>
//                           City: <strong>{order.city}</strong>
//                         </p>
//                         <ul>
//                           {order.cartItems.map((item: any) => (
//                             <li
//                               className="flex items-center gap-2"
//                               key={`${order._id}`}
//                             >
//                               {item.name}
//                               {item.image && (
//                                 <Image
//                                   src={urlFor(item.image).url()}
//                                   width={100}
//                                   height={100}
//                                   alt={item.name}
//                                 />
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </div>
// </Protected>

//   );
// }

// export default Dashboard;
