// Implement a part of preprocessing.py stats_summary function in JS
export function preprocess(touchTrackingArray){
    var touch = touchTrackingArray[0],
        positionX = [],
        positionY = [],
        speeds = touch.speeds,
        directions = touch.directions,
        latency = touch.endTimestamp - touch.startTimestamp
    touch.positions.forEach(position => {
        positionX.push(position[0])
        positionY.push(position[1])
    });
    var fields = [positionX, positionY, speeds, directions];
    // Calculate the features
    const features = fields.map(field => {
        const mean = field.reduce((a, b) => a + b) / field.length;
        const stdDev = Math.sqrt(field.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / field.length);
        const min = Math.min(...field);
        const max = Math.max(...field);
        const range = max - min;
        return [mean, stdDev, min, max, range];
    });
    
    // Flatten the features into a single list
    const flattenedFeatures = features.reduce((acc, val) => acc.concat(val), []);
    flattenedFeatures.push(latency);
    return flattenedFeatures
}

// Defining a function that will allows us to export collected data in .json file from the browser
export function download(data, filename, type) {
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

export function calculateSpeed(currentPosition, lastPosition, timestamp, lastimestamp) {
    const distance = Math.sqrt((currentPosition[0] - lastPosition[0]) ** 2 + (currentPosition[1] - lastPosition[1]) ** 2);
    const timeElapsed = timestamp - lastimestamp;
    return distance / timeElapsed; // Eucludian speed calculus
}

export function calculateDirection(currentPosition, lastPosition) {
    /*
    Note that the angle returned by Math.atan2 is not the same as the direction in degrees (i.e. north, south, east, west). Instead, 
    it represents the angle between the two points in the coordinate system, with the positive x-axis as the reference.
    */
    const deltaX = currentPosition[0] - lastPosition[0];
    const deltaY = currentPosition[1] - lastPosition[1];
    return Math.atan2(deltaY, deltaX);
}