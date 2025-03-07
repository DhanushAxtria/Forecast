import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { ButtonGroup, Button, TextField } from '@mui/material';
import { MyContext } from "./context";
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const SavedViewsDashboard = () => {
  const generateMonthlyColumns = (start, end) => {
    const months = [];
    let current = dayjs(start);
    while (current.isBefore(end) || current.isSame(end, 'month')) {
      months.push(current.format('MMM-YYYY'));
      current = current.add(1, 'month');
    }
    return months;
  };
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

  const generateYearlyColumns = (start, end) => {
    const years = [];
    let current = dayjs(start).startOf('year');
    while (current.isBefore(end) || current.isSame(end, 'year')) {
      years.push(current.format('YYYY'));
      current = current.add(1, 'year');
    }
    return years;
  };
  const toggleChartType = () => {
    setChartType((prevType) => (prevType === "line" ? "bar" : "line"));
  };

  const { timePeriod, fromHistoricalDate, toForecastDate, products, values, values2, values3, cardTitle1, cardTitle2, cardTitle3 } = useContext(MyContext);

  const idToNameMap = {};
  Object.entries(products).forEach(([caseKey, cards]) => {
    Object.values(cards).forEach((card) => {
      card.forEach((item) => {
        idToNameMap[item.id] = item.name;
      });
    });
  });

  const [names] = useState(["View - Revenue", "View - Market Share"]);
  const months = timePeriod === 'Monthly' ? generateMonthlyColumns(fromHistoricalDate, toForecastDate) : generateYearlyColumns(fromHistoricalDate, toForecastDate);

  const [groups, setGroups] = useState([
    { Case: "base", SelectedCard: "table3", SelectedRow: "T3-10" },
    { Case: "base", SelectedCard: "table3", SelectedRow: "T3-11" },
    { Case: "base", SelectedCard: "table3", SelectedRow: "T3-12" },
  ]);

  const [groups2, setGroups2] = useState([
    { Case: "downside", SelectedCard: "table2", SelectedRow: "T2-5" },
    { Case: "downside", SelectedCard: "table2", SelectedRow: "T2-6" },
    { Case: "downside", SelectedCard: "table2", SelectedRow: "T2-7" }
  ]);

  const [Name, setName] = useState(names[0]);
  const [chartType, setChartType] = useState("line");
  const colors = ["#A8E6CF", "#FFBCB3", "#E1C6E8", "#B3D9F7", "#FF9A8B", "#F6F4A7"];
  const selectedGroups = Name === 'View - Revenue' ? groups : groups2;

  const chartData = months.map((month) => {
    const dataPoint = { month };
    selectedGroups.forEach(({ Case, SelectedRow }) => {
      if (SelectedRow && idToNameMap[SelectedRow]) {
        const key = `${Case}-${idToNameMap[SelectedRow]}`;
        dataPoint[key] =
          Case === "downside"
            ? Number(values[SelectedRow]?.[month] ?? 0)
            : Case === "base"
              ? Number(values2[SelectedRow]?.[month] ?? 0)
              : Number(values3[SelectedRow]?.[month] ?? 0);
      }
    });
    return dataPoint;
  });
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ButtonGroup variant="contained" color="primary">
          {names.map((name, index) => (
            <Button
              key={index}
              onClick={() => setName(name)}
              variant={name === Name ? "contained" : "outlined"}
            >
              {name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      {selectedGroups.map((group, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: -5, ml: 7, mt: 5 }}>
          <TextField className='filter-case' sx={{ ml: 1 }} label="Case" value={group.Case} variant="outlined" size="small" />
          <TextField className='filter-card' sx={{ m: 1 }} label="Card Name" value={group.SelectedCard === 'table3' ? cardTitle3 : group.SelectedCard === 'table2' ? cardTitle2 : cardTitle1} variant="outlined" size="small" />
          <TextField className='filter-product' sx={{ mr: 1 }} label="Parameter Name" value={idToNameMap[group.SelectedRow]} variant="outlined" size="small" />
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
      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={chartData} margin={{ left: 50, right: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedGroups.map(({ Case, SelectedRow }, index) => (
                idToNameMap[SelectedRow] && (
                  <Line key={index} type="monotone" dataKey={`${Case}-${idToNameMap[SelectedRow]}`} stroke={colors[index]} strokeWidth={3} />
                )
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ left: 50, right: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedGroups.map(({ Case, SelectedRow }, index) => (
                idToNameMap[SelectedRow] && (
                  <Bar key={index} dataKey={`${Case}-${idToNameMap[SelectedRow]}`} stackId="a" fill={colors[index]} />
                )
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </>
  );
}

export default SavedViewsDashboard;






