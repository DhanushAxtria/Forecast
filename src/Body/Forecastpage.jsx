import React, { useState } from 'react';
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
import { MyContext } from './context';
import { useContext } from 'react';
import Forecastpagehelper from './Forecastpagehelper';

const Admin = () => {
    // Retrieve selectedSheet and setSelectedSheet from context for managing selected forecast method
    const { selectedSheet, setSelectedSheet } = useContext(MyContext);

    // State to track which accordion is currently expanded
    const [expandedAccordion, setExpandedAccordion] = useState(null);

    // Methods for forecasting grouped into categories
    const workbooks = {
        "Automated Methods": ['Auto ARIMA', 'ETS', 'TBATS', 'STL-ETS', 'STL-Arima'],
        "Machine Learning Methods": ['Neural Networks', 'Bootstrap Aggregate Arima', 'Bootstrap Aggregate'],
        "Manual Methods": [
            'Additive Trend-Additive Seasonality',
            'Damped Additive Trend-Additive Seasonality',
            'Additive Trend-Multiplicative Seasonality',
            'Damped Additive Trend-Multiplicative Seasonality',
            'Multiplicative Trend-Additive Seasonality',
            'Damped Multiplicative Trend-Additive Seasonality',
            'Multiplicative Trend-Multiplicative Seasonality',
        ],
        "Benchmark Methods": ['Linear Regression', 'Log Linear Regression', 'Naive', 'Seasonal Naive', 'Holt', 'Damped Holt', 'Average'],
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
                <Box sx={{ padding: 2 }}>
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
                <Forecastpagehelper />
            </Box>
        </Box>
    );
};

export default Admin;