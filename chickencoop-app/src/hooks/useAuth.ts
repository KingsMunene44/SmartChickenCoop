import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function useAuth() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  return { login, logout, isAuthenticated, error, setError };
}