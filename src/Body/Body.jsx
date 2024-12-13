import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
// Import the useNavigate hook from react-router-dom to handle client-side routing
import { useNavigate } from 'react-router-dom';
import "./Body.scss";
 
// Import new icons from Material UI
import { Assessment, SaveAlt, FilePresent, CompareArrows, Insights, Security, QueryStats, Assignment } from '@mui/icons-material';
 


/*
 * BlogGrid component renders a grid layout with various interactive cards.
 * Each card represents a specific action, such as creating a new scenario,
 * accessing saved scenarios, or managing admin tasks. It uses Material UI
 * components to display the cards with icons, titles, and descriptions.
 * The component also handles navigation to different routes based on the card clicked by the user.
 */
const BlogGrid = () => {
  // Use the useNavigate hook to get the navigate function, which is used to redirect the user to a different route when a card is clicked
  const navigate = useNavigate();
  return (
    <div id="bodyDiv" style={{ display: 'flex',alignItems: 'center' }}>
      <div className="container topDiv">
        <div id="mainHeader">
          <div
            className="greeting__container mb-5 pb-5 border-bottom"
            style={{
              backgroundImage: "url('../assets/bg-banner-image.png')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="greeting__welcome f3 mb-3">
              <h3 style={{textWrap: 'nowrap', textAlign: 'center', position: 'absolute', top: '50%', left: '52%', transform: 'translate(-50%, -50%)'}}>
                Welcome User, Please Select an Action to Proceed</h3>
            </div>
          </div>
        </div>
      </div>
      <Box
        sx={{
          // Display as a grid with 4 columns
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          // Add a gap of 2px between grid items
          gap: 2,
          // Add some padding around the grid container
          padding: 2,
          // Position the grid container absolutely
          position: 'absolute',
          // Set the left and top properties to center the grid container horizontally and vertically
          left: '50%',
          top: '70%',
          // Set the transform property to translate the grid container -50% to the left and -50% to the top, effectively centering it
          transform: 'translate(-50%, -50%)'
        }}
        
      >
        {/* Card 1: New Scenario */}
       
        <div className="hoverCard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #00c6ff, #0072ff)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }} onClick={() => navigate("/new-scenario")}>
              {/* Icon for New Scenario */}
              <Assessment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                {/* Title for New Scenario */}
                <Typography gutterBottom variant="h6" component="div">
                  New Scenario
                </Typography>
                {/* Description for New Scenario */}
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Create a new forecast scenario
                  based on market data and trends.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          {/* additional information displayed when we hover over the card */}
          <div className="tooltipAbove">Create a new forecast scenario based on market data and trends.</div>
        </div>

        {/* Created card with similar styling with different title and description */}
 
        {/* Card 2: Saved Scenarios */}
        <div className="hoverCard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #ff758c, #ff7eb3)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }}onClick={()=>navigate("/saved-scenario")}>
              <SaveAlt sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Saved Scenarios
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Access and manage your previously saved forecast scenarios.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Access and manage your previously saved forecast scenarios.</div>
        </div>
 
        {/* Card 3: Data Consolidation */}
        <div className="hoverCard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #ffafbd, #ffc3a0)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }} onClick={()=>navigate("/data-consolidation")}>
              <FilePresent sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Data Consolidation
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Submit finalized forecast scenarios for review and approval.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Submit finalized forecast scenarios for review and approval.</div>
        </div>
 
        {/* Card 4: Scenario Comparison */}
        <div className="hoverCard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #a1ffce, #faffd1)', color: 'black' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer'}} onClick={()=>navigate("/scenario-comparsion")}>
              <CompareArrows sx={{ fontSize: 50, color: 'black', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Scenario Comparison
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Compare different forecast scenarios to find optimal solutions.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Compare different forecast scenarios to find optimal solutions.</div>
        </div>
 
        {/* Card 5: Forecast Deep-dive */}
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }} onClick={()=>navigate("/time-series-methods")}>
              <Insights sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Time Series Methods
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Dive into the time series forecasting techniques to uncover key insights.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Dive deeper into your forecast results to uncover key insights.</div>
        </div>
 
        {/* Card 6: Admin */}
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #f857a6, #ff5858)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer'}} onClick={()=>navigate("/admin")}>
              <Security sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Admin
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Manage and secure forecast models with admin privileges.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Manage and secure forecast models with admin privileges.</div>
        </div>
 
        {/* Card 7: Generate Report */}
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #36d1dc, #5b86e5)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }} onClick={() => navigate("/generate-report")}>
              <Assignment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Generate Report
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Generate detailed reports based on your forecast scenarios.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Generate detailed reports based on your forecast scenarios.</div>
        </div>
 
        {/* Card 8: Submissions Tracker */}
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #ff9a9e, #fecfef)', color: 'black' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }} onClick={() => navigate("/submissions-tracker")}>
              <QueryStats sx={{ fontSize: 50, color: 'black', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Submissions Tracker
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Track the status of all submitted forecast scenarios.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Track the status of all submitted forecast scenarios.</div>
        </div>
      </Box>
    </div>
  );
};
 
export default BlogGrid;