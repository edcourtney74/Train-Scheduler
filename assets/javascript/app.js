$(document).ready(function () {

    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyAUorcvEaJlVeO0fIfzrjaxMARlhVbv32o",
    authDomain: "train-scheduler-18119.firebaseapp.com",
    databaseURL: "https://train-scheduler-18119.firebaseio.com",
    projectId: "train-scheduler-18119",
    storageBucket: "train-scheduler-18119.appspot.com",
    messagingSenderId: "316290689231"
    };
    firebase.initializeApp(config);

    //   Store firebase database in a variable
    var database = firebase.database();

    //  Set initial variables
    var name = "";
    var destination = "";
    var firstTime;
    var frequency;

    // When submit button is clicked:
    $("#submit-train").on("click", function (event) {

        // Prevent page from refreshing on submit
        event.preventDefault();

        // Grab values of new train info, store in variables
        name = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTime = $("#first-time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // Create temporary object for new train data
        var newTrain = {
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        }

        // Pushes new train info to database
        database.ref().push(newTrain);

        // Clears form inputs
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#first-time-input").val("");
        $("#frequency-input").val("");
    });
    
    // Retrieve values from Firebase and display in HTML
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        // Store Firebase info in variables
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFirstTime = childSnapshot.val().firstTime;
        var trainFrequency = parseInt(childSnapshot.val().frequency);

        console.log("Train name from database: " + trainName);
        console.log("Train destination from database: " + trainDestination);
        console.log("Train first time from database: " + trainFirstTime);
        console.log("Train frequency from database: " + trainFrequency);

        // Calculate Next Arrival
        // First time pushed back one year so it comes before current time
        var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");

        // Store current time in a variable
        var currentTime = moment();
        console.log("Current time: " + moment(currentTime).format("HH:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in time: " + diffTime);

        // Time remainder
        var timeRemainder = diffTime % trainFrequency;
        console.log("Remainder: " + timeRemainder);

        // Minutes remaining until the next train
        var minutesUntilTrain = trainFrequency - timeRemainder;
        console.log("Minutes remaining: " + minutesUntilTrain);

        // Time of next train
        var nextTrain = moment().add(minutesUntilTrain, "minutes");
        console.log("Arrival time: " + moment(nextTrain).format("HH:mm"));
   
        // Add children to HTML
        $("#new-train").append("<tr><td>" + trainName + 
        "</td><td>" + trainDestination + 
        "</td><td>" + trainFrequency + 
        "</td><td>" + moment(nextTrain).format("HH:mm") + 
        "</td><td>" + minutesUntilTrain +
        "</td></tr>");

    });
    
});

