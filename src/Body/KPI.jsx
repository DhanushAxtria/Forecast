import React, { useState, useEffect, useContext } from 'react';
import introJs from 'intro.js';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import Select from '@mui/material/Select';
import GetAppIcon from '@mui/icons-material/GetApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';
import { Snackbar } from '@mui/material';
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
    Card,
    Box,
    Tabs,
    Tab,
    InputLabel,
    TableRow,
    Paper,
    TableCell,
    TableContainer
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
import { Table, TableHead, TableBody } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, LabelList } from 'recharts';
const KPI = () => {
    const navigate = useNavigate();
    const [baseRev, setBaseRev] = useState(0);
    const [applyClicked, setApplyClicked] = useState(false);
    const { products, timePeriod, Formulas, fromHistoricalDate, toForecastDate, values, values2, values3 } = useContext(MyContext);
    const [Res, setRes] = useState({});
    const [Index, setIndex] = useState("");

    const [buttonType, setButtonType] = useState("");
    const [editingHighFileToFill, setEditingHighFileToFill] = useState({});
    const [highFileToFill, setHighFileToFill] = useState({});
    const [editingLowFileToFill, setEditingLowFileToFill] = useState({});
    const [lowFileToFill, setLowFileToFill] = useState({});
    const [highMethodForRow, setHighMethodForRow] = useState({
        "0": "%",
        "1": "%",
    });
    const [lowMethodForRow, setLowMethodForRow] = useState({
        "0": "%",
        "1": "%",
    });
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
        { Case: "base", OutputMetric: "T3-12", Field: "T1-3" },
        { Case: "base", OutputMetric: "T3-12", Field: "T3-9" },
    ]);
    const [openGrowthRateDialog, setOpenGrowthRateDialog] = useState(false);
    const [highGrowthRates, setHighGrowthRates] = useState({});
    const [highStartingValue, setHighStartingValue] = useState({});
    const [highInitialGrowthRate, setHighInitialGrowthRate] = useState({});
    const [editingHighGrowthRates, setEditingHighGrowthRates] = useState({});
    const [editingHighStartingValue, setEditingHighStartingValue] = useState({});
    const [editingHighInitialGrowthRate, setEditingHighInitialGrowthRate] = useState({});
    const [lowGrowthRates, setLowGrowthRates] = useState({});
    const [lowStartingValue, setLowStartingValue] = useState({});
    const [lowInitialGrowthRate, setLowInitialGrowthRate] = useState({});
    const [editingLowGrowthRates, setEditingLowGrowthRates] = useState({});
    const [editingLowStartingValue, setEditingLowStartingValue] = useState({});
    const [editingLowInitialGrowthRate, setEditingLowInitialGrowthRate] = useState({});
    const [openCopyFromDialog, setOpenCopyFromDialog] = useState(false);
    const [highSelectedCaseOption, setHighSelectedCaseOption] = useState({});
    const [lowSelectedCaseOption, setLowSelectedCaseOption] = useState({});
    const [editingHighSelectedCaseOption, setEditingHighSelectedCaseOption] = useState({});
    const [editingLowSelectedCaseOption, setEditingLowSelectedCaseOption] = useState({});
    const [currentCase, setCurrentCase] = useState({});
    const [lowCaseData, setLowCaseData] = useState([]);
    const [highCaseData, setHighCaseData] = useState([]);
    const [openChangeDialog, setOpenChangeDialog] = useState(false);
    const [editingHighPercentVal, setEditingHighPercentVal] = useState({
        "0": 40,
        "1": 30,
    });
    const [editingLowPercentVal, setEditingLowPercentVal] = useState({
        "0": -35,
        "1": -25,
    });
    const [HighPercentVal, setHighPercentVal] = useState({
        "0": 40,
        "1": 30,
    });
    const [LowPercentVal, setLowPercentVal] = useState({
        "0": -35,
        "1": -25,
    });
    const [lowAbsoluteVal, setLowAbsoluteVal] = useState({});
    const [highAbsoluteVal, setHighAbsoluteVal] = useState({});
    const [editingLowAbsoluteVal, setEditingLowAbsoluteVal] = useState({});
    const [editingHighAbsoluteVal, setEditingHighAbsoluteVal] = useState({});
    const [openAbsoluteVal, setOpenAbsoluteVal] = useState(false);
    const [highresult, setHighResult] = useState({})
    const [lowresult, setLowResult] = useState({})
    const [highresSum, setHighResSum] = useState({})
    const [lowresSum, setLowResSum] = useState({})
    const [mainresult, setMainResult] = useState({})
    const [columns, setColumns] = useState([]);
    const [columns2, setColumns2] = useState([]);
    const [fromDate, setFromDate] = useState(dayjs(fromHistoricalDate));
    const [toDate, setToDate] = useState(dayjs(toForecastDate));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const labels = dropdownGroups
        .map((group) => {
            if (group?.Field && products[group?.Case]) {
                return Object.keys(products[group.Case]).map((tableKey) => {
                    const productList = products[group.Case][tableKey];
                    if (productList) {
                        const product = productList.find((product) => product?.id === group.Field);
                        return product ? product.name : null;
                    }
                    return null;
                })
                    .filter((label) => label !== null);
            }
            return [];
        })
        .flat();

    const labelsOutputMetric = dropdownGroups
        .map((group) => {
            if (group?.OutputMetric && products[group?.Case]) {
                return Object.keys(products[group.Case]).map((tableKey) => {
                    const productList = products[group.Case][tableKey];
                    if (productList) {
                        const product = productList.find((product) => product?.id === group.OutputMetric);
                        return product ? product.name : null;
                    }
                    return null;
                })
                    .filter((label) => label !== null);
            }
            return [];
        })
        .flat();


    const chartData = labels.map((label, index) => ({
        name: `${label} `,
        lowCase: lowCaseData[index],
        highCase: highCaseData[index],
    }));

    const handleAddDropdownGroup = (index) => {
        setDropdownGroups([...dropdownGroups, { Case: dropdownGroups[index].Case, OutputMetric: dropdownGroups[index].OutputMetric, Field: "" }]);
        setCurrentCase(prev => ({
            ...prev,
            [index + 1]: dropdownGroups[index].Case
        }));
        console.log(currentCase);
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
    const handledelete = (index) => {
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
            setEditingHighGrowthRates,
            setEditingLowGrowthRates,
            setEditingHighStartingValue,
            setEditingLowStartingValue,
            setEditingHighInitialGrowthRate,
            setEditingLowInitialGrowthRate,
            setHighGrowthRates,
            setLowGrowthRates,
            setHighInitialGrowthRate,
            setLowInitialGrowthRate,
            setHighStartingValue,
            setLowStartingValue,
            setCurrentCase,
            setEditingHighSelectedCaseOption,
            setEditingLowSelectedCaseOption,
            setHighSelectedCaseOption,
            setLowSelectedCaseOption,
            setEditingHighPercentVal,
            setEditingLowPercentVal,
            setHighPercentVal,
            setLowPercentVal,
            setLowAbsoluteVal,
            setHighAbsoluteVal,
            setEditingHighAbsoluteVal,
            setEditingLowAbsoluteVal,
        ]);
    };
    const handleDeleteDropdownGroup = (index) => {
        const updatedGroups = dropdownGroups.filter((_, i) => i !== index);
        setDropdownGroups(updatedGroups);
        handledelete(index);
    };
    const handleDropdownChange = (index, field, value) => {
        if (field === 'Case') {
            setCurrentCase(prev => ({
                ...prev,
                [index]: value
            }));
            const updatedGroups = [...dropdownGroups];
            updatedGroups.forEach((group, i) => {
                group[field] = value;
            });
            setDropdownGroups(updatedGroups);
        }
        if (field === 'OutputMetric') {
            const updatedGroups = [...dropdownGroups];
            updatedGroups.forEach((group, i) => {
                group[field] = value;
            });
            setDropdownGroups(updatedGroups);
        }
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
        else if (method === 'growthRate') {
            setOpenGrowthRateDialog(true);
        }
        else if (method === 'copy') {
            setOpenCopyFromDialog(true);
        }
        else if (method === '%') {
            setOpenChangeDialog(true);
        }
        else if (method === 'Absolute') {
            setOpenAbsoluteVal(true);
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
    useEffect(() => {
        // Generate the columns based on the selected time period
        // Columns are only regenerated when the time period, start date, or end date changes
        if (timePeriod === 'Monthly') {
            setColumns2(generateMonthlyColumns(fromDate, toDate));
        } else if (timePeriod === 'Yearly') {
            setColumns2(generateYearlyColumns(fromDate, toDate));
        }
    }, [toDate, fromDate, timePeriod, fromHistoricalDate, toForecastDate]);


    const calculateGrowthRateValues = (startingValue, initialGrowthRate, growthRates) => {
        const newValues = {};
        const startDate = dayjs(fromHistoricalDate); // Start date of the calculation period
        const endDate = dayjs(toForecastDate); // End date of the calculation period
        const columnIndexEndDate = columns.indexOf(timePeriod === 'Monthly' ? endDate.format('MMM-YYYY') : endDate.format('YYYY')); // column index of the end date
        const startValue = parseFloat(startingValue);
        const initialGR = parseFloat(initialGrowthRate);
        let currentValue = startValue;
        newValues[columns[0]] = startValue;

        // Calculate the values for the initial growth rate for the entire period (Month or Year)
        for (let i = 1; i <= columnIndexEndDate; i++) {
            currentValue *= (1 + (initialGR / 100))
            const dateKey = timePeriod === 'Monthly'
                ? startDate.add(i, 'month').format('MMM-YYYY')
                : startDate.add(i, 'year').format('YYYY');
            // Set the calculated value for the specific period
            newValues[dateKey] = currentValue.toFixed(2);
        }
        const sortedGrowthRates = null;
        if (growthRates) {
            sortedGrowthRates = [
                { startDate: startDate, growthRate: initialGR }, // Include initial growth rate
                ...growthRates.map((entry) => ({
                    startDate: dayjs(entry.startDate),
                    growthRate: parseFloat(entry.growthRate),
                })),
            ].sort((a, b) => a.startDate?.isBefore(b.startDate) ? -1 : 1); // Sort by startDate
        }
        sortedGrowthRates?.forEach((entry, index) => {
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
                }
            }
        });
        return newValues;
    };
    const findVal = (method, buttontype, index) => {
        const res = {};
        const unit = timePeriod === 'Monthly' ? 'month' : 'year';
        const format = timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY';
        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), unit) + 1; i++) {
            const dateKey = dayjs(fromHistoricalDate).add(i, unit).format(format);
            if (!res[dateKey]) {
                res[dateKey] = "0";
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
            const file = buttontype === "High" ? highFileToFill[index] : lowFileToFill[index];
            if (file) {
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
                        const temp = {}
                        // Loop through the months between fromHistoricalDate and toForecastDate
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'month') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'month').format('MMM-YYYY');
                            // Find the index of the month in the dateHeaders array
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                // Get the value at the index from the first row of the CSV file
                                const val = firstRow[monthIndex];
                                // Update the values in the state
                                temp[month] = val;
                            }
                        }
                        setRes(temp);
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
                        const temp = {}
                        for (let i = 0; i < dayjs(toForecastDate).diff(dayjs(fromHistoricalDate), 'year') + 1; i++) {
                            const month = dayjs(fromHistoricalDate).add(i, 'year').format('YYYY');
                            const monthIndex = dateHeaders.indexOf(month);
                            if (monthIndex !== -1) {
                                const val = firstRow[monthIndex];
                                temp[month] = val;
                            }
                        }
                        setRes(temp);
                    };
                    reader.readAsText(file);
                }
            }
            return Res;
        }
        else if (method === 'growthRate') {
            const startingVal = buttontype === 'High' ? highStartingValue[index] : lowStartingValue[index];
            const initialGrowth = buttontype === 'High' ? highInitialGrowthRate[index] : lowInitialGrowthRate[index];
            const growthRates = buttontype === 'High' ? highGrowthRates[index] : lowGrowthRates[index];
            const temp = calculateGrowthRateValues(startingVal, initialGrowth, growthRates);
            return temp;
        }
        else if (method === 'copy') {
            const tempCase = buttontype === 'High' ? highSelectedCaseOption[index] : lowSelectedCaseOption[index];
            const currentField = dropdownGroups[index]?.Field;
            const valuesMap = {
                upside: values3,
                downside: values,
                base: values2,
            };
            const valuesToUse = valuesMap[tempCase];
            if (valuesToUse?.[currentField]) {
                Object.keys(res).forEach((key) => {
                    res[key] = parseFloat(valuesToUse[currentField][key]);
                });
            } else {
                console.error('No data found');
            }
            return res;
        }
        else if (method === '%') {
            const gp = dropdownGroups[index];
            const temp = gp.Case === 'downside' ? values[gp.Field] : gp.Case === 'base' ? values2[gp.Field] : values3[gp.Field];
            console.log("temp", temp);
            console.log("edd", HighPercentVal[index]);
            Object.keys(temp).forEach((key) => {
                const tmp = buttontype === 'High' ? parseFloat(HighPercentVal[index]) / 100 : parseFloat(LowPercentVal[index]) / 100;
                res[key] = ((1 + tmp) * temp[key]).toFixed(2);
            });
            console.log("res", res);
            return res;
        }
        else if (method === 'Absolute') {
            const tmp = buttontype === 'High' ? highAbsoluteVal[index] : lowAbsoluteVal[index];
            Object.keys(res).forEach((key) => {
                res[key] = tmp;
            });
            return res;
        }
        else {
            const currentRow = dropdownGroups[index]?.Field;
            const currentCase = dropdownGroups[index]?.Case;
            const valuesMap = {
                upside: values3,
                downside: values,
                base: values2,
            };
            const valuesToUse = valuesMap[currentCase];
            if (valuesToUse?.[currentRow]) {
                Object.keys(res).forEach((key) => {
                    res[key] = parseFloat(valuesToUse[currentRow][key]);
                });
            } else {
                console.error('No data found');
            }
            return res;
        }
        return {}
    }
    const handlesavechanges = (tabKey, tableKey, row_id, values) => {
        const prod = products[tabKey][tableKey];
        const productType = prod.find((product) => product.id === row_id)?.type;
        const selectedIds = Formulas[tabKey][tableKey][row_id].emptyArray;
        const operatorsList = Formulas[tabKey][tableKey][row_id].plusArray;
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
        // Get the first selected product's values based on the current tabKey
        const val = values[idd];
        let typee = null;
        Object.keys(products[tabKey]).forEach(table => {
            const temp = products[tabKey][table].find((product) => product.id === idd)?.type;
            if (temp !== undefined) {
                typee = temp;
            }
        });
        // If the product has values, loop through its values and add them to the results object
        if (val !== undefined) {
            Object.keys(val).forEach((key) => {
                if (typee === '%') {
                    res[key] = val[key] / 100;
                }
                else {
                    res[key] = val[key];
                }
            });
        }
        // Iterate over the selected product IDs starting from the second element
        for (let i = 1; i < selectedIds.length; i++) {
            const id = selectedIds[i];
            const tempval = values[id];
            let temptype = null;
            Object.keys(products[tabKey]).forEach(table => {
                const temp = products[tabKey][table].find((product) => product.id === id)?.type;
                if (temp !== undefined) {
                    temptype = temp;
                }
            });
            let tempValue = null;
            if (tempval !== undefined) {
                Object.keys(tempval).forEach((key) => {
                    const currentOperator = operatorSliced[i - 1];
                    const resValue = parseFloat(res[key], 10);
                    if (temptype === '%') {
                        tempValue = parseFloat(tempval[key] / 100, 10);
                    }
                    else {
                        tempValue = parseFloat(tempval[key], 10);
                    }
                    if (currentOperator === '+') {
                        res[key] = resValue + tempValue;
                    } else if (currentOperator === '-') {
                        res[key] = resValue - tempValue;
                    } else if (currentOperator === '*') {
                        res[key] = resValue * tempValue;
                    } else if (currentOperator === '/') {
                        res[key] = resValue / tempValue;
                    }
                });
            }
        }
        return res;
    };

    const KPIAnalysis = () => {
        const dates = timePeriod === 'Monthly' ? generateMonthlyColumns(fromDate, toDate) : generateYearlyColumns(fromDate, toDate);
        console.log("dates", dates);
        // Use local arrays to manage the data
        const newLowCaseData = [];
        const newHighCaseData = [];
        const highResDict = {};
        const lowResDict = {};
        const mainResDict = {};
        const highResSum = {};
        const lowResSum = {};
        dropdownGroups.forEach((row, index) => {
            let valuesHigh = { ... (row.Case === 'downside' ? values : row.Case === 'base' ? values2 : values3) };
            let valuesLow = { ... (row.Case === 'downside' ? values : row.Case === 'base' ? values2 : values3) };
            const temppreval = row.Case === 'downside' ? values[row.OutputMetric] : row.Case === 'base' ? values2[row.OutputMetric] : values3[row.OutputMetric];
            const presentval = {};
            dates.forEach((date) => {
                if (temppreval[date]) {
                    presentval[date] = parseFloat(temppreval[date]).toFixed(2) || temppreval[date];
                }
            });
            mainResDict[index] = presentval;
            const presentSum = Object.keys(presentval).reduce((prev, curr) => prev + parseFloat(presentval[curr] || 0, 10), 0).toFixed(2);
            setBaseRev(presentSum);
            let highres = findVal(highMethodForRow[index], "High", index);
            let lowres = findVal(lowMethodForRow[index], "Low", index);
            valuesHigh = { ...valuesHigh, [row.Field]: highres };
            valuesLow = { ...valuesLow, [row.Field]: lowres };
            let tabKey = row.Case;
            let resHigh = {};
            let resLow = {};
            // update the rows
            for (const tableKey of Object.keys(Formulas[tabKey])) {
                for (const row_id of Object.keys(Formulas[tabKey][tableKey])) {
                    if (Formulas[tabKey][tableKey][row_id].emptyArray[0] !== '' && row_id !== row.Field) {
                        resHigh = handlesavechanges(tabKey, tableKey, row_id, valuesHigh);
                        resLow = handlesavechanges(tabKey, tableKey, row_id, valuesLow);
                        const prod = products[tabKey][tableKey];
                        const productType = prod.find((product) => product.id === row_id)?.type;
                        valuesHigh = {
                            ...valuesHigh,
                            [row_id]: Object.keys(resHigh).reduce((acc, date) => {
                                acc[date] = !resHigh[date] || resHigh[date] === 0 ? '0' : productType === '%' ? resHigh[date] * 100 : resHigh[date];
                                return acc;
                            }, {})
                        };
                        valuesLow = {
                            ...valuesLow,
                            [row_id]: Object.keys(resLow).reduce((acc, date) => {
                                acc[date] = !resLow[date] || resLow[date] === 0 ? '0' : productType === '%' ? resLow[date] * 100 : resLow[date];
                                return acc;
                            }, {})
                        };

                    }
                }
            }
            const Highres = {};
            dates.forEach((date) => {
                if (valuesHigh[row.OutputMetric][date]) {
                    Highres[date] = valuesHigh[row.OutputMetric][date];
                }
            });
            highResDict[index] = Highres;
            const Lowres = {}
            dates.forEach((date) => {
                if (valuesLow[row.OutputMetric][date]) {
                    Lowres[date] = valuesLow[row.OutputMetric][date];
                }
            });
            lowResDict[index] = Lowres;
            const HighresSum = Object.keys(valuesHigh[row.OutputMetric]).filter(date => dates.includes(date)).reduce((prev, curr) => prev + parseFloat(valuesHigh[row.OutputMetric][curr], 10), 0).toFixed(2);
            highResSum[index] = HighresSum;

            const LowresSum = Object.keys(valuesLow[row.OutputMetric])
                .filter(date => dates.includes(date))
                .reduce((prev, curr) => prev + parseFloat(valuesLow[row.OutputMetric][curr], 10), 0)
                .toFixed(2);
            lowResSum[index] = LowresSum;
            const highdiff = HighresSum - presentSum;
            const lowdiff = LowresSum - presentSum;
            newLowCaseData.push(lowdiff !== undefined ? lowdiff : 0);
            newHighCaseData.push(highdiff !== undefined ? highdiff : 0);
            setLowCaseData(newLowCaseData);
            setHighCaseData(newHighCaseData);
            setHighResult(highResDict);
            setLowResult(lowResDict);
            setMainResult(mainResDict)
            setHighResSum(highResSum);
            setLowResSum(lowResSum);
            setApplyClicked(true);
        });
        
    };

    const handleAddGrowthRate = () => {
        if (buttonType === "High") {
            const lastStartDate = editingHighGrowthRates[Index]?.[editingHighGrowthRates[Index].length - 1]?.startDate;
            setEditingHighGrowthRates((prev) => ({
                ...prev,
                [Index]: [
                    ...(prev[Index] || []), // Initialize as an empty array if undefined
                    { startDate: lastStartDate ? lastStartDate : dayjs(), growthRate: 0 },
                ],
            }));
        } else if (buttonType === "Low") {
            const lastStartDate = editingLowGrowthRates[Index]?.[editingLowGrowthRates[Index].length - 1]?.startDate;
            setEditingLowGrowthRates((prev) => ({
                ...prev,
                [Index]: [
                    ...(prev[Index] || []), // Initialize as an empty array if undefined
                    { startDate: lastStartDate ? lastStartDate : dayjs(), growthRate: 0 },
                ],
            }));
        }
    };
    const handleRemoveGrowthRate = (index) => {
        if (buttonType === "High") {
            setEditingHighGrowthRates((prev) => ({
                ...prev,
                [Index]: prev[Index].filter((_, i) => i !== index)
            }));
        } else if (buttonType === "Low") {
            setEditingLowGrowthRates((prev) => ({
                ...prev,
                [Index]: prev[Index].filter((_, i) => i !== index)
            }));
        }
    }
    const handleGrowthRateChange = (index, field, value) => {
        if (buttonType === "High") {
            setEditingHighGrowthRates((prev) => ({
                ...prev,
                [Index]: prev[Index].map((item, i) =>
                    i === index ? { ...item, [field]: field === 'startDate' ? dayjs(value) : value } : item
                ),
            }));
        } else if (buttonType === "Low") {
            setEditingLowGrowthRates((prev) => ({
                ...prev,
                [Index]: prev[Index].map((item, i) =>
                    i === index ? { ...item, [field]: field === 'startDate' ? dayjs(value) : value } : item
                ),
            }));
        }
    };
    const getMinDate = (index, buttonType) => {
        if (index === 0) {
            return fromHistoricalDate; // Initial starting date for the first entry
        }
        if (buttonType === "High") {
            return editingHighGrowthRates[Index][index - 1].startDate; // Last added date for high entries
        } else if (buttonType === "Low") {
            return editingLowGrowthRates[Index][index - 1].startDate; // Last added date for low entries
        }
    };
    const handleSaveGrowthRate = () => {
        if (buttonType === "High") {
            setHighMethodForRow(prev => ({ ...prev, [Index]: "growthRate" }));
            setHighGrowthRates(editingHighGrowthRates);
            setHighInitialGrowthRate(editingHighInitialGrowthRate);
            setHighStartingValue(editingHighStartingValue);
        } else if (buttonType === "Low") {
            setLowMethodForRow(prev => ({ ...prev, [Index]: "growthRate" }));
            setLowGrowthRates(editingLowGrowthRates);
            setLowInitialGrowthRate(editingLowInitialGrowthRate);
            setLowStartingValue(editingLowStartingValue);

        }
        setOpenGrowthRateDialog(false);
    };
    const handleCancelGrowthRate = () => {
        if (buttonType === "High") {
            setEditingHighGrowthRates(highGrowthRates);
            setEditingHighInitialGrowthRate(highInitialGrowthRate);
            setEditingHighStartingValue(highStartingValue);
        } else if (buttonType === "Low") {
            setEditingLowGrowthRates(lowGrowthRates);
            setEditingLowInitialGrowthRate(lowInitialGrowthRate);
            setEditingLowStartingValue(lowStartingValue);
        }
        setOpenGrowthRateDialog(false);
        setOpenInputMethodDialog(true);
    }
    const handleSaveCopy = () => {
        if (buttonType === "High") {
            setHighMethodForRow(prev => ({ ...prev, [Index]: "copy" }));
            setHighSelectedCaseOption(editingHighSelectedCaseOption);
        } else if (buttonType === "Low") {
            setLowMethodForRow(prev => ({ ...prev, [Index]: "copy" }));
            setLowSelectedCaseOption(editingLowSelectedCaseOption);
        }
        setOpenCopyFromDialog(false);
    }
    const handleCancelCopy = () => {
        if (buttonType === "High") {
            setEditingHighSelectedCaseOption(highSelectedCaseOption);
        } else if (buttonType === "Low") {
            setEditingLowSelectedCaseOption(lowSelectedCaseOption);
        }
        setOpenCopyFromDialog(false);
        setOpenInputMethodDialog(true);
    }
    const handleSavePercent = () => {
        if (buttonType === "High") {
            setHighMethodForRow(prev => ({ ...prev, [Index]: "%" }));
            setHighPercentVal(editingHighPercentVal);
        } else if (buttonType === "Low") {
            setLowMethodForRow(prev => ({ ...prev, [Index]: "%" }));
            setLowPercentVal(editingLowPercentVal);
        }
        setOpenChangeDialog(false);
    }
    const handleCancelPercent = () => {
        if (buttonType === "High") {
            setEditingHighPercentVal(HighPercentVal);
        } else if (buttonType === "Low") {
            setEditingLowPercentVal(LowPercentVal);
        }
        setOpenChangeDialog(false);
        setOpenInputMethodDialog(true);
    }
    const handleSaveAbsolute = () => {
        if (buttonType === "High") {
            setHighMethodForRow(prev => ({ ...prev, [Index]: "Absolute" }));
            setHighAbsoluteVal(editingHighAbsoluteVal);
        } else if (buttonType === "Low") {
            setLowMethodForRow(prev => ({ ...prev, [Index]: "Absolute" }));
            setLowAbsoluteVal(editingLowAbsoluteVal);
        }
        setOpenAbsoluteVal(false);
    }
    const handleCancelAbsolute = () => {
        if (buttonType === "High") {
            setEditingHighAbsoluteVal(highAbsoluteVal);
        } else if (buttonType === "Low") {
            setEditingLowAbsoluteVal(lowAbsoluteVal);
        }
        setOpenAbsoluteVal(false);
        setOpenInputMethodDialog(true);
    }

    const startTour2 = () => {
        const end = introJs();
        end.setOptions({
            steps: [
                {
                    element: '.start-tour-button',
                    intro: 'You can click here to rewatch the tutorial.',
                    position: 'left'
                },
            ],
            showProgress: false, // Disable progress bar
            showStepNumbers: false,
            showBullets: false,
            nextLabel: '', // Remove "Next" button label
            prevLabel: '', // Remove "Previous" button label    
            showButtons: false, // Disable default Next/Prev buttons
        });

        end.onafterchange(() => {
            const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
            const tooltip = document.querySelector('.introjs-tooltip');
            const crossIcon = document.querySelector('.introjs-skipbutton')

            if (crossIcon) {
                Object.assign(crossIcon.style, {
                    color: "red",
                    padding: "2px",
                    marginBottom: '0px'
                })
            }
            // Remove any existing buttons in the tooltip
            if (tooltipContainer) {
                tooltipContainer.innerHTML = ''; // Clear all buttons
            }

            // Style the tooltip box
            if (tooltip) {
                Object.assign(tooltip.style, {
                    backgroundColor: '#f9f9f9',
                    color: '#333',
                    whiteSpace: 'nowrap',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: "5px",
                    maxWidth: '500px',
                    fontSize: '14px',
                    minWidth: '300px',
                    textAlign: 'center',
                });
                tooltip.style.display = 'flex';
                tooltip.style.flexDirection = 'column';
                tooltip.style.justifyContent = 'space-between';
            }
        });
        end.start();
    };

    // main tutorial
    const startTour = () => {
        const intro = introJs();
        intro.setOptions({
            steps: [
                {
                    element: '.dates',
                    intro: `To choose the months for which you want to run sensitivity analysis.`,
                    position: 'right',
                },
                {
                    element: '.case',
                    intro: `To choose the case.`,
                    position: 'right',
                },
                {
                    element: '.metric',
                    intro: `To choose the product for which you want to run sensitivity analysis.`,
                    position: 'right',
                },
                {
                    element: '.field',
                    intro: `To choose the product for which you want to change the values and see resultant effect on the output metric.`,
                    position: 'right',
                },
                {
                    element: '.high',
                    intro: `High case to increase the value of field. There are many options to update the data: upload file, change by %, and many more.`,
                    position: 'left',
                },
                {
                    element: '.low',
                    intro: `Low case to decrease the value of field. There are many options to update the data: upload file, change by %, and many more.`,
                    position: 'left',
                },
                {
                    element: '.plus',
                    intro: `Click here to add another field and its high and low case values. You will not be able to change output metric and case in the added row`,
                    position: 'left',
                },
                {
                    element: '.apply',
                    intro: `This button enables once you have selected the required values and input data in high and low case. Clicking on this will generate a graph and output table`,
                    position: 'right',
                },
            ],
            showProgress: false, // Disable progress bar
            showStepNumbers: false,
            showBullets: false,
            nextLabel: 'Next Step',
            prevLabel: 'Previous Step',
            doneLabel: 'Finished'
        });

        intro.onafterchange(() => {
            const tooltipContainer = document.querySelector('.introjs-tooltipbuttons');
            const nextButton = document.querySelector('.introjs-nextbutton');
            const prevButton = document.querySelector('.introjs-prevbutton');
            const tooltip = document.querySelector('.introjs-tooltip');
            const totalSteps = intro._options.steps.length; // Get total number of steps
            const currentStep = intro._currentStep; // Get current step index
            console.log(currentStep)
            console.log(totalSteps)

            // Remove default close button
            const crossIcon = document.querySelector('.introjs-skipbutton');
            if (crossIcon) {
                crossIcon.remove();
            }

            // Add a custom "Skip Tutorial" button
            let customSkipButton = document.querySelector('.custom-skip-button');
            if (!customSkipButton) {
                customSkipButton = document.createElement('button');
                customSkipButton.className = 'custom-skip-button';
                Object.assign(customSkipButton.style, {
                    backgroundColor: 'red',
                    fontSize: '12px',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    textShadow: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    height: '20px',
                    borderRadius: '5px',
                });

                customSkipButton.onclick = () => {
                    intro.exit(); // End the current tour
                    startTour2(); // Start the second tour
                };

                if (tooltipContainer && prevButton) {
                    tooltipContainer.insertBefore(customSkipButton, prevButton.nextSibling);
                }
            }

            // Update the custom "Skip Tutorial" button text dynamically
            if (currentStep === totalSteps - 1) {
                customSkipButton.textContent = 'Close'; // Change Skip button text to "Close"
            } else {
                customSkipButton.textContent = 'Skip Tutorial'; // Reset Skip button text
            }

            if (nextButton) {
                if (currentStep === totalSteps - 1) {
                    // Disable and style the Next button on the last step
                    nextButton.disabled = true;
                    Object.assign(nextButton.style, {
                        position: 'absolute',
                        bottom: '15px',
                        right: '10px',
                        backgroundColor: 'grey',
                        color: 'white',
                        cursor: 'not-allowed',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                    });
                } else {
                    // Enable and style the Next button for other steps
                    nextButton.disabled = false;
                    Object.assign(nextButton.style, {
                        position: 'absolute',
                        bottom: '15px',
                        right: '10px',
                        backgroundColor: 'green',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        boxShadow: 'none',
                    });
                }
            }

            // Style the Previous button
            if (prevButton) {
                if (currentStep === 0) {
                    prevButton.disabled = true;
                    Object.assign(prevButton.style, {
                        backgroundColor: 'grey',
                        fontSize: '12px',
                        color: 'white',
                        marginRight: '40px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                    });
                }
                else {
                    Object.assign(prevButton.style, {
                        backgroundColor: 'navy',
                        fontSize: '12px',
                        color: 'white',
                        marginRight: '40px',
                        fontWeight: 'bold',
                        textShadow: 'none',
                        borderRadius: '5px',
                        padding: '5px 10px',
                    })
                }
            }

            // Style the tooltip box
            if (tooltip) {
                Object.assign(tooltip.style, {
                    backgroundColor: '#f9f9f9',
                    color: '#333',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '5px',
                    maxWidth: '500px',
                    fontSize: '14px',
                    minWidth: '300px',
                    textAlign: 'center',
                });
            }
        });

        intro.start();
    };


    useEffect(() => {
        console.log("1", columns2);
        console.log("2", mainresult);
        console.log("3", lowresult);
        console.log("4", highresSum);
        console.log("5", lowresSum);
        console.log("6", highresult);

    }, [lowresSum]);


    const currentPercentVal = buttonType === 'High' ? editingHighPercentVal[Index] : editingLowPercentVal[Index];
    return (
        <>
            <Button
                variant="contained"
                size='small'
                sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: -6.5, mr: 2 }}
                onClick={startTour}
                className="start-tour-button"
            >
                Show Tutorial
            </Button>
            <Box display="flex" alignItems="center" gap="15px" ml={1} p={2} >
                <Button
                    className='apply'
                    variant="contained"
                    onClick={() => KPIAnalysis()}
                    disabled={dropdownGroups.length === 0 || dropdownGroups.some((row) => row.OutputMetric === "" || row.Field === "" || row.Case === "")}
                >
                    Apply
                </Button>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box className='dates' display="flex" alignItems="center" gap="15px" >
                        <DatePicker
                            views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                            label={timePeriod === 'Monthly' ? 'Start Month' : 'Start Year'}
                            value={fromDate}
                            onChange={(newValue) => setFromDate(newValue)}
                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: '200px' }}
                            minDate={fromHistoricalDate}
                            maxDate={toForecastDate}
                        />
                        <DatePicker
                            views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                            label={timePeriod === 'Monthly' ? 'End Month' : 'End Year'}
                            value={toDate}
                            onChange={(newValue) => setToDate(newValue)}
                            format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                            slotProps={{ textField: { size: 'small' } }}
                            sx={{ width: '200px' }}
                            minDate={fromDate}
                            maxDate={toForecastDate}
                        />
                    </Box>
                </LocalizationProvider>
            </Box >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: 3,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #ddd",
                            maxWidth: "120%",
                        }}
                    >
                        <Table size="small" aria-label="dropdown table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='case' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Case</TableCell>
                                    <TableCell className='metric' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Output Metric</TableCell>
                                    <TableCell className='field' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Field</TableCell>
                                    <TableCell className='high' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>High Case</TableCell>
                                    <TableCell className='low' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Low Case</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dropdownGroups.map((group, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 }, // Removes bottom border
                                        }}
                                    >
                                        {/* Case Dropdown */}
                                        <TableCell align="center">
                                            <FormControl >
                                                {/* <InputLabel id={`case-select-label-${index}`}>Case</InputLabel> */}
                                                <Select
                                                    labelId={`case-select-label-${index}`}
                                                    id={`case-select-${index}`}
                                                    value={group.Case}
                                                    placeholder="Select a Case"
                                                    disabled={index !== 0}
                                                    //label="Case"
                                                    onChange={(e) => handleDropdownChange(index, "Case", e.target.value)}
                                                    sx={{ fontSize: "0.9rem", minWidth: "10rem", width: "10rem", height: "2.5rem" }}
                                                >
                                                    <MenuItem value="downside">Downside</MenuItem>
                                                    <MenuItem value="base">Base</MenuItem>
                                                    <MenuItem value="upside">Upside</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>

                                        {/* Output Metric Dropdown */}
                                        <TableCell align="center">
                                            {(
                                                <FormControl >
                                                    {/* <InputLabel
                                                    id={`output-metric-select-label-${index}`}
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    Output Metric
                                                </InputLabel> */}
                                                    <Select
                                                        labelId={`output-metric-select-label-${index}`}
                                                        id={`output-metric-select-${index}`}
                                                        value={group.OutputMetric}
                                                        //label="Output Metric"
                                                        disabled={index !== 0}
                                                        onChange={(e) => handleDropdownChange(index, "OutputMetric", e.target.value)}
                                                        sx={{ fontSize: "0.9rem", minWidth: "10rem", width: "auto", height: "2.5rem" }}
                                                    >
                                                        {products[group.Case] &&
                                                            Object.entries(products[group.Case]).map(([tableKey, tableValue]) =>
                                                                Object.entries(tableValue).map(([id, value]) => (
                                                                    <MenuItem key={`${tableKey}-${id}`} value={value.id}>
                                                                        {value.name}
                                                                    </MenuItem>
                                                                ))
                                                            )}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </TableCell>

                                        {/* Field Dropdown */}
                                        <TableCell align="center">
                                            {(
                                                <FormControl >
                                                    {/* <InputLabel id={`field-select-label-${index}`}>Field</InputLabel> */}
                                                    <Select
                                                        labelId={`field-select-label-${index}`}
                                                        id={`field-select-${index}`}
                                                        value={group.Field}
                                                        //label="Field"
                                                        onChange={(e) => handleDropdownChange(index, "Field", e.target.value)}
                                                        sx={{ fontSize: "0.9rem", minWidth: "10rem", width: "auto", height: "2.5rem" }}
                                                    >
                                                        {products[group.Case] &&
                                                            Object.entries(products[group.Case]).map(([tableKey, tableValue]) =>
                                                                Object.entries(tableValue).map(([id, value]) => (
                                                                    <MenuItem key={`${tableKey}-${id}`} value={value.id}>
                                                                        {value.name}
                                                                    </MenuItem>
                                                                ))
                                                            )}
                                                    </Select>
                                                </FormControl>
                                            )}
                                        </TableCell>

                                        {/* High/Low Case Buttons, Add, and Delete */}
                                        <TableCell align="center">
                                            <Button
                                                variant={highMethodForRow[index] ? "contained" : "outlined"}
                                                color="success"
                                                onClick={() => {
                                                    setIndex(index);
                                                    setButtonType("High");
                                                    setOpenInputMethodDialog(true);
                                                }}
                                            >
                                                High Case <UploadIcon sx={{ ml: 1 }} />
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant={lowMethodForRow[index] ? "contained" : "outlined"}
                                                color="error"
                                                sx={{ marginLeft: index === dropdownGroups.length - 1 ? 5 : 0 }} // Added left margin
                                                onClick={() => {
                                                    setIndex(index);
                                                    setButtonType("Low");
                                                    setOpenInputMethodDialog(true);
                                                }}
                                            >
                                                Low Case
                                                <UploadIcon sx={{ ml: 1 }} />
                                            </Button>
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
                                            {
                                                index === dropdownGroups.length - 1 && (
                                                    <IconButton
                                                        title="Add new parameters"
                                                        aria-label="add"
                                                        sx={{ color: isLastRowFilled ? "blue" : "grey" }}
                                                        onClick={isLastRowFilled ? () => handleAddDropdownGroup(index) : null}
                                                        onMouseOver={(e) => {
                                                            if (isLastRowFilled) {
                                                                e.currentTarget.title = "Add new parameters";
                                                            } else {
                                                                e.currentTarget.title = "Fill in the table first";
                                                            }
                                                        }}
                                                    >
                                                        <AddIcon className='plus' />
                                                    </IconButton>
                                                )
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                {applyClicked && <Grid item xs={12}>
                    <div style={{ width: '80%', margin: 'auto', textAlign: 'center', marginTop: "150px" }}>
                        <h3 style={{ color: '#333', marginBottom: '20px' }}>{dropdownGroups[0].Case.charAt(0).toUpperCase() + dropdownGroups[0].Case.slice(1)} Case, {labelsOutputMetric[0]}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baseRev)}</h3>
                        <BarChart
                            width={900}
                            height={500}
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis
                                type="number"
                                tickFormatter={(value) => {
                                    if (value >= 1000000 || value <= -1000000) {
                                        return `${(value / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
                                    } else if (value >= 1000 || value <= -1000) {
                                        return `${(value / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
                                    } else {
                                        return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    }
                                }}
                                stroke="#555"
                                domain={[5, 'auto']} // Set minimum value to 5
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#555"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value) => {
                                    if (value >= 1000000 || value <= -1000000) {
                                        return `${(value / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
                                    } else if (value >= 1000 || value <= -1000) {
                                        return `${(value / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
                                    } else {
                                        return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                    }
                                }}
                                contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '10px' }}
                            />
                            <Legend
                                align="center"
                                verticalAlign="bottom"
                                wrapperStyle={{ marginTop: '20px' }}
                            />
                            <Bar
                                dataKey="lowCase"
                                fill="rgba(163, 17, 17, 0.8)"
                                name="Low Case"

                            >
                                <LabelList
                                    dataKey="lowCase"
                                    position="insideRight"
                                    formatter={(value) => {
                                        if (value >= 1000000 || value <= -1000000) {
                                            return `${(value / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
                                        } else if (value >= 1000 || value <= -1000) {
                                            return `${(value / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
                                        } else {
                                            return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                        }
                                    }} fill="#fff"
                                    fontSize={15}
                                />
                            </Bar>
                            <Bar
                                dataKey="highCase"
                                fill="rgb(31, 87, 31)"
                                name="High Case"

                            >
                                <LabelList
                                    dataKey="highCase"
                                    position="insideRight"
                                    formatter={(value) => {
                                        if (value >= 1000000 || value <= -1000000) {
                                            return `${(value / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
                                        } else if (value >= 1000 || value <= -1000) {
                                            return `${(value / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
                                        } else {
                                            return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                        }
                                    }} fill="#fff"
                                    fontSize={15}
                                />
                            </Bar>
                        </BarChart>
                    </div>
                </Grid>}
            </Grid>


            {applyClicked && (
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={10}>
                        <IconButton
                            color="primary"
                            onClick={() => {
                                const csvContent = [];
                                csvContent.push(['Output Metric', 'Scenario', 'Total', ...columns2]);
                                csvContent.push([labelsOutputMetric[0], 'Actual Values', baseRev, ...columns2.map(column => mainresult?.[0]?.[column])]);
                                dropdownGroups.forEach((group, index) => {
                                    csvContent.push([`${labelsOutputMetric[0]} Instance ${index + 1}`, `${labels?.[index]} High Case Values`, highresSum?.[index], ...columns2.map(column => highresult?.[index]?.[column])]);
                                    csvContent.push([`${labelsOutputMetric[0]} Instance ${index + 1}`, `${labels?.[index]} Low Case Values`, lowresSum?.[index], ...columns2.map(column => lowresult?.[index]?.[column])]);
                                });
                                const csvString = csvContent.map(row => row.join(',')).join('\n');
                                const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', 'table_data.csv');
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                setSnackbarOpen(true);
                                setSnackbarMessage("Downloaded as csv file");
                            }}
                            className="download-icon"
                        >
                            <GetAppIcon />
                        </IconButton>
                        <IconButton
                            color="primary"
                            onClick={() => {
                                const csvContent = [];
                                csvContent.push(['Output Metric', 'Scenario', 'Total', ...columns2]);
                                csvContent.push([labelsOutputMetric[0], 'Actual Values', baseRev, ...columns2.map(column => mainresult?.[0]?.[column])]);
                                dropdownGroups.forEach((group, index) => {
                                    csvContent.push([`${labelsOutputMetric[0]} Instance ${index + 1}`, `${labels?.[index]} High Case Values`, highresSum?.[index], ...columns2.map(column => highresult?.[index]?.[column])]);
                                    csvContent.push([`${labelsOutputMetric[0]} Instance ${index + 1}`, `${labels?.[index]} Low Case Values`, lowresSum?.[index], ...columns2.map(column => lowresult?.[index]?.[column])]);
                                });
                                const csvString = csvContent.map(row => row.join(',')).join('\n');
                                navigator.clipboard.writeText(csvString);
                                setSnackbarOpen(true);
                                setSnackbarMessage("Copied to clipboard");
                            }}
                            className="copy-icon"
                        >
                            <ContentCopyIcon />
                        </IconButton>
                        <Snackbar
                            open={snackbarOpen}
                            onClose={() => setSnackbarOpen(false)}
                            message={snackbarMessage}
                            autoHideDuration={1500}
                        />
                        <TableContainer
                            component={Paper}
                            sx={{ border: '1px solid #ccc', borderRadius: '10px', margin: '0 auto', marginTop: '10px' }}
                        >
                            <Table aria-label="customized-table">
                                <TableHead>
                                    <TableRow style={{ backgroundColor: 'rgb(198, 244, 214)' }}>
                                        <TableCell align="center" style={{ border: '1px solid #ccc', minWidth: '400px', fontWeight: 'bold' }}>
                                            Output Metric
                                        </TableCell>
                                        <TableCell align="center" style={{ border: '1px solid #ccc', minWidth: '400px', fontWeight: 'bold' }}>
                                            Scenario
                                        </TableCell>
                                        <TableCell align="center" style={{ border: '1px solid #ccc', minWidth: '100px', fontWeight: 'bold' }}>
                                            Total
                                        </TableCell>
                                        {columns2.map((column) => (
                                            <TableCell align="center" style={{ border: '1px solid #ccc', minWidth: '100px', fontWeight: 'bold' }} key={`header-${column}`}>
                                                {column}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* Static Row for Actual Values */}
                                    <TableRow style={{ backgroundColor: 'lightyellow' }}>
                                        <TableCell align="center" style={{ border: '1px solid #ccc', backgroundColor: 'lightyellow' }}>
                                            {labelsOutputMetric[0]}
                                        </TableCell>
                                        <TableCell align="center" style={{ border: '1px solid #ccc' }}>Actual Values</TableCell>
                                        <TableCell align="center" style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                                            {baseRev ? `${Number(baseRev / (baseRev >= 1e6 ? 1e6 : 1e3)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${baseRev >= 1e6 ? 'M' : 'k'}` : '0.00M'}
                                        </TableCell>
                                        {columns2.map((column) => (
                                            <TableCell align="center" style={{ border: '1px solid #ccc' }} key={`main-${column}`}>
                                                {mainresult?.[0]?.[column] ? `${Number(mainresult?.[0]?.[column] / (mainresult?.[0]?.[column] >= 1e6 ? 1e6 : 1e3)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${mainresult?.[0]?.[column] >= 1e6 ? 'M' : 'k'}` : '0.00M'}
                                            </TableCell>
                                        ))}
                                    </TableRow>

                                    {/* Dynamic Rows for Each Group */}
                                    {dropdownGroups.map((group, index) => {
                                        const groupColors = ['#f0f8ff', '#e6e6fa', '#ffe4e1', '#fafad2', '#d3f9d8'];
                                        const bgColor = groupColors[index % groupColors.length]; // Rotate colors using index
                                        return (
                                            <React.Fragment key={`group-${index}`}>
                                                {/* Spacer Row for Separation */}
                                                {index > 0 && <TableRow style={{ height: '30px' }} />}

                                                {/* High Case Row */}
                                                <TableRow sx={{ backgroundColor: bgColor }}>
                                                    <TableCell align="center" style={{ border: '1px solid #ccc', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {`${labelsOutputMetric[0]} Instance ${index + 1}`}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ border: '1px solid #ccc', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: '200px' }}>
                                                        {`${labels?.[index]} High Case Values`}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                                                        {highresSum?.[index] ? `${Number(highresSum?.[index] / (highresSum?.[index] >= 1e6 ? 1e6 : 1e3)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${highresSum?.[index] >= 1e6 ? 'M' : 'k'}` : '0.00M'}
                                                    </TableCell>
                                                    {columns2.map((column) => (
                                                        <TableCell align="center" style={{ border: '1px solid #ccc' }} key={`high-${index}-${column}`}>
                                                            {highresult?.[index]?.[column] ? `${Number(highresult?.[index]?.[column] / (highresult?.[index]?.[column] >= 1e6 ? 1e6 : 1e3)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${highresult?.[index]?.[column] >= 1e6 ? 'M' : 'k'}` : '0.00M'}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>

                                                {/* Low Case Row */}
                                                <TableRow sx={{ backgroundColor: bgColor }}>
                                                    <TableCell align="center" style={{ border: '1px solid #ccc', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                        {`${labelsOutputMetric[0]} Instance ${index + 1}`}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ border: '1px solid #ccc', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minWidth: '200px' }}>
                                                        {`${labels?.[index]} Low Case Values`}
                                                    </TableCell>
                                                    <TableCell align="center" style={{ border: '1px solid #ccc', fontWeight: 'bold' }}>
                                                        {lowresSum?.[index] ? `${Number(lowresSum?.[index] / (lowresSum?.[index] >= 1e6 ? 1e6 : 1e3)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${lowresSum?.[index] >= 1e6 ? 'M' : 'k'}` : '0.00M'}
                                                    </TableCell>
                                                    {columns2.map((column) => (
                                                        <TableCell align="center" style={{ border: '1px solid #ccc' }} key={`low-${index}-${column}`}>
                                                            {lowresult?.[index]?.[column] ? `${Number(lowresult?.[index]?.[column] / (lowresult?.[index]?.[column] >= 1e6 ? 1e6 : 1e3)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${lowresult?.[index]?.[column] >= 1e6 ? 'M' : 'k'}` : '0.00M'}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}


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
                            <ListItem
                                button
                                onClick={() => handleInputMethodSelect('copy')}
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
                                onClick={() => handleInputMethodSelect('%')}
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
                                onClick={() => handleInputMethodSelect('Absolute')}
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
            {
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Dialog open={openGrowthRateDialog} onClose={() => { setOpenGrowthRateDialog(false); }} maxWidth="sm" fullWidth>
                        <DialogTitle sx={{ paddingTop: '20px' }}>Set Initial Values and Growth Rate</DialogTitle>
                        <DialogContent sx={{ paddingTop: '15px' }}>
                            <Box display="flex" alignItems="center" gap="16px" mb={2} sx={{ paddingTop: '20px' }}>
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
                                    value={buttonType === 'High' ? editingHighStartingValue[Index] : editingLowStartingValue[Index]}
                                    onChange={(e) => buttonType === 'High' ? setEditingHighStartingValue(prev => ({
                                        ...prev,
                                        [Index]: e.target.value
                                    })) : setEditingLowStartingValue(prev => ({
                                        ...prev,
                                        [Index]: e.target.value
                                    }))}
                                    size="small"
                                    style={{ minWidth: '120px' }}
                                />
                                {/* Initial Growth Rate input field. User can edit value. */}
                                <TextField
                                    label="Initial Growth Rate (%)"
                                    type="number"
                                    value={buttonType === 'High' ? editingHighInitialGrowthRate[Index] : editingLowInitialGrowthRate[Index]}
                                    onChange={(e) => buttonType === 'High' ? setEditingHighInitialGrowthRate(prev => ({
                                        ...prev,
                                        [Index]: e.target.value
                                    })) : setEditingLowInitialGrowthRate(prev => ({
                                        ...prev,
                                        [Index]: e.target.value
                                    }))}
                                    size="small"
                                    style={{ minWidth: '120px' }}
                                />
                                {/* Add button to add a new growth rate entry. */}
                                <IconButton onClick={handleAddGrowthRate} color="primary">
                                    <AddIcon />
                                </IconButton>
                            </Box>
                            {/* Show all the growth rate entries. Each entry is a Box with a DatePicker, TextField, and Remove button. */}

                            {(buttonType === 'High' ? editingHighGrowthRates[Index] : editingLowGrowthRates[Index])?.map((rate, i) => (
                                <Box key={i} display="flex" alignItems="center" gap="16px" mb={2}>
                                    {/* Next Month/Year picker. User can select a date within the given period. */}
                                    <DatePicker
                                        views={timePeriod === 'Monthly' ? ['year', 'month'] : ['year']}
                                        label={timePeriod === 'Monthly' ? 'Next Month' : 'Next Year'}
                                        value={rate.startDate}
                                        onChange={(newValue) => handleGrowthRateChange(i, 'startDate', newValue)}
                                        format={timePeriod === 'Monthly' ? 'MMM-YYYY' : 'YYYY'}
                                        slotProps={{ textField: { size: 'small' } }}
                                        style={{ minWidth: '120px' }}
                                        minDate={getMinDate(i, buttonType)} //The user cannot select a Date that is before the Start Date
                                        maxDate={toForecastDate} //The user cannot select a Start Date that is after the End Date
                                    />
                                    {/* Growth Rate input field. User can edit value. */}
                                    <TextField
                                        // label="Growth Rate (%)"
                                        type="number"
                                        value={rate.growthRate}
                                        onChange={(e) => handleGrowthRateChange(i, 'growthRate', e.target.value)}
                                        size="small"
                                        style={{ minWidth: '120px' }}
                                    />
                                    <IconButton onClick={() => handleRemoveGrowthRate(i)} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => { handleCancelGrowthRate() }} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => { handleSaveGrowthRate() }} color="primary">
                                Save
                            </Button>
                            <Button onClick={() => { setOpenGrowthRateDialog(false); }} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </LocalizationProvider>
            }
            {
                <Dialog open={openCopyFromDialog} onClose={() => setOpenCopyFromDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Choose the Case to Copy From</DialogTitle>
                    <DialogContent sx={{ paddingTop: '15px' }}>
                        <Box display="flex" flexDirection="row" gap="16px" alignItems="center" marginTop="10px">
                            {/* Render buttons dynamically based on the current product case */}
                            {(() => {
                                const options = {
                                    base: ['downside', 'upside'],
                                    downside: ['base', 'upside'],
                                    upside: ['base', 'downside'],
                                };

                                return options[currentCase[Index]]?.map((caseOption) => (
                                    <Button
                                        key={caseOption}
                                        variant="outlined"
                                        onClick={() => buttonType === 'High' ? setEditingHighSelectedCaseOption(prev => ({
                                            ...prev,
                                            [Index]: caseOption
                                        })) : setEditingLowSelectedCaseOption(prev => ({
                                            ...prev,
                                            [Index]: caseOption
                                        }))}
                                        color="primary"
                                        sx={{
                                            backgroundColor: buttonType === 'High' ? editingHighSelectedCaseOption[Index] === caseOption ? '#1976d2' : '' : editingLowSelectedCaseOption[Index] === caseOption ? '#1976d2' : '', // Highlight selected option
                                            color: buttonType === 'High' ? editingHighSelectedCaseOption[Index] === caseOption ? 'white' : '' : editingLowSelectedCaseOption[Index] === caseOption ? 'white' : '', // Highlight selected option
                                        }}
                                    >
                                        Copy from {caseOption}
                                    </Button>
                                ));
                            })()}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCancelCopy()} color="secondary" >
                            Cancel
                        </Button>
                        <Button onClick={() => handleSaveCopy()} color="primary" >
                            Save
                        </Button>

                    </DialogActions>
                </Dialog>
            }
            {
                <Dialog open={openChangeDialog} onClose={() => setOpenChangeDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Percentage</DialogTitle>
                    <DialogContent sx={{ paddingTop: '15px' }}>
                        <Box display="flex" flexDirection="column" gap="2px" alignItems="left" marginTop="10px">
                            {/* Display the increase or decrease message */}
                            {currentPercentVal !== undefined && (
                                <Typography
                                    variant="body2"
                                    color={
                                        Number(currentPercentVal) > 0
                                            ? 'green' // If the value is positive, use green
                                            : Number(currentPercentVal) < 0
                                                ? 'red' // If the value is negative, use red
                                                : 'black' // Default color when there's no value
                                    }
                                    sx={{ marginBottom: '10px' }}
                                >
                                    {Number(currentPercentVal) > 0
                                        ? `Increase by ${currentPercentVal} %`
                                        : Number(currentPercentVal) < 0
                                            ? `Decrease by ${Math.abs(currentPercentVal)} %`
                                            : ''}
                                </Typography>
                            )}

                            {/* Input field for percentage */}
                            <TextField
                                type="number"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={currentPercentVal}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (buttonType === 'High') {
                                        setEditingHighPercentVal((prev) => ({
                                            ...prev,
                                            [Index]: val,
                                        }));
                                    } else {
                                        setEditingLowPercentVal((prev) => ({
                                            ...prev,
                                            [Index]: val,
                                        }));
                                    }
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>, // Add percentage symbol
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCancelPercent()} color="secondary" >
                            Cancel
                        </Button>
                        <Button onClick={() => handleSavePercent()} color="primary" >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            {
                <Dialog open={openAbsoluteVal} onClose={() => setOpenAbsoluteVal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Absolute Value</DialogTitle>
                    <DialogContent sx={{ paddingTop: '15px' }}>
                        <Box display="flex" flexDirection="row" gap="16px" alignItems="center" marginTop="10px">
                            <TextField
                                type="number"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={buttonType === 'High' ? editingHighAbsoluteVal[Index] : editingLowAbsoluteVal[Index]}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    buttonType === 'High'
                                        ? setEditingHighAbsoluteVal((prev) => ({
                                            ...prev,
                                            [Index]: val,
                                        }))
                                        : setEditingLowAbsoluteVal((prev) => ({
                                            ...prev,
                                            [Index]: val,
                                        }));
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleCancelAbsolute()} color="secondary" >
                            Cancel
                        </Button>
                        <Button onClick={() => handleSaveAbsolute()} color="primary" >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                position: 'fixed',
                bottom: 0,
                right: 10,
                padding: '10px',
                zIndex: 10,
                gap: '10px'
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    className="save-continue" // Apply the custom CSS class
                    onClick={() => {
                        if (window.confirm("Are you sure you want to save this view?")) {
                            alert("View is saved");
                        }
                    }}
                >
                    Save View
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className="save-continue" // Apply the custom CSS class
                    onClick={() => navigate('/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis/saved-views-kpi')} // Navigate to the patient forecast page

                >
                    Show Saved Views
                </Button>
            </Box>
        </>
    );
};
export default KPI;