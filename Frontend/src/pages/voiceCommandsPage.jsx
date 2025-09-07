import React, { useState } from "react";
import "./VoiceCommand.css"; // Import the CSS file

const VoiceCommandPage = () => {
  const defaultCommands = [
    {
      phrase: "Send money to [name]",
      description: "Transfer funds to specified contact",
      tag: "Payments",
    },
    {
      phrase: "Check my balance",
      description: "Display current account balance",
      tag: "Account",
    },
    {
      phrase: "Show transaction history",
      description: "Navigate to transactions page",
      tag: "History",
    },
    {
      phrase: "Pay [bill type] bill",
      description: "Process bill payment",
      tag: "Bills",
    },
  ];

  const [customCommands, setCustomCommands] = useState([
    {
      phrase: "Pay my electricity bill",
      description: "Transfer ₹1200 to Electricity Board",
      status: "Active",
    },
    {
      phrase: "Send money to mom",
      description: "Transfer ₹500 to Mom",
      status: "Active",
    },
  ]);

  const [voicePhrase, setVoicePhrase] = useState("");
  const [actionDescription, setActionDescription] = useState("");

  const addCustomCommand = () => {
    if (voicePhrase.trim() && actionDescription.trim()) {
      setCustomCommands([
        ...customCommands,
        { phrase: voicePhrase, description: actionDescription, status: "Active" },
      ]);
      setVoicePhrase("");
      setActionDescription("");
    }
  };

  const deleteCommand = (index) => {
    const updated = [...customCommands];
    updated.splice(index, 1);
    setCustomCommands(updated);
  };

  return (
    <div className="container">
      {/* Default Commands */}
      <div>
        <h2 className="section-title">Default Voice Commands</h2>
        <div className="space-y">
          {defaultCommands.map((cmd, i) => (
            <div key={i} className="card">
              <div>
                <p className="phrase">"{cmd.phrase}"</p>
                <p className="description">{cmd.description}</p>
                <span className="tag">{cmd.tag}</span>
              </div>
              <span className="checkmark">✔</span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Commands */}
      <div>
        <h2 className="section-title">Create Custom Command</h2>
        <div className="form-card">
          <input
            type="text"
            placeholder="e.g., 'Pay my rent'"
            value={voicePhrase}
            onChange={(e) => setVoicePhrase(e.target.value)}
          />
          <input
            type="text"
            placeholder="e.g., 'Transfer ₹15000 to Landlord'"
            value={actionDescription}
            onChange={(e) => setActionDescription(e.target.value)}
          />
          <button className="add-btn" onClick={addCustomCommand}>
            + Add Custom Command
          </button>
        </div>

        <h2 className="section-title">My Custom Commands</h2>
        <div className="space-y">
          {customCommands.map((cmd, i) => (
            <div key={i} className="card">
              <div>
                <p className="phrase">"{cmd.phrase}"</p>
                <p className="description">{cmd.description}</p>
                <span className="status">{cmd.status}</span>
              </div>
              <div className="actions">
                <button className="pause-btn">⏸</button>
                <button className="delete-btn" onClick={() => deleteCommand(i)}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceCommandPage;
