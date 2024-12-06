import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../Body/context';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Slider, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';


const SeekBar = ({ title, minval, maxval, steps, value, setValue }) => {
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleMinusClick = () => {
    setValue((prev) => Math.max(prev - steps, minval)); // Minimum value is 1
  };
  const handlePlusClick = () => {
    setValue((prev) => Math.min(prev + steps, maxval)); // Maximum value is 10
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1} // Smaller gap
      sx={{
        width: "80%",
        maxWidth: "300px", // Smaller width
        margin: "auto",
        mt: 2, 
        p: 1.5,
        mb: 2,
        bgcolor: "lightblue", // Light blue background
        borderRadius: 1.5, // Rounded corners
        boxShadow: 1, // Slight shadow for aesthetics
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" gap={1.5}> {/* Smaller gap */}
        <Box>
          <Button
            variant="outlined"
            onClick={handleMinusClick}
            sx={{ minWidth: "32px", height: "32px" }} // Slightly smaller button
          >
            -
          </Button>
        </Box>

        <Slider
          value={value}
          min={minval}
          max={maxval}
          step={steps}
          onChange={handleSliderChange}
          sx={{ width: "180px" }} // Narrower slider
        />
        <Box>
          <Button
            variant="outlined"
            onClick={handlePlusClick}
            sx={{ minWidth: "32px", height: "32px" }} // Slightly smaller button
          >
            +
          </Button>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography variant="caption">Min: {minval}</Typography> {/* Smaller text */}
        <Typography variant="caption">Value: {value.toLocaleString()}</Typography>
        <Typography variant="caption">Max: {maxval}</Typography>
      </Box>
    </Box>
  );
};
const RidgeLasso = ({allocation, setAllocation}) => {
  const handleAllocationChange = (event, newAllocation) => {
    if (newAllocation !== null) setAllocation(newAllocation);
  };
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Model Type
      </Typography>
      <ToggleButtonGroup
        value={allocation}
        exclusive
        onChange={handleAllocationChange}
        sx={{ mb: 3 }}
      >
        <ToggleButton
          value="Normal"
          sx={{
            bgcolor: allocation === "Normal" ? "primary.main" : "grey.200",
            color: allocation === "Normal" ? "white" : "black",
            "&:hover": {
              bgcolor: allocation === "Normal" ? "primary.main" : "grey.200",
            },
          }}
        >
          Normal
        </ToggleButton>
        <ToggleButton
          value="Ridge"
          sx={{
            bgcolor: allocation === "Ridge" ? "primary.main" : "grey.200",
            color: allocation === "Ridge" ? "white" : "black",
            "&:hover": {
              bgcolor: allocation === "Ridge" ? "primary.main" : "grey.200",
            },
          }}
        >
          Ridge
        </ToggleButton>
        <ToggleButton
          value="Lasso"
          sx={{
            bgcolor: allocation === "Lasso" ? "primary.main" : "grey.200",
            color: allocation === "Lasso" ? "white" : "black",
            "&:hover": {
              bgcolor: allocation === "Lasso" ? "primary.main" : "grey.200",
            },
          }}
        >
          Lasso
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>

  );
};


export default function Forecasted_Results() {
  const navigate = useNavigate();
  const [modelType, setModelType] = useState("Normal");
  const { selectedSheet } = useContext(MyContext);
  const { isCol } = useContext(MyContext);
  const { met, setMet } = useContext(MyContext);
  const { historyFromDate } = useContext(MyContext);
  const { historyToDate } = useContext(MyContext);
  const { selectedFromDate } = useContext(MyContext);
  const { selectedToDate } = useContext(MyContext);
  const { selectedFile } = useContext(MyContext);
  const [Loading, setLoading] = useState(false);
  const { ForecastedValue, setForecastValue } = useContext(MyContext);
  const { ParsedData, setParsedData } = useContext(MyContext);
  const [showParsedData, setShowParsedData] = useState(false);
  const [showForecastedValue, setShowForecastedValue] = useState(false);
  const [notallowed, setNotAllowed] = useState(false);
  const [combinedData, setCombinedData] = useState(null);
  const [lassoAlpha, setlassoAlpha] = useState(0.1);
  const [ridgeAlpha, setridgeAlpha] = useState(0.1);
  const [maxiter, setmaxiter] = useState(500);

  useEffect(() => {
    if (ForecastedValue && ParsedData) {
      console.log("Updated ForecastedValue:", ForecastedValue);
      console.log("Updated ParsedData:", ParsedData);
    }
  }, [ForecastedValue, ParsedData]);
  
  const handleshowresults = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('selectedSheet', selectedSheet);
    formData.append('historyFromDate', historyFromDate);
    formData.append('historyToDate', historyToDate);
    formData.append('selectedFromDate', selectedFromDate);
    formData.append('selectedToDate', selectedToDate);
    formData.append('modelType', modelType);
    formData.append('lassoAlpha', lassoAlpha);
    formData.append('ridgeAlpha', ridgeAlpha);
    formData.append('maxiter', maxiter);
    setLoading(true);

    try {
      const response = await axios.post('https://fast-api-forecast.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);

      // Use the API response directly to avoid stale state issues
      const forecastedData = response.data.forecast?.months.map((month, index) => ({
        month,
        forecasted: response.data.forecast[0][index],
      })) || [];

      const historicalData = response.data.dt?.months.map((month, index) => ({
        month,
        historical: response.data.dt[0][index],
      })) || [];

      const combined = [
        ...historicalData.map((historicalData) => ({
          month: historicalData.month,
          forecasted: null,
          historical: historicalData.historical,
        })),
        ...forecastedData.map((forecastData) => ({
          month: forecastData.month,
          forecasted: forecastData.forecasted,
          historical: null,
        })),
      ];

      // Optionally store in state
      setForecastValue(response.data.forecast);
      setParsedData(response.data.dt);
      setCombinedData(combined); // If you want to use it elsewhere
      setMet(response.data.metrices);
      console.log("Combined Data:", combined);
    } catch (error) {
      setLoading(false);
      alert("Please upload the correct data");
      navigate("/admin");
      console.error('Error uploading file:', error);
    }
    setNotAllowed(true);
  };


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
      {Loading &&
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', marginTop: 2 }}>
              Please wait while the model is working on your data.
            </Typography>
          </Box>
        </Box>
      }
      {
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              alignSelf: 'flex-start',
              mb: 2,
              marginLeft: '15px'
            }}
          >
            {selectedSheet}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, backgroundColor: 'white', borderRadius: 1.5, marginLeft: '15px', marginRight: '15px' }}>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleshowresults}
                sx={{ fontWeight: 'bold', ml: 2 }}
              >
                Show Results
              </Button>
            </Box>

            {selectedSheet === 'Linear Regression' && <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#d4ebeb',
                borderRadius: 2,
                p: 2,
                width: '100%',
                boxShadow: 2,
              }}
            >
              <RidgeLasso allocation = {modelType} setAllocation = {setModelType} />
              <SeekBar title="Select Ridge Alpha" minval={0.1} maxval={1} steps={0.1} value={ridgeAlpha} setValue={setridgeAlpha} />
              <SeekBar title="Select Lasso Alpha" minval={0.1} maxval={1} steps={0.1} value={lassoAlpha} setValue={setlassoAlpha}/>
              <SeekBar title="Select Max Iterations" minval={500} maxval={2000} steps={100} value={maxiter} setValue={setmaxiter} />
            </Box>}
          </Box>
        </Box>
      }
      {notallowed && <Box>
        <Box sx={{ padding: 3 }}>
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
                <span style={{ fontWeight: 'normal' }}>{key}:</span> <span style={{ fontWeight: 'bold' }}>{value.toFixed(4)}</span>
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
      </Box>}
    </>
  );
}