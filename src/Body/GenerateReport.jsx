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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// demo data for the table
const demo_data = [
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 1', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '28 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'Cardiology', modified: '10 Jan 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Oncology', modified: '20 Aug 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'Neurology', modified: '15 Apr 2014', user: 'User 4' },
    { scenario: 'Draft 2', cycle: '2014-H2', country: 'India', area: 'Diabetes', modified: '10 Dec 2014', user: 'User 5' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Cardiology', modified: '30 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 1', cycle: '2013-H1', country: 'USA', area: 'Oncology', modified: '15 Jan 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Neurology', modified: '20 Jul 2013', user: 'User 3' },
    { scenario: 'Draft 3', cycle: '2014-H1', country: 'Germany', area: 'Diabetes', modified: '01 Apr 2014', user: 'User 4' },
    { scenario: 'Main Submission', cycle: '2014-H2', country: 'India', area: 'TA 1', modified: '12 Dec 2014', user: 'User 5' },
    { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'Cardiology', modified: '01 Oct 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'Oncology', modified: '25 Feb 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Neurology', modified: '30 Aug 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'Diabetes', modified: '25 May 2014', user: 'User 4' },
    { scenario: 'Main Submission', cycle: '2014-H2', country: 'India', area: 'Cardiology', modified: '18 Dec 2014', user: 'User 5' },
    { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'Neurology', modified: '02 Oct 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'TA 1', modified: '10 Mar 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Diabetes', modified: '22 Sep 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'TA 1', modified: '15 Jun 2014', user: 'User 4' },
    { scenario: 'Draft 2', cycle: '2014-H2', country: 'India', area: 'Oncology', modified: '01 Jan 2015', user: 'User 5' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Neurology', modified: '04 Oct 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'Cardiology', modified: '15 Apr 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Oncology', modified: '01 Nov 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'Diabetes', modified: '30 Jul 2014', user: 'User 4' },
    { scenario: 'Draft 2', cycle: '2014-H2', country: 'India', area: 'TA 1', modified: '20 Jan 2015', user: 'User 5' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Cardiology', modified: '06 Oct 2024', user: 'User 1' }
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
    const countryOptions = ['All', 'USA', 'Canada', 'Germany', 'India', 'Norway', 'Finland'];
    const therapeuticAreaOptions = ['All', 'Cardiology', 'Oncology', 'Neurology', 'Diabetes', 'TA 1'];
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
            target: '.filter-button',
            content: 'Use this button to apply filters and narrow down the table data based on your criteria.',
            placement: 'right',
        },
        {
            index: 1,
            target: '.generate-button',
            content: 'Click here to generate a report for the rows you have selected.',
            placement: 'right',
        },
        {
            index: 2,
            target: '.tick-button',
            content: 'Click this button to select a row for report generation.',
            placement: 'right',
        }
    ];

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-25px' }}>
            <Typography
                className='tutorial-btn'
                variant="body2"
                sx={{ color: 'black', position: 'absolute', right: 0, cursor: 'pointer', mt: 4, mr: 2 }}
                onClick={() => handleStartTutorial()}
            >
                Show tutorial
            </Typography>
            <h2>{getGreetingMessage()}, Welcome to the Saved Scenario Page!</h2>
            <h4>Please select a Scenario to Continue</h4>
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
