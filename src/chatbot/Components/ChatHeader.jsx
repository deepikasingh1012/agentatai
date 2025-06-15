// import React from 'react';
// import { MdArrowBackIos } from 'react-icons/md';
// // import logo from '../assets/logo.png';

// const ChatHeader = ({ handleBackClick, handleExitPrompt, sessionId, isBackDisabled }) => {
//     return (
//         <div className="d-flex align-items-center justify-content-between p-1 bg-primary text-white">
//             <button className="btn btn-sm text-white" onClick={handleBackClick}
//                 disabled={isBackDisabled}>
//                 <MdArrowBackIos />
//             </button>
//             <div className="d-flex align-items-center gap-1">
//                 {/* <img src={logo} alt="Logo" style={{ width: "32px", height: "32px" }} className="rounded-circle" /> */}
//                 <span className="fw-bold small">ATai: Smart Lead Assistant</span>
//             </div>
//             <button className="btn btn-sm text-white" onClick={() => handleExitPrompt(sessionId)}>
//                 <i className="fas fa-times" />
//             </button>
//         </div>
//     );
// };

// export default ChatHeader;




import React from 'react';
import { MdArrowBackIos } from 'react-icons/md';

const ChatHeader = ({ handleBackClick, handleExitPrompt, sessionId, isBackDisabled }) => {
  return (
    <div className="position-relative bg-primary text-white py-3 px-2">

      {/* Back Button on the Left */}
      <button
        className="btn btn-sm text-white position-absolute start-0 top-50 translate-middle-y"
        onClick={handleBackClick}
        disabled={isBackDisabled}
        style={{ zIndex: 1 }}
      >
        <MdArrowBackIos />
      </button>

      {/* Centered Title */}
      <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
        <span className="fw-bold small text-white">ATai: Smart Lead Assistant</span>
      </div>

    </div>
  );
};

export default ChatHeader;
