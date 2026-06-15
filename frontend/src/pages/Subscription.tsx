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
    if (!window.confirm("Are you sure you want to delete this group?")) return;
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

    resetForm();
    fetchGroups();
    setTab("join");
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="tabs tabs-boxed bg-base-100 shadow-sm">
          <button
            className={`tab px-8 ${tab === "join" ? "tab-active font-bold" : ""}`}
            onClick={() => {
              setTab("join");
              resetForm();
            }}
          >
            Join Group
          </button>
          <button
            className={`tab px-8 ${tab === "create" ? "tab-active font-bold" : ""}`}
            onClick={() => setTab("create")}
          >
            {editingId ? "Update Group" : "Create Group"}
          </button>
        </div>
      </div>

      {/* LIST TAB */}
      {tab === "join" && (
        <>
          {loading ? (
            <div className="flex justify-center mt-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img src={group.imageUrl} alt={group.name} />
                        </div>
                      </div>
                      <div>
                        <h2 className="card-title text-lg font-bold">
                          {group.name}
                        </h2>
                        <div className="flex gap-2 mt-1">
                          <div className="badge badge-outline text-xs">
                            {group.gender}
                          </div>
                          <div className="badge badge-ghost text-xs">
                            Max: {group.maximum_member}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="flex justify-between items-center text-sm">
                        <span className="text-base-content/70">Price</span>
                        <span className="text-success font-bold text-lg">
                          ৳ {group.price}
                        </span>
                      </p>
                      {group.phoneNumber && (
                        <p className="flex justify-between items-center text-sm">
                          <span className="text-base-content/70">Contact</span>
                          <span className="font-medium">
                            📞 {group.phoneNumber}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="card-actions justify-end mt-auto pt-4 border-t border-base-200">
                      <button
                        className="btn btn-primary btn-sm flex-1"
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
                        className="btn btn-error btn-sm btn-square"
                        onClick={() => deleteGroup(group.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* FORM TAB */}
      {tab === "create" && (
        <div className="flex justify-center">
          <div className="card bg-base-100 shadow-xl w-full max-w-2xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 justify-center">
                {editingId ? "Update Subscription Group" : "Create New Group"}
              </h2>

              {/* Image Preview */}
              <div className="flex flex-col items-center mb-6">
                <div className="avatar mb-2">
                  <div className="w-24 h-24 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2 bg-base-200">
                    <img
                      src={
                        form.imageUrl ||
                        "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                      }
                      alt="Preview"
                      className="object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://cdn-icons-png.flaticon.com/512/1828/1828884.png")
                      }
                    />
                  </div>
                </div>
                <span className="text-xs text-base-content/50">
                  Image Preview
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Group Name</span>
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Netflix Premium"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Price (৳)</span>
                  </div>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="150"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Max Members</span>
                  </div>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="4"
                    value={form.maximum_member}
                    onChange={(e) =>
                      setForm({ ...form, maximum_member: e.target.value })
                    }
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">
                      Gender Requirement
                    </span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Any">Any</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Phone Number</span>
                  </div>
                  <input
                    type="tel"
                    className="input input-bordered w-full"
                    placeholder="+880 1..."
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text font-medium">Image URL</span>
                  </div>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    placeholder="https://..."
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="card-actions justify-end mt-8">
                {editingId && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      resetForm();
                      setTab("join");
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  className={`btn ${editingId ? "btn-warning" : "btn-primary"} min-w-[120px]`}
                  onClick={editingId ? updateGroup : createGroup}
                  disabled={!form.name || !form.price || !form.maximum_member}
                >
                  {editingId ? "Save Changes" : "Create Group"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
