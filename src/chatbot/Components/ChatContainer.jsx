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
import { motion } from 'framer-motion';
// import '../css/Chat.css';
import notificationSoundFile from '../sound/notification.mp3';

import {
    fetchQuestions,
    initRecordingConversation,
    submitCallbackPreference,
    // sendUserDetailsToBackend,
    submitInquiry,
    submitUserQueryToBackend,
    submitUserRating,
    terminateChat,
    handleTerminateResponse,
    // sendDataToDatabase
} from '../../services/chatbotServices';

const ChatContainer = () => {

    const inactivityTimerRef = useRef(null);

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
    const [showTypingEffect, setShowTypingEffect] = useState(false);
    const [showFirstMessage, setShowFirstMessage] = useState(false);
    const [showRestartPrompt, setShowRestartPrompt] = useState(false);


    const clientId = localStorage.getItem("clientId");


    // const [robotArrived, setRobotArrived] = useState(false); // ✅ Track robot movement


    // const handleRobotAnimationComplete = () => {
    //     setRobotArrived(true); // ✅ When the robot reaches, chatbot opens
    //     setTimeout(() => {
    //         handleToggleChatbot(); // ✅ Open chatbot after a slight delay
    //     }, 500);
    // };


    // const notificationSound = new Audio('/sounds/notification.mp3');

    // const playNotificationSound = useCallback(() => {
    //     notificationSound.play().catch(error => console.error("Error playing sound:", error));
    // }, []);


    const playNotificationSound = useCallback(() => {
        const notificationSound = new Audio(notificationSoundFile);
        notificationSound.play().catch(error => console.error("Error playing sound:", error));
    }, []);



    // ✅ Generate a Unique 6-Character Session ID
    const generateId = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let uniqueID = "";
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            uniqueID += characters[randomIndex];
        }
        return uniqueID;
    };


    const [sessionData, setSessionData] = useState({
        sessionId: null,
        // visitorType: "Anonymous Visitor",
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
                console.log("✅ Unique User ID (Session ID):", sessionId);
                console.log("✅ Last Selected Question:", lastUserMessage.text);
            }
        }
    }, [messages, sessionId]); // Runs every time messages update

    const saveChatHistory = () => {
        localStorage.setItem("chatHistory", JSON.stringify(messages)); // Use messages instead of chatMessages
    };




    const startInactivityTimer = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        // console.log("Starting inactivity timer...");

        inactivityTimerRef.current = setTimeout(() => {
            console.log("User inactive - showing reminder.");
            setShowReminder(true);
        }, 5 * 60 * 1000); // 5 minutes

        // Play notification sound after 10 seconds
        setTimeout(() => {
            playNotificationSound();
        }, 1000);
    }, [playNotificationSound]);


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
        if (!isOpen) {
            const newSessionId = generateId(); // Generate unique session ID
            console.log("Generated Session ID:", newSessionId);

            setSessionId(newSessionId);
            setSessionData((prev) => ({ ...prev, sessionId: newSessionId }));
            console.log("Session Data Updated:", { sessionId: newSessionId });

            startChat(); // Start the chat session
            setIsOpen(true); // Open the chatbot window

            // Call API to initialize conversation recording
            try {
                const response = await initRecordingConversation(newSessionId);
                console.log("✅ Conversation recording started:", response);
            } catch (error) {
                console.error("❌ Failed to initialize conversation:", error);
            }
        }
    };


    const startChat = async () => {
        try {

            console.log("🚀 Starting new chat session...");
            setMessages([]);
            setOptions([]);
            setCurrentQuestion(null);
            setShowTypingEffect(true);

            setTimeout(async () => {
                setShowTypingEffect(false); // Hide typing effect after 2s
                setShowFirstMessage(true); // Show first bot message

                // const clientId = "8";
                console.log("Using hardcoded Client ID:", clientId);

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

                setMessages([{
                    text: firstQuestion.question_text,
                    sender: 'bot',
                    type: firstQuestion.question_type,
                    url: formatURL(firstQuestion.url),
                    question_label: firstQuestion.question_label
                }]);
                setOptions([...firstQuestion.children || [], { id: "other", question_text: "Other" }]); setCurrentQuestion(firstQuestion);
                playNotificationSound();
            }, 1000);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };



    const handleBackClick = () => {
        console.log("🔄 Back button clicked! Opening slide window...");
        setShowSlideWindow(true);
    };

    const loadPreviousConversation = () => {
        console.log("🔄 Loading previous conversation...");

        try {
            const savedMessages = localStorage.getItem("chatHistory");

            if (savedMessages) {
                const parsedMessages = JSON.parse(savedMessages);

                if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
                    setMessages(parsedMessages);
                    console.log("✅ Previous chat loaded successfully:", parsedMessages);
                } else {
                    console.warn("⚠️ No valid previous chat found.");
                }
            } else {
                console.warn("⚠️ No chat messages found in localStorage.");
            }
        } catch (error) {
            console.error("❌ Error loading previous chat:", error);
        }

        setShowSlideWindow(false); // ✅ Close slider after loading previous chat
    };

    const startNewConversation = async () => {
        console.log("🆕 Starting a new conversation...");
        setPreviousMessages([...messages]); // Save old messages
        setMessages([]); // Clear chat
        setOptions([]); // Reset options
        setCurrentQuestion(null); // Reset chatbot state
        setIsDetailsFormVisible(false); // Hide form
        setIsOtherSelected(false); // Reset "Other" option
        setShowCallbackMessage(false);
        setShowSlideWindow(false); // Close the slide window

        // ✅ Reset the rating state
        setUserRating(null);
        setIsRatingSubmitted(false);

        localStorage.removeItem("chatHistory"); // ✅ Fix key mismatch
        localStorage.removeItem("userRating"); // ✅ Ensure rating is cleared from storage

        setTimeout(() => {
            startChat(); // Start a fresh chat
        }, 1000);
    };




    const handleUserSelection = (selectedOption) => {
        console.log("User selected:", selectedOption);


        if (!currentQuestion || !currentQuestion.children || currentQuestion.children.length === 0) {
            console.log("No further questions available. Chat ended.");
            return;
        }

        // ✅ Find the next question
        let nextQuestion = currentQuestion.children.find(q => q.id === selectedOption.id);

        console.log("Next question found:", nextQuestion);

        if (nextQuestion) {
            setMessages(prevMessages => {
                const newMessages = [...prevMessages];

                //user message
                if (!newMessages.some(msg => msg.text === selectedOption.question_text && msg.sender === 'user')) {
                    newMessages.push({ text: selectedOption.question_text, sender: 'user' });
                }

                //Bot message
                if (!newMessages.some(msg => msg.text === nextQuestion.question_text && msg.sender === 'bot')) {
                    newMessages.push({
                        text: nextQuestion.question_text,
                        sender: 'bot',
                        type: nextQuestion.question_type,
                        url: formatURL(nextQuestion.url),
                        question_label: nextQuestion.question_label
                    });
                }

                return newMessages;
            });

            // ✅ Print what options are available at this stage
            console.log("📝 Available Options for Next Step:", nextQuestion.children);


            // ✅ Display only relevant next-level options
            setOptions(nextQuestion.children ? [...nextQuestion.children, { id: "other", question_text: "Other" }] : []);
            setCurrentQuestion(nextQuestion);
            playNotificationSound();

            // ✅ Show user details form if this is the final question
            if (!nextQuestion.children || nextQuestion.children.length === 0) {
                console.log("Final question reached. Passing data to the database...")
                // sendDataToDatabase(sessionId, selectedOption.question_text);  // Send session_id and option to database
                setIsDetailsFormVisible(true); // ✅ Now the form will appear

            }

        } else {
            console.log("No further questions. End of conversation.");
        }
    };



    const handleOptionClick = (selectedOptionLabel) => {
        console.log("Clicked Option:", selectedOptionLabel);
        resetInactivityTimer();

        // ✅ If "Other" is clicked, check if details are submitted
        if (selectedOptionLabel === "Other") {
            if (!isDetailsFormVisible) {
                setIsDetailsFormVisible(true); // ✅ Show details form first
                setIsOtherSelected(true);
                return;
            }
        }

        //Handle Callback Response (Yes/No)
        if (showCallbackMessage && (selectedOptionLabel === "Yes" || selectedOptionLabel === "No")) {
            handleCallbackSelection(selectedOptionLabel);
            return;

        }
        setIsOtherSelected(false);
        // ✅ Find the selected question from current options
        let selectedOption = options.find(opt => opt.question_text === selectedOptionLabel);

        if (selectedOption) {
            handleUserSelection(selectedOption);  // 🔹 Now correctly processes the next step
            // ✅ After the last question, show the "Request a Callback?" message
            if (!selectedOption.children || selectedOption.children.length === 0) {

                setShowCallbackMessage(true); // ✅ Show callback message

            }

        } else {
            console.log("Selected option not found in available choices.");
        }
    };
    const handleUserQuerySubmit = async (query) => {
        console.log("🚀 handleUserQuerySubmit fired with query:", query);
        resetInactivityTimer();

        if (!query.trim()) return;
        console.log("isDetailsSubmitted before submitting query:", isDetailsSubmitted);

        if (!isDetailsSubmitted) {
            console.log("🚨 User details not submitted! Please submit your details first.");

            // Store the query to auto-submit after details
            setPendingQuery(query);
            console.log("stored pending QUery:", query);
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
            // setIsDetailsFormVisible(true);
            // setIsOtherSelected(true);
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
            return;
        }

        const queryResponse = await submitUserQueryToBackend(sessionId, query, userDetails);

        if (queryResponse.message.includes("Invalid")) {
            console.error("🚨 Failed to submit user query:", queryResponse);
            return;
        }

        setMessages(prevMessages => [
            ...prevMessages,
            { text: query, sender: "user" },
            { text: queryResponse.message || "Your query has been received.", sender: "bot" }
        ]);
        setIsQuerySubmitted(true);
        setUserQuery(""); // Reset input field
        setPendingQuery(""); // Clear pending query (if it was used)
    };

    // const handleUserDetailsSubmit = async (details) => {
    //     console.log("User details submitted:", details);

    //     if (!details || !details.userName || !details.userContact || !details.userEmail) {
    //         console.error("🚨 Invalid user details:", details);
    //         return;
    //     }

    //     setSessionData(prev => ({
    //         ...prev,
    //         contactDetails: details,
    //     }));

    //     try {
    //         const response = await sendUserDetailsToBackend(sessionId, details);
    //         console.log("API Response:", response);

    //         let newMessages = [
    //             { text: `Name: ${details.userName}`, sender: "user" },
    //             { text: `Mobile: ${details.userContact}`, sender: "user" },
    //             { text: `Email: ${details.userEmail}`, sender: "user" },
    //             { text: response?.message || "Your details have been submitted.", sender: "bot" }
    //         ];

    //         // if (isDetailsRequested) {
    //         //     newMessages.push({ text: "Thank you for submitting your details.", sender: "bot" });
    //         // }

    //         setMessages(prevMessages => [...prevMessages, ...newMessages]);
    //         setIsDetailsRequested(false);


    //         setIsDetailsSubmitted(true);
    //         setIsDetailsFormVisible(false);

    //         // ✅ Auto-submit the previously typed query (if exists)
    //         // if (pendingQuery.trim()) {
    //         //     console.log("🟡 Auto-submitting saved query:", pendingQuery);
    //         //     handleUserQuerySubmit(pendingQuery);
    //         //     setPendingQuery("");
    //         // } else {
    //         //     console.log("No pendingQuery to submit.")
    //         // }

    //     } catch (error) {
    //         console.error("Failed to store user details:", error);
    //         setMessages(prevMessages => [
    //             ...prevMessages,
    //             { text: "❌ Failed to submit details. Please try again.", sender: "bot" }
    //         ]);
    //         return;
    //     }


    // };


    const handleUserDetailsSubmit = async (details) => {
        console.log("User details submitted:", details);

        if (!details || !details.userName || !details.userContact || !details.userEmail) {
            console.error("🚨 Invalid user details:", details);
            return;
        }

        setSessionData(prev => ({
            ...prev,
            contactDetails: details,
        }));



        // const lastQuestionLevel = currentQuestion?.question_parent_level || 0;
        // try {
        //     const inquiryPayload = {
        //         action_type: "I",
        //         p_status: "",
        //         p_User_id: sessionId,
        //         p_Client_name: details.userName,
        //         p_contact: details.userContact,
        //         p_email: details.userEmail,
        //         p_last_question: lastQuestionLevel, // ✅ using question_parent_level here
        //         p_agent_remarks: "",
        //         p_Next_followup: "",
        //         p_page_size: 10,
        //         p_page: 1,
        //         p_Client_id: clientId
        //     };


        const lastQuestionId = currentQuestion?.id || 0;

        try {
            const inquiryData = {
                action_type: "I",
                p_status: "",
                p_User_id: sessionId,
                p_Client_name: details.userName,
                p_contact: details.userContact,
                p_email: details.userEmail,
                p_last_question: lastQuestionId,
                p_agent_remarks: "",
                p_Next_followup: "",
                p_page_size: 10,
                p_page: 1,
                p_Client_id: clientId
            };

            const inquiryResponse = await submitInquiry(inquiryData);
            console.log("✅ Inquiry API Response:", inquiryResponse);

            const newMessages = [
                { text: `Name: ${details.userName}`, sender: "user" },
                { text: `Mobile: ${details.userContact}`, sender: "user" },
                { text: `Email: ${details.userEmail}`, sender: "user" },
                { text: inquiryResponse?.message || "Your inquiry has been submitted.", sender: "bot" }
            ];

            setMessages(prevMessages => [...prevMessages, ...newMessages]);
            setIsDetailsRequested(false);
            setIsDetailsSubmitted(true);
            setIsDetailsFormVisible(false);

        } catch (error) {
            console.error("❌ Failed to submit inquiry:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "❌ Failed to submit your inquiry. Please try again later.", sender: "bot" }
            ]);
        }
    };

    const handleCloseReminder = async () => {
        setShowReminder(false);
        // if (sessionId && typeof sessionId === "string") {
        //     await handleExitPrompt(sessionId);
        // } else {
        //     console.error("❌ Invalid session ID.");
        //     setMessages((prevMessages) => [
        //         ...prevMessages,
        //         { sender: "bot", text: "Session ID is missing or invalid." }
        //     ]);
        // }
    };

    const handleExitPrompt = async (sessionId) => {
        if (!sessionId || typeof sessionId !== "string") {
            console.error("❌ Invalid session ID provided for handleExitPrompt.");
            // alert("Session ID is missing or invalid.");
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Session ID is missing or invalid." }
            ]);
            return;
        }

        try {
            const terminateData = await terminateChat(sessionId);

            if (!terminateData || !terminateData.message) {
                console.warn("⚠️ Terminate API response is missing the 'message' property:", terminateData);
                setExitPromptMessage("Something went wrong. Please try again."); // Fallback message
            } else {
                setExitPromptMessage(terminateData.message); // Dynamically set message
            }

            setShowExitPrompt(true); // Show the exit prompt
        } catch (error) {
            console.error("❌ Error fetching exit prompt message:", error);
            setExitPromptMessage("Unable to fetch the prompt. Please try again."); // Fallback message
        }
    };

    const handleExitResponse = async (userMessage, sessionId) => {

        // Validate sessionId
        if (!sessionId || typeof sessionId !== "string" || sessionId.trim() === "") {
            console.error("❌ Invalid session ID provided for handleExitResponse:", sessionId);
            // alert("Session ID is missing or invalid. Please try again.");
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Session ID is missing or invalid. Please try again." }
            ]);
            return;
        }

        // Validate userMessage
        if (!userMessage || (userMessage !== "Yes" && userMessage !== "No")) {
            console.error("❌ Invalid message provided for handleExitResponse:", userMessage);
            // alert("Invalid response. Please choose Yes or No.");

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Invalid response. Please choose Yes or No." }
            ]);
            return;
        }

        try {
            console.log("🔄 Sending terminate_response API with sessionId:", sessionId, "message:", userMessage, clientId);

            const terminateResponse = await handleTerminateResponse(sessionId, userMessage, clientId); // Make API call

            console.log("✅ Terminate Response API Response:", terminateResponse);

            if (!terminateResponse || !terminateResponse.message) {
                console.warn("⚠️ TerminateResponse API response is missing the 'message' property:", terminateResponse);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender: "bot", text: "We were unable to process your request. Please try again later." }
                ]);
                return; // Exit early
            }

            // Display the API response in the chatbot
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: terminateResponse.message } // Add API's response message
            ]);

            if (userMessage === "Yes") {
                console.log("✅ User selected Yes. Keeping chatbot open...");
                setShowExitPrompt(false); // Hide exit prompt but keep chatbot open
            } else if (userMessage === "No") {
                console.log("✅ User selected No. Closing chatbot...");
                setTimeout(() => {
                    resetChatbot(); // Reset chatbot state
                    setIsOpen(false); // Close chatbot UI
                }, 2000); // Delay closing to ensure message is displayed
            }
        } catch (error) {
            console.error("❌ Error handling terminate_response API:", error);

            // Display fallback error message in chatbot
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "An error occurred while processing your response. Please try again later." }
            ]);
        }
    };

    // Function to handle user's callback selection
    const handleCallbackSelection = async (preference) => {
        console.log("User selected callback preference:", preference);
        setCallbackPreference(preference);
        setShowCallbackMessage(false); // Hide callback question

        // Add user message
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", text: preference }
        ]);

        try {
            // Send preference to API
            const response = await submitCallbackPreference(sessionId, preference);
            console.log("API Response:", response);

            // Bot response from API
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: response.message || "Our representatives will reach out to you." }
            ]);
        } catch (error) {
            console.error("Error submitting callback preference:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "Sorry, something went wrong. Please try again later." }
            ]);
        }

        // Track callback request
        setSessionData((prev) => ({
            ...prev,
            requestedCallback: preference === "Yes",
        }));

        // Show details form after 2 seconds if "YES" is selected
        if (preference === "Yes") {
            setTimeout(() => {
                setIsDetailsFormVisible(true);
            }, 4000);

        } else {
            setShowRestartPrompt(true);
        }
    };
    const handleReviewSubmit = async (rating) => {  // ✅ Add `async` keyword
        setUserRating(rating);
        setIsRatingSubmitted(true);
        // Convert rating to star format
        const ratingStars = "★".repeat(rating) + "☆".repeat(5 - rating);
        const userMessage = `Ratings: ${ratingStars} (${rating}/5)`;

        try {
            const response = await submitUserRating(sessionId, rating); // ✅ Use `await` inside async function
            console.log("✅ Rating API Response:", response);

            setMessages((prev) => [
                ...prev,
                { sender: "user", text: userMessage },
                { sender: "bot", text: response.message },
                // ✅ API Response
            ]);
        } catch (error) {
            console.error("❌ Error submitting rating:", error);
        }

        setShowRestartPrompt(true);
        playNotificationSound();
    };

    const resetChatbot = () => {
        setMessages([]);
        setShowExitPrompt(false);
        setShowCallbackMessage(false);
        setCallbackPreference(null);

        setIsDetailsFormVisible(false);
        setIsDetailsSubmitted(false);

        setUserRating(null);
        setIsRatingSubmitted(false);

        setIsOtherSelected(false);
        setIsQuerySubmitted(false);
        setShowTypingEffect(false);
        setShowRestartPrompt(false);
        setShowReminder(false);
        setUserQuery("");
        console.log("Chatbot reset. Query cleared.");


    };

    const handleRestartResponse = (response) => {
        if (response === "Yes") {
            resetChatbot();
            startChat();  // Restart the chat
        } else {
            // resetChatbot();
            console.log("Restart chat", response);
            // setIsOpen(false); // Close chatbot

            handleExitResponse("No", sessionId);
        }
        setShowRestartPrompt(false);
        console.log(" Restart chat", response);
    };
    return (
        <>
            {/* Toggle Button Bottom-Right */}
            <div className="position-fixed bottom-0 end-0 m-3 z-3">
                <ToggleButton toggleChatbot={handleToggleChatbot} />
            </div>

            {isOpen && (
                <div className="chat-container border rounded shadow bg-white position-fixed bottom-0 end-0 m-3 w-100 w-sm-auto" style={{ maxWidth: '380px', height: '600px', overflow: 'hidden', zIndex: 1000 }}>

                    {/* Chat Header */}
                    <div className="border-bottom">
                        <ChatHeader handleBackClick={handleBackClick} handleExitPrompt={handleExitPrompt} sessionId={sessionId} />
                    </div>

                    {/* Conversation Body */}
                    <div className="chat-box p-3 overflow-auto" style={{ height: "calc(100% - 60px)" }}>
                        {showSlideWindow && (
                            <div className="mb-3">
                                <h5 className="text-center fw-bold">Talk to us...</h5>
                                <div className="d-flex flex-column gap-2">
                                    <div className="p-2 bg-light rounded d-flex" onClick={loadPreviousConversation}>
                                        <span className="me-2">💬</span>
                                        <div>
                                            <div className="fw-bold">Continue old conversation</div>
                                            <div className="text-muted small">Resume where you left off</div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-light rounded d-flex" onClick={startNewConversation}>
                                        <span className="me-2">🆕</span>
                                        <div>
                                            <div className="fw-bold">Start a new conversation</div>
                                            <div className="text-muted small">Begin a fresh chat</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showTypingEffect && (
                            <motion.div className="bot-message typing-effect text-muted fst-italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />
                        )}

                        {showFirstMessage && messages.map((msg, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                {msg.sender === 'user' && <UserMessage text={msg.text} />}
                                {msg.sender === 'bot' && (
                                    <>
                                        <BotMessage text={msg.text} />

                                        {msg.question_label && /\.(jpg|jpeg|png|gif)$/i.test(msg.question_label) && (
                                            <div className="text-center my-2">
                                                <img src={msg.question_label} alt="Chatbot response" className="img-fluid rounded" />
                                            </div>
                                        )}

                                        {msg.question_label?.startsWith("http") && (
                                            <a href={msg.question_label} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm my-2">Open Link</a>
                                        )}

                                        {msg.question_label?.toLowerCase().endsWith(".pdf") && msg.url && (
                                            <a href={msg.url} download target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary btn-sm my-2">📄 Download PDF</a>
                                        )}

                                        {msg.url && /\.(mp4|webm|ogg)$/i.test(msg.url) && (
                                            <div className="my-2">
                                                <video controls className="w-100 rounded">
                                                    <source src={`${msg.url}?t=${Date.now()}`} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
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
                            ) : (
                                <OptionsContainer options={options} handleOptionClick={handleOptionClick} handleUserQuerySubmit={handleUserQuerySubmit} />
                            )
                        ) : null}

                        {showExitPrompt && (
                            <div className="alert alert-warning text-center">
                                <p>{exitPromptMessage}</p>
                                <button className="btn btn-danger btn-sm me-2" onClick={() => handleExitResponse("Yes", sessionId)}>Yes</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => handleExitResponse("No", sessionId)}>No</button>
                            </div>
                        )}

                        {showRestartPrompt && (
                            <div className="alert alert-info text-center">
                                <p>Would you like to start again?</p>
                                <div className="d-flex justify-content-center gap-2 mt-2">
                                    <button className="btn btn-primary btn-sm" onClick={() => handleRestartResponse("Yes")}>Yes</button>
                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleRestartResponse("No")}>No</button>
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

                        {isDetailsSubmitted && !isRatingSubmitted && (
                            <StarRating handleReviewSubmit={handleReviewSubmit} isRatingDisabled={isRatingSubmitted} />
                        )}

                        {showReminder && (
                            <div className="alert alert-light position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex justify-content-between align-items-center w-100 px-3">
                                <span>👋 Still there? Let us know how we can help!</span>
                                <button className="btn-close" onClick={handleCloseReminder}></button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );

}

export default ChatContainer;




//     return (
//         <>

//             {/* ✅ Robot Animation (Moves to Toggle Button)
//             {!robotArrived && (
//                 <motion.img
//                     src="/robot.png"  // ✅ Make sure this path is correct
//                     alt="Chatbot Robot"
//                     className="robot-animation"
//                     initial={{ x: "-100vw", opacity: 0 }} // ✅ Start far left
//                     animate={{ x: "calc(100vw - 90px)", opacity: 1 }} // ✅ Move to the toggle button
//                     transition={{ duration: 2, ease: "easeInOut" }}
//                     onAnimationComplete={handleRobotAnimationComplete}
//                 />
//             )} */}


//             {/* ✅ Show only the toggle button initially */}
//             <ToggleButton toggleChatbot={handleToggleChatbot} />

//             {/* ✅ Show chat container only when isOpen is true */}
//             {isOpen && (
//                 <div className="chat-container">
//                     <ChatHeader handleBackClick={handleBackClick} handleExitPrompt={handleExitPrompt} sessionId={sessionId} />



//                     {showSlideWindow && (
//                         <div className="chat-selection-container">
//                             <h3 className="chat-selection-title">Talk to us...</h3>
//                             <div className="chat-selection-options">
//                                 <div className="chat-option" onClick={loadPreviousConversation}>
//                                     <span className="chat-icon">💬</span>
//                                     <div>
//                                         <p className="chat-option-title">Continue old conversation</p>
//                                         <p className="chat-option-subtitle">Resume where you left off</p>
//                                     </div>
//                                 </div>
//                                 <div className="chat-option" onClick={startNewConversation}>
//                                     <span className="chat-icon">🆕</span>
//                                     <div>
//                                         <p className="chat-option-title">Start a new conversation</p>
//                                         <p className="chat-option-subtitle">Begin a fresh chat</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}



//                     <div className="chat-box">
//                         {showTypingEffect && (
//                             <motion.div
//                                 className="bot-message typing-effect"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ duration: 0.5 }}
//                             >

//                             </motion.div>
//                         )}


//                         {showFirstMessage && messages.map((msg, index) => (
//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5 }}
//                             >
//                                 {msg.sender === 'user' && <UserMessage text={msg.text} />}
//                                 {msg.sender === 'bot' && (
//                                     <>
//                                         <BotMessage text={msg.text} />

//                                         {/* ✅ Display Images Directly Inside Chat (Only if it's an image) */}
//                                         {msg.question_label && /\.(jpg|jpeg|png|gif)$/i.test(msg.question_label) ? (
//                                             <div className="chat-image-container">
//                                                 <img
//                                                     src={msg.question_label}
//                                                     alt="Chatbot response"
//                                                     className="chat-image"
//                                                     onError={(e) => (e.target.style.display = "none")} // Hide broken images
//                                                 />
//                                             </div>
//                                         ) : (
//                                             // ✅ Open Links (Only if it's NOT an image)
//                                             msg.question_label?.startsWith("http") && (
//                                                 <a href={msg.question_label} target="_blank" rel="noopener noreferrer" className="chat-link">
//                                                     Open Link
//                                                 </a>
//                                             )
//                                         )}

//                                         {/* ✅ File Downloads  */}
//                                         {/* {msg.question_label === "file" && msg.url && (
//                                             <a href={msg.url} download target="_blank" rel="noopener noreferrer" className="chat-link">
//                                                 📄 Download File
//                                             </a> */}

//                                         {msg.question_label?.toLowerCase().endsWith(".pdf") && msg.url && (
//                                             <>
//                                                 {console.log("PDF Message:", msg)}
//                                                 <a href={msg.url} download target="_blank" rel="noopener noreferrer" className="chat-link">
//                                                     📄 Download PDF
//                                                 </a>
//                                             </>
//                                         )}
//                                         {/* ✅ Embedded Videos */}
//                                         {msg.url && /\.(mp4|webm|ogg)$/i.test(msg.url) && (
//                                             <>
//                                                 {console.log("🎥 Video URL:", msg.url)} {/* Debugging */}
//                                                 <div className="chat-video-container">
//                                                     <video controls className="chat-video" onError={(e) => (e.target.style.display = "none")}>
//                                                         <source src={`${msg.url}?t=${Date.now()}`} type="video/mp4" />
//                                                         Your browser does not support the video tag.
//                                                     </video>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </>
//                                 )}
//                             </motion.div>
//                         ))}



//                         {isQuerySubmitted ? (
//                             null
//                         ) : isOtherSelected ? (
//                             <OtherQueryInput handleQuerySubmit={handleUserQuerySubmit}
//                                 isQueryInputDisabled={isQueryInputDisabled}
//                             />
//                         ) : (
//                             <OptionsContainer
//                                 options={options}
//                                 handleOptionClick={handleOptionClick}
//                                 handleUserQuerySubmit={handleUserQuerySubmit}
//                             />
//                         )}

//                         {showExitPrompt && (
//                             <div className="exit-prompt">
//                                 <p>{exitPromptMessage}</p> {/* Dynamically rendered message */}
//                                 <button onClick={() => handleExitResponse("Yes", sessionId)}>Yes</button>
//                                 <button onClick={() => handleExitResponse("No", sessionId)}>No</button>
//                             </div>
//                         )}




//                         {showRestartPrompt && (
//                             <div className="restart-prompt">
//                                 <p>Would you like to start again?</p>
//                                 <div className="restart-buttons">
//                                     <button onClick={() => handleRestartResponse("Yes")}>Yes</button>
//                                     <button onClick={() => handleRestartResponse("No")}>No</button>
//                                 </div>
//                             </div>
//                         )}


//                         {/* Show Callback Request Message */}
//                         {showCallbackMessage && (
//                             <CallbackPreference options={["Yes", "No"]} onSelectCallback={handleCallbackSelection} />
//                         )}

//                         {(isOtherSelected || (callbackPreference === "Yes" && isDetailsFormVisible)) && !isDetailsSubmitted && (
//                             <UserInputContainer
//                                 currentInputStep="details"
//                                 handleUserDetailsSubmit={handleUserDetailsSubmit} // ✅ Pass function here
//                                 detailsSubmitted={isDetailsSubmitted} // ✅ Pass state here
//                             />
//                         )}

//                         {/* Display Star Rating after chat completion */}
//                         {isDetailsSubmitted && !isRatingSubmitted && (
//                             <StarRating
//                                 handleReviewSubmit={handleReviewSubmit}
//                                 isRatingDisabled={isRatingSubmitted}
//                             // userRating={userRating}
//                             />
//                         )}
//                     </div>

//                     {showReminder && (
//                         <div className="reminder-popup">

//                             <button className="close-btn" onClick={handleCloseReminder}>

//                                 <i className="fas fa-times"></i>
//                             </button>
//                             👋 Still there? Let us know how we can help!
//                         </div>
//                     )}

//                 </div >
//             )}
//         </>
//     );