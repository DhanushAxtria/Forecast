import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa'; // Importing the filter icon

// Unicode for Lock and Good to Go icons
const lockIcon = '🔒';
const goodToGoIcon = '✅';

// Sample data for Therapeutic Area, Country, Usernames, and Forecast Cycles
const therapeuticAreas = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology'];
const countries = ['USA', 'Canada', 'Germany', 'UK', 'Australia'];
const forecastCycles = ['2024-H1', '2024-H2', '2025-H1'];
const forecastOptions = {
  '2024-H1': ['Forecast 1', 'Forecast 2'],
  '2024-H2': ['Forecast 3', 'Forecast 4'],
  '2025-H1': ['Forecast 5', 'Forecast 6'],
};
const sampleUsernames = ['john_doe', 'jane_smith', 'michael_wang', 'emma_clark', 'chris_jones'];

const DataConsolidation = () => {
  const [greeting, setGreeting] = useState('');
  const [rowsData, setRowsData] = useState([]);
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState(''); // State for selected Therapeutic Area
  const [selectedCountry, setSelectedCountry] = useState(''); // State for selected Country
  const [selectedForecastCycle, setSelectedForecastCycle] = useState(''); // State for selected Forecast Cycle

  // Set the greeting based on the current time
  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  // Generate a random date within the past year
  const getRandomDate = () => {
    const start = new Date(new Date().setFullYear(new Date().getFullYear() - 1)); // 1 year ago
    const end = new Date(); // today
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toISOString()
      .split('T')[0]; // format the date as yyyy-mm-dd
  };

  // Pick a random username from the sample list
  const getRandomUsername = () => {
    return sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
  };

  // Pick a random Therapeutic Area
  const getRandomTherapeuticArea = () => {
    return therapeuticAreas[Math.floor(Math.random() * therapeuticAreas.length)];
  };

  // Pick a random Country
  const getRandomCountry = () => {
    return countries[Math.floor(Math.random() * countries.length)];
  };

  // Generate random lock or good-to-go status for forecast options
  const getRandomForecastStatus = () => {
    return Math.random() > 0.5 ? 'lock' : 'goodToGo';
  };

  // Initialize the table with 10 rows of random data
  useEffect(() => {
    const rows = Array.from({ length: 10 }, () => ({
      therapeuticArea: getRandomTherapeuticArea(),
      country: getRandomCountry(),
      worksheet: 'Output Sheet',
      forecast: 'Forecast 1', // Default forecast, will be updated when the Forecast Cycle filter is applied
      forecastStatus: getRandomForecastStatus(),
      forecastStarted: getRandomDate(),
      username: getRandomUsername(),
    }));
    setRowsData(rows);
  }, []);

  // Function to filter rows based on selected Therapeutic Area and Country
  const getFilteredRows = () => {
    return rowsData.filter(row => {
      const matchesTherapeuticArea =
        selectedTherapeuticArea === '' || row.therapeuticArea === selectedTherapeuticArea;
      const matchesCountry = selectedCountry === '' || row.country === selectedCountry;
      return matchesTherapeuticArea && matchesCountry;
    });
  };

  // Get the filtered forecast options based on the selected Forecast Cycle
  const getFilteredForecastOptions = () => {
    if (selectedForecastCycle && forecastOptions[selectedForecastCycle]) {
      return forecastOptions[selectedForecastCycle];
    }
    return [];
  };

  return (
    <div style={styles.container}>
      {/* Greeting section */}
      <h1 style={styles.greeting}>{greeting}, Welcome to the Scenario-Comparison page!</h1>

      {/* Forecast and Worksheet Selections Container */}
      <div style={styles.selectionContainer}>
        
        {/* Forecast Cycle Filter */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Forecast Cycle</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Forecast Cycle</label>
              <select
                style={styles.select}
                value={selectedForecastCycle}
                onChange={(e) => setSelectedForecastCycle(e.target.value)}
              >
                <option value="">All</option>
                {forecastCycles.map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Therapeutic Area Filter */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Therapeutic Area</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Therapeutic Area</label>
              <select
                style={styles.select}
                value={selectedTherapeuticArea}
                onChange={(e) => setSelectedTherapeuticArea(e.target.value)}
              >
                <option value="">All</option>
                {therapeuticAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Country/Region Filter */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Country/Region</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Country/Region</label>
              <select
                style={styles.select}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">All</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* Data Table Section */}
      <div style={styles.tableContainer}>
        <h2 style={styles.tableHeading}>Therapeutic Area, Country and Connected Data</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>
                Therapeutic Area <FaFilter style={styles.filterIcon} /> {/* Filter Icon for Therapeutic Area */}
              </th>
              <th>
                Country/Region <FaFilter style={styles.filterIcon} /> {/* Filter Icon for Country/Region */}
              </th>
              <th>Connected Worksheet</th>
              <th>Connected Forecast</th>
              <th>Forecast Started</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredRows().map((row, index) => (
              <tr key={index}>
                {/* Therapeutic Area */}
                <td>{row.therapeuticArea}</td>

                {/* Country/Region */}
                <td>{row.country}</td>

                {/* Connected Worksheet Dropdown */}
                <td>
                  <select style={styles.select}>
                    <option value="OutputSheet">Output Sheet</option>
                    <option value="Worksheet1">Worksheet 1</option>
                    <option value="Worksheet2">Worksheet 2</option>
                  </select>
                </td>

                {/* Connected Forecast with Dynamic Icons */}
                <td>
                  <select style={styles.select}>
                    {getFilteredForecastOptions().map((forecast, idx) => (
                      <option key={idx} value={forecast}>
                        {forecast} {row.forecastStatus === 'lock' ? lockIcon : goodToGoIcon}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Forecast Started (Random Date) */}
                <td>
                  <input type="date" value={row.forecastStarted} style={styles.input} readOnly />
                </td>

                {/* Username (Random Name) */}
                <td>
                  <input type="text" value={row.username} style={styles.input} readOnly />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  greeting: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  selectionContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
  },
  section: {
    width: '30%',
    textAlign: 'left',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  content: {
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  labeledSelect: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  select: {
    display: 'block',
    margin: '10px 0',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  tableContainer: {
    marginTop: '30px',
  },
  tableHeading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    padding: '10px',
    backgroundColor: '#f2f2f2',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center',
  },
  forecastCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginLeft: '10px',
  },
  iconGoodToGo: {
    marginLeft: '10px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  filterIcon: {
    marginLeft: '5px',
    color: '#888',
    cursor: 'pointer',
  },
};

export default DataConsolidation;
