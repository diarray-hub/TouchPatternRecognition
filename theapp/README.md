# TouchTracker

For this project I editing the source code of the TouchTracker web app.<br>
An original creation of Marco Cancellieri (@Marcocanc)<br>
You will also notice that the logo is a light variable of the original one. You can think of this like a kind of TouchTracker2<br>

TouchTracker is a simple web app for mobile devices that displays a greenscreen and records all gestures performed on the screen. It outputs a json file that can be imported into AE with the included .jsx script. The script then generates a new composition with the exact screen resolution and imports each gesture as an animated "Null Object".
To learn more the original app to go to:
## https://github.com/Marcocanc/TouchTracker

You note that the code has been considerably changed:<br>
    * The .html files here are used to redirect the user with respect to the predictions of the model
    * In the functions.js file are defined crucial functions the the app need to work properly