document.addEventListener("click", function(e) {
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

