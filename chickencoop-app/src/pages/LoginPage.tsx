// src/pages/LoginPage.jsx
import LoginForm from "../components/Auth/LoginForm";

function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-center bg-cover bg-no-repeat bg-fixed bg-login">
      {/* Stronger overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-black/30 to-black/50" />

      <div className="relative z-10 flex items-center justify-center min-h-screen w-full p-4">
        <div className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-2xl shadow-lg p-6 md:p-8 max-w-md w-full animate-fade-in">
          <h1 className="text-3xl font-bold text-black text-center mb-4">
            Welcome back!
          </h1>
          <p className="text-black text-center mb-6">
            Manage your Smart Chicken Coop easily.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;