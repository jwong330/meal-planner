//Creating a new plan
document.getElementById('addPlanSubmit').addEventListener('click', function(event) {
    
    //Get the form
    var planForm = document.getElementById("addPlanForm");

    //Create new HTTP request
    var req = new XMLHttpRequest();

    //Create a string that contains the parameters to insert in get request
    var param = "name="+planForm.elements.pname.value+
                "&user_id="+planForm.elements.uidFilter.value;

    //Open the post request
    req.open("POST", "/insert-plan?" + param, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    //Once loading is done, add to the plans table
    req.addEventListener('load', function() {
        if(req.status >= 200 && req.status < 400) {

            //Save the id of the newly inserted element
            var response = JSON.parse(req.responseText);
            console.log(response);
            var id = response.inserted;

            //Get the table
            var table = document.getElementById("plansTable");

            //Passing -1 into insertRow creates a new row at the bottom of the table
            var row = table.insertRow(-1);

            //Create a cell for the plan id
            var idVal = document.createElement('td');
            idVal.textContent = id;
            row.appendChild(idVal);

            //Create a cell for the plan name
            var planVal = document.createElement('td');
            planVal.textContent = planForm.elements.pname.value;
            row.appendChild(planVal);

            //Create a cell for the user id
            var userVal = document.createElement('td');
            userVal.textContent = planForm.elements.uidFilter.value;
            row.appendChild(userVal);

            //Create a cell with a delete button
            //The button calls the deleteRow function
            var deleteCell = document.createElement('td');
            var deleteButton = document.createElement('input');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('name', 'delete');
            deleteButton.setAttribute('value', 'Delete');
            deleteButton.setAttribute('onClick', 'deleteRow("plansTable", '+id+')');
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
    var param = '/delete-plans';
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

