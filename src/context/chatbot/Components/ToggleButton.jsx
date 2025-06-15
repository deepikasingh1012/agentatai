// import React from 'react';
// import logo from '../assets/logo.png';

// const ToggleButton = ({ toggleChatbot }) => {
//     return (
//         <button className="btn btn-light shadow rounded-circle " onClick={toggleChatbot}>
//             <img src={logo} alt="Chatbot Logo" style={{ width: '40px', height: '40px' }} />
//         </button>
//     );
// };

// export default ToggleButton;
import React from 'react';
import logo from '../assets/logo.png';

const ToggleButton = ({ toggleChatbot }) => {
    return (
        // <button className="btn btn-light shadow rounded-circle" onClick={toggleChatbot}>
        //     <img src={logo} alt="Chatbot Logo" style={{ width: '40px', height: '40px' }} />
        // </button>
         <button 
            className="btn btn-light shadow rounded-circle d-flex align-items-center justify-content-center p-0" 
            style={{ width: '60px', height: '60px' }} 
            onClick={toggleChatbot}
        >
            <img src={logo} alt="Chatbot Logo" style={{ width: '40px', height: '40px' }} />
        </button>
    );
};

export default ToggleButton;