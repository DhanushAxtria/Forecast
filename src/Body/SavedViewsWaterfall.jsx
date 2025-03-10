import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, LabelList } from 'recharts';
import { ButtonGroup, Button} from '@mui/material';
import Grid from '@mui/material/Grid';



const SavedViewsWaterfall = () => {
  const data = [
    { name: "Base Case", value: 152925315.5, cumulative: 152925315.5, start: 0, color: "green" },
    { name: "US Price", value: 76462657.48, cumulative: 229387972.98, start: 152925315.5, color: "blue" },
    { name: "Prevalence Rate", value: -137632783.97, cumulative: 91755189.01, start: 229387972.98, color: "blue" },
    { name: "Diagonsis Rate", value: 61170125.94, cumulative: 152925314.95, start: 91755189.01, color: "blue" },
    { name: "Scenario Case", value: 152925314.95, cumulative: 305850629.9, start: 0, color: "green" }
  ];
  const data2 = [
    { name: "Base Case", value: 44133034, cumulative: 44133034, start: 0, color: "green" },
    { name: "Patients on Chronic Therapy", value: 17653214.23, cumulative: 61786248.230000004, start: 44133034, color: "blue" },
    { name: "Prevalence Rate", value: 8826607.34, cumulative: 70612855.57000001, start: 61786248.230000004, color: "blue" },
    { name: "Scenario Case", value: 70612855.57000001, cumulative: 141225711.14000002, start: 0, color: "green" }
  ];
  
  const [names] = useState(["View - Total Revenue", "View - Revenue CT"]);
  const [Name, setName] = useState(names[0]);
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

      <Grid item xs={12}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={Name === 'View - Total Revenue' ? data : data2}
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



    </>
  );
}

export default SavedViewsWaterfall;






