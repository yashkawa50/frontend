import axios from 'axios';
import React, { useState } from 'react';

function DeveloperForm() {
  const [devName, setDevName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!devName) {
        alert('name required');
        return
      }
      await axios.post('http://localhost:5000/create-dev', {
        name: devName
      });
      console.log('Developer Name:', devName);
      alert(`Submitted: ${devName}`);
      setDevName('');
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  // Inline styles as JS objects
  const containerStyle = {
    padding: '20px',
    maxWidth: '400px',
    margin: '40px auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="devName" style={labelStyle}>
          Developer Name:
        </label>
        <input
          id="devName"
          type="text"
          value={devName}
          onChange={(e) => setDevName(e.target.value)}
          placeholder="Enter your name"
          style={inputStyle}
          required
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default DeveloperForm;
