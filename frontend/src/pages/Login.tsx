import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/login", {
        user_id: userId,
        password: password,
      });

      if (res.data.success) {
        console.log("Login successful:", res.data.user);

        // Example: store token/user
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful!");
        navigate('/sellpage/books')
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border p-6 shadow-md"
      >
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="userId" className="mb-2 block font-medium">
            User ID
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            placeholder="Enter your user ID"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 outline-none focus:ring-2"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"} 
        </button>
      </form>
    </div>
  );
};

export default Login;
