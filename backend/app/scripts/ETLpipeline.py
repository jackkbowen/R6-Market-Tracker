from datetime import datetime, timezone, timedelta
import time
import pandas as pd
import pymongo
from pymongo import MongoClient, UpdateOne
import json
import re

# Takes Unix Epoch time and converts it to YYYY-MM-DD HH:MM:SS format
# EX epoch time reads: 1728453696.814635
def convertUnixTimeToDateTime(unixTime):
    return [[sold, datetime.fromtimestamp(timestamp, timezone(timedelta(hours=-7))).strftime('%Y-%m-%d %H:%M:%S')] for sold, timestamp in unixTime]

# Extract the Y#S# season code from the tags
def extract_season_code(df):
    # Define the regex pattern
    pattern = r"Y\d+S\d+"

    # Filter the list for entries that match the regex
    matches = [item for sublist in df["tags"] for item in sublist if re.match(pattern, item)]
    matches.append("N/A")
         
    return matches

# Extract the Supply data from the tags
def extract_Supply(df):  
    Supply = []

    for row in df["data"]:
        Supply.append(row[2])

    return Supply

# Extract the Demand data from the tags
def extract_Demand(df):  
    Demand = []

    for row in df["data"]:
        Demand.append(row[5])

    return Demand

# Extract the average price from the sold data
def extract_Price(df):
    Price = []
    avgPrice = []
    averageSold = 0

    for data in df["sold"]:
        saleValues = [soldData[0] for soldData in data]
       
        # Compute average price   
        avg = sum(saleValues) / len(saleValues)
        averageSold = round(avg)

        avgPrice.append(averageSold)


    return avgPrice

# raw data 
# itemID is the unique identifier for each item
# name string
# type string
# tags list of strings
# asset_url string
# sold list[price, time]
# data list[minBuyer, maxBuyer, numBuyers, minSeller, maxSeller, numSellers]

# Load data from the data dump JSON file
with open("../backend/app/scripts/assets/data.json", 'r') as dataFile:
    data = json.load(dataFile)

# Creating a DataFrame from the data
df = pd.DataFrame.from_dict(data, orient='index')

# Adding the keys (which are the IDs) as a column in the DataFrame
df['id'] = df.index

# Now you can access the list of IDs
ids_list = df['id'].tolist()

# Extracting the names and sales data of the items
names_list = df['name'].tolist()
sold_list = df['sold'].tolist()

# Calling convertUnixTimeToDateTime helper function
# Itterates through the sold list and converts the Unix time to a readable format (YYYY-MM-DD HH:MM:SS)
convertedSoldList = [convertUnixTimeToDateTime(sold) for sold in sold_list]

# Adding the converted sold list to the DataFrame
df['sold'] = convertedSoldList


# Adding a column for the extracted season data from the tags
filteredSeason = extract_season_code(df)

# Adding a column for the extracted supply data from the tags
filteredSupply = extract_Supply(df)

# Adding a column for the extracted demand data from the tags
filteredDemand = extract_Demand(df)

# Adding a column for the extracted demand data from the tags
averageSold = extract_Price(df)



# Item Button Endpoints
# Inserting the new columns into the DataFrame

df.insert(2, "Season", filteredSeason, True)

df.insert(3, "Supply", filteredSupply, True)

df.insert(4, "Demand", filteredDemand, True)

df.insert(5, "AverageSold", averageSold, True)

df = df[df['id'].notna()]

#print(df['sold'])


# Connect to MongoDB 
client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB connection string

# Database and collection for the insert operation
db = client['local'] 
collection = db['marketplaceItems'] 

# Need to clean up the data before inserting into the database
# Work on this on future TODO

# Execute bulk_write to update or insert the documents
# Match the document by the unique identifier 'id'
# Update all fields except 'sold'
# Append new sold data without duplicates using $addToSet and $each
# Insert if the document doesn't exist

collection.bulk_write([
    UpdateOne(
        {'id': record['id']},                                                        
        {
            '$set': {key: value for key, value in record.items() if key != 'sold'}, 
            '$addToSet': {'sold': {'$each': record['sold']}}                        
        },
        upsert=True                                                  
    )
    for record in df.to_dict('records')
])

print("Market Data has been added to the Database successfully.")
