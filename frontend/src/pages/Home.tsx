import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";

type Item = {
  id: number;
  title: string;
  price: number | string;
  condition: string;
  description: string;
  imageUrl: string;
  category: string;
};

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          "http://localhost:3000/items"
        );

        setItems(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const featuredItems = items.slice(0, 4);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading marketplace...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-gray-900 leading-snug">
              Buy & Sell Everything You Need
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              A student marketplace for books, stationery and more.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                to="/dashboard/all-items"
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Explore Items
              </Link>

              <Link
                to="/sellpage/sell-item-form"
                className="px-5 py-3 border rounded-xl hover:bg-white transition"
              >
                Start Selling
              </Link>
            </div>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            className="w-60 mt-6 md:mt-0"
          />
        </div>
      </div>

      {/* FEATURE STRIP */}
      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            {items.length}
          </p>
          <p className="text-gray-500">Total Listings</p>
        </div>

        <div className="bg-white border rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            Books
          </p>
          <p className="text-gray-500">Top Category</p>
        </div>

        <div className="bg-white border rounded-xl p-5 text-center">
          <p className="text-2xl font-bold text-indigo-600">
            Fast
          </p>
          <p className="text-gray-500">Simple Selling</p>
        </div>
      </div>

      {/* POPULAR ITEMS */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Popular Items
          </h2>

          <Link
            to="/dashboard/all-items"
            className="text-indigo-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {featuredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No items available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={
                      item.imageUrl ||
                      "https://placehold.co/600x400?text=Item"
                    }
                    alt={item.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).src =
                        "https://placehold.co/600x400?text=No+Image";
                    }}
                  />

                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow text-indigo-600 font-bold">
                    ৳ {item.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 min-h-[56px]">
                    {item.title}
                  </h3>

                  <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                    {item.condition}
                  </span>

                  <div className="mt-4">
                    <Link
                      to={`${item.id}`}
                      className="block text-center py-2 border rounded-lg hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;