import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

const BooksPage = () => {
  const navigate = useNavigate();
  type Item = {
    id: number;
    title: string;
    price: number | string;
    condition: string;
    description: string;
    imageUrl: string;
    category: string;

    // Add this if your backend stores item owner
    userId?: number;
  };

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fromLocalStorage = localStorage.getItem("user");
  const user = fromLocalStorage ? JSON.parse(fromLocalStorage) : null;

  // Change this filter according to your database structure
  const books = items.filter(
    (item) =>
      item.category === "Books" &&
      (item.userId === user?.id || item.id === user?.id),
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:3000/items");

        setItems(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/items/${id}`);

      // Update UI instantly
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));

      alert("Item deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl font-medium text-gray-600 animate-pulse">
          Loading items...
        </div>
      </div>
    );
  }

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
        <h2 className="text-3xl font-semibold text-gray-800">Your Books</h2>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {books.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={
                    item.imageUrl || "https://i.ibb.co.com/chmc3g62/428639.jpg"
                  }
                  alt={item.title}
                  className="w-full h-32 object-contain mb-3 bg-gray-50 rounded-lg"
                  onError={(e) => {
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

                <div className="mt-3 flex gap-2">
                  <Link
                    to={String(item.id)}
                    className="flex-1 py-2 text-center text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/sellpage/update/${item.id}`);
                    }}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksPage;
