// Unicode for Lock and Good to Go icons
const lockIcon = '🔒';
const goodToGoIcon = '✅';

// Sample data for Therapeutic Area, Country, Usernames, and Forecast Cycles
const therapeuticAreas = ['Cardiology', 'Oncology', 'Neurology', 'Immunology', 'Dermatology'];
const regions = ['EU5', 'Nordic Region'];
const countries = {
  'EU5': ['UK', 'Germany', 'France', 'Italy', 'Spain'],
  'Nordic Region': ['Denmark', 'Norway', 'Sweden', 'Finland', 'Iceland'],
};
const forecastCycles = ['2024-H1', '2024-H2', '2025-H1'];
const forecastOptions = {
  '2024-H1': ['Forecast 1', 'Forecast 2'],
  '2024-H2': ['Forecast 3', 'Forecast 4'],
  '2025-H1': ['Forecast 5', 'Forecast 6'],
};
const sampleUsernames = ['john_doe', 'jane_smith', 'michael_wang', 'emma_clark', 'chris_jones'];
export const generateDummyData = () => {
   
    return [
      {
        therapeuticArea: 'Cardiology',
        region: 'EU5',
        country: 'France',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 1',
        forecastStatus: 'goodToGo',
        forecastStarted: '2023-01-15',
        username: 'john_doe',
      },
      {
        therapeuticArea: 'Cardiology',
        region: 'EU5',
        country: 'Germany',
        worksheet: 'Worksheet 1',
        forecast: 'Forecast 2',
        forecastStatus: 'lock',
        forecastStarted: '2023-02-16',
        username: 'jane_smith',
      },
      {
        therapeuticArea: 'Oncology',
        region: 'EU5',
        country: 'Germany',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 2',
        forecastStatus: 'lock',
        forecastStarted: '2023-05-10',
        username: 'jane_smith',
      },
      {
        therapeuticArea: 'Neurology',
        region: 'EU5',
        country: 'Italy',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 3',
        forecastStatus: 'goodToGo',
        forecastStarted: '2023-03-01',
        username: 'michael_wang',
      },
      {
        therapeuticArea: 'Immunology',
        region: 'Nordic Region',
        country: 'Denmark',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 3',
        forecastStatus: 'lock',
        forecastStarted: '2023-04-17',
        username: 'emma_clark',
      },
      {
        therapeuticArea: 'Immunology',
        region: 'Nordic Region',
        country: 'Norway',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 4',
        forecastStatus: 'lock',
        forecastStarted: '2024-09-15',
        username: 'chris_jones',
      },
      {
        therapeuticArea: 'Immunology',
        region: 'Sweden',
        country: 'Denmark',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 4',
        forecastStatus: 'lock',
        forecastStarted: '2024-04-20',
        username: 'michael_wang',
      },
      {
        therapeuticArea: 'Dermatology',
        region: 'EU5',
        country: 'Spain',
        worksheet: 'Output Sheet',
        forecast: 'Forecast 5',
        forecastStatus: 'goodToGo',
        forecastStarted: '2023-06-01',
        username: 'chris_jones',
      },
    ];
  };