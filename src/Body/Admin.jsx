import React, { useState, useEffect } from 'react';
import introJs from 'intro.js';
import { FaFilter } from 'react-icons/fa'; // Importing the filter icon
import { generateDummyData } from './Generate_Dummy'; // importing dummy data
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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

const options = [
  "View Details",
  "Lock Scenario",
  "Unlock Scenario",
  "Approve Scenario",
  "Reject Scenario",
  "Clone Scenario",
  "Duplicate Scenario",
  "Archive Scenario",
  "Export Data",
  "Audit Trail",
  "Audit Logs",
  "Share Scenario",
  "Set Status",
  "set Label",
  "Add Annotations",
  "Add Comments",
];

const Admin = () => {
  const [greeting, setGreeting] = useState(''); // State for greeting message
  const [rowsData, setRowsData] = useState([]); // State for rows data
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState(''); // State for selected Therapeutic Area
  const [selectedRegion, setSelectedRegion] = useState(''); // State for selected Region
  const [selectedForecastCycle, setSelectedForecastCycle] = useState(''); // State for selected Forecast Cycle
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
          padding: "2px",
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
          element: '.filter1-button',
          intro: 'Use this button to select Forecast Cycle.',
          position: 'right'
        },

        {
          element: '.filter2-button',
          intro: 'Use this button to select Therapeutic Area.',
          position: 'right',
        },
        {
          element: '.filter3-button',
          intro: 'Use this button to select Region.\nA table is displayed with the countries of this region with filtered scenario data.',
          position: 'left',
        }
      ],
      showProgress: false, // Disable progress bar
      showStepNumbers: false,
      showBullets: false,
      nextLabel: 'Next Step',
      prevLabel: 'Previous Step',
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

      // Add a custom "Skip Tutorial" button
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

      // Update the custom "Skip Tutorial" button text dynamically
      if (currentStep === totalSteps - 1) {
        customSkipButton.textContent = 'Close'; // Change Skip button text to "Close"
      } else {
        customSkipButton.textContent = 'Skip Tutorial'; // Reset Skip button text
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
        else {
          Object.assign(prevButton.style, {
            backgroundColor: 'navy',
            fontSize: '12px',
            color: 'white',
            marginRight: '40px',
            fontWeight: 'bold',
            textShadow: 'none',
            borderRadius: '5px',
            padding: '5px 10px',
          })
        }
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

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-44px' }}>
      {/* Greeting section */}
      <Button        
        variant="contained"
        size='small'
        sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 3, mr: 2 }}
        onClick={startTour} 
        className="start-tour-button"
      >
        Show Tutorial
      </Button>
      <h2>{greeting}, Welcome to the Admin Page!</h2>

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
                <th style={styles.tableHeader}>Scenario Details</th>
                <th style={styles.tableHeader}>Forecast Started</th>
                <th style={styles.tableHeader}>Username</th>
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Rendering each filtered row */}
              {getFilteredRows().map((row, index) => (
                <tr style={{ textAlign: 'center', backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white', height: '40px' }} key={index}> {/* Alternating row colors for readability*/}
                  <td>{row.therapeuticArea}</td>
                  <td>{row.country}</td>

                  <td>
                    {getFilteredForecastOptions()[0]} {row.forecastStatus === 'lock' ? lockIcon : goodToGoIcon}
                  </td>
                  <td>
                    {/* Format and display forecast start date */}
                    {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(row.forecastStarted))}
                  </td>
                  <td>
                    {/* display username */}
                    {row.username}
                  </td>
                  <td>
                    <IconButton color="default" title="Edit" aria-label="edit">
                      <EditIcon style={{ color: "black" }} />
                    </IconButton>
                    <IconButton color="default" title="Delete" aria-label="delete">
                      <DeleteIcon style={{ color: "purple" }} />
                    </IconButton>
                    <IconButton color="default" title="Lock" aria-label="lock">
                      <LockIcon style={{ color: "green" }} />
                    </IconButton>
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      color="default"
                      title="More Actions"
                      onClick={handleClick}
                    >
                      <MoreVertIcon style={{ color: "grey" }} />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        style: {
                          maxHeight: 48 * 4.5,
                          width: "20ch",
                        },
                      }}
                    >
                      {options.map((option) => (
                        <MenuItem
                          key={option}
                          onClick={handleClose}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#1976d2",
                              color: "white",
                            },
                          }}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </Menu>
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

export default Admin;

