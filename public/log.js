//Creating a new plan
document.getElementById('addLogSubmit').addEventListener('click', function(event) {
    
    //Get the form
    var logForm = document.getElementById("addLogForm");

    //Create new HTTP request
    var req = new XMLHttpRequest();

    //Create a string that contains the parameters to insert in post request
    var param = "reps="+logForm.elements.numReps.value+
                "&sets="+logForm.elements.numSets.value+
                "&weight="+logForm.elements.numWeight.value+
                "&date="+logForm.elements.dateEntry.value+
                "&userID="+logForm.elements.userIDFilter.value+
                "&workoutID="+logForm.elements.workoutIDFilter.value;

    //Open the get request
    req.open("POST", "/insert-log?" + param, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    //Once loading is done, add to the workouts table and update the search filter
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {

            //Save the id of the newly inserted element
            var response = JSON.parse(req.responseText);
            console.log(response);
            var id = response.inserted;

            //Get the table
            var table = document.getElementById("logTable");

            //Passing -1 into insertRow creates a new row at the bottom of the table
            var row = table.insertRow(-1);

                //Create a cell for the log ID
                var idVal = document.createElement('td');
                idVal.textContent = id;
                row.appendChild(idVal);

                //Create a cell for the reps
                var repsVal = document.createElement('td');
                repsVal.textContent = logForm.elements.numReps.value;
                row.appendChild(repsVal);

                //Create a cell for the sets
                var setsVal = document.createElement('td');
                setsVal.textContent = logForm.elements.numSets.value;
                row.appendChild(setsVal);

                //Create a cell for the weight
                var weightVal = document.createElement('td');
                weightVal.textContent = logForm.elements.numWeight.value;
                row.appendChild(weightVal);

                //Create a cell for the date
                var dateVal = document.createElement('td');
                dateVal.textContent = logForm.elements.dateEntry.value;
                row.appendChild(dateVal);

                //Create a cell for the user ID
                var uidVal = document.createElement('td');
                uidVal.textContent = logForm.elements.userIDFilter.value;
                row.appendChild(uidVal);

                //Create a cell for the user ID
                var widVal = document.createElement('td');
                widVal.textContent = logForm.elements.workoutIDFilter.value;
                row.appendChild(widVal);                

                //Create a cell with a delete button
                //The button calls the deleteRow function
                var deleteCell = document.createElement('td');
                var deleteButton = document.createElement('input');
                deleteButton.setAttribute('type', 'button');
                deleteButton.setAttribute('name', 'delete');
                deleteButton.setAttribute('value', 'Delete');
                deleteButton.setAttribute('onClick', 'deleteRow("logTable", '+id+')');
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
    req.send("/insert-plan?" + param);
    event.preventDefault();
});


//Deleting a log entry
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
    var param = "/delete-log-entry";
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