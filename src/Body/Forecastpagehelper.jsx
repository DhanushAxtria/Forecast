import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Snackbar, IconButton } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './context';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import UploadIcon from '@mui/icons-material/Upload';
import Papa from 'papaparse';


const Forecastpagehelper = () => {
    // Context variables from MyContext
    const { historyFromDate, setHistoryFromDate } = useContext(MyContext); // Start date for historical data in datepicker
    const { historyToDate, setHistoryToDate } = useContext(MyContext); // End date for historical data in datepicker
    const { selectedFromDate, setSelectedFromDate } = useContext(MyContext); // Start date for selected data in datepicker
    const { selectedToDate, setSelectedToDate } = useContext(MyContext); // End date for selected data in datepicker
    const { selectedFile, setSelectedFile } = useContext(MyContext); // Selected data for forecasting
    const { selectedSheet, setSelectedSheet } = useContext(MyContext); // Selected method in the file
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
            Papa.parse(file, {
                complete: (result) => {
                    if (result.data && result.data.length > 0 && result.data[0].length > 2) {
                        setIsCol(false); // data is in row format
                        setHistoricalFrom(result.data[0][0]);
                        setHistoricalTo(result.data[0][result.data[0].length - 1]);
                    }
                    else {
                        setIsCol(true); // data is in col format
                        setHistoricalFrom(result.data[0][0]);
                        setHistoricalTo(result.data[result.data.length - 1][0]);
                    }
                },
                skipEmptyLines: true,
            });
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
            navigate("/time-series-methods/forecasted_results"); // if all the data is filled, proceed to the results page
        }
    };



    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Box sx={{
                padding: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginTop: '-60px',
            }}>
                {/* File Upload Status */}
                <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '20px' }}>
                    Upload historical data
                </Typography>
                {/* Box with upload button, file name display and clear button */}
                <Box sx={{ display: 'flex', gap: 2, marginTop: '10px', alignItems: 'center' }}>

                    {/* Upload button with hidden input field */}
                    <Button
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
                    <Typography variant="subtitle2" component="span" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'blue', textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
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
                    <Typography variant="subtitle2" component="span" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'blue', textDecoration: 'underline', '&:hover': { cursor: 'pointer' } }}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, marginTop: '10px' }}>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                        <Button variant="contained" color="primary" onClick={handleProceed} sx={{ fontSize: '0.8rem' }}>
                            Proceed
                        </Button>
                        <Button
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
        </>
    );
};
export default Forecastpagehelper;
