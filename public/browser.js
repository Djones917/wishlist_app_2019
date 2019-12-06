document.addEventListener("click", function(e) {
    if(e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter you new text!");
       axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
           // Do something here interesting
       }).catch(function() {
           console.log("Please try again later!");
       });
    }
});

