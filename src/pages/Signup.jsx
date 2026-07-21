import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";
 
import logo from "../assets/logo.png";
import signupVideo from "../assets/video.mp4";
 
const NAME_PATTERN = /^[A-Za-z\s]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[6-9]\d{9}$/;
 
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "Weak" };
 
  let score = 0;
 
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
 
  if (score <= 2) return { score, label: "Weak" };
  if (score === 3) return { score, label: "Medium" };
  if (score === 4) return { score, label: "Strong" };
  return { score, label: "Very Strong" };
};
 
const getPasswordValidationRules = (password) => [
  {
    label: "At least 8 characters",
    valid: password.length >= 8,
  },
  {
    label: "One uppercase letter",
    valid: /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    valid: /[a-z]/.test(password),
  },
  {
    label: "One number",
    valid: /\d/.test(password),
  },
  {
    label: "One special character",
    valid: /[^A-Za-z0-9]/.test(password),
  },
];
 
export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setFocus,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      company: "",
      designation: "",
      newsletter: false,
      terms: false,
    },
  });
 
  const passwordValue = watch("password") || "";
  const passwordStrength = getPasswordStrength(passwordValue);
  const passwordRules = getPasswordValidationRules(passwordValue);
 
  const onSubmit = async (data) => {
    const payload = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone.trim(),
      company: data.company.trim(),
      designation: data.designation.trim(),
      newsletter: Boolean(data.newsletter),
      terms: Boolean(data.terms),
    };
 
    try {
      const response = await api.post("/auth/register", payload);
 
      toast.success(response.data.message || "Registration Successful");
      reset({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        company: "",
        designation: "",
        newsletter: false,
        terms: false,
      });
      setShowPassword(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Registration Failed");
    }
  };
 
  const onInvalid = (validationErrors) => {
    const fieldOrder = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phone",
      "company",
      "designation",
      "terms",
    ];
 
    const firstErrorField = fieldOrder.find((field) => validationErrors[field]);
 
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };
 
  return (
    <div className="min-h-screen flex bg-[#0B1220]">
      {/* Left Section */}
      <div className="relative w-1/2 border-r border-gray-800 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={signupVideo} type="video/mp4" />
        </video>
 
        <div className="absolute inset-0 bg-black/60"></div>
 
        <div className="relative z-10 h-full flex flex-col justify-center px-20">
          <div className="flex items-center gap-4 mb-10">
            <img
              src={logo}
              alt="PravRaha"
              className="w-16 h-16 object-contain"
            />
 
            <div>
              <h2 className="text-4xl font-bold text-white">PravRaha</h2>
 
              <p className="text-gray-300 text-sm">AI Revenue Agent Platform</p>
            </div>
          </div>
 
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to PravRaha
          </h1>
 
          <p className="text-gray-200 text-xl leading-relaxed max-w-lg">
            Start turning buying signals into predictable revenue with AI-powered
            GTM intelligence.
          </p>
        </div>
      </div>
 
      {/* Right Section */}
      <div className="w-1/2 bg-[#151D2E] overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center py-10">
          <div className="w-full max-w-xl px-8">
            <h1 className="text-5xl font-bold text-center mb-2 text-white">
              Create Your Account
            </h1>
 
            <p className="text-center text-gray-400 mb-8">
              Register to access PravRaha Dashboard
            </p>
 
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    autoComplete="given-name"
                    aria-invalid={Boolean(errors.firstName)}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                    {...register("firstName", {
                      validate: (value) => {
                        const trimmedValue = value.trim();
 
                        if (!trimmedValue) {
                          return "First name is required";
                        }
 
                        if (trimmedValue.length < 2) {
                          return "First name must be at least 2 characters";
                        }
 
                        if (trimmedValue.length > 50) {
                          return "First name must be at most 50 characters";
                        }
 
                        if (!NAME_PATTERN.test(trimmedValue)) {
                          return "Only alphabets and spaces are allowed";
                        }
 
                        return true;
                      },
                    })}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="mt-2 text-sm text-red-400">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
 
                <div>
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    autoComplete="family-name"
                    aria-invalid={Boolean(errors.lastName)}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                    {...register("lastName", {
                      validate: (value) => {
                        const trimmedValue = value.trim();
 
                        if (!trimmedValue) {
                          return "Last name is required";
                        }
 
                        if (trimmedValue.length < 2) {
                          return "Last name must be at least 2 characters";
                        }
 
                        if (trimmedValue.length > 50) {
                          return "Last name must be at most 50 characters";
                        }
 
                        if (!NAME_PATTERN.test(trimmedValue)) {
                          return "Only alphabets and spaces are allowed";
                        }
 
                        return true;
                      },
                    })}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="mt-2 text-sm text-red-400">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
 
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                  {...register("email", {
                    validate: (value) => {
                      const trimmedValue = value.trim();
 
                      if (!trimmedValue) {
                        return "Email is required";
                      }
 
                      if (!EMAIL_PATTERN.test(trimmedValue.toLowerCase())) {
                        return "Enter a valid email";
                      }
 
                      return true;
                    },
                  })}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-sm text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
 
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                  {...register("phone", {
                    validate: (value) => {
                      const trimmedValue = value.trim();
 
                      if (!trimmedValue) {
                        return true;
                      }
 
                      if (!PHONE_PATTERN.test(trimmedValue)) {
                        return "Phone number is invalid";
                      }
 
                      return true;
                    },
                  })}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-2 text-sm text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>
 
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error password-hints" : "password-hints"}
                    className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 pr-12 text-white placeholder-gray-400"
                    {...register("password", {
                      validate: (value) => {
                        if (!value) {
                          return "Password is required";
                        }
 
                        if (value.length < 8) {
                          return "Password must be at least 8 characters";
                        }
 
                        if (!/[A-Z]/.test(value)) {
                          return "Password must contain one uppercase letter";
                        }
 
                        if (!/[a-z]/.test(value)) {
                          return "Password must contain one lowercase letter";
                        }
 
                        if (!/\d/.test(value)) {
                          return "Password must contain one number";
                        }
 
                        if (!/[^A-Za-z0-9]/.test(value)) {
                          return "Password must contain one special character";
                        }
 
                        return true;
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
                <div id="password-hints" className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-red-400">{passwordStrength.label}</span>
                    <span className="text-gray-500">Password strength</span>
                  </div>
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className={rule.valid ? "text-green-400" : "text-red-400"}>
                        {rule.valid ? "✔" : "•"}
                      </span>
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              <div>
                <label htmlFor="company" className="sr-only">
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "company-error" : undefined}
                  className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                  {...register("company", {
                    validate: (value) => {
                      const trimmedValue = value.trim();
 
                      if (trimmedValue.length > 100) {
                        return "Company name must be at most 100 characters";
                      }
 
                      return true;
                    },
                  })}
                />
                {errors.company && (
                  <p id="company-error" className="mt-2 text-sm text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>
 
              <div>
                <label htmlFor="designation" className="sr-only">
                  Designation
                </label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  aria-invalid={Boolean(errors.designation)}
                  aria-describedby={errors.designation ? "designation-error" : undefined}
                  className="w-full bg-[#1C2538] border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400"
                  {...register("designation", {
                    validate: (value) => {
                      const trimmedValue = value.trim();
 
                      if (trimmedValue.length > 100) {
                        return "Designation must be at most 100 characters";
                      }
 
                      return true;
                    },
                  })}
                />
                {errors.designation && (
                  <p id="designation-error" className="mt-2 text-sm text-red-400">
                    {errors.designation.message}
                  </p>
                )}
              </div>
 
              <div className="flex items-center gap-3 text-gray-300">
                <input
                  id="newsletter"
                  type="checkbox"
                  className="accent-red-500"
                  {...register("newsletter")}
                />
                <label htmlFor="newsletter">
                  I want to receive PravRaha newsletters
                </label>
              </div>
 
              <div className="flex items-center gap-3 text-gray-300">
                <input
                  id="terms"
                  type="checkbox"
                  className="accent-red-500"
                  {...register("terms", {
                    validate: (value) => value || "I agree to the Terms and Privacy Policy",
                  })}
                />
                <label htmlFor="terms">
                  I agree to the Terms and Privacy Policy
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-400">{errors.terms.message}</p>
              )}
 
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-xl font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
 
            <div className="text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-red-400 hover:text-red-300"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}