import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

interface FormData {
  title: string;
  category: string;
  price: string;
  condition: string;
  description: string;
  contactOption: "chat-only" | "show-phone";
  phoneNumber: string;
  imageUrl: string;
  userId: number;
}

interface FormErrors {
  [key: string]: string;
}

const UpdateItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    contactOption: "chat-only",
    phoneNumber: "",
    imageUrl: "",
    userId: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ["Books", "Stationary"];
  const conditions = ["New", "Like New", "Good", "Fair", "Used"];

  // 🔥 fetch item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/items/${id}`);
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Please enter a valid price";
    if (!formData.condition) newErrors.condition = "Please select condition";

    if (
      formData.contactOption === "show-phone" &&
      !formData.phoneNumber.trim()
    ) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else if (!formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "Enter valid URL starting with http/https";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.put(`http://localhost:3000/items/${id}`, formData);

      alert("Item updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 py-12 px-4 text-center">
        Loading item...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Update Your Item
          </h1>
          <p className="text-gray-600">
            Edit the details below to update your listing.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 md:p-8">

            <div className="flex flex-col lg:flex-row gap-8">

              {/* LEFT COLUMN */}
              <div className="lg:w-1/2 flex flex-col justify-between">

                {/* Image URL */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Image URL
                    </label>

                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none
                      ${errors.imageUrl ? "border-red-500" : "border-gray-300"}`}
                    />

                    {errors.imageUrl && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.imageUrl}
                      </p>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px]">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="preview"
                        className="w-full h-full object-contain max-h-[400px]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "";
                          setErrors((prev) => ({
                            ...prev,
                            imageUrl: "Invalid image URL",
                          }));
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">
                        No image preview
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:w-1/2 space-y-6">

                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg outline-none
                    ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Category + Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-semibold">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="">Select</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-sm font-semibold">Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select</option>
                    {conditions.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="text-sm font-semibold">
                    Contact Option
                  </label>

                  <div className="flex gap-3 mt-2">
                    <label className="flex-1 border p-3 rounded-lg">
                      <input
                        type="radio"
                        name="contactOption"
                        value="show-phone"
                        checked={formData.contactOption === "show-phone"}
                        onChange={handleChange}
                      />
                      Show Phone
                    </label>

                    <label className="flex-1 border p-3 rounded-lg">
                      <input
                        type="radio"
                        name="contactOption"
                        value="chat-only"
                        checked={formData.contactOption === "chat-only"}
                        onChange={handleChange}
                      />
                      Chat Only
                    </label>
                  </div>

                  {formData.contactOption === "show-phone" && (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className="w-full mt-3 px-4 py-2 border rounded-lg"
                    />
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-semibold py-3 rounded-xl
                  ${isSubmitting
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-blue-600 to-blue-700"
                  }`}
                >
                  {isSubmitting ? "Updating..." : "Update Item"}
                </button>

              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default UpdateItemForm;