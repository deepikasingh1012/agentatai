  
// //  <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script> 

//   window.addEventListener('DOMContentLoaded', function () {
//     if (window.ATaiChatbotLoaded) return;
//     window.ATaiChatbotLoaded = true;
 
//     const iframe = document.createElement('iframe');
//     iframe.id = 'atai-chatbot-widget';
//     iframe.src = 'https://atjoinatai.mcndhanore.co.in/chatbot/64';
//     //  iframe.src = 'https://ataichatbot.ataibot.in/chatbot/64';
//     iframe.allowTransparency = 'true';
//     iframe.style.position = 'fixed';
//     iframe.style.bottom = '10px';
//     iframe.style.right = '20px';
//     iframe.style.width = '370px';
//     iframe.style.height = '550px';
//     iframe.style.border = 'none';
//     iframe.style.borderRadius = '0'; // No rounded corners
//     iframe.style.zIndex = '9999';
//     iframe.style.overflow = 'hidden';
//     iframe.style.backgroundColor = 'transparent';
//     iframe.style.boxShadow = 'none'; // <-- REMOVE shadow
 
//     // Adjust for mobile
//     const mq = window.matchMedia("(max-width: 480px)");
//     if (mq.matches) {
//       iframe.style.width = '90%';
//       iframe.style.right = '5%';
//       iframe.style.height = '90%';
//       iframe.style.bottom = '20px';
//     }
 
//     document.body.appendChild(iframe);
//   });

{/* <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script> */}


  // window.addEventListener('DOMContentLoaded', function () {
  //   if (window.ATaiChatbotLoaded) return;
  //   window.ATaiChatbotLoaded = true;

  //   const iframe = document.createElement('iframe');
  //   iframe.id = 'atai-chatbot-widget';
  //   iframe.src = 'https://atjoinatai.mcndhanore.co.in/chatbot/64';
  //   // iframe.src = 'https://ataichatbot.ataibot.in/chatbot/64';
  //   iframe.allowTransparency = 'true';
  //   iframe.style.position = 'fixed';
  //   iframe.style.bottom = '10px';
  //   iframe.style.right = '20px';
  //   iframe.style.width = '370px';
  //   iframe.style.height = '550px';
  //   iframe.style.border = 'none';
  //   iframe.style.borderRadius = '0'; // No rounded corners
  //   iframe.style.zIndex = '9999';
  //   iframe.style.overflow = 'hidden';
  //   iframe.style.backgroundColor = 'transparent';
  //   iframe.style.boxShadow = 'none'; // <-- REMOVE shadow

  //   // Adjust for mobile
  //   const mq = window.matchMedia("(max-width: 480px)");
  //   if (mq.matches) {
  //     iframe.style.width = '90%';
  //     iframe.style.right = '5%';
  //     iframe.style.height = '90%';
  //     iframe.style.bottom = '20px';

      
  //     iframe.style.pointerEvents = 'none';
  //     // setTimeout(() => {
  //     //   iframe.style.pointerEvents = 'auto';
  //     // }, 3000); 
  //   }

  //   document.body.appendChild(iframe);
  // });

  window.addEventListener('DOMContentLoaded', function () {
  if (window.ATaiChatbotLoaded) return;
  window.ATaiChatbotLoaded = true;

  const iframe = document.createElement('iframe');
  iframe.id = 'atai-chatbot-widget';
  iframe.src = 'https://atjoinatai.mcndhanore.co.in/chatbot/64';
  iframe.allowTransparency = 'true';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '10px';
  iframe.style.right = '20px';
  iframe.style.width = '370px';
  iframe.style.height = '550px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '0';
  iframe.style.zIndex = '9999';
  iframe.style.overflow = 'hidden';
  iframe.style.backgroundColor = 'transparent';
  iframe.style.boxShadow = 'none';

  const mq = window.matchMedia("(max-width: 480px)");
  if (mq.matches) {
    iframe.style.width = '90%';
    iframe.style.right = '5%';
    iframe.style.height = '70%';
    iframe.style.bottom = '20px';

    iframe.style.pointerEvents = 'none';
    document.addEventListener('click', function enableChatbotInteraction() {
      iframe.style.pointerEvents = 'auto';
      document.removeEventListener('click', enableChatbotInteraction);
    });
  }

  document.body.appendChild(iframe);
});

