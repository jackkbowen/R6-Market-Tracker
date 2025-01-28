import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import datetime as dt
import json

# Load data from the data dump JSON file
with open("./assets/local.marketplaceitems.json", 'r') as dataFile:
    data = json.load(dataFile)

# Creating a DataFrame from the data
df = pd.DataFrame(data)
df.dropna(inplace=True)

soldData = [df['sold']]

print (soldData)
