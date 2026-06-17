import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";

type Item = {
  id: number;
  title: string;
  price: number | string;
  condition: string;
  description: string;
  imageUrl: string;
  category: string;
  userId?: number;
};

const BooksPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          "http://localhost:3000/items",
        );

        setItems(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `http://localhost:3000/items/${id}`
      );

      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  };

  const books = items
    .filter(
      (item) =>
        item.category === "Books" &&
        item.userId === user?.id
    )
    .filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading books...
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Books
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your listed books
          </p>
        </div>

        <button
          onClick={() => navigate("/sellpage/sell-item-form")}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          + Add Book
        </button>
      </div>

      {/* Stats + Search */}
      <div className="grid md:grid-cols-[220px_1fr] gap-4 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Listings
          </p>
          <h2 className="text-3xl font-bold mt-1">
            {books.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search your books..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full outline-none border rounded-lg px-4 py-3"
          />
        </div>
      </div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="bg-white border rounded-2xl py-20 text-center">
          <div className="text-6xl mb-4">📚</div>

          <h2 className="text-2xl font-semibold">
            No books found
          </h2>

          <p className="text-gray-500 mt-2">
            Start selling your books today.
          </p>

          <button
            onClick={() => navigate("/sellpage")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            Add Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={
                    item.imageUrl ||
                    "https://placehold.co/600x400?text=Book"
                  }
                  alt={item.title}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    (
                      e.target as HTMLImageElement
                    ).src =
                      "https://placehold.co/600x400?text=No+Image";
                  }}
                />

                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow font-bold text-blue-600">
                  ৳ {item.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 min-h-[56px]">
                  {item.title}
                </h3>

                <div className="mt-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      item.condition === "New"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.condition}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-3 line-clamp-3 min-h-[60px]">
                  {item.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-5">
                  <Link
                    to={`${item.id}`}
                    className="flex-1 text-center py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() =>
                      navigate(
                        `/sellpage/update/${item.id}`
                      )
                    }
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                    
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
