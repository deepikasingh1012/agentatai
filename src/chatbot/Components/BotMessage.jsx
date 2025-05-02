import React from 'react';
import logo from '../assets/logo.png';

const BotMessage = ({ text }) => {
    return (
        <div className="d-flex align-items-start mb-2">
            <img src={logo} alt="Bot Icon" className="me-2 rounded-circle" style={{ width: '35px', height: '35px' }} />
            <div className="bg-light text-dark p-2 rounded shadow-sm">
                {text}
            </div>
        </div>
    );
};

export default BotMessage;
