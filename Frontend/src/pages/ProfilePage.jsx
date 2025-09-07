import React, { useState, useEffect } from 'react';
import { getUser } from '../services/api';
import Navbar from '../components/layout/Navbar';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const data = await getUser(userId);
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data);
                }
            } catch (err) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <main className={styles.container}>
                <h1 className={styles.header}>User Profile</h1>
                {loading && <p>Loading profile...</p>}
                {error && <p className={styles.error}>{error}</p>}
                {!loading && !error && user && (
                    <div className={styles.profileCard}>
                        <div className={styles.profileInfo}>
                            <label>Username</label>
                            <p>{user.username}</p>
                        </div>
                        <div className={styles.profileInfo}>
                            <label>Email Address</label>
                            {/* Assuming your getUser API returns email */}
                            <p>{user.email || 'No email provided'}</p>
                        </div>
                        <div className={styles.profileInfo}>
                            <label>Current Balance</label>
                            <p>₹{user.balance.toFixed(2)}</p>
                        </div>
                        <button className={styles.editButton}>Edit Profile</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;