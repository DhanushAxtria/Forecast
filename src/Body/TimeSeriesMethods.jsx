import React, { useState, useEffect } from 'react';
import introJs from 'intro.js';
import {
    Drawer,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    FormControl,
    RadioGroup,
    Radio,
    FormControlLabel,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Button, Snackbar, IconButton, TextField } from '@mui/material';
import { MyContext } from './context';
import { useContext } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import UploadIcon from '@mui/icons-material/Upload';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


const Forecastpage = () => {
    // Retrieve selectedSheet and setSelectedSheet from context for managing selected forecast method
    const { selectedSheet, setSelectedSheet } = useContext(MyContext);
    // State to track which accordion is currently expanded
    const [expandedAccordion, setExpandedAccordion] = useState(null);
    // Context variables from MyContext
    const { historyFromDate, setHistoryFromDate } = useContext(MyContext); // Start date for historical data in datepicker
    const { historyToDate, setHistoryToDate } = useContext(MyContext); // End date for historical data in datepicker
    const { selectedFromDate, setSelectedFromDate } = useContext(MyContext); // Start date for selected data in datepicker
    const { selectedToDate, setSelectedToDate } = useContext(MyContext); // End date for selected data in datepicker
    const { selectedFile, setSelectedFile } = useContext(MyContext); // Selected data for forecasting
    const [HistoricalFrom, setHistoricalFrom] = useState(null); // Start date for historical data
    const [HistoricalTO, setHistoricalTo] = useState(null); // End date for historical data
    const navigate = useNavigate(); // Navigation function
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Whether the snackbar is open or not
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Message to display in the snackbar
    const { setIsCol } = useContext(MyContext); // Whether the data is in column view or row view


    // Reset button
    const handleResetAll = () => {
        setSelectedFile(null);
        setSelectedSheet(null);
        setHistoryFromDate(null);
        setHistoryToDate(null);
        setSelectedFromDate(null);
        setSelectedToDate(null);
    }

    // parse the dates from the data in standard form
    const parseDate = (dateStr) => {
        console.log(dateStr);
        const [monthStr, yearStr] = dateStr.split('-');
        const month = new Date(`${monthStr}-01-2000`).getMonth(); // Get month index
        const year = 2000 + parseInt(yearStr); // Convert to full year
        return new Date(year, month, 1); // Create Date object for the first day of the month
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first file
        if (file) {
            setSelectedFile(file);

            // to get the min and max dates for the historical data

            // Show success Snackbar
            setSnackbarMessage(`File uploaded: ${file.name}`);
            setSnackbarOpen(true);
        }
    };

    // remove the selected data
    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    // value checks
    const handleProceed = async () => {
        if (selectedFile === null && selectedSheet === null) {
            alert("Please upload the data and select the method");
        }
        else if (selectedFile === null && selectedSheet !== null) {
            alert("Please upload the data");
        }
        else if (selectedFile !== null && selectedSheet === null) {
            alert("Please select the method");
        }
        else if (historyToDate === null || historyFromDate === null || selectedFromDate === null || selectedToDate === null) {
            alert("Please select all the dates properly");
        }
        else {
            navigate("/new-model/time-series-model/forecasted_results"); // if all the data is filled, proceed to the results page
        }
    };



    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Methods for forecasting grouped into categories
    const workbooks = {
        "Automated Methods": [
            'Auto ARIMA',
            'ETS',
            'TBATS',
            'STL-ETS',
            'STL-Arima'
        ],
        "Machine Learning Methods": [
            'Neural Networks',
            'Bootstrap Aggregate Arima',
            'Bootstrap Aggregate'
        ],
        "Manual Methods": [
            'Additive Trend-Additive Seasonality',
            'Damped Additive Trend-Additive Seasonality',
            'Additive Trend-Multiplicative Seasonality',
            'Damped Additive Trend-Multiplicative Seasonality',
            'Multiplicative Trend-Additive Seasonality',
            'Damped Multiplicative Trend-Additive Seasonality',
            'Multiplicative Trend-Multiplicative Seasonality',
        ],
        "Benchmark Methods": [
            'Linear Regression',
            'Log Linear Regression',
            'Naive',
            'Seasonal Naive',
            'Holt',
            'Damped Holt',
            'Average'
        ],
    };

    // Handle the selection of a forecast method
    const handleSheetSelect = (event) => {
        setSelectedSheet(event.target.value);
    };

    // Assign distinct colors to different forecast methods for visual distinction
    const getColorForSheet = (index) => {
        const colors = ['#FF5733', '#33A1FF', '#33FF57', '#FF33D1', '#FFC733'];
        return colors[index % colors.length]; // Rotate through color palette
    };

    // Handle accordion toggle to expand/collapse sections
    const handleAccordionToggle = (workbook) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? workbook : null);
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
                    element: '.upload-btn',
                    intro: 'Click here to upload your data file. Please ensure the format of the file matches the required format.',
                    position: 'right',
                },
                {
                    element: '.demo-btn',
                    intro: 'Click here to view the acceptable formats of the file.',
                    position: 'left',
                },
                {
                    element: '.method-btn',
                    intro: 'Click here to select the forecasting method. You can select from various methods such as LR, Log-LR, ARIMA, etc.',
                    position: 'right',
                },
                {
                    element: '.hist-dates-btn',
                    intro: 'Select the historical dates for which you want to forecast the data. The dates should be present in the uploaded file.',
                    position: 'right',
                },
                {
                    element: '.forecast-dates-btn',
                    intro: 'Select the forecasting dates for which you want to forecast the data. The dates should be in the future.',
                    position: 'right',
                },
                {
                    element: '.clear-btn',
                    intro: 'Click here to clear the changes made on the page.',
                    position: 'right',
                },
                {
                    target: '.proceed-btn',
                    intro: 'Click here to proceed to the next step where you can tweak the parameters and see the results.',
                    position: 'right',
                }
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Sidebar Drawer for selecting forecasting methods */}
            <Drawer
                variant="permanent"
                anchor="left"
                PaperProps={{
                    sx: {
                        width: 309,
                        boxSizing: 'border-box',
                        height: 'calc(100vh - 130px)',
                        top: '130px',
                        boxShadow: 'none',
                        overflowY: 'auto',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        borderRight: 'none',
                        zIndex: 10,
                    },
                }}
            >
                <Box className="method-btn" sx={{ padding: 2 }}>
                    {/* Header for the drawer */}
                    <Typography variant="span" gutterBottom>
                        Select Forecast Projection Method
                    </Typography>

                    {/* Accordion for grouping forecast methods */}
                    {Object.keys(workbooks).map((workbook) => (
                        <Accordion
                            key={workbook}
                            expanded={expandedAccordion === workbook}
                            onChange={handleAccordionToggle(workbook)}
                            disableGutters
                        >
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography sx={{ fontSize: '0.875rem' }}>
                                    {workbook}
                                </Typography>
                            </AccordionSummary>

                            {/* Display forecast methods within each group as radio buttons */}
                            <AccordionDetails>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={selectedSheet}
                                        onChange={handleSheetSelect}
                                    >
                                        {workbooks[workbook].map((sheet, index) => (
                                            <FormControlLabel
                                                key={sheet}
                                                value={sheet}
                                                control={<Radio />}
                                                label={
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.8125rem',
                                                            color: getColorForSheet(index),
                                                        }}
                                                    >
                                                        {sheet}
                                                    </Typography>
                                                }
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Drawer>

            {/* Main content area displaying Forecastpagehelper */}
            <Box sx={{ ml: '309px', mt: 2 }}>
                <Box sx={{
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: '-60px',
                }}>
                    {/* File Upload Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Upload historical data
                        </Typography>
                        <Button

                            variant="contained"
                            size='small'
                            sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 3, mr: 2 }}
                            onClick={startTour}
                            className="start-tour-button"
                        >
                            Show Tutorial
                        </Button>
                    </Box>
                    {/* Box with upload button, file name display and clear button */}
                    <Box sx={{ display: 'flex', gap: 2, marginTop: '10px', alignItems: 'center' }}>

                        {/* Upload button with hidden input field */}
                        <Button
                            className='upload-btn'
                            variant="contained"
                            color="primary"
                            component="label"
                            sx={{

                                borderRadius: 1,
                                marginRight: '10px',
                                marginBottom: '5px'
                            }}
                            startIcon={<UploadIcon />}
                        >
                            <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>Upload file</Typography>
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={(event) => handleFileChange(event)}
                            />
                        </Button>


                        {/* Display uploaded file name and clear button */}
                        {selectedFile && (
                            <Typography variant="body2" component="span" fontWeight="bold">
                                <span style={{ color: 'black' }}>Uploaded file: </span>
                                <span style={{ color: 'red' }}>{selectedFile.name}</span>
                            </Typography>
                        )}
                        {selectedFile && <IconButton
                            onClick={handleRemoveFile}
                            sx={{ ml: 1 }}
                        >
                            <ClearIcon />
                        </IconButton>}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, marginTop: '10px', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            {/* The uploaded file should be in either of the two formats: */
                        /* 1. There are only two rows */
                        /* first row for dates and second row for the values corresponds to the dates */
                        /* 2. There are only two columns */
                        /* first column for dates and the second column is for the values corresponds to the dates */}
                            Uploaded file should be in either of the two formats:
                        </Typography>

                        {/* Type 1 format */}

                        <Typography className='demo-btn' variant="subtitle2" component="span" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'blue', textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/demo_file_1.csv';
                                link.setAttribute('download', 'demo_file_1.csv');
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                        >
                            Demo File 1
                        </Typography>

                        {/* Type 2 format */}
                        <Typography className='demo-btn' variant="subtitle2" component="span" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'blue', textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = '/demo_file_2.csv';
                                link.setAttribute('download', 'demo_file_2.csv');
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}>
                            Demo File 2
                        </Typography>
                    </Box>


                    {/* Historical Time Period Section */}
                    <Box className='hist-dates-btn' sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, marginTop: '10px' }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Historical Time Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <DatePicker
                                    label="From"
                                    value={historyFromDate}
                                    onChange={(newValue) => setHistoryFromDate(newValue)}
                                    renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                    views={["year", "month"]}
                                    minDate={HistoricalFrom !== null ? parseDate(HistoricalFrom) : null}
                                    maxDate={HistoricalTO !== null ? parseDate(HistoricalTO) : null}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px' }}

                                />
                                <DatePicker
                                    label="To"
                                    value={historyToDate}
                                    onChange={(newValue) => setHistoryToDate(newValue)}
                                    renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                    views={["year", "month"]}
                                    minDate={HistoricalFrom !== null ? parseDate(HistoricalFrom) : null}
                                    maxDate={HistoricalTO !== null ? parseDate(HistoricalTO) : null}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px' }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Box>

                    {/* Forecast Time Period Section */}
                    <Box className='forecast-dates-btn' sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Forecast Time Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <DatePicker
                                    label="From"
                                    value={selectedFromDate}
                                    onChange={(newValue) => setSelectedFromDate(newValue)}
                                    renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                    views={["year", "month"]}
                                    minDate={historyToDate !== null ? new Date(historyToDate.getFullYear(), historyToDate.getMonth() + 1, 1) : null}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px' }}
                                />
                                <DatePicker
                                    label="To"
                                    value={selectedToDate}
                                    onChange={(newValue) => setSelectedToDate(newValue)}
                                    renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                    views={["year", "month"]}
                                    minDate={selectedFromDate !== null ? new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1) : null}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px' }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Box>

                    {/* Button Container */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, marginTop: '20px' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button className='proceed-btn' variant="contained" color="primary" onClick={handleProceed} sx={{ fontSize: '0.8rem' }}>
                                Proceed
                            </Button>
                            <Button
                                className='clear-btn'
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
                                        handleResetAll();
                                    }
                                }}
                                sx={{ fontSize: '0.8rem' }}>
                                Clear All Data
                            </Button>
                        </Box>
                    </Box>

                </Box>

                {/* Snackbar for file upload */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000} // 3 seconds
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                    action={
                        <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
                            <CheckCircleIcon style={{ color: 'green' }} />
                        </IconButton>
                    }
                />
            </Box>
        </Box>
    );
};

export default Forecastpage;