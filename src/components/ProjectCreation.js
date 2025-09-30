import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function SimpleProjectForm() {
  const [projectName, setProjectName] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [deadline, setDeadline] = useState("");

  // Fetch developers from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/developers")
      .then((res) => {
        const options = res.data.map((dev) => ({
          value: dev._id,
          label: dev.name,
        }));
        setDevelopers(options);
      })
      .catch((err) => console.error("Error fetching developers:", err));
  }, []);

  const handleAddTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleTaskChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!projectName || selectedDevelopers.length === 0 || !deadline) {
      alert("Please enter all required fields.");
      return;
    }

    const selectedDate = new Date(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time from today's date

    if (selectedDate <= today) {
      alert("Please select a deadline in the future.");
      return;
    }

    const payload = {
      name: projectName,
      developers: selectedDevelopers.map((d) => d.value),
      tasks: tasks.filter((task) => task.trim() !== ""),
      deadline,
    };

    try {
      await axios.post("http://localhost:5000/createProject", payload);
      alert("✅ Project created!");
      setProjectName("");
      setSelectedDevelopers([]);
      setTasks([]);
      setDeadline("");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Failed to create project.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Project Name:</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={styles.input}
          required
        />

        <label style={styles.label}>Select Developers:</label>
        <Select
          isMulti
          options={developers}
          value={selectedDevelopers}
          onChange={setSelectedDevelopers}
          placeholder="Choose developers..."
        />

        <label style={styles.label}>Deadline:</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={styles.input}
          min={new Date().toISOString().split("T")[0]} // Ensures only future dates are selectable
          required
        />

        <button
          type="button"
          onClick={handleAddTask}
          style={styles.addTaskButton}
        >
          ➕ Add Task
        </button>

        {tasks.map((task, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Task ${index + 1}`}
            value={task}
            onChange={(e) => handleTaskChange(index, e.target.value)}
            style={styles.input}
          />
        ))}

        <button type="submit" style={styles.submitButton}>
          🚀 Create Project
        </button>
      </form>
    </div>
  );
}

// Inline CSS
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    background: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  addTaskButton: {
    padding: "8px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: "16px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default SimpleProjectForm;
