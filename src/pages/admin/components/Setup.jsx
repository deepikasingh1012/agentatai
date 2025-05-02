import React, { useState, useEffect } from "react";
import { fetchQuestions, sendQuestionsToAPI } from "../../../services/AdminService";
import Dragdrop from "../components/Dragdrop";

export default function Setup() {
  const [options, setOptions] = useState([{ type: "text", label: "", link: "" }]);
  const [error, setError] = useState("");
  const [dragDropQuestions, setDragDropQuestions] = useState([]);

  const [modal, setModal] = useState({ show: false, message: "", isError: false });

  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    loadQuestions();
  }, [clientId]);

  const formatHierarchy = (items, prefix = "1") => {
    return items.flatMap((item, index) => {
      const newPrefix = `${prefix}.${index + 1}`;
      return [
        {
          id: `message-${item.id}`,
          level: newPrefix,
          message: item.question_text,
          options: item.children?.map((child, i) => ({
            id: `option-${child.id}-${i}`,
            content: child.question_text,
          })) || [],
        },
        ...(item.children ? formatHierarchy(item.children, newPrefix) : []),
      ];
    });
  };

  const loadQuestions = async () => {
    try {
      console.log("Fetching updated questions...");
      const fetchedData = await fetchQuestions(clientId);

      if (!fetchedData.questions || fetchedData.questions.length === 0) {
        console.error("No questions found for client_id =", clientId);
        return;
      }

      // ✅ Update state with latest formatted data
      setDragDropQuestions(formatHierarchy(fetchedData.questions, "1"));
      console.log("Updated Questions:", fetchedData.questions);
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  };


  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const addOption = () => setOptions([...options, { type: "text", label: "", link: "" }]);

  const removeOption = (index) => setOptions(options.filter((_, i) => i !== index));

  const handleOptionChange = (index, type) => {
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? { ...option, type } : option))
    );
  };

  const handleLabelChange = (index, label) => {
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? { ...option, label: toTitleCase(label) } : option))
    );
  };

  const handleLinkChange = (index, link) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, link } : opt))
    );
  };

  // Function to determine question type based on link extension
  const getQuestionTypeFromLink = (link) => {
    const videoExtensions = [".mp4", ".avi", ".mov"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtensions = [".pdf", ".docx"];
    const domainExtensions = [".com", ".in", ".org", ".net"];
    const lowerCaseLink = link.toLowerCase();

    if (videoExtensions.some((ext) => lowerCaseLink.endsWith(ext))) {
      return 4; // Video
    } else if (imageExtensions.some((ext) => lowerCaseLink.endsWith(ext))) {
      return 5; // Image
    } else if (fileExtensions.some((ext) => lowerCaseLink.endsWith(ext))) {
      return 2; // File download
    } else if (domainExtensions.some((ext) => lowerCaseLink.endsWith(ext))) {
      return 6; // Redirect (e.g., to another site)
    } else {
      return 6; // Default link
    }
  };



  const handleSubmit = async () => {
    if (options.some((opt) => !opt.label.trim())) {
      alert("Please enter a valid question for all options!");
      return;
    }

    const clientId = Number(localStorage.getItem("clientId")) || 1;
    console.log("Fetching questions for client_id:", clientId);

    try {
      const fetchedData = await fetchQuestions(clientId);
      console.log("API Response for Questions:", fetchedData);

      const existingQuestions = fetchedData?.questions || [];
      let p_question_level = 1;
      let p_question_parent_level = 1;

      // If no questions exist for the client, set the first question's parent level to 0
      const isFirstQuestion = existingQuestions.length === 0;

      // ✅ Loop through all options to send each as a separate question
      for (let index = 0; index < options.length; index++) {
        const option = options[index];

        // If it's the first question and no existing questions, set parent level to 0
        p_question_parent_level = isFirstQuestion && index === 0 ? 0 : 1; // Only the first question for a client gets parent level 0

        let selectedOption = option.type || "text";
        let p_question_type = 1; // Default to text
        let p_question_label = "";

        if (selectedOption === "link" && option.link) {
          p_question_label = option.link;
          p_question_type = getQuestionTypeFromLink(option.link);
        } else {
          const questionTypeMapping = {
            text: 1,
            file: 2,
            redirect: 3,
            video: 4,
            image: 5,
            link: 6,
          };
          p_question_type = questionTypeMapping[selectedOption] || 1;
        }

        const newQuestion = {
          action_type: "I",
          p_question_text: option.label.trim(),
          p_question_label,
          p_question_type,
          p_client_id: clientId,
          p_question_level,
          p_question_parent_level,
        };

        console.log("Submitting Question:", newQuestion);
        await sendQuestionsToAPI(newQuestion);
      }

      setModal({ show: true, message: "All questions submitted successfully!", isError: false });
      setOptions([{ type: "text", label: "", link: "" }]); // Reset input field
      loadQuestions(); // Reload questions

    } catch (error) {
      console.error("❌ Error sending question:", error.response?.data || error.message);
      setModal({ show: true, message: "Failed to submit the questions.", isError: true });
    }
  };




  const closeModal = () => {
    setModal({ show: false, message: "", isError: false });
  };

  return (
    <div className="container-fuild mt-4">
      <h2 className="text-center mb-4">Setup for ATai Business Assistance</h2>

      {options.map((option, index) => (
        <div key={index} className="mb-3 border p-3 rounded">
          <div className="d-flex flex-wrap align-items-start gap-3">
            <div className="btn-group gap-2">
              <button
                className={`btn ${option.type === "text" ? "btn-dark" : "btn-outline-secondary"}`}
                onClick={() => handleOptionChange(index, "text")}
              >
                Text
              </button>
              <button
                className={`btn ${option.type === "link" ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => handleOptionChange(index, "link")}
              >
                Link
              </button>
              <button
                className={`btn ${option.type === "other" ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => handleOptionChange(index, "other")}
              >
                Other
              </button>
            </div>

            <div className="flex-grow-1">
              {option.type === "text" && (
                <input
                  type="text"
                  placeholder="Add enquiry text"
                  className="form-control"
                  value={option.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                />
              )}

              {option.type === "link" && (
                <div className="d-flex flex-row gap-2 w-100">
                  <input
                    type="text"
                    placeholder="Option label"
                    className="form-control"
                    value={option.label}
                    onChange={(e) => handleLabelChange(index, e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Enter link (URL)"
                    className="form-control"
                    value={option.link}
                    onChange={(e) => handleLinkChange(index, e.target.value)}
                  />
                </div>
              )}


              {option.type === "other" && (
                <input
                  type="text"
                  placeholder="Option label"
                  className="form-control"
                  value={option.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                />
              )}
            </div>

            <div className="d-flex flex-row gap-2">
              <button onClick={addOption} className="btn btn-outline-success">+</button>
              {options.length > 1 && (
                <button onClick={() => removeOption(index)} className="btn btn-outline-danger">−</button>
              )}
            </div>

          </div>
        </div>
      ))}


      {error && <p className="text-danger">{error}</p>}

      <div className="text-center my-3">
        <button onClick={handleSubmit} className="btn btn-primary px-5">Submit</button>
      </div>

      {modal.show && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="bg-white p-4 rounded text-center">
            <p className={`fw-bold ${modal.isError ? "text-danger" : "text-success"}`}>
              {modal.message}
            </p>
            <button onClick={closeModal} className="btn btn-secondary">Close</button>
          </div>
        </div>
      )}

      <h3 className="mt-5 mb-3">Setup Business Option Level</h3>
      {dragDropQuestions.length > 0 ? (
        <Dragdrop questions={dragDropQuestions} />
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}
