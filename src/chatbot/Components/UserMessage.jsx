import React from 'react';

const UserMessage = ({ text }) => {
    return (
        <div className="d-flex justify-content-end mb-2">
            <div className="bg-primary text-white p-2 rounded shadow-sm">
                {text}
            </div>
        </div>
    );
};

export default UserMessage;
