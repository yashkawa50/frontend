// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DeveloperForm from './components/DeveloperForm';
import SimpleProjectForm from './components/ProjectCreation';
import ProjectList from './components/ProjectList';
import DevDashboard from './components/DevWorkLoad';
import ProjectManager from './components/Assign';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/assign-project" element={<ProjectManager/>} />
          <Route path="/projectlist" element={<ProjectList />} />
          <Route path="/employeelist" element={<DevDashboard />} />
          <Route path="/dev-create" element={<DeveloperForm />} />
          <Route path="/project-create" element={<SimpleProjectForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
