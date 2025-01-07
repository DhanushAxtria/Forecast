import React, { useState, useContext } from "react";
import { MyContext } from "./context";
import FormControl from "@mui/material/FormControl";
import { MenuItem, InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from 'dayjs';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import {
    IconButton,
    Box,
    Button,
} from '@mui/material';


/**
 * Generates an array of strings representing the months from the given start date to the given end date, inclusive.
 * The strings are formatted as 'MMM-YYYY', e.g. 'Jan-2022'.
 * @param {string} start - The start date in 'YYYY-MM-DD' format.
 * @param {string} end - The end date in 'YYYY-MM-DD' format.
 * @returns {string[]} - An array of strings representing the months from start to end, inclusive.
 */
const generateMonthlyColumns = (start, end) => {
    const months = [];
    let current = dayjs(start);
    while (current.isBefore(end) || current.isSame(end, 'month')) {
        months.push(current.format('MMM-YYYY'));
        current = current.add(1, 'month');
    }
    return months;
};

/**
 * Generates an array of strings representing the years from the given start date to the given end date, inclusive.
 * The strings are formatted as 'YYYY', e.g. '2022'.
 * @param {string} start - The start date in 'YYYY-MM-DD' format.
 * @param {string} end - The end date in 'YYYY-MM-DD' format.
 * @returns {string[]} - An array of strings representing the years from start to end, inclusive.
 */
const generateYearlyColumns = (start, end) => {
    const years = [];
    let current = dayjs(start).startOf('year');
    while (current.isBefore(end) || current.isSame(end, 'year')) {
        years.push(current.format('YYYY'));
        current = current.add(1, 'year');
    }
    return years;
};

// chart toggle button component
const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    "& .MuiSwitch-track": {
        borderRadius: 22 / 2,
        "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
        },
        "&::before": {
            // Dark green with a bar icon
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><rect fill="${encodeURIComponent(
                "#006400", // Dark green hex color
            )}" x="8" y="6" width="8" height="12"/></svg>')`,
            left: 12,
        },
        "&::after": {
            // Blue with a line icon
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><line fill="none" stroke="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" x1="5" y1="12" x2="19" y2="12" stroke-width="2"/></svg>')`,
            right: 12,
        },
        backgroundColor: "#006400", // Dark green background color
    },
    "& .MuiSwitch-thumb": {
        boxShadow: "none",
        width: 16,
        height: 16,
        margin: 2,
    },
}));




const Dashboard = () => {
    const { products } = useContext(MyContext);
    const { values, values2, values3, setDropdownGroups, dropdownGroups } = useContext(MyContext); // values, values2, values3 are table values.
    const { cardTitle1, cardTitle2, cardTitle3 } = useContext(MyContext);
    const {  timePeriod } = useContext(MyContext);
    const { fromHistoricalDate, setFromHistoricalDate } = useContext(MyContext);
    const { fromForecastDate, setFromForecastDate } = useContext(MyContext);
    const { toForecastDate, setToForecastDate } = useContext(MyContext);
    // Generate columns based on timePeriod
    const months = timePeriod === 'Monthly' ? generateMonthlyColumns(fromHistoricalDate, toForecastDate) : generateYearlyColumns(fromHistoricalDate, toForecastDate);
    // Colors for the charts
    const colors = ["#A8E6CF", "#FFBCB3", "#E1C6E8", "#B3D9F7", "#FF9A8B", "#F6F4A7"];
    // Map item.id to item.name
    const idToNameMap = {};
    Object.entries(products).forEach(([caseKey, cards]) => {
        Object.values(cards).forEach((card) => {
            card.forEach((item) => {
                idToNameMap[item.id] = item.name;
            });
        });
    });

    // Format data for the Line Chart
    const chartData = months.map((month) => {
        const dataPoint = { month };
        dropdownGroups.forEach(({ Case, SelectedRow }) => {
            if (SelectedRow) {
                const key = `${Case}-${idToNameMap[SelectedRow]}`;
                dataPoint[key] =
                    Case === "downside"
                        ? Number(values[SelectedRow]?.[month] ?? null)
                        : Case === "base"
                            ? Number(values2[SelectedRow]?.[month] ?? null)
                            : Number(values3[SelectedRow]?.[month] ?? null);
            }
        });
        return dataPoint;
    });



    const handleAddDropdownGroup = () => {
        const lastGroup = dropdownGroups[dropdownGroups.length - 1];
        setDropdownGroups([
            ...dropdownGroups,
            {
                Case: lastGroup?.Case || "",
                SelectedCard: lastGroup?.SelectedCard || "",
                SelectedRow: lastGroup?.SelectedRow || "",
            },
        ]);
    };

    const handleDeleteDropdownGroup = (index) => {
        const updatedGroups = dropdownGroups.filter((_, i) => i !== index);
        setDropdownGroups(updatedGroups);
    };

    const handleDropdownChange = (index, field, value) => {
        const updatedGroups = [...dropdownGroups];
        updatedGroups[index][field] = value;
        setDropdownGroups(updatedGroups);
    };

    const isLastRowFilled =
        dropdownGroups.length > 0 &&
        dropdownGroups[dropdownGroups.length - 1].Case &&
        dropdownGroups[dropdownGroups.length - 1].SelectedCard &&
        dropdownGroups[dropdownGroups.length - 1].SelectedRow;

    // State for chart type
    const [chartType, setChartType] = useState("line");

    // Toggle chart type
    const toggleChartType = () => {
        setChartType((prevType) => (prevType === "line" ? "bar" : "line"));
    };


    return (
        <>

            {dropdownGroups.map((group, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    {/* Case Dropdown */}
                    <FormControl sx={{ m: 1, width: "15ch", fontSize: "0.8rem" }}>
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

                    {/* Card Dropdown */}
                    <FormControl sx={{ m: 1, width: "15ch" }}>
                        <InputLabel id={`card-select-label-${index}`}>Card Name</InputLabel>
                        <Select
                            labelId={`card-select-label-${index}`}
                            id={`card-select-${index}`}
                            value={group.SelectedCard}
                            label="Card Name"
                            onChange={(e) => handleDropdownChange(index, "SelectedCard", e.target.value)}
                            sx={{ fontSize: "0.9rem" }}
                        >
                            <MenuItem value="table1">{cardTitle1}</MenuItem>
                            <MenuItem value="table2">{cardTitle2}</MenuItem>
                            <MenuItem value="table3">{cardTitle3}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Parameter Dropdown */}
                    <FormControl sx={{ m: 1, width: "15ch" }}>
                        <InputLabel id={`parameter-select-label-${index}`}>Parameter Name</InputLabel>
                        <Select
                            labelId={`parameter-select-label-${index}`}
                            id={`parameter-select-${index}`}
                            value={group.SelectedRow}
                            label="Parameter Name"
                            onChange={(e) => handleDropdownChange(index, "SelectedRow", e.target.value)}
                            sx={{ fontSize: "0.9rem" }}
                        >
                            {products[group.Case]?.[group.SelectedCard]?.map((item) => (
                                <MenuItem key={item.name} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Add and Delete Buttons */}
                    {index === dropdownGroups.length - 1 && dropdownGroups.length < 6 && (
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
            ))}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 2,
                    marginRight: '50px'
                }}
            >
                <Box sx={{ mr: 2 }}>Toggle Chart Type</Box>
                <Android12Switch checked={chartType === "bar"} onChange={toggleChartType} />
            </Box>
            <ResponsiveContainer width={1300}
                height={400}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                {/* 
                    if chartType is line, display line chart
                    else display bar chart
                */}
                {chartType === "line" ? (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                        {/* 
                            loop through the dropdownGroups and create a line for each group
                        */}
                        {dropdownGroups.map(({ Case, SelectedRow }, index) => {
                            const lineKey = `${Case}-${idToNameMap[SelectedRow]}`;
                            return (
                                <Line
                                    key={index}
                                    type="monotone"
                                    dataKey={lineKey} // Combines Case and item.name
                                    name={lineKey}   // Displays Case-item.name in legend
                                    stroke={colors[index]}
                                    strokeWidth={3}
                                />
                            );
                        })}
                    </LineChart>
                ) : (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                        {/* 
                            loop through the dropdownGroups and create a bar for each group
                        */}
                        {dropdownGroups.map(({ Case, SelectedRow }, index) => {
                            const barKey = `${Case}-${idToNameMap[SelectedRow]}`;
                            return (
                                <Bar
                                    key={index}
                                    dataKey={barKey}
                                    name={barKey} // Display Case-item.name in legend
                                    stackId="a"
                                    fill={colors[index]}
                                />
                            );
                        })}
                    </BarChart>
                )}
            </ResponsiveContainer>
        </>
    );
};
export default Dashboard;