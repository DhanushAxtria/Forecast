import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa'; // Importing the filter icon
import { generateDummyData } from './Generate_Dummy'; // importing dummy data
import Button from '@mui/material/Button';


// Unicode for Lock and Good to Go icons
const lockIcon = '🔒';
const goodToGoIcon = '✅';

// Sample data for Therapeutic Area, Region,Country, Usernames, and Forecast Cycles
const therapeuticAreas = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology', 'HIV'];
const regions = ['EU5', 'Nordic Region'];
const countries = {
  'EU5': ['UK', 'Germany', 'France', 'Italy', 'Spain'],
  'Nordic Region': ['Denmark', 'Norway', 'Sweden', 'Finland', 'Iceland'],
};
const forecastCycles = ['H1 - 2023', 'H2 - 2023', 'H1 - 2024', 'H2 - 2024'];
const forecastOptions = {
  'H1 - 2023': ['Forecast 1', 'Forecast 2'],
  'H2 - 2023': ['Forecast 3', 'Forecast 4'],
  'H1 - 2024': ['Forecast 5', 'Forecast 6'],
  'H2 - 2024': ['Forecast 7', 'Forecast 8'],

};
const sampleUsernames = ['john_doe', 'jane_smith', 'michael_wang', 'emma_clark', 'chris_jones'];

const DataConsolidation = () => {
  const [greeting, setGreeting] = useState(''); // State for greeting message
  const [rowsData, setRowsData] = useState([]); // State for rows data
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState(''); // State for selected Therapeutic Area
  const [selectedRegion, setSelectedRegion] = useState(''); // State for selected Region
  const [selectedForecastCycle, setSelectedForecastCycle] = useState(''); // State for selected Forecast Cycle
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track the current step in the tutorial

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


  // Initialize the table with the dummy data
  useEffect(() => {
    const rows = generateDummyData();
    setRowsData(rows);
  }, []);


  // Function to filter rows based on selected Therapeutic Area, Region, and Forecast Cycle
  const getFilteredRows = () => {
    // Filter rows based on selected filters
    const filteredRows = rowsData.filter((row) => {
      const matchesTherapeuticArea =
        selectedTherapeuticArea === '' || row.therapeuticArea === selectedTherapeuticArea;
      const matchesRegion = selectedRegion === '' || row.region === selectedRegion;
      const matchesForecastCycle =
        selectedForecastCycle === '' ||
        forecastOptions[selectedForecastCycle].includes(row.forecast);
      return matchesTherapeuticArea && matchesRegion && matchesForecastCycle;
    });

    // Get countries in the selected region
    const countriesInRegion = countries[selectedRegion];

    // Create an array that includes all countries and their respective rows if any
    const rowsWithCountries = countriesInRegion.map((country) => {
      // Find rows for the current country
      const countryRows = filteredRows.filter((row) => row.country === country);

      // If no dummy data exists for the country, give the following default values
      if (countryRows.length === 0) {
        return [
          {
            country: country,
            therapeuticArea: selectedTherapeuticArea,
            worksheet: "Output Sheet",
            forecast: forecastOptions[selectedForecastCycle][0],
            forecastStatus: "lock",
            forecastStarted: "2024-01-01",
            username: "john_doe",
          },
        ];
      }

      return countryRows;
    });

    // Flatten the result to get a list of rows
    return rowsWithCountries.flat();
  };

  // Get the filtered forecast options based on the selected Forecast Cycle
  const getFilteredForecastOptions = () => {
    if (selectedForecastCycle && forecastOptions[selectedForecastCycle]) {
      return forecastOptions[selectedForecastCycle];
    }
    return [];
  };

  // Check if all filters have been selected
  const areAllFiltersSelected = () => {
    return selectedTherapeuticArea !== '' && selectedRegion !== '' && selectedForecastCycle !== '';
  };
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
      top = rect.top - popup.offsetHeight;
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'bottom') {
      top = rect.bottom + 10;
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
      target: '.filter1-button',
      content: 'Use this button to select Forecast Cycle.',
      placement: 'right',
    },
    {
      index: 1,
      target: '.filter2-button',
      content: 'Use this button to select Therapeutic Area.',
      placement: 'right',
    },
    {
      index: 2,
      target: '.filter3-button',
      content: 'Use this button to select Region.\nA table is displayed with the countries of this region with filtered scenario data.',
      placement: 'left',
    }
  ];

  return (
    <div style={{ backgroundColor: 'white', marginTop: '20px' }}>
      {/* Greeting section */}
      <Button
                className='tutorial-btn'
                variant="contained"
                size='small'
                sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 0, mr: 2 }}
                onClick={() => handleStartTutorial()}
            >
                Show Tutorial
            </Button>
      <h2>{greeting}, Welcome to the Data Consolidation Page!</h2>

      {/* Forecast and Worksheet Selections Container */}
      <div style={styles.selectionContainer}>

        {/* Forecast Cycle Filter */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Forecast Cycle</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Forecast Cycle</label>
              <select
                className='filter1-button'
                style={styles.select}
                value={selectedForecastCycle}
                onChange={(e) => setSelectedForecastCycle(e.target.value)}
              >
                <option value="">Select</option>{/* Default "Select" option */}
                {/* Mapping through forecastCycles array and rendering each forecastCycle as an option */}
                {forecastCycles.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Therapeutic Area Filter */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Therapeutic Area</h2>
          <div style={styles.content}>
            {/* Dropdown for selecting therapeutic area */}
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Therapeutic Area</label>
              <select
                className='filter2-button'
                style={styles.select}
                value={selectedTherapeuticArea}
                onChange={(e) => setSelectedTherapeuticArea(e.target.value)}
              >
                <option value="">Select</option> {/* Default "Select" option */}
                {/* Mapping through therapeuticAreas array and rendering each area as an option */}
                {therapeuticAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Region Filter */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Region</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Region</label>
              <select
                className='filter3-button'
                style={styles.select}
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">Select</option>{/* Default "Select" option */}
                {/* Mapping through regions array and rendering each region as an option */}
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* Data Table Section */}
      {areAllFiltersSelected() && ( // Conditionally rendering of the table
        <div style={styles.tableContainer}>
          <h2 style={styles.tableHeading}>Therapeutic Area, Country and Connected Data</h2>
          <table style={styles.table}>
            <thead>
              <tr >
                {/* Column headers with filter icons */}
                <th style={styles.tableHeader}>
                  Therapeutic Area <FaFilter style={styles.filterIcon} /> {/* Filter Icon for Therapeutic Area */}
                </th>
                <th style={styles.tableHeader}>
                  Country <FaFilter style={styles.filterIcon} /> {/* Filter Icon for Country */}
                </th>
                <th style={styles.tableHeader}>Select Worksheet</th>
                <th style={styles.tableHeader}>Scenario Details</th>
                <th style={styles.tableHeader}>Forecast Started</th>
                <th style={styles.tableHeader}>Username</th>
              </tr>
            </thead>
            <tbody>
              {/* Rendering each filtered row */}
              {getFilteredRows().map((row, index) => (
                <tr style={{ textAlign: 'center', backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white' }} key={index}> {/* Alternating row colors for readability*/}
                  <td>{row.therapeuticArea}</td>
                  <td>{row.country}</td>
                  <td>
                    <select style={{ ...styles.select, textAlign: 'center' }}>
                      <option value="OutputSheet">Output Sheet</option>
                      <option value="Worksheet1">Worksheet 1</option>
                      <option value="Worksheet2">Worksheet 2</option>
                    </select>
                  </td>
                  <td>
                    <select style={styles.select}>
                      {getFilteredForecastOptions().map((forecast, idx) => (
                        <option style={{ textAlign: 'center' }} key={idx} value={forecast}>
                          {forecast} {row.forecastStatus === 'lock' ? lockIcon : goodToGoIcon}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {/* Format and display forecast start date */}
                    {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(row.forecastStarted))}
                  </td>
                  <td>
                    {/* display username */}
                    {row.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
    justifyContent: 'space-around',
    gap: '20px',
  },
  section: {
    width: '30%',
    textAlign: 'left',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
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

  tableHeader: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    padding: '8px',

  },
  forecastCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: '10px',

  },
  iconGoodToGo: {
    marginLeft: '10px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',

    width: '100%',
    textAlign: 'center',
  },
  filterIcon: {
    marginLeft: '5px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DataConsolidation;

