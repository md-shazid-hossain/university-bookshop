import React from "react";

type Item = {
  id: number;
  title: string;
  price: string;
  rating: number;
  image: string;
};

type Subscription = {
  id: number;
  title: string;
  members: string;
  price: string;
};

const items: Item[] = [
  {
    id: 1,
    title: "Physics Textbook",
    price: "200 tk",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
  },
  {
    id: 2,
    title: "Notebook Set (5 Pcs)",
    price: "300 tk",
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
  },
  {
    id: 3,
    title: "Casio fx-991ES Plus",
    price: "250 tk",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=600",
  },
  {
    id: 4,
    title: "Class Notes (CSE)",
    price: "120 tk",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600",
  },
];

const subscriptions: Subscription[] = [
  {
    id: 1,
    title: "Netflix Group",
    members: "2/4",
    price: "200 tk per user",
  },
  {
    id: 2,
    title: "Canva Pro Group",
    members: "2/4",
    price: "100 tk per user",
  },
  {
    id: 3,
    title: "Spotify Premium",
    members: "3/5",
    price: "80 tk per user",
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-8xl mx-auto px-4 pt-8">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
              Everything students need, <br />
              from students like you.
            </h1>
            <p className="mt-4 text-gray-600">
              Buy, sell and share books, stationery and subscriptions.
            </p>

            <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Explore Now
            </button>
          </div>

          {/* Right Image */}
          <div className="mt-6 md:mt-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              alt="student"
              className="w-64"
            />
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="max-w-8xl mx-auto px-4 mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Popular Items</h2>
          <button className="text-indigo-600 hover:underline">View all</button>
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

      {/* Subscription Groups Section */}
      <div className="max-w-8xl mx-auto px-4 mt-12 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Subscription Groups
          </h2>
          <button className="text-indigo-600 hover:underline">View all</button>
        </div>

        {/* Subscription Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {sub.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Members: {sub.members}
                  </p>
                </div>
                <div className="bg-indigo-50 px-3 py-1 rounded-full">
                  <span className="text-indigo-600 font-medium text-sm">
                    Available
                  </span>
                </div>
              </div>

              <p className="text-2xl font-bold text-gray-800 mt-4">
                {sub.price}
              </p>

              <button className="mt-4 w-full py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Join Group
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
