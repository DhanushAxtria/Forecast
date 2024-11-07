// Footer.js
import React, { useState } from 'react';
import { Box, Typography, FormControl, RadioGroup, FormLabel, Radio, FormControlLabel, TextField,Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Footer = () => {
    const [selectedOption, setSelectedOption] = useState('History'); // State to track selected radio button
    const [historyFromDate, setHistoryFromDate] = useState(null);
    const [historyToDate, setHistoryToDate] = useState(null);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const handleSave = () => {
        // Add save logic here
        console.log("Save button clicked with dates:", { fromDate, toDate });
    };

    const handleClose = () => {
        // Add close logic here
        console.log("Close button clicked");
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <Box sx={{
            padding: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginTop:'-80px', // Move layout slightly up
        }}>
            <Typography variant="subtitle1" gutterBottom>
                Source Time Range, Selected Data Count
            </Typography>

            {/* Radio buttons for History and Selected */}
            <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.9rem', mb: 1 }}>Select Option</FormLabel>
                <RadioGroup
                    value={selectedOption}
                    onChange={handleOptionChange}
                    sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
                >
                    <FormControlLabel value="History" control={<Radio />} label="History" />
                    <FormControlLabel value="Selected" control={<Radio />} label="Selected" />
                </RadioGroup>
            </FormControl>

            {/* Conditionally Rendered Date Pickers */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                {selectedOption === 'History' ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <FormLabel component="legend" sx={{ fontSize: '0.9rem' }}>History</FormLabel>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DatePicker
                                label="From"
                                value={historyFromDate}
                                onChange={(newValue) => setHistoryFromDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                            <DatePicker
                                label="To"
                                value={historyToDate}
                                onChange={(newValue) => setHistoryToDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                        <FormLabel component="legend" sx={{ fontSize: '0.9rem' }}>Selected</FormLabel>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <DatePicker
                                label="From"
                                value={selectedFromDate}
                                onChange={(newValue) => setSelectedFromDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                            <DatePicker
                                label="To"
                                value={selectedToDate}
                                onChange={(newValue) => setSelectedToDate(newValue)}
                                renderInput={(params) => <TextField {...params} size="small" />}
                            />
                        </Box>
                    </Box>
                )}
            </LocalizationProvider>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Box>
        </Box>
    );
};

export default Footer;
