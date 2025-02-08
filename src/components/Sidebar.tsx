"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiSolidDashboard } from "react-icons/bi";
import { FaBox, FaChartBar, FaChartLine, FaChartPie, FaShoppingCart } from "react-icons/fa";
import { RiLogoutCircleLine, RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useState } from "react";
import { Fade } from "react-awesome-reveal";
import Swal from "sweetalert2";
import { TbBrandGoogleAnalytics } from "react-icons/tb";

export default function Sidebar() {
  const router = useRouter(); // Get the router instance to use the push method for navigation
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Function to apply the same gradient to all active links
  const getLinkGradient = (link: string) =>
    pathname === link
      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
      : "hover:bg-gray-200 text-gray-700";

      // Logout Confirmation
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
        router.push("/admin"); // Redirect to /admin after logout
      }
    });
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden fixed top-2 left-4 z-50 p-2 bg-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl"
        onClick={() => setIsOpen(true)}
      >
        <RiMenu3Line className="text-2xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white text-gray-700 flex flex-col p-5 shadow-lg border-r z-50 transform transition-transform duration-300 lg:translate-x-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:block`}
      >
        {/* Close Button for Mobile */}
        <button
          className="lg:hidden absolute right-4 top-2 text-gray-600 text-2xl"
          onClick={() => setIsOpen(false)}
        >
          <RiCloseLine className="text-gray-400 hover:text-pink-500"/>
        </button>

        <Fade cascade duration={500} direction="left">
          {/* Branding */}
          <h1 className="text-3xl font-bold text-pink-500 text-center">Hekto</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Building the Future of Furniture Shopping
          </p>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {[
              { name: "Dashboard", icon: <FaChartBar />, link: "/admin/dashboard" },
              { name: "Orders", icon: <FaShoppingCart />, link: "/admin/orders" },
              { name: "Products", icon: <FaBox />, link: "/admin/products" }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${getLinkGradient(item.link)}`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon} {item.name}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              className="flex items-center gap-3 p-3 rounded-md transition-all duration-300 text-red-600 hover:bg-red-100 mt-auto"
              onClick={handleLogout}
            >
              <RiLogoutCircleLine className="text-lg" /> Logout
            </button>
          </nav>
        </Fade>
      </div>
    </>
  );
}


// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { BiSolidDashboard } from "react-icons/bi";
// import { FaBox, FaShoppingCart } from "react-icons/fa";
// import { RiLogoutCircleLine, RiMenu3Line, RiCloseLine } from "react-icons/ri";
// import { Fade } from "react-awesome-reveal";

// export default function Sidebar() {
//   const [active, setActive] = useState("Dashboard");
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       {/* Hamburger Menu Button for Mobile */}
//       <button
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-pink-600 text-white rounded-full shadow-md"
//         onClick={() => setIsOpen(true)}
//       >
//         <RiMenu3Line size={24} />
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 h-screen w-64 bg-white font-serif text-gray-700 flex flex-col p-5 shadow-lg border-r z-50 transition-transform duration-300 lg:translate-x-0 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } lg:block`}
//       >
//         <Fade cascade duration={500} direction="left">
//           {/* Close Button for Mobile */}
//           <button
//             className="lg:hidden absolute top-4 right-4 text-gray-700"
//             onClick={() => setIsOpen(false)}
//           >
//             <RiCloseLine size={24} />
//           </button>

//           {/* Branding */}
//           <h1 className="text-3xl font-bold text-pink-500 text-center">Hekto</h1>
//           <p className="text-sm text-gray-500 mb-6 text-center">
//             Building the Future of Furniture Shopping
//           </p>

//           {/* Navigation */}
//           <nav className="flex flex-col gap-2">
//             {[{ name: "Dashboard", icon: <BiSolidDashboard />, link: "/admin/dashboard" },
//               { name: "Orders", icon: <FaShoppingCart />, link: "/admin/orders" },
//               { name: "Products", icon: <FaBox />, link: "/admin/products" }]
//               .map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.link}
//                   className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
//                     active === item.name
//                       ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
//                       : "hover:bg-purple-100"
//                   }`}
//                   onClick={() => { setActive(item.name); setIsOpen(false); }}
//                 >
//                   {item.icon} {item.name}
//                 </Link>
//               ))}

//             {/* Logout Button */}
//             <button
//               className="flex items-center gap-3 p-3 rounded-md transition-all duration-300 text-red-600 hover:bg-red-100 mt-auto"
//               onClick={() => alert("Logging out...")}
//             >
//               <RiLogoutCircleLine className="text-lg" /> Logout
//             </button>
//           </nav>
//         </Fade>
//       </div>
//     </>
//   );
// }


// "use client";
// import Link from "next/link";
// import { useState } from "react";
// import { FaTachometerAlt, FaBox, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
// import { BiSolidDashboard } from "react-icons/bi";
// import { Fade } from "react-awesome-reveal";
// import { RiLogoutCircleLine } from "react-icons/ri";

// export default function Sidebar() {
//   const [active, setActive] = useState("Dashboard");

//   return (
//     <div className="fixed top-0 left-0 h-screen w-64 bg-white font-serif text-gray-700 flex flex-col p-5 shadow-lg border-r z-50">
//       <Fade cascade duration={500} direction="left">
//         {/* Hekto Branding */}
//         <h1 className="text-3xl font-bold text-pink-500 text-center">
//           Hekto
//         </h1>
//         <p className="text-sm text-gray-500 mb-6 text-center">
//           Building the Future of Furniture Shopping
//         </p>

//         {/* Sidebar Navigation */}
//         <nav className="flex flex-col gap-2">
//           {[
//             { name: "Dashboard", icon: <BiSolidDashboard />, link: "/admin/dashboard" },
//             { name: "Orders", icon: <FaShoppingCart />, link: "/admin/orders" },
//             { name: "Products", icon: <FaBox />, link: "/admin/products" }
//           ].map((item) => (
//             <Link
//               key={item.name}
//               href={item.link}
//               className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 ${
//                 active === item.name
//                   ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
//                   : "hover:bg-purple-100"
//               }`}
//               onClick={() => setActive(item.name)}
//             >
//               {item.icon} {item.name}
//             </Link>
//           ))}

//           {/* Logout Button */}
//           <button
//             className="flex items-center gap-3 p-3 rounded-md transition-all duration-300 text-red-600 hover:bg-red-100 mt-auto"
//             onClick={() => alert("Logging out...")}
//           >
//             <RiLogoutCircleLine className="text-lg" /> Logout
//           </button>
//         </nav>
//       </Fade>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   ShoppingCart,
//   Package,
//   Users,
//   DollarSign,
//   TrendingUp,
//   Box,
//   AlertCircle,
//   Search,
//   BarChart3,
//   UserCircle,
//   LogOut,
//   ArrowUpRight,
//   ArrowDownRight
// } from "lucide-react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// const Dashboard = () => {
//   const [metrics, setMetrics] = useState({
//     totalSales: 152890,
//     totalOrders: 1234,
//     totalCustomers: 892,
//     lowStockItems: 15,
//     averageOrderValue: 124,
//     pendingOrders: 23
//   });

//   const [recentOrders, setRecentOrders] = useState([
//     { id: 1, customer: "Emma Wilson", items: 3, total: 245.99, status: "Processing", date: "2025-02-07" },
//     { id: 2, customer: "James Miller", items: 1, total: 89.99, status: "Shipped", date: "2025-02-07" },
//     { id: 3, customer: "Sarah Brown", items: 2, total: 167.50, status: "Delivered", date: "2025-02-06" }
//   ]);

//   const salesData = [
//     { name: "Electronics", value: 45000, color: "#3B82F6" },
//     { name: "Clothing", value: 35000, color: "#10B981" },
//     { name: "Accessories", value: 25000, color: "#F59E0B" },
//     { name: "Home & Living", value: 15000, color: "#6366F1" }
//   ];

//   const getStatusColor = (status) => {
//     const colors = {
//       Processing: "bg-yellow-100 text-yellow-800",
//       Shipped: "bg-blue-100 text-blue-800",
//       Delivered: "bg-green-100 text-green-800"
//     };
//     return colors[status] || "bg-gray-100 text-gray-800";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Top Navigation */}
//       <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
//         <div className="px-6 py-3 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <BarChart3 className="w-8 h-8 text-blue-600" />
//             <h1 className="text-2xl font-semibold text-gray-800">E-commerce Dashboard</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" className="flex items-center space-x-2">
//               <UserCircle className="w-5 h-5" />
//               <span>Admin</span>
//             </Button>
//             <Button variant="ghost" size="icon">
//               <LogOut className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="pt-20 px-6 pb-8">
//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
//               <DollarSign className="w-4 h-4 text-blue-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">
//                 ${metrics.totalSales.toLocaleString()}
//               </div>
//               <p className="text-xs text-emerald-500 flex items-center mt-1">
//                 <TrendingUp className="w-4 h-4 mr-1" /> +15% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
//               <ShoppingCart className="w-4 h-4 text-emerald-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">
//                 {metrics.totalOrders.toLocaleString()}
//               </div>
//               <p className="text-xs text-emerald-500 flex items-center mt-1">
//                 <ArrowUpRight className="w-4 h-4 mr-1" /> {metrics.pendingOrders} pending orders
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
//               <Users className="w-4 h-4 text-indigo-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">
//                 {metrics.totalCustomers.toLocaleString()}
//               </div>
//               <p className="text-xs text-emerald-500 flex items-center mt-1">
//                 <TrendingUp className="w-4 h-4 mr-1" /> +8% new customers
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Average Order Value</CardTitle>
//               <Package className="w-4 h-4 text-purple-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">
//                 ${metrics.averageOrderValue.toLocaleString()}
//               </div>
//               <p className="text-xs text-red-500 flex items-center mt-1">
//                 <ArrowDownRight className="w-4 h-4 mr-1" /> -2% from last month
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium text-gray-500">Low Stock Alert</CardTitle>
//               <AlertCircle className="w-4 h-4 text-red-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-gray-800">
//                 {metrics.lowStockItems} items
//               </div>
//               <p className="text-xs text-red-500 flex items-center mt-1">
//                 Requires immediate attention
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sales by Category & Recent Orders */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Sales by Category */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Sales by Category</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={salesData}
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
//                       {salesData.map((entry, index) => (
//                         <Cell key={index} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Orders */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Recent Orders</CardTitle>
//               <Button variant="outline" size="sm">
//                 View All
//               </Button>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentOrders.map((order) => (
//                   <div
//                     key={order.id}
//                     className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
//                   >
//                     <div className="flex flex-col">
//                       <span className="font-medium text-gray-800">{order.customer}</span>
//                       <span className="text-sm text-gray-500">{order.items} items · ${order.total}</span>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
//                         {order.status}
//                       </span>
//                       <span className="text-sm text-gray-500">{order.date}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="mt-8 flex flex-wrap gap-4">
//           <Button className="bg-blue-600 hover:bg-blue-700">
//             <Package className="w-4 h-4 mr-2" /> Add New Product
//           </Button>
//           <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
//             <Box className="w-4 h-4 mr-2" /> Manage Inventory
//           </Button>
//           <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
//             <Search className="w-4 h-4 mr-2" /> View All Orders
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
    //   {/* Total Orders Card */}
    //   <Fade direction="up" triggerOnce>
    //     <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-purple-500 transition duration-300">
    //       <div className="flex justify-between items-center">
    //         <div>
    //           <p className="text-sm text-gray-500 mb-1">Total Orders</p>
    //           <p className="text-2xl font-bold">{totalOrders}</p>
    //         </div>
    //         <div className="bg-purple-100 p-3 rounded-lg">
    //           <FiShoppingCart className="w-6 h-6 text-purple-600" />
    //         </div>
    //       </div>
    //       <div className="mt-2 flex items-center text-sm text-red-500">
    //         {pendingOrders} pending orders
    //       </div>
    //     </div>
    //   </Fade>

    //   {/* Total Products Card */}
    //   <Fade direction="up" triggerOnce>
    //     <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-blue-500 transition duration-300">
    //       <div className="flex justify-between items-center">
    //         <div>
    //           <p className="text-sm text-gray-500 mb-1">Total Products</p>
    //           <p className="text-2xl font-bold">{totalProducts}</p>
    //         </div>
    //         <div className="bg-blue-100 p-3 rounded-lg">
    //           <FiBox className="w-6 h-6 text-blue-600" />
    //         </div>
    //       </div>
    //       <div className="mt-2 flex items-center text-sm text-green-500">
    //         <FiTrendingUp className="mr-1" /> +8.2% from last month
    //       </div>
    //     </div>
    //   </Fade>

    //   {/* Low Stock Items Card */}
    //   <Fade direction="up" triggerOnce>
    //     <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-red-500 transition duration-300">
    //       <div className="flex justify-between items-center">
    //         <div>
    //           <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
    //           <p className="text-2xl font-bold">{lowStockItems}</p>
    //         </div>
    //         <div className="bg-red-100 p-3 rounded-lg">
    //           <FiAlertCircle className="w-6 h-6 text-red-600" />
    //         </div>
    //       </div>
    //       <div className="mt-2 text-sm text-red-500">Requires attention</div>
    //     </div>
    //   </Fade>

    //   {/* Total Revenue Card */}
    //   <Fade direction="up" triggerOnce>
    //     <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-transparent hover:border-green-500 transition duration-300">
    //       <div className="flex justify-between items-center">
    //         <div>
    //           <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
    //           <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
    //         </div>
    //         <div className="bg-green-100 p-3 rounded-lg">
    //           <span className="w-6 h-6 text-green-600">💰</span>
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-2 mt-2 text-sm text-blue-500">
    //         <TbCalendarDollar /> Last updated: Just now
    //       </div>
    //     </div>
    //   </Fade>

    // </div>