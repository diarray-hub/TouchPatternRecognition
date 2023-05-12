# Training data

Files on here are created with pickle.
The stats_summary.data contains serialized bytes streams representing data in a ready to fit in the network
Loading this file in a variable using pickle.load will results in a tuple containing two numpy ndarrays the first contains training input and the second the corresponding labels.
This file has been created by the preprocessing.py script. 