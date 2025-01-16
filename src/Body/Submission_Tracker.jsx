import React, { useState, useEffect, useContext } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MyContext } from './context';
import {  Button, Typography } from '@mui/material';

// filter parameters and there respective values
const therapeuticAreas = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology', 'HIV'];
const countries = ['Iceland', 'Germany', 'UK', 'Finland', 'France', 'Italy', 'Spain', 'Denmark', 'Norway', 'Sweden'];
const forecastScenarios = ['H1 - 2023', 'H2 - 2023', 'H1 - 2024', 'H2 - 2024'];
const forecastStatus = ['Submitted', 'Pending', 'Ongoing'];
const sampleUsernames = ['john_doe', 'michael_wang', 'chris_jones'];


const DataConsolidation = () => {
  const { rowsData, setRowsData } = useContext(MyContext);
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedForecastStatus, setSelectedForecastStatus] = useState('');
  const [selectedForecastScenario, setSelectedForecastScenario] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track the current step in the tutorial



  /*
  Filters the rows of data based on the currently selected therapeutic area, country, forecast status, and forecast scenario.
   If any of the selected values are empty strings, the corresponding column is not filtered.
   returns The filtered array of rows.
   */
  const getFilteredRows = () => {
    return rowsData.filter(row => {
      const matchesTherapeuticArea =
        selectedTherapeuticArea === '' || row.therapeuticArea === selectedTherapeuticArea;
      const matchesCountry =
        selectedCountry === '' || row.country === selectedCountry;
      const matchesStatus =
        selectedForecastStatus === '' || row.currentForecastStatus === selectedForecastStatus;
      const matchesScenario =
        selectedForecastScenario === '' || row.forecastScenario === selectedForecastScenario;
      return matchesTherapeuticArea && matchesCountry && matchesStatus && matchesScenario;
    });
  };

  /* Handles the click event for the therapeutic area selection. 
  If the selected therapeutic area matches the one clicked, reset the selected therapeutic area to an empty string.*/
  const handleTherapeuticAreaClick = (ta) => {
    if (selectedTherapeuticArea === ta) {
      setSelectedTherapeuticArea('');
    } else {
      setSelectedTherapeuticArea(ta);
    }
  };

  /*Handles the click event for the forecast status selection. 
  If the selected forecast status matches the one clicked, reset the selected forecast status to an empty string.*/
  const handleCurrentStatusClick = (sts) => {
    if (selectedForecastStatus === sts) {
      setSelectedForecastStatus('');
    } else {
      setSelectedForecastStatus(sts);
    }
  };

  /* Handles the click event for the country selection. 
  If the selected country matches the one clicked, reset the selected country to an empty string.*/
  const handleCountryClick = (cntry) => {
    if (selectedCountry === cntry) {
      setSelectedCountry('');
    } else {
      setSelectedCountry(cntry);
    }
  };

  /* Handles the click event for the forecast scenario selection. 
  If the selected forecast scenario matches the one clicked, reset the selected forecast scenario to an empty string.*/
  const handleScenarioClick = (scn) => {
    if (selectedForecastScenario === scn) {
      setSelectedForecastScenario('');
    } else {
      setSelectedForecastScenario(scn);
    }
  };

  // Sets the greeting based on the current time of day. 
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

  const showTutorial2 = () => {
    const step = {
      index: 0,
      target: '.tutorial-btn',
      content: 'You can always see this tutorial by clicking on this button.',
      placement: 'left',
    };
    const targetElement = document.querySelector(step.target);
    const popup = document.createElement('div');
    popup.classList.add('tutorial-popup', step.placement);
    popup.textContent = step.content;
    targetElement.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)';
    targetElement.style.border = '3px solid navy';
    // Position the popup based on the target element and placement
    const rect = targetElement.getBoundingClientRect();
    let top, left;
    top = rect.top + rect.height / 2 - popup.offsetHeight / 2;
    left = rect.left - 350;
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    document.body.appendChild(popup);
    // Add a button to close the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cancel';
    closeButton.style.marginRight = '40px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
      setTutorialActive(false);
      setCurrentStep(0);
      popup.remove();
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    popup.appendChild(closeButton);
  };
  const showTutorial = (step) => {
    const targetElement = document.querySelector(step.target);
    const popup = document.createElement('div');
    popup.classList.add('tutorial-popup', step.placement);
    popup.textContent = step.content;
    targetElement.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)';
    targetElement.style.border = '3px solid navy';
    // Position the popup based on the target element and placement
    const rect = targetElement.getBoundingClientRect();
    let top, left;
    if (step.placement === 'top') {
      top = rect.top  - popup.offsetWidth / 2
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'bottom') {
      top = rect.bottom + 20;
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'left') {
      top = rect.top + rect.height / 2 - popup.offsetHeight / 2;
      left = rect.left - 350;
    } else if (step.placement === 'right') {
      top = rect.top;
      left = rect.right + 25;
    }
   
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    document.body.appendChild(popup);
    // Add a button to close the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Skip Tutorial';
    closeButton.style.marginRight = '40px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
      setTutorialActive(false);
      setCurrentStep(0);
      popup.remove();
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
      showTutorial2();
    });
    popup.appendChild(closeButton);
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.style.padding = '5px 10px';
    previousButton.style.marginRight = '5px';
    previousButton.style.borderRadius = '5px';
    previousButton.disabled = currentStep === 0; // Disable if first step
    previousButton.style.backgroundColor = previousButton.disabled ? 'grey' : 'navy';
    previousButton.addEventListener('click', () => {
      popup.remove();
      setCurrentStep(currentStep - 1); // Move to previous step
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.style.padding = '5px 10px';
    nextButton.style.borderRadius = '5px';
    nextButton.disabled = currentStep === steps.length - 1; // Disable if last step
    nextButton.style.backgroundColor = nextButton.disabled ? 'grey' : 'green';
    nextButton.addEventListener('click', () => {
      popup.remove();
      setCurrentStep(currentStep + 1); // Move to next step
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.marginTop = '20px';
    buttons.style.justifyContent = 'space-between';
    buttons.style.width = '100%';
    buttons.appendChild(closeButton);
    const flexEndButtons = document.createElement('div');
    flexEndButtons.style.display = 'flex';
    flexEndButtons.appendChild(previousButton);
    flexEndButtons.appendChild(nextButton);
    buttons.appendChild(flexEndButtons);
    popup.appendChild(buttons); // Insert the buttons after the text
  };

  const handleStartTutorial = () => {
    setTutorialActive(true);
    setCurrentStep(0); // Start from the first step
  };
  useEffect(() => {
    if (tutorialActive && currentStep < steps.length) {
      showTutorial(steps[currentStep]);
    }
  }, [tutorialActive, currentStep]);
  const steps = [
    {
      index: 0,
      target: '.filter-button',
      content: 'Use these dropdowns to apply filters and narrow down the table data based on your criteria.',
      placement: 'top',
    },
    {
      index: 2,
      target: '.table-container',
      content: 'This table gets updated as and when the user applies filters.It shows submission status of forecasts.',
      placement: 'top',
    },
   
  ];


  return (
    <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-44px' }}>
      <Button
        className='tutorial-btn'
        variant="contained"
        size='small'
        sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 3, mr: 2 }}
        onClick={() => handleStartTutorial()}
      >
        Show Tutorial
      </Button>

      {/* Display greeting message with a welcome note */}
      <h2>{greeting}, Welcome to the Submission Tracker Page!</h2>

      <div style={styles.selectionContainer} className='filter-button'>

        {/* Section for selecting Forecast Status */}
        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Forecast Status</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Forecast Status</label>
              <select
                style={styles.select}
                value={selectedForecastStatus}
                onChange={(e) => setSelectedForecastStatus(e.target.value)}
              >
                <option value="">All</option> {/* Default "All" option */}
                {forecastStatus.map((currentForecastStatus) => (
                  <option key={currentForecastStatus} value={currentForecastStatus}>
                    {currentForecastStatus}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section for selecting Therapeutic Area */}
        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Therapeutic Area</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Therapeutic Area</label>
              <select
                style={styles.select}
                value={selectedTherapeuticArea}
                onChange={(e) => setSelectedTherapeuticArea(e.target.value)}
              >
                <option value="">All</option>
                {therapeuticAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section for selecting Country/Region */}
        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Country/Region</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Country/Region</label>
              <select
                style={styles.select}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">All</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section for selecting Forecast Scenario */}
        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Forecast Scenario</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Forecast Scenario</label>
              <select
                style={styles.select}
                value={selectedForecastScenario}
                onChange={(e) => setSelectedForecastScenario(e.target.value)}
              >
                <option value="">All</option>
                {forecastScenarios.map((forecastScenario) => (
                  <option key={forecastScenario} value={forecastScenario}>
                    {forecastScenario}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

      </div>

      <div style={styles.tableContainer} >
        {/* Table for displaying country-TA wise forecast submission status */}
        <h2 style={styles.tableHeading}> Country-TA wise Forecast Submission Status</h2>
        <table style={styles.table} className='table-container'>
          <thead>
            <tr >
              {/* Header for Therapeutic Area column with filter icon */}
              <th style={styles.tableHeader}>Therapeutic Area <FaFilter style={styles.filterIcon} /></th>
              {/* Header for Country/Region column with filter icon */}
              <th style={styles.tableHeader}>Country/Region <FaFilter style={styles.filterIcon} /></th>
              {/* Header for Forecast Status column with filter icon */}
              <th style={styles.tableHeader}>Forecast Status <FaFilter style={styles.filterIcon} /></th>
              {/* Header for Forecast Scenario column with filter icon */}
              <th style={styles.tableHeader}>Forecast Scenario <FaFilter style={styles.filterIcon} /></th>
              {/* Header for Last Forecast Update column */}
              <th style={styles.tableHeader}>Last Forecast Update</th>
              {/* Header for Last Updated By column */}
              <th style={styles.tableHeader}> Last Updated By</th>
            </tr>
          </thead>
          <tbody>
            {/* Map each row from the filtered rows array to a table row */}
            {getFilteredRows().map((row, index) => (
              <tr
                key={index}
                // Set the hovered row index on mouse enter
                onMouseEnter={() => setHoveredRow(index)}
                // Reset the hovered row index on mouse leave
                onMouseLeave={() => setHoveredRow(null)}

                style={{
                  backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white', // Alternate row colors
                  // Apply the hover effect if the row is hovered
                  ...(hoveredRow === index && styles.hoveredRow)
                }}
              >
                {/* Therapeutic Area cell with cursor pointer and bold font */}
                <td style={{ ...styles.tableCell, cursor: 'pointer', color: '#086193', fontWeight: 'bold' }}
                  onClick={() => handleTherapeuticAreaClick(row.therapeuticArea)}>
                  {row.therapeuticArea}
                </td>
                {/* Country cell with cursor pointer */}
                <td style={styles.tableCell} onClick={() => handleCountryClick(row.country)}>{row.country}</td>
                {/* Forecast Status cell with color based on status and cursor pointer */}
                <td style={{
                  ...styles.tableCell,
                  color:
                    row.currentForecastStatus === 'Pending' ? 'red' :
                      row.currentForecastStatus === 'Ongoing' ? '#f1b963' :
                        '#42b883',
                }} onClick={() => handleCurrentStatusClick(row.currentForecastStatus)}>
                  {row.currentForecastStatus}
                </td>
                {/* Forecast Scenario cell with cursor pointer */}
                <td style={styles.tableCell} onClick={() => handleScenarioClick(row.forecastScenario)}>{row.forecastScenario}</td>
                {/* Last Forecast Update cell */}
                <td style={styles.tableCell}>{row.forecastStarted}</td>
                {/* Last Updated By {username} */}
                <td style={styles.tableCell}>{row.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  selectionContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
  },
  section: {
    width: '23%',
    textAlign: 'left',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#086193',
  },
  content: {
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  labeledSelect: {
    marginBottom: '20px',
  },
  label: {
    display: 'contents',
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
  tableContainer: {
    marginTop: '30px',
  },
  tableHeading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '5px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  hoveredRow: {
    backgroundColor: '#d3d3d3',
  },
  tableHeader: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    padding: '8px',
  },
  tableCell: {
    textAlign: 'center',
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
  filterIcon: {
    marginLeft: '5px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DataConsolidation;
