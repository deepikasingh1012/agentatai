import React from 'react';
import { MdArrowBackIos } from 'react-icons/md';
// import logo from '../assets/logo.png';

const ChatHeader = ({ handleBackClick, handleExitPrompt, sessionId, isBackDisabled }) => {
    return (
        <div className="d-flex align-items-center justify-content-between p-1 bg-primary text-white">
            <button className="btn btn-sm text-white" onClick={handleBackClick}
                disabled={isBackDisabled}>
                <MdArrowBackIos />
            </button>
            <div className="d-flex align-items-center gap-1">
                {/* <img src={logo} alt="Logo" style={{ width: "32px", height: "32px" }} className="rounded-circle" /> */}
                <span className="fw-bold small">ATai: Smart Lead Assistant</span>
            </div>
            <button className="btn btn-sm text-white" onClick={() => handleExitPrompt(sessionId)}>
                <i className="fas fa-times" />
            </button>
        </div>
    );
};

export default ChatHeader;
