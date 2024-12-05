import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, Snackbar, IconButton } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../Body/context';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import UploadIcon from '@mui/icons-material/Upload';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Papa from 'papaparse';


const LinearRegression = ({ handleAddDrugClick }) => {
    const { historyFromDate, setHistoryFromDate } = useContext(MyContext);
    const { historyToDate, setHistoryToDate } = useContext(MyContext);
    const { selectedFromDate, setSelectedFromDate } = useContext(MyContext);
    const { selectedToDate, setSelectedToDate } = useContext(MyContext);
    const [FileName, setFileName] = useState("");
    const { selectedFile, setSelectedFile } = useContext(MyContext);
    const { selectedSheet, setSelectedSheet } = useContext(MyContext);
    const { ForecastedValue, setForecastValue } = useContext(MyContext);
    const { ParsedData, setParsedData } = useContext(MyContext);
    const [HistoricalFrom, setHistoricalFrom] = useState(null);
    const [HistoricalTO, setHistoricalTo] = useState(null);
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'
    const { isCol, setIsCol } = useContext(MyContext);
    const { met, setMet } = useContext(MyContext);




    const handleResetAll = () => {
        setSelectedFile(null);
        setSelectedSheet(null);
        setHistoryFromDate(null);
        setHistoryToDate(null);
        setSelectedFromDate(null);
        setSelectedToDate(null);
    }

    const parseDate = (dateStr) => {
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
                        setIsCol(false);
                        // Assuming the first row is the header
                        setHistoricalFrom(result.data[0][0]);
                        setHistoricalTo(result.data[0][result.data[0].length - 1]);
                    }
                    else {
                        setIsCol(true);
                        setHistoricalFrom(result.data[0][0]);
                        setHistoricalTo(result.data[result.data.length - 1][0]);
                    }
                },
                skipEmptyLines: true,
            });

            setFileName(file.name);

            // Show success Snackbar
            setSnackbarMessage(`File uploaded: ${file.name}`);
            setSnackbarType('success');
            setSnackbarOpen(true);
        }
    };


    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileName("");
    };

    const handleSave = async () => {
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

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('selectedSheet', selectedSheet);
            formData.append('historyFromDate', historyFromDate);
            formData.append('historyToDate', historyToDate);
            formData.append('selectedFromDate', selectedFromDate);
            formData.append('selectedToDate', selectedToDate);
            console.log("dataaa", selectedFile);
            setLoading(true);
            try {
                const response = await axios.post('https://fast-api-forecast.onrender.com/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setLoading(false);
                setForecastValue(response.data.forecast);
                setParsedData(response.data.dt);
                console.log(response.data.metrices);
                setMet(response.data.metrices);
                console.log("dateee", response.data.historyFromDate);
                console.log("dateee", response.data.historyToDate);
                console.log("dateee", response.data.selectedFromDate);
                console.log("dateee", response.data.selectedToDate);
                if (selectedFile !== null && selectedSheet !== null) {
                    navigate("/admin/forecasted_results");
                }
            } catch (error) {
                setLoading(false);
                alert("Please upload the correct data");
                console.error('Error uploading file:', error);
            }

        }
    };

    const handleClose = () => {
        console.log("Close button clicked");
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
                <Box sx={{ display: 'flex', gap: 2, marginTop: '10px', alignItems: 'center' }}>

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
                        <Typography variant="caption">Upload file</Typography>
                        <input
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={(event) => handleFileChange(event)}
                        />
                    </Button>

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
                        Uploaded file should be in either of the two formats:
                    </Typography>
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

                            />
                            <DatePicker
                                label="To"
                                value={historyToDate}
                                onChange={(newValue) => setHistoryToDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                views={["year", "month"]}
                                minDate={HistoricalFrom !== null ? parseDate(HistoricalFrom) : null}
                                maxDate={HistoricalTO !== null ? parseDate(HistoricalTO) : null}
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

                            />
                            <DatePicker
                                label="To"
                                value={selectedToDate}
                                onChange={(newValue) => setSelectedToDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                views={["year", "month"]}
                                minDate={selectedFromDate !== null ? new Date(selectedFromDate.getFullYear(), selectedFromDate.getMonth(), 1) : null}

                            />
                        </Box>
                    </LocalizationProvider>
                </Box>

                {/* Button Container */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontSize: '0.8rem' }}>
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
                        <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ fontSize: '0.8rem' }}>
                            Close
                        </Button>

                    </Box>
                </Box>

            </Box>

            {Loading &&
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress />
                        <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', marginTop: 2 }}>
                            Please wait while the model is working on your data.
                        </Typography>
                    </Box>
                </Box>
            }
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

export default LinearRegression;