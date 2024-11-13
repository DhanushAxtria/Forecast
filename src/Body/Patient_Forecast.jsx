import React, { useState, useEffect } from 'react';
import {
    TextField,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Tooltip,
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdjustIcon from '@mui/icons-material/Adjust';
import './ProductListpage.scss';

const initialProducts = [
    { id: 1, name: 'US Population(14-49)' },
    { id: 2, name: 'Prevalence Rate' },
    { id: 3, name: 'Diagonsis Rate (%)' },
];

const ProductListPage = () => {
    const [products, setProducts] = useState(initialProducts);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProductName, setEditedProductName] = useState('');
    const [openGranularityDialog, setOpenGranularityDialog] = useState(false);
    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);
    const [openGrowthRateDialog, setOpenGrowthRateDialog] = useState(false);
    const [openStartEndDialog, setOpenStartEndDialog] = useState(false); // Dialog for Start and End values
    const [openUploadDialog, setOpenUploadDialog] = useState(false); // Dialog for file upload
    const [granularity, setGranularity] = useState('');
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [manualEntry, setManualEntry] = useState(false);
    const [growthRates, setGrowthRates] = useState([]);
    const [startingValue, setStartingValue] = useState('');
    const [initialGrowthRate, setInitialGrowthRate] = useState('');
    const [startValue, setStartValue] = useState(''); // Start value for Specify Start and Target Values
    const [endValue, setEndValue] = useState(''); // End value for Specify Start and Target Values
    const [calculatedValues, setCalculatedValues] = useState({});
    const [timePeriod, setTimePeriod] = useState('Monthly');
    const [columns, setColumns] = useState([]);  // Column headers based on time period
    const [values, setValues] = useState({});
    const [inputMethodDialogOpen, setInputMethodDialogOpen] = useState(true);
    const [openSelectDataInputDialog, setOpenSelectDataInputDialog] = useState(false);

    const handleEditClick = (product) => {
        setEditingProductId(product.id);
        setEditedProductName(product.name);
    };

    const handleSaveClick = (productId) => {
        setProducts(products.map((product) =>
            product.id === productId ? { ...product, name: editedProductName } : product
        ));
        setEditingProductId(null);
        setEditedProductName('');
    };
    const handleAddRow = (productId) => {
        const newProduct = {
            id: products.length + 1, // Incremental ID based on current product count
            name: `New Product ${products.length + 1}`, // Default name for the new product
        };

        const updatedProducts = [...products];
        const index = products.findIndex((product) => product.id === productId);
        updatedProducts.splice(index + 1, 0, newProduct); // Insert new product below the clicked row
        setProducts(updatedProducts); // Update products state with new row
    };
    const handleCloseInputMethodDialog = () => {
        setOpenInputMethodDialog(false); // Close the "Select Data Input Method" dialog
    };
    const handleSaveGrowthRate = () => {
        calculateGrowthRateValues(); // Calculate and save the values
        // Optionally, show a message or indication of successful save
    };
    const handleSaveStartEndValues = () => {
        distributeValuesForProduct(); // Apply and save the start-end distribution
        // Optionally, show a message or indication of successful save
    };
    const handleCancelClick = () => {
        setOpenGrowthRateDialog(false); // Close the growth rate dialog
        setOpenInputMethodDialog(true); // Reopen the input method dialog
    };
    const generateMonthlyColumns = (start, end) => {
        const months = [];
        let current = dayjs(start);
        while (current.isBefore(end) || current.isSame(end, 'month')) {
            months.push(current.format('MM-YYYY'));
            current = current.add(1, 'month');
        }
        return months;
    };
    const handleCloseAllDialogs = () => {
        setOpenSelectDataInputDialog(false);
        setOpenGrowthRateDialog(false);
        setOpenStartEndDialog(false);
        setOpenUploadDialog(false);
        setInputMethodDialogOpen(true); // Go back to main page
    };
    const handleCancelAndOpenInputMethodDialog = () => {
        setOpenGrowthRateDialog(false);
        setOpenStartEndDialog(false);
        setOpenUploadDialog(false);
        setOpenInputMethodDialog(true); // Reopen the input method dialog
    };
    const handleGrowthRateCancel = () => {
        setOpenGrowthRateDialog(false);
        setOpenSelectDataInputDialog(true); // Reopen Select Data Input Method dialog
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

    const handleCloudIconClick = () => {
        setOpenInputMethodDialog(true);
    };

    const handleGranularitySelect = () => {
        if (granularity === 'Monthly') {
            setColumns(generateMonthlyColumns(fromDate, toDate));
        } else if (granularity === 'Yearly') {
            setColumns(generateYearlyColumns(fromDate, toDate));
        }
        setOpenGranularityDialog(false);
        setOpenInputMethodDialog(true);
    };

    const handleGranularityChange = (event) => {
        setGranularity(event.target.value);
    };
    const handleInputMethodClick = () => {
        setOpenInputMethodDialog(true); // Opens the Input Method Dialog
    };
    const handleCloseDialogs = () => {
        setOpenInputMethodDialog(false);
        setOpenGrowthRateDialog(false);
        setOpenStartEndDialog(false);
        setOpenUploadDialog(false);
        setInputMethodDialogOpen(true);
    };
    const handleValueChange = (productId, date, value) => {
        setValues((prevValues) => ({
            ...prevValues,
            [productId]: {
                ...prevValues[productId],
                [date]: value,
            },
        }));
    };

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

    const handleFileDialogClose = () => {
        setOpenGrowthRateDialog(false);
    };

    const handleStartEndDialogClose = () => {
        if (startValue && endValue) {
            distributeValuesForProduct();
        }
        setOpenStartEndDialog(false);
    }
    const distributeValuesForProduct = () => {
        const productId = products[0].id; // Assuming Product 1
        const start = dayjs(fromDate);
        const end = dayjs(toDate);

        // Calculate the number of intervals based on the selected time period
        const intervals = timePeriod === 'Monthly'
            ? end.diff(start, 'month') + 1
            : end.diff(start, 'year') + 1;

        const startVal = parseFloat(startValue);
        const endVal = parseFloat(endValue);
        const increment = (endVal - startVal) / (intervals - 1);

        let currentValue = startVal;
        const newValues = {};

        // Generate values for each date column
        for (let i = 0; i < intervals; i++) {
            const dateKey = timePeriod === 'Monthly'
                ? start.add(i, 'month').format('MM-YYYY')
                : start.add(i, 'year').format('YYYY');

            newValues[dateKey] = currentValue.toFixed(2); // format to 2 decimals
            currentValue += increment;
        }

        // Update the values state for Product 1
        setValues((prevValues) => ({
            ...prevValues,
            [productId]: newValues,
        }));
    };

    const handleUploadDialogClose = () => {
        setOpenUploadDialog(false);
    };

    const handleAddGrowthRate = () => {
        setGrowthRates([...growthRates, { startDate: dayjs(), growthRate: '' }]);
    };

    const handleGrowthRateChange = (index, field, value) => {
        const updatedGrowthRates = [...growthRates];
        updatedGrowthRates[index][field] = value;
        setGrowthRates(updatedGrowthRates);
    };
    const getMinDate = (index) => {
        if (index === 0) {
            return fromDate; // Initial starting date for the first entry
        }
        return growthRates[index - 1].startDate; // Last added date for subsequent entries
    };
    const handleGrowthRateDialogClose = () => {
        if (startingValue && initialGrowthRate) {
            calculateGrowthRateValues();
        }
        setOpenGrowthRateDialog(false);
    };

    const calculateValues = () => {
        if (!startingValue || !initialGrowthRate) return;

        const values = {};
        let currentValue = parseFloat(startingValue);
        const startYear = fromDate.year();

        // Calculate the values for the initial growth rate
        values[startYear] = currentValue;
        for (let i = 1; i < columns.length; i++) {
            currentValue *= 1 + parseFloat(initialGrowthRate) / 100;
            values[startYear + i] = currentValue.toFixed(2);
        }

        // Apply additional growth rates if the user has added them
        growthRates.forEach((entry) => {
            const entryYear = entry.startDate.year();
            let rate = parseFloat(entry.growthRate) / 100;

            if (values[entryYear]) {
                values[entryYear] = values[entryYear] * (1 + rate);
            }

            // Apply growth rate to subsequent years
            for (let i = 1; i < columns.length; i++) {
                const year = entryYear + i;
                if (values[year]) {
                    values[year] *= 1 + rate;
                    values[year] = values[year].toFixed(2);
                } else break;
            }
        });

        setCalculatedValues(values);
    };
    const handleSaveUploadDialog = () => {
        // Logic to handle file upload or preparation for upload
        console.log("File prepared for upload"); // Placeholder for file upload functionality
        // Optionally, show a message or indication of successful file selection
    };
    const calculateGrowthRateValues = () => {
        const productId = products[0].id; // Assuming Product 1
        const start = dayjs(fromDate).startOf('year');
        const end = dayjs(toDate).endOf('year');

        const startYear = start.year();
        const endYear = end.year();

        // Sort growthRates by year
        const sortedGrowthRates = [
            { startDate: start, growthRate: initialGrowthRate }, // Initial entry
            ...growthRates.map((entry) => ({
                startDate: entry.startDate.startOf('year'),
                growthRate: parseFloat(entry.growthRate),
            })),
        ].sort((a, b) => a.startDate.year() - b.startDate.year());

        const newValues = {};
        let currentValue = parseFloat(startingValue);

        // Apply growth rate formula for each period defined by the sorted growth rates
        sortedGrowthRates.forEach((entry, index) => {
            const currentStartYear = entry.startDate.year();
            const nextStartYear = sortedGrowthRates[index + 1]?.startDate.year() || endYear + 1; // next year or end year

            newValues[currentStartYear] = currentValue.toFixed(2); // Starting value for the current segment

            // Calculate values for each year in this segment
            for (let year = currentStartYear + 1; year < nextStartYear; year++) {
                currentValue = currentValue * (1 + entry.growthRate / 100); // Apply growth rate
                newValues[year] = currentValue.toFixed(2); // format to 2 decimals
            }
        });

        // Update the values state for Product 1
        setValues((prevValues) => ({
            ...prevValues,
            [productId]: newValues,
        }));
    };

    useEffect(() => {
        calculateValues();
    }, [startingValue, initialGrowthRate, growthRates, columns]);
    return (
        <div className="product-list-page" >
            <Box
                sx={{
                    maxHeight: '400px', // Set a fixed height for vertical scroll
                    maxWidth: '100%',   // Set width to contain horizontal scroll
                    overflowY: 'auto',  // Enable vertical scrolling
                    overflowX: 'auto',  // Enable horizontal scrolling
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            >
                <span gap="10px" sx={{ marginRight: '20px' }} >Select Time Period</span>
                {/* Select Time Period Section */}
                <Box display="flex" alignItems="center" gap="15px" mb={2} marginLeft='18px' marginTop='15px'>
                    <TextField
                        select
                        label="Time Period"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        size="small"
                        variant="outlined"
                    >
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Yearly">Yearly</MenuItem>
                    </TextField>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                            label="From"
                            value={fromDate}
                            onChange={(newValue) => setFromDate(newValue)}
                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: '160px', padding: '5px' }}
                        />
                        <DatePicker
                            views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                            label="To"
                            value={toDate}
                            onChange={(newValue) => setToDate(newValue)}
                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: '160px', padding: '5px' }}
                        />
                    </LocalizationProvider>
                </Box>
                <table className="product-table">
                    <thead>
                        <tr>
                            <th></th>
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton color="info">
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton color="primary" onClick={handleCloudIconClick}>
                                            <CloudUploadIcon fontSize="small" />
                                        </IconButton>
                                        {editingProductId === product.id ? (
                                            <>
                                                <TextField
                                                    value={editedProductName}
                                                    onChange={(e) => setEditedProductName(e.target.value)}
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ marginLeft: '8px', marginRight: '8px' }}
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
                                                <span style={{ marginLeft: '8px' }}>{product.name}</span>
                                                <IconButton onClick={() => handleEditClick(product)} style={{ marginLeft: '8px' }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleAddRow(product.id)} style={{ marginLeft: '8px' }}>
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </>
                                        )}
                                    </div>
                                </td>
                                {columns.map((date) => (
                                    <td key={date}>
                                        {manualEntry ? (
                                            <TextField
                                                value={values[product.id]?.[date] || ''}
                                                onChange={(e) => handleValueChange(product.id, date, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter value"
                                            />
                                        ) : (
                                            values[product.id]?.[date] || ''
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
            {/* Granularity Selection Dialog */}

            {/* Input Method Selection Dialog */}
            <Dialog
                open={openInputMethodDialog}
                onClose={handleCloseAllDialogs}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
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
                                    2.
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
                                3.
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
                                4.
                            </Typography>
                            <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Specify Starting and Target Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions sx={{ padding: '16px', backgroundColor: '#f0f4fa' }}>
                    <Button onClick={handleCloseInputMethodDialog} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Specify Start and End Values Dialog */}
            <Dialog open={openStartEndDialog} onClose={handleStartEndDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Specify Start and Target Values</DialogTitle>
                <DialogContent sx={{ paddingTop: '15px' }}>
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
                    <Button onClick={handleSaveStartEndValues} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleCloseAllDialogs} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* File Upload Dialog */}
            <Dialog open={openUploadDialog} onClose={handleUploadDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Data File</DialogTitle>
                <Tooltip title="Only .csv or .xlsx formats allowed" arrow>
                    <DialogContent sx={{ paddingTop: '15px' }}>
                        <Box sx={{ paddingTop: '15px' }} display="flex" flexDirection="column" gap="16px">
                            <Button variant="outlined" color="primary" fullWidth>
                                Select File from Local Storage
                            </Button>
                            <Button variant="outlined" color="primary" fullWidth>
                                Select File from AWS/Azure
                            </Button>
                        </Box>
                    </DialogContent>
                </Tooltip>
                <DialogActions>
                    <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveUploadDialog} color="primary">
                        Save
                    </Button>
                    <Button onClick={handleCloseAllDialogs} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Growth Rate Entry Dialog */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog open={openGrowthRateDialog} onClose={() => setOpenGrowthRateDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ paddingTop: '20px' }}>Set Initial Values and Growth Rate</DialogTitle>
                    <DialogContent sx={{ paddingTop: '15px' }}>
                        <Box display="flex" alignItems="center" gap="16px" mb={2} sx={{ paddingTop: '20px' }}>
                            <DatePicker
                                views={['year']}
                                label="Starting Date"
                                value={fromDate} // Auto-populated
                                disabled
                                slotProps={{ textField: { size: 'small' } }}
                                style={{ minWidth: '120px' }}
                            />
                            <TextField
                                label="Starting Value"
                                type="number"
                                value={startingValue}
                                onChange={(e) => setStartingValue(e.target.value)}
                                size="small"
                                style={{ minWidth: '120px' }}
                            />
                            <TextField
                                label="Initial Growth Rate (%)"
                                type="number"
                                value={initialGrowthRate}
                                onChange={(e) => setInitialGrowthRate(e.target.value)}
                                size="small"
                                style={{ minWidth: '120px' }}
                            />
                            <IconButton onClick={handleAddGrowthRate} color="primary">
                                <AddIcon />
                            </IconButton>
                        </Box>
                        {growthRates.map((entry, index) => (
                            <Box key={index} display="flex" alignItems="center" gap="16px" mb={2}>
                                <DatePicker
                                    views={['year']}
                                    label="Starting Date"
                                    value={entry.startDate}
                                    onChange={(newValue) => handleGrowthRateChange(index, 'startDate', newValue)}
                                    slotProps={{ textField: { size: 'small' } }}
                                    style={{ minWidth: '120px' }}
                                    minDate={getMinDate(index)}
                                />
                                <TextField
                                    label="Growth Rate (%)"
                                    type="number"
                                    value={entry.growthRate}
                                    onChange={(e) => handleGrowthRateChange(index, 'growthRate', e.target.value)}
                                    size="small"
                                    style={{ minWidth: '120px' }}
                                />
                            </Box>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveGrowthRate} color="primary">
                            Save
                        </Button>
                        <Button onClick={handleCloseAllDialogs} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </div>
    );
};

export default ProductListPage;
