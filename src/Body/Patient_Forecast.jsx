import React, { useState, useEffect, useContext } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import produce from "immer";
import Select from '@mui/material/Select';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {
    TextField,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ListItemIcon,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Tooltip,
    Card,
    Box,
    Tabs,
    Tab,
    InputLabel
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdjustIcon from '@mui/icons-material/Adjust';
import './ProductListpage.scss';
import { MyContext } from './context';
import { ta } from 'date-fns/locale';
import { tab } from '@testing-library/user-event/dist/tab';

const Patient_Forecast = () => {
    const { countries, setCountries, storeValues, setStoreValues, } = useContext(MyContext); // Multi-select for countries
    const { therapeuticAreas, setTherapeuticAreas } = useContext(MyContext); // Multi-select for therapeutic areas
    const { forecastCycles, setForecastCycles } = useContext(MyContext); // Multi-select for forecast cycles
    const [formulaDetails, setFormulaDetails] = useState({ tableKey: null, tabKey: null, productId: null });
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProductName, setEditedProductName] = useState('');
    const { Formulas, setFormulas } = useContext(MyContext);
    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);
    const [openGrowthRateDialog, setOpenGrowthRateDialog] = useState(false);
    const [openStartEndDialog, setOpenStartEndDialog] = useState(false); // Dialog for Start and End values
    const [startValue, setStartValue] = useState(''); // Start value for Specify Start and Target Values
    const [endValue, setEndValue] = useState(''); // End value for Specify Start and Target Values
    const [selectedRowId, setselectedRowId] = useState(null);
    const { timePeriod, setTimePeriod } = useContext(MyContext);
    const navigate = useNavigate();
    const { values, setValues } = useContext(MyContext);
    const { values2, setValues2 } = useContext(MyContext);
    const { values3, setValues3 } = useContext(MyContext);
    const [UploadedFileToFill, setUploadedFileToFill] = useState(null);
    const [openUploadDialog, setOpenUploadDialog] = useState(false); // Dialog for file upload
    const { fromHistoricalDate, setFromHistoricalDate, fromForecastDate, setFromForecastDate } = useContext(MyContext);
    const { toForecastDate, setToForecastDate, } = useContext(MyContext);
    const [manualEntry, setManualEntry] = useState(false);
    const [growthRates, setGrowthRates] = useState([]);
    const [startingValue, setStartingValue] = useState('');
    const [selectedTab, setSelectedTab] = useState(null);
    const [initialGrowthRate, setInitialGrowthRate] = useState('');
    const [columns, setColumns] = useState([]);  // Column headers based on time period
    const [showCard, setShowCard] = useState(false);
    const [openInfoMethodDialog, setOpenInfoMethodDialog] = useState(false);
    const [showFormula, setShowFormula] = useState(false);
    const [formulaProductId, setFormulaProductId] = useState(null);
    const [tab_value, setTabValue] = useState(null);
    const { showTabs, setShowTabs } = useContext(MyContext);
    const { products, setProducts } = useContext(MyContext);
    const combinedProducts = useContext(MyContext);
    const [selectedValues, setSelectedValues] = useState([combinedProducts[0]?.name]); // Start with one dropdown, default to first product
    const [operators, setOperators] = useState(['+']); // State to store selected operators for each dropdown
    const [isCardEditing1, setIsCardEditing1] = useState(false);
    const [isCardEditing2, setIsCardEditing2] = useState(false);
    const [isCardEditing3, setIsCardEditing3] = useState(false);
    const { cardTitle1, setCardTitle1 } = useContext(MyContext);
    const [cardBody1, setCardBody1] = useState('Understand the spread of diseases and their impact.');
    const { cardTitle2, setCardTitle2 } = useContext(MyContext);
    const [cardBody2, setCardBody2] = useState('Overview of total patients diagnosed with GH.');
    const { cardTitle3, setCardTitle3 } = useContext(MyContext);
    const [cardBody3, setCardBody3] = useState('Adjust conversion factors for accurate data representation.');
    let [EditedCardTitle1, setEditedCardTitle1] = useState('Epidemiology');
    const [EditedCardBody1, setEditedCardBody1] = useState('Understand the spread of diseases and their impact.');
    const [EditedCardTitle2, setEditedCardTitle2] = useState('Total GH Patients');
    const [EditedCardBody2, setEditedCardBody2] = useState('Overview of total patients diagnosed with GH.');
    const [EditedCardTitle3, setEditedCardTitle3] = useState('Conversion Parameter');
    const [EditedCardBody3, setEditedCardBody3] = useState('Adjust conversion factors for accurate data representation.');
    const [text, setText] = useState({});
    const [text2, setText2] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [savedText, setSavedText] = useState({});
    const [savedText2, setSavedText2] = useState({});
    const { editingFormula, setEditingFormula, rowsData, setRowsData } = useContext(MyContext);
    const [tabTableVisibility, setTabTableVisibility] = useState({
        downside: { table1: false, table2: false, table3: false },
        base: { table1: false, table2: false, table3: false },
        upside: { table1: false, table2: false, table3: false },
    });

    const [selectedAction, setSelectedAction] = useState('');

    const [tutorialActive, setTutorialActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Track the current step in the tutorial

    /*A component that renders a box with three buttons: one to show the preview of the tables,
      one to close the preview and  "Show Dashboard" button to navigate to the dashboard. */
    const Preview = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ fontSize: '0.8rem' }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            const allVisible = Object.values(tabTableVisibility[currentTabKey]).every((value) => value);
                            if (allVisible) {
                                setTabTableVisibility((prev) => ({
                                    ...prev,
                                    [currentTabKey]: {
                                        table1: false,
                                        table2: false,
                                        table3: false,
                                    },
                                }));
                            } else {
                                setTabTableVisibility((prev) => ({
                                    ...prev,
                                    [currentTabKey]: {
                                        table1: true,
                                        table2: true,
                                        table3: true,
                                    },
                                }));
                            }
                        }}
                        color={
                            tabTableVisibility[currentTabKey].table1 &&
                                tabTableVisibility[currentTabKey].table2 &&
                                tabTableVisibility[currentTabKey].table3
                                ? 'error'
                                : 'primary'
                        }
                        sx={{ fontSize: '0.8rem' }}
                    >
                        {tabTableVisibility[currentTabKey].table1 &&
                            tabTableVisibility[currentTabKey].table2 &&
                            tabTableVisibility[currentTabKey].table3
                            ? 'Close Preview'
                            : 'Show Preview'}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate("/new-scenario/scenario-details/forecastdeepdive/analysis");
                        }}
                        color="success"
                        sx={{ fontSize: '0.8rem' }}
                    >
                        Analysis
                    </Button>
                </Box>
            </Box>
        );
    };
    const Card1 = () => {
        return (
            <>
                <Card
                    sx={{
                        width: '100%', // Make the card responsive
                        maxHeight: tabTableVisibility[currentTabKey].table1 ? 100 : 200,
                        maxWidth: tabTableVisibility[currentTabKey].table1 ? 200 : 360, // Set max width for the card
                        padding: 3,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#e3f2fd', // Light blue background for a healthcare feel
                        borderRadius: 2, // Rounded corners for a softer look
                        boxShadow: 3, // Add subtle shadow for depth
                        '&:hover': {
                            boxShadow: 6, // Increase shadow on hover for interactivity
                            transform: 'scale(1.02)', // Slight zoom effect on hover
                            transition: 'transform 0.4s ease, box-shadow 0.5s ease', // Smooth transition
                        },
                        transition: 'transform 0.4s ease, box-shadow 0.5s ease', // Smooth transition for hover
                    }}

                >
                    <Box sx={{ flexGrow: 1 }}>

                        {isCardEditing1 ? (
                            // If editing mode is active, display a TextField for the title with value linked to cardTitle1

                            <TextField
                                value={cardTitle1}
                                onChange={(e) => setCardTitle1(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: 1 }}
                            />
                        ) : (// If not in editing mode, display the card title
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0277bd' }}>
                                {cardTitle1}
                            </Typography>
                        )}

                        {isCardEditing1 ? (
                            // If editing mode is active, display a TextField for the body with value linked to cardBody1

                            <TextField
                                value={cardBody1}
                                onChange={(e) => setCardBody1(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginTop: 1 }}
                            />
                        ) : (// If not in editing mode, display the card body
                            <Typography variant="body2" sx={{ color: '#01579b', marginTop: 1 }}>
                                {tabTableVisibility[currentTabKey].table1 ? '' : cardBody1}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isCardEditing1 ? (
                            <> {/* If editing, show save and cancel buttons */}
                                <IconButton onClick={handleSaveClick1} color="primary">
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={cancelCardEditing1} color="secondary">
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <> {/* If not editing and table1 is not visible, show the edit button */}
                                {!tabTableVisibility[currentTabKey].table1 && (
                                    <IconButton onClick={startEditingCard1} sx={{ color: '#0277bd' }}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                {/* Toggle the visibility of table1 when the button is clicked */}
                                <IconButton
                                    aria-label='add'
                                    size="large"
                                    sx={{
                                        color: '#0277bd',
                                        backgroundColor: '#e1f5fe',
                                        borderRadius: '50%',
                                        '&:hover': {
                                            backgroundColor: '#b3e5fc',
                                        },
                                        transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                        transform: tabTableVisibility[currentTabKey].table1 ? 'rotate(45deg)' : 'rotate(0deg)', // Optional: rotate when toggling
                                    }}
                                    onClick={() => toggleTableVisibility(currentTabKey, 'table1')}

                                >  {/* Display either Add or Remove icon depending on table1 visibility */}
                                    {tabTableVisibility[currentTabKey].table1 ? <RemoveIcon className='open-card-selection' /> : <AddIcon className='card-selection' />}
                                </IconButton>
                            </>
                        )}
                    </Box>

                </Card>
            </>
        );
    };

    //Same logic as Card1
    const Card2 = () => {
        return (
            <>
                <Card
                    sx={{
                        width: '100%', // Make it responsive
                        maxHeight: tabTableVisibility[currentTabKey].table2 ? 100 : 200,
                        maxWidth: tabTableVisibility[currentTabKey].table2 ? 200 : 360,
                        padding: 3, // Add more padding for better layout
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffc5c5', // Light pink background
                        borderRadius: 2, // Rounded corners
                        boxShadow: 3, // Subtle shadow
                        '&:hover': {
                            boxShadow: 6, // Increased shadow on hover
                            transform: 'scale(1.02)', // Slight zoom effect
                            transition: 'transform 0.4s ease, box-shadow 0.5s ease', // Smooth transition
                        },
                        transition: 'transform 0.4s ease, box-shadow 0.5s ease', // Smooth transition for hover
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        {isCardEditing2 ? (
                            <TextField
                                value={cardTitle2}
                                onChange={(e) => setCardTitle2(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: 1 }}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                                {cardTitle2}
                            </Typography>
                        )}

                        {isCardEditing2 ? (
                            <TextField
                                value={cardBody2}
                                onChange={(e) => setCardBody2(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginTop: 1 }}
                            />
                        ) : (
                            <Typography variant="body2" sx={{ color: '#c2185b', marginTop: 1 }}>
                                {tabTableVisibility[currentTabKey].table2 ? '' : cardBody2}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isCardEditing2 ? (
                            <>
                                <IconButton onClick={handleSaveClick2} color="primary">
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={cancelCardEditing2} color="secondary">
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {!tabTableVisibility[currentTabKey].table2 && (
                                    <IconButton onClick={startEditingCard2} sx={{ color: '#c2185b' }}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                <IconButton
                                    aria-label='add'
                                    size="large"
                                    sx={{
                                        color: '#c2185b', // Matching button color to the card title
                                        backgroundColor: '#ffc5c5',
                                        borderRadius: '50%', // Circular button
                                        '&:hover': {
                                            backgroundColor: '#ff9999',
                                        },
                                        transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                        transform: tabTableVisibility[currentTabKey].table2 ? 'rotate(45deg)' : 'rotate(0deg)', // Optional: rotate when toggling
                                    }}
                                    onClick={() => toggleTableVisibility(currentTabKey, 'table2')}
                                >
                                    {tabTableVisibility[currentTabKey].table2 ? <RemoveIcon /> : <AddIcon />}
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Card>
            </>
        );
    };

    //Same logic as Card1
    const Card3 = () => {
        return (
            <>
                <Card
                    sx={{
                        width: '100%', // Make it responsive
                        maxHeight: tabTableVisibility[currentTabKey].table3 ? 100 : 200,
                        maxWidth: tabTableVisibility[currentTabKey].table3 ? 200 : 360,
                        padding: 3, // Add padding for better spacing
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#ffe6cc', // Soft light orange background
                        borderRadius: 2, // Rounded corners
                        boxShadow: 3, // Subtle shadow for depth
                        '&:hover': {
                            boxShadow: 6, // Increase shadow on hover
                            transform: 'scale(1.02)', // Slight zoom effect on hover
                            transition: 'transform 0.4s ease, box-shadow 0.5s ease', // Smooth transition on hover
                        },
                        transition: 'transform 0.4s ease, box-shadow 0.5s ease', // Smooth transition for hover
                    }}

                >
                    <Box sx={{ flexGrow: 1 }}>
                        {isCardEditing3 ? (
                            <TextField
                                value={cardTitle3}
                                onChange={(e) => setCardTitle3(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: 1 }}
                            />
                        ) : (
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d47d4c' }}>
                                {cardTitle3}
                            </Typography>
                        )}

                        {isCardEditing3 ? (
                            <TextField
                                value={cardBody3}
                                onChange={(e) => setCardBody3(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginTop: 1 }}
                            />
                        ) : (
                            <Typography variant="body2" sx={{ color: '#d47d4c', marginTop: 1 }}>
                                {tabTableVisibility[currentTabKey].table3 ? '' : cardBody3}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isCardEditing3 ? (
                            <>
                                <IconButton onClick={handleSaveClick3} color="primary">
                                    <CheckIcon />
                                </IconButton>
                                <IconButton onClick={cancelCardEditing3} color="secondary">
                                    <CloseIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                {!tabTableVisibility[currentTabKey].table3 && (
                                    <IconButton onClick={startEditingCard3} sx={{ color: '#d47d4c' }}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                <IconButton
                                    aria-label='add'
                                    size="large"
                                    sx={{
                                        color: '#d47d4c', // Match the color of the button with the title
                                        backgroundColor: '#ffe6cc', // Light peach button background
                                        borderRadius: '50%',
                                        '&:hover': {
                                            backgroundColor: '#ffcc99',
                                        },
                                        transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                        transform: tabTableVisibility[currentTabKey].table3 ? 'rotate(45deg)' : 'rotate(0deg)', // Optional: rotate when toggling
                                    }}
                                    onClick={() => toggleTableVisibility(currentTabKey, 'table3')}
                                >
                                    {tabTableVisibility[currentTabKey].table3 ? <RemoveIcon /> : <AddIcon />}
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Card>
            </>
        );
    };





    /* Handles saving the user's input in the 'info' dialog which opens when infoIcon is clicked.
     * Updates `savedText` and `savedText2` state with the new values and resets the editing state.*/
    const handleSave = (tabKey, tableKey) => {
        setSavedText((prev) => ({
            ...prev,
            [tabKey]: {
                ...prev[tabKey],
                [selectedRowId]: text[tabKey]?.[selectedRowId] || '',
            },
        }));
        setSavedText2((prev) => ({
            ...prev,
            [tabKey]: {
                ...prev[tabKey],
                [selectedRowId]: text2[tabKey]?.[selectedRowId] || '',
            },
        }));
        setOpenInfoMethodDialog(false);
        setIsEditing(false);
    };

    //Cancels the current edit session of the 'info' dialog by reverting the input values to their saved state and closing the info dialog.
    const handleCancel = (tabKey, tableKey) => {
        setText((prev) => ({
            ...prev,
            [tabKey]: {
                ...prev[tabKey],
                [selectedRowId]: savedText[tabKey]?.[selectedRowId] || '',
            },
        }));
        setText2((prev) => ({
            ...prev,
            [tabKey]: {
                ...prev[tabKey],
                [selectedRowId]: savedText2[tabKey]?.[selectedRowId] || '',
            },
        }));
        setOpenInfoMethodDialog(false);
        setIsEditing(false);
    };

    /*Renders a table within a Box component, allowing for product information
     * to be displayed and edited. Provides functionality for adding, editing,
     * and deleting rows, as well as inserting formulas and handling various input methods. */
    const renderTable = (tabKey, tableKey) => {
        const tableProducts = products[tabKey][tableKey]; // Get the correct products for this table

        return (
            <Box
                sx={{
                    maxHeight: '100%', // Set a fixed height for vertical scroll
                    maxWidth: '100%',
                    overflowY: 'auto', // Enable vertical scrolling
                    overflowX: 'auto', // Enable horizontal scrolling
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            >
                <table className="product-table" >
                    <thead>
                        <tr>
                            <th
                                style={{
                                    //position: 'sticky',
                                    left: 0,
                                    backgroundColor: 'red',
                                    zIndex: 2,
                                    width: '600px'
                                }}></th>
                            {columns.map((column) => (
                                <th className='date-table-header'
                                    style={{
                                        minWidth: '150px',
                                        backgroundColor:
                                            timePeriod === 'Year'
                                                ? dayjs(column).isBefore(dayjs(fromForecastDate), 'year')
                                                : dayjs(column).isBefore(dayjs(fromForecastDate), 'month')
                                                    ? '#C6F4D6' // Light green for columns between fromHistorical and fromForecast
                                                    : '#FFFFE0', // Light yellow for all other columns
                                    }}
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Iterate over the products in this table and render each one as a row in the table. */}
                        {tableProducts.map((product, index) => (
                            <tr key={product.id}>
                                <td >
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '0.1fr 0.1fr 1fr 0.1fr 0.1fr 0.1fr 0.1fr',
                                        justifyContent: 'center', alignItems: 'center', width: '720px'
                                    }}>
                                        <Tooltip title="Source Info" placement="top" >
                                            <IconButton className='info-button' color="info" onClick={() => {

                                                // Store the id of the selected row
                                                setselectedRowId(product.id);
                                                setOpenInfoMethodDialog(true);

                                            }}>
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Data Input" placement="top">
                                            <IconButton className='data-input-button' color="primary" onClick={() => {
                                                setSelectedTab(tabKey);
                                                setselectedRowId(product.id);
                                                setOpenInputMethodDialog(true);
                                            }}>
                                                <CloudUploadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {editingProductId === product.id ? (
                                            <>
                                                <TextField
                                                    value={editedProductName}
                                                    onChange={(e) => setEditedProductName(e.target.value)}
                                                    variant="outlined"
                                                    size="small"

                                                />
                                                <IconButton onClick={() => handleSaveClick(product.id, tabKey, tableKey)} color="primary">
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton onClick={handleCancelClick} color="secondary">
                                                    <CloseIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <span
                                                    style={{
                                                        marginLeft: '8px',
                                                        overflow: 'auto',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {product.name}
                                                </span>

                                                <Tooltip title="Edit Row Name" placement="top" >
                                                    <IconButton onClick={() => handleEditClick(product.id, tabKey, tableKey)} style={{ marginLeft: '8px' }} className='edit-row-name'>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {index !== tableProducts.length - 1 ? (
                                                    <Tooltip title="Add Row" placement="top" >
                                                        <IconButton onClick={() => handleAddRow(tabKey, tableKey, product.id)} style={{ marginLeft: '8px' }} className='add-row'>
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <IconButton style={{ marginLeft: '8px', color: 'lightgrey' }} disabled>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                <Tooltip title="Insert Formula" placement="top" >
                                                    <IconButton className='insert-formula' onClick={() => {
                                                        setFormulaDetails({ tableKey, tabKey, productId: product.id }); setFormulaProductId(product.id); setShowFormula(true);
                                                    }} style={{ marginLeft: '4px' }}
                                                    >
                                                        <CalculateIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="Delete Row" placement="top" >
                                                    <IconButton className='delete-row' onClick={() => handleDeleteRow(product.id, tabKey, tableKey)} style={{ marginLeft: '8px' }} >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>

                                            </>
                                        )}
                                    </div>
                                </td>
                                {/* Render table cells for each date column, with a TextField for inputting values. 
                                    The value is retrieved from the state based on the tabKey and productId. 
                                    When the value changes, the handleValueChange function is called to update the state. 
                                */}
                                {columns.map((date) => (
                                    <td key={date}>
                                        <TextField
                                            className='manual-input'
                                            type="number"
                                            value={
                                                tabKey === 'downside'
                                                    ? values[product.id]?.[date] || ''
                                                    : tabKey === 'base'
                                                        ? values2[product.id]?.[date] || ''
                                                        : values3[product.id]?.[date] || ''
                                            }
                                            onChange={(e) => {
                                                console.log("is the tabkey");
                                                handleValueChange(tabKey, product.id, date, e.target.value);

                                            }}
                                            variant="outlined"
                                            size="small"
                                            placeholder="Enter value"
                                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* This is the formula dialog  which is displayed when the insert formula icon is clicked*/}
                {showFormula && (
                    <Dialog
                        open={showFormula}
                        onClose={() => setShowFormula(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        fullWidth
                        maxWidth="sm"
                        BackdropProps={{
                            style: {
                                zIndex: 1400,
                                backgroundColor: 'rgba(0,0,0,0.2)', // Make backdrop slightly dark and transparent
                            },
                        }}

                        PaperProps={{
                            sx: {
                                zIndex: 1600,
                                borderRadius: '12px',
                                boxShadow: 4,
                                overflow: 'hidden',
                            },
                        }}

                    >
                        <DialogTitle sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.8rem',
                            color: '#1976d2',
                            bgcolor: '#f0f4fa',
                            padding: '20px',
                            borderRadius: '12px 12px 0 0'
                        }}
                            id="alert-dialog-title">Formula for row: {products[formulaDetails.tabKey][formulaDetails.tableKey].find(product => product.id === formulaDetails.productId)?.name}</DialogTitle>
                        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                            <br></br>
                            <br></br>
                            {/* Render each dropdown dynamically based on selectedValues and operators */}
                            {editingFormula[formulaDetails.tabKey]?.[formulaDetails.tableKey]?.[formulaDetails.productId]?.emptyArray?.map((selectedValue, index) => (
                                <div key={index} style={{ width: 400, display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                    {/* Operator Dropdown on the left */}

                                    {index > 0 && (
                                        <FormControl style={{ width: 100, marginRight: 8 }}>
                                            <InputLabel id={`operator-label-${index}`}>Operator</InputLabel>
                                            <Select
                                                labelId={`operator-label-${index}`}
                                                id={`operator-${index}`}
                                                value={editingFormula[formulaDetails.tabKey][formulaDetails.tableKey][formulaDetails.productId].plusArray[index]}
                                                onChange={(e) => handleSelectChange(formulaDetails.productId, tabKey, tableKey, index, 'operator', e)}
                                                label="Operator"
                                            >
                                                <MenuItem value="+">+</MenuItem>
                                                <MenuItem value="-">-</MenuItem>
                                                <MenuItem value="*">*</MenuItem>
                                                <MenuItem value="/">/</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}

                                    {/* Formula Dropdown on the right */}
                                    <FormControl fullWidth style={{ flexGrow: 1 }}>
                                        <InputLabel id={`select-label-${index}`}>Select column {index + 1}</InputLabel>
                                        <Select
                                            labelId={`select-label-${index}`}
                                            id={`select-${index}`}
                                            value={editingFormula[formulaDetails.tabKey][formulaDetails.tableKey][formulaDetails.productId].emptyArray[index]}
                                            onChange={(e) => handleSelectChange(formulaDetails.productId, formulaDetails.tabKey, formulaDetails.tableKey, index, 'formula', e)}
                                            label={`Select Formula ${index + 1}`}
                                        >
                                            {Object.keys(products[formulaDetails.tabKey]).map((tableKey) => (
                                                products[formulaDetails.tabKey][tableKey].map((product) => (
                                                    <MenuItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </MenuItem>
                                                ))
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {/* Delete Button */}
                                    {<IconButton
                                        onClick={() => handleDeleteDropdown(formulaDetails.tabKey, formulaDetails.tableKey, formulaDetails.productId, index)}
                                        color="secondary"
                                        style={{ marginLeft: 8 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>}
                                </div>
                            ))}

                            {/* Button to add a new dropdown */}
                            <Button onClick={() => handleAddDropdown(formulaDetails.tabKey, formulaDetails.tableKey, formulaDetails.productId)} color="primary" fullWidth>
                                Add New Dropdown
                            </Button>
                        </DialogContent>

                        <DialogActions >
                            <Button onClick={() => handleCancelFormula(formulaDetails.tabKey, formulaDetails.tableKey, formulaDetails.productId)} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                                Cancel
                            </Button>
                            <Button color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }} onClick={() => handleApply(formulaDetails.tabKey, formulaDetails.tableKey, formulaDetails.productId)}>
                                Apply
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}

                {/* This dialog is used to input the data source information which is displayed when infoIcon is clicked */}
                {openInfoMethodDialog && (
                    <Dialog
                        open={openInfoMethodDialog}
                        onClose={() => setOpenInfoMethodDialog(false)}
                        maxWidth="sm"
                        fullWidth
                        BackdropProps={{
                            style: {
                                zIndex: 1400,
                                backgroundColor: 'rgba(0,0,0,0.2)', // Make backdrop slightly dark and transparent
                            },
                        }}

                        PaperProps={{
                            sx: {
                                zIndex: 1600,
                                borderRadius: '12px',
                                boxShadow: 4,
                                overflow: 'hidden',
                            },
                        }}
                    >
                        <DialogTitle
                            sx={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.8rem',
                                color: '#1976d2',
                                bgcolor: '#f0f4fa',
                                padding: '20px',
                            }}
                        >
                            Data Source
                        </DialogTitle>
                        <DialogContent sx={{ padding: '24px', backgroundColor: '#fafafa' }}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {/* Manual Input */}
                                <ListItem
                                    button
                                    sx={{
                                        padding: '18px',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        cursor: 'pointer', // Adds hand cursor on hover
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd',
                                            transform: 'scale(1.02)',
                                            transition: 'transform 0.2s',
                                        },
                                    }}
                                >
                                    <ListItemText primary="Source Name" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium', whiteSpace: 'nowrap' }} />
                                    <ListItem
                                        sx={{
                                            padding: '10px',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        {/* This is where the user inputs the source name */}
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            placeholder="Enter Source Name"
                                            InputProps={{
                                                sx: {
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'medium',
                                                    marginLeft: '10px'
                                                },
                                            }}
                                            value={text[tabKey]?.[selectedRowId] ?? ''}
                                            onChange={(e) =>
                                                setText((prev) => ({
                                                    ...prev,
                                                    [tabKey]: {
                                                        ...prev[tabKey],
                                                        [selectedRowId]: e.target.value,
                                                    },
                                                }))
                                            }
                                        />
                                    </ListItem>
                                </ListItem>
                                <ListItem
                                    button
                                    sx={{
                                        padding: '18px',
                                        borderBottom: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        cursor: 'pointer', // Adds hand cursor on hover
                                        '&:hover': {
                                            backgroundColor: '#e3f2fd',
                                            transform: 'scale(1.02)',
                                            transition: 'transform 0.2s',
                                        },
                                    }}
                                >
                                    <ListItemText primary="Source Link/Upload" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />

                                    {/* This is where the user inputs the source link or uploads a file */}
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        placeholder="Enter Source Link/Upload File"
                                        InputProps={{
                                            sx: {
                                                fontSize: '1.1rem',
                                                fontWeight: 'medium',
                                                //width: '350px',
                                                //marginLeft: '10px'
                                            },
                                        }}
                                        value={text2[tabKey]?.[selectedRowId] ?? ''}
                                        onChange={(e) =>
                                            setText2((prev) => ({
                                                ...prev,
                                                [tabKey]: {
                                                    ...prev[tabKey],
                                                    [selectedRowId]: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                    <ListItemIcon sx={{ minWidth: 'unset' }}>
                                        <Tooltip title="Upload file" marginLeft="20px">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                component="label"
                                                sx={{
                                                    borderRadius: 1,
                                                    marginLeft: '15px',
                                                    marginBottom: '5px',
                                                    marginTop: '5px'
                                                }}
                                                startIcon={<UploadIcon />}
                                            >
                                                <Typography variant="caption">Upload</Typography>
                                                <input
                                                    type="file"
                                                    hidden
                                                //accept=".crx"
                                                />
                                            </Button>
                                        </Tooltip>
                                    </ListItemIcon>
                                </ListItem>
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={() => handleSave(tabKey, tableKey)}>
                                Save
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => handleCancel(tabKey, tableKey)}>
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
                {
                    <>
                        {/*This section of the code handles the "Select Data Input Method" dialog*/}
                        {<Dialog
                            open={openInputMethodDialog}
                            onClose={() => {
                                setOpenInputMethodDialog(false); // Close the "Select Data Input Method" dialog
                            }}
                            maxWidth="sm"
                            fullWidth
                            BackdropProps={{
                                style: {
                                    zIndex: 1400,
                                    backgroundColor: 'rgba(0,0,0,0.2)', // Make backdrop slightly dark and transparent
                                },
                            }}

                            PaperProps={{
                                sx: {
                                    zIndex: 1600,
                                    borderRadius: '12px',
                                    boxShadow: 4,
                                    overflow: 'hidden',
                                },
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '1.8rem',
                                    color: '#1976d2',
                                    bgcolor: '#f0f4fa',
                                    padding: '20px',
                                }}
                            >
                                Select Data Input Method
                            </DialogTitle>
                            <DialogContent sx={{ padding: '24px', backgroundColor: '#fafafa' }}>
                                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                    {/* Manual Input */}
                                    <ListItem
                                        button
                                        onClick={() => handleInputMethodSelect('manual')}
                                        sx={{
                                            padding: '18px',
                                            borderBottom: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            cursor: 'pointer', // Adds hand cursor on hover
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                transform: 'scale(1.02)',
                                                transition: 'transform 0.2s',
                                            },
                                        }}
                                    >
                                        <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                            1.
                                        </Typography>
                                        <InfoIcon color="primary" sx={{ marginRight: '12px' }} />
                                        <ListItemText primary="Input Values Manually" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                                    </ListItem>

                                    {/* Copy from Input Page */}
                                    <ListItem
                                        button
                                        onClick={handleCopyFromInputPage}
                                        sx={{
                                            padding: '18px',
                                            borderBottom: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            cursor: 'pointer', // Adds hand cursor on hover
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                transform: 'scale(1.02)',
                                                transition: 'transform 0.2s',
                                            },
                                        }}
                                    >
                                        <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                            2.
                                        </Typography>
                                        <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                                        <ListItemText primary="Copy from Input Page" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                                    </ListItem>

                                    {/* File Upload */}
                                    <Tooltip title="Only .csv or .xlsx formats allowed" arrow>
                                        <ListItem
                                            button
                                            onClick={() => handleInputMethodSelect('file')}
                                            sx={{
                                                padding: '18px',
                                                borderBottom: '1px solid #e0e0e0',
                                                borderRadius: '8px',
                                                marginBottom: '12px',
                                                cursor: 'pointer', // Adds hand cursor on hover
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                    transform: 'scale(1.02)',
                                                    transition: 'transform 0.2s',
                                                },
                                            }}
                                        >
                                            <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                                3.
                                            </Typography>
                                            <UploadFileIcon color="primary" sx={{ marginRight: '12px' }} />
                                            <ListItemText primary="Upload Data File" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                                        </ListItem>
                                    </Tooltip>

                                    {/* Growth Rate */}
                                    <ListItem
                                        button
                                        onClick={() => handleInputMethodSelect('growthRate')}
                                        sx={{
                                            padding: '18px',
                                            borderBottom: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            cursor: 'pointer', // Adds hand cursor on hover
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                transform: 'scale(1.02)',
                                                transition: 'transform 0.2s',
                                            },
                                        }}
                                    >
                                        <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                            4.
                                        </Typography>
                                        <TrendingUpIcon color="primary" sx={{ marginRight: '12px' }} />
                                        <ListItemText primary="Set Initial Values with Growth Rate" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                                    </ListItem>

                                    {/* Start and End Values */}
                                    <ListItem
                                        button
                                        onClick={() => handleInputMethodSelect('startEndValues')}
                                        sx={{
                                            padding: '18px',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            cursor: 'pointer', // Adds hand cursor on hover
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                                transform: 'scale(1.02)',
                                                transition: 'transform 0.2s',
                                            },
                                        }}
                                    >
                                        <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                            5.
                                        </Typography>
                                        <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                                        <ListItemText primary="Specify Starting and Target Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                                    </ListItem>


                                    {/*Copy from Input Page*/}

                                </List>
                            </DialogContent>
                            <DialogActions sx={{ padding: '16px', backgroundColor: '#f0f4fa' }}>
                                <Button onClick={() => { setOpenInputMethodDialog(false); }} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>}

                        {/* Specify Start and End Values Dialog */}
                        <Dialog open={openStartEndDialog} onClose={() => { setOpenStartEndDialog(false); }} maxWidth="sm" fullWidth>
                            <DialogTitle>Specify Start and Target Values</DialogTitle>
                            <DialogContent sx={{ paddingTop: '15px' }}>
                                {/* 
                                    This box contains two text fields for the start and end values.
                                    The start value is the initial value , and the end value is the target value.
                                    The values are validated to only allow numbers.
                                */}
                                <Box marginTop='25px' display="flex" gap="16px" alignItems="center">
                                    <TextField
                                        label="Start Value"
                                        type="number"
                                        value={startValue}
                                        onChange={(e) => setStartValue(e.target.value)}
                                        size="small"
                                        fullWidth
                                    />
                                    <TextField
                                        label="End Value"
                                        type="number"
                                        value={endValue}
                                        onChange={(e) => setEndValue(e.target.value)}
                                        size="small"
                                        fullWidth
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={() => { handleSaveStartEndValues(tabKey, startValue, endValue) }} color="primary">
                                    Save
                                </Button>
                                <Button onClick={() => { setOpenStartEndDialog(false); }} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* File Upload Dialog */}
                        <Dialog open={openUploadDialog} onClose={handleUploadDialogClose} maxWidth="sm" fullWidth>

                            <DialogTitle style={{ cursor: 'pointer' }}>
                                {/* The title of the dialog. Clicking on the title will show a tooltip 
                                    with a link to download a demo file */}
                                Upload Data File
                                <Typography variant="subtitle2" component="span" sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'blue', textDecoration: 'underline', display: 'block', marginTop: '10px' }}
                                    onClick={() => {
                                        /* Create a link element and set the href attribute to the URL of the demo file. 
                                           The demo file is either a monthly or yearly file, depending on the value of timePeriod. */
                                        const link = document.createElement('a');
                                        link.href = timePeriod === 'Monthly' ? '/demo_file_1.csv' : '/demo_file_1_year.csv';
                                        link.setAttribute('download', timePeriod === 'Monthly' ? 'demo_file_1.csv' : 'demo_file_1_year.csv');
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    onMouseOver={(e) => e.target.style.cursor = 'pointer'}
                                >
                                    {/* The text of the link. The text is either "see the demo file (monthly)" or
                                     "see the demo file (yearly)" depending on the value of timePeriod. */}
                                    see the demo file ({timePeriod === 'Monthly' ? 'monthly' : 'yearly'})
                                </Typography>
                            </DialogTitle>
                            <Tooltip title="Only .csv or .xlsx formats allowed" arrow>

                                <DialogContent sx={{ paddingTop: '15px' }}>
                                    <Box sx={{ paddingTop: '15px' }} display="flex" flexDirection="column" gap="16px">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            fullWidth
                                            component="label"
                                        >
                                            {/* The button to select a file from local storage */}
                                            Select File from Local Storage
                                            <input
                                                type="file"
                                                accept=".csv"
                                                hidden
                                                onChange={(e) => { setUploadedFileToFill(e.target.files[0]) }}
                                            />
                                        </Button>
                                        <Typography
                                            align="center"
                                            sx={{ color: 'green' }}
                                        >
                                            {/* The text to display when a file has been uploaded successfully */}
                                            {UploadedFileToFill !== null ? "file uploaded successfully" : ""}
                                        </Typography>
                                        <Button variant="outlined" color="primary" fullWidth>
                                            {/* The button to select a file from AWS/Azure */}
                                            Select File from AWS/Azure
                                        </Button>
                                    </Box>
                                </DialogContent>
                            </Tooltip>
                            <DialogActions>
                                <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                                    Cancel
                                </Button>
                                <Button onClick={() => handlefilefillfromupload(selectedRowId, tabKey)} color="primary">
                                    Save
                                </Button>
                                <Button onClick={handleUploadDialogClose} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Growth Rate Entry Dialog */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Dialog open={openGrowthRateDialog} onClose={() => { setOpenGrowthRateDialog(false); }} maxWidth="sm" fullWidth>
                                <DialogTitle sx={{ paddingTop: '20px' }}>Set Initial Values and Growth Rate</DialogTitle>
                                <DialogContent sx={{ paddingTop: '15px' }}>
                                    <Box display="flex" alignItems="center" gap="16px" mb={2} sx={{ paddingTop: '20px' }}>
                                        {/* Start Month/Year picker. Disable editing, and limit the date range to the given period. */}
                                        <DatePicker
                                            views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                            label={timePeriod === 'Monthly' ? 'Start Month' : 'Start Year'}
                                            value={fromHistoricalDate} // Auto-populated
                                            disabled
                                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                            slotProps={{ textField: { size: 'small' } }}
                                            style={{ minWidth: '120px' }}
                                        />
                                        {/* Starting Value input field. User can edit value. */}
                                        <TextField
                                            label="Starting Value"
                                            type="number"
                                            value={startingValue}
                                            onChange={(e) => setStartingValue(e.target.value)}
                                            size="small"
                                            style={{ minWidth: '120px' }}
                                        />
                                        {/* Initial Growth Rate input field. User can edit value. */}
                                        <TextField
                                            label="Initial Growth Rate (%)"
                                            type="number"
                                            value={initialGrowthRate}
                                            onChange={(e) => setInitialGrowthRate(e.target.value)}
                                            size="small"
                                            style={{ minWidth: '120px' }}
                                        />
                                        {/* Add button to add a new growth rate entry. */}
                                        <IconButton onClick={handleAddGrowthRate} color="primary">
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                    {/* Show all the growth rate entries. Each entry is a Box with a DatePicker, TextField, and Remove button. */}
                                    {growthRates.map((entry, index) => (
                                        <Box key={index} display="flex" alignItems="center" gap="16px" mb={2}>
                                            {/* Next Month/Year picker. User can select a date within the given period. */}
                                            <DatePicker
                                                views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                                label={timePeriod === 'Monthly' ? 'Next Month' : 'Next Year'}
                                                value={entry.startDate}
                                                onChange={(newValue) => handleGrowthRateChange(index, 'startDate', newValue)}
                                                format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                                slotProps={{ textField: { size: 'small' } }}
                                                style={{ minWidth: '120px' }}
                                                minDate={getMinDate(index)} //The user cannot select a Date that is before the Start Date
                                                maxDate={toForecastDate} //The user cannot select a Start Date that is after the End Date
                                            />
                                            {/* Growth Rate input field. User can edit value. */}
                                            <TextField
                                                label="Growth Rate (%)"
                                                type="number"
                                                value={entry.growthRate}
                                                onChange={(e) => handleGrowthRateChange(index, 'growthRate', e.target.value)}
                                                size="small"
                                                style={{ minWidth: '120px' }}
                                            />
                                            <IconButton onClick={() => handleRemoveGrowthRate(index)} color="secondary">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </DialogContent>
                                <DialogActions>

                                    <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                                        Cancel
                                    </Button>

                                    <Button onClick={() => { handleSaveGrowthRate(tabKey, selectedRowId, startingValue, initialGrowthRate, growthRates) }} color="primary">
                                        Save
                                    </Button>

                                    <Button onClick={() => { setOpenGrowthRateDialog(false); }} color="primary">
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </LocalizationProvider>
                    </>
                }
            </Box >
        );
    };


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);

        // Reset visibility of all tables when tab changes
        const tabKey = newValue === 0 ? 'downside' : newValue === 1 ? 'base' : 'upside';
        setTabTableVisibility((prev) => ({
            ...prev,
            [tabKey]: { table1: false, table2: false, table3: false }, // Reset table visibility
        }));
    };

    /*Toggle the visibility of a specific table in a tab. If the table is visible, hide it. If it is hidden, show it.*/
    const toggleTableVisibility = (tabKey, tableKey) => {
        setTabTableVisibility((prev) => ({
            ...prev,
            [tabKey]: {
                ...prev[tabKey],
                [tableKey]: !prev[tabKey][tableKey], // Toggle specific table visibility
            },
        }));
    };

    const currentTabKey = tab_value === 0 ? 'downside' : tab_value === 1 ? 'base' : 'upside';

    //Start editing card 1
    const startEditingCard1 = () => {
        setEditedCardTitle1(cardTitle1);
        setEditedCardBody1(cardBody1);
        setIsCardEditing1(true);
    };

    /* Handles the save action for card 1. Updates the edited card title and body with the current values 
    and exits the editing state.*/
    const handleSaveClick1 = () => {
        setIsCardEditing1(false);
        setEditedCardTitle1(cardTitle1);
        setEditedCardBody1(cardBody1);
    };

    const cancelCardEditing1 = () => {
        setIsCardEditing1(false)
        setCardTitle1(EditedCardTitle1);
        setCardBody1(EditedCardBody1);

    };


    // Start editing card 2
    const startEditingCard2 = () => {
        setEditedCardTitle2(cardTitle2);
        setEditedCardBody2(cardBody2);
        setIsCardEditing2(true);
    };

    /* Handles the save action for card 2. Updates the edited card title and body with the current values 
    and exits the editing state.*/
    const handleSaveClick2 = () => {
        setIsCardEditing2(false);
        setEditedCardTitle2(cardTitle2);
        setEditedCardBody2(cardBody2);
    };

    const cancelCardEditing2 = () => {
        setIsCardEditing2(false)
        setCardTitle2(EditedCardTitle2);
        setCardBody2(EditedCardBody2);

    };

    // Start editing card 3
    const startEditingCard3 = () => {
        setEditedCardTitle3(cardTitle3);
        setEditedCardBody3(cardBody3);
        setIsCardEditing3(true);
    };



    /* Handles the save action for card 3. Updates the edited card title and body with the current values 
       and exits the editing state.*/
    const handleSaveClick3 = () => {
        setIsCardEditing3(false);
        setEditedCardTitle3(cardTitle3);
        setEditedCardBody3(cardBody3);
    };

    const cancelCardEditing3 = () => {
        setIsCardEditing3(false)
        setCardTitle3(EditedCardTitle3);
        setCardBody3(EditedCardBody3);

    };


    // Handle changes for any dropdown (formula or operator)
    const handleSelectChange = (row_id, tabKey, tableKey, index, type, event) => {
        const newValue = event.target.value;
        setEditingFormula((prevDict) =>
            produce(prevDict, (draft) => {
                const row = draft[tabKey]?.[tableKey]?.[row_id];
                if (row) {
                    if (type === "operator") {
                        row.plusArray[index] = newValue;
                    } else {
                        row.emptyArray[index] = newValue;
                    }
                }
            })
        );
    };

    // Handle adding a new dropdown
    const handleAddDropdown = (tabKey, tableKey, row_id) => {
        setEditingFormula((prevDict) => ({
            ...prevDict,
            [tabKey]: {
                ...prevDict[tabKey],
                [tableKey]: {
                    ...prevDict[tabKey][tableKey],
                    [row_id]: {
                        emptyArray: [...prevDict[tabKey][tableKey][row_id].emptyArray, ''],
                        plusArray: [...prevDict[tabKey][tableKey][row_id].plusArray, '+'],
                    },
                },
            },
        }));
    };

    // Handle deleting a dropdown
    const handleDeleteDropdown = (tabKey, tableKey, row_id, index) => {
        setEditingFormula((prevDict) => ({
            ...prevDict,
            [tabKey]: {
                ...prevDict[tabKey],
                [tableKey]: {
                    ...prevDict[tabKey][tableKey],
                    [row_id]: {
                        emptyArray: prevDict[tabKey][tableKey][row_id].emptyArray.filter((_, i) => i !== index),
                        plusArray: prevDict[tabKey][tableKey][row_id].plusArray.filter((_, i) => i !== index),
                    },
                },
            },
        }));
    };

    // Handle applying the selected formula(s)
    const handleApply = (tabKey, tableKey, row_id) => {
        const selectedIds = editingFormula[tabKey][tableKey][row_id].emptyArray
        const operatorsList = editingFormula[tabKey][tableKey][row_id].plusArray
        // Slice the operators array to exclude the first element (which is the default "+")
        const operatorSliced = operatorsList.slice(1);
        let res = {}; // Object to store the results of the forecast calculation
        if (timePeriod === 'Monthly') {
            // Loop through the months in the time period and create a key for each in the results object
            // if the key doesn't already exist
            for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'month') + 1; i++) {
                const month = dayjs(fromHistoricalDate).add(i, 'month').format('MMM-YYYY');
                if (!res[month]) {
                    res[month] = "0";
                }
            }
        }
        else {
            for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'year') + 1; i++) {
                const year = dayjs(fromHistoricalDate).add(i, 'year').format('YYYY');
                if (!res[year]) {
                    res[year] = "0";
                }
            }
        }
        // Get the first selected product's id
        const idd = selectedIds[0];
        console.log("id", idd);
        // Get the first selected product's values based on the current tabKey
        const val = tabKey === 'downside' ? values[idd] : tabKey === 'base' ? values2[idd] : values3[idd];
        console.log("val", val);
        // If the product has values, loop through its values and add them to the results object
        if (val !== undefined) {
            Object.keys(val).forEach((key) => {
                res[key] = val[key];
            });
        }

        // Iterate over the selected product IDs starting from the second element
        for (let i = 1; i < selectedIds.length; i++) {
            const id = selectedIds[i];
            const tempval = tabKey === 'downside' ? values[id] : tabKey === 'base' ? values2[id] : values3[id];

            // If the product values exist, perform calculations based on the selected operator
            if (tempval !== undefined) {
                Object.keys(tempval).forEach((key) => {
                    const currentOperator = operatorSliced[i - 1];
                    const resValue = parseFloat(res[key], 10);
                    const tempValue = parseFloat(tempval[key], 10);

                    if (currentOperator == '+') {
                        res[key] = resValue + tempValue;
                    } else if (currentOperator == '-') {
                        res[key] = resValue - tempValue;
                    } else if (currentOperator == '*') {
                        res[key] = resValue * tempValue;
                    } else if (currentOperator == '/') {
                        res[key] = resValue / tempValue;
                    }
                });
            }
        }
        // Update values based on tabKey and calculated results
        if (tabKey === 'downside') {
            setValues((prevValues) => ({
                ...prevValues,
                [row_id]: Object.keys(res).reduce((acc, date) => {
                    acc[date] = !res[date] || res[date] === 0 ? '0' : res[date];
                    return acc;
                }, {})
            }));
        }
        else if (tabKey === 'base') {
            setValues2((prevValues) => ({
                ...prevValues,
                [row_id]: Object.keys(res).reduce((acc, date) => {
                    acc[date] = !res[date] || res[date] === 0 ? '0' : res[date];
                    return acc;
                }, {})
            }));
        }
        else {
            setValues3((prevValues) => ({
                ...prevValues,
                [row_id]: Object.keys(res).reduce((acc, date) => {
                    acc[date] = !res[date] || res[date] === 0 ? '0' : res[date];
                    return acc;
                }, {})
            }));
        }
        setFormulas(editingFormula);
        setShowFormula(false);
        const dataToDownload = {
            values,
            values2,
            values3,
        };
        const filename = "patient_forecast_data.json";
        const json = JSON.stringify(dataToDownload);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };




    const handleCancelFormula = (tabKey, tableKey, row_id) => {
        setEditingFormula(Formulas);
        setShowFormula(false);
    }

    /* Handles clicking the edit button for a product. Finds the product by id in the
    * table for the given tabKey and tableKey, and sets the editing state to true
    * with the product's id and name. */
    const handleEditClick = (productId, tabKey, tableKey) => {
        // Find the product by id in the table for the given tabKey and tableKey
        const product = products[tabKey][tableKey].find((prod) => prod.id === productId);

        if (product) {
            setEditingProductId(product.id);
            setEditedProductName(product.name);
        }
    };
    /* Handles saving a product name after editing. Updates the product's name and resets the editing state.*/
    const handleSaveClick = (productId, tabKey, tableKey) => {
        // Get the current list of products for the specific tab and table
        const tableProducts = products[tabKey][tableKey];

        // Update the product's name with the edited name
        const updatedProducts = tableProducts.map((product) =>
            product.id === productId ? { ...product, name: editedProductName } : product
        );

        // Update the state with the new product list
        setProducts((prevProducts) => ({
            ...prevProducts,
            [tabKey]: {
                ...prevProducts[tabKey],
                [tableKey]: updatedProducts, // Update the correct table for this tab
            },
        }));

        // Reset editing state
        setEditingProductId(null);
        setEditedProductName('');
    };

    const handleAddRow = (tabKey, tableKey, productId) => {
        const tableProducts = products[tabKey]?.[tableKey] || []; // Safeguard access

        const index = tableProducts.findIndex((product) => product.id === productId);
        const generateUniqueId = () => `${tableKey}-${Date.now()}`;

        const newProduct = {
            id: generateUniqueId(),
            name: `New Product ${Date.now()}`,
        };

        const updatedProducts =
            index === -1
                ? [...tableProducts, newProduct] // Add to end if no valid index
                : [
                    ...tableProducts.slice(0, index + 1), // Insert below the clicked product
                    newProduct,
                    ...tableProducts.slice(index + 1),
                ];

        // Ensure products object is extensible
        setProducts((prevProducts) => {
            const newProducts = { ...prevProducts };
            newProducts[tabKey] = {
                ...newProducts[tabKey],
                [tableKey]: updatedProducts,
            };
            return newProducts;
        });
        // Update the formulas and editing formulas with the new row
        setFormulas((prevFormulas) => ({
            ...prevFormulas,
            [tabKey]: {
                ...prevFormulas[tabKey],
                [tableKey]: {
                    ...prevFormulas[tabKey][tableKey],
                    [newProduct.id]: { emptyArray: [""], plusArray: ["+"] }
                }
            }
        }));
        setEditingFormula((prevEditingFormulas) => ({
            ...prevEditingFormulas,
            [tabKey]: {
                ...prevEditingFormulas[tabKey],
                [tableKey]: {
                    ...prevEditingFormulas[tabKey][tableKey],
                    [newProduct.id]: { emptyArray: [""], plusArray: ["+"] }
                }
            }
        }));
    };
    const handleDeleteRow = (productId, tabKey, tableKey) => {
        const tableProducts = products[tabKey][tableKey];  // Get the current list of products

        // Filter out the product with the specified productId
        const updatedProducts = tableProducts.filter((product) => product.id !== productId);

        // Update the state with the new list of products for the specified table
        setProducts((prevProducts) => ({
            ...prevProducts,
            [tabKey]: {
                ...prevProducts[tabKey],
                [tableKey]: updatedProducts, // Update the table for this tab with the updated products
            },
        }));
    };




    /*Resets the editing state by clearing the edited product name in the table row and
     setting the editingProductId to null*/
    const handleCancelClick = () => {
        setEditedProductName("");
        setEditingProductId(null);
    };

    const handleCancelAndOpenInputMethodDialog = () => {
        setOpenGrowthRateDialog(false);
        setOpenStartEndDialog(false);
        setOpenUploadDialog(false);
        setUploadedFileToFill(null);
        setOpenInputMethodDialog(true); // Reopen the input method dialog
    };

    /* Generates an array of monthly column labels between two dates.
    * 
    * This function takes a start date and an end date, and generates a list of
    * month labels in the format 'MMM-YYYY' for each month between the two dates inclusive.
    * Parameters:
    * {string|Date} start - The start date for the month generation.
    * {string|Date} end - The end date for the month generation.
    * Returns an array of strings, each representing a month in 'MMM-YYYY' format.*/
    const generateMonthlyColumns = (start, end) => {
        const months = [];
        let current = dayjs(start);
        while (current.isBefore(end) || current.isSame(end, 'month')) {
            months.push(current.format('MMM-YYYY'));
            current = current.add(1, 'month');
        }
        return months;
    };
    //Same as generateMonthlyColumns but for yearly time period
    const generateYearlyColumns = (start, end) => {
        const years = [];
        let current = dayjs(start).startOf('year');
        while (current.isBefore(end) || current.isSame(end, 'year')) {
            years.push(current.format('YYYY'));
            current = current.add(1, 'year');
        }
        return years;
    };
    useEffect(() => {
        // Generate the columns based on the selected time period
        // Columns are only regenerated when the time period, start date, or end date changes
        if (timePeriod === 'Monthly') {
            setColumns(generateMonthlyColumns(fromHistoricalDate, toForecastDate));
        } else if (timePeriod === 'Yearly') {
            setColumns(generateYearlyColumns(fromHistoricalDate, toForecastDate));
        }
    }, [timePeriod, fromHistoricalDate, toForecastDate]);


    /*
     * Handles updating the value of a specific product on a specific date in the state.
     * The state is updated based on the tabKey, which can be 'downside', 'base', or 'upside'.
     * The value is inserted into the state with the productId and date as keys.
    */
    const handleValueChange = (tabKey, productId, date, value) => {
        if (tabKey === 'downside') {
            setValues((prevValues) => ({
                ...prevValues,
                [productId]: {
                    ...prevValues[productId],
                    [date]: value,
                },
            }));
        } else if (tabKey === 'base') {
            setValues2((prevValues) => ({
                ...prevValues,
                [productId]: {
                    ...prevValues[productId],
                    [date]: value,
                },
            }));
        } else {
            setValues3((prevValues) => ({
                ...prevValues,
                [productId]: {
                    ...prevValues[productId],
                    [date]: value,
                },
            }));
        }
    };

    // Handles selecting an input method from the Data Input Method dialog.
    const handleInputMethodSelect = (method) => {
        setOpenInputMethodDialog(false);
        if (method === 'manual') {
            setManualEntry(true);
        } else if (method === 'growthRate') {
            setOpenGrowthRateDialog(true);
        } else if (method === 'startEndValues') {
            setOpenStartEndDialog(true);
        } else if (method === 'file') {
            setOpenUploadDialog(true);
        }
    };


    /**
     * Distributes values linearly between a start and end value over a specified time period.
     * 
     * This function calculates the values at each interval between the given start and end values,
     * based on the specified time period (either monthly or yearly). It returns an object with date keys
     * representing each interval and corresponding distributed values.
     */
    const distributeValuesBetweenStartAndEnd = (startVal, endVal) => {
        let distributedValues = {};

        const startDate = dayjs(fromHistoricalDate);
        const endDate = dayjs(toForecastDate);

        // Calculate the number of intervals based on the selected time period
        const intervals = timePeriod === 'Monthly'
            ? endDate.diff(startDate, 'month') + 1
            : endDate.diff(startDate, 'year') + 1;

        const startValue = parseFloat(startVal);
        const endValue = parseFloat(endVal);
        // Calculate the increment based on the number of intervals
        const increment = (endValue - startValue) / (intervals - 1);

        let currentValue = startValue;


        // Generate values for each date column
        for (let i = 0; i < intervals; i++) {
            const dateKey = timePeriod === 'Monthly'
                ? startDate.add(i, 'month').format('MMM-YYYY')
                : startDate.add(i, 'year').format('YYYY');

            distributedValues[dateKey] = currentValue.toFixed(2); // format to 2 decimals
            currentValue += increment;
        }

        return distributedValues;
    };


    /**
     * Handles saving the calculated values based on start and end values into the specified tab and table row.
     * Parameters:
     * {string} tabKey - The key of the tab to fill (downside, base, or upside)
     * {number} startValue - The start value
     * {number} endValue - The end value
     */
    const handleSaveStartEndValues = (tabKey, startValue, endValue) => {

        const distributed = distributeValuesBetweenStartAndEnd(startValue, endValue);

        // Loop through the distributed values and use handleValueChange to update each value
        Object.keys(distributed).forEach((date) => {
            handleValueChange(tabKey, selectedRowId, date, distributed[date]);
        });
        setOpenStartEndDialog(false);
    };

    /*
     * Handles filling values from an uploaded CSV file into the specified tab and row
        Parameters:
     * {string} rowID - The ID of the row to fill
     * {string} tabKey - The key of the tab to fill (downside, base, or upside)
    
     */
    const handlefilefillfromupload = (rowID, tabKey) => {
        const file = UploadedFileToFill;
        if (file) {
            console.log(file);
            if (timePeriod === 'Monthly') {
                // Create a new FileReader instance to read the file
                const reader = new FileReader();

                // Define the onload event handler for the reader
                reader.onload = (e) => {
                    // Get the file content
                    const content = e.target.result;

                    // Split the content by lines and filter out any empty lines
                    const rows = content.split('\n').filter((row) => row.trim() !== '');

                    // Extract headers from the first line and trim whitespace
                    const headers = rows[0].split(',').map((header) => header.trim());

                    // Extract values from the first data row and trim whitespace
                    const firstRow = rows[1].split(',').map((value) => value.trim());
                    const possibleFormats = [
                        'MMM-YY',          // e.g., Dec-23
                        'YY-MMM',          // e.g., 23-Dec
                        'YYYY-MM',         // e.g., 2023-12
                        'MMMM YYYY',       // e.g., December 2023
                        'MM/YY',           // e.g., 12/23
                        'DD-MMM-YYYY',     // e.g., 15-Jan-2023
                        'YYYY/MM/DD',      // e.g., 2023/12/31
                    ];
                    // Try to parse the date headers using the possible formats and strict parsing
                    // If the date is invalid, set the header to 'Invalid Date'
                    const dateHeaders = headers.map(header => {
                        const parsedDate = dayjs(header, possibleFormats, true); // strict parsing
                        return parsedDate.isValid() ? parsedDate.format('MMM-YYYY') : 'Invalid Date';
                    });

                    if (tabKey === 'downside') {
                        // Loop through the months between fromHistoricalDate and toForecastDate
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'month') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'month').format('MMM-YYYY');
                            // Find the index of the month in the dateHeaders array
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                // Get the value at the index from the first row of the CSV file
                                const val = firstRow[monthIndex];
                                console.log(val);
                                // Update the values in the state
                                setValues((prevValues) => ({
                                    ...prevValues,
                                    [rowID]: {
                                        ...prevValues[rowID],
                                        // Use the month as the key and the value as the value
                                        [month]: val
                                    }
                                }));
                            }
                            console.log(monthIndex);
                        }
                    }
                    else if (tabKey === 'base') { //doing the same for base tab as downside tab
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'month') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'month').format('MMM-YYYY');
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                console.log(val);
                                setValues2((prevValues) => ({
                                    ...prevValues,
                                    [rowID]: {
                                        ...prevValues[rowID],
                                        [month]: val
                                    }
                                }));
                            }
                            console.log(monthIndex);
                        }
                    }
                    else { //doing the same for upside tab as downside tab
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'month') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'month').format('MMM-YYYY');
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                console.log(val);
                                setValues3((prevValues) => ({
                                    ...prevValues,
                                    [rowID]: {
                                        ...prevValues[rowID],
                                        [month]: val
                                    }
                                }));
                            }
                            console.log(monthIndex);
                        }

                    }
                };
                reader.readAsText(file);
            }
            else { // doing the same procedure if time period is yearly
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result;
                    const rows = content.split('\n').filter((row) => row.trim() !== '');
                    const headers = rows[0].split(',').map((header) => header.trim());
                    const firstRow = rows[1].split(',').map((value) => value.trim());
                    const dateHeaders = headers.map(header => {
                        const parsedDate = dayjs(header, ["YY", "YYYY"], true); // strict parsing
                        return parsedDate.isValid() ? parsedDate.format('YYYY') : 'Invalid Date';
                    });
                    console.log(dateHeaders);
                    if (tabKey === 'downside') {
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'year') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'year').format('YYYY');
                            console.log(month);
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                console.log(val);
                                setValues((prevValues) => ({
                                    ...prevValues,
                                    [rowID]: {
                                        ...prevValues[rowID],
                                        [month]: val
                                    }
                                }));
                            }
                        }
                    }
                    else if (tabKey === 'base') {
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'year') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'year').format('YYYY');
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                setValues2((prevValues) => ({
                                    ...prevValues,
                                    [rowID]: {
                                        ...prevValues[rowID],
                                        [month]: val
                                    }
                                }));
                            }
                        }
                    }
                    else {
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'year') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'year').format('YYYY');
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                setValues3((prevValues) => ({
                                    ...prevValues,
                                    [rowID]: {
                                        ...prevValues[rowID],
                                        [month]: val
                                    }
                                }));
                            }
                        }

                    }
                };
                reader.readAsText(file);
            }

        }
        setOpenUploadDialog(false);
        setUploadedFileToFill(null);
    };



    //Closes the upload dialog and resets the uploaded file state to null
    const handleUploadDialogClose = () => {

        setOpenUploadDialog(false);
        setUploadedFileToFill(null);
    };

    /*
     This function adds a new growth rate to the list of growth rates
     New growth rate has a start date of the current date and a growth rate of 0
     */
    const handleAddGrowthRate = () => {
        setGrowthRates([...growthRates, { startDate: dayjs(), growthRate: 0 }]);
    };

    const handleRemoveGrowthRate = (index) => {
        const updatedGrowthRates = [...growthRates];
        updatedGrowthRates.splice(index, 1);
        setGrowthRates(updatedGrowthRates);
    }

    /*
     * Handles changes in the growth rates 
     * Parameters:
     * {number} index: Index of the growth rate in the table
     * {string} field Field being changed (either 'startDate' or 'growthRate')
     * {string|number} value New value for the field
     */
    const handleGrowthRateChange = (index, field, value) => {
        const updatedGrowthRates = [...growthRates];

        // Handle date changes specifically for startDate
        if (field === 'startDate') {
            updatedGrowthRates[index][field] = dayjs(value); // Ensure it's a dayjs object
        } else if (field === 'growthRate') {
            updatedGrowthRates[index][field] = value; // Handle numeric growth rate input
        }

        setGrowthRates(updatedGrowthRates);
    };

    /*
     * Returns the minimum date for the startDate field based on the index in the growthRate table.
     * If the index is 0, it returns the initial starting date, otherwise it returns the last
     * added date for subsequent entries.
     */
    const getMinDate = (index) => {
        if (index === 0) {
            return fromHistoricalDate; // Initial starting date for the first entry
        }
        return growthRates[index - 1].startDate; // Last added date for subsequent entries
    };

    // function to calculated values based on growth rates in the table
    const handleSaveGrowthRate = (tabKey, selectedRowId, startingValue, initialGrowthRate, growthRates) => {
        const distributedGrowthRates = calculateGrowthRateValues(startingValue, initialGrowthRate, growthRates);

        // Loop through the distributed values and use handleValueChange to update each value
        Object.keys(distributedGrowthRates).forEach((date) => {
            handleValueChange(tabKey, selectedRowId, date, distributedGrowthRates[date]);
        });
        setOpenGrowthRateDialog(false);
    };

    /**
     * Calculates growth rate values over a specified time period:
     * This function takes an initial value and growth rate, calculates the compounded values over a time
     * period defined by global `fromHistoricalDate` and `toForecastDate` variables, and adjusts the growth rates based on 
     * specified intervals. The time period can be monthly or yearly, and the results are stored in an 
     * object with date keys.
     */
    const calculateGrowthRateValues = (startingValue, initialGrowthRate, growthRates) => {

        const newValues = {};

        const startDate = dayjs(fromHistoricalDate); // Start date of the calculation period
        const endDate = dayjs(toForecastDate); // End date of the calculation period
        const columnIndexEndDate = columns.indexOf(timePeriod === 'Monthly' ? endDate.format('MMM-YYYY') : endDate.format('YYYY')); // column index of the end date

        const startValue = parseFloat(startingValue);
        const initialGR = parseFloat(initialGrowthRate);
        console.log(startValue, initialGR);

        let currentValue = startValue;
        newValues[columns[0]] = startValue;


        // Calculate the values for the initial growth rate for the entire period (Month or Year)
        for (let i = 1; i <= columnIndexEndDate; i++) {
            console.log("i", i);

            currentValue *= (1 + (initialGR / 100))
            console.log(currentValue);



            const dateKey = timePeriod === 'Monthly'
                ? startDate.add(i, 'month').format('MMM-YYYY')
                : startDate.add(i, 'year').format('YYYY');
            console.log(dateKey)
            // Set the calculated value for the specific period
            newValues[dateKey] = currentValue.toFixed(2);
            console.log(newValues);
        }

        // Sort the growth rates based on the date and apply them when needed
        const sortedGrowthRates = [
            { startDate: startDate, growthRate: initialGR }, // Include initial growth rate
            ...growthRates.map((entry) => ({
                startDate: dayjs(entry.startDate),
                growthRate: parseFloat(entry.growthRate),
            })),
        ].sort((a, b) => a.startDate?.isBefore(b.startDate) ? -1 : 1); // Sort by startDate

        // Now, reapply growth rates for each period (from sorted growth rates)
        sortedGrowthRates.forEach((entry, index) => {
            if (entry.startDate && !entry.startDate.isSame(startDate)) {
                const currentGrowthRate = parseFloat(entry.growthRate); // Growth rate for the current period
                const currentStartDate = dayjs(entry.startDate);
                const columnIndexNextDate = columns.indexOf(timePeriod === 'Monthly' ? currentStartDate.format('MMM-YYYY') : currentStartDate.format('YYYY'));
                currentValue = newValues[columns[columnIndexNextDate]];
                // Apply growth rate for each year/month based on the sorted growth rates
                for (let i = (columnIndexNextDate + 1); i <= columnIndexEndDate; i++) {
                    const currentDate = timePeriod === 'Monthly'
                        ? startDate.add(i, 'month')
                        : startDate.add(i, 'year');

                    // If the current date is after the current growth rate's start date
                    if (currentDate.isAfter(currentStartDate, 'day')) {
                        currentValue *= (1 + (currentGrowthRate / 100)); // Apply the new growth rate

                    }

                    // Set the updated value in the values object
                    const dateKey = timePeriod === 'Monthly'
                        ? currentDate.format('MMM-YYYY')
                        : currentDate.format('YYYY');
                    newValues[dateKey] = currentValue.toFixed(2);
                    console.log(newValues);
                }
            }
        });

        return newValues;
    };
    const rowKey = `${selectedRowId}.${selectedTab}`;
    const handleCopyFromInputPage = () => {
        console.log('rowKey:', rowKey);
        console.log('storeValues[rowKey]:', storeValues[rowKey]);

        if (storeValues[rowKey] && typeof storeValues[rowKey] === 'object') {
            Object.keys(storeValues[rowKey]).forEach((date) => {
                console.log('storeValues[rowKey][date]:', storeValues[rowKey][date]);
                handleValueChange(selectedTab, selectedRowId, date, storeValues[rowKey][date]);
            });
        } else if (storeValues[rowKey] === null || storeValues[rowKey] === undefined) {
            alert('No data found');
        } else {
            console.warn('storeValues[rowKey] is not a valid object:', storeValues[rowKey]);
        }

        setOpenInputMethodDialog(false);
    };

    {/* Reset all the states to their initial values when clear all data button is clicked*/ }
    const handleReset = () => {
        // Reset all the states to their initial values
        setFormulaDetails({ tableKey: null, tabKey: null, productId: null });
        setEditingProductId(null);
        setEditedProductName('');
        setOpenInputMethodDialog(false);
        setOpenGrowthRateDialog(false);
        setOpenStartEndDialog(false);
        setStartValue('');
        setEndValue('');
        setselectedRowId(null);
        setUploadedFileToFill(null);
        setOpenUploadDialog(false);
        setManualEntry(false);
        setGrowthRates([]);
        setStartingValue('');
        setInitialGrowthRate('');

        // Reset dates
        setTimePeriod('Monthly');
        //Reset values
        setValues({});
        setValues2({});
        setValues3({});

    };
    // const handleActionClick = (action) => {
    //     setSelectedAction(action); // Set the clicked action
    //     if (action === 'savedTemplates') {

    //     } else {

    //     }
    //   };
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
            top = rect.top + rect.height + rect.height - 5;
            left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
        } else if (step.placement === 'bottom') {
            top = rect.bottom + 10;
            left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
        } else if (step.placement === 'left') {
            top = rect.top + 475;
            left = rect.left - 350;
        } else if (step.placement === 'right') {
            top = rect.top + rect.height - popup.offsetHeight / 2;
            left = rect.right;
        }
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        document.body.appendChild(popup);
        // Add a button to close the popup
        const closeButton = document.createElement('button');
        //closeButton.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Skip Tutorial';
        closeButton.textContent = currentStep === (tab_value === '' ? steps : Object.values(tabTableVisibility).some(category =>
            Object.values(category).some(value => value === true)
        ) ? steps3 : steps2).length - 1 ? 'Finish' : 'Skip Tutorial';
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
        // nextButton.disabled = currentStep === steps.length - 1; // Disable if last step
        nextButton.disabled = currentStep === (tab_value === '' ? steps : Object.values(tabTableVisibility).some(category =>
            Object.values(category).some(value => value === true)
        ) ? steps3 : steps2).length - 1; // Disable if last step
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

    // useEffect(() => {
    //     if (tutorialActive && currentStep < steps.length) {
    //         showTutorial(steps[currentStep]);
    //     }
    // }, [tutorialActive, currentStep]);
    useEffect(() => {
        if (tab_value === '') {
            if (tutorialActive && currentStep < steps.length) {
                showTutorial(steps[currentStep]);
            }
        }
        else if (Object.values(tabTableVisibility).some(category =>
            Object.values(category).some(value => value === true)
        )) {
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
            target: '.tab-navigation',
            content: 'Clicking here allows you to open the tab for a specific case.',
            placement: 'bottom',
        }
    ];
    const steps2 = [
        {
            index: 0,
            target: '.tab-navigation',
            content: 'Clicking here allows you to open the tab for a specific case.',
            placement: 'bottom',
        },
        {
            index: 1,
            target: '.card-selection',
            content: 'Clicking here allows you to display the data table asociated with that card.',
            placement: 'right',
        }

    ];
    const steps3 = [
        {
            index: 0,
            target: '.tab-navigation',
            content: 'Clicking here allows you to open the tab for a specific case.',
            placement: 'bottom',
        },
        {
            index: 1,
            target: '.open-card-selection',
            content: 'Clicking here allows you to close the data table asociated with this card.',
            placement: 'right',
        },
        {
            index: 2,
            target: '.info-button',
            content: 'Click here to enter data source information',
            placement: 'right',
        },
        {
            index: 3,
            target: '.data-input-button',
            content: 'Clicking here allows you to choose options to add data to table rows using a particular method.',
            placement: 'right',
        },
        {
            index: 4,
            target: '.edit-row-name',
            content: 'Clicking here allows you to edit row name.',
            placement: 'right',
        },
        {
            index: 5,
            target: '.add-row',
            content: 'Clicking here allows you to add a row below.',
            placement: 'right',
        },
        {
            index: 6,
            target: '.insert-formula',
            content: 'Clicking here allows you create and insert a formula.',
            placement: 'right',
        },
        {
            index: 7,
            target: '.delete-row',
            content: 'Clicking here allows you to delete the currunt row.',
            placement: 'right',
        },
        {
            index: 8,
            target: '.manual-input',
            content: 'Clicking here allows you to manually enter the data.',
            placement: 'right',
        },
        {
            index: 9,
            target: '.date-table-header',
            content: 'The column headers are dates that spanning the historical and forecast period.',
            placement: 'right',
        }
    ];


    const [greeting, setGreeting] = useState('');

    // Set the greeting based on the current time
    useEffect(() => {
        const currentHour = new Date().getHours();

        if (currentHour < 12) {
            setGreeting('Good Morning');
        } else if (currentHour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, []);

    return (
        <>
            {/* Main wrapper div for the product list page */}
            <Box className="product-list-page" style={{ marginLeft: '10px' }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: '60px'

                }}>

                {/* Section displaying the greeting message */}
                <div style={{ backgroundColor: 'white', padding: '0.5px', marginTop: '-25px', marginLeft: '10px' }}>
                    <Button
                        className='tutorial-btn'
                        variant="contained"
                        size='small'
                        sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: 3, mr: 2 }}
                        onClick={() => handleStartTutorial()}
                    >
                        Show Tutorial
                    </Button>
                    <h2 style={{ textAlign: 'left' }}>{greeting}, Welcome to the Patient Based Forecasting Page!</h2> </div>
                <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
                                handleReset();
                            }
                        }}>
                        Clear All Data
                    </Button>
                </div>

                <Box
                    sx={{
                        maxWidth: '100%',   // Set width to contain horizontal scroll
                        overflowY: 'auto',  // Enable vertical scrolling
                        marginBottom: '15px',
                        textAlign: 'left', // Align box contents to the left

                    }}
                >

                    <Box sx={{ width: '90%', margin: '0 auto' }}>

                        <Tabs tab_value={tab_value} onChange={handleTabChange} aria-label="basic tabs example" className='tab-navigation'
                            sx={{
                                borderBottom: 2,
                                borderColor: 'divider',
                                marginBottom: 2,
                                '.MuiTabs-flexContainer': {
                                    justifyContent: 'space-around', // Distribute tabs evenly
                                },
                            }} >
                            <Tab label="Downside Case" sx={{
                                fontWeight: 'bold',
                                fontSize: '15px', // Increase font size
                                color: tab_value === 0 ? '#007bff' : 'black', // Highlight selected tab
                                '&.Mui-selected': {
                                    color: '#007bff', // Color of selected tab label
                                    fontSize: '20px', // Increase font size of selected tab
                                }
                            }} />
                            <Tab label="Base Case" sx={{
                                fontWeight: 'bold',
                                fontSize: '15px', // Increase font size
                                color: tab_value === 1 ? '#007bff' : 'black', // Highlight selected tab
                                '&.Mui-selected': {
                                    color: '#007bff', // Color of selected tab label
                                    fontSize: '20px', // Increase font size of selected tab
                                }
                            }} />

                            <Tab label="Upside Case" sx={{
                                fontWeight: 'bold',
                                fontSize: '15px', // Increase font size
                                color: tab_value === 2 ? '#007bff' : 'black', // Highlight selected tab
                                '&.Mui-selected': {
                                    color: '#007bff', // Color of selected tab label
                                    fontSize: '20px', // Increase font size of selected tab
                                }
                            }} />
                        </Tabs>


                        {tab_value !== null &&
                            <div>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2,
                                        left: 0,
                                        marginTop: 2,
                                        overflowY: 'auto',
                                        overflowX: 'auto',
                                        maxWidth: '100%',
                                        position: 'sticky',

                                    }}
                                >

                                    {/* Render Card1, Card2, and Card3 and render tables based on tabTableVisibility state */}
                                    {Card1()}
                                    {tabTableVisibility[currentTabKey].table1 && renderTable(currentTabKey, 'table1')}

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                    </Box>
                                    {Card2()}
                                    {tabTableVisibility[currentTabKey].table2 && renderTable(currentTabKey, 'table2')}

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                    </Box>
                                    {Card3()}
                                    {tabTableVisibility[currentTabKey].table3 && renderTable(currentTabKey, 'table3')}
                                </Box>
                            </div>
                        }
                    </Box>
                </Box>
            </Box >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    bottom: 0,
                    right: 20,
                    padding: '10px',
                    zIndex: 10,
                }}
            >
                {Preview()} {/* Render Preview component at the bottom of the page */}
            </Box>

        </>
    )
}
export default Patient_Forecast;