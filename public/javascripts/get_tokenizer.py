import pickle
import json

from keras.preprocessing.text import Tokenizer

with open("tokenizer.pickle", "rb") as tk_file:
	tokenizer = pickle.load(tk_file)

with open("tokenized.json", "w") as tk_out:
	json.dump(tokenizer.word_index, tk_out)