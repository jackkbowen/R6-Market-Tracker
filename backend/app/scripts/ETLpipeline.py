import pandas as pd
import json

# Load data from the data dump file
# itemID is the unique identifier for each item
# name string
# type string
# tags list of strings
# asset_url string
# sold list[price, time]
# data list[minBuyer, maxBuyer, numBuyer, minSeller, maxSeller, numSeller]
with open('assets/tests.json', 'r') as dataFile:
    data = json.load(dataFile)

df = pd.DataFrame.from_dict(data)
print (df)