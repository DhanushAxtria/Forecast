import React, { useContext, useState } from 'react';
import { MyContext } from '../Body/context';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShowChart } from '@mui/icons-material';

export default function Forecasted_Results() {
  const { ForecastedValue } = useContext(MyContext);
  const { ParsedData } = useContext(MyContext);
  const { selectedSheet } = useContext(MyContext);
  const { isCol, setIsCol } = useContext(MyContext);
  const { met, setMet } = useContext(MyContext);
  const [ShowPara, setShowPara] = useState(false);

  // State to control the visibility of the tables
  const [showParsedData, setShowParsedData] = useState(false);
  const [showForecastedValue, setShowForecastedValue] = useState(false);

  // Mapping ForecastedValue data
  const Forecasted = ForecastedValue?.months.map((month, index) => ({
    month,
    forecasted: ForecastedValue[0][index],  // Ensure you use 'forecasted' as key
  }));

  // Mapping ParsedData (historical) data
  const historical = ParsedData?.months.map((month, index) => ({
    month,
    historical: ParsedData[0][index],  // Ensure you use 'historical' as key
  }));

  // Combine forecasted and historical data
  const combinedData = [
    ...historical.map((historicalData) => ({
      month: historicalData.month,
      forecasted: null, // No forecast for historical data
      historical: historicalData.historical,
    })),
    ...Forecasted.map((forecastData) => ({
      month: forecastData.month,
      forecasted: forecastData.forecasted,
      historical: null, // No historical data for forecasted months
    })),
  ];

  // Function to render the table for the given data
  const renderTable = (data, title) => {
    const { months, ...forecastData } = data;
    const forecastRows = Object.values(forecastData);

    return (
      <Box sx={{ marginBottom: 4 }}>

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}
        >
          {title}
        </Typography>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 3, borderRadius: 2, padding: 2, overflowX: 'auto' }}
        >
          <Table sx={{ minWidth: 650 }} aria-label={`${title} table`}>
            <TableHead>
              <TableRow>
                {months.map((month, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRight: index < months.length - 1 ? '1px solid #ddd' : 'none',
                      padding: 2,
                    }}
                  >
                    {month}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {forecastRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} sx={{ backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  {row.map((value, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align="center"
                      sx={{
                        padding: 2,
                        borderRight: colIndex < row.length - 1 ? '1px solid #ddd' : 'none',
                        borderBottom: '1px solid #ddd',
                        fontSize: '1rem',
                      }}
                    >
                      {value !== null ? value.toFixed(2) : '-'}  {/* Display '-' for missing values */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Function to export the table as CSV
  const exportToCSV = (data1, data2, isCol) => {
    let csvContent;
    const months = data1.months.concat(data2.months);
    const forecastRows = data1[0].concat(data2[0]);
    if (isCol) {
      csvContent = months.map((month, index) => `${month},${forecastRows[index]}`).join('\n');
    }
    else {
      csvContent = [months.join(','), forecastRows.join(',')].join('\n');
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedSheet}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Box sx={{ padding: 3 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {selectedSheet}
          </Typography>
        </Box>

        {/* Buttons to toggle visibility of tables */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowParsedData(!showParsedData)}
            sx={{ marginRight: 2 }}
          >
            {showParsedData ? 'Hide Historical Table' : 'Show Historical Table'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowForecastedValue(!showForecastedValue)}
          >
            {showForecastedValue ? 'Hide Forecasted Table' : 'Show Forecasted Table'}
          </Button>
        </Box>

        {/* Button to export the table as CSV */}


        {/* Conditionally render tables based on state */}
        {showParsedData && ParsedData && renderTable(ParsedData, 'Historical Data')}
        {showForecastedValue && ForecastedValue && renderTable(ForecastedValue, 'Forecasted Data')}
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() =>
          exportToCSV(ParsedData, ForecastedValue, isCol)
        }
        sx={{ marginLeft: 3, marginBottom: 2 }}
      >
        download the data
      </Button>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
          Evaluation Metrics
        </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, marginTop: 2, marginBottom: 2, height: '50%' }}>
        
        {Object.entries(met).map(([key, value]) => (
          <Box
            key={key}
            sx={{
              padding: 0.5,
              border: '1px solid',
              borderColor: 'primary.dark',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: 'background.paper',
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
              width: 'fit-content',
            }}
          >
            <Typography variant="h10" sx={{ color: 'primary.main' }}>
              <span style={{fontWeight: 'normal'}}>{key}:</span> <span style={{fontWeight: 'bold'}}>{value.toFixed(4)}</span>
            </Typography>
          </Box>
        ))}
      </Box>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="5 5" stroke="#ddd" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#333' }}
            axisLine={{ stroke: '#333', strokeWidth: 2 }}
            tickLine={{ stroke: '#333', strokeWidth: 1 }}
          />
          <YAxis
            tick={{ fontSize: 14, fontWeight: 'bold', fill: '#333' }}
            axisLine={{ stroke: '#333', strokeWidth: 2 }}
            tickLine={{ stroke: '#333', strokeWidth: 1 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '5px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              padding: '10px',
            }}
            labelStyle={{ fontSize: '14px', fontWeight: 'bold' }}
            itemStyle={{ fontSize: '14px', fontWeight: 'bold' }}
          />
          <Legend
            wrapperStyle={{
              fontSize: '16px',
              fontWeight: 'bold',
              paddingBottom: '10px',
            }}
          />
          <Line
            type="monotone"
            dataKey="forecasted"
            stroke="#8884d8"
            strokeWidth={3}
            name="Forecasted"
            dot={{ stroke: '#8884d8', strokeWidth: 4, fill: '#fff' }}
            activeDot={{ stroke: '#fff', strokeWidth: 6, fill: '#8884d8' }}
          />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#82ca9d"
            strokeWidth={3}
            name="Historical"
            dot={{ stroke: '#82ca9d', strokeWidth: 4, fill: '#fff' }}
            activeDot={{ stroke: '#fff', strokeWidth: 6, fill: '#82ca9d' }}
          />
        </LineChart>
      </ResponsiveContainer>

    </>
  );
}