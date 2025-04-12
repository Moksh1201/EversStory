import { useState } from "react";
import { loginUser } from "./api";
import { useAuthStore } from "./useAuth";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto mt-12">
      <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Login</Button>
    </form>
  );
};
