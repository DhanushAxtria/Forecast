import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function CountryAndTherapeuticSelect() {
  const [country, setCountry] = React.useState('');
  const [therapeuticArea, setTherapeuticArea] = React.useState('');
  const [filteredData, setFilteredData] = React.useState([]);
  const [importedData, setImportedData] = React.useState({ headers: [], rows: [] });
  const [selectedTemplates, setSelectedTemplates] = React.useState([]);

  // Sample data to display in the table
  const data = [
    { id: 1, country: 'USA', therapeuticArea: 'Cardiology', info: 'Data 1' },
    { id: 2, country: 'Canada', therapeuticArea: 'Oncology', info: 'Data 2' },
    { id: 3, country: 'Germany', therapeuticArea: 'Neurology', info: 'Data 3' },
    { id: 4, country: 'India', therapeuticArea: 'Diabetes', info: 'Data 4' },
    { id: 5, country: 'USA', therapeuticArea: 'Oncology', info: 'Data 5' },
    // Add more sample data as needed
  ];

  // Handle change for country dropdown
  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setCountry(selectedCountry);
    updateSelectedTemplates(selectedCountry, therapeuticArea);
  };

  // Handle change for therapeutic area dropdown
  const handleTherapeuticChange = (event) => {
    const selectedTherapeutic = event.target.value;
    setTherapeuticArea(selectedTherapeutic);
    updateSelectedTemplates(country, selectedTherapeutic);
  };

  // Update the selected template details in the cards list
  const updateSelectedTemplates = (selectedCountry, selectedTherapeutic) => {
    if (selectedCountry && selectedTherapeutic) {
      const newTemplate = { country: selectedCountry, therapeuticArea: selectedTherapeutic };
      
      // Check if the template already exists to avoid duplicates
      const isDuplicate = selectedTemplates.some(
        (template) => template.country === selectedCountry && template.therapeuticArea === selectedTherapeutic
      );

      if (!isDuplicate) {
        setSelectedTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
      }
    }
  };

  // Function to delete a selected template
  const handleDeleteTemplate = (indexToDelete) => {
    setSelectedTemplates((prevTemplates) =>
      prevTemplates.filter((_, index) => index !== indexToDelete)
    );
  };

  // Function to handle filtering the data
  React.useEffect(() => {
    const filtered = data.filter((item) => {
      return (
        (country === '' || item.country === country) &&
        (therapeuticArea === '' || item.therapeuticArea === therapeuticArea)
      );
    });
    setFilteredData(filtered);
  }, [country, therapeuticArea]);

  // Function to handle downloading the CSV
  const handleDownloadTemplate = () => {
    // Define the headers for CSV
    const headers = ['Country', 'Therapeutic Area'];

    // Define the row data based on the selected filters
    const rowData = [
      [country, therapeuticArea]
    ];

    // Convert the headers and row data to a CSV string
    const csvContent = [
      headers.join(','), // Join headers with commas
      rowData.join(',') // Join row data with commas
    ].join('\n'); // Join headers and data with newline

    // Create a Blob from the CSV content and generate a URL
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered_template.csv'); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file input change for importing a CSV
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // Parse the CSV content
        const rows = content.split('\n').filter(row => row.trim() !== ''); // Ignore empty rows
        const headers = rows[0].split(',').map(header => header.trim());
        const parsedRows = rows.slice(1).map((row, index) => {
          const values = row.split(',').map(value => value.trim());
          return { id: index + 1, data: values };
        });
        setImportedData({ headers, rows: parsedRows });
      };
      reader.readAsText(file);
    }
  };

  // Reference to the hidden file input
  const fileInputRef = React.useRef(null);

  // Function to trigger file input click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      {/* Country Select Dropdown */}
      <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          labelId="country-select-label"
          id="country-select"
          value={country}
          label="Country"
          onChange={handleCountryChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="USA">USA</MenuItem>
          <MenuItem value="Canada">Canada</MenuItem>
          <MenuItem value="Germany">Germany</MenuItem>
          <MenuItem value="India">India</MenuItem>
        </Select>
      </FormControl>

      {/* Therapeutic Area Select Dropdown */}
      <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
        <InputLabel id="therapeutic-select-label">Therapeutic Area</InputLabel>
        <Select
          labelId="therapeutic-select-label"
          id="therapeutic-select"
          value={therapeuticArea}
          label="Therapeutic Area"
          onChange={handleTherapeuticChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Oncology">Oncology</MenuItem>
          <MenuItem value="Neurology">Neurology</MenuItem>
          <MenuItem value="Diabetes">Diabetes</MenuItem>
        </Select>
      </FormControl>

      {/* Button to Download the Template */}
      <Button
        variant="contained"
        color="primary"
        sx={{ m: 1 }}
        onClick={handleDownloadTemplate}
        disabled={!country && !therapeuticArea}
      >
        Download Template
      </Button>

      {/* Button to Import CSV */}
      <Button
        variant="contained"
        color="secondary"
        sx={{ m: 1 }}
        onClick={handleImportClick}
      >
        Import CSV
      </Button>

      {/* Hidden file input for importing CSV */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Data Display Table with Vertical and Horizontal Scrolling */}
      <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 400, maxWidth: '100%', overflow: 'auto' }}>
        <Table stickyHeader aria-label="filtered data table">
          <TableHead>
            <TableRow>
              {/* Render dynamic headers */}
              {importedData.headers.length > 0
                ? importedData.headers.map((header, index) => (
                    <TableCell key={index}>{header}</TableCell>
                  ))
                : (
                  <>
                    <TableCell>ID</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Therapeutic Area</TableCell>
                    <TableCell>Info</TableCell>
                  </>
                )}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Render filtered data */}
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.country}</TableCell>
                <TableCell>{row.therapeuticArea}</TableCell>
                <TableCell>{row.info}</TableCell>
              </TableRow>
            ))}
            {/* Render imported CSV data */}
            {importedData.rows.map((row) => (
              <TableRow key={`imported-${row.id}`}>
                {row.data.map((value, index) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Display All Selected Templates in One Card */}
      {selectedTemplates.length > 0 && (
        <Card sx={{ mt: 3, maxWidth: 600, mx: 'auto', p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              All Selected Templates
            </Typography>
            {selectedTemplates.map((template, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Typography sx={{ flexGrow: 1 }}>
                  <strong>Template {index + 1}:</strong> Country - {template.country}, Therapeutic Area - {template.therapeuticArea}
                </Typography>
                <IconButton
                  color="secondary"
                  onClick={() => handleDeleteTemplate(index)}
                  aria-label="delete template"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
