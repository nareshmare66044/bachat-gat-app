import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";

export default function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    fetchGroup();
    fetchMembers();
  }, []);

  const fetchGroup = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    setGroup(data);
  };

  

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId);

    setMembers(data || []);
  };

  const addMember = async () => {
    if (!memberName) return;

    await supabase.from("members").insert([
      {
        name: memberName,
        group_id: groupId,
      },
    ]);

    setMemberName("");
    fetchMembers();
  };

  return (
    <div style={container}>
      {group && (
        <>
          <h2>{group.name}</h2>
          <p>Interest: {group.interest_rate}</p>
        </>
      )}

      <hr />

      <h3>Members</h3>

      {/* ✅ Add Member */}
      <input
        placeholder="Enter member name"
        value={memberName}
        onChange={(e) => setMemberName(e.target.value)}
      />

      <button onClick={addMember}>Add Member</button>

      {/* ✅ Members List */}
      <div style={{ marginTop: "20px" }}>
        {members.map((m) => (
          <div key={m.id} style={card}>
            {m.name}
          </div>
        ))}

        <button onClick={() => navigate(`/groups/${groupId}/transactions`)}>
          Add Transactions
        </button>

        

      </div>
    </div>
  );
  
}

const card = {
  padding: "10px",
  background: "#fff",
  marginTop: "10px",
  borderRadius: "8px",
};

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};