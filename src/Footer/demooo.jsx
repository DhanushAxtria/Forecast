import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import { MyContext } from '../Body/context';

const LinearRegression = ({ handleAddDrugClick }) => {
    const [historyFromDate, setHistoryFromDate] = useState(null);
    const [historyToDate, setHistoryToDate] = useState(null);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [ForecastedValue, setForecastValue] = useState(null);
    const [FileName, setFileName] = useState("");
    const {selectedFile, setSelectedFile} = useContext(MyContext);
    const {selectedSheet, setSelectedSheet} = useContext(MyContext);
    const navigate = useNavigate();




    useEffect(() => {
        console.log('selectedFile', selectedFile);
        return () => {
        }
    }, [selectedFile])
    useEffect(() => {
        console.log('selectedFile', ForecastedValue);
        return () => {
        }
    }, [ForecastedValue])
    useEffect(() => {
        if (ForecastedValue !== null) {
            navigate('/linearregression', {
                state: {
                    ForecastedValue
                }
            });
        }
        return () => {
        }
    }, [ForecastedValue])





    const parseCSV = (csv) => {
        const lines = csv.trim().split('\n');  // Split CSV into lines
        const headers = lines[0].split(',');  // The first line contains headers

        // Parse each line after the header and create an object for each row
        return lines.slice(1).map((line) => {
            const values = line.split(',');
            const row = { HCP: values[0] };  // First column is HCP
            headers.slice(1).forEach((header, index) => {
                row[header] = parseInt(values[index + 1], 10);  // Parse month values
            });
            return row;
        });
    };

    
    const handleFileChange = (event) => {
        const file = event.target.files[0];  // Get the first file
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const csvContent = reader.result;
                const parsedData = parseCSV(csvContent);
                setSelectedFile(parsedData);  // Set the parsed data to state
            };
            reader.readAsText(file);  // Read the file as text
        }
    };
    




    const handleSave = async () => {
        if (selectedFile === null && selectedSheet === null) {
            alert("Please upload the data and select the method");
        }
        else if (selectedFile === null && selectedSheet !== null){
            alert("Please upload the data");
        }
        else if (selectedFile !== null && selectedSheet === null){
            alert("select the method");
        }
        else {
            try {
                const response = await axios.post('http://127.0.0.1:8000/upload', {
                    data: selectedFile,
                    historyFromDate: historyFromDate,
                    historyToDate: historyToDate,
                    selectedFromDate: selectedFromDate,
                    selectedToDate: selectedToDate,

                });
                setForecastValue(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    }


    const handleClose = () => {
        console.log("Close button clicked");
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
                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '1rem' }}>
                    Source Time Range, Selected Data Count
                </Typography>

                {/* Historical Time Period Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                        Historical Time Period
                        <Tooltip title="Upload file" marginLeft="20px">
                            <IconButton color="primary" component="label" sx={{ position: 'relative', zIndex: 1 }}>
                                <CloudUploadIcon fontSize="small" />
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(event) => {
                                        handleFileChange(event);
                                        const fileName = event.target.files[0]?.name;
                                        if (fileName) {
                                            setFileName(fileName);
                                        }
                                    }}
                                    hidden
                                    style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, zIndex: 2 }}
                                />
                            </IconButton>
                            {selectedFile !== null && <p>
                                <span style={{ color: 'black' }}>uploaded file: </span>
                                <span style={{ color: 'red' }}>{FileName}</span>
                            </p>}
                        </Tooltip>
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
                    <Button variant="contained" color="primary" onClick={handleAddDrugClick} sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Add Drug
                    </Button>

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
        </>
    );
};

export default LinearRegression;
