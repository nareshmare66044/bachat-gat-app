import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import AnimatedPage from "../../components/AnimatedPage";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberStats, setMemberStats] = useState([]);
  const [memberName, setMemberName] = useState("");

  useEffect(() => {
    fetchGroup();
    fetchMembers();
    fetchMemberStats();
  }, []);

  // ✅ Fetch group
  const fetchGroup = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    setGroup(data);
  };

  // ✅ Fetch members
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId);

    setMembers(data || []);
  };

  // ✅ Fetch transactions + calculate stats
  const fetchMemberStats = async () => {
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("group_id", groupId)
      .eq("status", "approved");

    const { data: members } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId);

    const stats = (members || []).map((m) => {
      let savings = 0;
      let loan = 0;
      let repayment = 0;
      let interest = 0;

      (transactions || []).forEach((t) => {
        if (t.member_id === m.id) {
          if (t.type === "saving") savings += t.amount;

          if (t.type === "loan") {
            loan += t.amount;

            // ✅ Interest calculation
            if (group?.interest_rate) {
              interest += t.amount * (group.interest_rate / 100);
            }
          }

          if (t.type === "repayment") repayment += t.amount;
        }
      });

      return {
        ...m,
        savings,
        loan,
        repayment,
        interest,
        balance: loan + interest - repayment,
      };
    });

    setMemberStats(stats);
  };

  // ✅ Add member
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
    fetchMemberStats();
  };

  return (
    <AnimatedPage>
      <div style={container}>
        {group && (
          <>
            <h2>{group.name}</h2>
            <p>Interest: {group.interest_rate}%</p>
          </>
        )}

        <hr />

        <h3>Members</h3>

        {/* Add Member */}
        <input
          style={input}
          placeholder="Enter member name"
          value={memberName}
          onChange={(e) => setMemberName(e.target.value)}
        />

        <button style={button} onClick={addMember}>
          Add Member
        </button>

        {/* Member Stats */}
        <div style={{ marginTop: "20px" }}>
          {memberStats.map((m) => (
            <div key={m.id} style={card}>
              <h4>{m.name}</h4>
              <p>Savings: ₹{m.savings}</p>
              <p>Loan: ₹{m.loan}</p>
              <p>Interest: ₹{m.interest}</p>
              <p>Repayment: ₹{m.repayment}</p>
              <p>
                <strong>Balance: ₹{m.balance}</strong>
              </p>
            </div>
          ))}
        </div>

        {/* Navigate to Transactions */}
        <button
          style={{ ...button, marginTop: "20px" }}
          onClick={() => navigate(`/groups/${groupId}/transactions`)}
        >
          Add Transactions
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

const card = {
  padding: "15px",
  background: "#fff",
  marginTop: "10px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
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
  marginTop: "10px",
};