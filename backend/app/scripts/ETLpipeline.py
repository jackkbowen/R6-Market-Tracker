from datetime import datetime, timezone
import time
import pandas as pd
import pymongo
from pymongo import MongoClient
import json


# Takes Unix Epoch time and converts it to YYYY-MM-DD HH:MM:SS format
# EX epoch time reads: 1728453696.814635
def convertUnixTimeToDateTime(unixTime):
    return [[sold, datetime.fromtimestamp(timestamp, timezone.utc).strftime('%Y-%m-%d %H:%M:%S')] for sold, timestamp in unixTime]

# Load data from the data dump file
# itemID is the unique identifier for each item
# name string
# type string
# tags list of strings
# asset_url string
# sold list[price, time]
# data list[minBuyer, maxBuyer, numBuyers, minSeller, maxSeller, numSellers]
with open('assets/data.json', 'r') as dataFile:
    data = json.load(dataFile)

df = pd.DataFrame.from_dict(data, orient='index')

# Adding the keys (which are the IDs) as a column in the DataFrame
df['id'] = df.index

# Now you can access the list of IDs
ids_list = df['id'].tolist()

# Print the DataFrame to see the IDs added as a column
# print(df)

# Printing the list of IDs
# print(ids_list)

# Extracting the names of the items
names_list = df['name'].tolist()
sold_list = df['sold'].tolist()

# print(datetime.utcfromtimestamp(sold_list[0][0][1]))
# dateTime = datetime.fromtimestamp(sold_list[0][0][1], timezone.utc)
# print(dateTime.replace(microsecond=0))

convertedSoldList = [convertUnixTimeToDateTime(sold) for sold in sold_list]
# print(convertedSoldList)
df['sold'] = convertedSoldList
print(df['sold'])
# Extracting all the names and their ID
# addiing .tolist() removes the ids
# names_list2 = df_market['name']
# sold_list2 = df_market['sold']
# Output
# 8c4b685c-c5b5-4fcc-9011-d927d769cca3    WICKED RECKONING
# 7636a2cf-b53e-45d5-90e5-441c42442d90      CHROMA STREAKS
# 34c6f416-3404-4925-a5d6-33686b88e6c3      CHROMA STREAKS

# print (names_list)
# print (names_list2)

'''
# Connect to MongoDB 
client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB connection string

# Database and collection for the insert operation
db = client['local'] 
collection = db['marketplaceItems'] 

# Need to clean up the data before inserting into the database
# Work on this on future TODO

collection.insert_many(df_market.to_dict('records'))
'''
