let mediaRecorder;
const recordedBlobs = [];
let isRec = false;
const type = 'webm'; // You can also use mp4.

async function startRecording() {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
    });
    const options = {
        mimeType: 'video/' + type
    };
    let videoElem = document.getElementById('video-output');
    videoElem.srcObject = screenStream;

    mediaRecorder = new MediaRecorder(screenStream, options);
    mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };

    mediaRecorder.start();
    console.log('start recording');
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('stop recording');
    mediaRecorder.onstop = () => {
        saveRecording();
    };

    console.log('stop capturing');
    let videoElem = document.getElementById('video-output');
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
}

function saveRecording() {
    console.log('save recording');
    const blob = new Blob(recordedBlobs, {
        type: 'video/' + type
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'WebRec.' + type;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

document.addEventListener('keypress', (event) => {
    if (event.shiftKey) {
        if (event.key === 'R') {
            if (isRec === false) {
                startRecording();
                isRec = true;
            }
        }
        if (event.key === 'E') {
            if (isRec === true) {
                stopRecording();
                isRec = false;
            }
        }
    }
});

async function startCapture() {
    const captureArea = document.querySelector('p');
    const cropTarget = await CropTarget.fromElement(captureArea);
    // const cropTarget = await RestrictionTarget.fromElement(captureArea);

    const stream = await navigator.mediaDevices.getDisplayMedia({
        preferCurrentTab: true,
    });

    const [videoTrack] = stream.getVideoTracks();
    await videoTrack.cropTo(cropTarget);

    let localVideo = document.getElementById('video-output')
    localVideo.srcObject = stream;
    await localVideo.play();
}

document.querySelector("#startRegionCapture").addEventListener('click',
    () => {
        (async () => {
            await startCapture()
        })()
    })
