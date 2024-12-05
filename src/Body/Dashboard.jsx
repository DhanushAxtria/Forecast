import React, { useState, useContext } from "react";
import { MyContext } from "./context";
import FormControl from "@mui/material/FormControl";
import { MenuItem, InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
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
import dayjs from 'dayjs';
import {
    IconButton,
    Box,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";

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

const Dashboard = () => {
    const { products } = useContext(MyContext);
    const { values, values2, values3, setDropdownGroups, dropdownGroups } = useContext(MyContext);
    const { cardTitle1, cardTitle2, cardTitle3 } = useContext(MyContext);
    const { fromDate, toDate, timePeriod } = useContext(MyContext);

    const months = timePeriod === 'Monthly' ? generateMonthlyColumns(fromDate, toDate) : generateYearlyColumns(fromDate, toDate);

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
        setDropdownGroups([...dropdownGroups, { Case: "", SelectedCard: "", SelectedRow: "" }]);
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

                    {group.Case && (
                        <FormControl sx={{ m: 1, width: "15ch" }}>
                            <InputLabel id={`card-select-label-${index}`}>Card Name</InputLabel>
                            <Select
                                labelId={`card-select-label-${index}`}
                                id={`card-select-${index}`}
                                value={group.SelectedCard}
                                label="Card Name"
                                onChange={(e) =>
                                    handleDropdownChange(index, "SelectedCard", e.target.value)
                                }
                                sx={{ fontSize: "0.9rem" }}
                            >
                                <MenuItem value="table1">{cardTitle1}</MenuItem>
                                <MenuItem value="table2">{cardTitle2}</MenuItem>
                                <MenuItem value="table3">{cardTitle3}</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {group.SelectedCard && (
                        <FormControl sx={{ m: 1, width: "15ch" }}>
                            <InputLabel id={`parameter-select-label-${index}`}>
                                Parameter Name
                            </InputLabel>
                            <Select
                                labelId={`parameter-select-label-${index}`}
                                id={`parameter-select-${index}`}
                                value={group.SelectedRow}
                                label="Parameter Name"
                                onChange={(e) =>
                                    handleDropdownChange(index, "SelectedRow", e.target.value)
                                }
                                sx={{ fontSize: "0.9rem" }}
                            >
                                {products[group.Case]?.[group.SelectedCard]?.map((item) => (
                                    <MenuItem key={item.name} value={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {index === dropdownGroups.length - 1 && isLastRowFilled && (
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

            <Box sx={{ display: "flex", marginRight:'50px', justifyContent: "flex-end", mb: 2 }}>
                <Button variant="contained" color="primary" onClick={toggleChartType}>
                    Toggle Chart Type
                </Button>
            </Box>
            <ResponsiveContainer width={1300}
                height={400}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                {chartType === "line" ? (
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {dropdownGroups.map(({ Case, SelectedRow }, index) => {
                            const lineKey = `${Case}-${idToNameMap[SelectedRow]}`;
                            return (
                                <Line
                                    key={index}
                                    type="monotone"
                                    dataKey={lineKey} // Combines Case and item.name
                                    name={lineKey}   // Displays Case-item.name in legend
                                    stroke={`hsl(${(index * 50) % 360}, 70%, 50%)`}
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
                        <Legend />
                        {dropdownGroups.map(({ Case, SelectedRow }, index) => {
                            const barKey = `${Case}-${idToNameMap[SelectedRow]}`;
                            return (
                                <Bar
                                    key={index}
                                    dataKey={barKey}
                                    name={barKey} // Display Case-item.name in legend
                                    stackId="a"
                                    fill={`hsl(${(index * 50) % 360}, 70%, 50%)`}
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
