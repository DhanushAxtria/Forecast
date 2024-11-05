// ScenarioFilterPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, Box, Checkbox, ListItemText, Button, Typography, Drawer,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './Newpage.scss';

const ScenarioFilterPage = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        forecastCycles: [],
        countries: [],
        therapeuticAreas: [],
    });

    const [scenarios, setScenarios] = useState({
        scenario1: null,
        scenario2: null,
    });

    const [scenarioOptions, setScenarioOptions] = useState([]); // Options for Scenarios
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [sheetData, setSheetData] = useState(null);
    const [isDrawerOpen, setDrawerOpen] = useState(false); // State to control drawer visibility
    // Default scenarios to show when "All" is selected in both filters
    const defaultScenarios = [
        'Scenario A - Option 1',
        'Scenario B - Option 2',
        'Scenario C - Option 3',
        'Scenario D - Option 4',
        'Scenario E - Option 5',
        'Scenario F - Option 6',
    ];
    const excelSheets = ['Sheet1', 'Sheet2', 'Sheet3', 'Sheet4'];
    // Simulated data for each sheet (replace with real data as needed)
    const sheetContents = {
        Sheet1: [
            { scenario: 'FN18', cycle: '55', country: '55.3', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FO18', cycle: '74', country: '74.1', area: '0.1', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'Fp18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        Sheet2: [
            { scenario: 'FN18', cycle: '55', country: '55.3', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FP18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        Sheet3: [
            { scenario: 'FP18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FP18', cycle: '83', country: '0', area: '0.5', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        Sheet4: [
            { scenario: 'FW18', cycle: '75', country: '90', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FT18', cycle: '05', country: '80', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },

                    ],
    };
    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    const openDrawer = () => {
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
    };

    const selectSheet = (sheet) => {
        setSelectedSheet(sheet);
        setSheetData(sheetContents[sheet]); // Set selected sheet data for display
        closeDrawer();
    };
    const handleChange = (name) => (event, newValue) => {
        setFilters((prev) => ({
            ...prev,
            [name]: newValue.includes('All') ? ['All'] : newValue, // Keep 'All' if selected
        }));
    };

    const handleScenarioChange = (scenario) => (event, newValue) => {
        setScenarios((prev) => ({
            ...prev,
            [scenario]: newValue,
        }));
    };

    const handleConfirm = () => {
        navigate('/country-and-therapeutic-select', { state: { filters, scenarios } });
    };

    const getGreetingMessage = () => {
        const hours = new Date().getHours();
        if (hours < 12) return `Good Morning`;
        if (hours < 18) return `Good Afternoon`;
        return `Good Evening`;
    };

    // Update scenario options based on selected countries and therapeutic areas
    useEffect(() => {
        const { countries, therapeuticAreas } = filters;

        if (countries.includes('All') && therapeuticAreas.includes('All')) {
            setScenarioOptions(defaultScenarios);
        } else if (countries.length && therapeuticAreas.length && !countries.includes('All') && !therapeuticAreas.includes('All')) {
            const newOptions = countries.flatMap((country) =>
                therapeuticAreas.flatMap((area) =>
                    Array.from({ length: 5 }, (_, i) => `${country} - ${area} - Option ${i + 1}`)
                )
            );
            setScenarioOptions(newOptions);
        } else {
            setScenarioOptions([]);
        }
    }, [filters.countries, filters.therapeuticAreas]);

    // Automatically open the modal when both Scenario 1 and Scenario 2 are selected
    useEffect(() => {
        if (scenarios.scenario1 && scenarios.scenario2) {
            openDrawer();
        }
    }, [scenarios.scenario1, scenarios.scenario2]);

    return (
        <div style={{ padding: '20px', marginTop: '-44px' }}>
            <h2>{getGreetingMessage()}, Please select a scenario to continue</h2>
            <Box display="flex" gap={2} mb={4}>
                <Autocomplete
                    className="filter-box"
                    multiple
                    options={['All', '2013-H1', '2013-H2', '2014-H1', '2014-H2']}
                    onChange={handleChange('forecastCycles')}
                    renderInput={(params) => <TextField {...params} label="Forecast Cycle" />}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    style={{ width: '250px' }}
                />
                <Autocomplete
                    className="filter-box"
                    multiple
                    options={['All', 'USA', 'Canada', 'Germany', 'India']}
                    onChange={handleChange('countries')}
                    renderInput={(params) => <TextField {...params} label="Country" />}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    style={{ width: '250px' }}
                />
                <Autocomplete
                    className="filter-box"
                    multiple
                    options={['All', 'Cardiology', 'Oncology', 'Neurology', 'Diabetes']}
                    onChange={handleChange('therapeuticAreas')}
                    renderInput={(params) => <TextField {...params} label="Therapeutic Area" />}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    style={{ width: '250px' }}
                />
            </Box>

            {/* New "Compare active Scenario to" Section */}
            <Typography variant="h6" gutterBottom>Compare active Scenario to:</Typography>
            <Box display="flex" gap={2} mb={4}>
                <Autocomplete
                    className="filter-box"
                    options={scenarioOptions}
                    value={scenarios.scenario1}
                    onChange={handleScenarioChange('scenario1')}
                    renderInput={(params) => <TextField {...params} label="Scenario 1" />}
                    style={{ width: '250px' }}
                />
                <Autocomplete
                    className="filter-box"
                    options={scenarioOptions}
                    value={scenarios.scenario2}
                    onChange={handleScenarioChange('scenario2')}
                    renderInput={(params) => <TextField {...params} label="Scenario 2" />}
                    style={{ width: '250px' }}
                />
            </Box>

            <Button variant="contained" color="primary" onClick={handleConfirm}>
                Compare
            </Button>
            <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
                <Box p={2} width="250px" role="presentation">
                    <Typography variant="h6">Select an Excel Sheet</Typography>
                    {excelSheets.map((sheet) => (
                        <Button
                            key={sheet}
                            onClick={() => selectSheet(sheet)}
                            style={{ display: 'block', margin: '10px 0' }}
                        >
                            {sheet}
                        </Button>
                    ))}
                    <Button onClick={closeDrawer} color="secondary" style={{ marginTop: '20px' }}>Close</Button>
                </Box>
            </Drawer>
            {/* Display selected sheet data */}
            {selectedSheet && (
                <Box mt={4}>
                    <Typography variant="h6">Data from {selectedSheet}</Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table aria-label="selected sheet data table" size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold',padding: '6px', textAlign: 'center'  }}>Cell</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold',padding: '6px', textAlign: 'center'  }}>Active Scenario Value</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold',padding: '6px', textAlign: 'center'  }}>Compare To Scenario</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold',padding: '6px', textAlign: 'center'  }}>Variance</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold',padding: '6px', textAlign: 'center'  }}>Active Scenario Modified</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold',padding: '6px', textAlign: 'center' }}>Compare To Modified</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sheetData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.scenario}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.cycle}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.country}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.area}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.modified}</TableCell>
                                        <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.user}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
        </div>
    );
};

export default ScenarioFilterPage;
