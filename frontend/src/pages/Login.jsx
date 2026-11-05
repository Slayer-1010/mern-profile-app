import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../services/authServices";
import { Link, useLocation } from "react-router-dom";

function Login() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();

  const registrationMessage = location.state?.message;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const result = await loginUser(data);
      setSuccessMessage(result.msg || "Login successful!");
      console.log("Login response:", result);
    } catch (error) {
      setServerError(error.message || "Login failed.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your profile.
          </p>
        </div>
        {/* Display the registration success message */}
        {registrationMessage && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {registrationMessage}
          </p>
        )}
        {/* Server error */}
        {serverError && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div
            role="status"
            className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}

        {/* Email */}
        <Input
          id="email"
          label="Email Address"
          type="email"
          registration={register("email", {
            required: "Email is required.",
            maxLength: {
              value: 255,
              message: "Email cannot exceed 255 characters.",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please provide a valid email address.",
            },
          })}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
        />

        {/* Password */}
        <Input
          id="password"
          label="Password"
          type="password"
          registration={register("password", {
            required: "Password is required.",
          })}
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
        />

        {/* Submit button */}
        <Button type="submit" loading={isSubmitting}>
          Sign In
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Register here
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
