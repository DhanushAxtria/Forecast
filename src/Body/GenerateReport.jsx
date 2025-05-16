import * as React from 'react';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { useContext, useEffect, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './context';
import { FormControl, InputLabel, Select, MenuItem, Typography, Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import introJs from 'intro.js';

// demo data for the table
const demo_data = [
    { scenario: 'Brand A - Scenario 2', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Nov 2024', user: 'John Doe' },
    { scenario: 'Brand A - Scenario 1', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Sep 2024', user: 'Michael Wang' },
    { scenario: 'Brand C - Scenario 2', cycle: '2023 H2', country: 'Denmark', area: 'Oncology', modified: '15 Sep 2023', user: 'Chris Jones' },
    { scenario: 'Brand C - Scenario 1', cycle: '2023 H2', country: 'Denmark', area: 'Oncology', modified: '15 Sep 2023', user: 'Chris Jones' },
    { scenario: 'Brand D - Scenario 2', cycle: '2023 H1', country: 'Sweden', area: 'Oncology', modified: '26 Jun 2023', user: 'Jane Smith' },
    { scenario: 'Brand D - Scenario 1', cycle: '2023 H1', country: 'Sweden', area: 'Oncology', modified: '22 Jun 2023', user: 'Jane Smith' },
    { scenario: 'Brand B - Scenario 2', cycle: '2023 H1', country: 'Finland', area: 'HIV', modified: '21 Jun 2023', user: 'Emma Clark' },
    { scenario: 'Brand B - Scenario 1', cycle: '2023 H1', country: 'Finland', area: 'HIV', modified: '27 Mar 2023', user: 'John Doe' },
    { scenario: 'Brand C - Scenario 2', cycle: '2022-H2', country: 'India', area: 'Oncology', modified: '10 Dec 2022', user: 'Michael Wang' },
    // { scenario: 'Brand C - Scenario 1', cycle: '2022 H2', country: 'Norway', area: 'Cardiology', modified: '30 Sep 2022', user: 'John Doe' },
    // { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Immunology', modified: '30 Dec 2024', user: 'John Doe' },
    // { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'Immunology', modified: '29 Nov 2024', user: 'John Doe' },
    // { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'Immunology', modified: '28 Oct 2024', user: 'John Doe' },
    // { scenario: 'Main Submission', cycle: '2024 H2', country: 'Finland', area: 'Immunology', modified: '28 Sep 2024', user: 'John Doe' },
    // { scenario: 'Draft 1', cycle: '2024 H2', country: 'Finland', area: 'Immunology', modified: '28 Sep 2024', user: 'John Doe' },
    // { scenario: 'Draft 1', cycle: '2024 H1', country: 'Germany', area: 'Diabetes', modified: '25 May 2014', user: 'Michael Wang' },
    // { scenario: 'Main Submission', cycle: '2024 H1', country: 'Norway', area: 'Cardiology', modified: '06 May 2024', user: 'John Doe' },
    // { scenario: 'Draft 3', cycle: '2023 H2', country: 'USA', area: 'Cardiology', modified: '10 Aug 2023', user: 'Emma Clark' },
    // { scenario: 'Main Submission', cycle: '2023 H2', country: 'Canada', area: 'Oncology', modified: '20 Aug 2023', user: 'Chris Jones' },
    // { scenario: 'Draft 1', cycle: '2023 H2', country: 'Germany', area: 'Neurology', modified: '15 Aug 2023', user: 'Michael Wang' },
    // { scenario: 'Draft 2', cycle: '2023 H2', country: 'Denmark', area: 'Diabetes', modified: '10 Oct 2023', user: 'Jane Smith' },
    // { scenario: 'Main Submission', cycle: '2023 H1', country: 'Norway', area: 'Cardiology', modified: '30 Sep 2023', user: 'John Doe' },
    // { scenario: 'Draft 1', cycle: '2023 H1', country: 'USA', area: 'Oncology', modified: '15 May 2023', user: 'Emma Clark' },
    // { scenario: 'Main Submission', cycle: '2023 H1', country: 'Canada', area: 'Neurology', modified: '20 Apr 2013', user: 'Chris Jones' },
    // { scenario: 'Draft 3', cycle: '2023 H1', country: 'Germany', area: 'Diabetes', modified: '01 Apr 2023', user: 'Michael Wang' },
    // { scenario: 'Main Submission', cycle: '2023 H1', country: 'Denmark', area: 'Immunology', modified: '12 Mar 2023', user: 'Jane Smith' },
    // { scenario: 'Draft 2', cycle: '2023 H1', country: 'Norway', area: 'Cardiology', modified: '01 Mar 2023', user: 'John Doe' },
    // { scenario: 'Draft 3', cycle: '2023 H1', country: 'USA', area: 'Oncology', modified: '25 Feb 2013', user: 'Emma Clark' },
    // { scenario: 'Main Submission', cycle: '2023 H1', country: 'Canada', area: 'Neurology', modified: '01 Feb 2013', user: 'Chris Jones' },
    // { scenario: 'Main Submission', cycle: '2023 H1', country: 'Denmark', area: 'Cardiology', modified: '18 Jan 2014', user: 'Jane Smith' },
    // { scenario: 'Draft 1', cycle: '2022 H2', country: 'Norway', area: 'Neurology', modified: '02 Oct 2022', user: 'John Doe' },
    // { scenario: 'Draft 3', cycle: '2022 H2', country: 'USA', area: 'Immunology', modified: '29 Sep 2022', user: 'Emma Clark' },
    // { scenario: 'Main Submission', cycle: '2022 H2', country: 'Canada', area: 'Diabetes', modified: '22 Sep 2022', user: 'Chris Jones' },
    // { scenario: 'Draft 1', cycle: '2022 H1', country: 'Germany', area: 'Immunology', modified: '15 Jun 2022', user: 'Michael Wang' },
    // { scenario: 'Draft 2', cycle: '2022 H2', country: 'Denmark', area: 'Oncology', modified: '01 Jan 2022', user: 'Jane Smith' },
    // { scenario: 'Main Submission', cycle: '2021 H2', country: 'Norway', area: 'Neurology', modified: '04 Oct 2021', user: 'John Doe' },
    // { scenario: 'Draft 3', cycle: '2021 H1', country: 'USA', area: 'Cardiology', modified: '15 Sep 2021', user: 'Emma Clark' },
    // { scenario: 'Main Submission', cycle: '2021 H2', country: 'Canada', area: 'Oncology', modified: '01 Sep 2021', user: 'Chris Jones' },
    // { scenario: 'Draft 1', cycle: '2021 H1', country: 'Germany', area: 'Diabetes', modified: '30 Jun 2021', user: 'Michael Wang' },
    // { scenario: 'Draft 2', cycle: '2021 H1', country: 'Denmark', area: 'Immunology', modified: '20 Jan 2021', user: 'Jane Smith' },
    
];

const reportCategories = [
    {
        label: 'Scenario-Level Reports',
        options: [
            'Scenario Summary Report',
            'Version History Report',
        ],
    },
    {
        label: 'Country-Level Reports',
        options: [
            'Country Summary Report',
            'Regional Comparison Report',
        ],
    },
    {
        label: 'Performance and Accuracy Reports',
        options: [
            'Forecast Accuracy Report',
            'Scenario Performance Report',
        ],
    },
    {
        label: 'Input Data Analysis Reports',
        options: [
            'Data Quality Report',
            'Assumption Analysis Report',
        ],
    },
    {
        label: 'Time-Series Reports',
        options: [
            'Trend Analysis Report',
            'Time-Series Breakdown Report',
        ],
    },
    {
        label: 'Operational and Administrative Reports',
        options: [
            'Submission Status Report',
            'Audit Log Report',
            'Lock/Unlock Status Report',
        ],
    },
    {
        label: 'Financial and Business Impact Reports',
        options: [
            'Revenue Forecast Report',
            'Cost vs. Revenue Report',
            'Risk Assessment Report',
        ],
    },
    {
        label: 'Visualization-Focused Reports',
        options: [
            'KPI Dashboard Report',
            'Geographic Heatmap Report',
        ],
    },
];


export default function GenerateReport() {
    const { countries, setCountries } = useContext(MyContext);
    const { therapeuticAreas, setTherapeuticAreas } = useContext(MyContext);
    const { forecastCycles, setForecastCycles } = useContext(MyContext);
    const [tutorialActive, setTutorialActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Track the current step in the tutorial
    // dropdown values
    const countryOptions = ['All', 'US', 'Canada', 'Germany', 'Denmark', 'Norway', 'Finland'];
    const therapeuticAreaOptions = ['All', 'Cardiology', 'Oncology', 'Neurology', 'STD', 'Immunology'];
    const forecastCycleOptions = ['All', '2024 H2', '2013-H1', '2013-H2', '2014-H1', '2014-H2'];
    const navigate = useNavigate();

    const handleReviewScenario = (scenario) => {
        // Navigate to the specific page, passing scenario data as state
        navigate('/saved-scenario/review-scenario', { state: { scenario } });
    };
    const handleReviewScenarioSummary = (scenario) => {
        // Navigate to the specific page, passing scenario data as state
        navigate('/saved-scenario/summary-scenario', { state: { scenario } });
    };
    const getGreetingMessage = () => {
        const hours = new Date().getHours();
        if (hours < 12) return `Good Morning`;
        if (hours < 18) return `Good Afternoon`;
        return `Good Evening`;
    };

    // Filtered data based on the dropdown selections
    const filteredData = demo_data.filter(item =>
        (forecastCycles.length === 0 || forecastCycles.includes('All') || forecastCycles.includes(item.cycle)) &&
        (countries.length === 0 || countries.includes('All') || countries.includes(item.country)) &&
        (therapeuticAreas.length === 0 || therapeuticAreas.includes('All') || therapeuticAreas.includes(item.area))
    );
    const [selectedRows, setSelectedRows] = React.useState(new Array(filteredData.length).fill(false));
    useEffect(() => {
        const rows = selectedRows.map(val => false);
        setSelectedRows(rows);
    }, [countries, therapeuticAreas, forecastCycles]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null); // Track the current category for submenu
    const [Index, setIndex] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // Open main menu
        setSubMenuAnchorEl(null); // Reset submenu state
        setCurrentCategory(null); // Reset category
        setIndex(null); // Reset selected index
    };

    const handleClose = () => {
        setAnchorEl(null); // Close main menu
        setSubMenuAnchorEl(null); // Close submenu
        setCurrentCategory(null); // Reset category
        setIndex(null); // Reset selected index
    };

    const handleSubMenuOpen = (index, event, category) => {
        event.stopPropagation(); // Prevent parent menu from closing
        setSubMenuAnchorEl(event.currentTarget); // Open submenu
        setCurrentCategory(category); // Set the category for submenu
        setIndex(index); // Update the selected index
    };

    const handleSubMenuClose = () => {
        setSubMenuAnchorEl(null); // Close submenu only
    };
    const showTutorial2 = () => {
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
      const showTutorial = () => {
        const intro = introJs();
        intro.setOptions({
            steps : [
                {
                    element: '.filter-button',
                    intro: 'Use this button to apply filters and narrow down the table data based on your criteria.',
                },
                {
                    element: '.generate-button',
                    intro: 'Click here to generate a report for the rows you have selected.',
                },
                {
                    element: '.tick-button',
                    intro: 'Click this button to select a row for report generation.',
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
              showTutorial2(); // Start the second tour
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
      const handleStartTutorial = () => {
        showTutorial();
      };
    

    return (
        <div style={{ backgroundColor: 'white',  marginTop: '20px' , marginLeft: '10px'  }}>
            <Button
                className='start-tour-button'
                variant="contained"
                size='small'
                sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 0, mr: 2 }}
                onClick={() => handleStartTutorial()}
            >
                Show Tutorial
            </Button>
            <h2>{getGreetingMessage()}, Welcome to the Standard Reports Page!</h2>
            <h4>Please select a scenario to continue</h4>
            <Box display="flex" gap={2} mb={2} sx={{ width: '100%' }}>
                {/* Forecast Cycle Dropdown */}
                <Autocomplete
                    className='filter-button'
                    multiple
                    id="forecast-cycle-autocomplete"
                    options={forecastCycleOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    value={forecastCycles}
                    onChange={(event, newValue) => setForecastCycles(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} size="small" label="Forecast Cycle" placeholder="Select forecast cycle(s)" />
                    )}
                    sx={{ width: '300px' }}
                />

                {/* Country Dropdown */}
                <Autocomplete
                    multiple
                    id="country-autocomplete"
                    options={countryOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    value={countries}
                    onChange={(event, newValue) => setCountries(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} size="small" label="Country" placeholder="Select country(s)" />
                    )}
                    sx={{ width: '300px' }}
                />

                {/* Therapeutic Area Dropdown */}
                <Autocomplete
                    multiple
                    id="therapeutic-area-autocomplete"
                    options={therapeuticAreaOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    value={therapeuticAreas}
                    onChange={(event, newValue) => setTherapeuticAreas(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} size="small" label="Therapeutic Area" placeholder="Select therapeutic area(s)" />
                    )}
                    sx={{ width: '300px' }}
                />

            </Box>
            <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                <Button
                    className='generate-button'
                    onClick={handleClick}
                    disabled={selectedRows.every(val => val === false)}
                    sx={{
                        bgcolor: selectedRows.every(val => val === false) ? 'grey' : '#1976d2', // Blue background
                        color: 'white',  // White text
                        '&:hover': {
                            bgcolor: 'darkblue' // Darker blue on hover
                        }
                    }}
                >
                    Generate Report
                </Button>

                {/* Main Dropdown */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose} // Close main menu when clicking outside

                >
                    {reportCategories.map((category, index) => (
                        <MenuItem
                            key={index}
                            onClick={(event) => handleSubMenuOpen(index, event, category)}
                            sx={{
                                bgcolor: index === Index ? '#1976d2' : 'white',
                                '&:hover': {
                                    bgcolor: '#1976d2',
                                    color: 'white',
                                },
                            }}
                        >
                            {category.label}
                            <Typography variant="body2" sx={{ marginLeft: 'auto' }}>
                                <ArrowRightIcon sx={{ fontSize: 18 }} />
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>

                {/* First-level Submenu */}
                {currentCategory && (
                    <Menu
                        anchorEl={subMenuAnchorEl}
                        open={Boolean(subMenuAnchorEl)}
                        onClose={handleSubMenuClose} // Close submenu only
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        {currentCategory.options.map((option, idx) => (
                            <MenuItem
                                key={idx}
                                onClick={handleClose} // Close both menus on submenu selection
                                sx={{
                                    '&:hover': {
                                        bgcolor: '#1976d2',
                                        color: 'white',
                                    },
                                }}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                )}
            </div>




            {(
                <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%' }}>
                    <Table aria-label="submission scenarios table" size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                {/* Checkbox for selecting rows */}
                                <TableCell padding="checkbox">
                                    {/* <Checkbox /> */}
                                </TableCell>
                                {/* Scenario Name */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario</TableCell>
                                {/* Forecast Cycle */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Forecast Cycle</TableCell>
                                {/* Country */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Country</TableCell>
                                {/* Therapeutic Area */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Therapeutic Area</TableCell>
                                {/* Last Modified Date */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Last Modified</TableCell>
                                {/* Submitted by */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Submitted by</TableCell>
                                {/* Actions */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white', height: 53 }}>
                                    {/* Checkbox for selecting this row */}
                                    <TableCell className="tick-button" padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows[index]}
                                            onChange={() => setSelectedRows(
                                                selectedRows.map((value, i) => i === index ? !value : value)
                                            )}
                                        />
                                    </TableCell>
                                    {/* Scenario Name */}
                                    <TableCell align="center">{row.scenario}</TableCell>
                                    {/* Forecast Cycle */}
                                    <TableCell align="center">{row.cycle}</TableCell>
                                    {/* Country */}
                                    <TableCell align="center">{row.country}</TableCell>
                                    {/* Therapeutic Area */}
                                    <TableCell align="center">{row.area}</TableCell>
                                    {/* Last Modified Date */}
                                    <TableCell align="center">{row.modified}</TableCell>
                                    {/* Submitted by */}
                                    <TableCell align="center">{row.user}</TableCell>
                                    {/* Actions */}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
