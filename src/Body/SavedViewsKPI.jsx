import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, LabelList } from 'recharts';
import { ButtonGroup, Button, TextField, TableContainer, IconButton } from '@mui/material';
import { MyContext } from "./context";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import GetAppIcon from '@mui/icons-material/GetApp';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Snackbar } from '@mui/material';


const SavedViewsKPI = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { timePeriod, fromHistoricalDate, toForecastDate, products, values, values2, values3, cardTitle1, cardTitle2, cardTitle3 } = useContext(MyContext);

  const idToNameMap = {};
  Object.entries(products).forEach(([caseKey, cards]) => {
    Object.values(cards).forEach((card) => {
      card.forEach((item) => {
        idToNameMap[item.id] = item.name;
      });
    });
  });
  const [baseRev, setBaseRev] = useState(152925315.32);
  const [names] = useState(["View - Total Revenue", "View - Revenue CT"]);
  const [Name, setName] = useState(names[0]);
  const chartData = [
    { name: 'Diagonsis Rate', lowCase: -53523860.54, highCase: 61170125.94 },
    { name: 'US Price', lowCase: -38231329.01, highCase: 45877594.41 }
  ];
  const chartData2 = [
    { name: 'Diagonsis Rate', lowCase: -15446561.61, highCase: 17653214.23 },
    { name: 'US Price', lowCase: -11033258.16, highCase: 13239910.78 }
  ];
  const [dropdownGroups, setDropdownGroups] = useState([
    { Case: "base", OutputMetric: "T3-12", Field: "T3-10" },
    { Case: "base", OutputMetric: "T3-12", Field: "T3-11" },
  ]);
  const [columns2, setColumns2] = useState(['Jan-2025', 'Feb-2025', 'Mar-2025', 'Apr-2025', 'May-2025', 'Jun-2025', 'Jul-2025', 'Aug-2025', 'Sep-2025', 'Oct-2025', 'Nov-2025']);
  // Define previous values
  const [pmainresult, psetMainResult] = useState({
    0: {
      "Jan-2025": "14584549.00",
      "Feb-2025": "14363425.50",
      "Mar-2025": "14420168.00",
      "Apr-2025": "14171662.00",
      "May-2025": "13987291.50",
      "Jun-2025": "13924722.00",
      "Jul-2025": "13755866.50",
      "Aug-2025": "13575480.00",
      "Sep-2025": "13526152.00",
      "Oct-2025": "13339498.00",
      "Nov-2025": "13276501.00"
    },
    1: {
      "Jan-2025": "14584549.00",
      "Feb-2025": "14363425.50",
      "Mar-2025": "14420168.00",
      "Apr-2025": "14171662.00",
      "May-2025": "13987291.50",
      "Jun-2025": "13924722.00",
      "Jul-2025": "13755866.50",
      "Aug-2025": "13575480.00",
      "Sep-2025": "13526152.00",
      "Oct-2025": "13339498.00",
      "Nov-2025": "13276501.00"
    }
  });

  const [plowresult, psetLowResult] = useState({
    0: {
      "Jan-2025": 9479956.907055156,
      "Feb-2025": 9336226.324897893,
      "Mar-2025": 9373109.25618745,
      "Apr-2025": 9211580.407876875,
      "May-2025": 9091739.452944301,
      "Jun-2025": 9051069.015186377,
      "Jul-2025": 8941313.001101818,
      "Aug-2025": 8824062.22291603,
      "Sep-2025": 8791998.927227452,
      "Oct-2025": 8670673.839129964,
      "Nov-2025": 8629725.601897478
    },
    1: {
      "Jan-2025": 10938411.81583287,
      "Feb-2025": 10772568.836420644,
      "Mar-2025": 10815126.064831674,
      "Apr-2025": 10628746.624473318,
      "May-2025": 10490468.599551119,
      "Jun-2025": 10443541.171368895,
      "Jul-2025": 10316899.616655944,
      "Aug-2025": 10181610.257210806,
      "Sep-2025": 10144614.146800904,
      "Oct-2025": 10004623.660534574,
      "Nov-2025": 9957375.69449709
    }
  });

  const [phighresult, psetHighResult] = useState({
    0: {
      "Jan-2025": 20418368.722888026,
      "Feb-2025": 20108795.161318533,
      "Mar-2025": 20188235.321019128,
      "Apr-2025": 19840327.03235019,
      "May-2025": 19582208.05249542,
      "Jun-2025": 19494610.186555274,
      "Jul-2025": 19258212.61775776,
      "Aug-2025": 19005672.480126835,
      "Sep-2025": 18936613.074028354,
      "Oct-2025": 18675297.499664538,
      "Nov-2025": 18587101.296394568
    },
    1: {
      "Jan-2025": 18959913.81411031,
      "Feb-2025": 18672452.649795786,
      "Mar-2025": 18746218.5123749,
      "Apr-2025": 18423160.81575375,
      "May-2025": 18183478.905888602,
      "Jun-2025": 18102138.03037275,
      "Jul-2025": 17882626.00220364,
      "Aug-2025": 17648124.445832063,
      "Sep-2025": 17583997.8544549,
      "Oct-2025": 17341347.678259924,
      "Nov-2025": 17259451.203794956
    }
  });

  const [phighresSum, psetHighResSum] = useState({
    0: "214095441.44",
    1: "198802909.91"
  });

  const [plowresSum, psetLowResSum] = useState({
    0: "99401454.96",
    1: "114693986.49"
  });


  const [mainresult, setMainResult] = useState(Name === "View - Total Revenue" ? pmainresult : {
    0: {
      "Jan-2025": "4231800.50",
      "Feb-2025": "4142802.00",
      "Mar-2025": "4159168.00",
      "Apr-2025": "4087492.00",
      "May-2025": "4034314.50",
      "Jun-2025": "4016268.00",
      "Jul-2025": "3967565.50",
      "Aug-2025": "3915537.00",
      "Sep-2025": "3901309.50",
      "Oct-2025": "3847473.50",
      "Nov-2025": "3829303.50"
    },
    1: {
      "Jan-2025": "4231800.50",
      "Feb-2025": "4142802.00",
      "Mar-2025": "4159168.00",
      "Apr-2025": "4087492.00",
      "May-2025": "4034314.50",
      "Jun-2025": "4016268.00",
      "Jul-2025": "3967565.50",
      "Aug-2025": "3915537.00",
      "Sep-2025": "3901309.50",
      "Oct-2025": "3847473.50",
      "Nov-2025": "3829303.50"
    }
  });

  const [lowresult, setLowResult] = useState(Name === "View - Total Revenue" ? plowresult : {
    0: {
      "Jan-2025": 2750670.4417456873,
      "Feb-2025": 2692821.2070514257,
      "Mar-2025": 2703459.2460297523,
      "Apr-2025": 2656869.9396928507,
      "May-2025": 2622304.553884334,
      "Jun-2025": 2610574.095186847,
      "Jul-2025": 2578917.480185971,
      "Aug-2025": 2545099.171690175,
      "Sep-2025": 2535851.2465013955,
      "Oct-2025": 2500857.7963849357,
      "Nov-2025": 2489047.2127750507
    },
    1: {
      "Jan-2025": 3173850.509706562,
      "Feb-2025": 3107101.392751645,
      "Mar-2025": 3119376.053111253,
      "Apr-2025": 3065619.161184059,
      "May-2025": 3025736.023712693,
      "Jun-2025": 3012200.879061746,
      "Jul-2025": 2975674.0155991972,
      "Aug-2025": 2936652.89041174,
      "Sep-2025": 2925982.20750161,
      "Oct-2025": 2885605.1496749255,
      "Nov-2025": 2871977.553201982
    }
  });

  const [highresult, setHighResult] = useState(Name === "View - Total Revenue" ? phighresult : {
    0: {
      "Jan-2025": 5924520.951452249,
      "Feb-2025": 5799922.59980307,
      "Mar-2025": 5822835.299141005,
      "Apr-2025": 5722489.100876909,
      "May-2025": 5648040.577597027,
      "Jun-2025": 5622774.974248594,
      "Jul-2025": 5554591.495785168,
      "Aug-2025": 5481752.0621019155,
      "Sep-2025": 5461833.454003005,
      "Oct-2025": 5386462.946059861,
      "Nov-2025": 5361024.7659770325
    },
    1: {
      "Jan-2025": 5501340.883491375,
      "Feb-2025": 5385642.4141028505,
      "Mar-2025": 5406918.492059505,
      "Apr-2025": 5313739.879385702,
      "May-2025": 5244609.107768668,
      "Jun-2025": 5221148.190373694,
      "Jul-2025": 5157834.960371942,
      "Aug-2025": 5090198.34338035,
      "Sep-2025": 5071702.493002791,
      "Oct-2025": 5001715.592769871,
      "Nov-2025": 4978094.425550102
    }
  });

  const [highresSum, setHighResSum] = useState(Name === "View - Total Revenue" ? phighresSum : {
    0: "61786248.23",
    1: "57372944.78"
  });

  const [lowresSum, setLowResSum] = useState(Name === "View - Total Revenue" ? plowresSum : {
    0: "28686472.39",
    1: "33099775.84"
  });

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

      {<Grid item xs={12}>
        <div style={{ width: '80%', margin: 'auto', textAlign: 'center', marginTop: "150px" }}>
          <h3 style={{ color: '#333', marginBottom: '20px' }}>{dropdownGroups[0].Case.charAt(0).toUpperCase() + dropdownGroups[0].Case.slice(1)} Case, {labelsOutputMetric[0]}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Name === 'View - Total Revenue' ? baseRev : 44133034)}</h3>
          <BarChart
            width={900}
            height={500}
            data={Name === 'View - Total Revenue' ? chartData : chartData2}
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

    </>
  );
}

export default SavedViewsKPI;






