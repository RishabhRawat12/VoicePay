import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import styles from './HomePage.module.css';
import logo from '../assets/logo.png';
import { loginUser, registerUser } from '../services/api';

const LoginForm = ({ loginUsername, setLoginUsername, loginPassword, setLoginPassword, handleLoginSubmit, isLoading }) => ( <form onSubmit={handleLoginSubmit} className={styles.form}><div className={styles.formGroup}><label htmlFor="login-username">Username <span className={styles.required}>*</span></label><input id="login-username" type="text" placeholder="Enter your username" value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)} required /></div><div className={styles.formGroup}><label htmlFor="login-password">Password <span className={styles.required}>*</span></label><input id="login-password" type="password" placeholder="Enter your password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required /></div><button type="submit" className={styles.submitButton} disabled={isLoading}><FiLogIn /><span>{isLoading ? 'Logging In...' : 'Login'}</span></button></form> );
const SignupForm = ({ signupEmail, setSignupEmail, signupUsername, setSignupUsername, signupPassword, setSignupPassword, handleSignupSubmit, isLoading }) => ( <form onSubmit={handleSignupSubmit} className={styles.form}><div className={styles.formGroup}><label htmlFor="signup-email">Email <span className={styles.required}>*</span></label><input id="signup-email" type="email" placeholder="Enter your email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required /></div><div className={styles.formGroup}><label htmlFor="signup-username">Username <span className={styles.required}>*</span></label><input id="signup-username" type="text" placeholder="Create a username" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} required /></div><div className={styles.formGroup}><label htmlFor="signup-password">Password <span className={styles.required}>*</span></label><input id="signup-password" type="password" placeholder="Create a password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required /></div><button type="submit" className={styles.submitButton} disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button></form> );

const HomePage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupUsername, setSignupUsername] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const { login } = useAuth();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loginData = { username: loginUsername, password: loginPassword };
        const result = await loginUser(loginData);
        if (result.error) {
            toast.error(`Login Failed: ${result.error}`);
        } else {
            toast.success('Login Successful!');
            login(result.user_id);
        }
        setIsLoading(false);
    };
    
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const userData = { username: signupUsername, email: signupEmail, password: signupPassword };
        const result = await registerUser(userData);
        if (result.error) {
            toast.error(`Registration Failed: ${result.error}`);
        } else {
            toast.success(result.message);
            setActiveTab('login');
        }
        setIsLoading(false);
    };

    return ( <div className={styles.pageContainer}><header className={styles.header}><h1 className={styles.logoText}><img src={logo} alt="VoicePay Logo" className={styles.logoIcon} />VoicePay</h1><h2 className={styles.tagline}>Make Payments with Just Your Voice</h2><p className={styles.subTagline}>Secure • Fast • Voice-Powered</p></header><main className={styles.card}><div className={styles.tabContainer}><button className={activeTab === 'login' ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab('login')}>Login</button><button className={activeTab === 'signup' ? styles.activeTab : styles.inactiveTab} onClick={() => setActiveTab('signup')}>Sign Up</button></div>{activeTab === 'login' ? (<LoginForm isLoading={isLoading} loginUsername={loginUsername} setLoginUsername={setLoginUsername} loginPassword={loginPassword} setLoginPassword={setLoginPassword} handleLoginSubmit={handleLoginSubmit} />) : (<SignupForm isLoading={isLoading} signupEmail={signupEmail} setSignupEmail={setSignupEmail} signupUsername={signupUsername} setSignupUsername={setSignupUsername} signupPassword={signupPassword} setSignupPassword={setSignupPassword} handleSignupSubmit={handleSignupSubmit} />)}</main><footer className={styles.footer}><a href="#">Privacy Policy</a><a href="#">Terms of Service</a><a href="#">Help</a><a href="#">Contact</a><p>© 2025 VoicePay. All rights reserved.</p></footer></div> );
};

export default HomePage;