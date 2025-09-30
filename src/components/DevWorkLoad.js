import React, { useEffect, useState } from "react";
import axios from "axios";

function DevDashboard() {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:5000/employees/workload") // adjust to your API
            .then((res) => {
                setDevelopers(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load workloads");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading developer workload...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "20px" }}>Developer Workload Dashboard</h2>

            {developers.map((dev) => (
                <div
                    key={dev.developerId}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "12px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                >
                    <h3 style={{ margin: "0 0 8px 0" }}>{dev.developerName}</h3>
                    <p style={{ margin: "4px 0" }}>
                        <strong>Total Hours:</strong> {dev.totalHours}
                    </p>
                    <p style={{ margin: "4px 0" }}>
                        <strong>Assigned Tasks:</strong> {dev.taskCount}
                    </p>
                    <div
                        style={{
                            marginTop: "8px",
                            width: "100%",
                            height: "12px",
                            backgroundColor: "#eee",
                            borderRadius: "6px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${dev.totalHours * 10}px`, // simple proportional bar
                                maxWidth: "100%",
                                height: "100%",
                                backgroundColor: "#28a745",
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DevDashboard;
