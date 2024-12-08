import { BorderAllOutlined } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';

const therapeuticAreas = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology', 'HIV'];
const countries = ['USA', 'Canada', 'Germany', 'UK', 'Australia', 'France', 'Italy', 'Austria', 'Spain', 'Poland'];
const forecastScenarios = ['H1 - 2023', 'H2 - 2023', 'H1 - 2024', 'H2 - 2024'];
const forecastStatus = ['Submitted', 'Pending', 'Ongoing'];
const sampleUsernames = ['john_doe', 'jane_smith', 'michael_wang', 'emma_clark', 'chris_jones', 'Nicholas_Puran'];

const DataConsolidation = () => {
  const [rowsData, setRowsData] = useState([]);
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedForecastStatus, setSelectedForecastStatus] = useState('');
  const [selectedForecastScenario, setSelectedForecastScenario] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [greeting, setGreeting] = useState('');

  const getRandomDate = () => {
    const start = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toISOString()
      .split('T')[0];
  };

  const getRandomUsername = () => {
    return sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
  };

  const getRandomTherapeuticArea = () => {
    return therapeuticAreas[Math.floor(Math.random() * therapeuticAreas.length)];
  };

  const getRandomCountry = () => {
    return countries[Math.floor(Math.random() * countries.length)];
  };

  const getRandomForecastStatus = () => {
    return forecastStatus[Math.floor(Math.random() * forecastStatus.length)];
  };

  const getRandomForecastScenario = () => {
    return forecastScenarios[Math.floor(Math.random() * forecastScenarios.length)];
  };

  useEffect(() => {
    const rows = Array.from({ length: 25 }, () => ({
      therapeuticArea: getRandomTherapeuticArea(),
      country: getRandomCountry(),
      worksheet: 'Output Sheet',
      forecast: 'Forecast 1',
      currentForecastStatus: getRandomForecastStatus(),
      forecastScenario: getRandomForecastScenario(),
      forecastStarted: getRandomDate(),
      username: getRandomUsername(),
    }));
    setRowsData(rows);
  }, []);

  const getFilteredRows = () => {
    return rowsData.filter(row => {
      const matchesTherapeuticArea =
        selectedTherapeuticArea === '' || row.therapeuticArea === selectedTherapeuticArea;
      const matchesCountry =
        selectedCountry === '' || row.country === selectedCountry;
      const matchesStatus =
        selectedForecastStatus === '' || row.currentForecastStatus === selectedForecastStatus;
      const matchesScenario =
        selectedForecastScenario === '' || row.forecastScenario === selectedForecastScenario;
      return matchesTherapeuticArea && matchesCountry && matchesStatus && matchesScenario;
    });
  };

  const handleTherapeuticAreaClick = (ta) => {
    if (selectedTherapeuticArea === ta) {
      setSelectedTherapeuticArea('');
    } else {
      setSelectedTherapeuticArea(ta);
    }
  };
  const handleCurrentStatusClick = (sts) => {
    if (selectedForecastStatus === sts) {
      setSelectedForecastStatus('');
    } else
      setSelectedForecastStatus(sts);
  };
  const handleCountryClick = (cntry) => {
    if (selectedCountry === cntry) {
      setSelectedCountry('');
    } else
      setSelectedCountry(cntry);
  };
  const handleScenarioClick = (scn) => {
    if (selectedForecastScenario === scn) {
      setSelectedForecastScenario('');
    } else
      setSelectedForecastScenario(scn);
  };

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

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', marginTop: '-44px' }}>
     
       <h2 >{greeting}, Welcome to the Submission Tracker Page!</h2>

      <div style={styles.selectionContainer}>

        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Forecast Status</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Forecast Status</label>
              <select
                style={styles.select}
                value={selectedForecastStatus}
                onChange={(e) => setSelectedForecastStatus(e.target.value)}
              >
                <option value="">All</option>
                {forecastStatus.map((currentForecastStatus) => (
                  <option key={currentForecastStatus} value={currentForecastStatus}>
                    {currentForecastStatus}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Therapeutic Area</h2>
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

        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Country/Region</h2>
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

        <section style={styles.section}>
          <h2 style={{ ...styles.heading, color: 'black' }}>Forecast Scenario</h2>
          <div style={styles.content}>
            <div style={styles.labeledSelect}>
              <label style={styles.label}>Select Forecast Scenario</label>
              <select
                style={styles.select}
                value={selectedForecastScenario}
                onChange={(e) => setSelectedForecastScenario(e.target.value)}
              >
                <option value="">All</option>
                {forecastScenarios.map((forecastScenario) => (
                  <option key={forecastScenario} value={forecastScenario}>
                    {forecastScenario}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

      </div>

      <div style={styles.tableContainer}>
        <h2 style={styles.tableHeading}> Country-TA wise Forecast Submission Status</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Therapeutic Area <FaFilter style={styles.filterIcon} /></th>
              <th style={styles.tableHeader}>Country/Region <FaFilter style={styles.filterIcon} /></th>
              <th style={styles.tableHeader}>Forecast Status <FaFilter style={styles.filterIcon} /></th>
              <th style={styles.tableHeader}>Forecast Scenario <FaFilter style={styles.filterIcon} /></th>
              <th style={styles.tableHeader}>Last Forecast Update</th>
              <th style={styles.tableHeader}> Last Updated By</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredRows().map((row, index) => (
              <tr
                key={index}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                style={hoveredRow === index ? styles.hoveredRow : {}}
              >
                <td style={{ ...styles.tableCell, cursor: 'pointer', color: '#086193', fontWeight: 'bold' }}
                  onClick={() => handleTherapeuticAreaClick(row.therapeuticArea)}>
                  {row.therapeuticArea}
                </td>
                <td style={styles.tableCell} onClick={() => handleCountryClick(row.country)}>{row.country}</td>
                <td style={{
                  ...styles.tableCell,
                  color:
                    row.currentForecastStatus === 'Pending' ? 'red' :
                      row.currentForecastStatus === 'Ongoing' ? '#f1b963' :
                        '#42b883',
                }} onClick={() => handleCurrentStatusClick(row.currentForecastStatus)}>
                  {row.currentForecastStatus}
                </td>
                <td style={styles.tableCell} onClick={() => handleScenarioClick(row.forecastScenario)}>{row.forecastScenario}</td>
                <td style={styles.tableCell}>{row.forecastStarted}</td>
                <td style={styles.tableCell}>{row.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  selectionContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '20px',
  },
  section: {
    width: '23%',
    textAlign: 'left',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#086193',
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
    display: 'contents',
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
    backgroundColor: '#1976d2',
    color: 'white',
    padding: '5px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  hoveredRow: {
    backgroundColor: '#d4e6f1',
  },
  tableHeader: {
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    padding: '8px',
  },
  tableCell: {
    textAlign: 'center',
    padding: '8px',
    borderBottom: '1px solid #ddd',
  },
  filterIcon: {
    marginLeft: '5px',
    color: 'white',
    cursor: 'pointer',
  },
};

export default DataConsolidation;
