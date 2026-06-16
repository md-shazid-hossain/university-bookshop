import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

interface FormData {
  title: string;
  category: string;
  price: string;
  condition: string;
  description: string;
  phoneNumber: string;
  imageUrl: string;
  userId: number;
}

interface FormErrors {
  [key: string]: string;
}

const SellItemForm = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [formData, setFormData] = useState<FormData>({
    title: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    phoneNumber: "",
    imageUrl: "",
    userId: user?.id || 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Books", "Stationary"];
  const conditions = ["New", "Like New", "Good", "Used"];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      userId: user?.id || 0,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Select category";
    if (!formData.condition) newErrors.condition = "Select condition";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number required";

    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Enter valid price";
    }

    if (!formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "Enter valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:3000/items", formData);

      alert("Item posted successfully 🎉");

      if (formData.category === "Books") {
        navigate("/sellpage/books");
      } else {
        navigate("/sellpage/stationary");
      }

      setFormData({
        title: "",
        category: "",
        price: "",
        condition: "",
        description: "",
        phoneNumber: "",
        imageUrl: "",
        userId: user?.id || 0,
      });
    } catch (err: any) {
      alert(err?.response?.data?.error || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Sell Your Item</h1>
        <p className="text-gray-500 mt-2">
          Fill in the details and start selling instantly
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-10">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            {/* Image URL */}
            <div>
              <label className="font-medium text-gray-700">Image URL</label>

              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full mt-2 border rounded-lg px-4 py-2 outline-none"
                placeholder="https://..."
              />

              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
              )}
            </div>

            {/* Preview */}
            <div className="border rounded-xl bg-gray-50 h-72 flex items-center justify-center overflow-hidden">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="preview"
                  className="w-full h-full object-contain"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400?text=Invalid+Image")
                  }
                />
              ) : (
                <p className="text-gray-400">Image preview will appear here</p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border rounded-lg px-4 py-2"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category + Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Condition */}
            <div>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Condition</option>
                {conditions.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.condition && (
                <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
              )}
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Description"
              className="w-full border rounded-lg px-3 py-2"
            />

            {/* Phone Number Input */}
            <div>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl text-white font-semibold ${
                isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Posting..." : "Post Item"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SellItemForm;
