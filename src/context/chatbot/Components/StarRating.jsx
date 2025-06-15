import React, { useState, useEffect } from 'react';

const StarRating = ({ handleReviewSubmit, isRatingDisabled, userRating }) => {
    const [selectedRating, setSelectedRating] = useState(0);



    // 🔁 Sync selectedRating with userRating reset (null or 0)
    useEffect(() => {
        if (!userRating) {
            setSelectedRating(0);
        }
    }, [userRating]);

    const handleClick = (rating) => {
        if (!isRatingDisabled) {
            setSelectedRating(rating);
            handleReviewSubmit(rating);
        }
    };

    return (
        <div className="d-flex gap-1 mt-1 justify-content-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={`fa-star ${star <= selectedRating ? 'fas text-warning' : 'far text-muted'}`}
                    style={{ fontSize: '1.2rem', cursor: isRatingDisabled ? 'not-allowed' : 'pointer' }}
                    onClick={() => handleClick(star)}
                />
            ))}
        </div>
    );
};

export default StarRating;




// import React, { useState } from "react";
// import "../css/StarRating.css";

// const StarRating = ({ handleReviewSubmit, isRatingDisabled }) => {
//     const [selectedRating, setSelectedRating] = useState(0);

//     const handleRatingClick = (rating) => {
//         if (!isRatingDisabled) {
//             setSelectedRating(rating);
//             handleReviewSubmit(rating);
//         }
//     };

//     return (
//         <div className="star-rating-container">
//             {/* <p>Please rate your satisfaction:</p> */}
//             <div className="star-rating">
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                     <span
//                         key={rating}
//                         className={`star ${selectedRating >= rating ? "filled" : ""}`}
//                         onClick={() => handleRatingClick(rating)}
//                         style={{ cursor: isRatingDisabled ? "not-allowed" : "pointer" }}
//                     >
//                         ★
//                     </span>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default StarRating;

