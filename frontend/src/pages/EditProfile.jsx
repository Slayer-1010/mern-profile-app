
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  getMyProfile,
  updateMyProfile,
} from "../services/prrofileServices";

function EditProfile() {
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getMyProfile();
        const user = result.user;

        reset({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          dob: user.dob ? String(user.dob).slice(0, 10) : "",
        });
      } catch (error) {
        setServerError(error.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("phone", data.phone || "");
      formData.append("address", data.address || "");
      formData.append("dob", data.dob || "");

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const result = await updateMyProfile(formData);

      if (result.success) {
        navigate("/profile", { replace: true });
      }
    } catch (error) {
      setServerError(error.message || "Failed to update profile.");
    }
  };

  if (loading) {
    return <p className="p-6 text-center">Loading profile...</p>;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      //Will make some changes   
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-lg space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold text-slate-800">
          Edit Profile
        </h1>

        {serverError && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">
            {serverError}
          </p>
        )}

        <Input
          id="name"
          label="Full Name"
          registration={register("name", {
            required: "Name is required.",
            minLength: {
              value: 5,
              message: "Name must be at least 5 characters.",
            },
            maxLength: {
              value: 100,
              message: "Name cannot exceed 100 characters.",
            },
          })}
          error={errors.name?.message}
        />

        <Input
          id="phone"
          label="Phone"
          type="tel"
          registration={register("phone")}
          error={errors.phone?.message}
        />

        <Input
          id="address"
          label="Address"
          registration={register("address", {
            maxLength: {
              value: 100,
              message: "Address cannot exceed 100 characters.",
            },
          })}
          error={errors.address?.message}
        />

        <Input
          id="dob"
          label="Date of Birth"
          type="date"
          registration={register("dob")}
          error={errors.dob?.message}
        />

        <div>
          <label
            htmlFor="profileImage"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Profile Image
          </label>

          <input
            id="profileImage"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setSelectedImage(event.target.files?.[0] || null)
            }
            className="w-full rounded-lg border border-slate-300 p-2"
          />

          <p className="mt-1 text-xs text-slate-500">
            JPG, PNG or WEBP. Maximum size: 2 MB.
          </p>
        </div>

        <Button type="submit" loading={isSubmitting}>
          Save Changes
        </Button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="w-full text-sm text-slate-600 hover:text-slate-900"
        >
          Cancel
        </button>
        
      </form>
    </main>
  );
}

export default EditProfile;
