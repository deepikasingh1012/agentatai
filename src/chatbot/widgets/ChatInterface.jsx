import React from 'react';
import ChatContainer from '../Components/ChatContainer';


const ChatInterface = ({ config }) => {
  return (
    <div className="p-4 border rounded shadow bg-white">
      <p className="mb-2 font-semibold">Welcome to {config.botName || 'ATaiBot'}</p>
      <ChatContainer config={config} />
    </div>
  );
};

export default ChatInterface;



// import ChatContainer from '../Components/ChatContainer'; // this is your actual chatbot

// const ChatInterface = ({ config }) => {
//   return (
//     <div className="p-4">
//       <p>Welcome to {config.botName}</p>
//       <ChatContainer config={config} />
//     </div>
//   );
// };
// export default ChatInterface



// import React from 'react';
 
// const ChatInterface = ({ config }) => {
//   return (
//     <div className="p-4 border rounded shadow">
//       <p className="mb-2">Powered by: {config.botName || 'ATaiBot'}</p>
//       <iframe
//         src={config.botUrl}
//         title="AI Chatbot"
//         width="100%"
//         height="500"
//         style={{ border: 'none' }}
//       ></iframe>
//     </div>
//   );
// };
 
// export default ChatInterface;