import * as TouchTracker from './TouchTracker/app';

const session = new TouchTracker.TrackingSession();

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