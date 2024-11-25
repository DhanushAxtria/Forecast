def log_linear_regression(data, historyFromDate, historyToDate, selectedFromDate, selectedToDate):
    import numpy as np
    import pandas as pd
    from sklearn.linear_model import LinearRegression
    from datetime import datetime
 
    # Initialize the Linear Regression model
    model = LinearRegression()
    forecast_res = {}
    selected_data = {}
    dates = [historyFromDate, historyToDate, selectedFromDate, selectedToDate]
    parsed_dates = []
 
    # Parsing the dates to a more consistent format (MMM-YY)
    for date in dates:
        if date is not None:
            parsed_dates.append(date[4:7] + '-' + date[13:15])
 
    # Standardize date format
    std_dts = []
    for i in data[0]:
        std_dts.append(standardize_date(i))
    data[0] = std_dts
 
    # Get the index of historical start and end dates
    historyFromDateIndex = data[0].index(parsed_dates[0])
    historyToDateIndex = data[0].index(parsed_dates[1])
 
    # Convert the data to a pandas DataFrame and slice based on date indices
    data = pd.DataFrame(data[1:], columns=data[0])
    data = data.iloc[:, historyFromDateIndex:historyToDateIndex + 1]
   
    # Create a column for months (as integers)
    months = np.array(range(1, len(data.columns) + 1)).reshape(-1, 1)
 
    # Parse the dates and calculate indices for forecasting
    date_format = "%b-%y"
    d1 = datetime.strptime(parsed_dates[0], date_format)
    d2 = datetime.strptime(parsed_dates[2], date_format)
    first_idx = (d2.year - d1.year) * 12 + d2.month - d1.month + 1
    d3 = datetime.strptime(parsed_dates[2], date_format)
    d4 = datetime.strptime(parsed_dates[3], date_format)
    last_idx = (d4.year - d3.year) * 12 + d4.month - d3.month + 1
    future_months = np.arange(first_idx, first_idx + last_idx).reshape(-1, 1)
 
    # Generate the months for the forecast period
    start = pd.to_datetime(parsed_dates[2], format='%b-%y')
    end = pd.to_datetime(parsed_dates[3], format='%b-%y')
    date_range = pd.date_range(start=start, end=end, freq='MS')
    col_months = date_range.strftime('%b-%y').tolist()
    forecast_res["months"] = col_months
 
    # Get the historical months between the selected date range
    selected_data["months"] = get_months_between_dates(parsed_dates[0], parsed_dates[1])
 
    # Loop through each row of the historical data and apply log-linear regression
    for index, row in data.iterrows():
        y = row.values
 
        # Convert the data in 'y' to float (if it's not already numeric)
        try:
            y = np.array([float(val) for val in y])  # Convert to numeric
        except ValueError:
            print(f"Non-numeric values found in data for {index}, skipping this row.")
            continue  # Skip this row if conversion fails
 
        # Apply log transformation to the target variable
        log_y = np.log(y)  # Log-transform the target values
 
        # Fit the model to the months and log-transformed y values
        model.fit(months, log_y)
 
        # Make predictions for the future months (on the log scale)
        forecast_log = model.predict(future_months)
 
        # Inverse log transformation to get the forecasted values back to the original scale
        forecast = np.exp(forecast_log)
 
        # Store the forecasted and original data
        forecast_res[index] = list(forecast)
        selected_data[index] = list(map(float, y))  # Store the original values as well
 
    return forecast_res, selected_data
 
 
# The standardize_date function and get_months_between_dates function remain the same as in your original code
def standardize_date(date_string):
    from dateutil.parser import parse
    try:
        # Check if the date is in MMM-YY format (like Nov-23)
        if len(date_string.split('-')) == 2 and len(date_string.split('-')[1]) == 2 and len(date_string.split('-')[0]) == 3:
            return date_string
        else:
            # If it's a full date, use the standard date parsing
            parsed_date = parse(date_string)
            return parsed_date.strftime("%b-%y")  # Output format: Nov-23
    except:
        return date_string
 
 
def get_months_between_dates(start_date_str, end_date_str):
    from datetime import datetime
    from dateutil.relativedelta import relativedelta
    # Define the format of the input dates
    date_format = "%b-%y"
   
    # Parse the start and end dates
    start_date = datetime.strptime(start_date_str, date_format)
    end_date = datetime.strptime(end_date_str, date_format)
   
    # List to store the months between the dates
    months_list = []
   
    # Loop through the months between the start and end date
    current_date = start_date
    while current_date <= end_date:
        months_list.append(current_date.strftime(date_format))  # Add the current month to the list
        current_date += relativedelta(months=1)  # Move to the next month
   
    return months_list