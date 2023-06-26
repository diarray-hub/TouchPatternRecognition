# TouchPatternRecognition

Classifying touch patterns by user, test the approach for authentication!

# Update

One trained model has been successfully integrated to the app using Tensorflow.js. So we are now able to make inference in the browser.<br>
Even if this solution has been tested only with chrome for now. It should work for other browsers as well.

# Overview

![image](./media/dall-e.png)
The Touch Pattern Recognition project is a project that aspires to revolutionize authentication systems. This project comes from five students at the @ITMA university Diarra Yacouba, Kanté Younouss Koly, Haïdara Mohamed, Diabaté Maïmouna and Maïga Maïmouna Henna as part of the second edition of “TRANSFORMATION NUMERIQUE”, the competition organized by [Africa Digital](http://africadigital.ml/) in May 2023.<br>
These students participated in the “TRANSFORMATION NUMERIQUE” universities league which was about cyber-security.
This repo is set to be regularly updated due to the ongoing status of the researches. All events mentioned in this file are localized in Bamako/Mali between April 30 and May 13 2023.<br>
With that said, The idea behind the project is to replace traditional system authentication credentials (username/ password) by a Deep learning (DL) model trained to Recognize the user of the system through touch data on touch sensitive devices.<br>

# What's in this repository?

This repository contains all codes and documents we developped during the researches:
* Data used for training (Brute_data/ && Training_data directories!)
* The web app used to collect data (theapp directory!)
* Notebooks used for training and tests (Pipeline directory!)
* Trained models saved (Models directory!)
* Scripts and functions used for data pre-processing (Pipeline/train directory!)
* PDFs describing the competitions and researches' progression
All codes are well commented and easy to use!

# What's going on now?

* Finishing the app's user interface<br>
    We have got some issues with some of our touch event listeners that prevent us from finishing the UI. 
    We are actively working to solve this. The app => [TouchPatternRecognition](https://diarray-hub.github.io/TouchPatternRecognition/) 
        
* Tests<br>
    This solutions is very experimental and we have to do further tests to ensure the reliability and stability of our approach and decide if it can indeed be used for authentication.