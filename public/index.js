const createForm = document.getElementById("create-form");
const createName = document.getElementById("create-name");
const createAge = document.getElementById("create-age");
const createUserErrMsg = document.getElementById("create-error");

function deleteUser(ID){
    fetch(`/api/users/${ID}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => {
        console.log(res);
    })
    createTable();
};

function updateUser(ID, nameIndex, ageIndex){

    const name = document.getElementById(nameIndex).innerHTML;
    const age = document.getElementById(ageIndex).innerHTML;
    const userUpdate = {
        name: name,
        age: age
    };
    fetch(`/api/users/${ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userUpdate)
    })
    .then(res => res.json())
    .then(response => {
        console.log(JSON.stringify(response));
        //createTable();
    });
};

function showUser(ID){
    fetch(`/api/users/${ID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(response => {
        document.getElementById("showUser").innerHTML = 
        `<h3>Details about user:</h3>
        <p>ID: ${response.ID}<br>
        Name: ${response.name}<br>
        age: ${response.age}</p>
        <h4>User data in Json format:<h4/>
        <p>${JSON.stringify(response)}</p>`


    });
};

// Base code for the function createTable found at https://www.encodedna.com/javascript/populate-json-data-to-html-table-using-javascript.htm
// Modifications made to fulfill lab requirements.
function createTable(){
    fetch("/api/users", {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
        }
    })
    .then(res => res.json())
    .then(response => {
        var col = [];
        for (let i = 0; i < response.length; i++){
            for (let key in response[i]){
                if (key == "_id" || key == "__v"){
                    continue;
                }
                if (col.indexOf(key) === -1){
                    col.push(key);
                }
            }
    
        }
        var table = document.createElement("table");

        var tr = table.insertRow(-1);

        for (let i = 0; i < col.length; i++){
            let th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        for (let i = 0; i < response.length; i++){
            tr = table.insertRow(-1);

            for (let j = 0; j < col.length; j++){
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = response[i][col[j]];
                if (j != 0){
                    tabCell.setAttribute("contenteditable", "true")
                }
                tabCell.id = `${i}${j}`
            }
            // Create delete button for each row
            var tabCell = tr.insertCell(-1);
            var delBtn = document.createElement("button");
            delBtn.innerHTML = "delete"
            delBtn.setAttribute("onclick", `deleteUser(${response[i].ID})`);
            tabCell.appendChild(delBtn)

            // Create update button for each row
            var tabCell = tr.insertCell(-1);
            var updateBtn = document.createElement("button");
            updateBtn.innerHTML = "update"
            updateBtn.setAttribute("onclick",
             `updateUser(${response[i].ID},
                 "${i}1",
                 "${i}2")`);
            tabCell.appendChild(updateBtn)

            // Create details button for each row
            var tabCell = tr.insertCell(-1);
            var detailsBtn = document.createElement("button");
            detailsBtn.innerHTML = "Show Details"
            detailsBtn.setAttribute("onclick",
             `showUser(${response[i].ID})`);
            tabCell.appendChild(detailsBtn)

        };

        let container = document.getElementById("showData");
        container.innerHTML = "";
        container.appendChild(table);
    });
};

createForm.addEventListener("submit", e => {
    e.preventDefault();
    const userDetails = {
        name: createName.value,
        age: createAge.value
    };

    fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(userDetails)
    })
    .then(res => res.json())
    .then(response => {
        if(response.error){
            createUserErrMsg.innerHTML = response.error;
        } else {
            createUserErrMsg.innerHTML = "";
        }
        createTable();
    });
});
