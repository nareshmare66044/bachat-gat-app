import { useState } from "react";
import { supabase } from "../supabase";

export default function CreateGroup() {
  const [name, setName] = useState("");

  const createGroup = async () => {
    const user = await supabase.auth.getUser();

    await supabase.from("groups").insert([
    {
      name: name,
      created_by: user.data.user.id,
      approver1: user.data.user.id, // creator = level 1
      approver2: "d4cb0d5c-fade-4bce-8903-eab54383301e", // temporary
    },
  ]);
};
  return (
    <div style={container}>
      <h2>Create Group</h2>

      <input
        placeholder="Group Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={createGroup}>Create</button>
    </div>
  );
}

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};