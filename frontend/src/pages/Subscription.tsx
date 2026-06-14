import { useState } from "react";

type Group = {
  id: number;
  name: string;
  logo: string;
  members: string;
  price: string;
  capacity: string;
};

const groups: Group[] = [
  {
    id: 1,
    name: "Netflix",
    logo: "https://cdn-icons-png.flaticon.com/512/732/732228.png",
    members: "2/4",
    price: "200 tk / user",
    capacity: "4",
  },
  {
    id: 2,
    name: "Canva Pro",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    members: "1/4",
    price: "100 tk / user",
    capacity: "4",
  },
  {
    id: 3,
    name: "Spotify Premium",
    logo: "https://cdn-icons-png.flaticon.com/512/2111/2111624.png",
    members: "3/5",
    price: "80 tk / user",
    capacity: "5",
  },
  {
    id: 4,
    name: "Disney+",
    logo: "https://cdn-icons-png.flaticon.com/512/5969/5969040.png",
    members: "2/4",
    price: "120 tk / user",
    capacity: "4",
  },
  {
    id: 5,
    name: "YouTube Premium",
    logo: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
    members: "1/4",
    price: "90 tk / user",
    capacity: "4",
  },
  {
    id: 6,
    name: "Adobe Creative Cloud",
    logo: "https://cdn-icons-png.flaticon.com/512/5968/5968520.png",
    members: "2/3",
    price: "150 tk / user",
    capacity: "3",
  },
];

export default function SubscriptionGroups() {
  const [tab, setTab] = useState<"join" | "create">("join");

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Top Tabs */}
      <div className="flex justify-center mb-6">
        <div className="tabs tabs-boxed bg-base-100 shadow">
          <button
            className={`tab ${tab === "join" ? "tab-active" : ""}`}
            onClick={() => setTab("join")}
          >
            Join Group
          </button>
          <button
            className={`tab ${tab === "create" ? "tab-active" : ""}`}
            onClick={() => setTab("create")}
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4 text-center">
        Available Subscription Groups
      </h2>

      {/* Grid */}
      {tab === "join" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition"
            >
              <div className="card-body items-center text-center">
                <img
                  src={group.logo}
                  alt={group.name}
                  className="w-12 h-12 mb-2"
                />

                <h3 className="card-title">{group.name}</h3>

                <p className="text-sm opacity-70">
                  Members: {group.members}
                </p>

                <p className="font-semibold">{group.price}</p>

                <div className="card-actions mt-3">
                  <button className="btn btn-primary btn-sm">
                    Join Group
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Placeholder */}
      {tab === "create" && (
        <div className="flex justify-center">
          <div className="card bg-base-100 shadow w-full max-w-md">
            <div className="card-body">
              <h2 className="text-lg font-bold">Create a Group</h2>

              <input
                type="text"
                placeholder="Service name"
                className="input input-bordered w-full"
              />

              <input
                type="number"
                placeholder="Max members"
                className="input input-bordered w-full"
              />

              <input
                type="number"
                placeholder="Price per user"
                className="input input-bordered w-full"
              />

              <button className="btn btn-success mt-2">
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}