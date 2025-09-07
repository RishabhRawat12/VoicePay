import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import styles from './Navbar.module.css';
import logo from '../../assets/logo.png';

import { LayoutDashboard, History, Mic, User, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>
        <Link to="/dashboard">
          <img src={logo} alt="VoicePay Logo" className={styles.logoIcon} />
        </Link>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <Link to="/dashboard"><LayoutDashboard size={16}/> Dashboard</Link>
        </li>
        <li>
          <Link to="/transactions"><History size={16}/> Transactions</Link>
        </li>
        <li>
          <Link to="/voice"><Mic size={16}/> Voice Commands</Link>
        </li>
        <li>
          <Link to="/profile"><User size={16}/> Profile</Link>
        </li>
        <li>
          <Link to="/settings"><Settings size={16}/> Settings</Link>
        </li>
      </ul>

      <button onClick={logout} className={styles.logoutButton}>
        <LogOut size={16}/> Logout
      </button>
    </nav>
  );
};

export default Navbar;
