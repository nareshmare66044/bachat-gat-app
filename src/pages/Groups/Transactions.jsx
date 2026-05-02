import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabase";

export default function Transactions() {
  const { groupId } = useParams();

  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({
    member_id: "",
    type: "saving",
    amount: "",
  });

  useEffect(() => {
    fetchMembers();
    fetchTransactions();
  }, []);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId);

    setMembers(data || []);
  };

  const fetchTransactions = async () => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  };

  const addTransaction = async () => {
    if (!form.member_id || !form.amount) return;

    const { data: group } = await supabase
  .from("groups")
  .select("*")
  .eq("id", groupId)
  .single();

await supabase.from("transactions").insert([
  {
    group_id: groupId,
    member_id: form.member_id,
    type: form.type,
    amount: Number(form.amount),
    status: "pending",
    level1_approved: false,
    level2_approved: false,
    approver1: group.approver1,
    approver2: group.approver2,
  },
]);

    setForm({ member_id: "", type: "saving", amount: "" });
    fetchTransactions();
  };

  



  return (
    <div style={container}>
      <h2>Transactions</h2>

      {/* Form */}
      <div style={card}>
        <select
          value={form.member_id}
          onChange={(e) =>
            setForm({ ...form, member_id: e.target.value })
          }
        >
          <option value="">Select Member</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <br /><br />

        <select
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="saving">Saving</option>
          <option value="loan">Loan</option>
          <option value="repayment">Repayment</option>
        </select>

        <br /><br />

        <input
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <br /><br />

        <button onClick={addTransaction}>Add</button>
      </div>
          
      {/* List */}
      <div style={{ marginTop: "20px" }}>
        {transactions.map((t) => (
          <div key={t.id} style={card}>
            <p>Type: {t.type}</p>
            <p>Amount: ₹{t.amount}</p>
            <p>Date: {new Date(t.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        
      </div>
    </div>
  );
}

const card = {
  padding: "15px",
  background: "#fff",
  borderRadius: "10px",
  marginTop: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};