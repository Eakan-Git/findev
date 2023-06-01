import pandas as pd

df = pd.read_csv('jobs_data.csv')
df.drop_duplicates().to_csv("jobs_data.csv", index=False)
df = pd.read_csv('companies_data.csv')
df.drop_duplicates().to_csv("companies_data.csv", index=False)