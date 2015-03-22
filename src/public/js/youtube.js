/* Creates an embedded YouTube player and handles its events   */



// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates a YouTube player after the API code downloads.
var player;

function onYouTubeIframeAPIReady() {

    player = new YT.Player('videoplayer', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // Do nothing once the player loads.
}

// The API calls this function when the player's state changes. For our
// analytics, we'll track play percentage and completion percentage.
// Multiple plays will only be counted if the video is watched in its
// entirety.

var hasBeenPlayed = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !hasBeenPlayed) {
        mixpanel.track("video started");
        hasBeenPlayed = true;
    }

    if (event.data == YT.PlayerState.ENDED) {
        mixpanel.track("video finished");
        // We'll count a replay only after the video was first finished
        hasBeenPlayed = false;
    }
}