import React, { useState, useEffect, useContext } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import FormControl from '@mui/material/FormControl';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import produce from "immer";
import Select from '@mui/material/Select';
import {
    TextField,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    ListItemIcon,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Tooltip,
    Card,
    Box,
    Tabs,
    Tab,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AdjustIcon from '@mui/icons-material/Adjust';
import './ProductListpage.scss';
import { MyContext } from './context';



const KPI = () => {
    const { products } = useContext(MyContext);
    const [Index, setIndex] = useState("");
    const [buttonType, setButtonType] = useState("");
    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);
    const [openStartEndDialog, setOpenStartEndDialog] = useState(false);
    const [editingHighStartValue, setEditingHighStartValue] = useState([]); // Start value for High Case
    const [editingHighEndValue, setEditingHighEndValue] = useState([]); // End value for High Case
    const [editingLowStartValue, setEditingLowStartValue] = useState([]); // Start value for Low Case
    const [editingLowEndValue, setEditingLowEndValue] = useState([]); // End value for Low Case
    const [highStartValue, setHighStartValue] = useState([]); // Saved High Case Start Values
    const [highEndValue, setHighEndValue] = useState([]); // Saved High Case End Values
    const [lowStartValue, setLowStartValue] = useState([]); // Saved Low Case Start Values
    const [lowEndValue, setLowEndValue] = useState([]); // Saved Low Case End Values
    const [dropdownGroups, setDropdownGroups] = useState([
        { Case: "", OutputMetric: "", Field: "" },
    ]);

    const handleAddDropdownGroup = () => {
        setDropdownGroups([...dropdownGroups, { Case: "", OutputMetric: "", Field: "" }]);
        console.log(dropdownGroups);
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
        dropdownGroups[dropdownGroups.length - 1].OutputMetric &&
        dropdownGroups[dropdownGroups.length - 1].Field;

    const handleSaveStartEndValues = () => {
        if (buttonType === "High") {
            setHighStartValue(editingHighStartValue);
            setHighEndValue(editingHighEndValue);
        } else if (buttonType === "Low") {
            setLowStartValue(editingLowStartValue);
            setLowEndValue(editingLowEndValue);
        }
        setOpenStartEndDialog(false);
    };

    const handleCancelAndOpenInputMethodDialog = () => {
        if (buttonType === "High") {
            setEditingHighStartValue(highStartValue);
            setEditingHighEndValue(highEndValue);
        } else if (buttonType === "Low") {
            setEditingLowStartValue(lowStartValue);
            setEditingLowEndValue(lowEndValue);
        }
        setOpenStartEndDialog(false);
        setOpenInputMethodDialog(true);
    };

    const handleInputMethodSelect = (method) => {
        setOpenInputMethodDialog(false);
        if (method === 'startEndValues') {
            setOpenStartEndDialog(true);
        }
    };

    return (
        <>
            {dropdownGroups.map((group, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    {/* Case Dropdown */}
                    <FormControl sx={{ m: 1, width: "15ch" }}>
                        <InputLabel id={`case-select-label-${index}`}>Case</InputLabel>
                        <Select
                            labelId={`case-select-label-${index}`}
                            id={`case-select-${index}`}
                            value={group.Case}
                            label="Case"
                            onChange={(e) => handleDropdownChange(index, "Case", e.target.value)}
                            sx={{ fontSize: "0.9rem" }}
                        >
                            <MenuItem value="downside">Downside</MenuItem>
                            <MenuItem value="base">Base</MenuItem>
                            <MenuItem value="upside">Upside</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Output Metric Dropdown */}
                    {group.Case && (
                        <FormControl sx={{ m: 1, width: "15ch" }}>
                            <InputLabel id={`output-metric-select-label-${index}`}>Output Metric</InputLabel>
                            <Select
                                labelId={`output-metric-select-label-${index}`}
                                id={`output-metric-select-${index}`}
                                value={group.OutputMetric}
                                label="Output Metric"
                                onChange={(e) => handleDropdownChange(index, "OutputMetric", e.target.value)}
                                sx={{ fontSize: "0.9rem" }}
                            >
                                {products[group.Case] &&
                                    Object.entries(products[group.Case]).map(([tableKey, tableValue]) =>
                                        Object.entries(tableValue).map(([id, value]) => (
                                            <MenuItem key={`${tableKey}-${id}`} value={value.name}>
                                                {value.name}
                                            </MenuItem>
                                        )))}
                            </Select>
                        </FormControl>
                    )}

                    {/* Field Dropdown */}
                    {group.OutputMetric && (
                        <FormControl sx={{ m: 1, width: "15ch" }}>
                            <InputLabel id={`field-select-label-${index}`}>Field</InputLabel>
                            <Select
                                labelId={`field-select-label-${index}`}
                                id={`field-select-${index}`}
                                value={group.Field}
                                label="Field"
                                onChange={(e) => handleDropdownChange(index, "Field", e.target.value)}
                                sx={{ fontSize: "0.9rem" }}
                            >
                                {products[group.Case] &&
                                    Object.entries(products[group.Case]).map(([tableKey, tableValue]) =>
                                        Object.entries(tableValue).map(([id, value]) => (
                                            <MenuItem key={`${tableKey}-${id}`} value={value.name}>
                                                {value.name}
                                            </MenuItem>
                                        )))}
                            </Select>
                        </FormControl>
                    )}

                    {/* High Case Input and Low Case Input Buttons */}
                    {group.Case && group.OutputMetric && group.Field && (
                        <>
                            <Button
                                variant="outlined"
                                color="success"
                                sx={{ ml: 1, width: "6ch", height: "7ch" }}
                                onClick={() => {
                                    setIndex(index);
                                    setButtonType("High");
                                    setOpenInputMethodDialog(true);
                                }}
                            >
                                High Case
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{ ml: 1, width: "6ch", height: "7ch" }}
                                onClick={() => {
                                    setIndex(index);
                                    setButtonType("Low")
                                    setOpenInputMethodDialog(true)
                                }}
                            >
                                Low Case
                            </Button>
                        </>
                    )}


                    {/* Add and Delete Buttons */}
                    {index === dropdownGroups.length - 1 && dropdownGroups.length < 6 && isLastRowFilled && (
                        <IconButton
                            title="Add new parameters"
                            aria-label="add"
                            sx={{ color: "blue", bgcolor: "blue.100", ml: 1 }}
                            onClick={handleAddDropdownGroup}
                        >
                            <AddIcon />
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
            {<Dialog open={openInputMethodDialog} onClose={() => { setOpenInputMethodDialog(false); }}
                maxWidth="sm"
                fullWidth
                BackdropProps={{
                    style: {
                        zIndex: 1400,
                        backgroundColor: 'rgba(0,0,0,0.2)', // Make backdrop slightly dark and transparent
                    },
                }}

                PaperProps={{
                    sx: {
                        zIndex: 1600,
                        borderRadius: '12px',
                        boxShadow: 4,
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        color: '#1976d2',
                        bgcolor: '#f0f4fa',
                        padding: '20px',
                    }}
                >
                    Input Method For {buttonType} Case
                </DialogTitle>
                <DialogContent sx={{ padding: '24px', backgroundColor: '#fafafa' }}>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {/* Growth Rate */}
                        <ListItem
                            button
                            //onClick={() => handleInputMethodSelect('growthRate')}
                            sx={{
                                padding: '18px',
                                borderBottom: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                cursor: 'pointer', // Adds hand cursor on hover
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                1.
                            </Typography>
                            <TrendingUpIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Set Initial Values with Growth Rate" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                        </ListItem>

                        {/* Start and End Values */}
                        <ListItem
                            button
                            onClick={() => handleInputMethodSelect('startEndValues')}
                            sx={{
                                padding: '18px',
                                borderBottom: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                cursor: 'pointer', // Adds hand cursor on hover
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                2.
                            </Typography>
                            <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Specify Starting and Target Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                        </ListItem>
                        <Tooltip title="Only .csv or .xlsx formats allowed" arrow>
                            <ListItem
                                button
                                //onClick={() => handleInputMethodSelect('file')}
                                sx={{
                                    padding: '18px',
                                    borderBottom: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    cursor: 'pointer', // Adds hand cursor on hover
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                        transform: 'scale(1.02)',
                                        transition: 'transform 0.2s',
                                    },
                                }}
                            >
                                <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                    3.
                                </Typography>
                                <UploadFileIcon color="primary" sx={{ marginRight: '12px' }} />
                                <ListItemText primary="Upload Data File" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                            </ListItem>
                        </Tooltip>
                        <ListItem
                            button
                            //onClick={() => handleInputMethodSelect('copy')}
                            sx={{
                                padding: '18px',
                                borderBottom: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                cursor: 'pointer', // Adds hand cursor on hover
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                4.
                            </Typography>
                            <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Copy from" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                        </ListItem>
                        <ListItem
                            button
                            //onClick={() => handleInputMethodSelect('%')}
                            sx={{
                                padding: '18px',
                                borderBottom: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                cursor: 'pointer', // Adds hand cursor on hover
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                5.
                            </Typography>
                            <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Change by %" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                        </ListItem>
                        <ListItem
                            button
                            //onClick={() => handleInputMethodSelect('Absolute')}
                            sx={{
                                padding: '18px',
                                borderRadius: '8px',
                                marginBottom: '12px',
                                cursor: 'pointer', // Adds hand cursor on hover
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s',
                                },
                            }}
                        >
                            <Typography variant="h6" color="primary" sx={{ marginRight: '12px', fontWeight: 'bold' }}>
                                6.
                            </Typography>
                            <AdjustIcon color="primary" sx={{ marginRight: '12px' }} />
                            <ListItemText primary="Change by Absolute Values" primaryTypographyProps={{ fontSize: '1.1rem', fontWeight: 'medium' }} />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions sx={{ padding: '16px', backgroundColor: '#f0f4fa' }}>
                    <Button onClick={() => { setOpenInputMethodDialog(false); }} color="secondary" variant="contained" sx={{ fontWeight: 'bold', borderRadius: '8px' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>}
            {<Dialog open={openStartEndDialog} onClose={() => { setOpenStartEndDialog(false); }} maxWidth="sm" fullWidth>
                <DialogTitle>Specify Start and Target Values</DialogTitle>
                <DialogContent sx={{ paddingTop: '15px' }}>
                    {/* 
                                                This box contains two text fields for the start and end values.
                                                The start value is the initial value , and the end value is the target value.
                                                The values are validated to only allow numbers.
                                            */}
                    <Box marginTop='25px' display="flex" gap="16px" alignItems="center">
                    <TextField
                            label="Start Value"
                            type="number"
                            value={(buttonType === "High" ? editingHighStartValue[Index] : editingLowStartValue[Index]) || ''}
                            onChange={(e) => {
                                if (buttonType === "High") {
                                    setEditingHighStartValue(prev => ({ ...prev, [Index]: e.target.value }));
                                } else {
                                    setEditingLowStartValue(prev => ({ ...prev, [Index]: e.target.value }));
                                }
                            }}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="End Value"
                            type="number"
                            value={(buttonType === "High" ? editingHighEndValue[Index] : editingLowEndValue[Index]) || ''}
                            onChange={(e) => {
                                if (buttonType === "High") {
                                    setEditingHighEndValue(prev => ({ ...prev, [Index]: e.target.value }));
                                } else {
                                    setEditingLowEndValue(prev => ({ ...prev, [Index]: e.target.value }));
                                }
                            }}
                            size="small"
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAndOpenInputMethodDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleSaveStartEndValues() }} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>}
        </>
    );
};
export default KPI;

