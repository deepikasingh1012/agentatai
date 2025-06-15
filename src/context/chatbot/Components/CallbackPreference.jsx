import React from "react";

const CallbackPreference = ({ options, onSelectCallback }) => {
    return (
        <div className="mt-2">
            <p className="fw-bold mb-1 small">Request a Callback?</p>
            <div className="d-flex gap-1">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`btn btn-outline-${option.toLowerCase() === 'yes' ? 'success' : 'info'} btn-sm`}
                        onClick={() => onSelectCallback(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CallbackPreference;



// import React from "react";
// import "../css/CallbackPreference.css"; // (Optional) Add styling if needed

// const CallbackPreference = ({ options, onSelectCallback }) => {
//     return (
//         <div className="callback-container">
//             <p>Request a Callback?</p>
//             {options.map((option, index) => (
//                 <button
//                     key={index}
//                     className={`callback-btn ${option.toLowerCase()}`}
//                     onClick={() => onSelectCallback(option)}
//                 >
//                     {option}
//                 </button>
//             ))}
//         </div>
//     );
// };

// export default CallbackPreference;

