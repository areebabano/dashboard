"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { FaUser, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Admin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [imageSrc, setImageSrc] = useState("/admin.png");
    const [errorMessage, setErrorMessage] = useState("");  // State for error message
    const router = useRouter();

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "admin@example.com" && password === "password123") {
            localStorage.setItem("isLoggedIn", "true");  
            router.push("/admin/dashboard");
        } else {
            setErrorMessage("Invalid email or password!");  // Set error message
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-6">
            <div className="flex bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
                <div className="w-1/2 flex items-center justify-center">
                    <Image 
                        src={imageSrc} 
                        alt="Admin" 
                        width={350} 
                        height={350} 
                        className="rounded-lg shadow-md transition-all duration-500 hover:opacity-80"
                        onMouseEnter={() => setImageSrc("/admin2.png")}
                        onMouseLeave={() => setImageSrc("/admin1.png")}
                    />
                </div>
                <form 
                    onSubmit={handleAdminLogin} 
                    className="w-1/2 p-6 bg-white rounded-lg"
                >
                    <h2 className="flex flex-col text-2xl font-semibold mb-6 text-center text-pink-500">
                        <span className="flex flex-col text-4xl font-bold text-gray-500">
                            Hekto
                            <span className="text-sm text-gray-400 mb-2">
                                Building the Future of Furniture Shopping
                            </span>
                        </span>
                        <span className="flex items-center justify-center gap-2">
                            <FaUser className="text-xl" /> Admin Login
                        </span>
                    </h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" 
                            required
                        />
                    </div>

                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
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
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md hover:from-purple-600 hover:to-pink-500 transition duration-300 font-medium flex items-center justify-center gap-2"
                    >
                        Login <FaSignInAlt className="text-lg" />
                    </button>

                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>  // Display error message
                    )}
                </form>
            </div>
        </div>
    );
}


// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";
// import { FaUser } from "react-icons/fa6";
// import { FaSignInAlt } from "react-icons/fa";

// export default function Admin() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [imageSrc, setImageSrc] = useState("/admin-image1.jpg");
//     const router = useRouter();

//     const handleAdminLogin = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (email === "admin@example.com" && password === "password123") {
//             localStorage.setItem("isLoggedIn", "true");  
//             router.push("/admin/dashboard");
//         } else {
//             alert("Invalid credentials!");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-white px-6">
//             <div className="flex bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
//                 <div className="w-1/2 flex items-center justify-center">
//                     <Image 
//                         src={imageSrc} 
//                         alt="Admin" 
//                         width={350} 
//                         height={350} 
//                         className="rounded-lg shadow-md transition-all duration-500 hover:opacity-80"
//                         onMouseEnter={() => setImageSrc("/admin2.png")}
//                         onMouseLeave={() => setImageSrc("/admin1.png")}
//                     />
//                 </div>
//                 <form 
//                     onSubmit={handleAdminLogin} 
//                     className="w-1/2 p-6 bg-white rounded-lg"
//                 >
//                     <h2 className="flex flex-col text-2xl font-semibold mb-6 text-center text-pink-500">
//     <span className="flex flex-col text-4xl font-bold text-gray-500">
//         Hekto
//         <span className="text-sm text-gray-400 mb-2">
//             Building the Future of Furniture Shopping
//         </span>
//     </span>
//     <span className="flex items-center justify-center gap-2">
//         <FaUser className="text-1xl " /> Admin Login
//     </span>
// </h2>

//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
//                         <input 
//                             type="email" 
//                             value={email} 
//                             onChange={(e) => setEmail(e.target.value)} 
//                             className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" 
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
//                         <input 
//                             type="password" 
//                             value={password} 
//                             onChange={(e) => setPassword(e.target.value)} 
//                             className="w-full px-4 py-2 text-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" 
//                             required
//                         />
//                     </div>
//                     <button 
//     type="submit" 
//     className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-md hover:from-purple-600 hover:to-pink-500 transition duration-300 font-medium flex items-center justify-center gap-2"
// >
//      Login <FaSignInAlt className="text-lg" />
// </button>
//                 </form>
//             </div>
//         </div>
//     );
// }


// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";

// export default function Admin() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const router = useRouter();

//     const handleAdminLogin = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (email === "admin@example.com" && password === "password123") {
//             localStorage.setItem("isLoggedIn", "true");  
//             router.push("/admin/dashboard");
//         } else {
//             alert("Invalid credentials!");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 to-purple-500">
//             <div className="flex bg-white p-8 rounded-2xl shadow-lg w-3/4">
//                 <div className="w-1/2 flex items-center justify-center">
//                     <Image 
//                         src="/admin1.png" 
//                         alt="Admin" 
//                         width={350} 
//                         height={350} 
//                         className="rounded-xl shadow-lg" 
//                     />
//                 </div>
//                 <form 
//                     onSubmit={handleAdminLogin} 
//                     className="w-1/2 p-8 bg-white rounded-xl shadow-md"
//                 >
//                     <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Admin Login</h2>
//                     <div className="mb-5">
//                         <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
//                         <input 
//                             type="email" 
//                             value={email} 
//                             onChange={(e) => setEmail(e.target.value)} 
//                             className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
//                             required
//                         />
//                     </div>
//                     <div className="mb-5">
//                         <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
//                         <input 
//                             type="password" 
//                             value={password} 
//                             onChange={(e) => setPassword(e.target.value)} 
//                             className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
//                             required
//                         />
//                     </div>
//                     <button 
//                         type="submit" 
//                         className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
//                     >
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }


// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Image from "next/image";

// export default function Admin() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const router = useRouter();

//     const handleAdminLogin = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (email === "admin@example.com" && password === "password123") {
//             localStorage.setItem("isLoggedIn", "true");  
//             router.push("/admin/dashboard");
//         } else {
//             alert("Invalid credentials!");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="flex bg-white p-6 rounded-lg shadow-md w-2/3">
//                 <div className="w-1/2 flex items-center justify-center">
//                     <Image text-gray-500
//                         src="/admin2.png" 
//                         alt="Admin" 
//                         width={300} 
//                         height={300} 
//                         className="rounded-lg shadow-md" 
//                     />
//                 </div>
//                 <form 
//                     onSubmit={handleAdminLogin} 
//                     className="w-1/2 p-6"
//                 >
//                     <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//                         <input 
//                             type="email" 
//                             value={email} 
//                             onChange={(e) => setEmail(e.target.value)} 
//                             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//                         <input 
//                             type="password" 
//                             value={password} 
//                             onChange={(e) => setPassword(e.target.value)} 
//                             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
//                             required
//                         />
//                     </div>
//                     <button 
//                         type="submit" 
//                         className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//                     >
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }



// "use client";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function Admin() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const router = useRouter();

//     const handleAdminLogin = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (email === "admin@example.com" && password === "password123") {
//             localStorage.setItem("isLoggedIn", "true");  
//             router.push("/admin/dashboard");
//         } else {
//             alert("Invalid credentials!");
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <form 
//                 onSubmit={handleAdminLogin} 
//                 className="bg-white p-6 rounded-lg shadow-md w-96"
//             >
//                 <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
//                     <input 
//                         type="email" 
//                         value={email} 
//                         onChange={(e) => setEmail(e.target.value)} 
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
//                     <input 
//                         type="password" 
//                         value={password} 
//                         onChange={(e) => setPassword(e.target.value)} 
//                         className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
//                         required
//                     />
//                 </div>
//                 <button 
//                     type="submit" 
//                     className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//                 >
//                     Login
//                 </button>
//             </form>
//         </div>
//     );
// }


// "use client"
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function Admin(){
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const router = useRouter();

//     const handleAdminLogin = (e : React.FormEvent) => {
//         e.preventDefault();
        
//     }
//     if(email === "admin@example.com" && password === "password123"){
//         localStorage.setItem("isLoggedIn", "true");  
//         router.push("/admin/dashboard");
//     } else {
//         alert("Invalid credentials!");
//     } 
// }