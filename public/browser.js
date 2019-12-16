// Create Feature

let createField = document.getElementById("create-field");

document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault();

    axios.post('/create-item', { text: x }).then(function () {
        // Do something interesting
        e.target.parentElement.parentElement.remove();
    }).catch(function () {
        console.log("Please try again later!");
    });   
});


document.addEventListener("click", function(e) {
    // Delete Feature
    if (e.target.classList.contains("delete-me")) {
        if(confirm("Delete item permanatly?")) {
            axios.post('/delete-item', {id: e.target.getAttribute("data-id") }).then(function () {
                // Do something interesting
                e.target.parentElement.parentElement.remove();
            }).catch(function () {
                console.log("Please try again later!");
            });
        }
    }

    // Update Feature
    if(e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter you new text!", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
       if(userInput) {
           axios.post('/update-item', { text: userInput, id: e.target.getAttribute("data-id") }).then(function () {
               // Do something interesting
               e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
           }).catch(function () {
               console.log("Please try again later!");
           });
       }
    }
});

