import React, { useState, useEffect, useContext } from 'react';
import introJs from 'intro.js';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
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
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
    ResponsiveContainer,
    LabelList,
} from 'recharts';

const WaterFall = () => {
    const navigate = useNavigate();
    const [applyClicked, setApplyClicked] = useState(true);
    const { products, timePeriod, Formulas, fromHistoricalDate, toForecastDate, fromForecastDate, values, values2, values3 } = useContext(MyContext);
    const [Res, setRes] = useState({});
    const [Index, setIndex] = useState("");

    const [buttonType, setButtonType] = useState("");
    const [editingFileToFill, setEditingFileToFill] = useState({});
    const [FileToFill, setFileToFill] = useState({});
    const [MethodForRow, setMethodForRow] = useState({
        "0": "%",
        "1": "%",
        "2": "%",
    });
    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);
    const [openStartEndDialog, setOpenStartEndDialog] = useState(false);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [editingStartValue, setEditingStartValue] = useState({}); // Start value for  Case
    const [editingEndValue, setEditingEndValue] = useState({}); // End value for  Case
    const [StartValue, setStartValue] = useState({}); // Saved  Case Start Values
    const [EndValue, setEndValue] = useState({}); // Saved  Case End Values
    const [dropdownGroups, setDropdownGroups] = useState([
        { Case: "base", OutputMetric: "T3-12", Field: "T3-9" },
        { Case: "base", OutputMetric: "T3-12", Field: "T1-2" },
        { Case: "base", OutputMetric: "T3-12", Field: "T1-3" },

    ]);
    const [openGrowthRateDialog, setOpenGrowthRateDialog] = useState(false);
    const [GrowthRates, setGrowthRates] = useState({});
    const [StartingValue, setStartingValue] = useState({});
    const [InitialGrowthRate, setInitialGrowthRate] = useState({});
    const [editingGrowthRates, setEditingGrowthRates] = useState({});
    const [editingStartingValue, setEditingStartingValue] = useState({});
    const [editingInitialGrowthRate, setEditingInitialGrowthRate] = useState({});
    const [openCopyFromDialog, setOpenCopyFromDialog] = useState(false);
    const [SelectedCaseOption, setSelectedCaseOption] = useState({});
    const [editingSelectedCaseOption, setEditingSelectedCaseOption] = useState({});
    const [currentCase, setCurrentCase] = useState({});
    const [CaseData, setCaseData] = useState([]);
    const [openChangeDialog, setOpenChangeDialog] = useState(false);
    const [editingPercentVal, setEditingPercentVal] = useState({
        "0": 50,
        "1": -90,
        "2": 40,
    });
    const [PercentVal, setPercentVal] = useState({
        "0": 50,
        "1": -90,
        "2": 40,
    });
    const [AbsoluteVal, setAbsoluteVal] = useState({});
    const [editingAbsoluteVal, setEditingAbsoluteVal] = useState({});
    const [openAbsoluteVal, setOpenAbsoluteVal] = useState(false);
    const [result, setResult] = useState({})
    const [changedValue, setChangedValue] = useState({})
    const [changeInValue, setChangeInValue] = useState({})
    const [mainresult, setMainResult] = useState({})
    const [columns, setColumns] = useState([]) // Initialize with an empty array of columns
    const [fromDate, setFromDate] = useState(dayjs(fromHistoricalDate));
    const [toDate, setToDate] = useState(dayjs(toForecastDate));
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
    const scenarioValue = dropdownGroups.map((group, index) => (
        console.log("changeInValue?.[index]", changeInValue?.[index]),
        Number(mainresult?.[0] || 0) + (changeInValue?.[index] || 0)
    ))
    const handleScenarioValue = (dropdownGroups, mainresult, changeInValue) => {
        let scenarioValue = Number(mainresult?.[0] || 0); // Initialize with the base value

        dropdownGroups.forEach((group, index) => {
            console.log("changeInValue?.[index]", changeInValue?.[index]);
            scenarioValue += parseFloat((changeInValue?.[index] || 0).toFixed(2)); // Add the change in value for the current index
            console.log("scenarioValue", scenarioValue);
        });

        return scenarioValue; // Return the final value after the loop
    };


    // Sample data
    const rawData = [
        { name: "Base Case", value: parseFloat(Number(mainresult?.[0]).toFixed(2)) || 0 },
        ...dropdownGroups.map((group, index) => ({
            name: `${labels?.[index] || `Group ${index + 1}`}`,
            value: parseFloat((changeInValue?.[index] || 0).toFixed(2)),
        }
        )),

        {
            name: "Scenario Case",
            value: handleScenarioValue(dropdownGroups, mainresult, changeInValue) || 0
        }

    ];


    // Process data for waterfall chart
    const processWaterfallData = (data) => {
        let cumulative = 0;
        return data.map((item, index) => {
            const prevCumulative = cumulative;
            cumulative += item.value;
            return {
                ...item,
                cumulative,
                start: index === 0 || index === rawData.length - 1 ? 0 : prevCumulative,
                color: index === 0 || index === rawData.length - 1 ? 'green' : 'blue',
            };
        });
    };
    const data = processWaterfallData(rawData);
    useEffect(() => {
        console.log("cahrt", data);
    }, [data]);
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
                    callback: (value) => `$${value}M`,
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
                    label: (tooltipItem) => `$${tooltipItem.raw}M`,
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
            setEditingStartValue,
            setEditingEndValue,
            setStartValue,
            setEndValue,
            setFileToFill,
            setEditingFileToFill,
            setMethodForRow,
            setEditingGrowthRates,
            setEditingStartingValue,
            setEditingInitialGrowthRate,
            setGrowthRates,
            setInitialGrowthRate,
            setStartingValue,
            setCurrentCase,
            setEditingSelectedCaseOption,
            setSelectedCaseOption,
            setEditingPercentVal,
            setPercentVal,
            setAbsoluteVal,
            setEditingAbsoluteVal,
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
        setMethodForRow(prev => ({ ...prev, [Index]: "StartEnd" }));
        setStartValue(editingStartValue);
        setEndValue(editingEndValue);
        setOpenStartEndDialog(false);
    };
    const handleCancelStartAndEnd = () => {
        setEditingStartValue(StartValue);
        setEditingEndValue(EndValue);
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
        setMethodForRow(prev => ({ ...prev, [Index]: "file" }));
        setFileToFill(editingFileToFill);
        setOpenUploadDialog(false);
        console.log(FileToFill);

    }
    const handleCancelUpload = () => {
        setEditingFileToFill(FileToFill);
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
            const start = parseFloat(StartValue[index]);
            const end = parseFloat(EndValue[index]);
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
            const file = FileToFill[index];
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
            const startingVal = StartingValue[index];
            const initialGrowth = InitialGrowthRate[index];
            const growthRates = GrowthRates[index];
            const temp = calculateGrowthRateValues(startingVal, initialGrowth, growthRates);
            return temp;
        }
        else if (method === 'copy') {
            const tempCase = SelectedCaseOption[index];
            const currentField = dropdownGroups[index]?.Field;
            const valuesMap = {
                upside: values3,
                downside: values,
                base: values2,
            };
            const valuesToUse = valuesMap[tempCase];
            console.log("vales to use", valuesToUse);
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
                const tmp = parseFloat(PercentVal[index]) / 100;
                res[key] = ((1 + tmp) * temp[key]).toFixed(2);
            });
            console.log("res", res);
            return res;
        }
        else if (method === 'Absolute') {
            const tmp = AbsoluteVal[index];
            Object.keys(res).forEach((key) => {
                res[key] = tmp;
            });
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
        // Use local arrays to manage the data
        const newCaseData = [];
        const ResDict = {};
        const OriginalSum = {};
        const ChangedValue = {};
        const Change = {};
        dropdownGroups.forEach((row, index) => {
            let valuess = { ... (row.Case === 'downside' ? values : row.Case === 'base' ? values2 : values3) };
            const temppreval = row.Case === 'downside' ? values[row.OutputMetric] : row.Case === 'base' ? values2[row.OutputMetric] : values3[row.OutputMetric];
            const presentval = {};
            dates.forEach((date) => {
                if (temppreval[date]) {
                    presentval[date] = parseFloat(temppreval[date]).toFixed(2) || temppreval[date];
                }
            });
            const presentSum = Object.keys(presentval).reduce((prev, curr) => prev + parseFloat(presentval[curr] || 0, 10), 0).toFixed(2);
            OriginalSum[index] = presentSum;
            let highres = findVal(MethodForRow[index], "", index);
            valuess = { ...valuess, [row.Field]: highres };
            let tabKey = row.Case;
            let resHigh = {};
            // update the rows
            for (const tableKey of Object.keys(Formulas[tabKey])) {
                for (const row_id of Object.keys(Formulas[tabKey][tableKey])) {
                    if (Formulas[tabKey][tableKey][row_id].emptyArray[0] !== '' && row_id !== row.Field) {
                        resHigh = handlesavechanges(tabKey, tableKey, row_id, valuess);
                        const prod = products[tabKey][tableKey];
                        const productType = prod.find((product) => product.id === row_id)?.type;
                        valuess = {
                            ...valuess,
                            [row_id]: Object.keys(resHigh).reduce((acc, date) => {
                                acc[date] = !resHigh[date] || resHigh[date] === 0 ? '0' : productType === '%' ? resHigh[date] * 100 : resHigh[date];
                                return acc;
                            }, {})
                        };
                    }
                }
            }
            const Highres = {};
            dates.forEach((date) => {
                if (valuess[row.OutputMetric][date]) {
                    Highres[date] = valuess[row.OutputMetric][date];
                }
            });
            ResDict[index] = Highres;
            const HighresSum = Object.keys(valuess[row.OutputMetric]).filter(date => dates.includes(date)).reduce((prev, curr) => prev + parseFloat(valuess[row.OutputMetric][curr], 10), 0).toFixed(2);
            changedValue[index] = HighresSum;
            const diff = HighresSum - presentSum;
            Change[index] = diff;
            newCaseData.push(diff !== undefined ? diff : 0);
            setCaseData(newCaseData);
            setResult(ResDict);
            setMainResult(OriginalSum)
            setChangedValue(ChangedValue);
            setChangeInValue(Change);
            setApplyClicked(true);
        });
    };

    const handleAddGrowthRate = () => {
        setEditingGrowthRates((prev) => ({
            ...prev,
            [Index]: [
                ...(prev[Index] || []), // Initialize as an empty array if undefined
                { startDate: dayjs(), growthRate: 0 },
            ],
        }));
    };
    const handleRemoveGrowthRate = (index) => {

        setEditingGrowthRates((prev) => ({
            ...prev,
            [Index]: prev[Index].filter((_, i) => i !== index)
        }));

    }
    const handleGrowthRateChange = (index, field, value) => {

        setEditingGrowthRates((prev) => ({
            ...prev,
            [Index]: prev[Index].map((item, i) =>
                i === index ? { ...item, [field]: field === 'startDate' ? dayjs(value) : value } : item
            ),
        }));

    };
    const getMinDate = (index, buttonType) => {
        if (index === 0) {
            return fromHistoricalDate; // Initial starting date for the first entry
        }

        return editingGrowthRates[Index][index - 1].startDate; // Last added date for  entries

    };
    const handleSaveGrowthRate = () => {

        setMethodForRow(prev => ({ ...prev, [Index]: "growthRate" }));
        setGrowthRates(editingGrowthRates);
        setInitialGrowthRate(editingInitialGrowthRate);
        setStartingValue(editingStartingValue);

        setOpenGrowthRateDialog(false);
    };
    const handleCancelGrowthRate = () => {

        setEditingGrowthRates(GrowthRates);
        setEditingInitialGrowthRate(InitialGrowthRate);
        setEditingStartingValue(StartingValue);

        setOpenGrowthRateDialog(false);
        setOpenInputMethodDialog(true);
    }
    const handleSaveCopy = () => {

        setMethodForRow(prev => ({ ...prev, [Index]: "copy" }));
        setSelectedCaseOption(editingSelectedCaseOption);

        setOpenCopyFromDialog(false);
    }
    const handleCancelCopy = () => {

        setEditingSelectedCaseOption(SelectedCaseOption);

        setOpenCopyFromDialog(false);
        setOpenInputMethodDialog(true);
    }
    const handleSavePercent = () => {
        setMethodForRow(prev => ({ ...prev, [Index]: "%" }));
        setPercentVal(editingPercentVal);
        setOpenChangeDialog(false);
    }
    const handleCancelPercent = () => {

        setEditingPercentVal(PercentVal);

        setOpenChangeDialog(false);
        setOpenInputMethodDialog(true);
    }
    const handleSaveAbsolute = () => {

        setMethodForRow(prev => ({ ...prev, [Index]: "Absolute" }));
        setAbsoluteVal(editingAbsoluteVal);

        setOpenAbsoluteVal(false);
    }
    const handleCancelAbsolute = () => {

        setEditingAbsoluteVal(AbsoluteVal);

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
                    element: '.choose-case',
                    intro: `To choose the case.`,
                    position: 'right',
                },
                {
                    element: '.choose-metric',
                    intro: `To choose the product for which you want to run sensitivity analysis.`,
                    position: 'right',
                },
                {
                    element: '.choose-field',
                    intro: `To choose the product for which you want to change the values and see resultant effect on the output metric.`,
                    position: 'right',
                },
                {
                    element: '.scenario-case',
                    intro: `This is used to change(increase/ decrease) the value of field. There are many options to update the data: upload file, change by %, and many more.`,
                    position: 'left',
                },
                {
                    element: '.plus-button',
                    intro: `Click here to add another field and its scenario case values. You will not be able to change output metric and case in the added row`,
                    position: 'left',
                },
                {
                    element: '.apply-button',
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


    return (
        <>

            <Button
                className="start-tour-button"
                variant="contained"
                size='small'
                sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: -6.5, mr: 2 }}
                onClick={startTour}

            >
                Show Tutorial
            </Button>
            <Box display="flex" alignItems="center" gap="15px" ml={1} p={2} >
                <Button
                    className="apply-button"
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
                                    <TableCell className='choose-case' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Case</TableCell>
                                    <TableCell className='choose-metric' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Output Metric</TableCell>
                                    <TableCell className='choose-field' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Field</TableCell>
                                    <TableCell className='scenario-case' align="center" sx={{ fontWeight: "bold", bgcolor: "primary.light", color: "white" }}>Scenario Case</TableCell>

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
                                            <FormControl >
                                                <Select
                                                    labelId={`ouput-metric-select-label-${index}`}
                                                    id={`ouput-metric-select-${index}`}
                                                    value={group.OutputMetric}
                                                    placeholder="Select an Output Metric"
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
                                        </TableCell>

                                        {/* Field Dropdown */}
                                        <TableCell align="center">
                                            <FormControl >
                                                {/* <InputLabel id={`field-select-label-${index}`}>Field</InputLabel> */}
                                                <Select
                                                    labelId={`field-select-label-${index}`}
                                                    id={`field-select-${index}`}
                                                    placeholder="Select a Field"
                                                    value={group.Field}

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

                                        </TableCell>

                                        {/* High/ Case Buttons, Add, and Delete */}

                                        <TableCell align="center">
                                            <Button
                                                variant={MethodForRow[index] ? "contained" : "outlined"}
                                                color="error"
                                                sx={{ marginLeft: index === dropdownGroups.length - 1 ? 5 : 0 }} // Added left margin
                                                onClick={() => {
                                                    setIndex(index);
                                                    setButtonType("");
                                                    setOpenInputMethodDialog(true);
                                                }}
                                            >
                                                Scenario Case
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
                                                        <AddIcon className="plus-button" />
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

                <Grid item xs={12}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={data}
                            margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis
                                tickFormatter={(tick) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tick)}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}
                            />
                            <Bar
                                dataKey="start"
                                stackId="a"
                                fill="transparent" // Invisible bar to create waterfall effect
                            />
                            <Bar
                                dataKey="value"
                                stackId="a"
                                fill="#0074d9"
                            >
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    style={{ fontSize: 14, fill: "#000", fontWeight: "bold" }}
                                    formatter={(value) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Grid>

            </Grid>

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
                                value={editingStartValue[Index] || ''}
                                onChange={(e) => {

                                    setEditingStartValue(prev => ({ ...prev, [Index]: e.target.value }));

                                }}
                                size="small"
                                fullWidth
                            />
                            <TextField
                                label="End Value"
                                type="number"
                                value={editingEndValue[Index] || ''}
                                onChange={(e) => {

                                    setEditingEndValue(prev => ({ ...prev, [Index]: e.target.value }));

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
                                        onChange={(e) => { setEditingFileToFill(prev => ({ ...prev, [Index]: e.target.files[0] })) }}
                                    />
                                </Button>
                                <Typography
                                    align="center"
                                    sx={{ color: 'green' }}
                                >
                                    {/* The text to display when a file has been uploaded successfully */}
                                    {editingFileToFill[Index] !== undefined ? "file uploaded successfully" : ""}
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
            {
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
                                    value={editingStartingValue[Index]}
                                    onChange={(e) => setEditingStartingValue(prev => ({
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
                                    value={editingInitialGrowthRate[Index]}
                                    onChange={(e) => setEditingInitialGrowthRate(prev => ({
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

                            {(editingGrowthRates[Index])?.map((rate, i) => (
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
                                        minDate={getMinDate(i)} //The user cannot select a Date that is before the Start Date
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
                                        onClick={() => setEditingSelectedCaseOption(prev => ({
                                            ...prev,
                                            [Index]: caseOption
                                        }))}
                                        color="primary"
                                        sx={{
                                            backgroundColor: editingSelectedCaseOption[Index] === caseOption ? '#1976d2' : '', // Highlight selected option
                                            color: editingSelectedCaseOption[Index] === caseOption ? 'white' : '', // Highlight selected option
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
                            {editingPercentVal[Index] !== undefined && (
                                <Typography
                                    variant="body2"
                                    color={
                                        Number(editingPercentVal[Index]) > 0
                                            ? 'green' // If the value is positive, use green
                                            : Number(editingPercentVal[Index]) < 0
                                                ? 'red' // If the value is negative, use red
                                                : 'black' // Default color when there's no value
                                    }
                                    sx={{ marginBottom: '10px' }}
                                >
                                    {Number(editingPercentVal[Index]) > 0
                                        ? `Increase by ${editingPercentVal[Index]} %`
                                        : Number(editingPercentVal[Index]) < 0
                                            ? `Decrease by ${Math.abs(editingPercentVal[Index])} %`
                                            : ''}
                                </Typography>
                            )}

                            {/* Input field for percentage */}
                            <TextField
                                type="number"
                                variant="outlined"
                                margin="dense"
                                fullWidth
                                value={editingPercentVal[Index]}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingPercentVal((prev) => ({
                                        ...prev,
                                        [Index]: val,
                                    }));
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                                value={editingAbsoluteVal[Index]}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEditingAbsoluteVal((prev) => ({
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
                    onClick={() => navigate('/new-model/epidemiology-model/scenario-details/forecastdeepdive/analysis/saved-views-waterfall')} // Navigate to the patient forecast page

                >
                    Show Saved Views
                </Button>
            </Box>
        </>
    );
};
export default WaterFall;







