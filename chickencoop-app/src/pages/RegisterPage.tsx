import RegisterForm from "../components/Auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full bg-register bg-cover bg-center bg-no-repeat">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

      <div className="relative z-10 flex items-center justify-center min-h-screen w-full p-4">
        <div className="backdrop-blur-lg bg-white/30 border border-white/40 rounded-2xl shadow-lg p-8 max-w-md w-full animate-fade-in">
          <h1 className="text-3xl font-bold text-white text-center mb-4 drop-shadow-lg">
            Create your account
          </h1>
          <p className="text-white text-center mb-6 drop-shadow-sm">
            Register with your Username and Password and begin managing your SmartCoop in the App from Anywhere!.
          </p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;