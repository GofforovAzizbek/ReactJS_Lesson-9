import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../services/toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (username === "admin" && password === "admin") {
      localStorage.setItem("adminToken", "authenticated");
      localStorage.setItem("adminUser", username);
      if (!localStorage.getItem("authToken")) {
        localStorage.setItem("authToken", "admin-token");
      }
      document.cookie = "adminToken=authenticated; path=/; max-age=86400";
      showSuccess("Welcome back to the admin dashboard.");
      navigate("/admin");
    } else {
      const message = "Invalid username or password. Use admin / admin.";
      setError(message);
      showError("Use admin/admin to access the dashboard.", "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f2f0f1]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] items-center justify-center px-4 py-10">
        <div className="absolute left-[-120px] top-[-80px] h-[260px] w-[260px] rounded-full bg-white/60 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] h-[320px] w-[320px] rounded-full bg-black/5 blur-3xl" />

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden bg-black px-10 py-12 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-sm tracking-[0.28em] text-white/50">SHOP.CO</p>
                <h1 className="mt-6 max-w-[420px] text-5xl font-black uppercase leading-none">
                  Welcome Back To The Control Room
                </h1>
                <p className="mt-6 max-w-[420px] text-base leading-7 text-white/70">
                  Sign in to manage products, reviews, and orders while keeping the storefront aligned with the project design.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50">
                  Demo Access
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    Username: <span className="font-semibold text-white">admin</span>
                  </p>
                  <p>
                    Password: <span className="font-semibold text-white">admin</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-12">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-sm tracking-[0.25em] text-black/40">ADMIN LOGIN</p>
                <h2 className="mt-3 text-4xl font-black text-black">Sign In</h2>
              </div>
              <Link
                to="/"
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:border-black"
              >
                Back Store
              </Link>
            </div>

            <div className="mb-8 rounded-[24px] bg-[#f2f0f1] p-5 lg:hidden">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/40">
                Demo Access
              </p>
              <div className="mt-3 space-y-2 text-sm text-black/70">
                <p>
                  Username: <span className="font-semibold text-black">admin</span>
                </p>
                <p>
                  Password: <span className="font-semibold text-black">admin</span>
                </p>
              </div>
            </div>

            {error ? (
              <div className="mb-6 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black/60">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="admin"
                  className="h-14 w-full rounded-[18px] border border-black/10 bg-white px-4 text-base outline-none transition focus:border-black"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black/60">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="admin"
                  className="h-14 w-full rounded-[18px] border border-black/10 bg-white px-4 text-base outline-none transition focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-14 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Login To Dashboard"}
              </button>
            </form>

            <p className="mt-6 text-sm text-black/45">
              This login is for the project admin area only and keeps the storefront flow untouched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
