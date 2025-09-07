import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.content}>
                    {children}
                </div>
                <div className={styles.actions}>
                    <button onClick={onClose} className={styles.cancelButton} disabled={isConfirming}>Cancel</button>
                    <button onClick={onConfirm} className={styles.confirmButton} disabled={isConfirming}>
                        {isConfirming ? 'Confirming...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;