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
import * as XLSX from 'xlsx';
import { useState, useContext, useEffect } from 'react';
import { SavedFilesContext } from './SavedFilesContext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BlueFolder from "../assets/blue3.png"
import GreyFolder from "../assets/Grey-folder.png"
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { MyContext } from './context';
import './New_Scenario.css'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


export default function NewScenario({ username = "User" }) {
  const { savedFiles, setSavedFiles } = useContext(SavedFilesContext);
  const [showTable, setShowTable] = React.useState(false);
  const { countries, setCountries } = useContext(MyContext); // Multi-select for countries
  const { therapeuticAreas, setTherapeuticAreas } = useContext(MyContext); // Multi-select for therapeutic areas
  const { forecastCycles, setForecastCycles } = useContext(MyContext); // Multi-select for forecast cycles
  const [importedData, setImportedData] = React.useState({ headers: [], rows: [] });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [lockOpen, setLockOpen] = React.useState(false);
  const [lockType, setLockType] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const nextIdRef = React.useRef(1);
  const [fileStatuses, setFileStatuses] = React.useState({});
  const [selectedAction, setSelectedAction] = useState('');
  const { rowsData, setRowsData } = useContext(MyContext);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track the current step in the tutorial
  const blueFolderIcon = BlueFolder;

  const navigate = useNavigate();
  // Update with actual path
  const grayFolderIcon = GreyFolder; // Update with actual path
  const [extraFileName, setExtraFileName] = React.useState('');
  const [saveDialogOpen, setSaveDialogOpen] = React.useState(false);
  const [fileFormat, setFileFormat] = React.useState('csv'); // To track file format (CSV or Excel)
  const [showFolders, setShowFolders] = useState(false);
  const savedScenarios = rowsData.filter(item => ['Pending', 'Ongoing'].includes(item.currentForecastStatus));
  const CopyScenarioData = rowsData.filter(item => item.currentForecastStatus === "Submitted");
  const filteredCopyData = CopyScenarioData.filter(item =>
    (forecastCycles.length === 0 || forecastCycles.includes('All') || forecastCycles.includes(item.forecastScenario)) &&
    (countries.length === 0 || countries.includes('All') || countries.includes(item.country)) &&
    (therapeuticAreas.length === 0 || therapeuticAreas.includes('All') || therapeuticAreas.includes(item.therapeuticArea))
  );

  const filteredSavedData = savedScenarios.filter(item =>
    (forecastCycles.length === 0 || forecastCycles.includes('All') || forecastCycles.includes(item.forecastScenario)) &&
    (countries.length === 0 || countries.includes('All') || countries.includes(item.country)) &&
    (therapeuticAreas.length === 0 || therapeuticAreas.includes('All') || therapeuticAreas.includes(item.therapeuticArea))
  );


  // List of available folders
  const folders = [
    { name: 'Cardiology - Patient Projection Model v2', country: 'USA', area: 'Cardiology' },
    { name: 'Cardiology - Patient Switch Model v2', country: 'USA', area: 'Cardiology' },
    { name: 'Oncology - Patient Switch Model', country: 'USA', area: 'Oncology' },
    { name: 'Oncology - Patient Projection Model', country: 'Germany', area: 'Oncology' },
    { name: 'Cardiology - Patient Projection Model v1', country: 'Canada', area: 'Cardiology' },
    { name: 'Cardiology - Patient Switch Model v1', country: 'Canada', area: 'Cardiology' },
  ];
  const therapeuticAreaOptions = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology', 'HIV'];
  const countryOptions = ['Iceland', 'Germany', 'UK', 'Finland', 'France', 'Italy', 'Spain', 'Denmark', 'Norway', 'Sweden'];
  const forecastCycleOptions = ['H1 - 2023', 'H2 - 2023', 'H1 - 2024', 'H2 - 2024'];

  const handleSelectClick = (scenario) => {
    // Navigate to the specific page, passing scenario data as state

    navigate('/new-model/epidemiology-model/scenario-details', { state: { scenario } });
  };
  const handleReviewScenario = (scenario) => {
    // Navigate to the specific page, passing scenario data as state
    navigate('/new-model/epidemiology-model/review-scenario', { state: { scenario } });
  };
  const handleReviewScenarioSummary = (scenario) => {
    // Navigate to the specific page, passing scenario data as state
    navigate('/new-model/epidemiology-model/summary-scenario', { state: { scenario } });
  };

  const handleActionClick = (action) => {
    setSelectedAction(action); // Set the clicked action
    if (action === 'savedTemplates') {
      setShowFolders(true); // Show folders only when "Using Saved Templates" is clicked
    } else {
      setShowFolders(false); // Hide folders when other buttons are clicked
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



  const getGreetingMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) return `Good Morning`;
    if (hours < 18) return `Good Afternoon`;
    return `Good Evening`;
  };

  const showTutorial2 = () => {
    const step = {
      index: 0,
      target: '.tutorial-btn',
      content: 'You can always see this tutorial by clicking on this button.',
      placement: 'left',
    };
    const targetElement = document.querySelector(step.target);
    const popup = document.createElement('div');
    popup.classList.add('tutorial-popup', step.placement);
    popup.textContent = step.content;
    targetElement.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)';
    targetElement.style.border = '3px solid navy';
    // Position the popup based on the target element and placement
    const rect = targetElement.getBoundingClientRect();
    let top, left;
    top = rect.top + rect.height / 2 - popup.offsetHeight / 2;
    left = rect.left - 350;
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    document.body.appendChild(popup);
    // Add a button to close the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cancel';
    closeButton.style.marginRight = '40px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
      setTutorialActive(false);
      setCurrentStep(0);
      popup.remove();
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    popup.appendChild(closeButton);
  };
  const showTutorial = (step) => {
    const targetElement = document.querySelector(step.target);
    const popup = document.createElement('div');
    popup.classList.add('tutorial-popup', step.placement);
    popup.textContent = step.content;
    targetElement.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)';
    targetElement.style.border = '3px solid navy';
    // Position the popup based on the target element and placement
    const rect = targetElement.getBoundingClientRect();
    let top, left;
    if (step.placement === 'top') {
      top = rect.top - popup.offsetHeight;
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'bottom') {
      top = rect.bottom + 10;
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'left') {
      top = rect.top + rect.height / 2 - popup.offsetHeight / 2;
      left = rect.left - 350;
    } else if (step.placement === 'right') {
      top = rect.top;
      left = rect.right;
    }
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    document.body.appendChild(popup);
    // Add a button to close the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = currentStep === (selectedAction === '' ? steps : selectedAction === 'savedTemplates' ? steps3 : steps2).length - 1 ? 'Finish' : 'Skip Tutorial';
    closeButton.style.marginRight = '40px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
      setTutorialActive(false);
      setCurrentStep(0);
      popup.remove();
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
      showTutorial2();
    });
    popup.appendChild(closeButton);
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.style.padding = '5px 10px';
    previousButton.style.marginRight = '5px';
    previousButton.style.borderRadius = '5px';
    previousButton.disabled = currentStep === 0; // Disable if first step
    previousButton.style.backgroundColor = previousButton.disabled ? 'grey' : 'navy';
    previousButton.addEventListener('click', () => {
      popup.remove();
      setCurrentStep(currentStep - 1); // Move to previous step
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.style.padding = '5px 10px';
    nextButton.style.borderRadius = '5px';
    nextButton.disabled = currentStep === (selectedAction === '' ? steps : selectedAction === 'savedTemplates' ? steps3 : steps2).length - 1; // Disable if last step
    nextButton.style.backgroundColor = nextButton.disabled ? 'grey' : 'green';
    nextButton.addEventListener('click', () => {
      popup.remove();
      setCurrentStep(currentStep + 1); // Move to next step
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.marginTop = '20px';
    buttons.style.justifyContent = 'space-between';
    buttons.style.width = '100%';
    buttons.appendChild(closeButton);
    const flexEndButtons = document.createElement('div');
    flexEndButtons.style.display = 'flex';
    flexEndButtons.appendChild(previousButton);
    flexEndButtons.appendChild(nextButton);
    buttons.appendChild(flexEndButtons);
    popup.appendChild(buttons); // Insert the buttons after the text
  };

  const handleStartTutorial = () => {
    setTutorialActive(true);
    setCurrentStep(0); // Start from the first step
  };
  useEffect(() => {
    if (selectedAction === '') {
      if (tutorialActive && currentStep < steps.length) {
        showTutorial(steps[currentStep]);
      }
    }
    else if (selectedAction === 'savedTemplates') {
      if (tutorialActive && currentStep < steps3.length) {
        showTutorial(steps3[currentStep]);
      }
    }
    else {
      if (tutorialActive && currentStep < steps2.length) {
        showTutorial(steps2[currentStep]);
      }
    }
  }, [tutorialActive, currentStep]);

  const steps = [
    {
      index: 0,
      target: '.copy-button',
      content: 'Clicking here allow you to copy the scenario from submitted scenarios.',
      placement: 'right',
    },
    {
      index: 1,
      target: '.saved-button',
      content: 'Clicking here allow you to copy the scenario from saved scenarios.',
      placement: 'right',
    },
    {
      index: 2,
      target: '.saved-template',
      content: 'Clicking here allow you to see the scenario templates.',
      placement: 'right',
    },
    {
      index: 3,
      target: '.filter-button',
      content: 'To filter out the table based on the selected filters.',
      placement: 'right',
    }
  ];
  const steps2 = [
    {
      index: 0,
      target: '.copy-button',
      content: 'Clicking here allow you to copy the scenario from submitted scenarios.',
      placement: 'right',
    },
    {
      index: 1,
      target: '.saved-button',
      content: 'Clicking here allow you to copy the scenario from saved scenarios.',
      placement: 'right',
    },
    {
      index: 2,
      target: '.saved-template',
      content: 'Clicking here allow you to see the scenario templates.',
      placement: 'right',
    },
    {
      index: 3,
      target: '.filter-button',
      content: 'To filter out the table based on the selected filters.',
      placement: 'right',
    },
    {
      index: 4,
      target: '.create-button',
      content: 'Select all the filters and click here to create a new scenario.',
      placement: 'left',
    },
    {
      index: 5,
      target: '.select-button',
      content: 'Clicking here allow you to edit this scenario.',
      placement: 'left',
    }
  ];
  const steps3 = [
    {
      index: 0,
      target: '.copy-button',
      content: 'Clicking here allow you to copy the scenario from submitted scenarios.',
      placement: 'right',
    },
    {
      index: 1,
      target: '.saved-button',
      content: 'Clicking here allow you to copy the scenario from saved scenarios.',
      placement: 'right',
    },
    {
      index: 2,
      target: '.saved-template',
      content: 'Clicking here allow you to see the scenario templates.',
      placement: 'right',
    },
    {
      index: 3,
      target: '.filter-button',
      content: 'To filter out the table based on the selected filters.',
      placement: 'right',
    },
    {
      index: 4,
      target: '.folder-button',
      content: 'Clicking here allow you to use this template to create a scenario.',
      placement: 'right',
    }
  ];


  return (

    <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-25px' }}>

      <Typography
        className='tutorial-btn'
        variant="body2"
        sx={{ color: 'black', position: 'absolute', right: 0, cursor: 'pointer', mt: 4, mr: 2 }}
        onClick={() => handleStartTutorial()}
      >
        Show Tutorial
      </Typography>
      <h2>{getGreetingMessage()}, Please provide details for New Scenario Configuration</h2>

      {/* Add the three buttons with background colors */}
      <h4>Choose an option to build Scenario</h4>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button
          className='copy-button'
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
          className='saved-button'
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
          className='saved-template'
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
          className='filter-button'
          multiple
          id="forecast-cycle-autocomplete"
          options={forecastCycleOptions}
          disableCloseOnSelect // Only keep if needed for multi-select behavior
          getOptionLabel={(option) => option}
          value={forecastCycles}
          onChange={(event, newValue) => setForecastCycles(newValue)}
          onBlur={() => setForecastCycles([...forecastCycles])} // Force re-render to close
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
            <TextField {...params} size="small" label="Forecast Cycle" placeholder="Select forecast cycle(s)" />
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
            <TextField {...params} size="small" label="Country" placeholder="Select country(s)" />
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
            <TextField {...params} size="small" label="Therapeutic Area" placeholder="Select therapeutic area(s)" />
          )}
          sx={{ width: '300px' }}
        />
      </Box>


      {selectedAction === 'copySubmission' && (
        <TableContainer component={Paper} sx={{ mt: 3, maxWidth: '100%' }}>
          <Table aria-label="submission scenarios table" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Forecast Cycle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Country</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Therapeutic Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Last Modified</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Submitted by</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#e5f1fb' }}>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>Patient Flow</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{forecastCycles ? forecastCycles[0] : '-'}</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{countries[0] ? countries[0] : '-'}</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{therapeuticAreas[0] ? therapeuticAreas[0] : '-'}</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>-</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>-</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                    <Tooltip title="Review Scenario Summary">
                      <IconButton onClick={() => handleReviewScenarioSummary({ scenario: 'Paient Flow', cycle: forecastCycles[0], country: countries[0], area: therapeuticAreas[0], modified: '-', user: '-' }
                      )}>
                        <OpenInNewIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Review Scenario Details">
                      <IconButton onClick={() => handleReviewScenario({ scenario: 'Paient Flow', cycle: forecastCycles[0], country: countries[0], area: therapeuticAreas[0], modified: '-', user: '-' },
                      )} >
                        <AssessmentIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Select Scenario">
                      <Button
                        className='create-button'
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate("/new-model/epidemiology-model/scenario-details")}
                        disabled={!(forecastCycles.length > 0 && countries.length > 0 && therapeuticAreas.length > 0)}
                      >
                        Create
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              {filteredCopyData.map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e5f1fb' }}>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>Scenario {index + 1}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.forecastScenario}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.country}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.therapeuticArea}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.forecastStarted}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.username}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
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
                        <Button className="select-button" variant="contained" color="primary" size="small" onClick={() => handleSelectClick(row)}>
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
          <Table aria-label="saved scenarios table" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Scenario</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Forecast Cycle</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Country</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Therapeutic Area</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Last Modified</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Last Updated By</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '6px', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#e5f1fb' }}>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>Patient Flow</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{forecastCycles ? forecastCycles[0] : '-'}</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{countries[0] ? countries[0] : '-'}</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{therapeuticAreas[0] ? therapeuticAreas[0] : '-'}</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>-</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>-</TableCell>
                <TableCell sx={{ padding: '6px', textAlign: 'center' }}>
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                    <Tooltip title="Review Scenario Summary">
                      <IconButton onClick={() => handleReviewScenarioSummary({ scenario: 'Paient Flow', cycle: forecastCycles[0], country: countries[0], area: therapeuticAreas[0], modified: '-', user: '-' }
                      )}>
                        <OpenInNewIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Review Scenario Details">
                      <IconButton onClick={() => handleReviewScenario({ scenario: 'Paient Flow', cycle: forecastCycles[0], country: countries[0], area: therapeuticAreas[0], modified: '-', user: '-' },
                      )} >
                        <AssessmentIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Select Scenario">
                      <Button
                        className='create-button'
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => navigate("/new-model/epidemiology-model/forecastdeepdive")}
                        disabled={!(forecastCycles.length > 0 && countries.length > 0 && therapeuticAreas.length > 0)}
                      >
                        Create
                      </Button>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              {filteredSavedData.map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#e5f1fb' }}>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>Draft {index + 1}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.forecastScenario}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.country}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.therapeuticArea}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.forecastStarted}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>{row.username}</TableCell>
                  <TableCell sx={{ padding: '6px', textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
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
                        <Button className='select-button' variant="contained" color="primary" size="small" onClick={() => handleSelectClick(row)}>
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
                className='folder-button'
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
                    navigate('/new-model/epidemiology-model/model1', { state: { folder } });
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
