(function () {

// Tested out the CHATGPT AI and asked it how to build a web searchfunction w/ autocomplete functionality. Will need to do some 
// updating next week (like not using google API) but this seems really cool. 

    var searchInput = document.getElementById("search-input");
    var searchButton = document.getElementById("search-button");

    // Create an autocomplete object for the search input
    var autocomplete = new google.maps.places.Autocomplete(searchInput);

    // Set the custom data source for the autocomplete feature
    autocomplete.setOptions({
    types: myData.types,
    data: myData.data
    });

    searchButton.addEventListener("click", function() {
    // Get the search query entered by the user
    var query = searchInput.value;

    // Use the query to search for the street address
    // The search results would be displayed on the page in some way (e.g. in a list or table)

    // Once the user selects the desired address, zoom to that location on the map
    map.zoomTo(selectedAddress);
    });
    
    
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