import React, { useState, useEffect, useContext } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import produce from "immer";
import Select from '@mui/material/Select';
import GetAppIcon from '@mui/icons-material/GetApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
import { hi } from 'date-fns/locale';
import { Today } from '@mui/icons-material';
const KPI = () => {
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
    const [editingHighPercentVal, setEditingHighPercentVal] = useState({});
    const [editingLowPercentVal, setEditingLowPercentVal] = useState({});
    const [HighPercentVal, setHighPercentVal] = useState({});
    const [LowPercentVal, setLowPercentVal] = useState({});
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

    console.log("labelsOutputMetric", labelsOutputMetric)

    const chartData = labels.map((label, index) => ({
        name: `${label} `,
        lowCase: lowCaseData[index],
        highCase: highCaseData[index],
    }));
    // Chart Options
    const options = {
        indexAxis: 'y', // Horizontal bar
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: true,
                },
                ticks: {
                    callback: (value) => `$${value}`,
                },
            },
            y: {
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `$${tooltipItem.raw}`,
                },
            },
        },
    };
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
            Object.keys(temp).forEach((key) => {
                const tmp = buttontype === 'High' ? parseFloat(HighPercentVal[index]) / 100 : parseFloat(LowPercentVal[index]) / 100;
                buttontype === 'High' ? res[key] = ((1 + tmp) * temp[key]).toFixed(2) : res[key] = ((1 - tmp) * temp[key]).toFixed(2);
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
    const handleApplyFormula = (selectedIds, tabKey, operators, row_id, method, buttontype, index) => {

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
        let idd = null;
        let val = null;
        if (row_id === selectedIds[0]) {
            idd = selectedIds[0];
            val = findVal(method, buttontype, index);
            console.log("val", val);
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
                console.log("tempval", tempval);
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
        const dates = timePeriod === 'Monthly' ? generateMonthlyColumns(fromDate, toDate) : generateYearlyColumns(fromDate, toDate);
        // Use local arrays to manage the data
        const newLowCaseData = [];
        const newHighCaseData = [];
        const highResDict = {};
        const lowResDict = {};
        const mainResDict = {};
        const highResSum = {};
        const lowResSum = {};

        dropdownGroups.forEach((row, index) => {
            const formulaCase = Formulas[row.Case];
            let formula = null;
            let operators = null;

            if (formulaCase) {
                Object.keys(formulaCase).forEach((key) => {
                    if (formulaCase[key][row.OutputMetric]) {
                        formula = formulaCase[key][row.OutputMetric].emptyArray;
                        operators = formulaCase[key][row.OutputMetric].plusArray;
                        operators = operators.slice(1);
                    }
                });
            }

            const row_id = row.Field;
            const highmethod = highMethodForRow[index];
            const lowmethod = lowMethodForRow[index];
            const temphighres = handleApplyFormula(formula, row.Case, operators, row_id, highmethod, "High", index);
            const Highres = {};
            dates.forEach((date) => {
                if (temphighres[date]) {
                    Highres[date] = temphighres[date];
                }
            });
            highResDict[index] = Highres;

            const templowres = handleApplyFormula(formula, row.Case, operators, row_id, lowmethod, "Low", index);
            const Lowres = {}
            dates.forEach((date) => {
                if (templowres[date]) {
                    Lowres[date] = templowres[date];
                }
            });
            lowResDict[index] = Lowres;

            const temppreval = row.Case === 'downside' ? values[row.OutputMetric] : row.Case === 'base' ? values2[row.OutputMetric] : values3[row.OutputMetric];
            const presentval = {}
            dates.forEach((date) => {
                if (temppreval[date]) {
                    presentval[date] = temppreval[date];
                }
            });
            mainResDict[index] = presentval;

            const presentSum = Object.keys(presentval).reduce((prev, curr) => prev + parseFloat(presentval[curr], 10), 0).toFixed(2);
            const HighresSum = Object.keys(Highres).reduce((prev, curr) => prev + parseFloat(Highres[curr], 10), 0).toFixed(2);
            highResSum[index] = HighresSum;

            const LowresSum = Object.keys(Lowres).reduce((prev, curr) => prev + parseFloat(Lowres[curr], 10), 0).toFixed(2);
            lowResSum[index] = LowresSum;

            const highdiff = HighresSum - presentSum;
            const lowdiff = LowresSum - presentSum;
            newLowCaseData.push(lowdiff !== undefined ? lowdiff : 0);
            newHighCaseData.push(highdiff !== undefined ? highdiff : 0);
            setBaseRev(presentSum);

        });
        setLowCaseData(newLowCaseData);
        setHighCaseData(newHighCaseData);
        setHighResult(highResDict);
        setLowResult(lowResDict);
        setMainResult(mainResDict)
        setHighResSum(highResSum);
        setLowResSum(lowResSum);
        setApplyClicked(true);
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
    const [tutorialActive, setTutorialActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
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
            left = rect.right;
        } else if (step.placement === 'left') {
            top = rect.top;
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
        closeButton.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Skip Tutorial';
        //closeButton.textContent = currentStep === (selectedAction === '' ? steps : selectedAction === 'savedTemplates' ? steps3 : steps2).length - 1 ? 'Finish' : 'Skip Tutorial';
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
        nextButton.disabled = currentStep === steps.length - 1; // Disable if last step
        // nextButton.disabled = currentStep === (selectedAction === '' ? steps : selectedAction === 'savedTemplates' ? steps3 : steps2).length - 1; // Disable if last step
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
        if (tutorialActive && currentStep < steps.length) {
            showTutorial(steps[currentStep]);
        }
    }, [tutorialActive, currentStep]);
    const steps = [
        {
            index: 0,
            target: '.dates',
            content: `To choose out the months for which the effect you want to see.`,
            placement: 'right',
        },
        {
            index: 1,
            target: '.case',
            content: `To choose out the Case.`,
            placement: 'right',
        },
        {
            index: 2,
            target: '.metric',
            content: `To choose out the product for which you want to see the sensitivity.`,
            placement: 'right',
        },
        {
            index: 3,
            target: '.field',
            content: `To choose out the product for which you want to change the values to see the change in outputmatric.`,
            placement: 'right',
        },
        {
            index: 4,
            target: '.high',
            content: `High case to increase the value of field. There are many options to update the data: upload file, change by %, and many more.`,
            placement: 'left',
        },
        {
            index: 5,
            target: '.low',
            content: `Low case to decrease the value of field. There are many options to update the data: upload file, change by %, and many more.`,
            placement: 'left',
        },
    ];


    return (
        <>
            <Typography
                className='tutorial-btn'
                variant="body2"
                sx={{ color: 'black', position: 'absolute', right: 0, cursor: 'pointer', mt: -6, mr: 6 }}
                onClick={() => handleStartTutorial()}
            >
                Show Tutorial
            </Typography>
            <Box display="flex" alignItems="center" gap="15px" ml={1} p={2} >
                <Button
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
                                                        <AddIcon />
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
                        <h3 style={{ color: '#333', marginBottom: '20px' }}>{dropdownGroups[0].Case.charAt(0).toUpperCase() + dropdownGroups[0].Case.slice(1)} Case, {labelsOutputMetric[0]}: ${baseRev}</h3>
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
                                tickFormatter={(value) => `$${value.toFixed(2)}`}
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
                                formatter={(value) => `$${value.toFixed(2)}`}
                                contentStyle={{ backgroundColor: '#f5f5f5', borderRadius: '10px' }}
                            />
                            <Legend
                                align="center"
                                verticalAlign="bottom"
                                wrapperStyle={{ marginTop: '20px' }}
                            />
                            <Bar
                                dataKey="lowCase"
                                fill="rgba(192, 77, 77, 0.8)"
                                name="Low Case"

                            >
                                <LabelList
                                    dataKey="lowCase"
                                    position="insideRight"
                                    formatter={(value) => `${value.toFixed(2)}`}
                                    fill="#fff"
                                    fontSize={15}
                                />
                            </Bar>
                            <Bar
                                dataKey="highCase"
                                fill="rgba(75, 160, 79, 0.8)"
                                name="High Case"

                            >
                                <LabelList
                                    dataKey="highCase"
                                    position="insideRight"
                                    formatter={(value) => `${value.toFixed(2)}`}
                                    fill="#fff"
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
                                            {baseRev ? `${Number(baseRev).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0.00M'}
                                        </TableCell>
                                        {columns2.map((column) => (
                                            <TableCell align="center" style={{ border: '1px solid #ccc' }} key={`main-${column}`}>
                                                {mainresult?.[0]?.[column] ? `${Number(mainresult?.[0]?.[column]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0.00M'}
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
                                                        {highresSum?.[index] ? `${Number(highresSum?.[index]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0.00M'}
                                                    </TableCell>
                                                    {columns2.map((column) => (
                                                        <TableCell align="center" style={{ border: '1px solid #ccc' }} key={`high-${index}-${column}`}>
                                                            {highresult?.[index]?.[column] ? `${Number(highresult?.[index]?.[column]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0.00M'}
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
                                                        {lowresSum?.[index] ? `${Number(lowresSum?.[index]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0.00M'}
                                                    </TableCell>
                                                    {columns2.map((column) => (
                                                        <TableCell align="center" style={{ border: '1px solid #ccc' }} key={`low-${index}-${column}`}>
                                                            {lowresult?.[index]?.[column] ? `${Number(lowresult?.[index]?.[column]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0.00M'}
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
                        <Box display="flex" flexDirection="row" gap="16px" alignItems="center" marginTop="10px">
                            <TextField
                                type="number"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={buttonType === 'High' ? editingHighPercentVal[Index] : editingLowPercentVal[Index]}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    buttonType === 'High'
                                        ? setEditingHighPercentVal((prev) => ({
                                            ...prev,
                                            [Index]: val,
                                        }))
                                        : setEditingLowPercentVal((prev) => ({
                                            ...prev,
                                            [Index]: val,
                                        }));
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
        </>
    );
};
export default KPI;