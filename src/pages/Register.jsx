import { useState } from "react";
import { supabase } from "../supabase";
import AnimatedPage from "../components/AnimatedPage";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      alert("Registered successfully ✅");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <AnimatedPage>
      <div style={container}>
        <h2>Register</h2>

        <input
          style={input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={button} onClick={handleRegister}>
          Register
        </button>
      </div>
    </AnimatedPage>
  );
}

/* Styles */

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};

const input = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "15px",
};