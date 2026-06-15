import { useEffect, useState } from "react";
import { api } from "../api";

type Subscription = {
  id: number;
  name: string;
  maximum_member: number;
  price: number;
  imageUrl: string;
};

export default function SubscriptionGroups() {
  const [tab, setTab] = useState<"join" | "create">("join");
  const [groups, setGroups] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [form, setForm] = useState({
    name: "",
    maximum_member: "",
    price: "",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // 📥 GET ALL
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions");
      setGroups(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // ➕ CREATE
  const createGroup = async () => {
    await api.post("/subscriptions", {
      ...form,
      maximum_member: Number(form.maximum_member),
      price: Number(form.price),
      gender: "all",
      userId: 1,
      imageUrl:
        form.imageUrl ||
        "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    });

    setForm({ name: "", maximum_member: "", price: "", imageUrl: "" });
    fetchGroups();
    setTab("join");
  };

  // 🗑 DELETE
  const deleteGroup = async (id: number) => {
    await api.delete(`/subscriptions/${id}`);
    fetchGroups();
  };

  // ✏️ EDIT START
  const startEdit = (g: Subscription) => {
    setEditingId(g.id);
    setForm({
      name: g.name,
      maximum_member: String(g.maximum_member),
      price: String(g.price),
      imageUrl: g.imageUrl,
    });
    setTab("create");
  };

  // 💾 UPDATE
  const updateGroup = async () => {
    if (!editingId) return;

    await api.put(`/subscriptions/${editingId}`, {
      ...form,
      maximum_member: Number(form.maximum_member),
      price: Number(form.price),
    });

    setEditingId(null);
    setForm({ name: "", maximum_member: "", price: "", imageUrl: "" });
    fetchGroups();
    setTab("join");
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Tabs */}
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
            {editingId ? "Update Group" : "Create Group"}
          </button>
        </div>
      </div>

      {/* JOIN VIEW */}
      {tab === "join" && (
        <>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="card bg-base-100 shadow-md hover:shadow-xl transition"
                >
                  <div className="card-body items-center text-center">
                    <img
                      src={group.imageUrl}
                      className="w-14 h-14 rounded-full"
                    />

                    <h3 className="card-title">{group.name}</h3>

                    <p className="text-sm opacity-70">
                      Max: {group.maximum_member}
                    </p>

                    <p className="font-semibold text-green-600">
                      ৳ {group.price}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => alert("Joined!")}
                      >
                        Join
                      </button>

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => startEdit(group)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => deleteGroup(group.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* CREATE / UPDATE VIEW */}
      {tab === "create" && (
        <div className="flex justify-center">
          <div className="card bg-base-100 shadow w-full max-w-md">
            <div className="card-body space-y-3">
              <h2 className="text-lg font-bold">
                {editingId ? "Update Group" : "Create Group"}
              </h2>

              <input
                className="input input-bordered"
                placeholder="Service name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <input
                className="input input-bordered"
                placeholder="Max members"
                value={form.maximum_member}
                onChange={(e) =>
                  setForm({ ...form, maximum_member: e.target.value })
                }
              />

              <input
                className="input input-bordered"
                placeholder="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />

              <input
                className="input input-bordered"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
              />

              <button
                className={`btn ${
                  editingId ? "btn-warning" : "btn-success"
                }`}
                onClick={editingId ? updateGroup : createGroup}
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}