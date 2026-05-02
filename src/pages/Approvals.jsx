import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Approvals() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const { data } = await supabase
      .from("transactions")
      .select(`
        id,
        type,
        amount,
        status,
        members(name),
        groups(name)
      `)
      .eq("status", "pending");

    setTransactions(data || []);
  };

  const card = {
  padding: "15px",
  background: "#fff",
  marginTop: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};



  const approve = async (t) => {
  // Level 1 Approval
  if (!t.level1_approved && currentUser === t.approver1) {
    await supabase
      .from("transactions")
      .update({ level1_approved: true })
      .eq("id", t.id);
  }

  // Level 2 Approval
  else if (
    t.level1_approved &&
    !t.level2_approved &&
    currentUser === t.approver2
  ) {
    await supabase
      .from("transactions")
      .update({
        level2_approved: true,
        status: "approved",
      })
      .eq("id", t.id);
  }

  else {
    alert("You are not authorized to approve this step");
  }

  fetchPending();
};

const [currentUser, setCurrentUser] = useState("");

useEffect(() => {
  // TEMP: simulate logged-in user
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setCurrentUser(data.user.id); // REAL USER ID
    }
  };

  getUser();
}, []);
}, []);

  return (
    <div style={container}>
      <h2>Pending Approvals</h2>

      {transactions.length === 0 ? (
        <p>No pending transactions</p>
      ) : (
        transactions.map((t) => (
          <div key={t.id} style={card}>
            <h4>{t.groups?.name}</h4>
            <p>Member: {t.members?.name}</p>
            <p>Type: {t.type}</p>
            <p>Amount: ₹{t.amount}</p>

            <p>
      Status:{" "}
      {t.level2_approved
        ? "Approved"
        : t.level1_approved
        ? "Waiting Level 2"
        : "Waiting Level 1"}
    </p>


            <button
  onClick={() => approve(t)}
  disabled={
    (!t.level1_approved && currentUser !== t.approver1) ||
    (t.level1_approved && currentUser !== t.approver2)
  }
>
  Approve
</button>
          </div>
        ))
      )}
    </div>
  );
}

const container = {
  maxWidth: "420px",
  margin: "auto",
  padding: "15px",
};

