import { useState, useEffect } from "react"; // 1. Import hooks
import axios from "axios"; // 2. Import axios
import { Link } from "react-router";

const AllItems = () => {
  // Adjusted Type definitions to match your backend Item schema
  type Item = {
    id: number;
    title: string;
    price: number | string; // Keeps flexibility depending on how decimal maps
    condition: string;
    description: string;
    imageUrl: string; // Matched database column name
    category: string;
  };

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log(items);



  // 3. Fetch data inside useEffect on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        // Replace with your production URL if necessary
        const response = await axios.get("http://localhost:3000/items");

        // Filter for "Books" category if you want this page to only show books
        const allItems: Item[] = response.data;

        setItems(allItems);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching items:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading items...
        </div>
      </div>
    );
  }

  // Handle Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-8xl mx-auto px-4 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          All Items
        </h2>
      </div>

      {/* Grid handling empty state */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src="https://i.ibb.co.com/chmc3g62/428639.jpg" // Updated to use imageUrl
                  alt={item.title}
                  className="w-full h-32 object-contain mb-3 bg-gray-50 rounded-lg"
                  onError={(e) => {
                    // Fallback placeholder image if a broken URL is fed from DB
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x400?text=No+Image";
                  }}
                />

                <h3 className="font-medium text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider bg-gray-100 w-max px-2 py-0.5 rounded">
                  {item.condition}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <span className="text-blue-600 font-semibold">
                    {item.price} tk
                  </span>
                </div>

                <Link
                  to={String(item.id)}
                  className="mt-3 w-full py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllItems;
