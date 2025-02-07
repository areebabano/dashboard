"use client";

import Protected from "@/components/Protected";
import Sidebar from "@/components/Sidebar";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import React, { useEffect, useState } from "react";
import { Slide } from "react-awesome-reveal";
import { FaTimes } from "react-icons/fa"; // Close icon for mobile sidebar
import { RiDeleteBinLine } from "react-icons/ri";
import { TbShoppingCartDiscount } from "react-icons/tb";
import { FiMenu } from "react-icons/fi"; // Hamburger icon for mobile
import Swal from "sweetalert2";

interface Order {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  totalPrice: number;
  discount: number;
  orderDate: string;
  orderStatus: string | null;
  cartItems: {
    name: string;
    image: any;
  }[];
}

function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          fullName,
          email,
          phoneNumber,
          address,
          city,
          country,
          postalCode,
          totalPrice,
          discount,
          orderDate,
          orderStatus,
          cartItems[] -> { name, image }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error Fetching Orders", error));
  }, []);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  const handleOrderDetails = (order: Order) => {
    Swal.fire({
      title: `Order Details for ${order.fullName}`,
      html: `
        <p><strong>Phone:</strong> ${order.phoneNumber}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>City:</strong> ${order.city}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Country:</strong> ${order.country}</p>
        <p><strong>Postal Code:</strong> ${order.postalCode}</p>
        <p><strong>Total Price:</strong> $${order.totalPrice}</p>
        <p><strong>Discount:</strong> $${order.discount}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.orderDate
        ).toLocaleDateString()}</p>
        <div>
          <strong>Cart Items:</strong>
          <ul>
            ${order.cartItems
              .map(
                (item) => `
              <li class="flex items-center gap-2 my-1">
                <span>${item.name}</span>
                ${
                  item.image
                    ? `<img src="${urlFor(item.image).url()}" width="80" height="80" />`
                    : ""
                }
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonText: "Ok",
      width: "90%", // Use 90% width on mobile
      didOpen: () => {
        const swalModal = document.querySelector(".swal2-modal") as HTMLElement;
        if (swalModal) {
          swalModal.style.maxHeight = "350px";
          swalModal.style.overflowY = "auto";
        }
      },
    });
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (!result.isConfirmed) return;
    try {
      await client.delete(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted", "Your Order has been deleted", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    orderId: string
  ) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (newStatus === "") return;
    try {
      await client.patch(orderId).set({ orderStatus: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      Swal.fire({
        title:
          newStatus.charAt(0).toUpperCase() + newStatus.slice(1) + " Order",
        text: `The order has been updated to ${newStatus}.`,
        icon: "success",
      });
    } catch (error) {
      Swal.fire("Error", "Failed to update order status", "error");
    }
  };

  const handleRowClick = (order: Order, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== "SELECT") {
      handleOrderDetails(order);
    }
  };

  return (
    <Protected>
      <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden font-serif">
        <Sidebar/>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navigation Bar */}
          <nav className="bg-pink-600 text-white p-4 shadow-lg flex items-center justify-between">
            
              <Slide direction="left" delay={100} triggerOnce>
                <h2 className="ml-12 md:ml-64 text-2xl font-bold flex items-center">
                  <TbShoppingCartDiscount className="w-6 h-6 mr-2" />
                  Hekto Orders
                </h2>
              </Slide>
            {/* </div> */}
            
          </nav>
          <div>
  <div className="flex justify-center space-x-2 md:space-x-4 md:text-2xl md:ml-44">
    {["All", "pending", "success", "dispatch"].map((status) => (
      <button
        key={status}
        onClick={() => setFilter(status)}
        className={`px-3 py-2 transition duration-300 rounded-full
          ${
            filter === status
              ? "bg-white text-pink-600 font-bold "
              : "text-gray-400 hover:bg-white hover:text-pink-600 font-bold"
          }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    ))}
  </div>
</div>


          {/* Orders Table */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm border-collapse">
                <thead className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  <tr className="text-center">
                    <th className="py-3 px-2 uppercase">Order ID</th>
                    <th className="py-3 px-2 uppercase">Customer Name</th>
                    <th className="py-3 px-2 uppercase">Address</th>
                    <th className="py-3 px-2 uppercase">Date</th>
                    <th className="py-3 px-2 uppercase">Total</th>
                    <th className="py-3 px-2 uppercase">Status</th>
                    <th className="py-3 px-2 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={(e) => handleRowClick(order, e)}
                      className="cursor-pointer hover:bg-gray-100 text-gray-700 text-center transition-colors"
                    >
                      <td className="py-3 px-2">{order._id}</td>
                      <td className="py-3 px-2">{order.fullName}</td>
                      <td className="py-3 px-2">{order.address}</td>
                      <td className="py-3 px-2">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">${order.totalPrice}</td>
                      <td className="py-3 px-2">
                        <select
                          value={order.orderStatus || ""}
                          onChange={(e) => handleStatusChange(e, order._id)}
                          className="bg-white text-gray-800 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Success</option>
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="inline-flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete <RiDeleteBinLine />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        table {
          width: 100%;
        }
        th,
        td {
          text-align: left;
        }
      `}</style>
    </Protected>
  );
}

export default Dashboard;


// "use client";

// import Protected from "@/components/Protected";
// import Sidebar from "@/components/Sidebar";
// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { Slide } from "react-awesome-reveal";
// import { FaDeleteLeft } from "react-icons/fa6";
// import { RiDeleteBinLine } from "react-icons/ri";
// import { TbShoppingCartDiscount } from "react-icons/tb";
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
//     [x: string]: any;
//     name: string;
//     image: string;
//   };
// }

// function Dashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           fullName,
//           email,
//           phoneNumber,
//           address,
//           city,
//           country,
//           postalCode,
//           totalPrice,
//           discount,
//           orderDate,
//           orderStatus,
//           cartItems[] -> { name, image }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error Fetching Orders", error));
//   }, []);

//   const filteredOrders =
//     filter === "All"
//       ? orders
//       : orders.filter((order) => order.orderStatus === filter);

//   const handleOrderDetails = (order: Order) => {
//     Swal.fire({
//       title: `Order Details for ${order.fullName}`,
//       html: `
//         <p><strong>Phone:</strong> ${order.phoneNumber}</p>
//         <p><strong>Email:</strong> ${order.email}</p>
//         <p><strong>City:</strong> ${order.city}</p>
//         <p><strong>Address:</strong> ${order.address}</p>
//         <p><strong>Country:</strong> ${order.country}</p>
//         <p><strong>Postal Code:</strong> ${order.postalCode}</p>
//         <p><strong>Total Price:</strong> $${order.totalPrice}</p>
//         <p><strong>Discount:</strong> $${order.discount}</p>
//         <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
//         <div>
//           <strong>Cart Items:</strong>
//           <ul>
//             ${order.cartItems
//               .map(
//                 (item: any) => `
//                 <li>
//                   <span>${item.name}</span>
//                   ${item.image ? `<img src="${urlFor(item.image).url()}" width="80" height="80" />` : ""}
//                 </li>
//               `
//               )
//               .join("")}
//           </ul>
//         </div>
//       `,
//       showCancelButton: true,
//       cancelButtonText: "Close",
//       confirmButtonText: "Ok",
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       width: "80%",
//     });
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

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ orderStatus: newStatus }).commit();

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
//           "Order Successfully Completed",
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
//       <div className="flex h-screen bg-white overflow-hidden font-serif">
//         {/* Sidebar (Fixed Left Side) */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Navigation Bar */}
//           <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between">
//             <Slide direction="left" delay={100} triggerOnce>
//               <h2 className="text-2xl font-bold flex items-center">
//                 <TbShoppingCartDiscount className="w-6 h-6 mr-2" />
//                 Hekto Orders
//               </h2>
//             </Slide>
//             <div className="flex space-x-4">
//               {["All", "pending", "success", "dispatch"].map((status) => (
//                 <button
//                   key={status}
//                   className={`px-4 py-2 rounded-lg transition-all duration-300 ${
//                     filter === status
//                       ? "bg-white text-pink-600 font-bold"
//                       : "text-white"
//                   }`}
//                   onClick={() => setFilter(status)}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           {/* Orders Table */}
//           <div className="flex-1 p-2 overflow-y-auto">
//             <div className="overflow-y-auto p-6 transition-all duration-300">
//               <table className="w-full table-auto text-sm rounded-lg">
//                 <thead className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold">
//                   <tr className="text-center">
//                     <th className="py-4 px-2 text-xs font-semibold  uppercase tracking-wider">Order ID</th>
//                     <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Customer Name</th>
//                     <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Address</th>
//                     <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Date</th>
//                     <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Total</th>
//                     <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Status</th>
//                     <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredOrders.map((order) => (
//                     <tr
//                       className="cursor-pointer hover:bg-gray-100 text-gray-500 transition-all duration-300"
//                       key={order._id}
//                       onClick={() => handleOrderDetails(order)} // Open order details in SweetAlert
//                     >
//                       <td className="py-4 px-2">{order._id}</td>
//                       <td className="py-4 px-2">{order.fullName}</td>
//                       <td className="py-4 px-2">{order.address}</td>
//                       <td className="py-4 px-2">{new Date(order.orderDate).toLocaleDateString()}</td>
//                       <td className="py-4 px-2">${order.totalPrice}</td>
//                       <td className="py-4 px-2">
//                         <select
//                           value={order.orderStatus || ""}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="bg-white text-gray-800 p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="dispatch">Dispatch</option>
//                           <option value="success">Success</option>
//                         </select>
//                       </td>
//                       <td className="p-4">
                        // <button
                        //   onClick={(e) => {
                        //     e.stopPropagation();
                        //     handleDelete(order._id);
                        //   }}
                        //   className="inline-flex gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                        // >
                        //   Delete
                        //   <RiDeleteBinLine className="mt-1" />
                        // </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 768px) {
//           .flex {
//             flex-direction: column;
//           }
//           .flex-1 {
//             margin-left: 0;
//           }
//           .table-auto {
//             width: 100%;
//             display: block;
//             overflow-x: auto;
//           }
//           .table-auto th, .table-auto td {
//             padding: 12px;
//           }
//         }
//       `}</style>
//     </Protected>
//   );
// }

// export default Dashboard;


// "use client";

// import Protected from "@/components/Protected";
// import Sidebar from "@/components/Sidebar";
// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { Slide } from "react-awesome-reveal";
// import { FaDeleteLeft } from "react-icons/fa6";
// import { RiDeleteBin3Line, RiDeleteBinLine } from "react-icons/ri";
// import { TbShoppingCartDiscount } from "react-icons/tb";
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
//     [x: string]: any;
//     name: string;
//     image: string;
//   };
// }

// function Dashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           fullName,
//           email,
//           phoneNumber,
//           address,
//           city,
//           country,
//           postalCode,
//           totalPrice,
//           discount,
//           orderDate,
//           orderStatus,
//           cartItems[] -> { name, image }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error Fetching Orders", error));
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

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
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
//           "Order Successfully Completed",
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
//       <div className="flex h-screen bg-white overflow-hidden font-serif">
//         {/* Sidebar (Fixed Left Side) */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Navigation Bar */}
//           <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between">
//           <Slide direction="left" delay={100} triggerOnce>
//   <h2 className="text-2xl font-bold flex items-center">
//     <TbShoppingCartDiscount className="w-6 h-6 mr-2" />
//     Hekto Orders
//   </h2>
// </Slide>
            
//             {/* <h2 className="text-2xl font-bold">Hekto Orders</h2> */}
//             <div className="flex space-x-4">
//               {["All", "pending", "success", "dispatch"].map((status) => (
//                 <button
//                   key={status}
//                   className={`px-4 py-2 rounded-lg transition-all duration-300 ${
//                     filter === status
//                       ? "bg-white text-pink-600 font-bold"
//                       : "text-white"
//                   }`}
//                   onClick={() => setFilter(status)}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           {/* Orders Table */}
// <div className="flex-1 p-6 overflow-y-auto">
//   <div className="overflow-y-auto p-6 transition-all duration-300">
//     <table className="w-full table-auto text-sm rounded-lg">
//       <thead className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold">
//         <tr className="text-center">
//           <th className="py-4 px-2 text-xs font-semibold  uppercase tracking-wider">Order ID</th>
//           <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Customer Name</th>
//           <th className="p-2 text-xs font-semibold uppercase tracking-wider">Address</th>
//           <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Date</th>
//           <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Total</th>
//           <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Status</th>
//           <th className="py-4 px-2 text-xs font-semibold uppercase tracking-wider">Action</th>
//         </tr>
//       </thead>
//       <tbody className="divide-y divide-gray-200">
//         {filteredOrders.map((order) => (
//           <React.Fragment key={order._id}>
//             <tr
//               className="cursor-pointer hover:bg-gray-100 text-gray-500 transition-all duration-300"
//               onClick={() => toggleOrderDetails(order._id)}
//             >
//               <td className="py-4 px-2">{order._id}</td>
//               <td className="py-4 px-2">{order.fullName}</td>
//               <td className="py-4 px-2">{order.address}</td>
//               <td className="py-4 px-2">{new Date(order.orderDate).toLocaleDateString()}</td>
//               <td className="py-4 px-2">${order.totalPrice}</td>
//               <td className="py-4 px-2">
//                 <select
//                   value={order.orderStatus || ""}
//                   onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                   className="bg-white text-gray-800 p-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="dispatch">Dispatch</option>
//                   <option value="success">Success</option>
//                 </select>
//               </td>
//               <td className="p-4">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(order._id);
//                   }}
//                   className="inline-flex gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
//                 >
//                   Delete
//                   <RiDeleteBinLine className="mt-1"/>
//                 </button>
//               </td>
//             </tr>
//                       {selectedOrderID === order._id && (
//                         <tr className="transition-all duration-300">
//                           <td colSpan={7} className="bg-gray-50 p-4">
//                             <h3 className="text-lg font-semibold mb-4">Order Details</h3>
//                             <p className="text-sm">
//                               <strong>Phone:</strong> {order.phoneNumber}
//                             </p>
//                             <p className="text-sm">
//                               <strong>Email:</strong> {order.email}
//                             </p>
//                             <p className="text-sm">
//                               <strong>City:</strong> {order.city}
//                             </p>
//                             <ul className="mt-2">
//                               {order.cartItems.map((item: any) => (
//                                 <li className="flex items-center gap-3 py-2" key={item.name}>
//                                   <span>{item.name}</span>
//                                   {item.image && (
//                                     <Image
//                                       src={urlFor(item.image).url()}
//                                       width={80}
//                                       height={80}
//                                       alt={item.name}
//                                       className="rounded-md"
//                                     />
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 768px) {
//           .flex {
//             flex-direction: column;
//           }
//           .flex-1 {
//             margin-left: 0;
//           }
//           .table-auto {
//             width: 100%;
//             display: block;
//             overflow-x: auto;
//           }
//           .table-auto th, .table-auto td {
//             padding: 12px;
//           }
//         }
//       `}</style>
//     </Protected>
//   );
// }

// export default Dashboard;




// "use client";

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
//     [x: string]: any;
//     name: string;
//     image: string;
//   };
// }

// function Dashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           fullName,
//           email,
//           phoneNumber,
//           address,
//           city,
//           country,
//           postalCode,
//           totalPrice,
//           discount,
//           orderDate,
//           orderStatus,
//           cartItems[] -> { name, image }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error Fetching Orders", error));
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

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
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
//           "Order Successfully Completed",
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
//       <div className="flex h-screen bg-gray-50 overflow-hidden">
//         {/* Sidebar (Fixed Left Side) */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Navigation Bar */}
//           <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between">
//             <h2 className="text-2xl font-bold">Hekto Admin Dashboard</h2>
//             <div className="flex space-x-4">
//               {["All", "pending", "success", "dispatch"].map((status) => (
//                 <button
//                   key={status}
//                   className={`px-4 py-2 rounded-lg transition-all duration-300 ${
//                     filter === status
//                       ? "bg-white text-pink-600 font-bold"
//                       : "text-white"
//                   }`}
//                   onClick={() => setFilter(status)}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           {/* Orders Table */}
//           <div className="flex-1 p-6 overflow-y-auto">
//             <h2 className="text-3xl font-semibold text-center mb-6">Orders</h2>
//             <div className="overflow-y-auto bg-white rounded-lg shadow-xl p-6 transition-all duration-300">
//               <table className="w-full table-auto text-sm">
//                 <thead className="bg-gray-100 text-gray-700">
//                   <tr className="text-left">
//                     <th className="p-2">Order ID</th>
//                     <th className="p-2">Customer Name</th>
//                     <th className="p-2">Address</th>
//                     <th className="p-2">Date</th>
//                     <th className="p-2">Total</th>
//                     <th className="p-2">Status</th>
//                     <th className="p-2">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredOrders.map((order) => (
//                     <React.Fragment key={order._id}>
//                       <tr
//                         className="cursor-pointer hover:bg-pink-100 transition-all duration-300"
//                         onClick={() => toggleOrderDetails(order._id)}
//                       >
//                         <td className="p-3">{order._id}</td>
//                         <td className="p-3">{order.fullName}</td>
//                         <td className="p-3">{order.address}</td>
//                         <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
//                         <td className="p-3">${order.totalPrice}</td>
//                         <td className="p-3">
//                           <select
//                             value={order.orderStatus || ""}
//                             onChange={(e) =>
//                               handleStatusChange(order._id, e.target.value)
//                             }
//                             className="bg-gray-200 p-2 rounded-lg focus:outline-none"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="dispatch">Dispatch</option>
//                             <option value="success">Success</option>
//                           </select>
//                         </td>
//                         <td className="p-3">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(order._id);
//                             }}
//                             className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                       {selectedOrderID === order._id && (
//                         <tr className="transition-all duration-300">
//                           <td colSpan={7} className="bg-gray-50 p-4">
//                             <h3 className="text-lg font-semibold mb-4">Order Details</h3>
//                             <p className="text-sm">
//                               <strong>Phone:</strong> {order.phoneNumber}
//                             </p>
//                             <p className="text-sm">
//                               <strong>Email:</strong> {order.email}
//                             </p>
//                             <p className="text-sm">
//                               <strong>City:</strong> {order.city}
//                             </p>
//                             <ul className="mt-2">
//                               {order.cartItems.map((item: any) => (
//                                 <li className="flex items-center gap-3 py-2" key={item.name}>
//                                   <span>{item.name}</span>
//                                   {item.image && (
//                                     <Image
//                                       src={urlFor(item.image).url()}
//                                       width={80}
//                                       height={80}
//                                       alt={item.name}
//                                       className="rounded-md"
//                                     />
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 768px) {
//           .flex {
//             flex-direction: column;
//           }
//           .flex-1 {
//             margin-left: 0;
//           }
//           .table-auto {
//             width: 100%;
//             display: block;
//             overflow-x: auto;
//           }
//           .table-auto th, .table-auto td {
//             padding: 12px;
//           }
//         }
//       `}</style>
//     </Protected>
//   );
// }

// export default Dashboard;



// "use client";

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
//     [x: string]: any;
//     name: string;
//     image: string;
//   };
// }

// function Dashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           fullName,
//           email,
//           phoneNumber,
//           address,
//           city,
//           country,
//           postalCode,
//           totalPrice,
//           discount,
//           orderDate,
//           orderStatus,
//           cartItems[] -> { name, image }
//         }`
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

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
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
//       <div className="flex h-screen bg-gray-100 overflow-hidden">
//         {/* Sidebar (Fixed Left Side) */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           {/* Navigation Bar */}
//           <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between">
//             <h2 className="text-2xl font-bold">Hekto Admin Dashboard</h2>
//             <div className="flex space-x-4">
//               {["All", "pending", "success", "dispatch"].map((status) => (
//                 <button
//                   key={status}
//                   className={`px-4 py-2 rounded-lg transition-all ${
//                     filter === status
//                       ? "bg-white text-pink-600 font-bold"
//                       : "text-white"
//                   }`}
//                   onClick={() => setFilter(status)}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           {/* Orders Table */}
//           <div className="flex-1 p-6 overflow-y-auto">
//             <h2 className="text-2xl font-bold text-center">Orders</h2>
//             <div className="overflow-y-auto bg-white rounded-lg shadow-lg p-4">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th>Order ID</th>
//                     <th>Customer Name</th>
//                     <th>Address</th>
//                     <th>Date</th>
//                     <th>Total</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-300">
//                   {filteredOrders.map((order) => (
//                     <React.Fragment key={order._id}>
//                       <tr
//                         className="cursor-pointer hover:bg-pink-200 transition-all"
//                         onClick={() => toggleOrderDetails(order._id)}
//                       >
//                         <td>{order._id}</td>
//                         <td>{order.fullName}</td>
//                         <td>{order.address}</td>
//                         <td>{new Date(order.orderDate).toLocaleDateString()}</td>
//                         <td>${order.totalPrice}</td>
//                         <td>
//                           <select
//                             value={order.orderStatus || ""}
//                             onChange={(e) =>
//                               handleStatusChange(order._id, e.target.value)
//                             }
//                             className="bg-gray-200 p-1 rounded"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="dispatch">Dispatch</option>
//                             <option value="success">Success</option>
//                           </select>
//                         </td>
//                         <td>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(order._id);
//                             }}
//                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                       {selectedOrderID === order._id && (
//                         <tr>
//                           <td colSpan={7} className="bg-gray-100 p-4">
//                             <h3 className="text-lg font-bold">Order Details</h3>
//                             <p>
//                               Phone: <strong>{order.phoneNumber}</strong>
//                             </p>
//                             <p>
//                               Email: <strong>{order.email}</strong>
//                             </p>
//                             <p>
//                               City: <strong>{order.city}</strong>
//                             </p>
//                             <ul>
//                               {order.cartItems.map((item: any) => (
//                                 <li className="flex items-center gap-2" key={item.name}>
//                                   {item.name}
//                                   {item.image && (
//                                     <Image
//                                       src={urlFor(item.image).url()}
//                                       width={100}
//                                       height={100}
//                                       alt={item.name}
//                                     />
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @media (max-width: 768px) {
//           .flex {
//             flex-direction: column;
//           }
//           .flex-1 {
//             margin-left: 0;
//           }
//         }
//       `}</style>
//     </Protected>
//   );
// }

// export default Dashboard;



// "use client";

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
//     [x: string]: any;
//     name: string;
//     image: string;
//   };
// }

// function Order() {
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
//       .catch((error) => console.error("Error Fetching Orders", error));
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

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ status: newStatus }).commit();

//       setOrders((prevOrder) =>
//         prevOrder.map((order) =>
//           order._id === orderId ? { ...order, orderStatus: newStatus } : order
//         )
//       );
//       if (newStatus === "dispatch") {
//         Swal.fire("Order Dispatched", "Your Order has been dispatched", "success");
//       } else if (newStatus === "success") {
//         Swal.fire("Order Completed", "Your Order has been completed", "success");
//       }
//     } catch (error) {
//       Swal.fire("Error", "Failed to update order status", "error");
//     }
//   };

//   return (
//     <Protected>
//       <div className="flex h-screen bg-gray-100 transition-all">
//         {/* Sidebar (Fixed Left Side) */}
//         <Sidebar />

//         {/* Main Content */}
//         <div className="flex flex-col flex-1 transition-all">
//           {/* Navigation Bar */}
//           <nav className="bg-pink-600 text-white p-4 shadow-lg flex justify-between transition-all">
//             <h2 className="text-2xl font-bold">Hekto Admin Dashboard</h2>
//             <div className="flex space-x-4">
//               {["All", "pending", "success", "dispatch"].map((status) => (
//                 <button
//                   key={status}
//                   className={`px-4 py-2 rounded-lg transition-all ease-in-out duration-200 
//                       ${filter === status ? "bg-white text-pink-600 font-bold" : "text-white hover:bg-pink-500 hover:text-white"}`}
//                   onClick={() => setFilter(status)}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           {/* Orders Table */}
//           <div className="flex-1 p-6 overflow-y-auto">
//             <h2 className="text-2xl font-bold text-center mb-4">Orders</h2>
//             <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
//               <table className="w-full table-auto">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="py-2 px-4">Order ID</th>
//                     <th className="py-2 px-4">Customer Name</th>
//                     <th className="py-2 px-4">Address</th>
//                     <th className="py-2 px-4">Date</th>
//                     <th className="py-2 px-4">Total</th>
//                     <th className="py-2 px-4">Status</th>
//                     <th className="py-2 px-4">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-300">
//                   {filteredOrders.map((order) => (
//                     <React.Fragment key={order._id}>
//                       <tr
//                         className="cursor-pointer hover:bg-pink-200 transition-all"
//                         onClick={() => toggleOrderDetails(order._id)}
//                       >
//                         <td className="py-2 px-4">{order._id}</td>
//                         <td className="py-2 px-4">{order.fullName}</td>
//                         <td className="py-2 px-4">{order.address}</td>
//                         <td className="py-2 px-4">
//                           {new Date(order.orderDate).toLocaleDateString()}
//                         </td>
//                         <td className="py-2 px-4">${order.totalPrice}</td>
//                         <td className="py-2 px-4">
//                           <select
//                             value={order.orderStatus || ""}
//                             onChange={(e) =>
//                               handleStatusChange(order._id, e.target.value)
//                             }
//                             className="bg-gray-200 p-1 rounded"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="dispatch">Dispatch</option>
//                             <option value="success">Success</option>
//                           </select>
//                         </td>
//                         <td className="py-2 px-4">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(order._id);
//                             }}
//                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                       {selectedOrderID === order._id && (
//                         <tr className="transition-all bg-gray-100 p-4">
//                           <td colSpan={7}>
//                             <h3 className="text-lg font-bold">Order Details</h3>
//                             <p>
//                               Phone: <strong>{order.phoneNumber}</strong>
//                             </p>
//                             <p>
//                               Email: <strong>{order.email}</strong>
//                             </p>
//                             <p>
//                               City: <strong>{order.city}</strong>
//                             </p>
//                             <ul>
//                               {order.cartItems.map((item: any) => (
//                                 <li
//                                   className="flex items-center gap-2"
//                                   key={`${order._id}`}
//                                 >
//                                   {item.name}
//                                   {item.image && (
//                                     <Image
//                                       src={urlFor(item.image).url()}
//                                       width={100}
//                                       height={100}
//                                       alt={item.name}
//                                     />
//                                   )}
//                                 </li>
//                               ))}
//                             </ul>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Protected>
//   );
// }

// export default Order;
