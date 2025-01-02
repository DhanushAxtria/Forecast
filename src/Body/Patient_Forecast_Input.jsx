import React, { useState, useEffect, useContext } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
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


const Patient_Forecast_Input = () => {
  
    const { storeValues, setStoreValues } = useContext(MyContext);
    const { fromDate, setFromDate, toDate, setToDate, timePeriod, setTimePeriod } = useContext(MyContext);
    const { combinedProducts } = useContext(MyContext);

    const [columns, setColumns] = useState([]); // Column headers based on time period
    const [rows, setRows] = useState([]); // State to track table rows
    const [showTable, setShowTable] = useState(false); // Controls table visibility
  
    const [showAddParameter, setShowAddParameter] = useState(false);
    const [greeting, setGreeting] = useState('');
    const [productIndex, setProductIndex] = useState(0); // Tracks which product to add rows for

    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProductName, setEditedProductName] = useState('');

    const [openInfoMethodDialog, setOpenInfoMethodDialog] = useState(false);// for info dialog

    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);// for input method dialog
    const [openGrowthRateDialog, setOpenGrowthRateDialog] = useState(false);
    const [openStartEndDialog, setOpenStartEndDialog] = useState(false); // Dialog for Start and End values
    const [startValue, setStartValue] = useState(''); // Start value for Specify Start and Target Values
    const [endValue, setEndValue] = useState(''); // End value for Specify Start and Target Values
    const [UploadedFileToFill, setUploadedFileToFill] = useState(null);
    const [openUploadDialog, setOpenUploadDialog] = useState(false); // Dialog for file upload
    
    const [openCopyFromDialog, setOpenCopyFromDialog] = useState(false);
    const [selectedCaseOption, setSelectedCaseOption] = useState(null); // Track selected option for case
    const [manualEntry, setManualEntry] = useState(false);
    const [growthRates, setGrowthRates] = useState([]);
    const [startingValue, setStartingValue] = useState('');
    const [initialGrowthRate, setInitialGrowthRate] = useState('');
    const [selectedRowId, setSelectedRowId] = useState(null);

    const [text, setText] = useState({});
    const [text2, setText2] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [savedText, setSavedText] = useState({});
    const [savedText2, setSavedText2] = useState({});

    const generateMonthlyColumns = (start, end) => {
        const months = [];
        let current = dayjs(start);
        while (current.isBefore(end) || current.isSame(end, 'month')) {
            months.push(current.format('MMM-YYYY'));
            current = current.add(1, 'month');
        }
        return months;
    };

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
        if (timePeriod === 'Monthly') {
            setColumns(generateMonthlyColumns(fromDate, toDate));
        } else if (timePeriod === 'Yearly') {
            setColumns(generateYearlyColumns(fromDate, toDate));
        }
    }, [timePeriod, fromDate, toDate]);

    const handleAddParameter = () => {
        if (productIndex < combinedProducts.length) {
            const product = combinedProducts[productIndex];
            const newRows = [
                { ...product, caseType: 'base' },
                { ...product, caseType: 'downside' },
                { ...product, caseType: 'upside' },
            ];

            setRows((prevRows) => [...prevRows, ...newRows]);
            setShowTable(true);
            setProductIndex(productIndex + 1); // Move to the next product
        } else {
            alert('All parameters have been added!');
        }
    };

    const handleValueChange = (rowID, date, value) => {
        setStoreValues((prevValues) => ({
            ...prevValues,
            [rowID]: {
                ...prevValues[rowID],
                [date]: value,
            },
        }));
    };

    // Handles initiating the edit of a product name
    const handleEditClick = (productId) => {
        const product = rows.find((row) => row.id === productId);

        if (product) {
            setEditingProductId(productId);
            setEditedProductName(product.name);
        }
    };

    // Handles saving a product name after editing
    const handleSaveClick = (productId) => {
        // Update the rows state with the new product name
        const updatedRows = rows.map((row) =>
            row.id === productId ? { ...row, name: editedProductName } : row
        );

        // Update the rows state
        setRows(updatedRows);

        // Reset editing state
        setEditingProductId(null);
        setEditedProductName('');
    };


    const handleCancelClick = () => {
        setEditedProductName("");
        setEditingProductId(null);
    };

    const handleDeleteParameter = (productId) => {
        // Filter out the product with the ID from the rows state
        const updatedRows = rows.filter((row) => row.id !== productId);

        // Update the rows state
        setRows(updatedRows);
    };

    const handleSaveInfo = () => {
        setSavedText((prev) => ({
            ...prev,
            [selectedRowId]: text[selectedRowId] || '',
        }));
        setSavedText2((prev) => ({
            ...prev,
            [selectedRowId]: text2[selectedRowId] || '',
        }));
        setOpenInfoMethodDialog(false);
        setIsEditing(false);
    };

    //Cancels the current edit session of the 'info' dialog by reverting the input storeValues to their saved state and closing the info dialog.
    const handleCancelInfo = () => {
        setText((prev) => ({
            ...prev,
            [selectedRowId]: savedText[selectedRowId] || '',
        }));
        setText2((prev) => ({
            ...prev,
            [selectedRowId]: savedText2[selectedRowId] || '',
        }));
        setOpenInfoMethodDialog(false);
        setIsEditing(false);
    };


    const renderTable = () => {
        return (
            <Box
                sx={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    padding: 1.5,
                }}
            >
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th style={{ minWidth: '150px' }}>Case Type</th>
                            {columns.map((column, colIndex) => (
                                <th key={colIndex} style={{ minWidth: '150px' }}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((product) => {
                            // Create a unique key for each row using product name and case type
                            const rowKey = `${product.id}.${product.caseType}`;

                            return (
                                <tr key={rowKey}>
                                    <td>
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '0.1fr 0.1fr 1fr 0.1fr 0.1fr',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '720px',
                                            }}
                                        >
                                            <Tooltip title="Source Info" placement="top">
                                                <IconButton
                                                    color="info"
                                                    onClick={() => {
                                                        setSelectedRowId(rowKey);
                                                        setOpenInfoMethodDialog(true);
                                                    }}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Data Input" placement="top">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        setSelectedRowId(rowKey);
                                                        setOpenInputMethodDialog(true);
                                                    }}
                                                >
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
                                                    <IconButton onClick={() => handleSaveClick(product.id)} color="primary">
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
                                                    <Tooltip title="Edit Row Name" placement="top">
                                                        <IconButton
                                                            onClick={() => handleEditClick(product.id)}
                                                            style={{ marginLeft: '8px' }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Parameter" placement="top">
                                                        <IconButton
                                                            onClick={() => handleDeleteParameter(product.id)}
                                                            style={{ marginLeft: '8px' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td>{product.caseType}</td>
                                    {columns.map((date) => (
                                        <td key={date}>
                                            <TextField
                                                type="number"
                                                value={storeValues[rowKey]?.[date] || ''}
                                                onChange={(e) =>
                                                    handleValueChange(rowKey, date, e.target.value)
                                                }
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter value"
                                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                            />

                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                
            </Box>
        );
    };

    const renderCopyFromDialog = () => {
        return (
            <Dialog open={openCopyFromDialog} onClose={() => setOpenCopyFromDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Choose the Case to Copy From</DialogTitle>
                <DialogContent sx={{ paddingTop: '15px' }}>
                    <Box display="flex" flexDirection="row" gap="16px" alignItems="center" marginTop="10px">
                        {/* Render buttons dynamically based on the current product case */}
                        {selectedRowId && (() => {
                            const currentCase = selectedRowId.split('.')[1];
                            console.log('currentCase', currentCase); // Extract caseType from rowKey
                            const options = {
                                base: ['downside', 'upside'],
                                downside: ['base', 'upside'],
                                upside: ['base', 'downside'],
                            };

                            return options[currentCase]?.map((caseOption) => (
                                <Button
                                    key={caseOption}
                                    variant="outlined"
                                    onClick={() => setSelectedCaseOption(caseOption)}
                                    color="primary"
                                    sx={{
                                        backgroundColor: selectedCaseOption === caseOption ? '#1976d2' : '', // Highlight selected option
                                        color: selectedCaseOption === caseOption ? 'white' : ''
                                    }}
                                >
                                    Copy from {caseOption}
                                </Button>
                            ));
                        })()}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary" >
                        Cancel
                    </Button>
                    <Button onClick={() => handleSaveCopy(selectedCaseOption, selectedRowId)} color="primary" >
                        Save
                    </Button>
                    <Button onClick={() => setOpenCopyFromDialog(false)} color="secondary" >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>)}

    const handleSaveCopy = (sourceCaseType, targetRowKey) => {
            const sourceRowKey = targetRowKey.replace(/\.([^.]+)$/, `.${sourceCaseType}`); // Generate source rowKey
            console.log('sourceRowKey', sourceRowKey);
            const sourceValues = storeValues[sourceRowKey] || {}; // Retrieve source row storeValues

            setStoreValues((prevValues) => ({
                ...prevValues,
                [targetRowKey]: {
                    ...(prevValues[targetRowKey] || {}), // Preserve existing storeValues
                    ...sourceValues, // Copy storeValues from source row
                },
            }));

            setOpenCopyFromDialog(false); // Close dialog after copying
            setOpenInputMethodDialog(false); // Open input method dialog
        };


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

        const renderInfoMethodDialog = () => {
            return (
                <Dialog
                    open={openInfoMethodDialog}
                    onClose={() => setOpenInfoMethodDialog(false)}
                    maxWidth="sm" fullWidth
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
                                        value={text[selectedRowId] ?? ''}
                                        onChange={(e) =>
                                            setText((prev) => ({
                                                ...prev,
                                                [selectedRowId]: e.target.value,
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
                                    value={text2[selectedRowId] ?? ''}
                                    onChange={(e) =>
                                        setText2((prev) => ({
                                            ...prev,
                                            [selectedRowId]: e.target.value,
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
                                            />
                                        </Button>
                                    </Tooltip>
                                </ListItemIcon>
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={handleSaveInfo}>
                            Save
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCancelInfo}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };

        const renderInputMethodDialog = () => {
            return (
                <Dialog
                    open={openInputMethodDialog}
                    onClose={() => {
                        setOpenInputMethodDialog(false); // Close the "Select Data Input Method" dialog
                    }}
                    maxWidth="sm" fullWidth
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
                                onClick={() => {
                                    setManualEntry(true);
                                    setOpenInputMethodDialog(false);
                                }}
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

                            {/* File Upload */}
                            <Tooltip title="Only .csv or .xlsx formats allowed" arrow>
                                <ListItem
                                    button
                                    onClick={() => {
                                        setOpenUploadDialog(true);
                                        setOpenInputMethodDialog(false);
                                    }}
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
                                    <UploadFileIcon color="primary" sx={{ marginRight: '12px' }} />
                                    <ListItemText primary="Upload Data File" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                                </ListItem>
                            </Tooltip>

                            {/* Growth Rate */}
                            <ListItem
                                button
                                onClick={() => {
                                    setOpenGrowthRateDialog(true);
                                    setOpenInputMethodDialog(false);
                                }}
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
                                <TrendingUpIcon color="primary" sx={{ marginRight: '12px' }} />
                                <ListItemText primary="Set Initial Values with Growth Rate" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>

                            {/* Start and End Values */}
                            <ListItem
                                button
                                onClick={() => {
                                    setOpenStartEndDialog(true);
                                    setOpenInputMethodDialog(false);
                                }}
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
                                    4.
                                </Typography>
                                <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                                <ListItemText primary="Specify Starting and Target Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>

                            <ListItem
                                button
                                onClick={() => {
                                    setOpenCopyFromDialog(true);
                                    setOpenInputMethodDialog(false);
                                }}
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
                                <ListItemText primary="Copy from another case" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions sx={{ padding: '16px', backgroundColor: '#f0f4fa' }}>
                        <Button onClick={() => { setOpenInputMethodDialog(false); }} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };

        const renderUploadFromFileDialog = () => {
            return (
                <Dialog
                    open={openUploadDialog}
                    onClose={handleUploadDialogClose}
                    maxWidth="sm" fullWidth>

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
                        <Button onClick={() => handlefilefillfromupload(selectedRowId)} color="primary">
                            Save

                        </Button>
                        <Button onClick={handleUploadDialogClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };

        console.log('Selected Row ID:', selectedRowId);
        const handlefilefillfromupload = (rowID) => {
            const file = UploadedFileToFill;
            if (file) {
                console.log('Uploaded File:', file);

                const reader = new FileReader();

                if (timePeriod === 'Monthly') {
                    reader.onload = (e) => {
                        const content = e.target.result;
                        const rows = content.split('\n').filter((row) => row.trim() !== '');
                        if (rows.length < 2) {
                            console.error('Invalid file format.');
                            alert('Uploaded file is invalid. Please upload a valid file.');
                            return;
                        }

                        const headers = rows[0].split(',').map((header) => header.trim());
                        const firstRow = rows[1].split(',').map((value) => value.trim());
                        const possibleFormats = [
                            'MMM-YY', 'YY-MMM', 'YYYY-MM', 'MMMM YYYY',
                            'MM/YY', 'DD-MMM-YYYY', 'YYYY/MM/DD',
                        ];

                        const dateHeaders = headers.map(header => {
                            const parsedDate = dayjs(header, possibleFormats, true);
                            return parsedDate.isValid() ? parsedDate.format('MMM-YYYY') : 'Invalid Date';
                        });
                        console.log('Parsed Date Headers:', dateHeaders);

                        for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'month') + 1; i++) {
                            const month = dayjs(fromDate).add(i, 'month').format('MMM-YYYY');
                            const monthIndex = dateHeaders.indexOf(month);

                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                console.log(`Value for ${month}:`, val);

                                setStoreValues((prevValues) => {
                                    const updatedValues = {
                                        ...prevValues,
                                        [rowID]: {
                                            ...prevValues[rowID],
                                            [month]: val,
                                        },
                                    };
                                    console.log('Updated Values:', updatedValues);
                                    return updatedValues;
                                });
                            }
                        }
                    };
                    reader.readAsText(file);
                } else {
                    reader.onload = (e) => {
                        const content = e.target.result;
                        const rows = content.split('\n').filter((row) => row.trim() !== '');
                        if (rows.length < 2) {
                            console.error('Invalid file format.');
                            alert('Uploaded file is invalid. Please upload a valid file.');
                            return;
                        }

                        const headers = rows[0].split(',').map((header) => header.trim());
                        const firstRow = rows[1].split(',').map((value) => value.trim());

                        const dateHeaders = headers.map(header => {
                            const parsedDate = dayjs(header, ["YY", "YYYY"], true);
                            return parsedDate.isValid() ? parsedDate.format('YYYY') : 'Invalid Date';
                        });
                        console.log('Parsed Date Headers:', dateHeaders);

                        for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'year') + 1; i++) {
                            const year = dayjs(fromDate).add(i, 'year').format('YYYY');
                            const yearIndex = dateHeaders.indexOf(year);

                            if (yearIndex !== -1) {
                                const val = firstRow[yearIndex];
                                console.log(`Value for ${year}:`, val);

                                setStoreValues((prevValues) => {
                                    const updatedValues = {
                                        ...prevValues,
                                        [rowID]: {
                                            ...prevValues[rowID],
                                            [year]: val,
                                        },
                                    };
                                    console.log('Updated Values:', updatedValues);
                                    return updatedValues;
                                });
                            }
                        }
                    };
                    reader.readAsText(file);
                }
            }

            setOpenUploadDialog(false);
            setUploadedFileToFill(null);
        };



        const handleUploadDialogClose = () => {

            setOpenUploadDialog(false);
            setUploadedFileToFill(null);
        };


        const renderStartEndDialog = () => {
            return (
                <Dialog open={openStartEndDialog} onClose={() => { setOpenStartEndDialog(false); }} maxWidth="sm" fullWidth>
                    <DialogTitle>Specify Start and Target Values</DialogTitle>
                    <DialogContent sx={{ paddingTop: '15px' }}>
                        {/* This box contains two text fields for the start and end storeValues.
                The start value is the initial value , and the end value is the target value.
                The storeValues are validated to only allow numbers.*/}
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
                        <Button onClick={() => { handleSaveStartEndValues(startValue, endValue) }} color="primary">
                            Save
                        </Button>
                        <Button onClick={() => { setOpenStartEndDialog(false); }} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };

        const handleCancelAndOpenInputMethodDialog = () => {
            setOpenGrowthRateDialog(false);
            setOpenStartEndDialog(false);
            setOpenUploadDialog(false);
            setOpenCopyFromDialog(false);
            setUploadedFileToFill(null);
            setOpenInputMethodDialog(true); // Reopen the input method dialog
        };

        const distributeValuesBetweenStartAndEnd = (startVal, endVal) => {
            let distributedValues = {};

            const startDate = dayjs(fromDate);
            const endDate = dayjs(toDate);

            // Calculate the number of intervals based on the selected time period
            const intervals = timePeriod === 'Monthly'
                ? endDate.diff(startDate, 'month') + 1
                : endDate.diff(startDate, 'year') + 1;

            const startValue = parseFloat(startVal);
            const endValue = parseFloat(endVal);
            // Calculate the increment based on the number of intervals
            const increment = (endValue - startValue) / (intervals - 1);

            let currentValue = startValue;


            // Generate storeValues for each date column
            for (let i = 0; i < intervals; i++) {
                const dateKey = timePeriod === 'Monthly'
                    ? startDate.add(i, 'month').format('MMM-YYYY')
                    : startDate.add(i, 'year').format('YYYY');

                distributedValues[dateKey] = currentValue.toFixed(2); // format to 2 decimals
                currentValue += increment;
            }

            return distributedValues;
        };

        const handleSaveStartEndValues = (startValue, endValue) => {

            const distributed = distributeValuesBetweenStartAndEnd(startValue, endValue);

            // Loop through the distributed storeValues and use handleValueChange to update each value
            Object.keys(distributed).forEach((date) => {
                handleValueChange(selectedRowId, date, distributed[date]);
            });
            setOpenStartEndDialog(false);
            setOpenInputMethodDialog(false);
        };

        const renderGrowthRateDialog = () => {
            return (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Dialog open={openGrowthRateDialog} onClose={() => { setOpenGrowthRateDialog(false); }} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ paddingTop: '20px' }}>Set Initial Values and Growth Rate</DialogTitle>
                        <DialogContent sx={{ paddingTop: '15px' }}>
                            <Box display="flex" alignItems="center" gap="16px" mb={2} sx={{ paddingTop: '20px' }}>
                                {/* Start Month/Year picker. Disable editing, and limit the date range to the given period. */}
                                <DatePicker
                                    views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                    label={timePeriod === 'Monthly' ? 'Start Month' : 'Start Year'}
                                    value={fromDate} // Auto-populated
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
                                        maxDate={toDate} //The user cannot select a Start Date that is after the End Date
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
                                    <IconButton onClick={() => handleRemoveGrowthRate(index)} color="primary">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={() => { handleSaveGrowthRate(selectedRowId, startingValue, initialGrowthRate, growthRates) }} color="primary">
                                Save
                            </Button>
                            <Button onClick={() => { setOpenGrowthRateDialog(false); }} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </LocalizationProvider>
            )
        }

        const handleAddGrowthRate = () => {
            setGrowthRates([...growthRates, { startDate: dayjs(), growthRate: 0 }]);
        };

        const handleRemoveGrowthRate = (index) => {
            const updatedGrowthRates = [...growthRates];
            updatedGrowthRates.splice(index, 1);
            setGrowthRates(updatedGrowthRates);
        }

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

        const getMinDate = (index) => {
            if (index === 0) {
                return fromDate; // Initial starting date for the first entry
            }
            return growthRates[index - 1].startDate; // Last added date for subsequent entries
        };

        const handleSaveGrowthRate = (selectedRowId, startingValue, initialGrowthRate, growthRates) => {
            const distributedGrowthRates = calculateGrowthRateValues(startingValue, initialGrowthRate, growthRates);

            // Loop through the distributed storeValues and use handleValueChange to update each value
            Object.keys(distributedGrowthRates).forEach((date) => {
                handleValueChange(selectedRowId, date, distributedGrowthRates[date]);
            });
            setOpenGrowthRateDialog(false);
            setOpenInputMethodDialog(false);
        };

        const calculateGrowthRateValues = (startingValue, initialGrowthRate, growthRates) => {

            const newValues = {};

            const startDate = dayjs(fromDate); // Start date of the calculation period
            const endDate = dayjs(toDate); // End date of the calculation period
            const columnIndexEndDate = columns.indexOf(timePeriod === 'Monthly' ? endDate.format('MMM-YYYY') : endDate.format('YYYY')); // column index of the end date

            const startValue = parseFloat(startingValue);
            const initialGR = parseFloat(initialGrowthRate);
            console.log(startValue, initialGR);

            let currentValue = startValue;
            newValues[columns[0]] = startValue;


            // Calculate the storeValues for the initial growth rate for the entire period (Month or Year)
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

                        // Set the updated value in the storeValues object
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

        return (
            <div className="product-list-page" style={{ marginLeft: '10px' }}>
                <div style={{ backgroundColor: 'white', padding: '0.5px', marginTop: '-25px', marginLeft: '10px' }}>
                    <h2 style={{ textAlign: 'left' }}>Welcome to the Input Page for Patient Based Forecasting!</h2>
                </div>

                <span style={{ marginLeft: '12px' }}>Select Time Period</span>
                <Box
                    sx={{
                        maxWidth: '100%',
                        overflowY: 'auto',
                        marginBottom: '15px',
                        textAlign: 'left',
                    }}
                >
                    <Box display="flex" alignItems="center" gap="15px" mb={2} marginLeft="12px" marginTop="15px">
                        <TextField
                            select
                            label="Time Period"
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                            size="small"
                            variant="outlined"
                            sx={{ width: '160px' }}
                        >
                            <MenuItem value="Monthly">Monthly</MenuItem>
                            <MenuItem value="Yearly">Yearly</MenuItem>
                        </TextField>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                label={timePeriod === 'Monthly' ? 'Start Month' : 'Start Year'}
                                value={fromDate}
                                onChange={(newValue) => setFromDate(newValue)}
                                format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                slotProps={{ textField: { size: 'small' } }}
                                sx={{ width: '160px' }}
                                maxDate={toDate}
                            />
                            <DatePicker
                                views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                label={timePeriod === 'Monthly' ? 'End Month' : 'End Year'}
                                value={toDate}
                                onChange={(newValue) => setToDate(newValue)}
                                format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                slotProps={{ textField: { size: 'small' } }}
                                sx={{ width: '160px' }}
                                minDate={fromDate}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (dayjs(fromDate).isBefore(toDate) || dayjs(fromDate).isSame(toDate, timePeriod === 'Monthly' ? 'month' : 'year')) {
                                    setShowAddParameter(true);
                                } else {
                                    alert("Invalid date range: Start date must be before end date");
                                    setShowAddParameter(false);
                                }
                            }}
                            sx={{ marginLeft: '18px', marginBottom: '2px' }}
                        >
                            Proceed
                        </Button>
                    </Box>
                    {showAddParameter && (
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            color="primary"
                            onClick={handleAddParameter}
                            sx={{ marginLeft: '12px' }}
                        >
                            Add Parameter
                        </Button>
                    )}
                </Box>
                {showTable && renderTable()}
                {openInfoMethodDialog && renderInfoMethodDialog()}
                {openInputMethodDialog && renderInputMethodDialog()}
                {openStartEndDialog && renderStartEndDialog()}
                {openGrowthRateDialog && renderGrowthRateDialog()}
                {openUploadDialog && renderUploadFromFileDialog()}
                {openCopyFromDialog && renderCopyFromDialog()}
            </div>
        );
    };

    export default Patient_Forecast_Input;