import os 
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import json
from matplotlib.dates import date2num
from pymongo import UpdateOne, MongoClient
import pymongo
from io import BytesIO
import gridfs

# MongoDB setup
client = MongoClient("mongodb+srv://admin:admin@peripha.uidveld.mongodb.net/R6Market?retryWrites=true&w=majority")  # Update with the correct connection string
db = client['R6Market']  # Update with your DB name
collection = db['marketplaceItems   ']  # Update with your collection name
fs = gridfs.GridFS(db)

# Load data from the data dump JSON file
with open("../backend/app/scripts/assets/local.marketplaceitems.json", 'r') as dataFile:
    data = json.load(dataFile)

# Create a dictionary to store prices and dates for each item
item_sales_data = {}

# Loop through the data to extract prices and dates
for item in data:
    item_id = item.get("id")
    item_name = item.get("name")
    sold_data = item.get("sold", [])

    # Extract prices and dates
    prices_dates = [(entry[0], entry[1][:10]) for entry in sold_data]
    item_sales_data[item_id] = prices_dates

# List to store bulk update operations
bulk_operations = []

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
    plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=5))
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))

    # Format the grid and adding labels
    plt.title(f"Averaged Sales Trends for Item ID: {item_id}")
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.legend()
    plt.xticks(rotation=45)
    plt.grid(True)
    plt.tight_layout()

    # Save plot to an in-memory buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png')
    plt.close()
    buffer.seek(0)

    # Store the image in GridFS and get the file ID
    file_id = fs.put(buffer, filename=f"graph_{item_id}.png")

    # Append the bulk update operation for MongoDB
    bulk_operations.append(
        UpdateOne(
            {'itemID': item_id},
            {
                '$set': {'graphImageFileID': file_id},
                '$addToSet': {'sold': {'$each': [list(entry) for entry in sales]}}
            },
            upsert=True
        )
    )

# Execute bulk operations
try:
    if bulk_operations:
        collection.bulk_write(bulk_operations)
        print("Database successfully updated with graph images stored in GridFS.")
except pymongo.errors.BulkWriteError as e:
    print("Bulk write error:", e.details)
