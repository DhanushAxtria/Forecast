import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box, Checkbox, ListItemText, Button, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, InputAdornment, List, ListItemButton, ListItemIcon,FormControl, InputLabel, OutlinedInput} from '@mui/material';
import { Add, Remove, ExpandMore } from '@mui/icons-material';
import { Folder, InsertDriveFile } from '@mui/icons-material';
import './Newpage.scss';

const ScenarioFilterPage = () => {
    const [filters, setFilters] = useState({
        forecastCycles: [],
        countries: [],
        therapeuticAreas: [],
    });

    const [scenarios, setScenarios] = useState({
        scenario1: null,
        scenario2: null,
    });
    const [variance, setVariance] = useState(0.0);
    const [scenarioOptions, setScenarioOptions] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState(null);
    const [tableData, setTableData] = useState(null);

    const defaultScenarios = [
        'Scenario A - Option 1',
        'Scenario B - Option 2',
        'Scenario C - Option 3',
        'Scenario D - Option 4',
    ];

    const excelSheets = ['Control', 'Histroical Data', 'Baseline Projections', 'Sheet4'];

    const sheetContents = {
        Control: [
            { scenario: 'FN18', cycle: '55', country: '55.3', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FO18', cycle: '74', country: '74.1', area: '0.1', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'Fp18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Histroical Data': [
            { scenario: 'FN18', cycle: '55', country: '55.3', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FP18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Baseline Projections': [
            { scenario: 'FP18', cycle: '85', country: '0', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FP18', cycle: '83', country: '0', area: '0.5', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Exchange Rate': [
            { scenario: 'FW18', cycle: '75', country: '90', area: '0.6', modified: 'UNCHANGED', user: 'UNKNOWN' },
            { scenario: 'FT18', cycle: '05', country: '80', area: '0.2', modified: 'UNCHANGED', user: 'UNKNOWN' },
        ],
        'Notes-1': [
            { scenario: 'FA18', cycle: '45', country: '65.2', area: '0.3', modified: 'UPDATED', user: 'ADMIN' },
        ],
        Conversion: [
            { scenario: 'FX18', cycle: '99', country: '20.4', area: '0.8', modified: 'NEW', user: 'USER1' },
        ],
    };
    const updateTableDataWithVariance = () => {
        if (selectedSheet) {
            const updatedData = sheetContents[selectedSheet].map(row => {
                return {
                    ...row,
                    area: (parseFloat(row.area) + parseFloat(variance)).toFixed(1) // Adjusting the area by the variance value
                };
            });
            setTableData(updatedData);
        }
    };

    const handleChange = (name) => (event, newValue) => {
        setFilters((prev) => ({
            ...prev,
            [name]: newValue.includes('All') ? ['All'] : newValue,
        }));
    };
    const workbooks = {
        Input: ['Control', 'Histroical Data', 'Baseline Projections'],
        'Data Connected': ['Exchange Rate', 'Histroical LE1'],
        Output: ['Notes-1', 'Conversion', 'Events'],
    };

    const handleScenarioChange = (scenario) => (event, newValue) => {
        setScenarios((prev) => ({
            ...prev,
            [scenario]: newValue,
        }));
    };

    const handleConfirm = () => {
        if (selectedSheet) {
            updateTableDataWithVariance();
        } else {
            alert("Please select a sheet.");
        }
    };
    const applyVarianceFilter = () => {
        if (selectedSheet) {
            const filteredData = sheetContents[selectedSheet].filter(row => parseFloat(row.area) >= parseFloat(variance));
            setTableData(filteredData);
        }
    };
    const getGreetingMessage = () => {
        const hours = new Date().getHours();
        if (hours < 12) return `Good Morning`;
        if (hours < 18) return `Good Afternoon`;
        return `Good Evening`;
    };
    const selectSheet = (sheet) => {
        setSelectedSheet(sheet);
        updateTableDataWithVariance();
    };

    const handleVarianceChange = (event) => {
        const inputValue = event.target.value;
        if (inputValue === "" || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
            setVariance(inputValue);
        }
    };

    const incrementVariance = () => {
        setVariance((prev) => (parseFloat(prev || "0") + 0.1).toFixed(1));
    };

    const decrementVariance = () => {
        setVariance((prev) => Math.max(0, parseFloat(prev || "0") - 0.1).toFixed(1));
    };

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

    useEffect(() => {
        updateTableDataWithVariance();
    }, [variance, selectedSheet]);

    useEffect(() => {
        if (scenarios.scenario1 && scenarios.scenario2 && selectedSheet) {
            setTableData(sheetContents[selectedSheet]);
        }
    }, [scenarios.scenario1, scenarios.scenario2, selectedSheet]);

    return (
        <div style={{ padding: '20px', marginTop: '-44px' }}>
            <h2>{getGreetingMessage()}, Welcome!</h2>
            <Typography variant="h7" gutterBottom sx={{ marginBottom: '50px' }}>Please select the below options: </Typography>
            <Box display="flex" gap={2} mb={4}>
                {/* Multi-select for Forecast Cycles */}
                <Autocomplete
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

                {/* Multi-select for Country */}
                <Autocomplete
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

                {/* Multi-select for Therapeutic Area */}
                <Autocomplete
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
            <Box display="flex" gap={2} mb={4}>
                {/* Scenario selectors */}
                <Autocomplete
                    options={scenarioOptions}
                    value={scenarios.scenario1}
                    onChange={handleScenarioChange('scenario1')}
                    renderInput={(params) => <TextField {...params} label="Scenario 1" />}
                    style={{ width: '250px' }}
                />
                <Autocomplete
                    options={scenarioOptions}
                    value={scenarios.scenario2}
                    onChange={handleScenarioChange('scenario2')}
                    renderInput={(params) => <TextField {...params} label="Scenario 2" />}
                    style={{ width: '250px' }}
                />
                <Button variant="contained" color="primary" onClick={handleConfirm} sx={{
                    marginTop: 'auto',
                    marginBottom: '36px',
                    padding: '14px'
                }}>
                    Compare
                </Button>
            </Box>
            <Box position="relative" mb={2} width="100%">
                <Box sx={{ position: 'absolute', top: 0, right: 0, minWidth: '250px', maxWidth: '100%' }}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel
                            htmlFor="variance-input"
                            sx={{ whiteSpace: 'nowrap', overflow: 'visible' }} // Prevents label from being cut off
                        >
                            Variance Greater Than
                        </InputLabel>
                        <OutlinedInput
                            id="variance-input"
                            value={variance}
                            onChange={handleVarianceChange}
                            size="small"
                            label="Variance Greater Than" // Associates label with OutlinedInput
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={incrementVariance} size="small">
                                        <Add fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={decrementVariance} size="small">
                                        <Remove fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </Box>
            {/* Left section for Select Excel Sheet and right section for the Table */}
            <Box display="flex" alignItems="flex-start" gap={2}>
                <Box width="250px" sx={{mt:-4}}>
                    {scenarios.scenario1 && scenarios.scenario2 && (
                        <Accordion sx={{ mt: -1 }}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography>Select Required Excel Sheets</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {Object.keys(workbooks).map((workbook) => (
                                    <Accordion key={workbook} disableGutters sx={{ boxShadow: 'none' }}>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <ListItemIcon>
                                                <Folder color="primary" />
                                            </ListItemIcon>
                                            <Typography variant="subtitle1">{workbook}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List disablePadding>
                                                {workbooks[workbook].map((sheet) => (
                                                    <ListItemButton
                                                        key={sheet}
                                                        onClick={() => selectSheet(sheet)}
                                                        sx={{ pl: 4 }}
                                                    >
                                                        <ListItemIcon>
                                                            <InsertDriveFile fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={sheet} />
                                                    </ListItemButton>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </AccordionDetails>
                        </Accordion>

                    )}
                </Box>

                {/* Table display next to the Select Excel Sheet box */}
                {tableData && (
                    <Box flex="1">
                        <Typography variant="h6">Data from {selectedSheet}</Typography>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table aria-label="table data" size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Cell</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario 1</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario 2</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Variance</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Active Scenario Modified</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Compare To Modified</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, index) => (
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
            </Box>
            </Box>
        </div >
    );
};

export default ScenarioFilterPage;
