import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../services/authServices";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [serverError, setServerError] = useState("");
  // const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setServerError("");
    // setSuccessMessage("");

    try {
      const { confirmPassword, ...registrationData } = data;
      const result = await registerUser(registrationData);
      //This redirects the user to Login after successful registration. The message is passed along so the Login page can display it.
      // setSuccessMessage(
      //   result.message || result.msg || "Registration Completed"
      // )
      if (result.success) {
        navigate("/login", {
          state: {
            message: result.message,
          },
        });
      }
    } catch (error) {
      setServerError(error.message || "Registration failed.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Create an Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Register to manage your profile.
          </p>
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {successMessage}
          </div>
        )}

        <Input
          id="name"
          label="Full Name"
          registration={register("name", {
            required: "Name is required.",
            validate: (value) => {
              const trimmedValue = value.trim();

              if (trimmedValue.length === 0) {
                return "Name is required.";
              }

              if (trimmedValue.length < 5 || trimmedValue.length > 100) {
                return "Name must be between 5 and 100 characters.";
              }

              return true;
            },
          })}
          placeholder="Enter your full name"
          autoComplete="name"
          error={errors.name?.message}
        />

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

        <Input
          id="password"
          label="Password"
          type="password"
          registration={register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be between 8 and 128 characters.",
            },
            maxLength: {
              value: 128,
              message: "Password must be between 8 and 128 characters.",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,128}$/,
              message:
                "Include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&#).",
            },
          })}
          placeholder="Create a strong password"
          autoComplete="new-password"
          error={errors.password?.message}
        />
        <p className="text-xs leading-5 text-slate-500">
          Use 8-128 characters, including an uppercase letter, a lowercase
          letter, a number, and one special character: @$!%*?&
        </p>

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          registration={register("confirmPassword", {
            required: "Please confirm your password.",
            validate: (value) =>
              value === watch("password") || "Passwords do not match.",
          })}
          placeholder="Enter your password again"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
        />

        <Input
          id="phone"
          label="Phone Number (Optional)"
          type="tel"
          registration={register("phone", {
            validate: (value) => {
              if (!value || !value.trim()) {
                return true;
              }

              return (
                /^(?:\+977)?9[678]\d{8}$/.test(value.trim()) ||
                "Please provide a valid Nepal phone number."
              );
            },
          })}
          placeholder="98XXXXXXXX or +97798XXXXXXXX"
          autoComplete="tel"
          error={errors.phone?.message}
        />

        <Input
          id="address"
          label="Address (Optional)"
          registration={register("address", {
            maxLength: {
              value: 100,
              message: "Address cannot exceed 100 characters.",
            },
          })}
          placeholder="Enter your address"
          autoComplete="street-address"
          error={errors.address?.message}
        />

        <Input
          id="dob"
          label="Date of Birth (Optional)"
          type="date"
          registration={register("dob", {
            validate: (value) => {
              if (!value) {
                return true;
              }

              return (
                value <= new Date().toLocaleDateString("en-CA") ||
                "Date of birth cannot be in the future."
              );
            },
          })}
          error={errors.dob?.message}
        />

        <Button type="submit" loading={isSubmitting}>
          Create Account
        </Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login here
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
