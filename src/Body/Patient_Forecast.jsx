import React, { useState, useEffect } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdjustIcon from '@mui/icons-material/Adjust';
import './ProductListpage.scss';


const initialProducts1 = [
    { id: 'T1-1', name: 'US Population(14-49)' },
    { id: 'T1-2', name: 'Prevalence Rate' },
    { id: 'T1-3', name: 'Diagonsis Rate (%)' },
    { id: 'T1-4', name: 'Diagnosis GH Patients(%)' }

];
const initialProducts2 = [
    { id: 'T2-1', name: '% Patients on Chronic Therapy' },
    { id: 'T2-2', name: '% Patients on Episodic Therapy ' },
    { id: 'T2-3', name: 'Patients on Chronic Therapy' },
    { id: 'T2-4', name: 'Patients on Episodic Therapy ' },
    { id: 'T2-5', name: 'Total GH Patients ' },
    { id: 'T2-6', name: 'Chronic Therapy' },
    { id: 'T2-7', name: 'Episodic Therapy' }
];
const initialProducts3 = [
    { id: 'T3-1', name: 'Compliance' },
    { id: 'T3-2', name: 'Payer Access' },
    { id: 'T3-3', name: 'Patients on GS1179 (post Compliance) - Chronic Therapy' }

];

const initialProducts = {
    downside: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
    base: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
    upside: { table1: initialProducts1, table2: initialProducts2, table3: initialProducts3 },
};

const ProductListPage = () => {
    const [products1, setProducts1] = useState(initialProducts1);
    const [products2, setProducts2] = useState(initialProducts2);
    const [products3, setProducts3] = useState(initialProducts3);
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
    const [values2, setValues2] = useState({});
    const [values3, setValues3] = useState({});
    const [inputMethodDialogOpen, setInputMethodDialogOpen] = useState(true);
    const [openSelectDataInputDialog, setOpenSelectDataInputDialog] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [showTable1, setShowTable1] = useState(false);
    const [showTable2, setShowTable2] = useState(false);
    const [showTable3, setShowTable3] = useState(false);
    const [selectedTab, setSelectedTab] = useState(false);
    const [anchorElOpen, setAnchorElOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openInfoMethodDialog, setOpenInfoMethodDialog] = useState(false);
    const [showFormula, setShowFormula] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [formulaProductId, setFormulaProductId] = useState(null);
    const [tab_value, setTabValue] = useState(null);
    const [showTabs, setShowTabs] = useState(false);
    const [products, setProducts] = useState(initialProducts);
    const combinedProducts = [...initialProducts1, ...initialProducts2, ...initialProducts3];
    const [selectedValues, setSelectedValues] = useState([combinedProducts[0]?.name]); // Start with one dropdown, default to first product
    const [operators, setOperators] = useState(['+']); // State to store selected operators for each dropdown


    const [tabTableVisibility, setTabTableVisibility] = useState({
        downside: { table1: false, table2: false, table3: false },
        base: { table1: false, table2: false, table3: false },
        upside: { table1: false, table2: false, table3: false },
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);

        // Reset visibility of all tables when tab changes
        const tabKey = newValue === 0 ? 'downside' : newValue === 1 ? 'base' : 'upside';
        setTabTableVisibility((prev) => ({
            ...prev,
            [tabKey]: { table1: false, table2: false, table3: false }, // Reset table visibility
        }));
    };

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


    // Handle changes for any dropdown (formula or operator)
    const handleSelectChange = (index, type, event) => {
        if (type === 'operator') {
            const newOperators = [...operators];
            newOperators[index] = event.target.value;
            setOperators(newOperators);
        } else {
            const newSelectedValues = [...selectedValues];
            newSelectedValues[index] = event.target.value;
            setSelectedValues(newSelectedValues);
        }
    };

    // Handle adding a new dropdown
    const handleAddDropdown = () => {
        setSelectedValues([...selectedValues, combinedProducts[0]?.name]); // Add a new dropdown with the default value
        setOperators([...operators, '+']); // Add a new operator dropdown with default "+"
    };

    // Handle deleting a dropdown
    const handleDeleteDropdown = (index) => {
        const newSelectedValues = selectedValues.filter((_, i) => i !== index);
        const newOperators = operators.filter((_, i) => i !== index);
        setSelectedValues(newSelectedValues);
        setOperators(newOperators);
    };

    // Handle applying the selected formula(s)
    const handleApply = (tabKey, row_id) => {
        const selectedIds = selectedValues.map((selectedValue) => {
            // Iterate through all tableKeys under the current tabKey
            for (const tableKey in products[tabKey]) {
                // Find the product that matches the selected value
                const product = products[tabKey][tableKey].find((prod) => prod.name === selectedValue);
                if (product) {
                    return product.id; // Return the id if a product is found
                }
            }
            return null; // Return null if no product is found
        }).filter((id) => id !== null); // Filter out null values
        const operatorSliced = operators.slice(1);
        const idd = selectedIds[0];
        let res = {};

        const value = tabKey === 'downside' ? values[idd] : tabKey === 'base' ? values2[idd] : values3[idd];
        if (value !== undefined) res = value;
        for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'month') + 1; i++) {
            const month = dayjs(fromDate).add(i, 'month').format('MMM-YYYY');
            if (!res[month]) {
                res[month] = 0;
            }
        }
        console.log('res is', res);
        for (let i = 1; i < selectedIds.length; i++) {
            const id = selectedIds[i];
            const tempval = tabKey === 'downside' ? values[id] : tabKey === 'base' ? values2[id] : values3[id];
            let temp;
            if (tempval !== undefined) temp = tempval;
            const summed = {};
            Object.keys(res).forEach((key) => {
                if (temp[key]) {
                    if (operatorSliced[i - 1] == '+') {
                        summed[key] = parseFloat(res[key], 10) + parseFloat(temp[key], 10);
                    } else if (operatorSliced[i - 1] == '-') {
                        summed[key] = parseFloat(res[key], 10) - parseFloat(temp[key], 10);
                    } else if (operatorSliced[i - 1] == '*') {
                        summed[key] = parseFloat(res[key], 10) * parseFloat(temp[key], 10);
                    } else if (operatorSliced[i - 1] == '/') {
                        summed[key] = parseFloat(res[key], 10) / parseFloat(temp[key], 10);
                    }
                }
            });
            res = summed;
        }
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
        setShowFormula(false);
    };

    const handleEditClick = (productId, tabKey, tableKey) => {
        // Find the product by id in the table for the given tabKey and tableKey
        const product = products[tabKey][tableKey].find((prod) => prod.id === productId);

        if (product) {
            setEditingProductId(product.id);
            setEditedProductName(product.name);
        }
    };

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
    /*const handleAddRow = (tabKey, tableKey, productId, table_num) => {
        const tablee = table_num === 1 ? products1 : table_num === 2 ? products2 : products3
        const newProduct = {
            id: tablee.length + 1, // Incremental ID based on current product count
            name: `New Product ${tablee.length + 1}`, // Default name for the new product
        };

        const updatedProducts = [...tablee];
        const index = tablee.findIndex((product) => product.id === productId);
        updatedProducts.splice(index + 1, 0, newProduct); // Insert new product below the clicked row
        if (table_num == 1) {
            setProducts1(updatedProducts); // Update products state with new row in table 1  
        }
        if (table_num == 2) {
            setProducts2(updatedProducts); // Update products state with new row in table 2
        }
        if (table_num == 3) {
            setProducts3(updatedProducts); // Update products state with new row in table 2
        }
    };*/

    const handleAddRow = (tabKey, tableKey, productId) => {
        // Get the current list of products for the specific tab and table
        const tableProducts = products[tabKey][tableKey];
        const num = tableKey === 'table1' ? 1 : tableKey === 'table2' ? 2 : 3;
        // Find the index of the clicked product
        const index = tableProducts.findIndex((product) => product.id === productId);

        if (index === -1) return; // Exit if productId doesn't match anything

        // Create a new product object (incremental ID based on current product count)
        const newProduct = {
            id: `T${num}-${tableProducts.length + 1}`, // Make sure ID is unique and incremental
            name: `New Product ${tableProducts.length + 1}`, // Default name for the new product
        };


        // Create a new array with the new product inserted below the clicked row
        const updatedProducts = [
            ...tableProducts.slice(0, index + 1), // Copy products before the clicked product
            newProduct, // Insert new product below the clicked row
            ...tableProducts.slice(index + 1), // Copy products after the clicked product
        ];

        // Update the state with the new row
        setProducts((prevProducts) => ({
            ...prevProducts,
            [tabKey]: {
                ...prevProducts[tabKey],
                [tableKey]: updatedProducts, // Update the correct table for this tab
            },
        }));
        console.log(products[tabKey][tableKey]);
    };

    /*const handleDeleteRow = (productId, table_num) => {
        let updatedProducts = products1;
        let updatedProducts2 = products2;
        let updatedProducts3 = products3;
        if (table_num == 1) {
            updatedProducts = products1.filter((product) => product.id !== productId);
        }
        if (table_num == 2) {
            updatedProducts2 = products2.filter((product) => product.id !== productId);
        }
        if (table_num == 3) {
            updatedProducts3 = products3.filter((product) => product.id !== productId);
        }
        setProducts1(updatedProducts); // Update products state with new row in table 1
        setProducts2(updatedProducts2); // Update products state with new row in table 2
        setProducts3(updatedProducts3); // Update products state with new row in table 3
    };*/

    const handleDeleteRow = (productId, tabKey, tableKey) => {
        // Get the current list of products for the specific tab and table
        const tableProducts = products[tabKey][tableKey];

        // Filter out the product with the specified productId
        const updatedProducts = tableProducts.filter((product) => product.id !== productId);

        // Update the state with the new list of products for the specified table
        setProducts((prevProducts) => ({
            ...prevProducts,
            [tabKey]: {
                ...prevProducts[tabKey],
                [tableKey]: updatedProducts, // Update the correct table for this tab
            },
        }));
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
        setEditedProductName("");
        setEditingProductId(null);
    };
    const generateMonthlyColumns = (start, end) => {
        const months = [];
        let current = dayjs(start);
        while (current.isBefore(end) || current.isSame(end, 'month')) {
            months.push(current.format('MMM-YYYY'));
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
    const handleCloseInfoMethodDialog = () => {
        setOpenInfoMethodDialog(false);
    };
    const handleCancelAndOpenInfoMethodDialog = () => {
        setOpenInfoMethodDialog(true);
    };
    const handleInfoIconClick = () => {
        setOpenInfoMethodDialog(true);
    };
    const handleStartEndDialogClose = () => {
        if (startValue && endValue) {
            distributeValuesForProduct();
        }
        setOpenStartEndDialog(false);
    }
    const distributeValuesForProduct = () => {
        const productId = products1[0].id; // Assuming Product 1
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

        //Update the values state for Product 1
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
        const productId = products1[0].id; // Assuming Product 1
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

        //Update the values state for Product 1
        setValues((prevValues) => ({
            ...prevValues,
            [productId]: newValues,
        }));
    };

    const renderTable = (tabKey, tableKey) => {
        const tableProducts = products[tabKey][tableKey]; // Get the correct products for this table

        return (
            <Box
                sx={{
                    maxHeight: '400px', // Set a fixed height for vertical scroll
                    maxWidth: '100%',
                    overflowY: 'auto', // Enable vertical scrolling
                    overflowX: 'auto', // Enable horizontal scrolling
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            >
                <table className="product-table">
                    <thead>
                        <tr>
                            <th style={{ position: 'sticky', left: 0, backgroundColor: 'red', zIndex: 2 }}></th>
                            {columns.map((column, index) => (
                                <th key={index} style={{minWidth: '150px' }}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', position: 'sticky', left: 0, background: 'white', zIndex: 2 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '0.1fr 0.1fr 1fr 0.1fr 0.1fr 0.1fr 0.1fr', alignItems: 'center' }}>
                                        <IconButton color="info" onClick={handleInfoIconClick}>
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
                                                <IconButton onClick={() => handleSaveClick(product.id, tabKey, tableKey)} color="primary">
                                                    <CheckIcon />
                                                </IconButton>
                                                <IconButton onClick={handleCancelClick} color="secondary">
                                                    <CloseIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ marginLeft: '8px' }}>{product.name}</span>
                                                <IconButton onClick={() => handleEditClick(product.id, tabKey, tableKey)} style={{ marginLeft: '8px' }}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                {tableProducts[tableProducts.length - 1].id !== product.id && (
                                                    <IconButton onClick={() => handleAddRow(tabKey, tableKey, product.id)} style={{ marginLeft: '8px' }}>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                                {tableProducts[tableProducts.length - 1].id === product.id && (
                                                    <IconButton style={{marginLeft: '8px', color: 'lightgrey' }} disabled>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                    )}
                                                <IconButton onClick={() => { setFormulaProductId(product.id); setShowFormula(true); }} style={{ marginLeft: '4px' }}>
                                                    <CalculateIcon fontSize="small" />
                                                </IconButton>
                                                {(
                                                    <Dialog
                                                        open={showFormula}
                                                        onClose={() => {
                                                            setShowFormula(false);
                                                        }}
                                                        aria-labelledby="alert-dialog-title"
                                                        aria-describedby="alert-dialog-description"
                                                    >
                                                        <DialogTitle id="alert-dialog-title">Formula for row: {products1.find(product => product.id === formulaProductId)?.name}</DialogTitle>
                                                        <DialogContent>
                                                            <br></br>
                                                            <br></br>
                                                            {/* Render each dropdown dynamically based on selectedValues and operators */}
                                                            {selectedValues.map((selectedValue, index) => (
                                                                <div key={index} style={{ width: 400, display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                                                                    {/* Operator Dropdown on the left */}
                                                                    {index > 0 && (
                                                                        <FormControl style={{ width: 100, marginRight: 8 }}>
                                                                            <InputLabel id={`operator-label-${index}`}>Operator</InputLabel>
                                                                            <Select
                                                                                labelId={`operator-label-${index}`}
                                                                                id={`operator-${index}`}
                                                                                value={operators[index]}
                                                                                onChange={(e) => handleSelectChange(index, 'operator', e)}
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
                                                                            value={selectedValue}
                                                                            onChange={(e) => handleSelectChange(index, 'formula', e)}
                                                                            label={`Select Formula ${index + 1}`}
                                                                        >
                                                                            {Object.keys(products[tabKey]).map((tableKey) => (
                                                                                products[tabKey][tableKey].map((product) => (
                                                                                    <MenuItem key={product.id} value={product.name}>
                                                                                        {product.name}
                                                                                    </MenuItem>
                                                                                ))
                                                                            ))}


                                                                        </Select>
                                                                    </FormControl>

                                                                    {/* Delete Button */}
                                                                    <IconButton
                                                                        onClick={() => handleDeleteDropdown(index)}
                                                                        color="secondary"
                                                                        style={{ marginLeft: 8 }}
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </div>
                                                            ))}

                                                            {/* Button to add a new dropdown */}
                                                            <Button onClick={handleAddDropdown} color="primary" fullWidth>
                                                                Add New Dropdown
                                                            </Button>
                                                        </DialogContent>

                                                        <DialogActions>
                                                            <Button onClick={() => { setShowFormula(false); }} color="primary">
                                                                Cancel
                                                            </Button>
                                                            <Button color="primary" onClick={() => handleApply(tabKey, formulaProductId)}>
                                                                Apply
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                )}
                                                <IconButton onClick={() => handleDeleteRow(product.id, tabKey, tableKey)} style={{ marginLeft: '8px' }}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>

                                            </>
                                        )}
                                    </div>
                                </td>
                                {columns.map((date) => (
                                    <td key={date}>
                                        <TextField
                                            type="number"
                                            value={tabKey === 'downside' ? values[product.id]?.[date] || '' : tabKey === 'base' ? values2[product.id]?.[date] || '' : values3[product.id]?.[date] || ''}
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
            </Box>
        );
    };

    useEffect(() => {
        calculateValues();
    }, [startingValue, initialGrowthRate, growthRates, columns]);
    return (
        <div className="product-list-page" >
            <Box
                sx={{
                    maxWidth: '100%',   // Set width to contain horizontal scroll
                    overflowY: 'auto',  // Enable vertical scrolling
                    border: '1px solid #ccc',
                    borderRadius: '2px'
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
                            label={timePeriod === 'Monthly' ? 'Start Month' : 'Start Year'}
                            value={fromDate}
                            onChange={(newValue) => setFromDate(newValue)}
                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: '160px', padding: '5px' }}
                        />
                        <DatePicker
                            views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                            label={timePeriod === 'Monthly' ? 'End Month' : 'End Year'}
                            value={toDate}
                            onChange={(newValue) => setToDate(newValue)}
                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: '160px', padding: '5px' }}
                        />
                    </LocalizationProvider>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            if (dayjs(fromDate).isBefore(toDate) || dayjs(fromDate).isSame(toDate, timePeriod === 'Monthly' ? 'month' : 'year')) {
                                setShowTabs(true);

                            } else {
                                setShowTabs(false);
                                setShowCard(false);
                                alert("Invalid date range: Start date must be before end date");

                            }
                        }}
                        sx={{ marginLeft: '18px', marginBottom: '15px' }}>
                        Proceed
                    </Button>
                </Box>

                <Box sx={{ width: '90%', margin: '0 auto' }}>
                    {showTabs && <Tabs tab_value={tab_value} onChange={handleTabChange} aria-label="basic tabs example"
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
                    }
                    {tab_value === 0 &&
                        <div>
                            {<Box
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

                                    // position: column.id === 'id' ? 'sticky' : 'static',
                                    // left: column.id === 'id' ? 0 : 'auto',
                                    // zIndex: column.id === 'id' ? 2 : 1, // Ensure sticky column stays on top

                                }}
                            >
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0277bd' }}>
                                            Epidemiology
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#01579b', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table1 ? '' : 'Understand the spread of diseases and their impact.'}
                                        </Typography>
                                    </Box>
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
                                    >
                                        {tabTableVisibility[currentTabKey].table1 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>

                                {tabTableVisibility[currentTabKey].table1 && renderTable(currentTabKey, 'table1')}


                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                </Box>

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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                                            Total GH Patients
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#880e4f', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table2 ? '' : 'Overview of total patients diagnosed with GH.'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        aria-label='add'
                                        size="large"
                                        sx={{
                                            color: '#c2185b', // Matching button color to the card title
                                            backgroundColor: '#f1f8e9', // Light green background for the button
                                            borderRadius: '50%', // Circular button
                                            '&:hover': {
                                                backgroundColor: '#c8e6c9', // Hover effect on the button
                                            },
                                            transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                            transform: tabTableVisibility[currentTabKey].table2 ? 'rotate(45deg)' : 'rotate(0deg)'
                                        }}
                                        onClick={() => toggleTableVisibility(currentTabKey, 'table2')}
                                    >
                                        {tabTableVisibility[currentTabKey].table2 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table2 && renderTable(currentTabKey, 'table2')}

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                </Box>
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d47d4c' }}>
                                            Conversion Parameter
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#bc5a3c', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table3 ? '' : 'Adjust conversion factors for accurate data representation.'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        aria-label={tabTableVisibility[currentTabKey].table3 ? 'subtract' : 'add'}
                                        size="large"
                                        sx={{
                                            color: '#d47d4c', // Match the color of the button with the title
                                            backgroundColor: '#fff3e0', // Light peach button background
                                            borderRadius: '50%', // Circular button
                                            '&:hover': {
                                                backgroundColor: '#ffcc80', // Button hover effect with a darker peach color
                                            },
                                            transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                            transform: tabTableVisibility[currentTabKey].table3 ? 'rotate(45deg)' : 'rotate(0deg)'
                                        }}
                                        onClick={() => toggleTableVisibility(currentTabKey, 'table3')}
                                    >
                                        {tabTableVisibility[currentTabKey].table3 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table3 && renderTable(currentTabKey, 'table3')}
                            </Box>}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="contained" onClick={() => {
                                        if (!tabTableVisibility[currentTabKey].table1) toggleTableVisibility(currentTabKey, 'table1')
                                        if (!tabTableVisibility[currentTabKey].table2) toggleTableVisibility(currentTabKey, 'table2')
                                        if (!tabTableVisibility[currentTabKey].table3) toggleTableVisibility(currentTabKey, 'table3')

                                    }} color="primary" sx={{ fontSize: '0.8rem' }}>
                                        Show Preview
                                    </Button>
                                    <Button variant="contained" onClick={() => {
                                        toggleTableVisibility(currentTabKey, 'table1');
                                        toggleTableVisibility(currentTabKey, 'table2');
                                        toggleTableVisibility(currentTabKey, 'table3');

                                    }} color="primary" sx={{ fontSize: '0.8rem' }}>
                                        Close Preview
                                    </Button>
                                </Box>
                            </Box>
                        </div>}


                    {tab_value === 1 &&
                        <div>
                            {<Box
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

                                    // position: column.id === 'id' ? 'sticky' : 'static',
                                    // left: column.id === 'id' ? 0 : 'auto',
                                    // zIndex: column.id === 'id' ? 2 : 1, // Ensure sticky column stays on top

                                }}
                            >
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0277bd' }}>
                                            Epidemiology
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#01579b', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table1 ? '' : 'Understand the spread of diseases and their impact.'}
                                        </Typography>
                                    </Box>
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
                                    >
                                        {tabTableVisibility[currentTabKey].table1 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table1 && renderTable(currentTabKey, 'table1')}


                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                </Box>

                                <Card
                                    sx={{
                                        width: '100%', // Make it responsive
                                        maxHeight: showTable2 ? 100 : 200,
                                        maxWidth: showTable2 ? 200 : 360,
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                                            Total GH Patients
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#880e4f', marginTop: 1 }}>
                                            {showTable2 ? '' : 'Overview of total patients diagnosed with GH.'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        aria-label='add'
                                        size="large"
                                        sx={{
                                            color: '#c2185b', // Matching button color to the card title
                                            backgroundColor: '#f1f8e9', // Light green background for the button
                                            borderRadius: '50%', // Circular button
                                            '&:hover': {
                                                backgroundColor: '#c8e6c9', // Hover effect on the button
                                            },
                                            transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                            transform: showTable2 ? 'rotate(45deg)' : 'rotate(0deg)'
                                        }}
                                        onClick={() => toggleTableVisibility(currentTabKey, 'table2')}
                                    >
                                        {tabTableVisibility[currentTabKey].table2 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table2 && renderTable(currentTabKey, 'table2')}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                </Box>
                                <Card
                                    sx={{
                                        width: '100%', // Make it responsive
                                        maxHeight: showTable3 ? 100 : 200,
                                        maxWidth: showTable3 ? 200 : 360,
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d47d4c' }}>
                                            Conversion Parameter
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#bc5a3c', marginTop: 1 }}>
                                            {showTable3 ? '' : 'Adjust conversion factors for accurate data representation.'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        aria-label={showTable3 ? 'subtract' : 'add'}
                                        size="large"
                                        sx={{
                                            color: '#d47d4c', // Match the color of the button with the title
                                            backgroundColor: '#fff3e0', // Light peach button background
                                            borderRadius: '50%', // Circular button
                                            '&:hover': {
                                                backgroundColor: '#ffcc80', // Button hover effect with a darker peach color
                                            },
                                            transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                            transform: showTable3 ? 'rotate(45deg)' : 'rotate(0deg)'
                                        }}
                                        onClick={() => toggleTableVisibility(currentTabKey, 'table3')}
                                    >
                                        {tabTableVisibility[currentTabKey].table3 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table3 && renderTable(currentTabKey, 'table3')}
                            </Box>}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="contained" onClick={() => {
                                        if (!tabTableVisibility[currentTabKey].table1) toggleTableVisibility(currentTabKey, 'table1')
                                        if (!tabTableVisibility[currentTabKey].table2) toggleTableVisibility(currentTabKey, 'table2')
                                        if (!tabTableVisibility[currentTabKey].table3) toggleTableVisibility(currentTabKey, 'table3')

                                    }} color="primary" sx={{ fontSize: '0.8rem' }}>
                                        Show Preview
                                    </Button>
                                    <Button variant="contained" onClick={() => {
                                        toggleTableVisibility(currentTabKey, 'table1');
                                        toggleTableVisibility(currentTabKey, 'table2');
                                        toggleTableVisibility(currentTabKey, 'table3');

                                    }} color="primary" sx={{ fontSize: '0.8rem' }}>
                                        Close Preview
                                    </Button>
                                </Box>
                            </Box>
                        </div>}


                    {tab_value === 2 &&
                        <div>
                            {<Box
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

                                    // position: column.id === 'id' ? 'sticky' : 'static',
                                    // left: column.id === 'id' ? 0 : 'auto',
                                    // zIndex: column.id === 'id' ? 2 : 1, // Ensure sticky column stays on top

                                }}
                            >
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0277bd' }}>
                                            Epidemiology
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#01579b', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table1 ? '' : 'Understand the spread of diseases and their impact.'}
                                        </Typography>
                                    </Box>
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
                                    >
                                        {tabTableVisibility[currentTabKey].table1 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table1 && renderTable(currentTabKey, 'table1')}


                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                </Box>

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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#c2185b' }}>
                                            Total GH Patients
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#880e4f', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table2 ? '' : 'Overview of total patients diagnosed with GH.'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        aria-label='add'
                                        size="large"
                                        sx={{
                                            color: '#c2185b', // Matching button color to the card title
                                            backgroundColor: '#f1f8e9', // Light green background for the button
                                            borderRadius: '50%', // Circular button
                                            '&:hover': {
                                                backgroundColor: '#c8e6c9', // Hover effect on the button
                                            },
                                            transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                            transform: tabTableVisibility[currentTabKey].table2 ? 'rotate(45deg)' : 'rotate(0deg)'
                                        }}
                                        onClick={() => toggleTableVisibility(currentTabKey, 'table2')}
                                    >
                                        {tabTableVisibility[currentTabKey].table2 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table2 && renderTable(currentTabKey, 'table2')}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src="https://pluspng.com/img-png/down-arrow-png-down-icon-1600.png" width="20px" height="20px" alt="Downward arrow" />
                                </Box>
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
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d47d4c' }}>
                                            Conversion Parameter
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#bc5a3c', marginTop: 1 }}>
                                            {tabTableVisibility[currentTabKey].table3 ? '' : 'Adjust conversion factors for accurate data representation.'}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        aria-label={tabTableVisibility[currentTabKey].table3 ? 'subtract' : 'add'}
                                        size="large"
                                        sx={{
                                            color: '#d47d4c', // Match the color of the button with the title
                                            backgroundColor: '#fff3e0', // Light peach button background
                                            borderRadius: '50%', // Circular button
                                            '&:hover': {
                                                backgroundColor: '#ffcc80', // Button hover effect with a darker peach color
                                            },
                                            transition: 'background-color 0.3s ease, transform 0.2s ease', // Added transition for smooth effects
                                            transform: tabTableVisibility[currentTabKey].table3 ? 'rotate(45deg)' : 'rotate(0deg)'
                                        }}
                                        onClick={() => toggleTableVisibility(currentTabKey, 'table3')}
                                    >
                                        {tabTableVisibility[currentTabKey].table3 ? <RemoveIcon /> : <AddIcon />}
                                    </IconButton>
                                </Card>
                                {tabTableVisibility[currentTabKey].table3 && renderTable(currentTabKey, 'table3')}
                            </Box>}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="contained" onClick={() => {
                                        if (!tabTableVisibility[currentTabKey].table1) toggleTableVisibility(currentTabKey, 'table1')
                                        if (!tabTableVisibility[currentTabKey].table2) toggleTableVisibility(currentTabKey, 'table2')
                                        if (!tabTableVisibility[currentTabKey].table3) toggleTableVisibility(currentTabKey, 'table3')

                                    }} color="primary" sx={{ fontSize: '0.8rem' }}>
                                        Show Preview
                                    </Button>
                                    <Button variant="contained" onClick={() => {
                                        toggleTableVisibility(currentTabKey, 'table1');
                                        toggleTableVisibility(currentTabKey, 'table2');
                                        toggleTableVisibility(currentTabKey, 'table3');

                                    }} color="primary" sx={{ fontSize: '0.8rem' }}>
                                        Close Preview
                                    </Button>
                                </Box>
                            </Box>
                        </div>}
                </Box>
            </Box>



            <Dialog
                open={openInfoMethodDialog}
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
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Enter Source Link/Upload File"
                                InputProps={{
                                    sx: {
                                        fontSize: '1.1rem',
                                        fontWeight: 'medium',
                                        marginLeft: '10px'
                                    },
                                }}
                            />
                            <ListItemIcon sx={{ minWidth: 'unset' }}>
                                <Tooltip title="Upload file" marginLeft="20px">
                                    <IconButton component="label" sx={{ position: 'relative', zIndex: 1 }}>
                                        <UploadFileIcon />
                                        <input type="file" hidden style={{ position: 'relative', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, zIndex: 2 }} />
                                    </IconButton>
                                </Tooltip>
                            </ListItemIcon>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions sx={{ padding: '16px', backgroundColor: '#f0f4fa' }}>
                    <Button onClick={handleCloseInfoMethodDialog} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

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


        </div >
    );
};


export default ProductListPage;
