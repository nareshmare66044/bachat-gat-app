import { useState } from "react";
import { supabase } from "../supabase";
import AnimatedPage from "../components/AnimatedPage";

export default function CreateGroup() {
  const [name, setName] = useState("");

  const createGroup = async () => {
    if (!name) {
      alert("Please enter group name");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const user = userData.user;

    const { error } = await supabase.from("groups").insert([
      {
        name: name,
        created_by: user.id,
        approver1: user.id,
        approver2: "d4cb0d5c-fade-4bce-8903-eab54383301e", // replace later
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error creating group");
      return;
    }

    alert("Group created successfully ✅");
    setName("");
  };

  return (
    <AnimatedPage>
      <div style={container}>
        <h2>Create Group</h2>

        <input
          style={input}
          placeholder="Enter Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button style={button} onClick={createGroup}>
          Create Group
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