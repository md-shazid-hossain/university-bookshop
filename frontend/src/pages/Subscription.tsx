import { useEffect, useState } from "react";
import { api } from "../api";

type Subscription = {
  id: number;
  name: string;
  maximum_member: number;
  price: number;
  imageUrl: string;
  gender: string;
  phoneNumber?: string;
};

export default function SubscriptionGroups() {
  const [tab, setTab] = useState<"join" | "create">("join");
  const [groups, setGroups] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    maximum_member: "",
    price: "",
    imageUrl: "",
    gender: "",
    phoneNumber: "",
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions");
      setGroups(res.data);
    } catch (error) {
      console.error("Failed to fetch groups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      maximum_member: "",
      price: "",
      imageUrl: "",
      gender: "",
      phoneNumber: "",
    });
    setEditingId(null);
  };

  const createGroup = async () => {
    try {
      await api.post("/subscriptions", {
        ...form,
        maximum_member: Number(form.maximum_member),
        price: Number(form.price),
        userId: user?.id || 1,
        imageUrl:
          form.imageUrl ||
          "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
      });
      resetForm();
      fetchGroups();
      setTab("join");
    } catch (error) {
      console.error("Failed to create group", error);
    }
  };

  const deleteGroup = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pool?",
    );
    if (!confirmed) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      fetchGroups();
    } catch (error) {
      console.error("Failed to delete group", error);
    }
  };

  const startEdit = (g: Subscription) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      maximum_member: String(g.maximum_member),
      price: String(g.price),
      imageUrl: g.imageUrl,
      gender: g.gender || "",
      phoneNumber: g.phoneNumber || "",
    });
    setTab("create");
  };

  const updateGroup = async () => {
    if (!editingId) return;
    try {
      await api.put(`/subscriptions/${editingId}`, {
        ...form,
        maximum_member: Number(form.maximum_member),
        price: Number(form.price),
      });
      resetForm();
      fetchGroups();
      setTab("join");
    } catch (error) {
      console.error("Failed to update group", error);
    }
  };

  const filteredPools = groups.filter((group) =>
    group.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-gray-500 animate-pulse">
          Loading subscription pools...
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
            {tab === "join"
              ? "Subscription Pools"
              : editingId
                ? "Edit Pool"
                : "Create Pool"}
          </h1>
          <p className="text-gray-500 mt-1">
            {tab === "join"
              ? "Manage and explore shared subscription groups"
              : "Configure your subscription sharing details"}
          </p>
        </div>

        {tab === "join" ? (
          <button
            onClick={() => setTab("create")}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            + Start a Pool
          </button>
        ) : (
          <button
            onClick={() => {
              resetForm();
              setTab("join");
            }}
            className="bg-gray-100 text-gray-700 border px-5 py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Back to Pools
          </button>
        )}
      </div>

      {/* EXPLORE VIEW */}
      {tab === "join" && (
        <>
          {/* Stats + Search */}
          <div className="grid md:grid-cols-[220px_1fr] gap-4 mb-8">
            <div className="bg-white border rounded-xl p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Active Pools</p>
              <h2 className="text-3xl font-bold mt-1">
                {filteredPools.length}
              </h2>
            </div>

            <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center">
              <input
                type="text"
                placeholder="Search your pools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none border rounded-lg px-4 py-3 text-sm focus:border-blue-500"
              />
            </div>
          </div>

          {/* Empty State */}
          {filteredPools.length === 0 ? (
            <div className="bg-white border rounded-2xl py-20 text-center">
              <div className="text-6xl mb-4">📺</div>
              <h2 className="text-2xl font-semibold text-gray-800">
                No pools found
              </h2>
              <p className="text-gray-500 mt-2">
                Start a subscription pool to share your access and costs.
              </p>
              <button
                onClick={() => setTab("create")}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Add Your First Pool
              </button>
            </div>
          ) : (
            /* Cards Grid Layout */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPools.map((group) => (
                <div
                  key={group.id}
                  className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header Area */}
                    <div className="relative bg-gray-50 h-44 flex items-center justify-center border-b">
                      <img
                        src={
                          group.imageUrl ||
                          "https://placehold.co/600x400?text=Subscription"
                        }
                        alt={group.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/600x400?text=No+Logo";
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow font-bold text-blue-600 text-sm">
                        ৳ {group.price}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                        {group.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                          Slots: {group.maximum_member}
                        </span>
                        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                          {group.gender || "Any"} Gender
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions baseline footer */}
                  <div className="p-4 pt-0 flex gap-2 mt-auto">
                    <button
                      onClick={() => startEdit(group)}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm text-gray-700 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => alert("Joined!")}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                    >
                      Join Pool
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FORM VIEW */}
      {tab === "create" && (
        <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
            {editingId
              ? "Update Pool Settings"
              : "Configure New Subscription Pool"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Pool Name
              </label>
              <input
                type="text"
                className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition"
                placeholder="e.g., Netflix Premium"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Price per Member (৳)
              </label>
              <input
                type="number"
                className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition"
                placeholder="150"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Max Members
              </label>
              <input
                type="number"
                className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition"
                placeholder="4"
                value={form.maximum_member}
                onChange={(e) =>
                  setForm({ ...form, maximum_member: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Gender Target
              </label>
              <select
                className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition bg-white"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Any">Any</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600">
                Contact Number
              </label>
              <input
                type="tel"
                className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition"
                placeholder="01XXXXXXXXX"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600">
                Service Icon Logo URL
              </label>
              <input
                type="url"
                className="border rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm transition"
                placeholder="https://..."
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            {/* Image Preview Container */}
            {form.imageUrl && (
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600">
                  Logo Preview
                </label>
                <div className="w-full max-w-[200px] h-28 bg-gray-50 border rounded-xl overflow-hidden flex items-center justify-center shadow-sm">
                  <img
                    src={form.imageUrl}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/600x400?text=Invalid+URL";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <button
              className="px-5 py-2.5 border rounded-xl hover:bg-gray-50 text-sm text-gray-700 transition"
              onClick={() => {
                resetForm();
                setTab("join");
              }}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-semibold transition disabled:opacity-50"
              onClick={editingId ? updateGroup : createGroup}
              disabled={!form.name || !form.price || !form.maximum_member}
            >
              {editingId ? "Save Updates" : "Launch Pool"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}