import React from 'react';

const UserMessage = ({ text }) => {
    return (
        <div className="d-flex justify-content-end mb-1">
            <div className="bg-primary text-white p-1 rounded shadow-sm">
                <p className="m-0 small"> {text}</p>
            </div>
        </div>
    );
};

export default UserMessage;
