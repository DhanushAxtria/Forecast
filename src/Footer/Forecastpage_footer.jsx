import React, { useState } from 'react';
import { Box, Typography, FormControl, TextField, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {IconButton,
        Tooltip} from '@mui/material';

const Footer = ({ handleAddDrugClick }) => {
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

            {/* Historical Time Period Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                    Historical Time Period
                    <Tooltip title="Upload file" marginLeft="20px">
                                    <IconButton color="primary"component="label" sx={{ position: 'relative', zIndex: 1 }}>
                                    <CloudUploadIcon fontSize="small" />
                                        <input type="file" hidden style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, zIndex: 2 }} />
                                    </IconButton>
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
