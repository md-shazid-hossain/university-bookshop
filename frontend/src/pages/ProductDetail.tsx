import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { MessageSquare, Phone, ArrowLeft, ShieldCheck, Tag, Info } from "lucide-react";

interface ItemDetail {
  id: number;
  title: string;
  category: string;
  price: number | string;
  condition: string;
  description: string;
  contactOption: "chat-only" | "show-phone";
  phoneNumber: string | null;
  imageUrl: string;
  createdAt: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [revealPhone, setRevealPhone] = useState<boolean>(false);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        setLoading(true);
        // Request specific item data by ID
        const response = await axios.get(`http://localhost:3000/items/${id}`);
        setItem(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching item details:", err);
        setError(err.response?.data?.error || "Failed to find this item.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="text-xl font-medium text-gray-600 animate-pulse">Loading item details...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-12 text-center">
        <div className="text-red-500 font-medium bg-red-50 p-6 rounded-xl border border-red-200 inline-block">
          {error || "Item not found."}
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 block mx-auto text-blue-600 hover:underline flex items-center gap-1 justify-center"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Listings
        </button>

        {/* Product Layout Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-8">
          
          {/* Left Column: Image Box */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden p-4 border border-gray-200 min-h-[350px] max-h-[500px]">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-contain max-h-[450px]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image+Available";
              }}
            />
          </div>

          {/* Right Column: Product Specs & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Category Tag */}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 mb-3">
                <Tag className="w-3 h-3" /> {item.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              
              {/* Price */}
              <p className="text-4xl font-extrabold text-blue-600 mb-4">{item.price} <span className="text-lg font-medium text-gray-500">tk</span></p>

              <hr className="border-gray-100 my-4" />

              {/* Core Details Info */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-28 font-medium text-gray-500">Condition:</span>
                  <span className="px-2.5 py-0.5 bg-green-50 text-green-700 font-semibold rounded-md text-xs border border-green-200">
                    {item.condition}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-28 font-medium text-gray-500">Posted on:</span>
                  <span className="text-gray-900 font-medium">
                    {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Description Section */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                  <Info className="w-4 h-4 text-gray-500" /> Description
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {item.description || "No description provided for this item."}
                </p>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              
              {/* Conditional Action based on Database Option */}
              {item.contactOption === "show-phone" && item.phoneNumber ? (
                <div>
                  {revealPhone ? (
                    <a
                      href={`tel:${item.phoneNumber}`}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-sm"
                    >
                      <Phone className="w-5 h-5" />
                      Call {item.phoneNumber}
                    </a>
                  ) : (
                    <button
                      onClick={() => setRevealPhone(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg"
                    >
                      <Phone className="w-5 h-5" />
                      Show Phone Number
                    </button>
                  )}
                </div>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg">
                  <MessageSquare className="w-5 h-5" />
                  Chat with Seller
                </button>
              )}

              {/* Safety notice disclaimer */}
              <div className="flex items-start gap-2 text-xs text-gray-400 bg-amber-50/60 p-3 rounded-lg border border-amber-100/50 mt-4">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <span className="font-semibold text-amber-800">Safety Tip:</span> Avoid paying advance amounts before inspecting the item in person. Meet in a secure public location.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetail;