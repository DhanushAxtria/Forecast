import React, { useState, useEffect, useContext } from 'react';
import introJs from 'intro.js';
import { FaFilter } from 'react-icons/fa';
import { MyContext } from './context';
import { Button, Typography } from '@mui/material';
import { RxFontStyle } from 'react-icons/rx';
import { MinimizeTwoTone, WidthFull } from '@mui/icons-material';
import { BsTextWrap } from 'react-icons/bs';
import { min } from 'date-fns';

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
  


  // Function to start the tour for show tutorial
  const startTour2 = () => {
    const end = introJs();
    end.setOptions({
      steps: [
        {
          element: '.start-tour-button',
          intro: 'You can click here to rewatch the tutorial.',
          position: 'left'
        },
      ],
      showProgress: false, // Disable progress bar
      showStepNumbers: false,
      showBullets: false,
      nextLabel: '', // Remove "Next" button label
      prevLabel: '', // Remove "Previous" button label    
      showButtons: false, // Disable default Next/Prev buttons
    });

    end.onafterchange(() => {
      const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
      const tooltip = document.querySelector('.introjs-tooltip');
      const crossIcon = document.querySelector('.introjs-skipbutton')

      if (crossIcon) {
        Object.assign(crossIcon.style, {
          color: "red",
          padding:"2px",         
          marginBottom: '0px'
        })
      }
      // Remove any existing buttons in the tooltip
      if (tooltipContainer) {
        tooltipContainer.innerHTML = ''; // Clear all buttons
      }

      // Style the tooltip box
      if (tooltip) {
        Object.assign(tooltip.style, {
          backgroundColor: '#f9f9f9',
          color: '#333',
          whiteSpace: 'nowrap',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: "5px",
          maxWidth: '500px',
          fontSize: '14px',
          minWidth: '300px',
          textAlign: 'center',
        });
        tooltip.style.display = 'flex';
        tooltip.style.flexDirection = 'column';
        tooltip.style.justifyContent = 'space-between';
      }
    });
   

    end.start();
  };

  // main tutorial
  const startTour = () => {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '.filter-button',
          intro: 'This is the filter button.',
        },
        {
          element: '.table-container',
          intro: 'Here is where your filtered data will appear.',
        },
      ],
      showProgress: false, // Disable progress bar
      showStepNumbers: false,
      showBullets: false,
      nextLabel: 'Next step',
      prevLabel: 'Previous step',
      doneLabel: 'Finished'
    });

    intro.onafterchange(() => {
      const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
      const nextButton = document.querySelector('.introjs-nextbutton');
      const prevButton = document.querySelector('.introjs-prevbutton');
      const tooltip = document.querySelector('.introjs-tooltip');
      const totalSteps = intro._options.steps.length; // Get total number of steps
      const currentStep = intro._currentStep; // Get current step index
      console.log(currentStep)
      console.log(totalSteps)

      // Remove default close button
      const crossIcon = document.querySelector('.introjs-skipbutton');
      if (crossIcon) {
        crossIcon.remove();
      }

      // Add a custom "Skip tutorial" button
      let customSkipButton = document.querySelector('.custom-skip-button');
      if (!customSkipButton) {
        customSkipButton = document.createElement('button');
        customSkipButton.className = 'custom-skip-button';
        Object.assign(customSkipButton.style, {
          backgroundColor: 'red',
          fontSize: '12px',
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
          fontWeight: 'bold',
          textShadow: 'none',
          border: 'none',
          cursor: 'pointer',
          height: '20px',
          borderRadius: '5px',
        });

        customSkipButton.onclick = () => {
          intro.exit(); // End the current tour
          startTour2(); // Start the second tour
        };

        if (tooltipContainer && prevButton) {
          tooltipContainer.insertBefore(customSkipButton, prevButton.nextSibling);
        }
      }

      // Update the custom "Skip tutorial" button text dynamically
      if (currentStep === totalSteps - 1) {
        customSkipButton.textContent = 'Close'; // Change Skip button text to "Close"
      } else {
        customSkipButton.textContent = 'Skip tutorial'; // Reset Skip button text
      }

      if (nextButton) {
        if (currentStep === totalSteps - 1) {
          // Disable and style the Next button on the last step
          nextButton.disabled = true;
          Object.assign(nextButton.style, {
            position: 'absolute',
            bottom: '15px',
            right: '10px',
            backgroundColor: 'grey',
            color: 'white',
            cursor: 'not-allowed',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: 'none',
          });
        } else {
          // Enable and style the Next button for other steps
          nextButton.disabled = false;
          Object.assign(nextButton.style, {
            position: 'absolute',
            bottom: '15px',
            right: '10px',
            backgroundColor: 'green',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            boxShadow: 'none',
          });
        }
      }

      // Style the Previous button
      if (prevButton) {
        if (currentStep === 0) {
          prevButton.disabled = true;
        Object.assign(prevButton.style, {
          backgroundColor: 'grey',
          fontSize: '12px',
          color: 'white',
          marginRight: '40px',
          fontWeight: 'bold',
          textShadow: 'none',
          borderRadius: '5px',
          padding: '5px 10px',
        });
      }
    else{Object.assign(prevButton.style, {
      backgroundColor: 'navy',
      fontSize: '12px',
      color: 'white',
      marginRight: '40px',
      fontWeight: 'bold',
      textShadow: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
    })}
  }

      // Style the tooltip box
      if (tooltip) {
        Object.assign(tooltip.style, {
          backgroundColor: '#f9f9f9',
          color: '#333',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '5px',
          maxWidth: '500px',
          fontSize: '14px',
          minWidth: '300px',
          textAlign: 'center',
        });
      }
    });

    intro.start();
  };



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


  return (
    <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-44px' }}>
      <Button
        //className='tutorial-btn'
        variant="contained"
        size='small'
        sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 3, mr: 2 }}
        // onClick={() => handleStartTutorial()}
        onClick={startTour} className="start-tour-button"
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
