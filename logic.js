// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve train from the train database.
// 4. Create a way to calculate the next arrival time. Using difference between start time frequency.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate Minutes Awaw.

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyBbCbA7JX5Yax7SN8W_T7qvdN9zMsiFWlY",
    authDomain: "train-schedule-ea3d3.firebaseapp.com",
    databaseURL: "https://train-schedule-ea3d3.firebaseio.com",
    projectId: "train-schedule-ea3d3",
    storageBucket: "train-schedule-ea3d3.appspot.com",
    messagingSenderId: "942301184374"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trnName = $("#train-name-input").val().trim();
    var trnDest = $("#destination-input").val().trim();
    var trnStart = $("#start-input").val().trim();
    var trnFreq = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrn = {
      name: trnName,
      destination: trnDest,
      start: trnStart,
      frequency: trnFreq
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrn);
  
    // Logs everything to console
    console.log(newTrn.name);
    console.log(newTrn.destination);
    console.log(newTrn.start);
    console.log(newTrn.frequency);
  
    alert("Train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trnName = childSnapshot.val().name;
    var trnDest = childSnapshot.val().destination;
    var trnStart = childSnapshot.val().start;
    var trnFreq = childSnapshot.val().frequency;
    var trnNext = childSnapshot.val().next;
  
    // Train Info
    console.log(trnName);
    console.log(trnDest);
    console.log(trnStart);
    console.log(trnFreq);
    console.log(trnNext);


    var timeArr = trnStart.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
   
      // Calculate the minutes until arrival using hardcore math
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % trnFreq;
      tMinutes = trnFreq - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

   // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trnName),
      $("<td>").text(trnDest),
      $("<td>").text(trnFreq),
      $("<td>").text(tMinutes),
      $("<td>").text(tArrival)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  
  