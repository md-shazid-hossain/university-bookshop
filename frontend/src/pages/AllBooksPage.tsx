import { useEffect, useState } from "react";
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

const AllBooksPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [books, setBooks] = useState<Item[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          "http://localhost:3000/items"
        );

        const bookItems = data.filter(
          (item: Item) => item.category === "Books"
        );

        setItems(bookItems);
        setBooks(bookItems);
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

  useEffect(() => {
    const filtered = items.filter((book) =>
      book.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setBooks(filtered);
  }, [search, items]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          📚 Book Marketplace
        </h1>

        <p className="text-gray-500 mt-1">
          Discover books shared by students
        </p>
      </div>

      {/* Stats + Search */}
      <div className="grid md:grid-cols-[220px_1fr] gap-4 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Available Books
          </p>

          <h2 className="text-3xl font-bold mt-1">
            {books.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 outline-none"
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
            Try another search term.
          </p>
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

                <Link
                  to={`${item.id}`}
                  className="block mt-5 text-center py-2 border rounded-lg hover:bg-gray-50 transition"
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

export default AllBooksPage;