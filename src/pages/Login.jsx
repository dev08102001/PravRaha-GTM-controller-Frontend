// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import api from "../services/api";
// import loginIllustration from "../assets/login-illustration.png";

// export default function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const response = await api.post("/auth/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       localStorage.setItem(
//         "token",
//         response.data.token
//       );

//       localStorage.setItem(
//         "user",
//         JSON.stringify(response.data.user)
//       );

//       alert("Login Successful");

//       navigate("/dashboard");
//     } catch (error) {
//       console.error(error);

//       alert(
//         error?.response?.data?.message ||
//           "Login Failed"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
//       <div className="w-full max-w-7xl h-[700px] bg-white rounded-3xl overflow-hidden shadow-2xl flex">
        
//         {/* Left Side */}
//         <div className="w-1/2 overflow-hidden">
//           <img
//             src={loginIllustration}
//             alt="Login Illustration"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Right Side */}
//         <div className="w-1/2 flex items-center justify-center p-12">
//           <div className="w-full max-w-md">

//             <div className="text-center mb-8">
//               <h1 className="text-5xl font-bold text-black mb-2">
//                 PravRaha-GTM
//               </h1>

//               <p className="text-gray-500">
//                 Welcome back! Please login to continue
//               </p>
//             </div>

//             <form
//               onSubmit={handleLogin}
//               className="space-y-5"
//             >
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-xl p-4 text-black focus:outline-none focus:border-red-500"
//                 required
//               />

//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-xl p-4 text-black focus:outline-none focus:border-red-500"
//                 required
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-[#0B1220] hover:bg-black text-white py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50"
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </button>

//               <div className="text-right">
//                 <a
//                   href="#"
//                   className="text-sm text-gray-500 hover:text-red-500"
//                 >
//                   Forgot Password?
//                 </a>
//               </div>
//             </form>

//             <div className="text-center mt-8 text-gray-600">
//               Don't have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="font-semibold text-red-500 hover:text-red-600"
//               >
//                 Sign Up
//               </Link>
//             </div>

//             <div className="text-center mt-8 text-sm text-gray-400">
//               Powered by PravRaha
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }






import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../services/api";
import loginIllustration from "../assets/login-illustration.png";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async ({ email, password }) => {
    if (loading) return; // Prevent duplicate requests

    const sanitizedEmail = email.trim().toLowerCase();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: sanitizedEmail,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6">
      <div className="w-full max-w-7xl h-[700px] bg-white rounded-3xl overflow-hidden shadow-2xl flex">
        {/* Left Side */}
        <div className="w-1/2 overflow-hidden">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-black mb-2">PravRaha-GTM</h1>

              <p className="text-gray-500">Welcome back! Please login to continue</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className={`w-full rounded-xl p-4 text-black focus:outline-none transition ${
                    errors.email
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-gray-300 focus:border-black"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: emailPattern,
                      message: "Enter a valid email address",
                    },
                    setValueAs: (value) => value.trim().toLowerCase(),
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className={`w-full rounded-xl p-4 text-black focus:outline-none transition ${
                    errors.password
                      ? "border border-red-500 focus:border-red-500"
                      : "border border-gray-300 focus:border-black"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0B1220] hover:bg-black text-white py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="text-right">
                <a href="#" className="text-sm text-gray-500 hover:text-red-500">
                  Forgot Password?
                </a>
              </div>
            </form>

            <div className="text-center mt-8 text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-red-500 hover:text-red-600"
              >
                Sign Up
              </Link>
            </div>

            <div className="text-center mt-8 text-sm text-gray-400">Powered by PravRaha</div>
          </div>
        </div>
      </div>
    </div>
  );
}
