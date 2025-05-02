import React from 'react';
import { useParams } from 'react-router-dom';
import ClientChatbot from '../../chatbot/ClientChatbot';
 
const ChatbotPage = () => {
  const { clientId } = useParams();
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <ClientChatbot clientId={clientId} />
    </div>
  );
};
 
export default ChatbotPage;
