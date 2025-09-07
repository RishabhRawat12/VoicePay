import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
    // States to manage settings toggles
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <main className={styles.container}>
                <h1 className={styles.header}>App Settings</h1>
                <div className={styles.settingsCard}>
                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <h4>Multi-Factor Authentication</h4>
                            <p>Add an extra layer of security to your account.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={mfaEnabled} 
                                onChange={() => setMfaEnabled(!mfaEnabled)} 
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <h4>Email Notifications</h4>
                            <p>Receive an email for every successful transaction.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={emailNotifications} 
                                onChange={() => setEmailNotifications(!emailNotifications)} 
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingItem}>
                        <div className={styles.settingInfo}>
                            <h4>SMS Notifications</h4>
                            <p>Receive an SMS for every successful transaction.</p>
                        </div>
                        <label className={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={smsNotifications} 
                                onChange={() => setSmsNotifications(!smsNotifications)} 
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;