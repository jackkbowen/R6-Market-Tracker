from datetime import datetime, timezone, timedelta
import time
import pandas as pd
import pymongo
from pymongo import MongoClient, UpdateOne
import json

# Takes Unix Epoch time and converts it to YYYY-MM-DD HH:MM:SS format
# EX epoch time reads: 1728453696.814635
def convertUnixTimeToDateTime(unixTime):
    return [[sold, datetime.fromtimestamp(timestamp, timezone(timedelta(hours=-7))).strftime('%Y-%m-%d %H:%M:%S')] for sold, timestamp in unixTime]


# raw data 
# itemID is the unique identifier for each item
# name string
# type string
# tags list of strings
# asset_url string
# sold list[price, time]
# data list[minBuyer, maxBuyer, numBuyers, minSeller, maxSeller, numSellers]

# Load data from the data dump JSON file
with open('../backend/app/scripts/assets/data.json', 'r') as dataFile:
    data = json.load(dataFile)

# Creating a DataFrame from the data
df = pd.DataFrame.from_dict(data, orient='index')

# Adding the keys (which are the IDs) as a column in the DataFrame
df['id'] = df.index

# Now you can access the list of IDs
ids_list = df['id'].tolist()

# Extracting the names of the items
names_list = df['name'].tolist()
sold_list = df['sold'].tolist()

# Calling convertUnixTimeToDateTime helper function
# Itterates through the sold list and converts the Unix time to a readable format (YYYY-MM-DD HH:MM:SS)
convertedSoldList = [convertUnixTimeToDateTime(sold) for sold in sold_list]

# Adding the converted sold list to the DataFrame
df['sold'] = convertedSoldList

print(df['sold'])


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