$(document).ready(function(){
    $('.timepicker').timepicker({
        timeFormat: 'HH:mm',
        interval: 60,
        defaultTime: '08:00',
      });
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAJvhzrSYooMzuHfK8Vgz6dOWNEcGQVpmw",
    authDomain: "lynns-test-database-59f2b.firebaseapp.com",
    databaseURL: "https://lynns-test-database-59f2b.firebaseio.com",
    projectId: "lynns-test-database-59f2b",
    storageBucket: "lynns-test-database-59f2b.appspot.com",
    messagingSenderId: "357891349208"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Train Routes
$("#add-train").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = moment($("#firstTrainTime").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency").val().trim();
  
    // Creates local "temporary" object for train route
    var newTrain = {
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    };
  
    // Uploads train data to the database
    database.ref("/trains").push(newTrain);
  
    // Logs everything to console
    console.log("============= ADDING NEW TRAIN ROUTE ============= ")
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);
    console.log("============= END ADDING NEW TRAIN ROUTE ============= ")
  
    // Clears all of the text-boxes
    $("#name").val("");
    $("#destination").val("");
    $("#firstTrainTime").val("");
    $("#frequency").val("");
  });


// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref("/trains").on("child_added", function(childSnapshot) {

    // Store everything into a variable.
    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var currentDate = moment();
    var frequency = childSnapshot.val().frequency;
 
    // Prettify the arrival time
    //var dateFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
    var dateFormat = "HH:mm";
    // Hack Warning: Setting the arrival date to TODAY's date for calculations. The moment object really
    // is meant to represent a specific date in time. But we are using this first arrival time
    // to represent a time on any given day.
    var firstArrival = moment.unix(firstTrainTime).year(currentDate.year()).month(currentDate.month()).date(currentDate.date());
    var nextArrival = calculateNextArrival(firstArrival, frequency);
 
    
    // Train Info Printed to Console
    console.log("=============  CHILD ADDED: TRAIN ROUTE ============= ");
    console.log(childSnapshot.val());
    console.log("name=" + name);
    console.log("destination= " + destination);
    console.log("frequency= " + frequency);
    console.log("first train= " + firstTrainTime);
    console.log("=============  //END// CHILD ADDED: TRAIN ROUTE //END// ============= "); 
    

   
  
    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        //$("<td>").text(firstArrival.format(dateFormat)),
        $("<td>").text(frequency),
        $("<td>").text(nextArrival.format(dateFormat)),
        $("<td>").text(nextArrival.diff(moment(), "minutes"))
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  

function retrieveObjects() {
    database.ref("/trains").on("value", function(snapshot) {
        console.log(snapshot.val());
    });
}

// This function takes a moment object and frequency number (in minutes)
// to calcuate the next arriva time (returned as moment object).
function calculateNextArrival(arrival, frequency) {
    var currentTime = moment();
    console.log("First train of day is at: " + arrival.format("HH:mm"));
    console.log("Has this already passed? " + arrival.isBefore(currentTime))
    
    
    while (arrival.isBefore(currentTime)) {
        arrival.add(frequency, "minutes");

    }
    console.log("arrival= " + arrival.format("dddd, MMMM Do YYYY, h:mm:ss a"));
    return arrival;
}



