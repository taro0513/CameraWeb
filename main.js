"use strict";
let inputVideo = document.querySelector("#inputVideo"),
    outputVideo = document.querySelector("#outputVideo"),
    startBtn = document.querySelector("#startBtn"),
    stopBtn = document.querySelector("#stopBtn"),
    resetBtn = document.querySelector("#resetBtn"),
    errorElement = document.querySelector("#errorMsg"),
    isRecordingIcon = document.querySelector(".is-recording"),
    chunks = [],
    constraints = {
        audio: !0,
        video: !0
    };
mediaRecorderSetup();
let mediaRecorder = null,
    inputVideoURL = null,
    outputVideoURL = null;

function onStartRecording(e) {
    e.preventDefault(), e.stopPropagation(), isRecordingBtn("stop"), mediaRecorder.start(), console.log("mediaRecorder.start()")
}

function onStopRecording(e) {
    e.preventDefault(), e.stopPropagation(), isRecordingBtn("reset"), mediaRecorder.stop(), console.log("mediaRecorder.stop()")
}

function onReset(e) {
    e.preventDefault(), e.stopPropagation(), URL.revokeObjectURL(inputVideoURL), URL.revokeObjectURL(outputVideoURL), outputVideo.src = "", outputVideo.controls = !1, inputVideo.src = "", mediaRecorderSetup()
}

function mediaRecorderSetup() {
    isRecordingBtn("start"), navigator.mediaDevices.getUserMedia(constraints).then((function(e) {
        "srcObject" in inputVideo ? inputVideo.srcObject = e : inputVideo.src = window.URL.createObjectURL(e), inputVideo.controls = !1, mediaRecorder = new MediaRecorder(e, {
            mimeType: "video/webm;codecs=VP9"
        }), mediaRecorder.addEventListener("dataavailable", (function(e) {
            console.log("mediaRecorder on dataavailable", e.data), chunks.push(e.data)
        })), mediaRecorder.addEventListener("stop", (function(t) {
            console.log("mediaRecorder on stop"), outputVideo.controls = !0;
            var o = new Blob(chunks, {
                type: "video/webm"
            });
            chunks = [], outputVideoURL = URL.createObjectURL(o), outputVideo.src = outputVideoURL, saveData(outputVideoURL), e.getTracks().forEach((function(e) {
                e.stop()
            }))
        }))
    })).catch((function(e) {
        "ConstraintNotSatisfiedError" === e.name ? errorMsg("The resolution " + constraints.video.width.exact + "x" + constraints.video.width.exact + " px is not supported by your device.") : "PermissionDeniedError" === e.name && errorMsg("Permissions have not been granted to use your media devices"), errorMsg("getUserMedia error: " + e.name, e)
    }))
}

function errorMsg(e, t) {
    console.log("errorElement", errorElement), errorElement.classList.add("alert", "alert-warning"), errorElement.innerHTML += e, void 0 !== t && console.error(t)
}

function saveData(e) {
    var t = "my-download-" + Date.now() + ".webm",
        o = document.createElement("a");
    document.body.appendChild(o), o.style = "display: none", o.href = e, o.download = t, o.click()
}

function isRecordingBtn(e) {
    switch (startBtn.style.display = "none", stopBtn.style.display = "none", resetBtn.style.display = "none", isRecordingIcon.style.display = "none", e) {
        case "start":
            startBtn.style.display = "block";
            break;
        case "stop":
            stopBtn.style.display = "block", isRecordingIcon.style.display = "block";
            break;
        case "reset":
            resetBtn.style.display = "block";
            break;
        default:
            console.warn("isRecordingBtn error")
    }
}
startBtn.addEventListener("click", onStartRecording), stopBtn.addEventListener("click", onStopRecording), resetBtn.addEventListener("click", onReset), inputVideo.addEventListener("loadedmetadata", (function() {
    inputVideo.play(), console.log("inputVideo on loadedmetadata")
}));