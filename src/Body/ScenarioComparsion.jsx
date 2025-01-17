import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box, Checkbox, ListItemText, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Add, Remove, ExpandMore, Work } from '@mui/icons-material';
import { Select, MenuItem } from '@mui/material';
import { Folder, InsertDriveFile } from '@mui/icons-material';
import './Newpage.scss';

const ScenarioComparsion = () => {
    const [filters, setFilters] = useState({
        forecastCycles: [],
        countries: [],
        therapeuticAreas: [],
    });
    const [scenarios, setScenarios] = useState({
        scenario1: null,
        scenario2: null,
    });
    const [variance, setVariance] = useState(0.0);
    const [scenarioOptions, setScenarioOptions] = useState([]);

    const [tableData, setTableData] = useState(null);
    const [isVarianceVisible, setIsVarianceVisible] = useState(false);
    const [selectedWorksheet, setSelectedWorksheet] = useState('');
    const [selectedDeck, setSelectedDeck] = useState('');
    const [isOption2Clicked, setIsOption2Clicked] = useState(false);
    const [isOption1Clicked, setIsOption1Clicked] = useState(false);
    const [tutorialActive, setTutorialActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Track the current step in the tutorial


    const defaultScenarios = [
        'Scenario A - Option 1',
        'Scenario B - Option 2',
        'Scenario C - Option 3',
        'Scenario D - Option 4',
    ];

    const Worksheets = ['Worksheet1', 'Worksheet2', 'Worksheet3', 'Worksheet4'];

    const sheetContents = {
        'Worksheet 1': [
            { scenario: 'FN18', cycle: '55', country: '55.3', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FO18', cycle: '74', country: '74.1', area: '0.1', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'Fp18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Worksheet 2': [
            { scenario: 'FN18', cycle: '55', country: '55.3', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FP18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Worksheet 3': [
            { scenario: 'FP18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FP18', cycle: '83', country: '0', area: '0.5', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Worksheet 4': [
            { scenario: 'FW18', cycle: '75', country: '90', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FT18', cycle: '05', country: '80', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ]

    };

    /*Triggers the download of a text file simulating content based on selected worksheet and deck.
     * The file is named using the format `${selectedWorksheet}_${selectedDeck}.txt`.
     * Ensures that both selectedWorksheet and selectedDeck are defined before proceeding with the download.*/
    const downloadFile = () => {
        if (selectedWorksheet && selectedDeck) {
            // Simulate file content based on the selected worksheet and deck
            const content = `This is a file for ${selectedWorksheet} and ${selectedDeck}`;

            // Create a Blob from the content and trigger download
            const blob = new Blob([content], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${selectedWorksheet}_${selectedDeck}.txt`; // Adjust file extension as needed
            link.click();
        }
    };

    /* Updates the table data with the variance value, based on whether the worksheet is Worksheet 1 or not.
     * If Worksheet 1, the area value is set to the variance value. 
     * Otherwise, the area value is incremented by the variance value.
     */
    const updateTableDataWithVariance = () => {
        if (selectedWorksheet) {
            const updatedData = sheetContents[selectedWorksheet].map((row) => ({
                ...row,
                area: selectedWorksheet === "Worksheet 1"
                    ? parseFloat(variance).toFixed(1)
                    : (parseFloat(row.area) + parseFloat(variance)).toFixed(1),
            }));
            setTableData(updatedData);
        }
    };

    // Updates the filter state based on user input in the select boxes
    const handleChange = (name) => (event, newValue) => {
        // If "All" is selected, the filter is set to ['All']
        // Otherwise, the selected values are used to update the filter
        setFilters((prev) => ({
            ...prev,
            [name]: newValue.includes('All') ? ['All'] : newValue,
        }));
    };


    // Updates the scenario state based on user input in the select boxes
    const handleScenarioChange = (scenario) => (event, newValue) => {
        // Updates the scenario state with the new selection
        setScenarios((prev) => ({
            ...prev,
            [scenario]: newValue,
        }));
    };

    const handleOption1 = () => {
        // Set a default sheet and display data if no sheet has been selected
        if (!selectedWorksheet) {
            setSelectedWorksheet("Worksheet 1"); // Default sheet
            setTableData(sheetContents["Worksheet 1"]); // Display default table data
        } else {
            updateTableDataWithVariance();
        }
        setIsVarianceVisible(true)
        setIsOption1Clicked(true);
        setIsOption2Clicked(false);
    };

    const handleOption2 = () => {

        setIsOption2Clicked(true); // Show the dropdowns when Option 2 is clicked
        setIsOption1Clicked(false);
    };


    const applyVarianceFilter = () => {
        if (selectedWorksheet) {
            const filteredData = sheetContents[selectedWorksheet].filter(row => parseFloat(row.area) >= parseFloat(variance));
            setTableData(filteredData);
        }
    };

    //Returns a greeting message based on the current time of day
    const getGreetingMessage = () => {
        const hours = new Date().getHours();
        if (hours < 12) return `Good Morning`;
        if (hours < 18) return `Good Afternoon`;
        return `Good Evening`;
    };


    /* Handles changes to the variance input field.
     * Updates the variance state if the input is a valid number or empty */
    const handleVarianceChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue === "" || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
            setVariance(inputValue);
        }
    };

    /* Increment the variance by 0.1 */
    const incrementVariance = () => {
        setVariance((prev) => (parseFloat(prev || "0") + 0.1).toFixed(1));
    };

    /* Decrement the variance by 0.1, but not below 0 */
    const decrementVariance = () => {
        setVariance((prev) => Math.max(0, parseFloat(prev || "0") - 0.1).toFixed(1));
    };

    useEffect(() => {
        const { countries, therapeuticAreas } = filters;

        /* If all countries and all therapeutic areas are selected, set the scenario options to the default */
        if (countries.includes('All') && therapeuticAreas.includes('All')) {
            setScenarioOptions(defaultScenarios);
        } else if (countries.length && therapeuticAreas.length && !countries.includes('All') && !therapeuticAreas.includes('All')) {
            /* If some countries and some therapeutic areas are selected, generate new options based on them */
            const newOptions = countries.flatMap((country) =>
                therapeuticAreas.flatMap((area) =>
                    Array.from({ length: 5 }, (_, i) => `${country} - ${area} - Option ${i + 1}`)
                )
            );
            setScenarioOptions(newOptions);
        } else {
            /* If no countries or therapeutic areas are selected, set the scenario options to empty */
            setScenarioOptions([]);
        }
    }, [filters.countries, filters.therapeuticAreas]);

    useEffect(() => {
        updateTableDataWithVariance();
    }, [variance, selectedWorksheet]);

    useEffect(() => {
        // If both scenarios are selected and a worksheet is selected, update the table data
        if (scenarios.scenario1 && scenarios.scenario2 && selectedWorksheet) {
            setTableData(sheetContents[selectedWorksheet]);
        }
    }, [scenarios.scenario1, scenarios.scenario2, selectedWorksheet]);
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
        let top, left
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
        let top, left, bottom;
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
        closeButton.textContent = currentStep === (isOption1Clicked ? steps2 : isOption2Clicked ? steps3 : steps).length - 1 ? 'Finish' : 'Skip Tutorial';
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
        nextButton.disabled = currentStep === (isOption1Clicked ? steps2 : isOption2Clicked ? steps3 : steps).length - 1 ; // Disable if last step
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
    // useEffect(() => {
    //     if (tutorialActive && currentStep < steps.length) {
    //         showTutorial(steps[currentStep]);
    //     }
    // }, [tutorialActive, currentStep]);

      useEffect(() => {
            if (isOption1Clicked) {
                if (tutorialActive && currentStep < steps2.length) {
                    showTutorial(steps2[currentStep]);
                }
            }
            else if (isOption2Clicked) {
                if (tutorialActive && currentStep < steps3.length) {
                    showTutorial(steps3[currentStep]);
                }
            }
            else {
                if (tutorialActive && currentStep < steps.length) {
                    showTutorial(steps[currentStep]);
                }
            }
        }, [tutorialActive, currentStep]);
    const steps = [
        {
            index: 0,
            target: '.filter1-button',
            content: 'Use these to select your desired scenario.',
            placement: 'right',
        },
        {
            index: 1,
            target: '.filter2-button',
            content: 'Use this button to select your desired scenario option.',
            placement: 'right',
        },
        {
            index: 2,
            target: '.choose-op1-button',
            content: 'Click this button to Compare scenarios.',
            placement: 'right',
        },
        {
            index: 3,
            target: '.choose-op2-button',
            content: 'Click this button to download comparison deck.',
            placement: 'right',
        }
    ];

    const steps2 = [
        {
            index: 0,
            target: '.filter1-button',
            content: 'Use these to select your desired scenario.',
            placement: 'right',
        },
        {
            index: 1,
            target: '.filter2-button',
            content: 'Use this button to select your desired scenario option.',
            placement: 'right',
        },
        {
            index: 2,
            target: '.choose-op1-button',
            content: 'Click this button to Compare scenarios.',
            placement: 'right',
        },
        {
            index: 3,
            target: '.choose-op2-button',
            content: 'Click this button to download comparison deck.',
            placement: 'right',
        },
        {
            index: 4,
            target: '.worksheet-button',
            content: 'Click this button to select a worksheet.',
            placement: 'right',
        },
        {
            index: 5,
            target: '.variance-button',
            content: 'Click this button to change variance.',
            placement: 'left',
        }
    ];
    const steps3 = [
        {
            index: 0,
            target: '.filter1-button',
            content: 'Use these to select your desired scenario.',
            placement: 'right',
        },
        {
            index: 1,
            target: '.filter2-button',
            content: 'Use this button to select your desired scenario option.',
            placement: 'right',
        },
        {
            index: 2,
            target: '.choose-op1-button',
            content: 'Click this button to Compare scenarios.',
            placement: 'right',
        },
        {
            index: 3,
            target: '.choose-op2-button',
            content: 'Click this button to download comparison deck.',
            placement: 'right',
        },
        {
            index: 4,
            target: '.select-worksheet-button',
            content: 'Click this button to select a worksheet.',
            placement: 'right',
        },
        {
            index: 5,
            target: '.select-deck-button',
            content: 'Click this button to change variance.',
            placement: 'right',
        }
    ];

    return (
        <div style={{ backgroundColor: 'white', marginTop: '20px', marginLeft: '10px' }}>
            <Button
                className='tutorial-btn'
                variant="contained"
                size='small'
                sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 0, mr: 2 }}
                onClick={() => handleStartTutorial()}
            >
                Show Tutorial
            </Button>
            <h2>{getGreetingMessage()}, Welcome to the Scenario Comparison Page!</h2>
            <Typography variant="h7" gutterBottom sx={{ marginBottom: '50px' }}>Please select the below options: </Typography>
            <Box className="filter1-button" mr={50} >
                <Box display="flex" gap={2} mb={4} mt={2}>
                {/* Multi-select for Forecast Cycles */}
                <Autocomplete
                    multiple
                    options={['All', '2013-H1', '2013-H2', '2014-H1', '2014-H2']}
                    onChange={handleChange('forecastCycles')}
                    renderInput={(params) => <TextField {...params} size="small" label="Forecast Cycle" />}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    style={{ width: '250px' }}
                />

                {/* Multi-select for Country */}
                <Autocomplete
                    multiple
                    options={['All', 'USA', 'Canada', 'Germany', 'India']}
                    onChange={handleChange('countries')}
                    renderInput={(params) => <TextField {...params} size="small" label="Country" />}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    style={{ width: '250px' }}
                />

                {/* Multi-select for Therapeutic Area */}
                <Autocomplete
                    multiple
                    options={['All', 'Cardiology', 'Oncology', 'Neurology', 'Diabetes']}
                    onChange={handleChange('therapeuticAreas')}
                    renderInput={(params) => <TextField {...params} size="small" label="Therapeutic Area" />}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    style={{ width: '250px' }}
                />
                </Box>
            </Box>
            <Box className="filter2-button" mr={60}  >
                <Box display="flex" gap={2} mb={2} mt={2}>
                    {/* Scenario selectors for Option 1. When a scenario is selected, the data is displayed in the table. */}
                    <Autocomplete
                        options={scenarioOptions}
                        value={scenarios.scenario1}
                        onChange={handleScenarioChange('scenario1')}
                        renderInput={(params) => <TextField {...params} size="small" label="Scenario 1" />}
                        style={{ width: '250px' }}
                    />
                    <Autocomplete
                        options={scenarioOptions}
                        value={scenarios.scenario2}
                        onChange={handleScenarioChange('scenario2')}
                        renderInput={(params) => <TextField {...params} size="small" label="Scenario 2" />}
                        style={{ width: '250px' }}
                    />
                </Box>
            </Box>
            <Box display="flex" gap={2} mb={4} mt={4}>
                {/* Buttons to select between Option 1 and Option 2 */}
                <Button variant="contained" color="primary" onClick={handleOption1} sx={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    fontSize: '0.9rem'
                }}
                className='choose-op1-button'>
                    Option 1
                </Button>

                <Button variant="contained" color="primary" onClick={handleOption2} sx={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    fontSize: '0.9rem'

                }}
                className='choose-op2-button'>
                    Option 2
                </Button>
            </Box>
            

            {isOption2Clicked && (
                // Container for selecting worksheet and comparison deck. Displayed when Option 2 is clicked
                <Box display="flex" flexDirection="column" gap={2} mt={2} mb={4}>
                    <p>Select the worksheet you want to include in the report</p>

                    {/* Label for Worksheet selection */}
                    <p><b>Worksheet</b></p>
                    {/* Autocomplete for selecting a Worksheet */}
                    <Autocomplete
                        options={Object.keys(sheetContents)}
                        onChange={(e, newValue) => setSelectedWorksheet(newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                        style={{ width: '300px' }}
                        className='select-worksheet-button'
                    />

                    {/* Label for Comparison Deck selection */}
                    <p><b>Comparison Deck</b></p>
                    {/* Autocomplete for selecting a Comparison Deck */}
                    <Autocomplete
                        options={['Deck 1', 'Deck 2', 'Deck 3']} // Replace with actual deck names
                        value={selectedDeck}
                        onChange={(e, newValue) => setSelectedDeck(newValue)}
                        renderInput={(params) => <TextField {...params} size="small" />}
                        style={{ width: '300px' }}
                        className='select-deck-button'
                    />
                </Box>
            )}

            {/* Button to trigger file download. Displayed conditionally 
            when Option 2 is selected and both selectedWorksheet and selectedDeck are defined */}
            {isOption2Clicked && selectedWorksheet && selectedDeck && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadFile}
                    sx={{ fontSize: '0.9rem', marginTop: '20px' }}
                >
                    Download File
                </Button>
            )}

            {/* conditionally display Worksheet selection when Option 1 is selected */}
            {isOption1Clicked && (

                <Box display="flex" flexWrap="wrap" gap={4}>
                    {/* Dropdown Select for Worksheet Names */}
                    <FormControl className='worksheet-button'>
                        <InputLabel>Select Worksheet</InputLabel>
                        <Select
                            value={selectedWorksheet}
                            onChange={(e) => setSelectedWorksheet(e.target.value)}
                            label="Select Worksheet"
                        >
                            {Object.keys(sheetContents).map((worksheet) => (
                                <MenuItem key={worksheet} value={worksheet}>
                                    {worksheet}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

            )}



            {/* conditional Table display based on selection of Worksheet */}
            {tableData && isOption1Clicked && (
                <Box flex="1">
                    <Typography variant="h6" sx={{ marginTop: '10px' }}>Variations in {selectedWorksheet}</Typography>
                    {isVarianceVisible && (
                        <Box sx={{ minWidth: '250px', maxWidth: '300px', marginLeft: '900px', marginTop: '-16px' }}>
                            <FormControl className='variance-button' variant="outlined" fullWidth>
                                <InputLabel
                                    htmlFor="variance-input"
                                    sx={{ whiteSpace: 'nowrap', overflow: 'visible' }}
                                >
                                    Variance Greater Than
                                </InputLabel>
                                <OutlinedInput
                                    id="variance-input"
                                    value={variance}
                                    onChange={handleVarianceChange}
                                    size="small"
                                    label="Variance Greater Than"

                                    endAdornment={
                                        <InputAdornment position="end">
                                            {/* Buttons to adjust variance value */}
                                            <IconButton onClick={incrementVariance} size="small">
                                                <Add fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={decrementVariance} size="small">
                                                <Remove fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Box>
                    )}

                    {/* Table contents */}
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table aria-label="table data" size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Cell</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario 1</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario 2</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Variance %</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Active Scenario Modified</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Compare To Modified</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.scenario}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.cycle}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.country}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.area}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.modified}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.user}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </div >
    );
};

export default ScenarioComparsion;