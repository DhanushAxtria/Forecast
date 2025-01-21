import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box, Checkbox, ListItemText, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment, List, ListItemButton, ListItemIcon, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Select, MenuItem } from '@mui/material';
import './Newpage.scss';
import introJs from 'intro.js';


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
        const steps1 = [
            {
                element: '.filter1-button',
                intro: 'Use these to select your desired scenario.',
            },
            {
                element: '.filter2-button',
                intro: 'Use this button to select your desired scenario option.',
            },
            {
                element: '.choose-op1-button',
                intro: 'Click this button to Compare scenarios.',
            },
            {
                element: '.choose-op2-button',
                intro: 'Click this button to download comparison deck.',
            }
        ];
        const steps2 = [
            {
                element: '.filter1-button',
                intro: 'Use these to select your desired scenario.',
            },
            {
                element: '.filter2-button',
                intro: 'Use this button to select your desired scenario option.',
            },
            {
                element: '.choose-op1-button',
                intro: 'Click this button to Compare scenarios.',
            },
            {
                element: '.choose-op2-button',
                intro: 'Click this button to download comparison deck.',
            },
            {
                element: '.worksheet-button',
                intro: 'Click this button to select a worksheet.',
            },
            {
                element: '.variance-button',
                intro: 'Click this button to change variance.',
            }
        ];
        const steps3 = [
            {
                element: '.filter1-button',
                intro: 'Use these to select your desired scenario.',
            },
            {
                element: '.filter2-button',
                intro: 'Use this button to select your desired scenario option.',
            },
            {
                element: '.choose-op1-button',
                intro: 'Click this button to Compare scenarios.',
            },
            {
                element: '.choose-op2-button',
                intro: 'Click this button to download comparison deck.',
            },
            {
                element: '.select-worksheet-button',
                intro: 'Click this button to select a worksheet.',
            },
            {
                element: '.select-deck-button',
                intro: 'Click this button to change variance.',
            }
        ];
        intro.setOptions({
            steps : isOption1Clicked ? steps2 : isOption2Clicked ? steps3 : steps1,
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
                    showTutorial2(); // Start the second tour
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
        <div style={{ backgroundColor: 'white', marginTop: '20px', marginLeft: '10px' }}>
            <Button
                className='start-tour-button'
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