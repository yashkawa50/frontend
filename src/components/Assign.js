import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [developers, setDevelopers] = useState([]);
    console.log("projects", projects, developers);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [projectsRes, devsRes] = await Promise.all([
            axios.get('http://localhost:5000/assign-project'),
            axios.get('http://localhost:5000/developers')
        ]);

        const devList = devsRes.data;

        // Assign default developer if none in project
        const projectsWithDefaultDev = projectsRes.data.map(project => {
            if (!project.developers || project.developers.length === 0) {
                return {
                    ...project,
                    developers: devList[0] ? [devList[0]._id] : []
                };
            }
            return project;
        });

        setDevelopers(devList);
        setProjects(projectsWithDefaultDev);
    };

    const handleProjectChange = (projectId, field, value) => {
        setProjects(prev =>
            prev.map(p => p._id === projectId ? { ...p, [field]: value } : p)
        );
    };

    const handleTaskChange = (projectId, taskId, field, value) => {
        setProjects(prev =>
            prev.map(p => {
                if (p._id !== projectId) return p;
                return {
                    ...p,
                    tasks: p.tasks.map(t => t._id === taskId ? { ...t, [field]: value } : t)
                };
            })
        );
    };

    const saveProject = async (project) => {
        try {
            await axios.put(`http://localhost:5000/projects/${project._id}`, {
                name: project.name,
                developers: project.developers.map(dev => dev._id || dev),
            });

            for (const task of project.tasks) {
                await axios.put(`http://localhost:5000/tasks/${task._id}`, {
                    name: task.name,
                    status: task.status,
                    assignedTo: task.assignedTo?._id || task.assignedTo,
                });
            }

            alert('Project and tasks saved!');
        } catch (error) {
            alert('Error saving project: ' + error.message);
        }
    };

    const styles = {
        container: { maxWidth: '900px', margin: '0 auto', padding: '20px' },
        projectBox: {
            border: '1px solid #ccc',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9'
        },
        input: {
            width: '100%',
            padding: '8px',
            margin: '5px 0 10px 0',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
        },
        select: {
            width: '100%',
            margin: '5px 0 10px 0'
        },
        taskBox: {
            marginBottom: '15px',
            padding: '10px',
            border: '1px dashed #ccc',
            borderRadius: '5px',
            backgroundColor: '#fff'
        },
        button: {
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
        },
        heading: { textAlign: 'center', marginBottom: '30px', color: '#333' },
        subHeading: { marginTop: '20px', marginBottom: '10px', color: '#555' }
    };

    // Map developers to react-select format
    const developerOptions = developers.map(dev => ({
        value: dev._id,
        label: dev.name
    }));

    // Helper to find developer option by id
    const getDeveloperOption = (obj) => {
        const id = typeof obj === 'string' ? obj : obj?._id;
        return developerOptions.find(opt => opt.value === id) || null
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>All Projects</h1>
            {projects.map(project => {
                // Prepare default values for project developers (multi-select)
                const projectDeveloperValues = project.developers
                    ? project.developers.map(devId => getDeveloperOption(devId)).filter(Boolean)
                    : [];

                return (
                    <div key={project._id} style={styles.projectBox}>
                        {/* Project Name */}
                        <input
                            style={styles.input}
                            value={project.name}
                            onChange={e => handleProjectChange(project._id, 'name', e.target.value)}
                            placeholder="Project Name"
                        />

                        {/* Project Developers (multi-select) */}
                        <div>
                            <strong>Project Developers:</strong>
                            <Select
                                isMulti
                                options={developerOptions}
                                value={projectDeveloperValues}
                                onChange={(selected) =>
                                    handleProjectChange(
                                        project._id,
                                        'developers',
                                        selected ? selected.map(s => s.value) : []
                                    )
                                }
                                styles={{ container: base => ({ ...base, ...styles.select }) }}
                                placeholder="Select developers"
                            />
                        </div>

                        {/* Tasks */}
                        <h4 style={styles.subHeading}>Tasks</h4>
                        {project.tasks.map(task => {
                            // Default single developer for task assignedTo
                            let assignedDevValue = null;
                            if (typeof task.assignedTo === 'string') {
                                assignedDevValue = getDeveloperOption(task.assignedTo);
                            } else if (task.assignedTo && task.assignedTo._id) {
                                assignedDevValue = getDeveloperOption(task.assignedTo._id);
                            }

                            return (
                                <div key={task._id} style={styles.taskBox}>
                                    <input
                                        style={styles.input}
                                        value={task.name}
                                        onChange={e => handleTaskChange(project._id, task._id, 'name', e.target.value)}
                                        placeholder="Task Name"
                                    />
                                    <select
                                        style={styles.input}
                                        value={task.status}
                                        onChange={e => handleTaskChange(project._id, task._id, 'status', e.target.value)}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        <option value="DONE">DONE</option>
                                    </select>

                                    <Select
                                        options={developerOptions}
                                        value={assignedDevValue}
                                        onChange={(selected) =>
                                            handleTaskChange(
                                                project._id,
                                                task._id,
                                                'assignedTo',
                                                selected ? selected.value : null
                                            )
                                        }
                                        placeholder="Assign Developer"
                                        styles={{ container: base => ({ ...base, ...styles.select }) }}
                                        isClearable
                                    />
                                </div>
                            );
                        })}

                        <button style={styles.button} onClick={() => saveProject(project)}>Save Project</button>
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectManager;
