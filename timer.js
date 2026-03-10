window.onload=function() {
  var start = 0;
  var stop = 0;
  var interval = 0;
  var fcInterval = 0;
  var yellowInterval = 0;
  var timerRunning = 0;
  var yellowMark = 0;
  var firstCrack = 0;
  var startTime = 0;
  var yellowTime = 0;
  var firstCrackTime = 0;
  var dropTime = 0;

  function yellow() {
    if (start != 0 && timerRunning == 1) {
      yellowTime = Date.now();
      yellowMark = yellowTime;
      $("#yellow-time").text("Yellow: " + timeToString(yellowMark - start));
      $("#yellow-percent").removeClass("label-warning");
      $("#yellow-percent").removeClass("label-danger");
      $("#yellow-percent").text("Yellow %: 0.00%");
      updatePhases();

      if (yellowInterval != 0) {
        clearInterval(yellowInterval);
      }
      yellowInterval = setInterval(function() {
        var currentTimeMillis = new Date().getTime() - start;
        var currentTimeSeconds = Math.floor(currentTimeMillis / 1000);
        var maillardMillis = new Date().getTime() - yellowMark;
        var maillardSeconds = Math.floor(maillardMillis / 1000);

        if (currentTimeSeconds > 0 && maillardSeconds >= 0) {
          var yellowPercent = ((maillardSeconds / currentTimeSeconds) * 100).toFixed(2);
          $("#yellow-percent").text("Yellow %: " + yellowPercent + "%");
        }
      }, 1000);
    }
  }

  function drop() {
    if (start != 0 && timerRunning == 1 && dropTime == 0) {
      finalizeRoast(Date.now());
    }
  }

  function finalizeRoast(finalTime) {
    dropTime = finalTime;

    if (yellowTime == 0 && startTime) {
      yellowTime = dropTime;
      $("#yellow-time").text("Yellow: " + timeToString(yellowTime - start));
    }

    updatePhases();

    if (firstCrackTime && startTime) {
      var finalDevelopment = (dropTime - firstCrackTime) / 1000;
      var finalTotal = (dropTime - startTime) / 1000;
      var finalDevPercent = 0;

      if (finalTotal > 0) {
        finalDevPercent = (finalDevelopment / finalTotal * 100).toFixed(2);
      }
      $("#development-time").text("Development %: " + finalDevPercent + "%");
    } else {
      $("#development-time").text("Development %: n/a (set First Crack)");
      if (startTime) {
        $("#drying").text("Drying: " + formatTime((dropTime - startTime) / 1000));
      }
      $("#maillard").text("Maillard: n/a");
      $("#development").text("Development: n/a");
      $("#devpercent").text("Dev %: n/a");
    }

    if (fcInterval != 0) {
      clearInterval(fcInterval);
    }
    if (yellowInterval != 0) {
      clearInterval(yellowInterval);
    }
  }
  
  $("#start-button").click(function() {
    if (interval == 0) {
      start = new Date().getTime();
      startTime = Date.now();
    }
  
    if (timerRunning == 1) {
      drop();
      timerRunning = 2;
      stop = new Date().getTime();
      $(this).text("Reset");
      $(this).removeClass("btn-danger");
      $(this).addClass("btn-warning");
  
      clearInterval(interval);
      clearInterval(fcInterval);
      clearInterval(yellowInterval);
    } else if (timerRunning == 2) {
      start = 0;
      stop = 0;
      interval = 0;
      fcInterval = 0;
      yellowInterval = 0;
      timerRunning = 0;
      yellowMark = 0;
      firstCrack = 0;
      startTime = 0;
      yellowTime = 0;
      firstCrackTime = 0;
      dropTime = 0;
      $(this).text("Start");
      $(this).removeClass("btn-warning");
      $(this).addClass("btn-primary");
      $(".jumbotron h1#timer").text("00:00");
      $("#yellow-time").text("Yellow: ");
      $("#yellow-percent").text("Yellow %: ");
      $("#yellow-percent").removeClass("label-warning");
      $("#yellow-percent").removeClass("label-danger");
      $("#first-crack").text("First Crack: ");
      $("#development-time").text("Development: ");
      $("#development-time").removeClass("label-warning");
      $("#development-time").removeClass("label-danger");
      $("#drying").text("Drying: ");
      $("#maillard").text("Maillard: ");
      $("#development").text("Development: ");
      $("#devpercent").text("Dev %: ");
      $("#lowest").text("15.0%: ");
      $("#lower").text("17.5%: ");
      $("#low").text("20.0%: ");
      $("#mid").text("22.5%: ");
      $("#high").text("25.0%: ");
      $("#weight-loss").text("Weight Loss: ");
      $("#date-timestamp").text("Date: ");
    } else {
      timerRunning = 1;
      $(this).text("Stop");
      $(this).removeClass("btn-primary");
      $(this).addClass("btn-danger");
  
      interval = setInterval(function() {
        $(".jumbotron h1#timer").text(timeToString(new Date().getTime() - start));
      }, 100)
    }
  });

  $("#yellow-button").click(function() {
    yellow();
  });
  
  $("#first-crack-button").click(function() {
    if (start != 0 && timerRunning == 1) {
      firstCrackTime = Date.now();
      firstCrack = firstCrackTime;
      $("#first-crack").addClass("label-success");
      $("#first-crack").text("First Crack: " + timeToString(firstCrack - start));
      $("#firstCrackButtons").toggle();
      $("#development-time").removeClass("label-warning");
      $("#development-time").removeClass("label-danger");
      updatePhases();
  
      if (fcInterval != 0) {
        clearInterval(fcInterval); 
      }

      if (yellowInterval != 0) {
        clearInterval(yellowInterval);
      }

      fcInterval = setInterval(function() {
        var firstCrackMillis = firstCrack - start;
        var firstCrackSeconds = Math.floor(firstCrackMillis / 1000);
        var currentTimeMillis = new Date().getTime() - start;
        var currentTimeSeconds = Math.floor(currentTimeMillis / 1000);
        var developmentTime = ((1 - (firstCrackSeconds / currentTimeSeconds)) * 100).toFixed(2);
  
        $("#development-time").text("Development %: " + developmentTime + "%");
        if (developmentTime > 15) {
          $("#development-time").addClass("label-warning");
        }
        if (developmentTime > 20) {
          $("#development-time").addClass("label-danger");
        }
      }, 1000)
  
      var developmentTimeMillis = firstCrack - start;
      $("#lowest").text("15.0%: " + timeToString(developmentTimeMillis / .85));
      $("#lower").text("17.5%: " + timeToString(developmentTimeMillis / .825));
      $("#low").text("20.0%: " + timeToString(developmentTimeMillis / .8));
      $("#mid").text("22.5%: " + timeToString(developmentTimeMillis / .775));
      $("#high").text("25.0%: " + timeToString(developmentTimeMillis / .75));
    }
  });

  $("#drop-button").click(function() {
    drop();
  });

  $("#calc-button").click(function() {
    var greenWeight = $("#green-weight").val() || 0;
    var roastWeight = $("#roast-weight").val() || 0;
    $("#weight-loss").text("Weight Loss: " + calcWeightLoss(greenWeight, roastWeight) + "%");
    $("#date-timestamp").text("Date: " + new moment().format('MMM Do YYYY, h:mm:ss a'));
  });

  function calcWeightLoss(greenWeight, roastWeight) {
    var weightLoss = 0;

    if (greenWeight != 0 && roastWeight !=0) {
      weightLoss = 100*((greenWeight - roastWeight)/greenWeight);
    }

    return weightLoss.toFixed(2);
  }

  function updatePhases() {
    if (yellowTime && startTime) {
      var drying = (yellowTime - startTime) / 1000;
      $("#drying").text("Drying: " + formatTime(drying));
    }

    if (firstCrackTime && yellowTime) {
      var maillard = (firstCrackTime - yellowTime) / 1000;
      $("#maillard").text("Maillard: " + formatTime(maillard));
    }

    if (dropTime && firstCrackTime && startTime) {
      var development = (dropTime - firstCrackTime) / 1000;
      var total = (dropTime - startTime) / 1000;
      var devPercent = 0;

      $("#development").text("Development: " + formatTime(development));

      if (total > 0) {
        devPercent = (development / total * 100).toFixed(1);
      }
      $("#devpercent").text("Dev %: " + devPercent + "%");
    }
  }

  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  
  function timeToString(millis) {
    millis = Math.round(millis);
    var timeSeconds = Math.floor(millis / 1000);
    var timeMinutes = Math.floor(timeSeconds / 60);

    if (timeSeconds > 59) {
      timeSeconds = timeSeconds - (timeMinutes * 60);
    }
    if (timeSeconds < 10) {
      timeSeconds = "0" + timeSeconds;
    }
    if (timeMinutes < 10) {
      timeMinutes = "0" + timeMinutes;
    }
  
    return timeMinutes + ":" + timeSeconds;
  }
}
