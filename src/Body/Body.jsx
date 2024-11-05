import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import "./Body.scss";

// Import new icons from Material UI
import { Assessment, SaveAlt, FilePresent, CompareArrows, Insights, Security, QueryStats, Assignment } from '@mui/icons-material'; 

const BlogGrid = () => {
  const navigate = useNavigate();
  return (
    <div id="bodyDiv" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', marginTop: '-30px',paddingLeft:'80px' }}>
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
              <h3>Welcome User, Please Select an Action to Proceed</h3>
            </div>
          </div>
        </div>
      </div>
      <Box
        sx={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns
          gap: 2, // space between cards
          padding: 2,
          justifyContent: 'center', // Aligns the cards to the left
          alignItems:'center',
          marginLeft:'-30px'
        }}
      >
        {/* Card 1: New Scenario */}
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #00c6ff, #0072ff)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }} onClick={()=>navigate("/new-scenario")}>
              <Assessment sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  New Scenario
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Create a new forecast scenario based on market data and trends.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <div className="tooltipAbove">Create a new forecast scenario based on market data and trends.</div>
        </div>

        {/* Card 2: Saved Scenarios */}
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #ff758c, #ff7eb3)', color: 'white' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer' }}>
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
        <div className="hoverCard">
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
        <div className="hoverCard">
          <Card
            sx={{ width: 280, background: 'linear-gradient(135deg, #a1ffce, #faffd1)', color: 'black' }}
            className='featureCard'
          >
            <CardActionArea sx={{ cursor: 'pointer'}} onClick={()=>{window.open("/scenario-comparsion",  '_blank')}}>
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
            <CardActionArea sx={{ cursor: 'pointer' }}>
              <Insights sx={{ fontSize: 50, color: 'white', margin: '20px' }} />
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography gutterBottom variant="h6" component="div">
                  Forecast Deep-dive
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'text.secondary', textAlign: 'center', fontSize: '14px' }}  // Changed font size here
                >
                  Dive deeper into your forecast results to uncover key insights.
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
