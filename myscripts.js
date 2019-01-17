document.getElementById("Obstknopf").onclick = function() {haltStop()};

function haltStop() {
  var audio = document.getElementById("stopp");
  audio.play();
}