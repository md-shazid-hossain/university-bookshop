const StationaryPage = () => {
  type Item = {
    id: number;
    title: string;
    price: string;
    rating: number;
    image: string;
  };

  const items: Item[] = [
    {
      id: 4,
      title: "Class Notes (CSE)",
      price: "120 tk",
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600",
    },
    {
      id: 1,
      title: "Physics Textbook",
      price: "200 tk",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
    },
    {
      id: 4,
      title: "Class Notes (CSE)",
      price: "120 tk",
      rating: 4.2,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600",
    },
    {
      id: 2,
      title: "Notebook Set (5 Pcs)",
      price: "300 tk",
      rating: 4.0,
      image:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
    },
    {
      id: 3,
      title: "Casio fx-991ES Plus",
      price: "250 tk",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600",
    },
  ];

  return (
    <div className="max-w-8xl mx-auto px-4 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          Stationary Items
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-32 object-contain mb-3"
            />

            <h3 className="font-medium text-gray-800">{item.title}</h3>

            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-600">{item.price}</span>
              <span className="text-yellow-500 font-medium">
                ⭐ {item.rating}
              </span>
            </div>

            <button className="mt-3 w-full py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationaryPage;
