import { React, useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import "./Body.scss";
import {
  Assessment,
  SaveAlt,
  QueryStats,
  Assignment,
  Security,
} from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';


const demo_data = [
  { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Sep 2024', user: 'John Doe' },
  { scenario: 'Draft 1', cycle: '2024 H2', country: 'Norway', area: 'Oncology', modified: '29 Sep 2024', user: 'John Doe' },
  { scenario: 'Draft 2', cycle: '2024 H2', country: 'Norway', area: 'Oncology', modified: '28 Sep 2024', user: 'John Doe' },
  { scenario: 'Main Submission', cycle: '2024 H2', country: 'Finland', area: 'HIV', modified: '27 Sep 2024', user: 'John Doe' },
];
const demo_data2 = [
  { scenario: 'Main Submission', cycle: '2024 H2', country: 'Norway', area: 'HIV', modified: '30 Sep 2024', user: 'MIcheal' },
  { scenario: 'Draft 3', cycle: '2023 H2', country: 'Norway', area: 'Oncology', modified: '29 Sep 2024', user: 'MIcheal' },
  { scenario: 'Draft 4', cycle: '2024 H2', country: 'Norway', area: 'Oncology', modified: '28 Sep 2024', user: 'MIcheal' },
  { scenario: 'Main Submission', cycle: '2023 H2', country: 'Finland', area: 'HIV', modified: '27 Sep 2024', user: 'MIcheal' },
];
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const Body = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const showTutorial2 = () => {
    const step = {
      index: 0,
      target: '.tutorial-btn',
      content: 'You can always see this tutorial by clicking on this button.',
      placement: 'left',
    };
    const targetElement = document.querySelector(step.target);
    const popup = document.createElement('div');
    popup.classList.add('tutorial-popup', step.placement);
    popup.textContent = step.content;
    targetElement.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)';
    targetElement.style.border = '3px solid navy';
    // Position the popup based on the target element and placement
    const rect = targetElement.getBoundingClientRect();
    let top, left;
    top = rect.top + rect.height / 2 - popup.offsetHeight / 2;
    left = rect.left - 350;
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    document.body.appendChild(popup);
    // Add a button to close the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cancel';
    closeButton.style.marginRight = '40px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
      setTutorialActive(false);
      setCurrentStep(0);
      popup.remove();
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    popup.appendChild(closeButton);
  };
  const showTutorial = (step) => {
    const targetElement = document.querySelector(step.target);
    const popup = document.createElement('div');
    popup.classList.add('tutorial-popup', step.placement);
    popup.textContent = step.content;
    targetElement.style.boxShadow = '0px 0px 10px 0px rgba(0,0,0,0.75)';
    targetElement.style.border = '3px solid navy';
    // Position the popup based on the target element and placement
    const rect = targetElement.getBoundingClientRect();
    let top, left;
    if (step.placement === 'top') {
      top = rect.top - popup.offsetHeight;
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'bottom') {
      top = rect.bottom + 10;
      left = rect.left + rect.width / 2 - popup.offsetWidth / 2;
    } else if (step.placement === 'left') {
      top = rect.top + rect.height / 2 - popup.offsetHeight / 2;
      left = rect.left - 350;
    } else if (step.placement === 'right') {
      top = rect.top;
      left = rect.right;
    }
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    document.body.appendChild(popup);
    // Add a button to close the popup
    const closeButton = document.createElement('button');
    closeButton.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Skip Tutorial';
    closeButton.style.marginRight = '40px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.borderRadius = '5px';
    closeButton.addEventListener('click', () => {
      setTutorialActive(false);
      setCurrentStep(0);
      popup.remove();
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
      showTutorial2();
    });
    popup.appendChild(closeButton);
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.style.padding = '5px 10px';
    previousButton.style.marginRight = '5px';
    previousButton.style.borderRadius = '5px';
    previousButton.disabled = currentStep === 0; // Disable if first step
    previousButton.style.backgroundColor = previousButton.disabled ? 'grey' : 'navy';
    previousButton.addEventListener('click', () => {
      popup.remove();
      setCurrentStep(currentStep - 1); // Move to previous step
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.style.padding = '5px 10px';
    nextButton.style.borderRadius = '5px';
    nextButton.disabled = currentStep === steps.length - 1; // Disable if last step
    nextButton.style.backgroundColor = nextButton.disabled ? 'grey' : 'green';
    nextButton.addEventListener('click', () => {
      popup.remove();
      setCurrentStep(currentStep + 1); // Move to next step
      targetElement.style.border = '';
      targetElement.style.boxShadow = '';
    });
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.marginTop = '20px';
    buttons.style.justifyContent = 'space-between';
    buttons.style.width = '100%';
    buttons.appendChild(closeButton);
    const flexEndButtons = document.createElement('div');
    flexEndButtons.style.display = 'flex';
    flexEndButtons.appendChild(previousButton);
    flexEndButtons.appendChild(nextButton);
    buttons.appendChild(flexEndButtons);
    popup.appendChild(buttons); // Insert the buttons after the text
  };
  const handleStartTutorial = () => {
    setTutorialActive(true);
    setCurrentStep(0); // Start from the first step
  };
  useEffect(() => {
    if (tutorialActive && currentStep < steps.length) {
      showTutorial(steps[currentStep]);
    }
  }, [tutorialActive, currentStep]);
  const steps = [
    {
      index: 0,
      target: '.model-button',
      content: 'Click here to create a new model of two types: time series or epidemiology.',
      placement: 'right',
    },
    {
      index: 1,
      target: '.existing-button',
      content: 'Click here to view and edit existing models.',
      placement: 'right',
    },
    {
      index: 2,
      target: '.submission-template',
      content: 'Click here to track submitted models.',
      placement: 'right',
    },
    {
      index: 3,
      target: '.report-button',
      content: 'Click here to create a standard report, data consolidation, or scenario/model comparison.',
      placement: 'left',
    },
    {
      index: 4,
      target: '.admin-button',
      content: 'Click here to access admin-level information.',
      placement: 'left',
    },
    {
      index: 5,
      target: '.table-button',
      content: 'These tabs contain your recent files, pinned files, and files recently shared with you.',
      placement: 'top',
    }
  ];
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) {
        setTutorialActive(true);  // Start the tutorial
      }
    }, 1000); // Start after 1 seconds

    return () => {
      clearTimeout(timer);
      isMounted = false;
    }; // Cleanup the timer

  }, []);
  return (
    <>
      <Box>
        <Box mt={8} display="flex" justifyContent="center" alignItems="center">
          <Button
            className='tutorial-btn'
            variant="contained"
            size='small'
            sx={{ color: 'white', position: 'absolute', right: 0, cursor: 'pointer', mt: -18, mr: 3 }}
            onClick={() => handleStartTutorial()}
          >
            Show Tutorial
          </Button>
          <h3>Welcome User, Please Select an Action to Proceed</h3>
        </Box>
        <Box
          mt={-5}
          sx={{
            padding: 3,
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2,
          }}
        >
          {[
            {
              className: "model-button",
              color: 'linear-gradient(135deg, #00c6ff, #0072ff)',
              title: 'New Model',
              description: 'Create a new model based on market data and trends.',
              icon: <Assessment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/new-model',
            },
            {
              className: "existing-button",
              color: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
              title: 'Existing Models',
              description: 'Access and manage your previously saved models.',
              icon: <SaveAlt sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/saved-scenario',
            },
            {
              className: "submission-template",
              color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
              title: 'Submissions Tracker',
              description: 'Track the status of all submitted forecast models.',
              icon: <QueryStats sx={{ fontSize: 50, color: 'black', margin: '20px' }} />,
              path: '/submissions-tracker',
            },
            {
              className: "report-button",
              color: 'linear-gradient(135deg, #36d1dc, #5b86e5)',
              title: 'Generate Report',
              description: 'Generate detailed reports based on your forecast scenarios.',
              icon: <Assignment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/generate-report',
            },
            {
              className: "admin-button",
              color: 'linear-gradient(135deg, #f857a6, #ff5858)',
              title: 'Admin',
              description: 'Manage and secure forecast models with admin privileges.',
              icon: <Security sx={{ fontSize: 50, color: 'white', margin: '20px' }} />,
              path: '/admin',
            },
          ].map((item, index) => (
            <Box
              key={index}
              className={item.className}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  maxWidth: 280,
                  background: item.color,
                  color: 'white',
                }}
                className="featureCard"
              >
                <CardActionArea
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography gutterBottom variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <div className="tooltipAbove">{item.description}</div>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs className="table-button" value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Recent" {...a11yProps(0)} />
            <Tab label="Pinned" {...a11yProps(1)} />
            <Tab label="Shared with me" {...a11yProps(2)} />
          </Tabs>
        </Box>
      </Box>
      {(
        <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
          <Table aria-label="submission scenarios table" size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                {/* Scenario Name */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Scenario Name</TableCell>
                {/* Forecast Cycle */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Forecast Cycle</TableCell>
                {/* Country */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Country</TableCell>
                {/* Therapeutic Area */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Therapeutic Area</TableCell>
                {/* Last Modified Date */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Last Modified</TableCell>
                {/* Submitted by */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '10px', textAlign: 'center' }}>Submitted by</TableCell>
                {/* Actions */}
              </TableRow>
            </TableHead>
            <TableBody>
              {(value === 2 ? demo_data2 : demo_data).map((row, index) => (
                <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#e5f1fb' : 'white' }}>
                  {/* Scenario Name */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.scenario}</TableCell>
                  {/* Forecast Cycle */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.cycle}</TableCell>
                  {/* Country */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.country}</TableCell>
                  {/* Therapeutic Area */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.area}</TableCell>
                  {/* Last Modified Date */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{row.modified}</TableCell>
                  {/* Submitted by */}
                  <TableCell align="center" sx={{ minWidth: '150px' }}>{value === 0 ? "john Doe" : value === 1 ? "john Doe" : "Michel"}</TableCell>
                  {/* Actions */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

    </>
  );
};
export default Body;
