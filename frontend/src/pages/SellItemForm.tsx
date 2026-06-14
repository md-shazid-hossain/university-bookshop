import { useState, DragEvent, ChangeEvent, FormEvent } from "react";

interface FormData {
  title: string;
  category: string;
  price: string;
  condition: string;
  description: string;
  contactOption: "chat-only" | "show-phone";
  phoneNumber: string;
}

interface ImagePreview {
  file: File;
  preview: string;
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
  });

  const [images, setImages] = useState<ImagePreview[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const categories: string[] = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Books",
    "Vehicles",
    "Real Estate",
    "Sports",
    "Other",
  ];

  const conditions: string[] = ["New", "Like New", "Good", "Fair", "Used"];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: ImagePreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const newImages: ImagePreview[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Handle form submission
      console.log("Form submitted:", { ...formData, images });
      alert("Item posted successfully!");
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
          className="bg-white rounded-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Image Uploader */}
              <div className="lg:w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Images
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer h-full min-h-[400px] flex flex-col justify-center
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
                ${images.length > 0 ? "bg-gray-50" : "bg-white"}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("image-input")?.click()
                  }
                >
                  <input
                    id="image-input"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.preview}
                          alt={`Preview ${idx}`}
                          className="w-full h-24 object-cover rounded-lg shadow"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    Post Item
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
