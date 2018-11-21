//Creating a new exercise
document.getElementById('addExerciseSubmit').addEventListener('click', function(event) {
	
	//Get the form id
	var addWorkoutForm = document.getElementById("addWorkoutForm");

    var req = new XMLHttpRequest();

	//Create a string that contains the parameters to insert in get request
	var param = "exercise="+addWorkoutForm.elements.exercise.value+
				"&musclegroup="+addWorkoutForm.elements.musclegroup.value;

	//Open the get request
	req.open("POST", "/insert-workout?" + param, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	//Once loading is done, add to the workouts table
	req.addEventListener('load', function() {
		if(req.status >= 200 && req.status < 400) {

			//Save the id of the newly inserted element
			var response = JSON.parse(req.responseText);
			var id = response.inserted;

			//Get the table
			var table = document.getElementById("workoutTable");

			//Passing -1 into insertRow creates a new row at the bottom of the table
			var row = table.insertRow(-1);

            //Create a cell for the id
            var idVal = document.createElement('td');
            idVal.textContent = id;
            row.appendChild(idVal);

			//Create a cell for the exercise name
			var exerciseVal = document.createElement('td');
			exerciseVal.textContent = addWorkoutForm.elements.exercise.value;
			row.appendChild(exerciseVal);

			//Create a cell for the muscle group targeted
			var musclegroupVal = document.createElement('td');
			musclegroupVal.textContent = addWorkoutForm.elements.musclegroup.value;
			row.appendChild(musclegroupVal);

            //Create a cell with a delete button
            //The button calls the deleteRow function
            var deleteCell = document.createElement('td');
            var deleteButton = document.createElement('input');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('name', 'delete');
            deleteButton.setAttribute('value', 'Delete');
            deleteButton.setAttribute('onClick', 'deleteRow("workoutTable", '+id+')');
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            //Create a cell with label that tracks the row
            var rowCell = document.createElement('td');
            var rowLabel = document.createElement('Label');
            rowLabel.setAttribute('value', 'row'+id);
            rowLabel.setAttribute('hidden', true);
            rowLabel.innerHTML = 'row'+id;
            rowCell.appendChild(rowLabel);
            row.appendChild(rowCell);

		} 
		else {
			window.alert("Insertion Error -- Please make sure you entered valid data.");
		}

	});
	console.log(param);
	req.send("/insert-workout?" + param);
	event.preventDefault();
});

//Delete a workout
function deleteRow(tableId, buttonId) {

    //Get the table and determine the number of rows
    var table = document.getElementById(tableId);
    var rowCount = table.rows.length;

    //Create a string that matches format of the delete button id
    var deleteString = 'row'+buttonId;

    //Keep track of the row index
    var rowIndex = -1;

    //Iterate through the table to find the matching row index of the delete button clicked
    for(var i = 1; i < rowCount; i++) {
        //Get the row
        var row = table.rows[i];
        //Get the children (cells) of that row
        var rowCells = row.getElementsByTagName('td');
        //Grab the string value of the hidden label of that row (last element)
        var delButtonCell = rowCells[rowCells.length - 1];
        var rowString = delButtonCell.children[0].innerHTML;
        //Delete the row when a match is found
        if(rowString == deleteString) {
            rowIndex = i;
            if(rowIndex == -1) {
                console.log('DELETE ERROR');
            }
            else {
                table.deleteRow(rowIndex);
                break;
            }
        }
    }

    //Open the delete request to delete on the backend
    var req = new XMLHttpRequest();
    var param = '/delete-workout';
    req.open("DELETE", param+"?id="+buttonId, true);
    req.addEventListener("load",function(){
        if(req.status >= 200 && req.status < 400){
            console.log('DELETE REQUEST SENT');
        } else {
            console.log('DELETE REQUEST ERROR');
        }
    });

    //Send the request
    req.send(param+"?id="+buttonId);

}

//Search for workouts
function muscleGroupSearch() {
    //Get the filter element
    var filterMuscleGroup = document.getElementById("filter");
    //Get the value of the filter
    var filterVal = filterMuscleGroup.value;
    //Set up the query string
    var param = '/workouts-search';
    //Redirect user to workouts page based on their selection
    if(filterVal === 'All') {
        window.location = '/workouts';
    }
    else {
        window.location = '/workouts-search?muscleGroupName='+filterVal;
    }
}









