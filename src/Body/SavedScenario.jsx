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
import { useContext } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import { MyContext } from './context';


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



export default function SavedScenario() {
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
    return (
        <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-25px' }}>
            <h2>{getGreetingMessage()}, Welcome to the Saved Scenario Page!</h2>
            <h4>Please select a Scenario to Continue</h4>
            <Box display="flex" gap={2} mb={6} sx={{ width: '100%' }}>
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

            {(
                <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%' }}>
                    <Table aria-label="submission scenarios table" size="small">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#1976d2' }}>
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
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white' }}>
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
                                    <TableCell sx={{ padding: '6px', textAlign: 'center' }}>
                                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                                            {/* Icon for reviewing scenario summary */}
                                            <Tooltip title="Review Scenario Summary">
                                                <IconButton onClick={() => handleReviewScenarioSummary(row)}>
                                                    <OpenInNewIcon color="success" />
                                                </IconButton>
                                            </Tooltip>
                                            {/* Icon for reviewing scenario details */}
                                            <Tooltip title="Review Scenario Details">
                                                <IconButton onClick={() => handleReviewScenario(row)}>
                                                    <AssessmentIcon color="success" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
