import json
import os

def split_json_list(input_filename, chunk_size=1500):
    try:
        # 1. Load the original JSON file
        with open(input_filename, 'r') as f:
            data = json.load(f)
        
        # Check if the data is actually a list
        if not isinstance(data, list):
            print("Error: The JSON file does not contain a list.")
            return

        # 2. Split the list into chunks
        total_items = len(data)
        for i in range(0, total_items, chunk_size):
            chunk = data[i : i + chunk_size]
            
            # Create a filename for the chunk (e.g., data_part_1.json)
            part_number = (i // chunk_size) + 1
            output_filename = f"split_{part_number}.json"
            
            # 3. Save the chunk to a new file
            with open(output_filename, 'w') as out_f:
                json.dump(chunk, out_f, indent=4)
            
            print(f"Saved {len(chunk)} items to {output_filename}")

    except FileNotFoundError:
        print(f"Error: The file '{input_filename}' was not found.")
    except json.JSONDecodeError:
        print("Error: Failed to decode JSON. Check if the file format is correct.")

# Usage
split_json_list('links.json', 1500)