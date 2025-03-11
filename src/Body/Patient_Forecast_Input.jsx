import React, { useState, useEffect, useContext } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import ClearIcon from '@mui/icons-material/Clear';
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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import axios from 'axios';
import { MyContext } from './context';
import { is } from 'date-fns/locale';

const Patient_Forecast_Input = () => {
    const [productName, setProductName] = useState("");
    const [productType, setProductType] = useState("value");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { storeValues, setStoreValues, rows, setRows, showTable, setShowTable } = useContext(MyContext);
    const { fromHistoricalDate, setFromHistoricalDate, fromForecastDate, setFromForecastDate, toForecastDate, setToForecastDate, timePeriod, setTimePeriod } = useContext(MyContext);
    const { combinedProducts, combinedProductsForInput } = useContext(MyContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedWorkbook, setSelectedWorkbook] = useState("");
    const [columns, setColumns] = useState([]); // Column headers based on time period
    const [greeting, setGreeting] = useState('');
    const [selectedProductId, setSelectedProductId] = useState("");
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
    const [openTimeSeriesDialog, setOpenTimeSeriesDialog] = useState(false);

    const [openCopyFromDialog, setOpenCopyFromDialog] = useState(false);
    const [selectedCaseOption, setSelectedCaseOption] = useState(null); // Track selected option for case
    const [manualEntry, setManualEntry] = useState(false);
    const [growthRates, setGrowthRates] = useState([]);
    const [startingValue, setStartingValue] = useState('');
    const [initialGrowthRate, setInitialGrowthRate] = useState('');
    const [selectedRowId, setSelectedRowId] = useState(null);
    const toHistoricalDate = fromForecastDate
        ? (timePeriod === 'Yearly'
            ? dayjs(fromForecastDate).subtract(1, 'year')
            : dayjs(fromForecastDate).subtract(1, 'month'))
        : null;

    const [text, setText] = useState({});
    const [text2, setText2] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [savedText, setSavedText] = useState({});
    const [savedText2, setSavedText2] = useState({});
    const { ForecastedValue, setForecastValue } = useContext(MyContext);
    const { ParsedData, setParsedData } = useContext(MyContext);
    const [combinedData, setCombinedData] = useState(null);
    const { Formulas, setFormulas } = useContext(MyContext);
    const { therapeuticArea, setTherapeuticArea } = useContext(MyContext);
    const { caseTypeLabels, setCaseTypeLabels, caseTypeLabelsOnco, setCaseTypeLabelsOnco } = useContext(MyContext);

    const workbooks = [
        'Linear Regression',
        'Log Linear Regression',
        'Naive',
        'Seasonal Naive',
        'Holt',
        'Damped Holt',
        'Average'
    ];

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
            setColumns(generateMonthlyColumns(fromHistoricalDate, toForecastDate));
        } else if (timePeriod === 'Yearly') {
            setColumns(generateYearlyColumns(fromHistoricalDate, toForecastDate));
        }
    }, [timePeriod, fromHistoricalDate, toForecastDate]);

    useEffect(() => {
        console.log(rows);


    }, [rows])


    const handleSelectParameter = (productId) => {
        const product = combinedProducts.find((p) => p.id === productId);
        if (product) {
            const newRows = [
                { ...product, caseType: "base" },
                { ...product, caseType: "downside" },
                { ...product, caseType: "upside" },
            ];

            setRows((prevRows) => [...prevRows, ...newRows]);
            setShowTable(true);
            setSelectedProductId(""); // Reset selection after adding
        }
    };

    const handletimeseriesanalysis = async (selectedSheet, historyFromDate, historyToDate, selectedFromDate, selectedToDate, selectedFile) => {
        const formatDateUTC = (date) => {
            if (!date) return null;
            const d = new Date(date);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('selectedSheet', selectedSheet);
        formData.append('historyFromDate', formatDateUTC(historyFromDate));
        formData.append('historyToDate', formatDateUTC(historyToDate));
        formData.append('selectedFromDate', formatDateUTC(selectedFromDate));
        formData.append('selectedToDate', formatDateUTC(selectedToDate));
        formData.append('modelType', "Normal");
        formData.append('lassoAlpha', 0.1);
        formData.append('ridgeAlpha', 0.1);
        formData.append('maxiter', 500);

        console.log("Formatted Dates Before Sending:");
        console.log("historyFromDate:", formatDateUTC(historyFromDate));
        console.log("historyToDate:", formatDateUTC(historyToDate));
        console.log("selectedFromDate:", formatDateUTC(selectedFromDate));
        console.log("selectedToDate:", formatDateUTC(selectedToDate));

        console.log("FormData Contents:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const formatMonth = (month) => {
                const [shortMonth, year] = month.split("-");
                const fullYear = `20${year}`; // Convert "24" to "2024"
                return `${shortMonth}-${fullYear}`;
            };

            const forecastedData = response.data.forecast?.months?.map((month, index) => ({
                month: formatMonth(month),
                forecasted: response.data.forecast?.[0]?.[index] ?? null,
            })) ?? [];

            const historicalData = response.data.dt?.months?.map((month, index) => ({
                month: formatMonth(month),
                historical: response.data.dt?.[0]?.[index] ?? null,
            })) ?? [];

            // Sorting based on actual date values
            const combined = [...historicalData, ...forecastedData].sort((a, b) =>
                new Date(`01-${a.month}`) - new Date(`01-${b.month}`)
            );

            setStoreValues((prevValues) => ({
                ...prevValues,
                [selectedRowId]: combined.reduce((obj, item) => {
                    obj[item.month] = item.forecasted ?? item.historical ?? null;
                    return obj;
                }, {}),
            }));
            setOpenInputMethodDialog(false);
            setOpenTimeSeriesDialog(false);


        } catch (error) {
            alert("Please upload the correct data");
            console.error('Error uploading file:', error);
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
    const handleRemoveFile = () => {
        setSelectedFile(null);
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
                            {columns.map((column) => (
                                <th
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
                        {rows.map((product, index) => {
                            // Create a unique key for each row using product name and case type
                            const rowKey = `${product.id}.${product.caseType}`;

                            // Add spacing row before a new parameter's rows (every 3 rows)
                            const isFirstRowOfGroup = index % 3 === 0;

                            const groupColors = ['#f0f8ff', '#e6e6fa', '#ffe4e1', '#fafad2', '#d3f9d8']; // Light blue, lavender, misty rose, light goldenrod yellow, light green
                            const groupNumber = Math.floor(index / 3); // Determine the group number
                            const groupBackgroundColor = groupColors[groupNumber % groupColors.length]; // Cycle through colors
                            return (
                                <React.Fragment key={rowKey}>
                                    {isFirstRowOfGroup && index !== 0 && (
                                        <tr>
                                            <td colSpan={columns.length + 2} style={{ height: '30px' }}></td>
                                        </tr>
                                    )}
                                    <tr style={{
                                        backgroundColor: groupBackgroundColor,
                                    }}>
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
                                        {
                                            therapeuticArea === 'Oncology' ?
                                            <td>{caseTypeLabelsOnco[product.caseType === 'base' ? 0 : product.caseType === 'downside' ? 1 : 2]}</td> :
                                            <td>{caseTypeLabels[product.caseType === 'base' ? 0 : product.caseType === 'downside' ? 1 : 2]}</td>
                                        }
                                        {columns.map((date) => (
                                            <td key={date}>
                                                <TextField
                                                    type="number"
                                                    value={storeValues[rowKey]?.[date] ? storeValues[rowKey][date] : ''}
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
                                </React.Fragment>
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
            </Dialog>)
    }

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

                        <ListItem
                            button
                            onClick={() => {
                                console.log(selectedRowId);
                                setOpenTimeSeriesDialog(true);
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
                                6.
                            </Typography>
                            <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Use Time Series Methods" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
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

                    for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'month') + 1; i++) {
                        const month = dayjs(fromHistoricalDate).add(i, 'month').format('MMM-YYYY');
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

                    for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'year') + 1; i++) {
                        const year = dayjs(fromHistoricalDate).add(i, 'year').format('YYYY');
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
        setOpenTimeSeriesDialog(false);
        setOpenStartEndDialog(false);
        setOpenUploadDialog(false);
        setOpenCopyFromDialog(false);
        setUploadedFileToFill(null);
        setOpenInputMethodDialog(true); // Reopen the input method dialog
    };

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
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first file
        if (file) {
            setSelectedFile(file);
        }
    };

    const renderAddParameterDialog = () => {
        return (
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="xs"
                BackdropProps={{
                    style: {
                        zIndex: 1400,
                        backgroundColor: 'rgba(0,0,0,0.2)', // Slightly dark transparent backdrop
                    },
                }}
                PaperProps={{
                    sx: {
                        zIndex: 1600,
                        borderRadius: '12px',
                        boxShadow: 4,
                        overflow: 'hidden',
                        //padding: '24px', // Adds padding for better spacing
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
                        borderRadius: '12px 12px 0 0'
                    }}
                >
                    Add New Field
                </DialogTitle>
                <br></br>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* Product Name Input */}
                    <TextField
                        label="Field Name"
                        fullWidth
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                            sx: { paddingLeft: '10px' } // Adds space to the left of the label
                        }}
                        InputProps={{
                            sx: {
                                fontSize: '1.1rem',
                                fontWeight: 'medium',
                                marginLeft: '10px'
                            },
                        }}
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />

                    {/* Checkbox for Product Type with More Left Margin */}
                    <ToggleButtonGroup
                        orientation="horizontal"
                        exclusive
                        value={productType}
                        onChange={(e, newValue) => setProductType(newValue)}
                        sx={{ marginLeft: '8px' }}
                    >
                        <ToggleButton
                            value="value"
                            sx={(theme) => ({
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                '&.Mui-selected': {
                                    bgcolor: theme.palette.primary.main,  // Primary theme color
                                    color: theme.palette.primary.contrastText, // Ensure text contrast
                                    '&:hover': { bgcolor: theme.palette.primary.dark } // Darker on hover
                                }
                            })}
                        >
                            Value
                        </ToggleButton>
                        <ToggleButton
                            value="%"
                            sx={(theme) => ({
                                fontSize: '0.8rem',
                                padding: '4px 8px',
                                '&.Mui-selected': {
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                    '&:hover': { bgcolor: theme.palette.primary.dark }
                                }
                            })}
                        >
                            %
                        </ToggleButton>
                    </ToggleButtonGroup>


                </DialogContent>

                <DialogActions sx={{ padding: '16px' }}>
                    <Button onClick={handleDialogSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            setProductName("");
                            setProductType("value");
                        }}
                        color="secondary"
                        variant="contained"
                    >
                        Cancel
                    </Button>

                </DialogActions>
            </Dialog>
        );
    }
    const renderTimeSeriesDialog = () => {
        return (
            <Dialog open={openTimeSeriesDialog} onClose={() => { setOpenTimeSeriesDialog(false); }} maxWidth="sm" fullWidth>
                <DialogTitle>Time Period Selection</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', gap: 2, marginTop: '10px', alignItems: 'center' }}>

                        {/* Upload button with hidden input field */}
                        <Button
                            className='upload-btn'
                            variant="contained"
                            color="primary"
                            component="label"
                            sx={{

                                borderRadius: 1,
                                marginRight: '10px',
                                marginBottom: '5px'
                            }}
                            startIcon={<UploadIcon />}
                        >
                            <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>Upload file</Typography>
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={(event) => handleFileChange(event)}
                            />
                        </Button>


                        {/* Display uploaded file name and clear button */}
                        {selectedFile && (
                            <Typography variant="body2" component="span" fontWeight="bold">
                                <span style={{ color: 'black' }}>Uploaded file: </span>
                                <span style={{ color: 'red' }}>{selectedFile.name}</span>
                            </Typography>
                        )}
                        {selectedFile && <IconButton
                            onClick={handleRemoveFile}
                            sx={{ ml: 1 }}
                        >
                            <ClearIcon />
                        </IconButton>}
                    </Box>
                    {/* Historical Time Period Section */}
                    <Box className='hist-dates-btn' sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Historical Time Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <DatePicker
                                    label="From"
                                    value={fromHistoricalDate}
                                    disabled
                                    format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px', mr: 2 }}
                                    maxDate={toForecastDate}
                                />
                                <DatePicker
                                    label="To"
                                    value={toHistoricalDate}
                                    disabled
                                    format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px', mr: 2 }}
                                    minDate={fromHistoricalDate}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Box>

                    {/* Forecast Time Period Section */}
                    <Box className='forecast-dates-btn' sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                            Forecast Time Period
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <DatePicker
                                    label="From"
                                    value={fromForecastDate}
                                    disabled
                                    format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px', mr: 2 }}
                                    minDate={fromHistoricalDate}
                                />
                                <DatePicker
                                    label="To"
                                    value={toForecastDate}
                                    disabled
                                    format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                    slotProps={{ textField: { size: 'small' } }}
                                    sx={{ width: '200px' }}
                                    minDate={fromForecastDate}
                                />
                            </Box>
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControl sx={{ mt: 3, width: '200px' }}>
                            <InputLabel id="workbook-select-label"
                                sx={{ fontSize: '0.9rem', top: '-6px', color: '#333' }}>
                                Select Model Type</InputLabel>
                            <Select
                                value={selectedWorkbook}
                                label="Model"
                                onChange={(e) => setSelectedWorkbook(e.target.value)}
                                sx={{
                                    fontSize: '0.9rem',
                                    height: '40px',
                                }}
                            >
                                {workbooks.map((workbook) => (
                                    <MenuItem key={workbook} value={workbook}
                                        sx={{ fontSize: '0.9rem' }}>{workbook}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handletimeseriesanalysis(selectedWorkbook, fromHistoricalDate, toHistoricalDate, fromForecastDate, toForecastDate, selectedFile) }} color="primary">
                        Save
                    </Button>
                    <Button onClick={() => { setOpenTimeSeriesDialog(false); }} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

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
            return fromHistoricalDate; // Initial starting date for the first entry
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

        const startDate = dayjs(fromHistoricalDate); // Start date of the calculation period
        const endDate = dayjs(toForecastDate); // End date of the calculation period
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

                }
            }
        });

        return newValues;
    };

    useEffect(() => {
        console.log(Formulas);
    }, [rows])
    const handleDialogSubmit = () => {
        if (!productName) {
            alert("Product name is required!");
            return;
        }
        const newRows = [
            { id: productName, name: productName, type: productType, caseType: "base" },
            { id: productName, name: productName, type: productType, caseType: "downside" },
            { id: productName, name: productName, type: productType, caseType: "upside" },
        ];
        setRows((prevRows) => [...prevRows, ...newRows]);
        setShowTable(true);
        setSelectedProductId(""); // Reset selection after adding
        // Reset inputs
        setProductName("");
        setProductType("value");
        setIsDialogOpen(false);
    };


    return (
        <div className="product-list-page" style={{ marginLeft: '10px' }}>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    select
                    size="small"
                    sx={{ width: "200px", mr: 2 }}
                    value={selectedProductId}
                    onChange={(e) => handleSelectParameter(e.target.value)}
                    label="Add Parameter"
                    variant="outlined"
                >
                    <MenuItem value="" disabled>Select a parameter</MenuItem>
                    {combinedProductsForInput
                        .filter((product) => !rows.some((row) => row.id === product.id)) // Filter out already added items
                        .map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                                {product.name}
                            </MenuItem>
                        ))}
                </TextField>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    Add New Parameter
                </Button>
            </Box>

            {showTable && renderTable()}
            {openInfoMethodDialog && renderInfoMethodDialog()}
            {openInputMethodDialog && renderInputMethodDialog()}
            {openStartEndDialog && renderStartEndDialog()}
            {openGrowthRateDialog && renderGrowthRateDialog()}
            {openUploadDialog && renderUploadFromFileDialog()}
            {openCopyFromDialog && renderCopyFromDialog()}
            {openTimeSeriesDialog && renderTimeSeriesDialog()}
            {isDialogOpen && renderAddParameterDialog()}
        </div>
    );
};
export default Patient_Forecast_Input;