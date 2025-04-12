import { useState } from "react";
import { signupUser } from "./api";
import { useAuthStore } from "./useAuth";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signupUser(form);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto mt-12">
      <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button type="submit">Sign Up</Button>
    </form>
  );
};
