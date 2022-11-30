(function () {

     // https://www.geeksforgeeks.org/search-bar-using-html-css-and-javascript/ 

    // 1. need to create function that takes input from search bar
     var input = document.getElementById("search-input");
        
    // 2. assigns var to that input

    function searchinput(input) {
        let input = document.getElementById('search-input').value
        input=input.toLowerCase();
        let x = document.getElementsByClassName('search');
          
        for (i = 0; i < x.length; i++) { 
            if (!x[i].innerHTML.toLowerCase().includes(input)) {
                x[i].style.display="none";
            }
            else {
                x[i].style.display="list-item";                 
            }
        }
    }

    // 3. var is then crossreferenced w/ "PROPERTY" value in point-foreclosure geo.json

    // 4. if "PROPERTY" matches, map zooms to location of "PROPERTY"

    // 5. text column uses dynamic text to change to a template including "PURCHASER", "PURCHASE", and a count of #
    // of other properties "PURCHASER" has purchased during this time period

    let searchValue = $w("search-input").value;




})();