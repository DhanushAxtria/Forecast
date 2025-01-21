import React from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, CardActions, Button, Box } from '@mui/material';
import { Timeline, HealthAndSafety } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './NewModel.css';

const NewModel = () => {
    const navigate = useNavigate();
    const models = [
        {
            title: 'Time Series Model',
            description: 'Analyze trends over time and forecast future outcomes.',
            icon: <Timeline sx={{ fontSize: 50, color: '#4caf50' }} />,
            path: "/new-model/time-series-model",
        },
        {
            title: 'Epidemiology Model',
            description: 'Model the spread and impact of diseases.',
            icon: <HealthAndSafety sx={{ fontSize: 50, color: '#ff5722' }} />,
            path: "/new-model/epidemiology-model",
        },
    ];

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#333', fontWeight: 'bold', marginBottom: 3 }}>
                Choose a Model Type
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                {models.map((model, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(158, 35, 35, 0.1)',
                                bgcolor: '#cfffe5', // Changed color for cards
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform 0.3s ease-in-out',
                                },
                            }}
                        >
                            <CardActionArea>
                                <div className='circleOne'></div>
                                
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 3,
                                    }}
                                >
                                    {model.icon}
                                </Box>
                                <CardContent>
                                    <Typography variant="h6" component="div" align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                                        {model.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        align="center"
                                        sx={{ marginTop: 1, fontSize: '14px' }}
                                    >
                                        {model.description}
                                    </Typography>
                                </CardContent>
                                <div className='circleTwo'></div>
                            </CardActionArea>
                            <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
                                <Button
                                    onClick={() => navigate(model.path)}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        paddingX: 3,
                                    }}
                                >
                                    Create
                                </Button>
                                
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NewModel;

