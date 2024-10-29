import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import * as XLSX from 'xlsx'; // Importing xlsx for Excel saving
import { useState, useContext } from 'react';
import { SavedFilesContext } from './SavedFilesContext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BlueFolder from "../assets/blue3.png"
import GreyFolder from "../assets/Grey-folder.png"
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
//import { Autocomplete, TextField, Box } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
//import ScenarioDetails from './Scenario_details'

export default function CountryAndTherapeuticSelect({ username = "User" }) {
  const { savedFiles, setSavedFiles } = useContext(SavedFilesContext);
  const [showTable, setShowTable] = React.useState(false);
  const [countries, setCountries] = React.useState([]); // Multi-select for countries
  const [therapeuticAreas, setTherapeuticAreas] = React.useState([]); // Multi-select for therapeutic areas
  const [forecastCycles, setForecastCycles] = React.useState([]); // Multi-select for forecast cycles
  const [importedData, setImportedData] = React.useState({ headers: [], rows: [] });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [lockOpen, setLockOpen] = React.useState(false);
  const [lockType, setLockType] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const nextIdRef = React.useRef(1);
  const [fileStatuses, setFileStatuses] = React.useState({});
  const [saveAnchorEl, setSaveAnchorEl] = React.useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const blueFolderIcon = BlueFolder;

  const navigate = useNavigate();
  // Update with actual path
  const grayFolderIcon = GreyFolder; // Update with actual path
  const [extraFileName, setExtraFileName] = React.useState('');
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [fileFormat, setFileFormat] = React.useState('csv'); // To track file format (CSV or Excel)
  const fileInputRef = React.useRef(null);
  const [showFolders, setShowFolders] = useState(false);
  const savedScenarios = [
    { scenario: 'Draft 1', cycle: '2024 H1', country: 'USA', area: 'Cardiology', modified: '15 Oct 2023', user: 'User A', submitted: false },
    { scenario: 'Main Submission', cycle: '2024 H2', country: 'Canada', area: 'Oncology', modified: '01 Sep 2023', user: 'User B', submitted: true },
    { scenario: 'Draft 2', cycle: '2024 H1', country: 'USA', area: 'Oncology', modified: '10 Oct 2023', user: 'User A', submitted: false },
    { scenario: 'Main Submission', cycle: '2023 H2', country: 'Germany', area: 'Neurology', modified: '12 Jul 2023', user: 'User C', submitted: true },
  ];
  const filteredSavedScenarios = savedScenarios.filter((scenario) => !scenario.submitted);
  // List of available folders
  const folders = [
    { name: 'Cardiology - Patient Projection Model v2', country: 'USA', area: 'Cardiology' },
    { name: 'Cardiology - Patient Switch Model v2', country: 'USA', area: 'Cardiology' },
    { name: 'Oncology - Patient Switch Model', country: 'USA', area: 'Oncology' },
    { name: 'Oncology - Patient Projection Model', country: 'Germany', area: 'Oncology' },
    { name: 'Cardiology - Patient Projection Model v1', country: 'Canada', area: 'Cardiology' },
    { name: 'Cardiology - Patient Switch Model v1', country: 'Canada', area: 'Cardiology' },
  ];
  const countryOptions = ['All', 'USA', 'Canada', 'Germany', 'India'];
  const therapeuticAreaOptions = ['All', 'Cardiology', 'Oncology', 'Neurology', 'Diabetes'];
  const forecastCycleOptions = ['All', '2013-H1', '2013-H2', '2014-H1', '2014-H2'];
  const handleCountryChange = (event, newValue) => {
    if (newValue.includes('All')) {
      // If "All" is selected, select all countries
      setCountries(countryOptions.slice(1)); // Slice to exclude "All"
    } else {
      setCountries(newValue);
    }
  };
  const handleSelectClick = (scenario) => {
    // Navigate to the specific page, passing scenario data as state
    navigate('/scenario-details', { state: { scenario } });
  };
  const handleReviewScenario = (scenario) => {
    // Navigate to the specific page, passing scenario data as state
    navigate('/review-scenario', { state: { scenario } });
  };
  const handleReviewScenarioSummary = (scenario) => {
    // Navigate to the specific page, passing scenario data as state
    navigate('/summary-scenario', { state: { scenario } });
  };
  const handleTherapeuticChange = (event, newValue) => {
    if (newValue.includes('All')) {
      // If "All" is selected, select all therapeutic areas
      setTherapeuticAreas(therapeuticAreaOptions.slice(1)); // Slice to exclude "All"
    } else {
      setTherapeuticAreas(newValue);
    }
  };
  const handleForecastCycleChange = (event, newValue) => {
    if (newValue.includes('All')) {
      // If "All" is selected, select all forecast cycles
      setForecastCycles(forecastCycleOptions.slice(1)); // Slice to exclude "All"
    } else {
      setForecastCycles(newValue);
    }
  };

  const handleCopyFromSubmissionScenarios = () => {
    setShowTable(true); // Show the table when the button is clicked
  };
  /*const handleSaveClick = () => {
    setExtraFileName('');
    setSaveDialogOpen(true);
  };*/
  const handleUsingSavedTemplates = () => {
    setShowFolders(true); // Show folders when the button is clicked
  };
  const handleActionClick = (action) => {
    setSelectedAction(action); // Set the clicked action
    if (action === 'savedTemplates') {
      setShowFolders(true); // Show folders only when "Using Saved Templates" is clicked
    } else {
      setShowFolders(false); // Hide folders when other buttons are clicked
    }
  };
  const handleFolderClick = (folder) => {
    console.log("Folder clicked:", folder); // Check if click is detected
    try {
      navigate('/scenario-details', { state: { folder } });
      console.log("Navigating to scenario-details"); // Confirms that navigation was called
    } catch (error) {
      console.error("Navigation error:", error); // Catch errors if navigation fails
    }
  };
  const handleConfirmSave = async () => {
    setSaveDialogOpen(false);

    if (!importedData.headers.length || !importedData.rows.length) {
      alert("No imported data available to save!");
      return;
    }

    const baseFileName = `${forecastCycles}_${countries}_${therapeuticAreas}`;
    const fullFileName = `${baseFileName}${extraFileName ? `_${extraFileName}` : ''}`;

    if (fileFormat === 'csv') {
      // Save as CSV
      const headers = importedData.headers.join(',');
      const rows = importedData.rows.map((row) => row.data.join(','));
      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${fullFileName}.csv`,
          types: [
            {
              description: 'CSV File',
              accept: {
                'text/csv': ['.csv'],
              },
            },
          ],
        });

        const writableStream = await handle.createWritable();
        await writableStream.write(blob);
        await writableStream.close();

        saveFileData(fullFileName, 'csv');
      } catch (error) {
        console.error('File saving was canceled or failed:', error);
      }
    } else if (fileFormat === 'excel') {
      // Save as Excel
      const ws = XLSX.utils.aoa_to_sheet([importedData.headers, ...importedData.rows.map((row) => row.data)]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      // Write the workbook to an array buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Create a blob from the array buffer
      const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: `${fullFileName}.xlsx`,
          types: [
            {
              description: 'Excel File',
              accept: {
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              },
            },
          ],
        });

        const writableStream = await handle.createWritable();
        await writableStream.write(excelBlob);
        await writableStream.close();

        saveFileData(fullFileName, 'excel');
      } catch (error) {
        console.error('File saving was canceled or failed:', error);
      }
    }
  };

  const saveFileData = (fileName, format) => {
    const newId = nextIdRef.current++;
    const newSavedFile = {
      id: newId,
      username,
      fileName: `${fileName}.${format}`,
      forecastCycles,
      countries,
      therapeuticAreas,
      dateTime: new Date().toLocaleString(),
      locked: false,
    };

    setSavedFiles((prevFiles) => [...prevFiles, newSavedFile]);
  };

  const handleSaveDialogClose = () => {
    setSaveDialogOpen(false);
  };

  const handleLockAndFinalizeClick = (file) => {
    setSelectedFile(file);
    setLockType("Lock & Finalize");
    setLockOpen(true);
  };

  const handleLockClick = (file) => {
    setSelectedFile(file);
    setLockType("Lock");
    setLockOpen(true);
  };

  const handleDialogClose = () => {
    setLockOpen(false);
  };

  const handleConfirmLock = () => {
    setFileStatuses((prevStatuses) => ({
      ...prevStatuses,
      [selectedFile.id]: lockType === "Lock" ? "locked" : "finalized",
    }));
    const lockedFile = { ...selectedFile, status: lockType === "Lock" ? "locked" : "finalized" };
    setSavedFiles((prevFiles) => [...prevFiles, lockedFile]);
    setLockOpen(false);
  };
  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 48 * 4.5 + 8,
        width: 250,
      },
    },
  };
  /*const handleDownloadTemplate = () => {
    setShowFolders(false); // Hide folders when downloading template
    const headers = ['Forecast Cycle', 'Country', 'Therapeutic Area'];
    const rowData = [[forecastCycle, country, therapeuticArea]];
    const csvContent = [headers.join(','), rowData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };*/
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n').filter((row) => row.trim() !== '');
        const headers = rows[0].split(',').map((header) => header.trim());
        const parsedRows = rows.slice(1).map((row, index) => {
          const values = row.split(',').map((value) => value.trim());
          return { id: index + 1, data: values };
        });

        // Save the file in 'FileData' (Simulating saving to folder)
        const savedFile = {
          fileName: file.name,
          content: content,
          headers: headers,
          rows: parsedRows
        };

        // Assuming we have a 'FileData' context to store files
        setSavedFiles((prevFiles) => [...prevFiles, savedFile]);

        setImportedData({ headers, rows: parsedRows });
      };
      reader.readAsText(file);
    }
  };

  /*const handleImportClick = () => {
    setShowFolders(false); // Hide folders when importing CSV
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };*/

  const getGreetingMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) return `Good Morning`;
    if (hours < 18) return `Good Afternoon`;
    return `Good Evening`;
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h2>{getGreetingMessage()}, Please provide details for New Scenario Configuration</h2>
      {/* Add the three buttons with background colors */}
      {/* Add the three buttons with background colors */}
      <h4>Choose an option to build Scenario</h4>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: selectedAction === 'copySubmission' ? '#1e88e5' : 'gray',
            color: 'white',
            '&:hover': { backgroundColor: selectedAction === 'copySubmission' ? '#1565c0' : 'gray' },
          }}
          //disabled={selectedAction && selectedAction !== 'copySubmission'}
          onClick={() => handleActionClick('copySubmission')}
        >
          Copy from Submission Scenarios
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: selectedAction === 'copySaved' ? '#1e88e5' : 'gray',
            color: 'white',
            '&:hover': { backgroundColor: selectedAction === 'copySaved' ? '#1e88e5' : 'gray' },
          }}
          //disabled={selectedAction && selectedAction !== 'copySaved'}
          onClick={() => handleActionClick('copySaved')}
        >
          Copy from Saved Scenarios
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: selectedAction === 'savedTemplates' ? '#1e88e5' : 'gray',
            color: 'white',
            '&:hover': { backgroundColor: selectedAction === 'savedTemplates' ? '#1565c0' : 'gray' },
          }}
          //disabled={selectedAction && selectedAction !== 'savedTemplates'}
          onClick={() => handleActionClick('savedTemplates')}
        >
          Using Saved Templates
        </Button>
      </div>


      <h4>Please select a Scenario to Continue</h4>
      <Box display="flex" gap={2} mb={6} sx={{ width: '100%' }}>
        {/* Autocomplete with Checkboxes for Forecast Cycle */}
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
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <ListItemText primary={option} />
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Forecast Cycle" placeholder="Select forecast cycle(s)" />
          )}
          sx={{ width: '300px' }}
        />

        {/* Autocomplete with Checkboxes for Country */}
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
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <ListItemText primary={option} />
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Country" placeholder="Select country(s)" />
          )}
          sx={{ width: '300px' }}
        />

        {/* Autocomplete with Checkboxes for Therapeutic Area */}
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
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <ListItemText primary={option} />
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Therapeutic Area" placeholder="Select therapeutic area(s)" />
          )}
          sx={{ width: '300px' }}
        />
      </Box>
      {/* Buttons to interact with selected options */}
      {/*<Button
        variant="contained"
        color="primary"
        sx={{ m: 1 }}
        //onClick={handleDownloadTemplate}
        disabled={!country && !therapeuticArea && !forecastCycle}
      >
        Download Template
      </Button>*/}

      {/*<Button
        variant="contained"
        color="secondary"
        sx={{ m: 1 }}
        //onClick={handleImportClick}
      >
        Import Template
      </Button>*/}

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/*<Button
        variant="contained"
        color="success"
        sx={{
          m: 1,
          backgroundColor: '#43a047',
          color: 'white',
          padding: '10px 10px',
          fontSize: '13px',
          borderRadius: '2px',
          display: 'flex',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#388e3c',
          },
        }}
        onClick={handleSaveClick}
      >
        Save File
      </Button>*/}
      {selectedAction === 'copySubmission' && (
        <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%' }}>
          <Table aria-label="submission scenarios table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Scenario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Forecast Cycle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Country</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Therapeutic Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Modified</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Submitted by</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', paddingLeft: '80px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
                { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
                { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'TA 1', modified: '30 Sep 2024', user: 'User 1' },
                { scenario: 'Main Submission', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '29 Sep 2024', user: 'User 1' },
                { scenario: 'Draft 1', cycle: '2024 H2', country: 'Finland', area: 'TA 1', modified: '28 Sep 2024', user: 'User 1' },
              ].map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.scenario}</TableCell>
                  <TableCell>{row.cycle}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.modified}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title="Review Scenario Summary">
                        <IconButton onClick={() => handleReviewScenarioSummary(row)}>
                          <OpenInNewIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Review Scenario Details">
                        <IconButton onClick={() => handleReviewScenario(row)}>
                          <AssessmentIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Select Scenario">
                        <Button variant="contained" color="primary" size="small" onClick={() => handleSelectClick(row)}>
                          Select
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedAction === 'copySaved' && (
        <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%' }}>
          <Table aria-label="saved scenarios table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Scenario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Forecast Cycle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Country</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Therapeutic Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Last Modified</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Submitted by</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', paddingLeft: '27px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSavedScenarios.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.scenario}</TableCell>
                  <TableCell>{row.cycle}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.modified}</TableCell>
                  <TableCell>{row.user}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title="Review Scenario Summary">
                        <IconButton onClick={() => handleReviewScenarioSummary(row)}>
                          <OpenInNewIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Review Scenario Details">
                        <IconButton onClick={() => handleReviewScenario(row)}>
                          <AssessmentIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Select Scenario">
                        <Button variant="contained" color="primary" size="small" onClick={() => handleSelectClick(row)}>
                          Select
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {showFolders && selectedAction === 'savedTemplates' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px', gap: '40px' }}>
          {folders.map((folder, index) => {
            // If no filters are selected, all folders are highlighted
            const isFiltered = countries.length > 0 || therapeuticAreas.length > 0;
            const isHighlighted = !isFiltered || (countries.includes(folder.country) && therapeuticAreas.includes(folder.area));

            return (
              <Paper
                key={index}
                elevation={3}
                style={{
                  width: '200px',
                  padding: '10px',
                  textAlign: 'center',
                  cursor: isHighlighted ? 'pointer' : 'default', // Pointer cursor only for blue folders
                  backgroundColor: isHighlighted ? '#1976d2' : '#e0e0e0', // Blue if highlighted, grey otherwise
                  color: isHighlighted ? 'white' : 'black', // Font color based on highlight
                }}
                onClick={() => {
                  if (isHighlighted) { // Only navigate if the folder is highlighted (blue)
                    navigate('/scenario-details', { state: { folder } });
                  }
                }}
              >
                <img
                  src={isHighlighted ? blueFolderIcon : grayFolderIcon} // Use grey icon for non-matching folders
                  alt="Folder Icon"
                  style={{ width: '80px', height: '80px' }}
                />
                <Typography variant="body1" sx={{ fontWeight: isHighlighted ? 'bold' : 'normal' }}>
                  {folder.name}
                </Typography>
              </Paper>
            );
          })}
        </div>
      )}
      {importedData.headers.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 400, maxWidth: '100%', overflow: 'auto' }}>
          <Table stickyHeader aria-label="imported data table">
            <TableHead>
              <TableRow>
                {importedData.headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {importedData.rows.map((row) => (
                <TableRow key={`imported-${row.id}`}>
                  {row.data.map((value, index) => (
                    <TableCell key={index}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {savedFiles.length > 0 && (
        <>
          <h3 style={{ marginTop: '40px', marginleft: '10px' }}>Saved Files</h3>
          <TableContainer component={Paper} sx={{ mt: 3, padding: '10px' }}>
            <Table aria-label="saved files table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ padding: '10px' }}>ID</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Username</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Saved CSV Name</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Forecast Cycle</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Country</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Therapeutic Area</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Date and Time</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Status</TableCell>
                  <TableCell sx={{ padding: '10px' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell sx={{ padding: '10px' }}>{file.id}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>{file.username}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>{file.fileName}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>{file.forecastCycle}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>{file.country}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>{file.therapeuticArea}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>{file.dateTime}</TableCell>
                    <TableCell sx={{ padding: '10px' }}>
                      {fileStatuses[file.id] === "locked" && <LockIcon color="action" />}
                      {fileStatuses[file.id] === "finalized" && <CheckCircleIcon color="success" />}
                    </TableCell>
                    <TableCell sx={{ padding: '10px' }}>
                      <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem onClick={() => handleLockClick(file)}>Lock</MenuItem>
                        <MenuItem onClick={() => handleLockAndFinalizeClick(file)}>
                          Lock & Finalize
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog
        open={saveDialogOpen}
        onClose={handleSaveDialogClose}
      >
        <DialogTitle>Save File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The filename starts with:
            <strong>{`${forecastCycles}_${countries}_${therapeuticAreas}`}</strong>
            <br />
            Add any additional info if you need:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="extra-file-name"
            label="Additional Name (Optional)"
            type="text"
            fullWidth
            value={extraFileName}
            onChange={(e) => setExtraFileName(e.target.value)}
          />

          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <InputLabel id="file-format-select-label">File Format</InputLabel>
            <Select
              labelId="file-format-select-label"
              id="file-format-select"
              value={fileFormat}
              label="File Format"
              onChange={(event) => setFileFormat(event.target.value)}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={lockOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>{`Are you sure you want to ${lockType} this file?`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to {lockType.toLowerCase()} the following file:
            <ul>
              <li>Country: {selectedFile?.country}</li>
              <li>Therapeutic Area: {selectedFile?.therapeuticArea}</li>
              <li>Forecast Cycle: {selectedFile?.forecastCycle}</li>
              <li>Date and Time: {selectedFile?.dateTime}</li>
              <li>File name: {selectedFile?.fileName}</li>
            </ul>
            Once {lockType.toLowerCase()}ed, you won't be able to modify it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleConfirmLock} color="primary">{`Confirm ${lockType}`}</Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <div style={{ marginTop: '20px' }}>
          <CircularProgress />
          <p>Saving file...</p>
        </div>
      )}
    </div>
  );
}