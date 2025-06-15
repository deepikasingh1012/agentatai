import React, { useCallback, useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import OptionsContainer from './OptionsContainer';
import UserMessage from './UserMessage';
import BotMessage from './BotMessage';
import UserInputContainer from './UserInputContainer';
import StarRating from './StarRating';
import ToggleButton from './ToggleButton';
import OtherQueryInput from "./OtherQueryInput";
import CallbackPreference from "./CallbackPreference";
import CryptoJS from "crypto-js";
import { motion } from 'framer-motion';
import './ChatContainer.css';

import notificationSoundFile from '../sound/notification.mp3';

import {
    fetchQuestions,
    submitInquiry,
} from '../../services/chatbotServices';
import { getClientContactNumber } from "../../services/AdminService";

const ChatContainer = ({ config, clientId }) => {

    const inactivityTimerRef = useRef(null);
    const chatEndRef = useRef(null);

    const [hasStartedChat, setHasStartedChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [options, setOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [userQuery, setUserQuery] = useState("");
    const [pendingQuery, setPendingQuery] = useState("");

    const [isQueryInputDisabled, setQueryInputDisabled] = useState(false);
    const [isQuerySubmitted, setIsQuerySubmitted] = useState(false); // Track if the query is submitted
    const [isDetailsFormVisible, setIsDetailsFormVisible] = useState(false);
    const [isDetailsRequested, setIsDetailsRequested] = useState(false);

    const [isDetailsSubmitted, setIsDetailsSubmitted] = useState(false);
    const [showCallbackMessage, setShowCallbackMessage] = useState(false);
    const [callbackPreference, setCallbackPreference] = useState(null);

    const [exitResponseMessage, setExitResponseMessage] = useState("");
    // const [isOtherOptionDisabled, setIsOtherOptionDisabled] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const [showExitPrompt, setShowExitPrompt] = useState(false);
    const [exitPromptMessage, setExitPromptMessage] = useState("");
    // const [showBackSlider, setShowBackSlider] = useState(false);
    const [sessionId, setSessionId] = useState(null); // ✅ Store session ID
    const [userRating, setUserRating] = useState(null);
    const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
    const [previousMessages, setPreviousMessages] = useState([]);

    const [showSlideWindow, setShowSlideWindow] = useState(false);
    const [isBackDisabled, setIsBackDisabled] = useState(false);
    const [showTypingEffect, setShowTypingEffect] = useState(false);
    const [showFirstMessage, setShowFirstMessage] = useState(false);
    const [showRestartPrompt, setShowRestartPrompt] = useState(false);
    // const [shouldShowRating, setShouldShowRating] = useState(false);
    const [ratingResetKey, setRatingResetKey] = useState(0);
    const [ratingTriggerPoint, setRatingTriggerPoint] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({}); // Track selected options per level
    const [callbackRequested, setCallbackRequested] = useState(false);
    const [lastUserSelection, setLastUserSelection] = useState(null); // Track user's last selected option


    const [showWhatsAppAfterNoCallback, setShowWhatsAppAfterNoCallback] = useState(false);
 const [whatsAppNumber, setWhatsAppNumber] = useState("8421924019"); // default fallback


    //PLay notification sound

    const playNotificationSound = useCallback(() => {
        const notificationSound = new Audio(notificationSoundFile);
        notificationSound.play().catch(error => console.error("Error playing sound :", error));
    }, [notificationSoundFile]);

    const scrollToBottom = () => {
        if (chatEndRef.current) {
            console.log('Scrolling to bottom, chatEndRef.current exists:', chatEndRef.current);
            chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } else {
            console.log('chatEndRef.current is null, cannot scroll');
        }
    };

    // Ensure scroll on messages update
    useEffect(() => {
        console.log('Messages updated, triggering scroll:', messages.length);
        scrollToBottom();
    }, [messages]);

    // Ensure scroll after state changes that affect content (e.g., slide window or first message)
    useEffect(() => {
        if (!showSlideWindow && showFirstMessage) {
            scrollToBottom();
        }
    }, [showSlideWindow, showFirstMessage]);


    const [sessionData, setSessionData] = useState({
        
        messages: [],
        contactDetails: null,
    });

   
    useEffect(() => {
        console.log("isDetailsFormVisible updated:", isDetailsFormVisible);
    }, [isDetailsFormVisible]);


    useEffect(() => {
        if (isDetailsSubmitted && pendingQuery.trim()) {
            console.log("Auto-submitting query from useEffect:", pendingQuery);
            handleUserQuerySubmit(pendingQuery);
            setPendingQuery("");
        }
    }, [isDetailsSubmitted]);


    // Add useEffect to confirm state update
    useEffect(() => {
        console.log("🔄 showSlideWindow state AFTER:", showSlideWindow);
    }, [showSlideWindow]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastUserMessage = messages
                .filter(msg => msg.sender === 'user')
                .slice(-1)[0]; // Get last selected user question

            if (lastUserMessage) {
                // console.log("✅ Unique User ID (Session ID):", sessionId);
                console.log("✅ Last Selected Question:", lastUserMessage.text);
            }
        }
    }, [messages]); // Runs every time messages update

    
    const saveChatHistory = () => {
        localStorage.setItem("chatHistory", JSON.stringify(messages)); // Use messages instead of chatMessages
    };




    const startInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

       

        inactivityTimerRef.current = setTimeout(() => {
            console.log("User inactive - showing reminder.");
            setShowReminder(true);
        }, 5 * 60 * 1000); // 5 minutes
    });


    const stopInactivityTimer = useCallback(() => {
        console.log("⛔ Chat closed or timer stopped.");
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
        }
    }, []);


    const resetInactivityTimer = useCallback(() => {
        setShowReminder(false); // Hide reminder
        startInactivityTimer(); // Restart timer
    }, [startInactivityTimer]);

    useEffect(() => {
        if (isOpen) {
            startInactivityTimer();
        } else {
            stopInactivityTimer();
        }
    }, [isOpen, startInactivityTimer, stopInactivityTimer]);


    useEffect(() => {
        const resetTimerOnActivity = () => {
            console.log("🖱️ User interacted - resetting timer.");
            if (isOpen) {
                resetInactivityTimer();
            }
        };

        // Listen for user actions
        document.addEventListener("click", resetTimerOnActivity);
        document.addEventListener("keydown", resetTimerOnActivity);

        return () => {
            // Cleanup event listeners when component unmounts
            document.removeEventListener("click", resetTimerOnActivity);
            document.removeEventListener("keydown", resetTimerOnActivity);
            stopInactivityTimer();
        };
    }, [isOpen, resetInactivityTimer, stopInactivityTimer]);


    // ✅ Function to Fix URLs (Ensure Proper Format)
    const formatURL = (url) => {
        if (url && !url.startsWith("http")) {
            return "https://" + url;
        }
        return url;
    }

    const handleToggleChatbot = async () => {
        if (isOpen) {
            // Minimize the chat container without resetting data
            setIsOpen(false);
            stopInactivityTimer?.(); // Optional: only if you use inactivity timer
            console.log("Chat minimized, preserving data.");
        } else {
            setIsOpen(true);
            startInactivityTimer?.();
    
            if (!clientId) {
                console.error("Cannot open chatbot: clientId is undefined");
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Error: Client ID is missing. Please try again.", sender: "bot" }
                ]);
                return;
            }
    
            setSessionData((prev) => ({
                ...prev,
                clientId: clientId,
            }));
            console.log("Session Data Updated:", { clientId });
    
            if (messages.length === 0) {
                // Try restoring chat history
                const savedMessages = localStorage.getItem("chatHistory");
                if (savedMessages) {
                    try {
                        const parsedMessages = JSON.parse(savedMessages);
                        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                            setMessages(parsedMessages);
                            setShowFirstMessage(true);
                            console.log("Resumed previous chat from localStorage:", parsedMessages);
                            scrollToBottom?.();
                            return;
                        }
                    } catch (error) {
                        console.error("Error loading chat history:", error);
                    }
                }
    
                // No saved history or invalid history, start a new chat
                console.log("No active session or saved history, starting new chat.");
                resetChatbot(true); // only when there’s no previous history
                startChat();
            } else {
                // Existing session, just show the chat
                setShowFirstMessage(true);
                scrollToBottom?.();
                console.log("Reopened existing chat session.");
            }
        }
    };
    
    const startChat = async () => {
        try {
            console.log("Starting new chat session for clientId:", clientId);
            // console.log("🚀 Starting new chat session...");
            setMessages([]);
            setOptions([]);
            setCurrentQuestion(null);
            setLastUserSelection(null);
            setSelectedOptions({});
            setCallbackRequested(false);
            setShowTypingEffect(true);

            setTimeout(async () => {
                setShowTypingEffect(false); // Hide typing effect after 2s
                setShowFirstMessage(true); // Show first bot message
                playNotificationSound();

                console.log("Using Dynamically Client ID:", clientId);

                const data = await fetchQuestions(clientId);
                console.log("Fetched Data for Client:", data);

                if (!data || !data.questions || data.questions.length === 0) {
                    throw new Error('No questions found in the response:', clientId);

                }

                console.log("All Questions for Client:", data.questions);

                // ✅ First, try to find a question with question_level: 1
                let firstQuestion = data.questions.find(q => q.question_level === 1 && q.question_parent_level === 0);

                // ✅ If no level 1 question is found, select the lowest level question instead
                if (!firstQuestion && data.questions.length > 0) {
                    firstQuestion = data.questions.reduce((prev, curr) => (prev.question_level < curr.question_level ? prev : curr));
                }

                if (!firstQuestion) {
                    console.error("No valid first question found! Check API response.");
                    return;
                }

                console.log("First Question Selected:", firstQuestion);

                setMessages([
                    {
                        text:"Welcome To ATai 😊",
                        sender:"bot",
                        type:"text"
                    },
                    
                   
                    {
                    text: firstQuestion.question_text,
                    sender: 'bot',
                    type: firstQuestion.question_type,
                    url: [2, 4, 5, 6].includes(firstQuestion.question_type)
                        ? formatURL(firstQuestion.question_label)
                        : formatURL(firstQuestion.url),
                    question_label: firstQuestion.question_label,
                    options: [...(firstQuestion.children || []), { id: "other", question_text: "Other" }] // Add options here
                }]);
                // setOptions([...firstQuestion.children || [], { id: "other", question_text: "Other" }]); 
                setCurrentQuestion(firstQuestion);
                //  playNotificationSound();
            }, 1000);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    useEffect(() => {
        startChat();
    }, [clientId]);

    const handleBackClick = () => {
        if (!isBackDisabled) {
            console.log("🔄 Back button clicked! Opening slide window...");
            setShowSlideWindow(true);
        }
    };


    const loadPreviousConversation = () => {
        console.log("🔄 Loading previous conversation...");
        setShowTypingEffect(true)
        playNotificationSound();

        setTimeout(() => {
            try {
                const savedMessages = localStorage.getItem("chatHistory");

                if (savedMessages) {
                    const parsedMessages = JSON.parse(savedMessages);

                    if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                        setMessages(parsedMessages);
                        console.log(" Previous chat loaded successfully:", parsedMessages);
                    } else {
                        console.warn(" No valid previous chat found.");
                    }
                } else {
                    console.warn("No chat messages found in localStorage.");
                }
            } catch (error) {
                console.error("Error loading previous chat:", error);
            }
            setShowTypingEffect(false);
            setShowSlideWindow(false);
            // setIsBackDisabled(true);
        }, 1000);
    };

    const startNewConversation = async () => {
        console.log("🆕 Starting a new conversation...");
        setShowTypingEffect(true)
        playNotificationSound();

        setTimeout(() => {
            setPreviousMessages([...messages]);
            setMessages([]);
            setCurrentQuestion(null);
            setLastUserSelection(null); // Reset last user selection
            setIsDetailsFormVisible(false);
            setIsOtherSelected(false);
            setExitPromptMessage(false);
            setExitResponseMessage(false);
            setShowExitPrompt(false);
            setShowCallbackMessage(false);
            setUserRating(null);
            setIsRatingSubmitted(false);
            setRatingTriggerPoint(null);
            
            setRatingResetKey(prev => prev + 1);
            setSelectedOptions({});
            setCallbackRequested(false);
            setSessionData({
                // sessionId: null,
                messages: [],
                contactDetails: null,
            });
            localStorage.removeItem("chatHistory");
            localStorage.removeItem("userRating");

            setShowRestartPrompt(false);

            setShowSlideWindow(false);
            startChat();
            // setShowFirstMessage(true); // Display the new conversation
            setIsBackDisabled(false);
            scrollToBottom();
            setShowTypingEffect(false);

        }, 1000);
    };

    const handleBackWindowSelection = (option) => {
        if (option === 'Continue old conversation') {
            loadPreviousConversation();
        } else if (option === 'Start a new conversation') {
            startNewConversation();
        }
        playNotificationSound();
    };

    // const handleUserSelection = (selectedOption, questionIndex) => {
    //     console.log("User selected:", selectedOption);
    //     setShowTypingEffect(true);
    //     playNotificationSound();

    //     setTimeout(() => {
    //         const currentMsg = messages[questionIndex];
    //         if (!currentMsg || !currentMsg.options || currentMsg.options.length === 0) {
    //             console.log("No further options available for this question. Chat ended.");
    //             setShowTypingEffect(false);
    //             return;
    //         }

    //         const levelKey = `${currentMsg.text}-${questionIndex}`;
    //         if (selectedOptions[levelKey] === selectedOption.question_text) {
    //             console.log("Option already selected at this level, ignoring re-selection.");
    //             setShowTypingEffect(false);
    //             return;
    //         }

    //         let nextQuestion = currentMsg.options.find(q => q.id === selectedOption.id);
    //         console.log("Next question found:", nextQuestion, "Children:", nextQuestion?.children);

    //         let messageUrl = null;
    //         if (nextQuestion?.question_label && nextQuestion.question_label !== 'null') {
    //             switch (nextQuestion.question_type) {
    //                 case 2: // File download
    //                 case 4: // Video
    //                 case 5: // Image
    //                 case 6: // Link
    //                     messageUrl = formatURL(nextQuestion.question_label);
    //                     break;
    //                 default:
    //                     messageUrl = formatURL(nextQuestion.url || currentMsg.url);
    //             }
    //         }

    //         setMessages(prevMessages => {
    //             const newMessages = [...prevMessages];
    //             const insertIndex = newMessages.length; // Insert after the last message

    //             // Add user message
    //             if (!newMessages.some(msg => msg.text === selectedOption.question_text && msg.sender === 'user')) {
    //                 newMessages.splice(insertIndex, 0, { text: selectedOption.question_text, sender: 'user' });
    //             }

    //             // Add bot message for leaf nodes
    //             if (nextQuestion && !nextQuestion.children || nextQuestion.children.length === 0) {
    //                 if (messageUrl) {
    //                     newMessages.push({
    //                         text: nextQuestion?.question_text || selectedOption.question_text,
    //                         sender: 'bot',
    //                         type: nextQuestion?.question_type || currentMsg.type,
    //                         url: messageUrl,
    //                         question_label: nextQuestion?.question_label || currentMsg.question_label
    //                     });
    //                 }
    //             } else if (nextQuestion && nextQuestion.children && nextQuestion.children.length > 0) {
    //                 newMessages.push({
    //                     text: nextQuestion.question_text,
    //                     sender: 'bot',
    //                     type: nextQuestion.question_type || currentMsg.type,
    //                     url: messageUrl,
    //                     question_label: nextQuestion.question_label || currentMsg.question_label,
    //                     options: nextQuestion.children ? [...nextQuestion.children, { id: "other", question_text: "Other" }] : [{ id: "other", question_text: "Other" }]
    //                 });
    //             }

    //             console.log("Updated messages:", JSON.stringify(newMessages, null, 2));
    //             return newMessages;
    //         });

    //         setCurrentQuestion(nextQuestion || null);
    //         setLastUserSelection(selectedOption.question_text);
    //         setSelectedOptions(prev => ({ ...prev, [levelKey]: selectedOption.question_text }));

    //         // Trigger callback message only if not already requested
    //         if (!nextQuestion || !nextQuestion.children || nextQuestion.children.length === 0) {
    //             if (!callbackRequested) {
    //                 setCallbackRequested(true);
    //                 setShowCallbackMessage(true);
    //             }
    //         }

    //         setShowTypingEffect(false);
    //     }, 1000);
    // };

    const handleUserSelection = (selectedOption, questionIndex) => {
    console.log("User selected:", selectedOption);
    setShowTypingEffect(true);
    playNotificationSound();

    setTimeout(() => {
        const currentMsg = messages[questionIndex];
        if (!currentMsg || !currentMsg.options || currentMsg.options.length === 0) {
            console.log("No further options available for this question. Chat ended.");
            setShowTypingEffect(false);
            return;
        }

        const levelKey = `${currentMsg.text}-${questionIndex}`;
        if (selectedOptions[levelKey] === selectedOption.question_text) {
            console.log("Option already selected at this level, ignoring re-selection.");
            setShowTypingEffect(false);
            return;
        }

        let nextQuestion = currentMsg.options.find(q => q.id === selectedOption.id);
        console.log("Next question found:", nextQuestion, "Children:", nextQuestion?.children);

        let messageUrl = null;
        let shouldOpenInNewTab = false;
        if (nextQuestion?.question_label && nextQuestion.question_label !== 'null') {
            switch (nextQuestion.question_type) {
                case 2: // File download (e.g., PDF)
                case 6: // Link
                    messageUrl = formatURL(nextQuestion.question_label);
                    shouldOpenInNewTab = true; // Open PDFs and links in a new tab
                    break;
                case 4: // Video
                case 5: // Image
                    messageUrl = formatURL(nextQuestion.question_label);
                    shouldOpenInNewTab = false; // Do not open videos and images in a new tab
                    break;
                default:
                    messageUrl = formatURL(nextQuestion.url || currentMsg.url);
                    shouldOpenInNewTab = false;
            }
        }

        // Open the URL directly in a new tab only for PDFs and links
        if (messageUrl && shouldOpenInNewTab) {
            console.log("Opening URL directly:", messageUrl);
            window.open(messageUrl, '_blank', 'noopener,noreferrer');
        }

        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            const insertIndex = newMessages.length; // Insert after the last message

            // Add user message
            if (!newMessages.some(msg => msg.text === selectedOption.question_text && msg.sender === 'user')) {
                newMessages.splice(insertIndex, 0, { text: selectedOption.question_text, sender: 'user' });
            }

            // Add bot message only if NOT a link/PDF or if it has children
            if (nextQuestion && nextQuestion.children && nextQuestion.children.length > 0) {
                // If there are children, display the next question with sub-options
                newMessages.push({
                    text: nextQuestion.question_text,
                    sender: 'bot',
                    type: nextQuestion.question_type || currentMsg.type,
                    url: messageUrl && !shouldOpenInNewTab ? messageUrl : undefined, // Include url for videos/images, omit for links/PDFs
                    question_label: nextQuestion.question_label || currentMsg.question_label,
                    options: nextQuestion.children ? [...nextQuestion.children, { id: "other", question_text: "Other" }] : [{ id: "other", question_text: "Other" }]
                });
            } else if (!shouldOpenInNewTab) {
                // If no children and NOT a link/PDF, add the bot message (e.g., for videos, images, or text options)
                newMessages.push({
                    text: nextQuestion?.question_text || selectedOption.question_text,
                    sender: 'bot',
                    type: nextQuestion?.question_type || currentMsg.type,
                    url: messageUrl && !shouldOpenInNewTab ? messageUrl : undefined, // Include url for videos/images, omit for links/PDFs
                    question_label: nextQuestion?.question_label || currentMsg.question_label
                });
            }

            console.log("Updated messages:", JSON.stringify(newMessages, null, 2));
            return newMessages;
        });

        setCurrentQuestion(nextQuestion || null);
        setLastUserSelection(selectedOption.question_text);
        setSelectedOptions(prev => ({ ...prev, [levelKey]: selectedOption.question_text }));

        // Trigger callback message for leaf nodes
        if (!nextQuestion || !nextQuestion.children || nextQuestion.children.length === 0) {
            if (!callbackRequested) {
                setCallbackRequested(true);
                setShowCallbackMessage(true);
            }
        }

        setShowTypingEffect(false);
    }, 1000);
};

    const handleOptionClick = (selectedOptionLabel, questionIndex) => {
        console.log("Clicked Option:", selectedOptionLabel, "from questionIndex:", questionIndex);
        playNotificationSound();
        resetInactivityTimer();

        const currentOptions = messages[questionIndex]?.options || [];
        const selectedOption = currentOptions.find(opt => opt.question_text === selectedOptionLabel);

        if (selectedOptionLabel === "Other") {
            if (!isDetailsFormVisible) {
                setIsDetailsFormVisible(true);
                setIsOtherSelected(true);
                return;
            }
        }

        if (selectedOption) {
            if (messages[questionIndex].text === "Request a Callback?") {
                console.log("Handling callback selection for:", selectedOptionLabel);
                handleCallbackSelection(selectedOptionLabel);
            } else {
                handleUserSelection(selectedOption, questionIndex);
            }
        } else {
            console.log("Selected option not found in available choices.");
        }
    };

    const handleUserQuerySubmit = async (query) => {
        console.log("🚀 handleUserQuerySubmit fired with query:", query);
        setShowTypingEffect(true);
        playNotificationSound();
        resetInactivityTimer();

        if (!query.trim()) {
            setShowTypingEffect(false);
            return;
        }

        console.log("isDetailsSubmitted before submitting query:", isDetailsSubmitted);

        if (!isDetailsSubmitted) {
            console.log("🚨 User details not submitted! Please submit your details first.");

            setPendingQuery(query);
            setIsDetailsRequested(true);
            setIsOtherSelected(true);
            setIsDetailsFormVisible(true);

            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: "Please submit your details before entering your query.",
                    sender: "bot",
                    type: "warning"
                }
            ]);
            setShowTypingEffect(false);
            return;
        }

        console.log("✅ Submitting user query:", query);

        const userDetails = sessionData?.contactDetails;
        if (!userDetails?.userName || !userDetails?.userContact || !userDetails?.userEmail) {
            console.error("🚨 User details are missing:", userDetails);
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    text: "⚠️ User details are missing! Please provide your details.",
                    sender: "bot",
                    type: "warning"
                }
            ]);
            setShowTypingEffect(false);
            return;
        }

        // ✅ Save query to localStorage
        const existingQueries = JSON.parse(localStorage.getItem("userQueries") || "[]");
        existingQueries.push({ sessionId, query, userDetails, timestamp: new Date().toISOString() });
        localStorage.setItem("userQueries", JSON.stringify(existingQueries));

        // ✅ Simulate bot reply
        setTimeout(() => {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: query, sender: "user" },
                { text: "Thank you for your question! Our team will get back to you shortly.", sender: "bot" }
            ]);
            setShowTypingEffect(false);
        }, 500);

        setIsQuerySubmitted(true);
        setUserQuery("");
        setPendingQuery("");
    };


    const handleUserDetailsSubmit = async (details, clientId) => {
        console.log("User details submitted:", details);
        setShowTypingEffect(true);
        playNotificationSound();

        if (!details || !details.userName || !details.userContact || !details.userEmail) {
            console.error("🚨 Invalid user details:", details);
            setShowTypingEffect(false);
            return;
        }

        setSessionData(prev => ({
            ...prev,
            contactDetails: details,
        }));

        const lastQuestionId = currentQuestion?.id || 0;

        try {

            const inquiryData = {
                Client_name: details.userName,
                contact: details.userContact,
                email: details.userEmail,
                last_question: lastQuestionId,
                agent_remarks: "",
                Next_followup: "",
                Client_id: clientId,
            }

            const inquiryResponse = await submitInquiry(inquiryData);
            console.log("✅ Inquiry API Response:", inquiryResponse);

            const newMessages = [
                { text: `Name: ${details.userName}`, sender: "user" },
                { text: `Mobile: ${details.userContact}`, sender: "user" },
                { text: `Email: ${details.userEmail}`, sender: "user" },
                // { text: inquiryResponse?.message || "Your inquiry has been submitted.", sender: "bot" }
                { text: "Thank you for sharing your details!Our representatives will get in touch with you shortly.", sender: "bot" }
            ];

            setMessages(prevMessages => [...prevMessages, ...newMessages]);
            setIsDetailsRequested(false);
            setIsDetailsSubmitted(true);
            setIsDetailsFormVisible(false);
            setRatingTriggerPoint("details");

        } catch (error) {
            console.error("❌ Failed to submit inquiry:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "❌ Failed to submit your inquiry. Please try again later.", sender: "bot" }
            ]);
        }
        setShowTypingEffect(false);
    };

    const handleCloseReminder = async () => {
        setShowReminder(false);
        playNotificationSound();
    };
    const handleExitPrompt = async () => {
        setShowTypingEffect(true);
        // Simulate a bot message without API
        setTimeout(() => {
            const simulatedMessage = "Oh! Leaving so soon? I'm here if you need anything!";
            setExitPromptMessage(simulatedMessage); // Set a local prompt message
            setShowExitPrompt(true); // Show the exit prompt
            setShowTypingEffect(false);
        }, 1000); // Optional delay for a smoother experience
    };

    // const handleExitResponse = async (userMessage) => {

    //     if (!userMessage || (userMessage !== "Yes" && userMessage !== "No")) {
    //         console.error("❌ Invalid message provided for handleExitResponse:", userMessage);
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             { sender: "bot", text: "Invalid response. Please choose Yes or No." }
    //         ]);
    //         return;
    //     }
    //     setShowTypingEffect(true);
    //     playNotificationSound();
    //     // Simulate a response based on user input
    //     setTimeout(() => {
    //         const simulatedResponse =
    //             userMessage === "Yes"
    //                 ? "One of our representatives will get in touch with you shortly."

    //                 : "Thank you for using our services — we hope to serve you again soon! Have a great day!";


    //         // Display the response in the chat
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             { sender: "bot", text: simulatedResponse }
    //         ]);

    //         if (userMessage === "Yes") {
    //             console.log("✅ User selected Yes. Keeping chatbot open...");
    //             setShowExitPrompt(false);
    //         } else if (userMessage === "No") {
    //             console.log("✅ User selected No. Closing chatbot...");
    //             setTimeout(() => {
    //                 resetChatbot(); // Clear the chat
    //                 setIsOpen(false); // Close the chat UI

    //             }, 2000);
    //         }
    //         setShowTypingEffect(false);
    //     }, 1000);
    // };

    const handleExitResponse = async (userMessage) => {
    if (!userMessage || (userMessage !== "Yes" && userMessage !== "No")) {
        console.error("❌ Invalid message provided for handleExitResponse:", userMessage);
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "bot", text: "Invalid response. Please choose Yes or No." }
        ]);
        return;
    }
 
    setShowTypingEffect(true);
    playNotificationSound();
 
    setTimeout(() => {
        if (userMessage === "Yes") {
            console.log("✅ User selected Yes. Showing ONLY 'Other' option...");
 
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: "bot",
                    options: [{ id: "other", question_text: "Other" }]
                }
            ]);
 
            setShowExitPrompt(false);
        } else {
            console.log("✅ User selected No. Closing chatbot...");
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    sender: "bot",
                    text: "Thank you for using our services — we hope to serve you again soon! Have a great day!"
                }
            ]);
            setTimeout(() => {
                resetChatbot();
                setIsOpen(false);
            }, 2000);
        }
 
        setShowTypingEffect(false);
    }, 1000);
};

    const handleCallbackSelection = async (preference) => {
        console.log("User selected callback preference:", preference);
        setShowTypingEffect(true);
        playNotificationSound();

        setTimeout(() => {
            setCallbackPreference(preference);
            setShowCallbackMessage(false); // Hide callback question

            // Add user message
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "user", text: preference }
            ]);

            // Simulate bot response without API

            const botMessage = preference === "Yes"
                ? "Our representatives will reach out to you shortly."
                : "Alright! Let us know if you need any help later.";

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: botMessage }
            ]);


            // Track callback request
            setSessionData((prev) => ({
                ...prev,
                requestedCallback: preference === "Yes",
            }));

            // Show details form after 4 seconds if "YES" is selected
            if (preference === "Yes") {
                setTimeout(() => {
                    setIsDetailsFormVisible(true);
                }, 1000);
            } else {
                setShowWhatsAppAfterNoCallback(true);
                setShowRestartPrompt(true);
            }
            setShowTypingEffect(false);
        }, 1000);
    };


    const handleReviewSubmit = async (rating) => {
        setShowTypingEffect(true);
        playNotificationSound();

        setTimeout(() => {
            setUserRating(rating);
            setIsRatingSubmitted(true);

            // Convert rating to star format
            const ratingStars = "★".repeat(rating) + "☆".repeat(5 - rating);
            const userMessage = `Ratings: ${ratingStars} (${rating}/5)`;

            // Simulate bot response (no API)

            setMessages((prev) => [
                ...prev,
                { sender: "user", text: userMessage },
                { sender: "bot", text: "Thanks for your feedback! 😊" }
            ]);

            setShowRestartPrompt(true);
            setShowTypingEffect(false);
        }, 1000);
    };



    const resetChatbot = (fullReset = false) => {
        setMessages([]);
        setOptions([]);
        setCurrentQuestion(null);
        setLastUserSelection(null);
        setShowExitPrompt(false);
        setExitPromptMessage("");
        setShowCallbackMessage(false);
        setCallbackPreference(null);
        setIsOtherSelected(false);
        setIsQuerySubmitted(false);
        setShowTypingEffect(false);
        setShowRestartPrompt(false);
        setShowReminder(false);
        setUserQuery("");
        setPendingQuery("");
        setSelectedOptions({});
        setCallbackRequested(false);

        if (fullReset) {
            // ✅ Only do this when a brand new session is started
            setIsDetailsFormVisible(false);
            setIsDetailsRequested(false);
            setIsDetailsSubmitted(false);
            setUserRating(null);
            setIsRatingSubmitted(false);
            setRatingTriggerPoint(null);
            setRatingResetKey(prev => prev + 1);
            setSessionData({
                // sessionId: null,
                messages: [],
                contactDetails: null,
            });

            localStorage.removeItem("chatHistory");
            localStorage.removeItem("userRating");
        }

        console.log("✅ Chatbot reset. Full reset:", fullReset);
    };



    const handleRestartResponse = (response) => {
        setShowTypingEffect(true);
        if (response === "Yes") {
            resetChatbot(false);
            console.log("Restart chat", response);
            startChat();  // Restart the chat
        } else {

            handleExitResponse("No");
        }
        playNotificationSound();
        // setShouldShowRating(true);
        setRatingTriggerPoint("callback");
        setShowRestartPrompt(false);
        setShowTypingEffect(false);
        console.log(" Restart chat", response);
    };

//     useEffect(() => {
//   const loadContact = async () => {
//     const number = await getClientContactNumber(clientId);
//     setWhatsAppNumber(number);
//   };
//   loadContact();
//   startChat();
// }, [clientId]);

useEffect(() => {
  const loadContact = async () => {
    const number = await getClientContactNumber(clientId);
    console.log("📞 WhatsApp number for client", clientId, "is", number);
    setWhatsAppNumber(number);
  };
  if (clientId) {
    loadContact();
  }
}, [clientId]);



    return (
        <>

            <div className="position-fixed bottom-0 end-0 mb-3 me-3 z-3">
                <ToggleButton toggleChatbot={handleToggleChatbot} />
            </div>

            {isOpen && (
                 <div className="chat-container border rounded shadow bg-white ">
                    <div className="border-bottom">
                        <ChatHeader handleBackClick={handleBackClick} handleExitPrompt={handleExitPrompt}
                            isBackDisabled={isBackDisabled} />
                    </div>

                    <div className="chat-box p-4 overflow-auto" style={{ height: 'calc(100% - 80px)' }}>
                        {showSlideWindow && (
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white d-flex flex-column justify-content-center align-items-center p-3" style={{ zIndex: 1050 }}>
                                <h5 className="text-center fw-bold mb-2">Do You Want To...</h5>
                                <div className="list-group w-75">
                                    <button
                                        className="list-group-item list-group-item-action d-flex align-items-center p-2"
                                        onClick={() => handleBackWindowSelection('Continue old conversation')}
                                    >
                                        <span className="me-2 fs-5">💬</span>
                                        <div>
                                            <div className="fw-bold">Continue old conversation</div>
                                            <small className="text-muted">Resume where you left off</small>
                                        </div>
                                    </button>
                                    <button
                                        className="list-group-item list-group-item-action d-flex align-items-center p-2"
                                        onClick={() => handleBackWindowSelection('Start a new conversation')}
                                    >
                                        <span className="me-2 fs-5">🆕</span>
                                        <div>
                                            <div className="fw-bold">Start a new conversation</div>
                                            <small className="text-muted">Begin a fresh chat</small>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}


                        {showFirstMessage && messages.map((msg, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                                className="mb-1">
                                {msg.sender === 'user' && <UserMessage text={msg.text} />}
                                {msg.sender === 'bot' && (
                                    <>
                                    
                                        <BotMessage text={msg.text} questionLabel={msg.question_label} formatURL={formatURL} />
                                        {msg.options && msg.options.length > 0 && (
                                            <OptionsContainer
                                                options={msg.options}
                                                handleOptionClick={(label) => handleOptionClick(label, index)}
                                                handleUserQuerySubmit={handleUserQuerySubmit}
                                            />
                                        )}

                                        {/* Media Rendering Section */}
                                        {msg.url && (
                                            <div className="media-container mt-1">
                                                {/* Image Display */}
                                                {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.url) && (
                                                    <div className="text-center my-2">
                                                        <img
                                                            src={formatURL(msg.url)}
                                                            alt="Chat response"
                                                            className="img-fluid rounded shadow-sm"
                                                            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                )}

                                                {/* PDF Display */}
                                                {msg.url.toLowerCase().endsWith('.pdf') && (
                                                    <div className="pdf-preview my-1">
                                                        <a
                                                            href={formatURL(msg.url)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-primary btn-sm"
                                                        >
                                                            <i className="bi bi-file-earmark-pdf me-1"></i> View PDF Document
                                                        </a>
                                                    </div>
                                                )}

                                                {/* Video Display */}
                                                {/\.(mp4|webm|ogg)$/i.test(msg.url) && (
                                                    <div className="video-wrapper my-2">
                                                        <video
                                                            controls
                                                            className="w-100 rounded"
                                                            style={{ maxHeight: '200px' }}
                                                        >
                                                            <source src={formatURL(msg.url)} type={`video/${msg.url.split('.').pop()}`} />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                )}

                                                {/* Generic Link Display */}
                                                {!msg.url.match(/\.(jpg|jpeg|png|gif|webp|pdf|mp4|webm|ogg)$/i) && (
                                                    <div className="link-preview my-1">
                                                        <a
                                                            href={formatURL(msg.url)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-primary btn-sm me-2"
                                                        >
                                                            View Link
                                                        </a>
                                                        {/* <i className="bi bi-box-arrow-up-right me-1"></i> Open Link
                                                        </a> */}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        ))}

                        {/* Options and Inputs */}
                        {!isQuerySubmitted ? (
                            isOtherSelected ? (
                                <OtherQueryInput handleQuerySubmit={handleUserQuerySubmit} isQueryInputDisabled={isQueryInputDisabled} />
                            ) : null

                        ) : null}

                        {showExitPrompt && (
                            <div className="alert alert-warning text-center p-1">
                                <p className="mb-1">{exitPromptMessage}</p>
                                <div className="d-flex justify-content gap-1"></div>
                                <button className="btn btn-danger btn-sm" onClick={() => handleExitResponse("Yes")}>Yes</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => handleExitResponse("No")}>No</button>
                            </div>
                        )}

                   {/* {showRestartPrompt && (
  <div>
   

    <div className="alert alert-info text-center p-1">
      <p className="mb-1">Would you like to start again?</p>
      <div className="d-flex justify-content-center gap-1">
        <button className="btn btn-primary btn-sm" onClick={() => handleRestartResponse("Yes")}>Yes</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRestartResponse("No")}>No</button>
      </div>
    </div>
  </div>
)} */}

{showRestartPrompt && (
  <div>
    {/* {showWhatsAppAfterNoCallback && (
      <div className="text-center my-3">
        <p className="mb-2">For Quick Chat</p>
        <a
        //   href="https://wa.me/8421924019"
         href={`https://wa.me/${whatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success d-inline-flex align-items-center"
          style={{ fontWeight: "bold" }}
        >
          <i className="bi bi-whatsapp me-2"></i> CONNECT ON WHATSAPP
        </a>
      </div>
    )} */}
    {showWhatsAppAfterNoCallback && whatsAppNumber !== "8421924019" && (
  <div className="text-center my-3">
    <p className="mb-2">For Quick Chat</p>
    <a
      href={`https://wa.me/${whatsAppNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-success d-inline-flex align-items-center"
      style={{ fontWeight: "bold" }}
    >
      <i className="bi bi-whatsapp me-2"></i> CONNECT ON WHATSAPP
    </a>
  </div>
)}


    <div className="alert alert-info text-center p-1">
      <p className="mb-1">Would you like to start again?</p>
      <div className="d-flex justify-content-center gap-1">
        <button className="btn btn-primary btn-sm" onClick={() => handleRestartResponse("Yes")}>Yes</button>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRestartResponse("No")}>No</button>
      </div>
    </div>
  </div>
)}




                        
{showTypingEffect && (
  <div className="d-flex align-items-start p-2">
    <div
      className="bg-light px-3 py-2 d-inline-flex align-items-center justify-content-center shadow-sm"
      style={{
        width: "40px",
        height: "36px",
        backgroundColor: "#F1F0F0",
        borderTopLeftRadius: "15px",   // Rounded
        borderTopRightRadius: "15px",  // Rounded
        borderBottomRightRadius: "15px", // Rounded
        borderBottomLeftRadius: "0px"   // 🔥 Flat (no radius)
      }}
    >
      {["0", "0.2", "0.4"].map((delay, idx) => (
        <motion.span
          key={idx}
          className="text-secondary"
          style={{ fontSize: "15px", margin: "0 2px" }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: parseFloat(delay) }}
        >
          ●
        </motion.span>
      ))}
    </div>
  </div>
)}
                        {showCallbackMessage && (
                            <CallbackPreference options={["Yes", "No"]} onSelectCallback={handleCallbackSelection} />
                        )}

                        {(isOtherSelected || (callbackPreference === "Yes" && isDetailsFormVisible)) && !isDetailsSubmitted && (
                            <UserInputContainer
                                currentInputStep="details"
                                handleUserDetailsSubmit={handleUserDetailsSubmit}
                                detailsSubmitted={isDetailsSubmitted}
                            />
                        )}




                        {/* {isDetailsSubmitted && !isRatingSubmitted && (
                            <StarRating handleReviewSubmit={handleReviewSubmit} isRatingDisabled={isRatingSubmitted} />
                        )} */}
                           
                           {isDetailsSubmitted && !isRatingSubmitted && (
    <>
        <div className="text-center my-3">
            <p className="mb-2">For Quick Chat</p>
            <a
                // href="https://wa.me/8421924019"
               href={`https://wa.me/${whatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success d-inline-flex align-items-center"
                style={{ fontWeight: "bold" }}
            >
                <i className="bi bi-whatsapp me-2"></i> CONNECT ON WHATSAPP
            </a>
        </div>

        <StarRating handleReviewSubmit={handleReviewSubmit} isRatingDisabled={isRatingSubmitted} />
    </>
)}



                        {showReminder && (
                            <div className="alert alert-light position-absolute bottom-0 start-50 translate-middle-x mb-1 d-flex justify-content-between align-items-center w-90 px-2">
                                <span className="small">👋 Still there? Let us know how we can help!</span>
                                <button className="btn-close p-0" onClick={handleCloseReminder}></button>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div >
          <div className="text-center small text-muted py-2" style={{ borderTop: "1px solid #eee", fontSize: "0.75rem", background: "#fff" }}>
  ⚡ Powered by&nbsp;
  <a 
    href="https://ataibot.in/" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-decoration-none" 
    style={{ color: "#007bff", fontWeight: "bold" }}
  >
    ATai
  </a>
</div>


                </div >
            )}
        </>
    );

};

export default ChatContainer;



