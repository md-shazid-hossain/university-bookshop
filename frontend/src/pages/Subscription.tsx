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
  socialMediagroulUrl?: string;
};

export default function SubscriptionGroups() {
  const [tab, setTab] = useState<"join" | "create">("join");
  const [groups, setGroups] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    maximum_member: "",
    price: "",
    imageUrl: "",
    gender: "",
    phoneNumber: "",
  });

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

  const resetForm = () => {
    setForm({
      name: "",
      maximum_member: "",
      price: "",
      imageUrl: "",
      gender: "",
      phoneNumber: "",
    });
  };

  // ➕ CREATE
  const createGroup = async () => {
    await api.post("/subscriptions", {
      ...form,
      maximum_member: Number(form.maximum_member),
      price: Number(form.price),
      userId: 1,
      imageUrl:
        form.imageUrl ||
        "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    });

    resetForm();
    fetchGroups();
    setTab("join");
  };

  // 🗑 DELETE
  const deleteGroup = async (id: number) => {
    await api.delete(`/subscriptions/${id}`);
    fetchGroups();
  };

  // ✏️ EDIT
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

  // 💾 UPDATE
  const updateGroup = async () => {
    if (!editingId) return;

    await api.put(`/subscriptions/${editingId}`, {
      ...form,
      maximum_member: Number(form.maximum_member),
      price: Number(form.price),
    });

    setEditingId(null);
    resetForm();
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

      {/* LIST */}
      {tab === "join" && (
        <>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div key={group.id} className="card bg-base-100 shadow-md">
                  <div className="card-body text-center items-center">
                    <img
                      src={group.imageUrl}
                      className="w-14 h-14 rounded-full"
                    />

                    <h2 className="card-title">{group.name}</h2>

                    <p>Gender: {group.gender}</p>
                    <p>Max: {group.maximum_member}</p>
                    <p className="text-green-600 font-bold">৳ {group.price}</p>

                    {group.phoneNumber && (
                      <p className="text-sm">📞 {group.phoneNumber}</p>
                    )}

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

      {/* FORM */}
      {tab === "create" && (
        <div className="flex justify-center">
          <div className="card bg-base-100 shadow w-full max-w-md">
            <div className="card-body space-y-3">

              <input className="input input-bordered" placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input className="input input-bordered" placeholder="Max Members"
                value={form.maximum_member}
                onChange={(e) => setForm({ ...form, maximum_member: e.target.value })}
              />

              <input className="input input-bordered" placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />

              <input className="input input-bordered" placeholder="Gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              />

              <input className="input input-bordered" placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />

              <input className="input input-bordered" placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />

              <button
                className={`btn ${editingId ? "btn-warning" : "btn-success"}`}
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