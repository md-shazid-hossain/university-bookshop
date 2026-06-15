import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios"; // 1. Import axios

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

const SellItemForm = () => {
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

  const fromLocalStorage = localStorage.getItem("user");

  const user = fromLocalStorage ? JSON.parse(fromLocalStorage) : null;

  // console.log(user);
  console.log(user?.id);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track loading state

  const categories: string[] = ["Books", "Stationary"];

  const conditions: string[] = ["New", "Like New", "Good", "Fair", "Used"];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, userId: user?.id });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Please enter a valid price";
    }
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
      newErrors.imageUrl =
        "Please enter a valid URL starting with http or https";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2. Updated handleSubmit to handle the async API call
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Replace with your actual backend URL if different (e.g., http://localhost:3000/items)
      const response = await axios.post(
        "http://localhost:3000/items",
        formData,
      );

      console.log("Response from server:", response.data);
      alert("Item posted successfully!");

      // Reset form after successful submission
      setFormData({
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
    } catch (err: any) {
      console.error("Submission error:", err);
      alert(
        err.response?.data?.error ||
          "Something went wrong while posting the item.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sell Your Item
          </h1>
          <p className="text-gray-600">
            Fill in the details below to post your item for sale.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="p-6 md:p-8">
            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Image URL Input & Live Preview */}
              <div className="lg:w-1/2 flex flex-col justify-between">
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
                      placeholder="Paste image link here (e.g., https://example.com/image.jpg)"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                    ${errors.imageUrl ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.imageUrl && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.imageUrl}
                      </p>
                    )}
                  </div>

                  {/* Dynamic Image Preview Box */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-[300px] max-h-[400px]">
                      {formData.imageUrl && !errors.imageUrl ? (
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
                          className="w-full h-full object-contain max-h-[400px]"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "";
                            setErrors((prev) => ({
                              ...prev,
                              imageUrl:
                                "Invalid image link or URL is not accessible.",
                            }));
                          }}
                        />
                      ) : (
                        <div className="text-center p-6 text-gray-400">
                          <svg
                            className="mx-auto h-12 w-12 mb-2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-sm">
                            Provide a valid image URL to see preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:w-1/2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter item title"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                  ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Category and Price Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white
                    ${errors.category ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.category}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Price (tk)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                    ${errors.price ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white
                  ${errors.condition ? "border-red-500" : "border-gray-300"}`}
                  >
                    <option value="">Select condition</option>
                    {conditions.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.condition}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your item..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Contact Option */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Option
                  </label>
                  <div className="flex gap-3">
                    <label className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="contactOption"
                        value="show-phone"
                        checked={formData.contactOption === "show-phone"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">Show Phone Number</span>
                    </label>

                    <label className="flex-1 flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="contactOption"
                        value="chat-only"
                        checked={formData.contactOption === "chat-only"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">Chat Only</span>
                    </label>
                  </div>

                  {formData.contactOption === "show-phone" && (
                    <div className="mt-3">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
          ${errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting} // Disable button during API call
                    className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg
                    ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"}`}
                  >
                    {isSubmitting ? "Posting..." : "Post Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellItemForm;
