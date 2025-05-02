import React from 'react';
import ChatInterface from './widgets/ChatInterface';
import client1Config from './configs/client1Config';
import client2Config from './configs/client2Config'

const ClientChatbot = ({ clientId }) => {
  // Later you can dynamically load configs by clientId
  const config = clientId === '1' ? client1Config : {};

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Chatbot for Client #{clientId}
      </h2>
      <ChatInterface config={config} clientId={clientId} />
    </div>
  );
};

export default ClientChatbot;







// import React from 'react';
// import ChatInterface from './widgets/ChatInterface';
// import allClientConfigs from './configs/allClientsConfig';

// const ClientChatbot = ({ clientId }) => {
//   const config = allClientConfigs[clientId] || {
//     botName: 'ATaiBot',
//     botUrl: 'https://example.com/default',
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Chatbot for Client #{clientId}</h2>
//       <ChatInterface config={config} />
//     </div>
//   );
// };

// export default ClientChatbot;



