//import * as tf from '@tensorflow/tfjs';
import { preprocess } from '../functions.js';
import { calculateSpeed } from '../functions.js';
import { calculateDirection } from '../functions.js';
import { download } from '../functions.js';

class TrackingSession {
    /*
    This TrackingSession offers us a general way to collect data from the screen through the app
    The most important method there is the *handle* method through which we collect data like position and timestamp
    */
    // To track the active touch
    activeTouch = {}
    // To store all the records
    records = []
    // Our app are not going to use the whole screen. This will set the app screen dimensions
    screenScale = window.devicePixelRatio
    screenSize = [
        screen.width,
        screen.height
    ]
    //endcounter = 0;
    // The handle method
    handle(event, touches) {
        if (touches.length !== 1) {
            // Ignore if there are multiple touches on the screen
            return
        }
        const touch = touches.item(0)
        switch (event) {
            case "start":
                const id = Math.floor(1e8 * Math.random()) + ""
                this.activeTouch[touch.identifier] = id
                this.records.push(new TouchRecord(event, touch, id))
                break
            case "move":
                if (this.activeTouch[touch.identifier]) {
                    this.records.push(new TouchRecord(event, touch, this.activeTouch[touch.identifier]))
                }
                break
            case "end":
                if (this.activeTouch[touch.identifier]) {
                    this.records.push(new TouchRecord(event, touch, this.activeTouch[touch.identifier]))
                    delete this.activeTouch[touch.identifier]
                    this.export()
                    this.activeTouch = {}
                    this.records = []
                }
                break
        }
        //This block has been add during data collect take care to declare the endcounter attribute in order to re-use it
        /*if(this.endcounter === 30){
            this.export()
            this.endcounter = 0
            this.activeTouch = {}
            this.records = []
        }*/
    }

    // Recognition
    async recognizeUser(modelUrl, inputData) {
        const model = await tf.loadLayersModel(modelUrl);
        const tensor = tf.tensor2d(inputData, [1, 21]);
        const predictions = await model.predict(tensor);
        const outcome = await predictions.array();
        if (outcome[0][0] >= 0.90) {
            // Redirect the user to another page
            window.location.href = "https://diarray-hub.github.io/TouchPatternRecognition/theapp/Welcome.html";
        } 
        else {
            window.location.href = "https://diarray-hub.github.io/TouchPatternRecognition/theapp/Error.html";
        }
    }
    
    // This method will use the *download* function defined below to export data in .json file format
    export() {
        const name = "TouchTracker_Export";
        const touchTrackings = {};
        let currentTouchId;
        let currentTouchTimestamp;
        let currentPosition;
        let lastPosition;
        let currentSpeed;
        let currentDirection;
    
        // Process the touch records to create touch tracking objects
        this.records.forEach(record => {
            if (record.event === "start") {
                currentTouchId = record.touchId;
                currentTouchTimestamp = record.timestamp;
                currentPosition = record.position;
                touchTrackings[currentTouchId] = {id: currentTouchId, positions: [currentPosition], 
                    speeds: [], directions: [], startTimestamp: currentTouchTimestamp};
            } else if (record.event === "move") {
                lastPosition = currentPosition;
                currentPosition = record.position;
                currentSpeed = calculateSpeed(currentPosition, lastPosition, record.timestamp, currentTouchTimestamp);
                currentTouchTimestamp = record.timestamp;
                currentDirection = calculateDirection(currentPosition, lastPosition);
                touchTrackings[currentTouchId].positions.push(currentPosition);
                touchTrackings[currentTouchId].speeds.push(currentSpeed);
                touchTrackings[currentTouchId].directions.push(currentDirection);
            } else if (record.event === "end") {
                touchTrackings[currentTouchId].endTimestamp = record.timestamp;
            }
        });
    
        // Create an array of touch tracking objects
        const touchTrackingsArray = Object.values(touchTrackings);
    
        // Generate the output object
        const output = {
            name: name,
            duration: touchTrackingsArray[0].endTimestamp - touchTrackingsArray[0].starTimestamp,
            touchTrackings: touchTrackingsArray,
            screenSize: this.screenSize,
            screenScale: this.screenScale
        };
        // Make prediction
        const data = preprocess(touchTrackingsArray);
        this.recognizeUser(
        'https://diarray-hub.github.io/TouchPatternRecognition/Models/ongoiba_model/model.json',
        data
        ).catch((e) => {
        console.log('There was an error with the Model', e);
        });

        // Download the json file
        download(JSON.stringify(output, null, 2), name + " " + new Date().toLocaleString(), "application/json");
    }
}

class TouchRecord {
    /*
    A TouchRecord class that we'll use as represention of the collected data. 
    This class' structure represent how data will look like in the .json file
    */
    touchId
    event
    position
    timestamp

    constructor(event, touch, id) {
        this.touchId = id
        this.event = event
        const topOffset = screen.height - window.innerHeight
        this.position = [
            touch.screenX,
            touch.screenY + topOffset
        ]
        this.timestamp = new Date().getTime() / 1000
    }
}

// Creating a instance of our Trackingsession class
const session = new TrackingSession()

/*
    This code adds an event listener to the touch events of the body element in an HTML document. 
    The function that is passed as the second argument to addEventListener will be executed whenever the touchstart event is fired on the body element.
    *touchstart*, *touchmove* and *touchend* are  built-in JavaScript events that is triggered when a user touches the screen with their finger or stylus. 
    It is specifically designed for touchscreens and is not triggered by mouse clicks or other input methods.
    The preventDefault() function is called to prevent the default action associated with the touchstart event from occurring. 
    In this case, the default action is to scroll the page when the user touches the screen, and calling preventDefault() 
    will prevent this from happening.
    The e.changedTouches property in the code represents an array of touch points that have changed since the last event. 
    This can include touches that have been added, moved, or removed from the screen.
    When the passive option is set to false, it indicates that the event listener will call preventDefault() on the event object, 
    which will prevent the default behavior of the touchmove event from occurring. 
    Note that setting passive to false can potentially cause performance issues on mobile devices, 
    so it is generally recommended to use this option only when necessary.
*/
document.body.addEventListener('touchstart', function(e){
    e.preventDefault()
    session.handle("start", e.touches)
});

document.body.addEventListener('touchmove', function(e){
    e.preventDefault()
    session.handle("move", e.changedTouches)
}, { passive: false });

document.body.addEventListener('touchend', function(e){
    e.preventDefault()
    console.log(e.changedTouches)
    session.handle("end", e.changedTouches)
});

document.body.addEventListener('touchcancel', function(e){
    e.preventDefault()
    session.handle("end", e.changedTouches)
});
