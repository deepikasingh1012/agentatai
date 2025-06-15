import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getQuestions, updateQuestion } from "../../../services/AdminService"; // ✅ Added updateQuestion
import { FaCheckSquare } from "react-icons/fa";




const processAPIData = (data, level = 1, parentLevel = null) => {
  let processedData = [];

  data.forEach((row) => {
    const newItem = {
      id: `message-${row.id}`,
      questionId: row.id,
      level: row.question_level,
      parentLevel: row.question_parent_level,
      message: row.question_text,
      options: (row.children || []).map((option) => ({
        id: `option-${option.id}`,
        content: option.question_text,
        p_question_type: option.question_type || 1, // ✅ Add this line
      })),
      
      
    };
    processedData.push(newItem);

    if (row.children && row.children.length > 0) {
      processedData = processedData.concat(
        processAPIData(row.children, level + 1, row.id) // ✅ Pass parent ID
      );
    }
  });

  return processedData;
};

const Dragdrop = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modifiedData, setModifiedData] = useState(new Map());
  const [modalMessage, setModalMessage] = useState(""); // ✅ Added state for modal pop-up
  const [alertMessage, setAlertMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ Define modal state

  const fetchData = async () => {
    setLoading(true);
    try {
      const apiData = await getQuestions(clientId);
      console.log("apiData", apiData);
      const processedData = processAPIData(apiData);
      console.log("processedData", processedData);
      setData(processedData); // ✅ Update UI with new data
      console.log("Updated data from API:", processedData);
  
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  // const clientId = localStorage.getItem("clientId");
  const clientId = sessionStorage.getItem("clientId");


useEffect(() => {
  if (clientId) {
    fetchData();
  }
}, [clientId]);
  


 
//   const onDragEnd = (result) => {
//     if (!result.destination) return; // Ignore invalid drops

//     console.log("Drag result:", result);
//     const { source, destination, type } = result;
//     let newData = [...data];

//     if (type === "OPTION") {
//         const sourceIndex = newData.findIndex((group) => group.id === source.droppableId);
//         const destinationIndex = newData.findIndex((group) => group.id === destination.droppableId);

//         if (sourceIndex === -1 || destinationIndex === -1) return;

//         let sourceOptions = [...newData[sourceIndex].options];
//         let destinationOptions = [...newData[destinationIndex].options];

//         // ✅ Get the dragged option (movedItem)
//         const [movedItem] = sourceOptions.splice(source.index, 1);
//         if (!movedItem) return;

//         console.log("✅ Moved Item BEFORE Drop:", movedItem);

//         // ✅ Get the original item data
//         const originalItem = data.flatMap(q => q.options).find(opt => opt.id === movedItem.id) || {};
//         movedItem.p_id = originalItem.p_id || parseInt(movedItem.id.replace("option-", ""), 10);
//         movedItem.p_question_text = originalItem.p_question_text || movedItem.content || "[No Question Text]";
//         movedItem.p_question_level = originalItem.p_question_level || newData[destinationIndex].level;
//         movedItem.p_question_parent_level = newData[destinationIndex].level; // ✅ Correct Parent Level

//         // ✅ Identify the original parent dynamically
//         const originalParentData = newData.find(q => q.options.some(opt => opt.id === movedItem.id));
//         const originalParent = originalParentData ? originalParentData.message.trim().toLowerCase() : null;
//         const destinationParent = newData[destinationIndex].message.trim().toLowerCase();

//         // ❌ *Validation 1: Prevent drop if option text matches question text*
//         if (movedItem.content.trim().toLowerCase() === destinationParent) {
//           setAlertMessage(` Cannot move "${movedItem.content}" under "${destinationParent}" as it is the same position.`);
//             return;
//         }

//         // ❌ *Validation 3: Recursive Check to Prevent Circular Dependency*
//         const checkCircularDependency = (parentText, childText) => {
//             let queue = [parentText]; // Start checking from the current parent
//             while (queue.length) {
//                 let currentParent = queue.shift();
//                 for (let q of newData) {
//                     if (q.message.trim().toLowerCase() === currentParent.trim().toLowerCase()) {
//                         let childOptions = q.options.map(opt => opt.content.trim().toLowerCase());
//                         if (childOptions.includes(childText.trim().toLowerCase())) {
//                             return true; // Found circular dependency
//                         }
//                         queue.push(...childOptions); // Add children to check deeper levels
//                     }
//                 }
//             }
//             return false;
//         };

//         if (checkCircularDependency(movedItem.p_question_text, destinationParent)) {
//           setAlertMessage(`Cannot move "${movedItem.content}" under "${destinationParent}" due to circular dependency.`);

         
//           return;
//       }

//         // ✅ *Allow move only if it does NOT create a circular dependency*
//         destinationOptions.splice(destination.index, 0, movedItem);
//         newData[sourceIndex].options = sourceOptions;
//         newData[destinationIndex].options = destinationOptions;

//         console.log("✅ Updated Data:", newData);
//         setData(newData);

//         // ✅ Track changes for API update
//         const newModifiedData = new Map(modifiedData);
//         newModifiedData.set(movedItem.p_id, { ...originalItem, ...movedItem });

//         console.log("✅ Updated Modified Data for API:", newModifiedData);
//         setModifiedData(newModifiedData);
//     }
// };
  
const onDragEnd = (result) => {
  if (!result.destination) return;

  const { source, destination, type } = result;
  let newData = [...data];

  if (type === "OPTION") {
    const sourceIndex = newData.findIndex((group) => group.id === source.droppableId);
    const destinationIndex = newData.findIndex((group) => group.id === destination.droppableId);

    if (sourceIndex === -1 || destinationIndex === -1) return;

    let sourceOptions = [...newData[sourceIndex].options];
    let destinationOptions = [...newData[destinationIndex].options];

    const [movedItem] = sourceOptions.splice(source.index, 1);
    if (!movedItem) return;

    // Get original item (for ID and text fallback)
    const originalItem = data.flatMap(q => q.options).find(opt => opt.id === movedItem.id) || {};
    movedItem.p_id = originalItem.p_id || parseInt(movedItem.id.replace("option-", ""), 10);
    movedItem.p_question_text = originalItem.p_question_text || movedItem.content || "[No Question Text]";

    // ✅ NEW LEVEL +1 of the new parent
    const newParentLevel = newData[destinationIndex].level;
    movedItem.p_question_level = newParentLevel + 1;
    movedItem.p_question_parent_level = newParentLevel;

    // ❌ Prevent drop if same as parent
    const destinationParent = newData[destinationIndex].message.trim().toLowerCase();
    if (movedItem.content.trim().toLowerCase() === destinationParent) {
      setAlertMessage(` Cannot move "${movedItem.content}" under "${destinationParent}" as it is the same position.`);
      return;
    }

    // ❌ Prevent circular dependency
    const checkCircularDependency = (parentText, childText) => {
      let queue = [parentText];
      while (queue.length) {
        let currentParent = queue.shift();
        for (let q of newData) {
          if (q.message.trim().toLowerCase() === currentParent.trim().toLowerCase()) {
            let childOptions = q.options.map(opt => opt.content.trim().toLowerCase());
            if (childOptions.includes(childText.trim().toLowerCase())) {
              return true;
            }
            queue.push(...childOptions);
          }
        }
      }
      return false;
    };

    if (checkCircularDependency(movedItem.p_question_text, destinationParent)) {
      setAlertMessage(`Cannot move "${movedItem.content}" under "${destinationParent}" due to circular dependency.`);
      return;
    }

    destinationOptions.splice(destination.index, 0, movedItem);
    newData[sourceIndex].options = sourceOptions;
    newData[destinationIndex].options = destinationOptions;

    setData(newData);

    const newModifiedData = new Map(modifiedData);
    newModifiedData.set(movedItem.p_id, {
      ...originalItem,
      ...movedItem,
    });

    setModifiedData(newModifiedData);
  }
};

  

  const handleSaveChanges = async () => {
    if (modifiedData.size === 0) {
      setModalMessage("No changes to save.");
      setShowModal(true);
      return;
    }
    
  
    try {
      const updatePayload = {
        client_id: parseInt(clientId, 10),
        questions: Array.from(modifiedData.values()).map((question) => ({
          action_type: "U",
          p_id: question.p_id || question.questionId,
          p_question_text:
            typeof question.p_question_text === "string" && question.p_question_text.trim() !== ""
              ? question.p_question_text.trim()
              : "[No Question Text]", // ✅ Ensure p_question_text is always set
          p_question_label: question.p_question_label || null,
          p_question_type: question.p_question_type || 1,
          p_client_id: parseInt(clientId, 10),
          p_question_level: question.p_question_level || 1, // ✅ Default level
          p_question_parent_level: parseInt(question.p_question_parent_level, 10) || 0,
          options: Array.isArray(question.options)
            ? question.options.map((option) => ({
                id: option.id,
                content:
                  typeof option.content === "string" && option.content.trim() !== ""
                    ? option.content.trim()
                    : "[No Option Text]", // ✅ Ensure content is never empty
                p_question_level: option.p_question_level || 1,
                p_question_parent_level: parseInt(option.p_question_parent_level, 10) || 0,
              }))
            : [],
        })),
      };
  
      console.log("Final Payload Before API Call:", JSON.stringify(updatePayload, null, 2));
  
      const response = await updateQuestion(updatePayload);
      console.log("API Response:", response);
  
      setModalMessage("Changes saved successfully!");
      setShowModal(true);

      setModifiedData(new Map());
      await fetchData(); // ✅ Reload updated data
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setModalMessage("Failed to save changes. Check console for details.");
      setShowModal(true); // ✅ Show modal even on error

    }
  };

  
  

  return (
    <div className="container-fluid mt-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
    {loading ? null : (
      <>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Droppable droppableId="messages" type="MESSAGE">
              {(provided) => (
                <table
                  className="table table-bordered table-striped text-center"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
  
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th>Level</th>
                      <th>Message</th>
                      <th>Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((group, index) => (
                      <Draggable key={group.id} draggableId={group.id} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <td><strong>{group.level}</strong></td>
                            <td>{group.message}</td>
                            <td>
                              <Droppable droppableId={group.id} type="OPTION" direction="horizontal">
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="d-flex flex-wrap gap-2 border p-2"
                                  >
                                    {group.options.map((option, index) => (
                                      <Draggable key={option.id} draggableId={option.id} index={index}>
                                        {(provided) => (
                                          <span
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="badge bg-info text-dark p-2"
                                          >
                                            {option.content}
                                          </span>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </div>
  

            {alertMessage && (
              <div className="alert alert-warning alert-dismissible fade show mt-3 text-center" role="alert">
                {alertMessage}
                <button type="button" className="btn-close" onClick={() => setAlertMessage("")}></button>
              </div>
            )}

            <div className="text-center mt-4">
              <button
                className="btn btn-success"
                onClick={handleSaveChanges}
                disabled={modifiedData.size === 0}
              >
                Save Changes
              </button>
            </div>
          </DragDropContext>

          {showModal && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{modalMessage.includes("Error") ? "Error" : "Success"}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <p>{modalMessage}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>OK</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dragdrop;