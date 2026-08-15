import os
import zipfile

# 1. Set the Kaggle dataset identifier
dataset_name = "devang03mgr/cattle-diseases-datasets"
download_path = "dataset_livestock"

# 2. Make sure the directory exists
os.makedirs(download_path, exist_ok=True)

print(f"Downloading {dataset_name} from Kaggle...")

# 3. Use the Kaggle CLI via Python to download
os.system(f"kaggle datasets download -d {dataset_name} -p {download_path}")

# 4. Unzip the downloaded file
zip_file_path = f"{download_path}/cattle-diseases-datasets.zip"

if os.path.exists(zip_file_path):
    print("Extracting images...")
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(download_path)
    
    # Clean up the zip file to save space
    os.remove(zip_file_path)
    print("Extraction complete! Your real dataset is ready.")
else:
    print("Error: Zip file not found. Check your kaggle.json API configuration.")
    