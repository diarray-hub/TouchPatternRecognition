// This TrackingSession offers us a general way to collect data from the screen through the app
// The most important method there is the *handle* method through which we collect data like position and timestamp
class TrackingSession {
    // To keep track of the ative touch
    activeTouch = {}
    // To store all the records
    records = []
    
    // Our app are not going to use the whole screen. This will set the app screen dimensions
    screenScale = window.devicePixelRatio
    screenSize = [
        screen.width,
        screen.height
    ]
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
                }
                break
        }
    }
    
    // This method will use the *download* function defined below to export data in .json file format
    export() {
        const name = "TouchTracker Export"
        const output = {
            name: name ,
            startTime: this.records[0].timestamp,
            duration: this.records[this.records.length-1].timestamp - this.records[0].timestamp,
            records: this.records,
            screenSize: this.screenSize,
            screenScale: this.screenScale
        }
        download(JSON.stringify(output, null, 2), name + " " + new Date().toLocaleString(), "application/json")
    }
}

// A TouchRecord class that we'll use as represention of the collected data. 
// This class' structure represent how data will look like in the .json file
class TouchRecord {
    touchId
    event
    position
    force
    timestamp

    constructor(event, touch, id) {
        this.touchId = id
        this.event = event
        const topOffset = screen.height - window.innerHeight
        this.position = [
            touch.screenX,
            touch.screenY + topOffset
        ]
        this.force = touch.force
        this.timestamp = new Date().getTime() / 1000
    }
}

// Defining a function that will allows us to export collected data in .json file from the browser
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

// Creating a instance of our Trackingsession class
const session = new TrackingSession()

/*
This code adds an event listener to the touchstart event of the body element in an HTML document. 
The function that is passed as the second argument to addEventListener will be executed whenever the touchstart event is fired on the body element.
*touchstart*, *touchmove* and *touchend* are  built-in JavaScript events that is triggered when a user touches the screen with their finger or stylus. 
It is specifically designed for touchscreens and is not triggered by mouse clicks or other input methods.
*/
document.body.addEventListener('touchstart', function(e){
    /*
    The preventDefault() function is called to prevent the default action associated with the touchstart event from occurring. 
    In this case, the default action is to scroll the page when the user touches the screen, and calling preventDefault() 
    will prevent this from happening.
    */ 
    e.preventDefault()
    session.handle("start", e.touches)
});
document.body.addEventListener('touchmove', function(e){
    e.preventDefault()
    
    //The e.changedTouches property in the code represents an array of touch points that have changed since the last event. 
    //This can include touches that have been added, moved, or removed from the screen.
    session.handle("move", e.changedTouches)
}, { passive: false });
/*
    When the passive option is set to false, it indicates that the event listener will call preventDefault() on the event object, 
    which will prevent the default behavior of the touchmove event from occurring. 
    Note that setting passive to false can potentially cause performance issues on mobile devices, 
    so it is generally recommended to use this option only when necessary.
*/
document.body.addEventListener('touchend', function(e){
    e.preventDefault()
    console.log(e.changedTouches)
    session.handle("end", e.changedTouches)
});
document.body.addEventListener('touchcancel', function(e){
    e.preventDefault()
    session.handle("end", e.changedTouches)
});

