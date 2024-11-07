import React, { useState } from 'react';
import { Drawer, Accordion, AccordionSummary, AccordionDetails, Typography, Box, FormControl, RadioGroup, Radio, FormControlLabel, Button, Checkbox, List, ListItem, IconButton } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '../Footer/Forecastpage_footer';

const SidePanel = () => {
    const [selectedWorkbook, setSelectedWorkbook] = useState(null); // Track selected workbook
    const [selectedSheet, setSelectedSheet] = useState(null); // Track selected sheet
    const [expandedAccordion, setExpandedAccordion] = useState(null); // Track which accordion is expanded
    const [drugDrawerOpen, setDrugDrawerOpen] = useState(false); // State to open/close drug drawer
    const [selectedDrugs, setSelectedDrugs] = useState([]); // Track selected drugs
    const [selectAll, setSelectAll] = useState(false); // Track select all option for drugs

    // Sample list of drugs
    const drugs = ['Aspirin', 'Ibuprofen', 'Paracetamol', 'Metformin', 'Amoxicillin'];

    const workbooks = {
        "Automated Methods": ['Auto ARIMA', 'ETS', 'TBATS', 'STL-ETS', 'STL-Arima'],
        "Machine Learning Methods": ['Neural Networks', 'Bootstrap Aggregate Arima', 'Bootstrap Aggregate'],
        "Manual Methods": ['Additive Trend-Additive Seasonality', 'Damped Additive Trend-Additive Seasonality', 'Additive Trend-Multiplicative Seasonality', 'Damped Additive Trend-Multiplicative Seasonality', 'Multiplicative Trend-Additive Seasonality', 'Damped Multiplicative Trend-Additive Seasonality', 'Multiplicative Trend-Multiplicative Seasonality'],
        "Benchmark Methods": ['Linear Regression', 'Log Linear Regression', 'Naive', 'Seasonal Naive', 'Holt', 'Damped Holt', 'Average']
    };

    const handleWorkbookSelect = (event) => {
        setSelectedWorkbook(event.target.value);
        setSelectedSheet(null);
    };

    const handleSheetSelect = (event) => {
        setSelectedSheet(event.target.value);
    };

    const handleAccordionToggle = (workbook) => (event, isExpanded) => {
        setExpandedAccordion(isExpanded ? workbook : null);
    };

    const handleAddDrugClick = () => {
        setDrugDrawerOpen(true); // Open the drug drawer
    };

    const handleDrawerClose = () => {
        setDrugDrawerOpen(false); // Close the drug drawer
    };

    const handleDrugToggle = (drug) => {
        setSelectedDrugs((prevSelectedDrugs) => {
            if (prevSelectedDrugs.includes(drug)) {
                return prevSelectedDrugs.filter((d) => d !== drug); // Deselect the drug
            } else {
                return [...prevSelectedDrugs, drug]; // Select the drug
            }
        });
    };

    const handleSelectAllToggle = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedDrugs(drugs); // Select all drugs
        } else {
            setSelectedDrugs([]); // Deselect all drugs
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            {/* Add Drug Button in Top-Right Corner */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAddDrugClick}>
                    Add Drug
                </Button>
            </Box>

            {/* Side Drawer */}
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
                    },
                }}
            >
                <Box sx={{ padding: 2 }}>
                    <Typography variant="span" gutterBottom>
                        Select Forecast Projection Method
                    </Typography>

                    {/* RadioGroup for single selection of workbooks */}
                    <FormControl component="fieldset">
                        <RadioGroup
                            sx={{ marginTop: '10px', marginLeft: '-5px' }}
                            value={selectedWorkbook}
                            onChange={handleWorkbookSelect}
                        >
                            {Object.keys(workbooks).map((workbook) => (
                                <Accordion
                                    key={workbook}
                                    expanded={expandedAccordion === workbook}
                                    onChange={handleAccordionToggle(workbook)}
                                    disableGutters
                                >
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <FormControlLabel
                                            value={workbook}
                                            control={<Radio />}
                                            label={<span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{workbook}</span>}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </AccordionSummary>

                                    {/* Show sheets as radio options if the accordion is expanded */}
                                    <AccordionDetails>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                value={selectedSheet}
                                                onChange={handleSheetSelect}
                                            >
                                                {workbooks[workbook].map((sheet) => (
                                                    <FormControlLabel
                                                        key={sheet}
                                                        value={sheet}
                                                        control={<Radio />}
                                                        label={<span style={{ fontSize: '0.8125rem' }}>{sheet}</span>}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Drawer>

            {/* Footer positioned below the Drawer */}
            <Box sx={{ ml: '309px', mt: 2 }}>
                <Footer />
            </Box>

            {/* Right Side Drug List Drawer */}
            <Drawer anchor="right" open={drugDrawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 300, padding: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Select Drugs</Typography>
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        <ListItem>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAllToggle}
                                    />
                                }
                                label="Select All Drugs"
                            />
                        </ListItem>
                        {drugs.map((drug) => (
                            <ListItem key={drug}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedDrugs.includes(drug)}
                                            onChange={() => handleDrugToggle(drug)}
                                        />
                                    }
                                    label={drug}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default SidePanel;
