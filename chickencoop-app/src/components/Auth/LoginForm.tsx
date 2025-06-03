// src/components/Auth/LoginForm.tsx

import { FormEvent, useState } from "react";
import { api } from "../../api/api";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = () => {
  const { login, error: authError, setError: setAuthError } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setAuthError(null);

    try {
      const response = await api.login({ username, password });

      if (response) {
        // Save the username to localStorage after successful login
        localStorage.setItem("username", username);
        login(response.data.token);
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          setFormError("User does not exist.");
        } else if (err.response?.status === 401) {
          setFormError("Wrong password.");
        } else {
          setFormError("Something went wrong. Please try again.");
        }
      } else {
        setFormError("Unexpected error. Please try again.");
      }
    }
  };

  // Type guard to check if error is AxiosError
  function isAxiosError(error: unknown): error is { response?: { status: number } } {
    return typeof error === "object" && error !== null && "response" in error;
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

      {(formError || authError) && (
        <div className="text-red-500 text-center mb-4">{formError || authError}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            className="mt-1 p-2 w-full border rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            className="mt-1 p-2 w-full border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-4">
        New user?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Create a free account with us.
        </a>
      </p>
    </div>
  );
};

export default LoginForm;