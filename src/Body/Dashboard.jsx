import React, { useState, useContext, useEffect } from "react";
import introJs from 'intro.js';
import { MyContext } from "./context";
import FormControl from "@mui/material/FormControl";
import { MenuItem, InputLabel, Typography } from "@mui/material";
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
    const { timePeriod } = useContext(MyContext);
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

    const [chartType, setChartType] = useState("line");
    const toggleChartType = () => {
        setChartType((prevType) => (prevType === "line" ? "bar" : "line"));
    };
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
                    element: '.filter-case',
                    intro: 'To choose the case.',
                    position: 'right',
                },
                {
                    element: '.filter-card',
                    intro: 'To choose the card.',
                    position: 'right',
                },
                {
                    element: '.filter-product',
                    intro: 'To choose the product.',
                    position: 'right',
                },
                {
                    element: '.plus',
                    intro: 'By clicking this you can add a new row of dropdowns and this can be done for upto 6 rows of dropdowns',
                    position: 'right',
                },
                {
                    element: '.toggle',
                    intro: 'Toggle the chart type between line and bar.',
                    position: 'left',
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
                variant="contained"
                size='small'
                sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: -9.5, mr: 2 }}
                onClick={startTour} className="start-tour-button"
            >
                Show Tutorial
            </Button>

            {dropdownGroups.map((group, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: -5,
                        ml: 7,
                        mt: 5,
                    }}
                >
                    {/* Case Dropdown */}
                    <FormControl className='filter-case' sx={{ ml: 1 }}>
                        <InputLabel id={`case-select-label-${index}`}>Case</InputLabel>
                        <Select
                            labelId={`case-select-label-${index}`}
                            id={`case-select-${index}`}
                            value={group.Case}
                            label="Case"
                            onChange={(e) => handleDropdownChange(index, "Case", e.target.value)}
                            sx={{ fontSize: "0.9rem", minWidth: "10rem", width: "10rem", height: "3rem" }}
                        >
                            <MenuItem value="downside">Downside</MenuItem>
                            <MenuItem value="base">Base</MenuItem>
                            <MenuItem value="upside">Upside</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Card Dropdown */}
                    <FormControl className='filter-card' sx={{ m: 1 }}>
                        <InputLabel id={`card-select-label-${index}`}>Card Name</InputLabel>
                        <Select
                            labelId={`card-select-label-${index}`}
                            id={`card-select-${index}`}
                            value={group.SelectedCard}
                            label="Card Name"
                            onChange={(e) => handleDropdownChange(index, "SelectedCard", e.target.value)}
                            sx={{ fontSize: "0.9rem", minWidth: "10rem", width: "auto", height: "3rem" }}
                        >
                            <MenuItem value="table1">{cardTitle1}</MenuItem>
                            <MenuItem value="table2">{cardTitle2}</MenuItem>
                            <MenuItem value="table3">{cardTitle3}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Parameter Dropdown */}
                    <FormControl className='filter-product' sx={{ mr: 1 }}>
                        <InputLabel id={`parameter-select-label-${index}`}>Parameter Name</InputLabel>
                        <Select
                            labelId={`parameter-select-label-${index}`}
                            id={`parameter-select-${index}`}
                            value={group.SelectedRow}
                            label="Parameter Name"
                            onChange={(e) => handleDropdownChange(index, "SelectedRow", e.target.value)}
                            sx={{ fontSize: "0.9rem", minWidth: "10rem", width: "auto", height: "3rem" }}
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
                            <AddIcon className="plus" />
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
                <Android12Switch className='toggle' checked={chartType === "bar"} onChange={toggleChartType} />
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