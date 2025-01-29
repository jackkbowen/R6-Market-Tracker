import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import json
from matplotlib.dates import date2num

# Load data from the data dump JSON file
with open("./assets/local.marketplaceitems.json", 'r') as dataFile:
    data = json.load(dataFile)

# Ensure the output folder exists
output_folder = "./assets/graphs"
os.makedirs(output_folder, exist_ok=True)

# Create a dictionary to store prices and dates for each item
item_sales_data = {}

for item in data:
    item_id = item.get("id")
    item_name = item.get("name")
    sold_data = item.get("sold", [])
    
    # Extract prices and dates
    prices_dates = [(entry[0], entry[1][:10]) for entry in sold_data]
    item_sales_data[item_id] = prices_dates

# Plot and save separate graphs for each item
for item_id, sales in item_sales_data.items():
    if not sales:
        continue

    # Create a DataFrame to handle grouping and averaging
    df_sales = pd.DataFrame(sales, columns=["price", "date"])
    df_sales["date"] = pd.to_datetime(df_sales["date"])

    # Average prices for each valid day
    df_avg_sales = df_sales.groupby("date", as_index=False)["price"].mean()

    # Convert dates to numeric format only for regression
    numeric_dates = date2num(df_avg_sales["date"])

    # Perform regression
    reg = np.polyfit(numeric_dates, df_avg_sales["price"], 1)
    trend = np.poly1d(reg)

    # Plot the results using datetime objects
    plt.figure(figsize=(14, 7))
    plt.plot(df_avg_sales["date"], df_avg_sales["price"], marker='o', label=f"Item Name: {item_name}")
    plt.plot(df_avg_sales["date"], trend(numeric_dates), label="Trend Line", color='red')

    # Format x-axis ticks and labels
    plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=10))
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))

    plt.title(f"Averaged Sales Trends for Item ID: {item_id}")
    plt.xlabel("Date")
    plt.ylabel("Average Price")
    plt.legend()
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.tight_layout()

    # Save plot to the folder
    plot_path = os.path.join(output_folder, f"{item_id}.png")
    plt.savefig(plot_path)
    plt.close()

print(f"All plots have been saved in {output_folder}")
