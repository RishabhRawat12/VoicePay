import React, { useState, useEffect } from 'react';
import { getTransaction } from '../services/api';
import Navbar from '../components/layout/Navbar';
import styles from './TransactionPage.module.css';

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const data = await getTransaction(userId);
                if (data.error) {
                    setError(data.error);
                } else {
                    setTransactions(data);
                }
            } catch (err) {
                setError('Failed to fetch transactions.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <main className={styles.container}>
                <h1 className={styles.header}>Transaction History</h1>
                {loading && <p>Loading transactions...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {!loading && !error && (
                    <table className={styles.transactionTable}>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>To / From</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((tx, index) => (
                                    <tr key={index}>
                                        <td className={tx.type === 'sent' ? styles.sent : styles.received}>
                                            {tx.type}
                                        </td>
                                        <td>{tx.party}</td>
                                        <td>₹{tx.amount.toFixed(2)}</td>
                                        <td>{new Date(tx.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default TransactionPage;