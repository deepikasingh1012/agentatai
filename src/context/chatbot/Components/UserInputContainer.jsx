// import React, { useEffect, useRef, useState } from 'react';
// import { FaUser, FaPhone, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

// const getClosestDomain = (inputDomain, validDomains) => {
//     let minDistance = Infinity;
//     let closestMatch = null;

//     validDomains.forEach((domain) => {
//         let distance = levenshteinDistance(inputDomain, domain);
//         if (distance < minDistance && distance <= 2) {
//             minDistance = distance;
//             closestMatch = domain;
//         }
//     });

//     return closestMatch;
// };

// const levenshteinDistance = (a, b) => {
//     const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
//         Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
//     );

//     for (let i = 1; i <= a.length; i++) {
//         for (let j = 1; j <= b.length; j++) {
//             const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//             matrix[i][j] = Math.min(
//                 matrix[i - 1][j] + 1,
//                 matrix[i][j - 1] + 1,
//                 matrix[i - 1][j - 1] + cost
//             );
//         }
//     }

//     return matrix[a.length][b.length];
// };

// const UserInputContainer = ({ currentInputStep, handleUserDetailsSubmit, detailsSubmitted }) => {
//     const [userName, setUserName] = useState('');
//     const [userContact, setUserContact] = useState('');
//     const [userEmail, setUserEmail] = useState('');
//     const [errors, setErrors] = useState({});
//     const inputRef = useRef(null);

//     useEffect(() => {
//         if (inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [currentInputStep]);

//     const validateFields = () => {
//         let newErrors = {};

//         if (userName.trim().length < 3) {
//             newErrors.userName = "Name must be at least 3 characters.";
//         }

//         const phoneRegex = /^[6789]\d{9}$/;
//         if (!phoneRegex.test(userContact.trim())) {
//             newErrors.userContact = "Enter a valid 10-digit mobile number (starting with 6-9).";
//         }

//         const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/;
//         if (!emailRegex.test(userEmail.trim())) {
//             newErrors.userEmail = "Enter a valid email address (e.g., user@example.com).";
//         } else {
//             const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
//             const userDomain = userEmail.split("@")[1];

//             if (userDomain && !validDomains.includes(userDomain)) {
//                 const suggestedDomain = getClosestDomain(userDomain, validDomains);
//                 if (suggestedDomain) {
//                     newErrors.userEmail = `Did you mean ${userEmail.split("@")[0]}@${suggestedDomain}?`;
//                 }
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         if (validateFields()) {
//             handleUserDetailsSubmit({
//                 userName: userName.trim(),
//                 userContact: userContact.trim(),
//                 userEmail: userEmail.trim(),
//             });
//         }
//     };

//     return (
//         <div className="p-2">
//             {currentInputStep === "details" && (
//                 <form onSubmit={handleSubmit} noValidate>
//                     {/* Name Input */}
//                     <div className="mb-2">
//                         <label className="form-label small">Name*</label>
//                         <div className="input-group input-group-sm  rounded">
//                             <span className="input-group-text bg-white border-end-0">
//                                 <FaUser className="text-primary" />
//                             </span>
//                             <input
//                                 ref={inputRef}
//                                 type="text"
//                                 className="form-control border-start-0"
//                                 placeholder="Enter your Name"
//                                 value={userName}
//                                 onChange={(e) => setUserName(e.target.value)}
//                             />
//                         </div>
//                         {errors.userName && (
//                             <div className="alert alert-warning d-flex align-items-center mt-1 p-1" role="alert">
//                                 <FaExclamationTriangle className="me-1" />
//                                 <span className="small">{errors.userName}</span>
//                             </div>
//                         )}
//                     </div>

//                     {/* Mobile Number Input */}
//                     <div className="mb-2">
//                         <label className="form-label small">Mobile Number*</label>
//                         <div className="input-group input-group-sm shadow-sm rounded">
//                             <span className="input-group-text bg-white border-end-0">
//                                 <FaPhone className="text-primary" />
//                             </span>
//                             <input
//                                 type="tel"
//                                 className="form-control border-start-0"
//                                 placeholder="Enter your Contact Number"
//                                 value={userContact}
//                                 onChange={(e) => setUserContact(e.target.value)}
//                             />
//                         </div>
//                         {errors.userContact && (
//                             <div className="alert alert-warning d-flex align-items-center mt-2 p-2" role="alert">
//                                 <FaExclamationTriangle className="me-1" />
//                                 <span className="small">{errors.userContact}</span>
//                             </div>
//                         )}
//                     </div>

//                     {/* Email Input */}
//                     <div className="mb-2">
//                         <label className="form-label small">Email ID*</label>
//                         <div className="input-group input-group-sm  shadow-sm rounded">
//                             <span className="input-group-text bg-white border-end-0">
//                                 <FaEnvelope className="text-primary" />
//                             </span>
//                             <input
//                                 type="email"
//                                 className="form-control border-start-0"
//                                 placeholder="Enter your Email Address"
//                                 value={userEmail}
//                                 onChange={(e) => setUserEmail(e.target.value)}
//                             />
//                         </div>
//                         {errors.userEmail && (
//                             <div className="alert alert-warning d-flex align-items-center mt-1 p-1" role="alert">
//                                 <FaExclamationTriangle className="me-1" />
//                                 <span className="small">{errors.userContact}</span>
//                             </div>
//                         )}
//                     </div>

//                     <button type="submit" className="btn btn-primary w-100 mt-1" disabled={detailsSubmitted}>
//                         Click to Proceed
//                     </button>
//                 </form>
//             )}
//         </div>
//     );
// };

// export default UserInputContainer;

import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
 
const getClosestDomain = (inputDomain, validDomains) => {
    let minDistance = Infinity;
    let closestMatch = null;
 
    validDomains.forEach((domain) => {
        let distance = levenshteinDistance(inputDomain, domain);
        if (distance < minDistance && distance <= 2) {
            minDistance = distance;
            closestMatch = domain;
        }
    });
 
    return closestMatch;
};
 
const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
 
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
 
    return matrix[a.length][b.length];
};
 
const UserInputContainer = ({ currentInputStep, handleUserDetailsSubmit, detailsSubmitted }) => {
    const [userName, setUserName] = useState('');
    const [userContact, setUserContact] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);
 
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentInputStep]);
 
    const validateFields = () => {
        let newErrors = {};
 
        const nameRegex = /^[A-Za-z\s]+$/;
        const phoneRegex = /^[6789]\d{9}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/;
 
        if (userName.trim().length < 2) {
            newErrors.userName = "Name must contain only letters and spaces.";
        } else if (!nameRegex.test(userName.trim())) {
            newErrors.userName = "Name must contain only letters and spaces.";
        }
 
        if (!phoneRegex.test(userContact.trim())) {
            newErrors.userContact = "Enter a valid 10-digit mobile number (starting with 6-9).";
        }
 
        if (!emailRegex.test(userEmail.trim())) {
            newErrors.userEmail = "Enter a valid email address (e.g., user@example.com).";
        } else {
            const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
            const userDomain = userEmail.split("@")[1];
            if (userDomain && !validDomains.includes(userDomain)) {
                const suggestedDomain = getClosestDomain(userDomain, validDomains);
                if (suggestedDomain) {
                    newErrors.userEmail = `Did you mean ${userEmail.split("@")[0]}@${suggestedDomain}?`;
                }
            }
        }
 
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
 
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateFields()) {
            handleUserDetailsSubmit({
                userName: userName.trim(),
                userContact: userContact.trim(),
                userEmail: userEmail.trim(),
            });
        }
    };
 
    const handleNameChange = (e) => {
        const inputValue = e.target.value;
        setUserName(inputValue);
 
        const nameRegex = /^[A-Za-z\s]+$/;
        if (inputValue.trim().length < 2) {
            setErrors(prev => ({ ...prev, userName: "Name must be at least 2 characters." }));
        } else if (!nameRegex.test(inputValue)) {
            setErrors(prev => ({ ...prev, userName: "Name must contain only letters and spaces." }));
        } else {
            setErrors(prev => ({ ...prev, userName: null }));
        }
    };
 
    const handleContactChange = (e) => {
        const inputValue = e.target.value;
        setUserContact(inputValue);
 
        const phoneRegex = /^[6789]\d{0,9}$/;
        if (!phoneRegex.test(inputValue)) {
            setErrors(prev => ({ ...prev, userContact: "Enter a valid 10-digit mobile number (starting with 6-9)." }));
        } else if (inputValue.length < 10) {
            setErrors(prev => ({ ...prev, userContact: "Mobile number must be 10 digits." }));
        } else {
            setErrors(prev => ({ ...prev, userContact: null }));
        }
    };
 
    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setUserEmail(inputValue);
 
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/;
        const validDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
        const parts = inputValue.split("@");
 
        if (!emailRegex.test(inputValue)) {
            setErrors(prev => ({ ...prev, userEmail: "Enter a valid email address (e.g., user@example.com)." }));
        } else if (parts.length === 2 && !validDomains.includes(parts[1])) {
            const suggested = getClosestDomain(parts[1], validDomains);
            if (suggested) {
                setErrors(prev => ({
                    ...prev,
                    userEmail: `Did you mean ${parts[0]}@${suggested}?`
                }));
            } else {
                setErrors(prev => ({ ...prev, userEmail: null }));
            }
        } else {
            setErrors(prev => ({ ...prev, userEmail: null }));
        }
    };
 
    return (
        <div className="p-2">
            {currentInputStep === "details" && (
                <form onSubmit={handleSubmit} noValidate>
                    {/* Name Input */}
                    <div className="mb-2">
                        <label className="form-label small">Name*</label>
                        <div className="input-group input-group-sm rounded">
                            <span className="input-group-text bg-white border-end-0">
                                <FaUser className="text-primary" />
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Enter your Name"
                                value={userName}
                                onChange={handleNameChange}
                            />
                        </div>
                        {errors.userName && (
                            <div className="alert alert-warning d-flex align-items-center mt-1 p-1" role="alert">
                                <FaExclamationTriangle className="me-1" />
                                <span className="small">{errors.userName}</span>
                            </div>
                        )}
                    </div>
 
                    {/* Mobile Number Input */}
                    <div className="mb-2">
                        <label className="form-label small">Mobile Number*</label>
                        <div className="input-group input-group-sm shadow-sm rounded">
                            <span className="input-group-text bg-white border-end-0">
                                <FaPhone className="text-primary" />
                            </span>
                            <input
                                type="tel"
                                className="form-control border-start-0"
                                placeholder="Enter Your 10 digit Contact Number"
                                value={userContact}
                                onChange={handleContactChange}
                            />
                        </div>
                        {errors.userContact && (
                            <div className="alert alert-warning d-flex align-items-center mt-2 p-2" role="alert">
                                <FaExclamationTriangle className="me-1" />
                                <span className="small">{errors.userContact}</span>
                            </div>
                        )}
                    </div>
 
                    {/* Email Input */}
                    <div className="mb-2">
                        <label className="form-label small">Email ID*</label>
                        <div className="input-group input-group-sm shadow-sm rounded">
                            <span className="input-group-text bg-white border-end-0">
                                <FaEnvelope className="text-primary" />
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0"
                                placeholder="Enter your Email Address"
                                value={userEmail}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {errors.userEmail && (
                            <div className="alert alert-warning d-flex align-items-center mt-1 p-1" role="alert">
                                <FaExclamationTriangle className="me-1" />
                                <span className="small">{errors.userEmail}</span>
                            </div>
                        )}
                    </div>
 
                    <button type="submit" className="btn btn-primary w-100 mt-1" disabled={detailsSubmitted}>
                        Click to Proceed
                    </button>
                </form>
            )}
        </div>
    );
};
 
export default UserInputContainer;