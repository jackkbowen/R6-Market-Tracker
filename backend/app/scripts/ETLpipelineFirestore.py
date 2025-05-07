from datetime import datetime, timezone, timedelta
import pandas as pd
import json
import re
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
print("Initializing Firebase...")
cred = credentials.Certificate("/creds/r6-marketplace-c6975-firebase-adminsdk-fbsvc-6d8967a8c2.json")  # Path to your Firebase service key
firebase_admin.initialize_app(cred)
db = firestore.client()

# Convert Unix time to readable datetime format
def convertUnixTimeToDateTime(unixTime):
    return [[sold, datetime.fromtimestamp(timestamp, timezone(timedelta(hours=-7))).strftime('%Y-%m-%d %H:%M:%S')] for sold, timestamp in unixTime]

# Extract Y#S# season code
def extract_season_code(df):
    pattern = r"Y\d+S\d+"
    matches = [item for sublist in df["tags"] for item in sublist if re.match(pattern, item)]
    matches.append("N/A")
    return matches

# Extract Supply and Demand
def extract_Supply(df):  
    return [row[2] for row in df["data"]]

def extract_Demand(df):  
    return [row[5] for row in df["data"]]

# Extract average sold price
def extract_Price(df):
    avgPrice = []
    for data in df["sold"]:
        saleValues = [soldData[0] for soldData in data]
        averageSold = round(sum(saleValues) / len(saleValues)) if saleValues else 0
        avgPrice.append(averageSold)
    return avgPrice

# Helper to merge and deduplicate 'sold' lists
def merge_sold(existing, new):
    combined = existing + new
    unique = list({tuple(s) for s in combined})
    return sorted(unique, key=lambda x: x[1])

print("Open JSON file")
# Load the raw JSON data
with open("/assets/data.json", 'r') as dataFile:
    data = json.load(dataFile)

# Create DataFrame
df = pd.DataFrame.from_dict(data, orient='index')
df['id'] = df.index

# Convert Unix timestamps
df['sold'] = [convertUnixTimeToDateTime(sold) for sold in df['sold'].tolist()]

# Enrich DataFrame
df.insert(2, "Season", extract_season_code(df), True)
df.insert(3, "Supply", extract_Supply(df), True)
df.insert(4, "Demand", extract_Demand(df), True)
df.insert(5, "AverageSold", extract_Price(df), True)

# Filter out any NaN ids
df = df[df['id'].notna()]

print("Push data to firestore")
# Push data to Firestore
for record in df.to_dict('records'):
    item_id = record['id']
    new_sold = record.get('sold', [])

    doc_ref = db.collection('marketplaceItems').document(item_id)
    doc = doc_ref.get()

    if doc.exists:
        existing_data = doc.to_dict()
        existing_sold = existing_data.get('sold', [])
        combined_sold = merge_sold(existing_sold, new_sold)

        data_to_update = {k: v for k, v in record.items() if k != 'sold'}
        data_to_update['sold'] = combined_sold
        doc_ref.set(data_to_update)
    else:
        doc_ref.set(record)

print("Market Data has been added to Firebase Firestore successfully.")
