import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar, LabelList } from 'recharts';
import { ButtonGroup, Button, TextField, TableContainer } from '@mui/material';
import { MyContext } from "./context";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


const SavedViewsKPI = () => {
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
  const [names] = useState(["View - Revenue", "View - Market Share"]);
  const [Name, setName] = useState(names[0]);
  const chartData = [
    { name: 'Revenue - Chronic Therapy', lowCase: -15446562.05, highCase: 17653213.78 },
    { name: 'Revenue - Episodic Therapy', lowCase: -27198070.22, highCase: 32637684.27 }
  ];
  const chartData2 = [
    { name: 'Share assumptions across Chronic Therapy', lowCase: -1544652.05, highCase: 1763213.78 },
    { name: 'Share assumptions across Episodic Therapy', lowCase: -2719070.22, highCase: 3637684.27 }
  ];
  const [dropdownGroups, setDropdownGroups] = useState([
    { Case: "base", OutputMetric: "T3-12", Field: "T3-10" },
    { Case: "base", OutputMetric: "T3-12", Field: "T3-11" },
  ]);
  const [columns2, setColumns2] = useState(['Jan-2025', 'Feb-2025', 'Mar-2025', 'Apr-2025', 'May-2025', 'Jun-2025', 'Jul-2025', 'Aug-2025', 'Sep-2025', 'Oct-2025', 'Nov-2025']);
  
  const [mainresult, setMainResult] = useState({});
  const [lowresult, setLowResult] = useState({});
  const [highresSum, setHighResSum] = useState({});
  const [lowresSum, setLowResSum] = useState({});
  const [highresult, setHighResult] = useState({});


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
          <h3 style={{ color: '#333', marginBottom: '20px' }}>{dropdownGroups[0].Case.charAt(0).toUpperCase() + dropdownGroups[0].Case.slice(1)} Case, {labelsOutputMetric[0]}: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baseRev)}</h3>
          <BarChart
            width={900}
            height={500}
            data={Name === 'View - Revenue' ? chartData : chartData2}
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

    </>
  );
}

export default SavedViewsKPI;






