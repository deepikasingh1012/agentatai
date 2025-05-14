import React, { useState, useEffect } from "react";
import { getQuestions, updateQuestion, deleteQuestion } from "../../../services/AdminService";
import { FaEdit, FaTrash, FaSave } from "react-icons/fa"; // Import icons


const flattenQuestions = (questions) => {
    let flatList = [];
    const traverse = (items) => {
        items.forEach((item) => {
            flatList.push(item);
            if (item.children && item.children.length > 0) {
                traverse(item.children);
            }
        });
    };
    traverse(questions);
    return flatList;
};

const UpdateDelete = () => {
    const [questions, setQuestions] = useState([]);
    const [editedQuestions, setEditedQuestions] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // ✅ Show 10 entries per page
    const clientId = localStorage.getItem("clientId");
    const [modal, setModal] = useState({ show: false, message: "", onConfirm: null });
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const data = await getQuestions();
            if (!Array.isArray(data)) {
                console.error("Invalid data format:", data);
                return;
            }
            setQuestions(flattenQuestions(data));
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const handleEditClick = (id) => {
        setEditingId(id);
        setEditedQuestions((prev) => ({
            ...prev,
            [id]: { ...questions.find((q) => q.id === id) },
        }));
    };

    const handleEditChange = (id, field, value) => {
        setEditedQuestions((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value, id },
        }));
    };

    const handleSaveChanges = async (id) => {
        if (!editedQuestions[id]) return;

        try {
            const updatedData = {
                action_type: "U",
                p_id: id,
                p_question_text: editedQuestions[id].question_text,
                p_question_label: editedQuestions[id].question_label || "",
                p_question_type: editedQuestions[id].question_type,
                p_client_id: clientId,
                p_question_level: editedQuestions[id].question_level,
                p_question_parent_level: editedQuestions[id].question_parent_level,
            };

            await updateQuestion({ questions: [updatedData] });
            setModal({ show: true, message: "✅ Question updated successfully!", onConfirm: fetchQuestions });
            setEditingId(null);
            fetchQuestions();
        } catch (error) {
            setModal({ show: true, message: "❌ Error updating question!" });
        }
    };

    const handleDelete = (question) => {
        if (!question || typeof question !== "object" || !question.id) {
            setModal({ show: true, message: "❌ Invalid question data. Cannot delete." });
            return;
        }
    
        const {
            id: p_id,
            question_text: p_question_text,
            question_label: p_question_label,
            question_type: p_question_type,
            question_level: p_question_level,
            question_parent_level: p_question_parent_level,
        } = question;
    
        const p_client_id = localStorage.getItem("clientId");
    
        if (p_question_level === 1 && p_question_parent_level === 0) {
            setModal({ show: true, message: "❌ This question cannot be deleted!" });
            return;
        }
    
        setModal({
            show: true,
            message: `⚠️ Are you sure you want to delete Question ID: ${p_id}?`,
            onConfirm: async () => {
                try {
                    const response = await deleteQuestion({
                        action_type: "D",
                        p_id,
                        p_question_text: p_question_text || "No Text Available",
                        p_question_label: p_question_label || "",
                        p_question_type,
                        p_client_id,
                        p_question_level,
                        p_question_parent_level,
                    });
    
                    const resMessage = response?.message?.toLowerCase() || "";
    
                    if (response?.success || resMessage.includes("deleted") || resMessage.includes("success")) {
                        setModal({
                            show: true,
                            message: "✅ Question deleted successfully!",
                            onConfirm: () => {
                                setModal({ show: false });
                                setQuestions(prev => prev.filter(q => q.id !== p_id));
                            },
                            
                        });
                    } else {
                        setModal({ show: true, message: `❌ Delete failed: ${response?.message || "Unknown error"}` });
                    }
                } catch (error) {
                    console.error("❌ Error deleting question:", error.response?.data || error.message);
                    setModal({
                        show: true,
                        message: `❌ Delete failed: ${error.response?.data?.message || "Unknown error"}`,
                    });
                }
            },
        });
    };
    
    


    // ✅ Pagination logic
    const totalPages = Math.ceil(questions.length / itemsPerPage);
    const paginatedQuestions = questions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">Manage Questions</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                    <thead className="table-primary text-center">
                        <tr>
                            <th>ID</th>
                            <th>Question Text</th>
                            <th>Question Label</th>
                            <th>Type</th>
                            <th>Level</th>
                            <th>Parent Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedQuestions.length > 0 ? (
                            paginatedQuestions.map((q) => (
                                <tr key={q.id}>
                                    <td>{q.id}</td>
                                    <td>
                                        {editingId === q.id ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedQuestions[q.id]?.question_text || ""}
                                                onChange={(e) => handleEditChange(q.id, "question_text", e.target.value)}
                                            />
                                        ) : (
                                            q.question_text
                                        )}
                                    </td>
                                    <td>
                                        {editingId === q.id ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedQuestions[q.id]?.question_label || ""}
                                                onChange={(e) => handleEditChange(q.id, "question_label", e.target.value)}
                                            />
                                        ) : (
                                            q.question_label
                                        )}
                                    </td>
                                    <td>{q.question_type}</td>
                                    <td>{q.question_level}</td>
                                    <td>{q.question_parent_level}</td>
                                    <td>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            {editingId === q.id ? (
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleSaveChanges(q.id)}
                                                    title="Save"
                                                >
                                                    <FaSave />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleEditClick(q.id)}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                            )}

                                            {q.question_level === 1 && q.question_parent_level === 0 ? (
                                                <button
                                                    className="btn btn-sm btn-secondary text-muted"
                                                    title="Cannot Delete"
                                                    disabled
                                                >
                                                    <FaTrash />
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(q)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No Questions Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {modal.show && (
                <>
                    <div className="modal-backdrop show"></div>
                    <div className="modal d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body text-center">
                                    <p>{modal.message}</p>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            setModal({ show: false });
                                            modal.onConfirm && modal.onConfirm();
                                        }}
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                <button
                    className="btn btn-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </button>
                <span><strong>Page {currentPage} of {totalPages}</strong></span>
                <button
                    className="btn btn-primary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UpdateDelete;
