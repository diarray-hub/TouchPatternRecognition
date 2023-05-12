import json
import numpy as np
import glob
import pickle

def stats_summary(paths: list[str], label: int = None):
    """
    In machine learning field data are the most important aspect. 
    Data quality, quantity or/and the way they are represented can be crucial for the performance of the model.
    This function implement one method we will use to represent data during the training.
    The method consist in calculating summary statistics for each of the data fields, such as mean, standard deviation, minimum, maximum, and range. 
    For example, calculate the mean and standard deviation of the position, speed, and direction data for each touch tracking event, 
    and use these summary statistics as featuress for the machine learning model.

    Args:
        paths (list[str]): A list containing paths to all files to process
        label (int, optional): An integer 0 or 1 representing whether data is from the User or Others. 
            Defaults to None, In this way we can use this function to process prediction data
    """
    assert label in [None, 0, 1], "Label is either 0 or 1" # Check label value since we are going to perform binary classification
    training_dataset = []
    for dataset in paths:
        with open(dataset) as file:
            data = json.load(file) # Load the .json files where Brute data are stored
        del data["screenSize"], data["screenScale"], data["name"]
        for touch in data["touchTrackings"]:
            positionsX = [position[0] for position in touch["positions"]]
            positionsY = [position[1] for position in touch["positions"]]
            speeds = touch["speeds"] if len(touch["speeds"]) > 0 else [0]
            directions = touch["directions"] if len(touch["directions"]) > 0 else [0]
            timeElapsed = touch["endTimestamp"] - touch["startTimestamp"]
            fields = [positionsX, positionsY, speeds, directions] # Isolate fields from which we'll extract features to compose training data
            # Computing features.
            # np.mean() and np.std() methods return the mean and standard deviation of each field and max - min gives the range
            features = [[np.mean(a=field), np.std(a=field), min(field), max(field), max(field) - min(field)] for field in fields]
            features = [feature for feature_list in features for feature in feature_list] # All features in the same list
            features.append(timeElapsed)
            training_dataset.append(features)
    if label == None: return np.array(training_dataset)
    elif label: return (np.array(training_dataset), np.ones(len(training_dataset)))
    return (np.array(training_dataset), np.zeros(len(training_dataset)))


if __name__ == "__main__":
    usersdata = glob.glob("../../Brute_data/User/*")
    othersdata = glob.glob("../../Brute_data/Others/*")
    usersdata = stats_summary(paths=usersdata, label=1)
    othersdata = stats_summary(paths=othersdata, label=0)
    training_data = (np.concatenate((usersdata[0], othersdata[0])), np.concatenate((usersdata[1], othersdata[1])))
    with open('../../Training_data/stats_summary.data', 'wb') as file:
        pickle.dump(training_data, file)
    print("Data saved in Training_data directory")