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

        if (userName.trim().length < 3) {
            newErrors.userName = "Name must be at least 3 characters.";
        }

        const phoneRegex = /^[6789]\d{9}$/;
        if (!phoneRegex.test(userContact.trim())) {
            newErrors.userContact = "Enter a valid 10-digit mobile number (starting with 6-9).";
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$/;
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

    return (
        <div className="p-3">
            {currentInputStep === "details" && (
                <form onSubmit={handleSubmit} noValidate>
                    {/* Name Input */}
                    <div className="mb-3">
                        <label className="form-label">Name*</label>
                        <div className="input-group shadow-sm rounded">
                            <span className="input-group-text bg-white border-end-0">
                                <FaUser className="text-primary" />
                            </span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Enter your Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        {errors.userName && (
                            <div className="alert alert-warning d-flex align-items-center mt-2 p-2" role="alert">
                                <FaExclamationTriangle className="me-2" />
                                {errors.userName}
                            </div>
                        )}
                    </div>

                    {/* Mobile Number Input */}
                    <div className="mb-3">
                        <label className="form-label">Mobile Number*</label>
                        <div className="input-group shadow-sm rounded">
                            <span className="input-group-text bg-white border-end-0">
                                <FaPhone className="text-primary" />
                            </span>
                            <input
                                type="tel"
                                className="form-control border-start-0"
                                placeholder="Enter your Contact Number"
                                value={userContact}
                                onChange={(e) => setUserContact(e.target.value)}
                            />
                        </div>
                        {errors.userContact && (
                            <div className="alert alert-warning d-flex align-items-center mt-2 p-2" role="alert">
                                <FaExclamationTriangle className="me-2" />
                                {errors.userContact}
                            </div>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="mb-3">
                        <label className="form-label">Email ID*</label>
                        <div className="input-group shadow-sm rounded">
                            <span className="input-group-text bg-white border-end-0">
                                <FaEnvelope className="text-primary" />
                            </span>
                            <input
                                type="email"
                                className="form-control border-start-0"
                                placeholder="Enter your Email Address"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>
                        {errors.userEmail && (
                            <div className="alert alert-warning d-flex align-items-center mt-2 p-2" role="alert">
                                <FaExclamationTriangle className="me-2" />
                                {errors.userEmail}
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-2" disabled={detailsSubmitted}>
                        Click to Proceed
                    </button>
                </form>
            )}
        </div>
    );
};

export default UserInputContainer;
