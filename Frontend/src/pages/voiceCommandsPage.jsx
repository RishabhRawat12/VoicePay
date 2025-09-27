import React, { useState } from 'react';

// Main application component
const VoiceCommandPage = () => {
    const defaultCommands = [
        { phrase: "Send money to [name]", description: "Transfer funds to a specified contact", tag: "Payments" },
        { phrase: "Check my balance", description: "Displays your current account balance", tag: "Account" },
        { phrase: "Show transaction history", description: "Navigates to the transactions page", tag: "History" },
        { phrase: "Pay [bill type] bill", description: "Process a bill payment for services", tag: "Bills" },
    ];

    const [customCommands, setCustomCommands] = useState([
        { phrase: "Pay my electricity bill", description: "Transfer ₹1200 to Electricity Board", status: "Active" },
        { phrase: "Send money to mom", description: "Transfer ₹500 to Mom", status: "Active" },
        { phrase: "Monthly rent payment", description: "Transfer ₹15000 to Landlord", status: "Paused" },
    ]);

    const [voicePhrase, setVoicePhrase] = useState("");
    const [actionDescription, setActionDescription] = useState("");
    const [error, setError] = useState("");

    // Function to add a new custom command
    const addCustomCommand = () => {
        if (voicePhrase.trim() && actionDescription.trim()) {
            setCustomCommands([
                ...customCommands,
                { phrase: voicePhrase, description: actionDescription, status: "Active" },
            ]);
            setVoicePhrase("");
            setActionDescription("");
            setError("");
        } else {
            setError("Both fields are required to add a command.");
        }
    };

    // Function to delete a command by its index
    const deleteCommand = (index) => {
        const updatedCommands = customCommands.filter((_, i) => i !== index);
        setCustomCommands(updatedCommands);
    };

    // Function to toggle the status between Active and Paused
    const toggleStatusCommand = (index) => {
        const updatedCommands = [...customCommands];
        const currentStatus = updatedCommands[index].status;
        updatedCommands[index].status = currentStatus === "Active" ? "Paused" : "Active";
        setCustomCommands(updatedCommands);
    };

    // Reusable Card component for displaying commands
    const CommandCard = ({ command, children }) => (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center transition-all duration-300 hover:shadow-md hover:border-blue-500">
            <div>
                <p className="font-semibold text-base text-gray-800">"{command.phrase}"</p>
                <p className="text-sm text-gray-500 mt-1">{command.description}</p>
                {command.tag && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mt-3 px-2.5 py-1 rounded-full">{command.tag}</span>
                )}
                {command.status && (
                     <span className={`inline-block text-xs font-medium mt-3 px-2.5 py-1 rounded-full ${
                        command.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{command.status}</span>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {children}
            </div>
        </div>
    );
    
    // Reusable Icon Button
    const IconButton = ({ onClick, children, className }) => (
        <button onClick={onClick} className={`p-2 rounded-full transition-colors duration-200 ${className}`}>
            {children}
        </button>
    );

    return (
        <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Voice Commands</h1>
                <p className="text-lg text-gray-600 mt-2">Manage your default and custom voice commands for VoicePay.</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Column: Default and Custom Commands List */}
                <div className="space-y-10">
                    {/* Default Commands Section */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>
                            Default Commands
                        </h2>
                        <div className="space-y-4">
                            {defaultCommands.map((cmd, i) => (
                                <CommandCard key={i} command={cmd}>
                                   <div className="text-green-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                   </div>
                                </CommandCard>
                            ))}
                        </div>
                    </div>
                     {/* My Custom Commands Section */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                            My Custom Commands
                        </h2>
                        <div className="space-y-4">
                            {customCommands.length > 0 ? customCommands.map((cmd, i) => (
                                <CommandCard key={i} command={cmd}>
                                    <IconButton onClick={() => toggleStatusCommand(i)} className="text-gray-500 hover:bg-gray-200 hover:text-gray-800">
                                        {cmd.status === 'Active' ? 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                            :
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        }
                                    </IconButton>
                                    <IconButton onClick={() => deleteCommand(i)} className="text-red-500 hover:bg-red-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                                    </IconButton>
                                </CommandCard>
                            )) : <p className="text-gray-500 text-center py-4">You haven't added any custom commands yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Create Custom Command Form */}
                <div className="lg:sticky top-8 self-start">
                     <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                        Create Custom Command
                    </h2>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="voice-phrase" className="block text-sm font-medium text-gray-700 mb-1">When I say...</label>
                                <input
                                    id="voice-phrase"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder="e.g., 'Pay my rent'"
                                    value={voicePhrase}
                                    onChange={(e) => setVoicePhrase(e.target.value)}
                                />
                            </div>
                            <div>
                                 <label htmlFor="action-desc" className="block text-sm font-medium text-gray-700 mb-1">VoicePay should...</label>
                                <input
                                    id="action-desc"
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                                    placeholder="e.g., 'Transfer ₹15000 to Landlord'"
                                    value={actionDescription}
                                    onChange={(e) => setActionDescription(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <button 
                                onClick={addCustomCommand}
                                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                                Add Custom Command
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceCommandPage;
