import React, { useState, useContext } from 'react';
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

const LinearRegression = ({ handleAddDrugClick }) => {
    const [historyFromDate, setHistoryFromDate] = useState(null);
    const [historyToDate, setHistoryToDate] = useState(null);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [FileName, setFileName] = useState("");
    const { selectedFile, setSelectedFile } = useContext(MyContext);
    const { selectedSheet, setSelectedSheet } = useContext(MyContext);
    const { ForecastedValue, setForecastValue } = useContext(MyContext);
    const { ParsedData, setParsedData } = useContext(MyContext);
    //const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState('success'); // 'success' or 'error'

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first file
        if (file) {
            setSelectedFile(file);
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
            // setloading(true);
            // {
            //     loading &&
            //     <Box sx={{ width: '100%' }}>
            //         <LinearProgress />
            //     </Box>
            // }
            try {
                const response = await axios.post('https://fast-api-forecast.onrender.com/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                // setloading(false);
                setForecastValue(response.data.forecast);
                setParsedData(response.data.dt);
                console.log("dateee", response.data.historyFromDate);
                console.log("dateee", response.data.historyToDate);
                console.log("dateee", response.data.selectedFromDate);
                console.log("dateee", response.data.selectedToDate);
                if (selectedFile !== null && selectedSheet !== null) {
                    navigate("/forecasted_results");
                }
            } catch (error) {
                // setloading(false);
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
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        component="label"
                        sx={{
                            borderRadius: 1,
                            marginRight: '10px',
                            marginBottom: '10px'
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
                            <span style={{ color: 'red' }}>{FileName}</span>
                        </Typography>
                    )}
                    {selectedFile && <IconButton
                        onClick={handleRemoveFile}
                        sx={{ ml: 1 }}
                    >
                        <ClearIcon />
                    </IconButton>}
                </Box>


                {/* Historical Time Period Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
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
                            />
                            <DatePicker
                                label="To"
                                value={historyToDate}
                                onChange={(newValue) => setHistoryToDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                views={["year", "month"]}
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
                            />
                            <DatePicker
                                label="To"
                                value={selectedToDate}
                                onChange={(newValue) => setSelectedToDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                                views={["year", "month"]}
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
                        <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ fontSize: '0.8rem' }}>
                            Close
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

export default LinearRegression;