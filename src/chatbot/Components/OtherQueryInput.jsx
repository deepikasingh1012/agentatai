import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const OtherQueryInput = ({ handleQuerySubmit, isQueryInputDisabled }) => {
    const [query, setQuery] = useState("");

    const handleSubmit = () => {
        if (query.trim()) {
            console.log("Submitting query:", query);
            handleQuerySubmit(query);
            setQuery("");
        }
    };

    return (
        <div className="d-flex align-items-center mt-2 gap-2 w-100">
            <input
                type="text"
                className="form-control"
                placeholder="Type your query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={isQueryInputDisabled}
            />
            <FaPaperPlane
                size={20}
                style={{
                    cursor: query.trim() && !isQueryInputDisabled ? 'pointer' : 'not-allowed',
                    color: query.trim() && !isQueryInputDisabled ? '#007bff' : '#ccc',
                }}
                onClick={handleSubmit}
            />
        </div>
    );
};

export default OtherQueryInput;


// import React, { useState } from 'react';
// import { FaPaperPlane } from 'react-icons/fa';
// import '../css/OtherQueryInput.css';

// const OtherQueryInput = ({ handleQuerySubmit, isQueryInputDisabled, setUserQuery }) => {
//     const [query, setQuery] = useState("");


//     const handleSubmit = () => {
//         if (query.trim()) {
//             console.log("Submitting query:", query);
//             handleQuerySubmit(query);
//             setQuery(""); // Clear input after submission
//             // setUserQuery("");
//         }
//     };

//     return (
//         <div className="other-query-container">
//             <input
//                 type="text"
//                 className="chat-input"
//                 placeholder="Type your query here..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}

//                 onKeyDown={(e) => e.key === "Enter" && handleSubmit()} //Send or Enter
//                 disabled={isQueryInputDisabled} //Disabled input field
//             />
//             {/* <button onClick={handleSubmit} disabled={!query.trim() || isQueryInputDisabled}>
//                 Submit */}
//             {/* </button> */}

//             <FaPaperPlane
//                 className={`send-icon ${!query.trim() || isQueryInputDisabled ? "disabled" : ""}`}
//                 onClick={handleSubmit}
//             />
//         </div>
//     );
// };

// export default OtherQueryInput;
