import React from 'react';
import ChatInterface from './widgets/ChatInterface';
import allClientConfigs from '../chatbot/configs/allClientsConfig';

const ClientChatbot = ({ clientId }) => {
  const config = allClientConfigs[clientId] || { botName: 'Unknown Client Bot', botUrl: '' };

  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-4">
        Chatbot for Client #{clientId}
      </h2> */}
      <ChatInterface config={config} clientId={clientId} />
    </div>
  );
};

export default ClientChatbot;




// import React from 'react';
// import ChatInterface from './widgets/ChatInterface';
// import client1Config from './configs/client1Config';
// import client2Config from './configs/client2Config'

// const ClientChatbot = ({ clientId }) => {
//   // Later you can dynamically load configs by clientId
//   const config = clientId === '1' ? client1Config : {};

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">
//         Chatbot for Client #{clientId}
//       </h2>
//       <ChatInterface config={config} clientId={clientId} />
//     </div>
//   );
// };

// export default ClientChatbot;



// import { useParams } from 'react-router-dom';
// import ChatInterface from './widgets/ChatInterface';

// // Import all client configurations
// import client1Config from './configs/client1Config';
// import client2Config from './configs/client2Config';
// // ... import other client configs

// const ClientChatbot = () => {
//   const { clientId } = useParams();

//   // Create a configuration map
//   const configMap = {
//     '1': client1Config,
//     '2': client2Config,
//     // ... add other client configurations
//   };

//   // Get the correct config or use default
//   const config = configMap[clientId] || {
//     botName: 'Default Bot',
//     botUrl: 'https://default-chatbot-url.com'
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">
//         Chatbot for Client #{clientId}
//       </h2>
//       <ChatInterface config={config} clientId={clientId} />
//     </div>
//   );
// };
// export default ClientChatbot;

