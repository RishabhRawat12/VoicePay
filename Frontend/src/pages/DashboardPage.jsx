import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUser, createTransaction, parseVoiceCommand } from '../services/api';
import Navbar from '../components/layout/Navbar';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech'; 
import toast from 'react-hot-toast';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const [userData, setUserData] = useState(null);
    const [apiError, setApiError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pendingTx, setPendingTx] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    
    const { speak } = useTextToSpeech(); 
    
    const commandListener = useVoiceRecognition();
    const confirmationListener = useVoiceRecognition();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) { setApiError('No user ID found. Please log in again.'); return; }
            const result = await getUser(userId);
            if (result.error) { 
                setApiError(result.error); 
            } else { 
                setUserData(result);

                const greeted = localStorage.getItem('hasGreeted');
                if (!greeted) {
                    speak(`Welcome back, ${result.username}`);
                    localStorage.setItem('hasGreeted', 'true');
                }
            }
        };
        fetchUserData();
    }, []); // run only once on mount

    useEffect(() => {
        if (commandListener.text) {
            const processVoiceCommand = async () => {
                const voiceData = { voice_input: commandListener.text };
                const result = await parseVoiceCommand(voiceData);
                if (result.error) {
                    toast.error(`Could not understand: ${result.error}`);
                } else {
                    const confirmationText = `Are you sure you want to send ${result.amount} rupees to ${result.recipient}? Please say yes or no.`;
                    setPendingTx({ recipient: result.recipient, amount: result.amount });
                    setModalIsOpen(true);
                    speak(confirmationText); 
                    confirmationListener.startListening(); 
                }
                commandListener.setText('');
            };
            processVoiceCommand();
        }
    }, [commandListener.text, commandListener.setText, speak]);

    useEffect(() => {
        const confirmationText = confirmationListener.text.toLowerCase();
        if (confirmationText.includes('yes')) {
            handleConfirmTransaction();
            confirmationListener.setText(''); 
        } else if (confirmationText.includes('no')) {
            setModalIsOpen(false);
            toast('Transaction cancelled.');
            speak('Transaction cancelled.');
            confirmationListener.setText(''); 
        }
    }, [confirmationListener.text, confirmationListener.setText]);


    const handleConfirmTransaction = async () => {
        setIsConfirming(true);
        const userId = localStorage.getItem('userId');
        const transactionData = { sender_id: userId, recipient_username: pendingTx.recipient, amount: pendingTx.amount };
        const result = await createTransaction(transactionData);
        if (result.error) {
            toast.error(`Transaction Failed: ${result.error}`);
            speak(`Sorry, the transaction failed.`);
        } else {
            toast.success(result.message);
            speak(`Payment successful.`);
            setUserData(prevData => ({ ...prevData, balance: result.new_balance }));
        }
        setIsConfirming(false);
        setModalIsOpen(false);
        setPendingTx(null);
    };

    const handleMicClick = () => { commandListener.isListening ? commandListener.stopListening() : commandListener.startListening(); };
    
    if (apiError) { return (<div className={styles.pageWrapper}><Navbar /><div className={styles.dashboardContainer}>Error: {apiError}</div></div>); }
    if (!userData) { return ( <div className={styles.fullPageLoader}><Spinner /></div> ); }

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} onConfirm={handleConfirmTransaction} title="Confirm Transaction" isConfirming={isConfirming}>
                {pendingTx && (<p>Are you sure you want to send <strong>₹{pendingTx.amount.toFixed(2)}</strong> to <strong>{pendingTx.recipient}</strong>?</p>)}
                {confirmationListener.isListening && <div className={styles.listeningIndicator}>Listening for "Yes" or "No"...</div>}
            </Modal>
            <main className={styles.dashboardContainer}>
                <h1 className={styles.welcomeHeader}>Welcome back, {userData.username}!</h1>
                <section className={`${styles.card} ${styles.balanceCard}`}>
                    <div className={styles.balanceInfo}>
                        <h2>Account Balance</h2>
                        <p>₹{userData.balance.toFixed(2)}</p>
                    </div>
                    <button className={styles.copyButton} title="Copy account number">📋</button>
                </section>
                <section className={`${styles.card} ${styles.voicePanel}`}>
                    <h3>Voice Command Panel</h3>
                    <button className={`${styles.micButton} ${commandListener.isListening ? styles.listening : ''}`} onClick={handleMicClick} title="Start voice command">🎤</button>
                    <p>
                        {commandListener.isListening && 'Listening...'}
                        {!commandListener.isListening && !commandListener.text && 'Click the microphone to start voice command'}
                        {commandListener.error && `Error: ${commandListener.error}`}
                    </p>
                </section>
                <section className={styles.quickActions}>
                    <Link to="/transactions" className={styles.actionLink}>
                        <div className={`${styles.card} ${styles.actionCard}`}>
                            <span>🔄</span>
                            <h4>Transaction History</h4>
                            <p>View all your past transactions</p>
                        </div>
                    </Link>
                    <Link to="/profile" className={styles.actionLink}>
                        <div className={`${styles.card} ${styles.actionCard}`}>
                            <span>👤</span>
                            <h4>Profile Settings</h4>
                            <p>Update your personal information</p>
                        </div>
                    </Link>
                    <Link to="/settings" className={styles.actionLink}>
                        <div className={`${styles.card} ${styles.actionCard}`}>
                            <span>⚙️</span>
                            <h4>App Settings</h4>
                            <p>Configure your preferences</p>
                        </div>
                    </Link>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
