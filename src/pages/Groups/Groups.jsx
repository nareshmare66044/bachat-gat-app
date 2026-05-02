import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const { data } = await supabase.from("groups").select("*");
    setGroups(data || []);
  };

  return (
    <AnimatedPage>
      <div style={container}>
        <h2>Your Groups</h2>

        {groups.map((g) => (
          <div
            key={g.id}
            style={card}
            onClick={() => navigate(`/dashboard/${g.id}`)}
          >
            <h4>{g.name}</h4>
          </div>
        ))}

        <button style={button} onClick={() => navigate("/create-group")}>
          Create Group
        </button>
      </div>
    </AnimatedPage>
  );
}

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};

const card = {
  padding: "15px",
  background: "#fff",
  marginTop: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  cursor: "pointer",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "20px",
};