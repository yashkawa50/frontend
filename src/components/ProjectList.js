import React, { useEffect, useState } from "react";
import axios from "axios";

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(""); // "PENDING" | "DONE" | ""
    const [deadline, setDeadline] = useState(""); // date string (yyyy-mm-dd)

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (status) params.status = status;
            if (deadline) params.deadline = deadline;

            const response = await axios.get("http://localhost:5000/projects", {
                params,
            });
            setProjects(response.data);
        } catch (err) {
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [status, deadline]);

    if (loading) return <p>Loading projects...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "16px" }}>
            {/* Filters */}
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "16px",
                    alignItems: "center",
                }}
            >
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ padding: "6px 10px" }}
                >
                    <option value="">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="DONE">Complete</option>
                </select>

                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ padding: "6px 10px" }}
                />

                <button
                    onClick={() => {
                        setStatus("");
                        setDeadline("");
                    }}
                    style={{
                        padding: "6px 12px",
                        background: "#ddd",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Project List */}
            {projects.map((project) => (
                <div
                    key={project._id}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "12px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                        }}
                    >
                        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                            {project.name}
                        </h3>
                        <span style={{ fontSize: "14px", color: "#555" }}>
                            {project.percentComplete}%
                        </span>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            height: "12px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "6px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${project.percentComplete}%`,
                                height: "100%",
                                backgroundColor: "#007bff",
                                transition: "width 0.3s ease-in-out",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProjectList;
