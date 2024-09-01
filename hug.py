#!pip install --upgrade huggingface_hub

#!pip install datasets

from huggingface_hub import login
login(token="*******")

from datasets import load_dataset

ds = load_dataset("alibayram/turkish_mmlu")

test = ds['train']

# Find all indices where 'bolum' is 'TUS'
tus_indices = [i for i, bolum in enumerate(test['bolum']) if bolum == 'TUS']

# Check if there are any indices found
if tus_indices:
    start_index = tus_indices[0]
    end_index = tus_indices[-1]
    print(f"Start index: {start_index}, End index: {end_index}")
else:
    print("No 'TUS' found in 'bolum' column.")

filtered_dataset = test.filter(lambda x: x['bolum'] == 'TUS')

# Define file names for each column
files = {
    'soru': 'soru.txt',
    'cevap': 'cevap.txt',
    'aciklama': 'aciklama.txt',
    'secenekler': 'secenekler.txt'
}

# Open each file in write mode
with open(files['soru'], 'w', encoding='utf-8') as soru_file, \
     open(files['cevap'], 'w', encoding='utf-8') as cevap_file, \
     open(files['aciklama'], 'w', encoding='utf-8') as aciklama_file, \
     open(files['secenekler'], 'w', encoding='utf-8') as secenekler_file:

    # Initialize a counter for numbering
    counter = 1

    # Iterate through the filtered dataset
    for data in filtered_dataset:
        # Write each column to its respective file with numbering for 'soru' and 'cevap'
        soru_file.write(f"#{counter} {str(data['soru'])}\n")
        cevap_file.write(f"#{counter} {str(data['cevap'])}\n")
        aciklama_file.write(f"#{counter} {str(data['aciklama'])}\n")
        secenekler_file.write(f"#{counter} {str(data['secenekler'])}\n")

        # Increment the counter
        counter += 1

print("Data has been successfully written to separate text files with numbering.")
