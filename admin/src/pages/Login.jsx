import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/images/web_logo.png";

export default function Login() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { token, login } = useAuth();

  const [form, setForm]           = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]         = useState(
    location.state?.deactivated
      ? "Your account has been deactivated. Please contact the administrator."
      : "",
  );
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (token) return <Navigate to={redirectTo} replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-white">
      {/* Left Side - Dark Atmospheric Section */}
      <div
        className="hidden w-1/2 lg:flex lg:flex-col lg:justify-between lg:p-10 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1659456553707-14712bb27032?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Background Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-gray-900/70 via-blue-900/60 to-gray-800/70" />

        {/* Background Image Effect */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:block">
          <div className="absolute -right-48 -top-48 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -left-48 bottom-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        </div>


      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center px-4 py-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
              <span className="text-sm font-semibold uppercase tracking-wide text-[var(--admin-muted)]">ADMIN</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">Welcome to your admin panel</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-ink)]">Email or Username</label>
              <input
                type="text"
                name="email"
                placeholder="admin@example.com"
                required
                autoComplete="username"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-[var(--admin-muted-light)] transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--admin-ink)]">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder:text-[var(--admin-muted-light)] transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted-light)] hover:text-[var(--admin-muted)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} text-sm`} />
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <span className="pi pi-exclamation-triangle mt-0.5 shrink-0 text-sm text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-linear-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-semibold text-[var(--admin-ink)] shadow-lg transition-all duration-200 hover:shadow-xl hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="pi pi-spin pi-spinner text-sm" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-[var(--admin-muted)]">
            Swift Sign — Secure Admin Access
          </p>
        </div>
      </div>
    </div>
  );
}
