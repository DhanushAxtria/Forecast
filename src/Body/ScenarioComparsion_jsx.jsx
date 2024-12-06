import React, { useState, useEffect } from 'react';

const ForecastAndWorksheetSelectionsWithGreeting = () => {
  const [greeting, setGreeting] = useState('');

  // Set the greeting based on the current time
  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  const handleCancel = () => {
    console.log("Cancel button clicked!");
    // Add logic to handle cancel action
  };

  const handleOkay = () => {
    console.log("Okay button clicked!");
    // Add logic to handle okay action
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-44px' }}>
      {/* Greeting section */}
      <h2 >{greeting}, Welcome to the Scenario-Comparison Page!</h2>

      {/* Forecast and Worksheet Selections Container */}
      <div style={styles.selectionContainer}>
        
        {/* Forecast Selections Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Forecast Selections</h2>
          <div style={styles.content}>
            <p>Select your forecast and comparison deck</p>

            {/* Labeled Dropdowns for Forecasts */}
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Forecast 1</label>
              <select style={styles.select}>
                <option value="2024-H1">2024-H1</option>
                <option value="2024-H2">2024-H2</option>
                <option value="2025-H1">2025-H1</option>
              </select>
            </div>

            <div style={styles.labeledSelect}>
              <label style={styles.label}>Forecast 2</label>
              <select style={styles.select}>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
              </select>
            </div>

            {/* Comparison Deck Dropdown */}
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Comparison Deck</label>
              <select style={styles.select}>
                <option value="Deck1">Deck 1</option>
                <option value="Deck2">Deck 2</option>
                <option value="Deck3">Deck 3</option>
              </select>
            </div>
          </div>
        </section>

        {/* Worksheet Selections Section */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Worksheet Selections</h2>
          <div style={styles.content}>
            <p>Select the worksheets you want to include in the report.</p>

            {/* Labeled Dropdowns for Worksheet Selections */}
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Worksheet 1</label>
              <select style={styles.select}>
                <option value="Worksheet1">Worksheet 1</option>
                <option value="Worksheet2">Worksheet 2</option>
                <option value="Worksheet3">Worksheet 3</option>
                <option value="Worksheet4">Worksheet 4</option>
              </select>
            </div>

            <div style={styles.labeledSelect}>
              <label style={styles.label}>Worksheet 2</label>
              <select style={styles.select}>
                <option value="Worksheet1">Worksheet 1</option>
                <option value="Worksheet2">Worksheet 2</option>
                <option value="Worksheet3">Worksheet 3</option>
                <option value="Worksheet4">Worksheet 4</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* OK and Cancel Buttons */}
      <div style={styles.buttonContainer}>
        <button style={{ ...styles.button, backgroundColor: '#1976d2', color: 'white' }} onClick={handleOkay}>OK</button>
        <button style={{ ...styles.button, backgroundColor: '#1976d2', color: 'white' }} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  greeting: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  selectionContainer: {
    display: 'flex',
    justifyContent: 'space-around', // Align sections side-by-side
    gap: '20px', // Add some space between sections
  },
  section: {
    width: '45%', // Make each section take half the available width
    textAlign: 'left',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  content: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  labeledSelect: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  select: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default ForecastAndWorksheetSelectionsWithGreeting;
