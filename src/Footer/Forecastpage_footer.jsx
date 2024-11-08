import React, { useState } from 'react';
import { Box, Typography, FormControl, RadioGroup, FormLabel, Radio, FormControlLabel, TextField, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Footer = ({ handleAddDrugClick }) => { // Receive handleAddDrugClick as prop
    const [selectedOption, setSelectedOption] = useState('History');
    const [historyFromDate, setHistoryFromDate] = useState(null);
    const [historyToDate, setHistoryToDate] = useState(null);
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);

    const handleSave = () => {
        console.log("Saved History:", { historyFromDate, historyToDate });
        console.log("Saved Selection:", { selectedFromDate, selectedToDate });
    };

    const handleClose = () => {
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
            marginTop: '-60px',
        }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontSize: '1rem' }}>
                Source Time Range, Selected Data Count
            </Typography>

            {/* Radio buttons for History and Selected */}
            <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '1rem', mb: 1 }}>Select Option</FormLabel>
                <RadioGroup
                    value={selectedOption}
                    onChange={handleOptionChange}
                    sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
                >
                    <FormControlLabel
                        value="Historical Data"
                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }} />}
                        label={<Typography sx={{ fontSize: '0.9rem' }}>Historical Data</Typography>}
                    />
                    <FormControlLabel
                        value="Selection Data"
                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: '1rem' } }} />}
                        label={<Typography sx={{ fontSize: '0.9rem' }}>Selection Data</Typography>}
                    />
                </RadioGroup>
            </FormControl>

            {/* History Date Pickers */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>Historical Data</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <DatePicker
                            label="From"
                            value={historyFromDate}
                            onChange={(newValue) => setHistoryFromDate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                            disabled={selectedOption !== 'Historical Data'}
                        />
                        <DatePicker
                            label="To"
                            value={historyToDate}
                            onChange={(newValue) => setHistoryToDate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                            disabled={selectedOption !== 'Historical Data'}
                        />
                    </Box>
                </LocalizationProvider>
            </Box>

            {/* Selected Date Pickers */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>Selection Data</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <DatePicker
                            label="From"
                            value={selectedFromDate}
                            onChange={(newValue) => setSelectedFromDate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                            disabled={selectedOption !== 'Selection Data'}
                        />
                        <DatePicker
                            label="To"
                            value={selectedToDate}
                            onChange={(newValue) => setSelectedToDate(newValue)}
                            renderInput={(params) => <TextField {...params} size="small" sx={{ fontSize: '0.7rem' }} />}
                            disabled={selectedOption !== 'Selection Data'}
                        />
                    </Box>
                </LocalizationProvider>
            </Box>

            {/* Button Container */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {/* Add Drug Button */}
                <Button variant="contained" color="primary" onClick={handleAddDrugClick} sx={{ fontSize: '0.8rem', mb: 1 }}>
                    Add Drug
                </Button>
                
                {/* Save and Close Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ fontSize: '0.8rem' }}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ fontSize: '0.8rem' }}>
                        Close
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Footer;
