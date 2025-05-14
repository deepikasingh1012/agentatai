import React, { useState } from 'react';
import OtherQueryInput from './OtherQueryInput';

const OptionsContainer = ({ options, handleOptionClick, handleUserQuerySubmit }) => {
    const [showOtherInput, setShowOtherInput] = useState(false);

    return (
        <div className="d-flex flex-wrap gap-1 mt-1">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (option.question_text === "Other") {
                            setShowOtherInput(true);
                        } else {
                            handleOptionClick(option.question_text);
                        }
                    }}
                    className="btn btn-outline-primary btn-sm me-0"
                >
                    {option.question_text}
                </button>
            ))}

            {showOtherInput && (
                <OtherQueryInput
                    handleQuerySubmit={(query) => {
                        console.log("Other query submitted:", query);
                        handleUserQuerySubmit(query);
                        setShowOtherInput(false);
                    }}
                />
            )}
        </div>
    );
};

export default OptionsContainer;









// import React, { useState } from 'react';
// import '../css/OptionsContainer.css';
// import OtherQueryInput from './OtherQueryInput';
// const OptionsContainer = ({ options, handleOptionClick, handleUserQuerySubmit }) => {
//     const [showOtherInput, setShowOtherInput] = useState(false);

//     return (
//         <div className="options-container">
//             {options.map((option, index) => (
//                 <button
//                     key={index}
//                     onClick={() => {
//                         if (option.question_text === "Other") {
//                             setShowOtherInput(true);
//                         } else {
//                             handleOptionClick(option.question_text);
//                         }
//                     }}
//                     className="option-button"
//                 >
//                     {option.question_text}
//                 </button>
//             ))}

//             {showOtherInput && (
//                 <OtherQueryInput
//                     handleQuerySubmit={(query) => {
//                         console.log("Other query submitted:", query);
//                         handleUserQuerySubmit(query);
//                         setShowOtherInput(false);
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default OptionsContainer;


