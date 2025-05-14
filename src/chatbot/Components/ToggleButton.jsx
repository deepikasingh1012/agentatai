import React from 'react';
import logo from '../assets/logo.png';

const ToggleButton = ({ toggleChatbot }) => {
    return (
        <button className="btn btn-light shadow rounded-circle " onClick={toggleChatbot}>
            <img src={logo} alt="Chatbot Logo" style={{ width: '40px', height: '40px' }} />
        </button>
    );
};

export default ToggleButton;
