import pandas as pd
import os

file_path = "datasets/raw/medquad.csv"

try:
    print(f"Reading {file_path} with latin-1...")
    df = pd.read_csv(file_path, encoding='latin-1')
    print(f"Success! Shape: {df.shape}")
    print(df.head(1))
except Exception as e:
    print(f"Failed: {e}")
    import traceback
    traceback.print_exc()
