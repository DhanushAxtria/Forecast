import React, { useState, useEffect, useContext } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import produce from "immer";
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
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdjustIcon from '@mui/icons-material/Adjust';
import './ProductListpage.scss';
import { MyContext } from './context';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid';


const KPI = () => {
    const { products, timePeriod, Formulas, fromDate, toDate, values, values2, values3 } = useContext(MyContext);
    const [Index, setIndex] = useState("");
    const [buttonType, setButtonType] = useState("");
    const [editingHighFileToFill, setEditingHighFileToFill] = useState({});
    const [highFileToFill, setHighFileToFill] = useState({});
    const [editingLowFileToFill, setEditingLowFileToFill] = useState({});
    const [lowFileToFill, setLowFileToFill] = useState({});
    const [highMethodForRow, setHighMethodForRow] = useState({});
    const [lowMethodForRow, setLowMethodForRow] = useState({});
    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);
    const [openStartEndDialog, setOpenStartEndDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [editingHighStartValue, setEditingHighStartValue] = useState({}); // Start value for High Case
    const [editingHighEndValue, setEditingHighEndValue] = useState({}); // End value for High Case
    const [editingLowStartValue, setEditingLowStartValue] = useState({}); // Start value for Low Case
    const [editingLowEndValue, setEditingLowEndValue] = useState({}); // End value for Low Case
    const [highStartValue, setHighStartValue] = useState({}); // Saved High Case Start Values
    const [highEndValue, setHighEndValue] = useState({}); // Saved High Case End Values
    const [lowStartValue, setLowStartValue] = useState({}); // Saved Low Case Start Values
    const [lowEndValue, setLowEndValue] = useState({}); // Saved Low Case End Values
    const [dropdownGroups, setDropdownGroups] = useState([
        { Case: "", OutputMetric: "", Field: "" },
    ]);

    const handleAddDropdownGroup = () => {
        setDropdownGroups([...dropdownGroups, { Case: "", OutputMetric: "", Field: "" }]);
        console.log(dropdownGroups);
    };

    const updateStatesOnDelete = (index, setters) => {
        setters.forEach((setState) => {
            setState((prevDict) => {
                const updatedDict = { ...prevDict };
                delete updatedDict[index];
                Object.keys(updatedDict).forEach((key) => {
                    if (key > index) {
                        updatedDict[key - 1] = updatedDict[key];
                        delete updatedDict[key];
                    }
                });
                return updatedDict;
            });

        });
    };
    const handleStartEndvaluesfordelete = (index) => {
        updateStatesOnDelete(index, [
            setEditingHighStartValue,
            setEditingHighEndValue,
            setEditingLowStartValue,
            setEditingLowEndValue,
            setHighStartValue,
            setHighEndValue,
            setLowStartValue,
            setLowEndValue,
            setHighFileToFill,
            setLowFileToFill,
            setEditingHighFileToFill,
            setEditingLowFileToFill,
            setHighMethodForRow,
            setLowMethodForRow,
        ]);
    };
    const handleDeleteDropdownGroup = (index) => {
        console.log(index);
        const updatedGroups = dropdownGroups.filter((_, i) => i !== index);
        setDropdownGroups(updatedGroups);
        handleStartEndvaluesfordelete(index);
    };

    const handleDropdownChange = (index, field, value) => {
        const updatedGroups = [...dropdownGroups];
        updatedGroups[index][field] = value;
        setDropdownGroups(updatedGroups);
    };

    const isLastRowFilled =
        dropdownGroups.length > 0 &&
        dropdownGroups[dropdownGroups.length - 1].Case &&
        dropdownGroups[dropdownGroups.length - 1].OutputMetric &&
        dropdownGroups[dropdownGroups.length - 1].Field;

    const handleSaveStartEndValues = () => {
        if (buttonType === "High") {
            setHighMethodForRow(prev => ({ ...prev, [Index]: "StartEnd" }));
            setHighStartValue(editingHighStartValue);
            setHighEndValue(editingHighEndValue);
        } else if (buttonType === "Low") {
            setLowMethodForRow(prev => ({ ...prev, [Index]: "StartEnd" }));
            setLowStartValue(editingLowStartValue);
            setLowEndValue(editingLowEndValue);
        }
        setOpenStartEndDialog(false);
    };

    const handleCancelStartAndEnd = () => {
        if (buttonType === "High") {
            setEditingHighStartValue(highStartValue);
            setEditingHighEndValue(highEndValue);
        } else if (buttonType === "Low") {
            setEditingLowStartValue(lowStartValue);
            setEditingLowEndValue(lowEndValue);
        }
        setOpenStartEndDialog(false);
        setOpenInputMethodDialog(true);
    };

    const handleInputMethodSelect = (method) => {
        setOpenInputMethodDialog(false);
        if (method === 'startEndValues') {
            setOpenStartEndDialog(true);
        }
        else if (method === 'file') {
            setOpenUploadDialog(true);
        }
    };

    const handlefilefillfromupload = () => {
        if (buttonType === 'High') {
            setHighMethodForRow(prev => ({ ...prev, [Index]: "file" }));
            setHighFileToFill(editingHighFileToFill);
            setOpenUploadDialog(false);
            console.log(highFileToFill);
        }
        else {
            setLowMethodForRow(prev => ({ ...prev, [Index]: "file" }));
            setLowFileToFill(editingLowFileToFill);
            setOpenUploadDialog(false);
            console.log(lowFileToFill);
        }
    }
    const handleCancelUpload = () => {
        if (buttonType === "High") {
            setEditingHighFileToFill(highFileToFill);
        } else if (buttonType === "Low") {
            setEditingLowFileToFill(lowFileToFill);
        }
        setOpenUploadDialog(false);
        setOpenInputMethodDialog(true);
    };

    const findVal = (method, buttontype, index) => {
        let res = {};
        if (timePeriod === 'Monthly') {
            for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'month') + 1; i++) {
                const month = dayjs(fromDate).add(i, 'month').format('MMM-YYYY');
                if (!res[month]) {
                    res[month] = "0";
                }
            }
        }
        else {
            for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'year') + 1; i++) {
                const year = dayjs(fromDate).add(i, 'year').format('YYYY');
                if (!res[year]) {
                    res[year] = "0";
                }
            }
        }
        if (method === 'StartEnd') {
            const start = parseFloat(buttontype === 'High' ? highStartValue[index] : lowStartValue[index]);
            const end = parseFloat(buttontype === 'High' ? highEndValue[index] : lowEndValue[index]);
            const len = Object.keys(res).length;
            const inc = (end - start) / (len - 1);
            let val = start;
            Object.keys(res).forEach((key) => {
                res[key] = parseFloat(val.toFixed(2));
                val += inc;
            });
            return res;
        }
        else if (method === 'file') {
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
                    // Loop through the months between fromDate and toDate
                    for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'month') + 1; i++) {
                        const month = dayjs(fromDate).add(i, 'month').format('MMM-YYYY');
                        // Find the index of the month in the dateHeaders array
                        const monthIndex = dateHeaders.indexOf(month);
                        if (monthIndex !== -1) {
                            // Get the value at the index from the first row of the CSV file
                            const val = firstRow[monthIndex];
                            // Update the values in the state
                            res[month] = val;
                        }
                    }
                };
                reader.readAsText(buttonType === 'High' ? highFileToFill[index] : lowFileToFill[index]);
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

                    for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'year') + 1; i++) {
                        const month = dayjs(fromDate).add(i, 'year').format('YYYY');
                        console.log(month);
                        const monthIndex = dateHeaders.indexOf(month);
                        if (monthIndex !== -1) {
                            const val = firstRow[monthIndex];
                            res[month] = val;
                        }
                    }
                };
                reader.readAsText(buttonType === 'High' ? highFileToFill[index] : lowFileToFill[index]);
            }
            return res;
        }
        return {}
    }
    const handleApplyFormula = (selectedIds, tabKey, operators, row_id, method, buttontype, index) => {

        let res = {}; // Object to store the results of the forecast calculation
        if (timePeriod === 'Monthly') {
            // Loop through the months in the time period and create a key for each in the results object
            // if the key doesn't already exist
            for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'month') + 1; i++) {
                const month = dayjs(fromDate).add(i, 'month').format('MMM-YYYY');
                if (!res[month]) {
                    res[month] = "0";
                }
            }
        }
        else {
            for (let i = 0; i < dayjs(toDate).diff(dayjs(fromDate), 'year') + 1; i++) {
                const year = dayjs(fromDate).add(i, 'year').format('YYYY');
                if (!res[year]) {
                    res[year] = "0";
                }
            }
        }
        let idd = null;
        let val = null;
        if (row_id === selectedIds[0]) {
            idd = selectedIds[0];
            val = findVal(method, buttontype, index);
        }
        else {
            idd = selectedIds[0];
            val = tabKey === 'downside' ? values[idd] : tabKey === 'base' ? values2[idd] : values3[idd];
        }
        // If the product has values, loop through its values and add them to the results object
        if (val !== undefined) {
            Object.keys(val).forEach((key) => {
                res[key] = val[key];
            });
        }

        // Iterate over the selected product IDs starting from the second element
        for (let i = 1; i < selectedIds.length; i++) {
            let id = null;
            let tempval = null;
            if (selectedIds[i] === row_id) {
                id = selectedIds[i];
                tempval = findVal(method, buttontype, index);
            }
            else {
                id = selectedIds[i];
                tempval = tabKey === 'downside' ? values[id] : tabKey === 'base' ? values2[id] : values3[id];
            }

            // If the product values exist, perform calculations based on the selected operator
            if (tempval !== undefined) {
                Object.keys(tempval).forEach((key) => {
                    const currentOperator = operators[i - 1];
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
        return res;
    };
    const KPIAnalysis = () => {
        dropdownGroups.forEach((row, index) => {
            const formulaCase = Formulas[row.Case];
            let formula = null;
            let operators = null;
            Object.keys(formulaCase).forEach((key) => {
                if (formulaCase[key][row.OutputMetric]) {
                    formula = formulaCase[key][row.OutputMetric].emptyArray;
                    operators = formulaCase[key][row.OutputMetric].plusArray;
                    operators = operators.slice(1);
                }
            });
            const row_id = row.Field;
            const highmethod = highMethodForRow[index];
            const lowmethod = lowMethodForRow[index];
            const presentval = row.Case === 'downside' ? values[row.OutputMetric] : row.Case === 'base' ? values2[row.OutputMetric] : values3[row.OutputMetric];
            const Highres = handleApplyFormula(formula, row.Case, operators, row_id, highmethod, "High", index);
            const Lowres = handleApplyFormula(formula, row.Case, operators, row_id, lowmethod, "Low", index);
            console.log(presentval);
            console.log(Highres);
            console.log(Lowres);
            const presentSum = Object.keys(presentval).reduce((prev, curr) => prev + parseFloat(presentval[curr], 10), 0).toFixed(2);
            const HighresSum = Object.keys(Highres).reduce((prev, curr) => prev + parseFloat(Highres[curr], 10), 0).toFixed(2);
            const LowresSum = Object.keys(Lowres).reduce((prev, curr) => prev + parseFloat(Lowres[curr], 10), 0).toFixed(2);
            console.log(HighresSum, presentSum, LowresSum);

        });
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 2,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => KPIAnalysis()}
                    disabled={dropdownGroups.length === 0 || dropdownGroups.some((row) => row.OutputMetric === "" || row.Field === "" || row.Case === "")}
                >
                    Apply
                </Button>
            </Box>
            {dropdownGroups.map((group, index) => (
                <>
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        {/* Case Dropdown */}
                        <FormControl sx={{ m: 1, width: "15ch" }}>
                            <InputLabel id={`case-select-label-${index}`}>Case</InputLabel>
                            <Select
                                labelId={`case-select-label-${index}`}
                                id={`case-select-${index}`}
                                value={group.Case}
                                label="Case"
                                onChange={(e) => handleDropdownChange(index, "Case", e.target.value)}
                                sx={{ fontSize: "0.9rem" }}
                            >
                                <MenuItem value="downside">Downside</MenuItem>
                                <MenuItem value="base">Base</MenuItem>
                                <MenuItem value="upside">Upside</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Output Metric Dropdown */}
                        {group.Case && (
                            <FormControl sx={{ m: 1, width: "15ch" }}>
                                <InputLabel id={`output-metric-select-label-${index}`}>Output Metric</InputLabel>
                                <Select
                                    labelId={`output-metric-select-label-${index}`}
                                    id={`output-metric-select-${index}`}
                                    value={group.OutputMetric}
                                    label="Output Metric"
                                    onChange={(e) => handleDropdownChange(index, "OutputMetric", e.target.value)}
                                    sx={{ fontSize: "0.9rem" }}
                                >
                                    {products[group.Case] &&
                                        Object.entries(products[group.Case]).map(([tableKey, tableValue]) =>
                                            Object.entries(tableValue).map(([id, value]) => (
                                                <MenuItem key={`${tableKey}-${id}`} value={value.id}>
                                                    {value.name}
                                                </MenuItem>
                                            )))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Field Dropdown */}
                        {group.OutputMetric && (
                            <FormControl sx={{ m: 1, width: "15ch" }}>
                                <InputLabel id={`field-select-label-${index}`}>Field</InputLabel>
                                <Select
                                    labelId={`field-select-label-${index}`}
                                    id={`field-select-${index}`}
                                    value={group.Field}
                                    label="Field"
                                    onChange={(e) => handleDropdownChange(index, "Field", e.target.value)}
                                    sx={{ fontSize: "0.9rem" }}
                                >
                                    {products[group.Case] &&
                                        Object.entries(products[group.Case]).map(([tableKey, tableValue]) =>
                                            Object.entries(tableValue).map(([id, value]) => (
                                                <MenuItem key={`${tableKey}-${id}`} value={value.id}>
                                                    {value.name}
                                                </MenuItem>
                                            )))}
                                </Select>
                            </FormControl>
                        )}

                        {/* High Case Input and Low Case Input Buttons */}
                        {group.Case && group.OutputMetric && group.Field && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    sx={{ ml: 1, width: "6ch", height: "7ch" }}
                                    onClick={() => {
                                        setIndex(index);
                                        setButtonType("High");
                                        setOpenInputMethodDialog(true);
                                    }}
                                >
                                    High Case
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ ml: 1, width: "6ch", height: "7ch" }}
                                    onClick={() => {
                                        setIndex(index);
                                        setButtonType("Low")
                                        setOpenInputMethodDialog(true)
                                    }}
                                >
                                    Low Case
                                </Button>
                            </>
                        )}

                        {/* Add and Delete Buttons */}
                        {index === dropdownGroups.length - 1 && dropdownGroups.length < 6 && isLastRowFilled && (
                            <IconButton
                                title="Add new parameters"
                                aria-label="add"
                                sx={{ color: "blue", bgcolor: "blue.100", ml: 1 }}
                                onClick={handleAddDropdownGroup}
                            >
                                <AddIcon />
                            </IconButton>
                        )}

                        {dropdownGroups.length > 1 && (
                            <IconButton
                                title="Delete this row"
                                aria-label="delete"
                                sx={{ color: "purple", ml: 1 }}
                                onClick={() => handleDeleteDropdownGroup(index)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                    {
                        <Grid container spacing={1} sx={{ mb: 2, mt: 2 }}>
                            {highStartValue[index] !== undefined && highEndValue[index] !== undefined && highMethodForRow[index] === "StartEnd" && (
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="span" sx={{ fontSize: "0.8rem" }}>
                                        High Case: Start and End values
                                    </Typography>
                                </Grid>
                            )}
                            {lowStartValue[index] !== undefined && lowEndValue[index] !== undefined && lowMethodForRow[index] === "StartEnd" &&
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="span" sx={{ fontSize: "0.8rem" }}>
                                        Low Case: Start and End values
                                    </Typography>
                                </Grid>}
                            {highFileToFill[index] !== undefined && highMethodForRow[index] === "file" &&
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="span" sx={{ fontSize: "0.8rem" }}>
                                        High Case: Upload File
                                    </Typography>
                                </Grid>}
                            {lowFileToFill[index] !== undefined && lowMethodForRow[index] === "file" &&
                                <Grid item xs={12}>
                                    <Typography variant="body2" component="span" sx={{ fontSize: "0.8rem" }}>
                                        Low Case: Upload File
                                    </Typography>
                                </Grid>}
                        </Grid >
                    }
                </>
            ))
            }


            {
                <Dialog open={openInputMethodDialog} onClose={() => { setOpenInputMethodDialog(false); }}
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
                        Input Method For {buttonType} Case
                    </DialogTitle>
                    <DialogContent sx={{ padding: '24px', backgroundColor: '#fafafa' }}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {/* Growth Rate */}
                            <ListItem
                                button
                                //onClick={() => handleInputMethodSelect('growthRate')}
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
                                <TrendingUpIcon color="primary" sx={{ marginRight: '12px' }} />
                                <ListItemText primary="Set Initial Values with Growth Rate" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>

                            {/* Start and End Values */}
                            <ListItem
                                button
                                onClick={() => handleInputMethodSelect('startEndValues')}
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
                                <ListItemText primary="Specify Starting and Target Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>
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
                            <ListItem
                                button
                                //onClick={() => handleInputMethodSelect('copy')}
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
                                <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                                <ListItemText primary="Copy from" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>
                            <ListItem
                                button
                                //onClick={() => handleInputMethodSelect('%')}
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
                                    5.
                                </Typography>
                                <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                                <ListItemText primary="Change by %" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>
                            <ListItem
                                button
                                //onClick={() => handleInputMethodSelect('Absolute')}
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
                                <ListItemText primary="Change by Absolute Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>
                        </List>
                    </DialogContent>
                    <DialogActions sx={{ padding: '16px', backgroundColor: '#f0f4fa' }}>
                        <Button onClick={() => { setOpenInputMethodDialog(false); }} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            {
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
                                value={(buttonType === "High" ? editingHighStartValue[Index] : editingLowStartValue[Index]) || ''}
                                onChange={(e) => {
                                    if (buttonType === "High") {
                                        setEditingHighStartValue(prev => ({ ...prev, [Index]: e.target.value }));
                                    } else {
                                        setEditingLowStartValue(prev => ({ ...prev, [Index]: e.target.value }));
                                    }
                                }}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="End Value"
                                type="number"
                                value={(buttonType === "High" ? editingHighEndValue[Index] : editingLowEndValue[Index]) || ''}
                                onChange={(e) => {
                                    if (buttonType === "High") {
                                        setEditingHighEndValue(prev => ({ ...prev, [Index]: e.target.value }));
                                    } else {
                                        setEditingLowEndValue(prev => ({ ...prev, [Index]: e.target.value }));
                                    }
                                }}
                                size="small"
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelStartAndEnd} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => { handleSaveStartEndValues() }} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            {
                <Dialog open={openUploadDialog} onClose={() => { setOpenUploadDialog(false); }} maxWidth="sm" fullWidth>

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
                                        onChange={(e) => { buttonType === 'High' ? setEditingHighFileToFill(prev => ({ ...prev, [Index]: e.target.files[0] })) : setEditingLowFileToFill(prev => ({ ...prev, [Index]: e.target.files[0] })) }}
                                    />
                                </Button>
                                <Typography
                                    align="center"
                                    sx={{ color: 'green' }}
                                >
                                    {/* The text to display when a file has been uploaded successfully */}
                                    {buttonType === 'High' ? editingHighFileToFill[Index] !== undefined ? "file uploaded successfully" : "" : editingLowFileToFill[Index] !== undefined ? "file uploaded successfully" : ""}
                                </Typography>
                                <Button variant="outlined" color="primary" fullWidth>
                                    {/* The button to select a file from AWS/Azure */}
                                    Select File from AWS/Azure
                                </Button>
                            </Box>
                        </DialogContent>
                    </Tooltip>
                    <DialogActions>
                        <Button onClick={handleCancelUpload} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => handlefilefillfromupload()} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            }

        </>
    );
};
export default KPI;

