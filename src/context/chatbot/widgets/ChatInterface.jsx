import React from 'react';
import ChatContainer from '../Components/ChatContainer';

const ChatInterface = ({ config, clientId }) => {
  return (
    <div className='bg-black '>
    <ChatContainer config={config} clientId={clientId} />
    </div>
  );
};

export default ChatInterface;





// import React from 'react';
// import ChatContainer from '../Components/ChatContainer';


// const ChatInterface = ({ config,clientId }) => {
//   return (
//     <div className="p-4 border rounded shadow bg-white">
//     <p className="mb-2 font-semibold">Welcome to {config.botName || 'ATaiBot'}</p> 
  
//       <ChatContainer config={config}  clientId={clientId}/>
//     </div>
//   );
// };

// export default ChatInterface;

