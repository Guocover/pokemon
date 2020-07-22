var body = document.querySelector("body");
var video = document.querySelector("video");
var pet = document.querySelector("#pet");

var audio, audioType;

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;
  window.URL =
  window.URL || window.webkitURL || window.mozURL || window.msURL;

var exArray = []; //存储设备源ID

function getMedia() {
  // alert(1);
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      {
        video: {
          optional: [
            {
              sourceId: exArray[1], //0为前置摄像头，1为后置
            },
          ],
        },
        audio: true,
      },
      successFunc,
      errorFunc
    ); //success是获取成功的回调函数
  } else {
    alert(
      "Native device media streaming (getUserMedia) not supported in this browser."
    );
  }
}

function successFunc(stream) {
  //alert('Succeed to get media!');
  if (video.mozSrcObject !== undefined) {
    //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持
    video.mozSrcObject = stream;
  } else {
    video.src =
      (window.URL && window.URL.createObjectURL(stream)) || stream;
  }

  //video.play();

  // 音频
  audio = new Audio();
  audioType = getAudioType(audio);
  if (audioType) {
    audio.src = "polaroid." + audioType;
    audio.play();
  }
}

function errorFunc(e) {
  alert("Error！" + e);
}

//获取音频格式
function getAudioType(element) {
  if (element.canPlayType) {
    if (element.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== "") {
      return "aac";
    } else if (element.canPlayType('audio/ogg; codecs="vorbis"') !== "") {
      return "ogg";
    }
  }
  return false;
}

function init() {
  if (window.MediaStreamTrack && MediaStreamTrack.getSources) {
    MediaStreamTrack.getSources(function (sourceInfos) {
      for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        //这里会遍历audio,video，所以要加以区分
        if (sourceInfo.kind === "video") {
          // alert('sourceInfo'+ sourceInfo.id);
          exArray.push(sourceInfo.id);
        }
      }
      getMedia();
      showPet();
    });
  }
  if (navigator.mediaDevices) {
    navigator.mediaDevices.enumerateDevices().then(function (sources) {
      sources.map(function (source) {
        if (source.kind === "video") {
          // alert('sourceInfo'+ sourceInfo.id);
          exArray.push(sourceInfo.id);
        }
      });
      getMedia();
      showPet();
    });
  }
  bindEvent();
}

function showPet() {
  setTimeout(function () {
    body.classList.add("z-show");
  }, 2500);
}

function bindEvent() {
  pet.onclick = function () {
    body.classList.add("z-big");
  };
}

init();