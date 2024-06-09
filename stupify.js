let audioFiles = [];
let currentIndex = 0;
let loopPlaylist = false;
let loopCurrent = false;
let audioPlayer = document.getElementById('audioPlayer');
let loopButton = document.getElementById('loopButton');
let loopCurrentButton = document.getElementById('loopCurrentButton');

function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        callback(event.target.result);
    };
    reader.onerror = function(error) {
        console.error("Error reading file:", error);
    };
    reader.readAsDataURL(file);
}

function storeAudios() {
    const audioInput = document.getElementById('audioInput');
    const files = audioInput.files;
    
    if (files.length > 0) {
        audioFiles = [];
        Array.from(files).forEach((file, index) => {
            convertToBase64(file, function(base64Audio) {
                audioFiles.push(base64Audio);
                if (index === files.length - 1) {
                    localStorage.setItem('audioFiles', JSON.stringify(audioFiles));
                    alert('Audio files stored in local storage!');
                }
            });
        });
    } else {
        alert('Please select audio files.');
    }
}

function loadAudios() {
    const storedAudios = localStorage.getItem('audioFiles');
    if (storedAudios) {
        audioFiles = JSON.parse(storedAudios);
    }
}

function playAudio(index) {
    if (audioFiles.length > 0) {
        audioPlayer.src = audioFiles[index];
        audioPlayer.play();
    } else {
        alert('No audio files found in local storage.');
    }
}

function startPlaylist() {
    loadAudios();
    currentIndex = 0;
    playAudio(currentIndex);
    audioPlayer.onended = function() {
        if (loopCurrent) {
            playAudio(currentIndex);
        } else if (loopPlaylist) {
            nextSong();
        } else if (currentIndex < audioFiles.length - 1) {
            nextSong();
        }
    };
}

function nextSong() {
    currentIndex = (currentIndex + 1) % audioFiles.length;
    playAudio(currentIndex);
}

function prevSong() {
    currentIndex = (currentIndex - 1 + audioFiles.length) % audioFiles.length;
    playAudio(currentIndex);
}

function toggleLoop() {
    loopPlaylist = !loopPlaylist;
    loopButton.textContent = `Loop Playlist: ${loopPlaylist ? 'On' : 'Off'}`;
    loopButton.classList.toggle('loop-on', loopPlaylist);
    if (loopPlaylist && loopCurrent) {
        toggleLoopCurrent();
    }
}

function toggleLoopCurrent() {
    loopCurrent = !loopCurrent;
    loopCurrentButton.textContent = `Loop Current: ${loopCurrent ? 'On' : 'Off'}`;
    loopCurrentButton.classList.toggle('loop-on', loopCurrent);
    if (loopCurrent && loopPlaylist) {
        toggleLoop();
    }
}
