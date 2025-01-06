import * as React from 'react';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { useContext, useEffect, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './context';
import { FormControl, InputLabel, Select, MenuItem, Typography, Divider } from '@mui/material';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';

// demo data for the table
const demo_data = [
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 1', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '28 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'Cardiology', modified: '10 Jan 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Oncology', modified: '20 Aug 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'Neurology', modified: '15 Apr 2014', user: 'User 4' },
    { scenario: 'Draft 2', cycle: '2014-H2', country: 'India', area: 'Diabetes', modified: '10 Dec 2014', user: 'User 5' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Cardiology', modified: '30 Sep 2024', user: 'User 1' },
    { scenario: 'Draft 1', cycle: '2013-H1', country: 'USA', area: 'Oncology', modified: '15 Jan 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Neurology', modified: '20 Jul 2013', user: 'User 3' },
    { scenario: 'Draft 3', cycle: '2014-H1', country: 'Germany', area: 'Diabetes', modified: '01 Apr 2014', user: 'User 4' },
    { scenario: 'Main Submission', cycle: '2014-H2', country: 'India', area: 'TA 1', modified: '12 Dec 2014', user: 'User 5' },
    { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'Cardiology', modified: '01 Oct 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'Oncology', modified: '25 Feb 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Neurology', modified: '30 Aug 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'Diabetes', modified: '25 May 2014', user: 'User 4' },
    { scenario: 'Main Submission', cycle: '2014-H2', country: 'India', area: 'Cardiology', modified: '18 Dec 2014', user: 'User 5' },
    { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'Neurology', modified: '02 Oct 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'TA 1', modified: '10 Mar 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Diabetes', modified: '22 Sep 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'TA 1', modified: '15 Jun 2014', user: 'User 4' },
    { scenario: 'Draft 2', cycle: '2014-H2', country: 'India', area: 'Oncology', modified: '01 Jan 2015', user: 'User 5' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Neurology', modified: '04 Oct 2024', user: 'User 1' },
    { scenario: 'Draft 3', cycle: '2013-H1', country: 'USA', area: 'Cardiology', modified: '15 Apr 2013', user: 'User 2' },
    { scenario: 'Main Submission', cycle: '2013-H2', country: 'Canada', area: 'Oncology', modified: '01 Nov 2013', user: 'User 3' },
    { scenario: 'Draft 1', cycle: '2014-H1', country: 'Germany', area: 'Diabetes', modified: '30 Jul 2014', user: 'User 4' },
    { scenario: 'Draft 2', cycle: '2014-H2', country: 'India', area: 'TA 1', modified: '20 Jan 2015', user: 'User 5' },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'Cardiology', modified: '06 Oct 2024', user: 'User 1' }
];

const reportCategories = [
    {
        label: 'Scenario-Level Reports',
        options: [
            'Scenario Summary Report',
            'Version History Report',
        ],
    },
    {
        label: 'Country-Level Reports',
        options: [
            'Country Summary Report',
            'Regional Comparison Report',
        ],
    },
    {
        label: 'Performance and Accuracy Reports',
        options: [
            'Forecast Accuracy Report',
            'Scenario Performance Report',
        ],
    },
    {
        label: 'Input Data Analysis Reports',
        options: [
            'Data Quality Report',
            'Assumption Analysis Report',
        ],
    },
    {
        label: 'Time-Series Reports',
        options: [
            'Trend Analysis Report',
            'Time-Series Breakdown Report',
        ],
    },
    {
        label: 'Operational and Administrative Reports',
        options: [
            'Submission Status Report',
            'Audit Log Report',
            'Lock/Unlock Status Report',
        ],
    },
    {
        label: 'Financial and Business Impact Reports',
        options: [
            'Revenue Forecast Report',
            'Cost vs. Revenue Report',
            'Risk Assessment Report',
        ],
    },
    {
        label: 'Visualization-Focused Reports',
        options: [
            'KPI Dashboard Report',
            'Geographic Heatmap Report',
        ],
    },
];


export default function GenerateReport() {
    const { countries, setCountries } = useContext(MyContext);
    const { therapeuticAreas, setTherapeuticAreas } = useContext(MyContext);
    const { forecastCycles, setForecastCycles } = useContext(MyContext);
    // dropdown values
    const countryOptions = ['All', 'USA', 'Canada', 'Germany', 'India', 'Norway', 'Finland'];
    const therapeuticAreaOptions = ['All', 'Cardiology', 'Oncology', 'Neurology', 'Diabetes', 'TA 1'];
    const forecastCycleOptions = ['All', '2024 H2', '2013-H1', '2013-H2', '2014-H1', '2014-H2'];
    const navigate = useNavigate();

    const handleReviewScenario = (scenario) => {
        // Navigate to the specific page, passing scenario data as state
        navigate('/saved-scenario/review-scenario', { state: { scenario } });
    };
    const handleReviewScenarioSummary = (scenario) => {
        // Navigate to the specific page, passing scenario data as state
        navigate('/saved-scenario/summary-scenario', { state: { scenario } });
    };
    const getGreetingMessage = () => {
        const hours = new Date().getHours();
        if (hours < 12) return `Good Morning`;
        if (hours < 18) return `Good Afternoon`;
        return `Good Evening`;
    };

    // Filtered data based on the dropdown selections
    const filteredData = demo_data.filter(item =>
        (forecastCycles.length === 0 || forecastCycles.includes('All') || forecastCycles.includes(item.cycle)) &&
        (countries.length === 0 || countries.includes('All') || countries.includes(item.country)) &&
        (therapeuticAreas.length === 0 || therapeuticAreas.includes('All') || therapeuticAreas.includes(item.area))
    );
    const [selectedRows, setSelectedRows] = React.useState(new Array(filteredData.length).fill(false));
    useEffect(() => {
        const rows = selectedRows.map(val => false);
        setSelectedRows(rows);
    }, [countries, therapeuticAreas, forecastCycles]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(false);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [currentCategory, setCurrentCategory] = useState(null); // Track the current category for submenu
    const [Index, setIndex] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenSubMenu(false);
        setSubMenuAnchorEl(null);
        setCurrentCategory(null); // Reset current category
    };

    const handleSubMenuOpen = (index, event, category) => {
        setSubMenuAnchorEl(event.currentTarget);
        setCurrentCategory(category);
        setOpenSubMenu(true);
        setIndex(index);
    };
    return (
        <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-25px' }}>
            <h2>{getGreetingMessage()}, Welcome to the Saved Scenario Page!</h2>
            <h4>Please select a Scenario to Continue</h4>
            <Box display="flex" gap={2} mb={2} sx={{ width: '100%' }}>
                {/* Forecast Cycle Dropdown */}
                <Autocomplete
                    multiple
                    id="forecast-cycle-autocomplete"
                    options={forecastCycleOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    value={forecastCycles}
                    onChange={(event, newValue) => setForecastCycles(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} size="small" label="Forecast Cycle" placeholder="Select forecast cycle(s)" />
                    )}
                    sx={{ width: '300px' }}
                />

                {/* Country Dropdown */}
                <Autocomplete
                    multiple
                    id="country-autocomplete"
                    options={countryOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    value={countries}
                    onChange={(event, newValue) => setCountries(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} size="small" label="Country" placeholder="Select country(s)" />
                    )}
                    sx={{ width: '300px' }}
                />

                {/* Therapeutic Area Dropdown */}
                <Autocomplete
                    multiple
                    id="therapeutic-area-autocomplete"
                    options={therapeuticAreaOptions}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    value={therapeuticAreas}
                    onChange={(event, newValue) => setTherapeuticAreas(newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                            <ListItemText primary={option} />
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} size="small" label="Therapeutic Area" placeholder="Select therapeutic area(s)" />
                    )}
                    sx={{ width: '300px' }}
                />
            </Box>
            <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px' }}>
                <Button
                    onClick={handleClick}
                    disabled={selectedRows.every(val => val === false)}
                    sx={{
                        bgcolor: selectedRows.every(val => val === false) ? 'grey' : '#1976d2', // Blue background
                        color: 'white',  // White text
                        '&:hover': {
                            bgcolor: 'darkblue' // Darker blue on hover
                        }
                    }}
                >
                    Generate Report
                </Button>

                {/* Main Dropdown */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {reportCategories.map((category, index) => (
                        <MenuItem
                            key={index}
                            onClick={(event) => handleSubMenuOpen(index, event, category)}
                            sx={{
                                bgcolor : Index === index ? '#1976d2' : 'white',
                                '&:hover': {
                                    bgcolor: '#1976d2',
                                    color: 'white',
                                },
                            }}
                        >
                            {category.label}
                            <Typography variant="body2" sx={{ marginLeft: '8px' }}>
                                {'>>'}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>

                {/* First-level Submenu */}
                {openSubMenu && currentCategory && (
                    <Menu
                        anchorEl={subMenuAnchorEl}
                        open={openSubMenu}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 0,
                        }}
                    >
                        {currentCategory.options.map((option, index) => (
                            <MenuItem key={index} onClick={handleClose}
                                sx={{
                                    '&:hover': {
                                        bgcolor: '#1976d2',
                                        color: 'white',
                                    },
                                }}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                )}

            </div>




            {(
                <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%' }}>
                    <Table aria-label="submission scenarios table" size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                {/* Checkbox for selecting rows */}
                                <TableCell padding="checkbox">
                                    {/* <Checkbox /> */}
                                </TableCell>
                                {/* Scenario Name */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario</TableCell>
                                {/* Forecast Cycle */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Forecast Cycle</TableCell>
                                {/* Country */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Country</TableCell>
                                {/* Therapeutic Area */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Therapeutic Area</TableCell>
                                {/* Last Modified Date */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Last Modified</TableCell>
                                {/* Submitted by */}
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Submitted by</TableCell>
                                {/* Actions */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white', height: 53 }}>
                                    {/* Checkbox for selecting this row */}
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedRows[index]}
                                            onChange={() => setSelectedRows(
                                                selectedRows.map((value, i) => i === index ? !value : value)
                                            )}
                                        />
                                    </TableCell>
                                    {/* Scenario Name */}
                                    <TableCell align="center">{row.scenario}</TableCell>
                                    {/* Forecast Cycle */}
                                    <TableCell align="center">{row.cycle}</TableCell>
                                    {/* Country */}
                                    <TableCell align="center">{row.country}</TableCell>
                                    {/* Therapeutic Area */}
                                    <TableCell align="center">{row.area}</TableCell>
                                    {/* Last Modified Date */}
                                    <TableCell align="center">{row.modified}</TableCell>
                                    {/* Submitted by */}
                                    <TableCell align="center">{row.user}</TableCell>
                                    {/* Actions */}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
