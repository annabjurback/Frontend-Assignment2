let submitForm = document.querySelector('#search-form');
const pixaBayURL = "https://pixabay.com/api/";
const apiKey = "33442830-1287a161e55eee9cb5de1bced"; 
const image_type = "photo";
const per_page = 10;

let searchResponse;
let searchWord = submitForm.searchField.value;
let chosenColor = submitForm.colorSelection.value;

submitForm.onsubmit = async event => {
    event.preventDefault();

    searchResponse = await fetch(
        'https://pixabay.com/api/?' +
        '&q=' + submitForm.searchField.value +
        '&image_type=' + image_type + 
        '&per_page=' + per_page + 
        '&colors=' + submitForm.colorSelection.value +
        '&key=' + apiKey
        );

    let json = await searchResponse.json();
}

// parameters: 
// key
// q (str) - A URL encoded search term. If omitted, all images are returned. May not exceed 100 characters.
// image_type (str)
// colors (str)
// page (in) - Returned search results are paginated. Use this parameter to select the page number. Default: 1
// per_page (int) - Determine the number of results per page. 

// Response:
// totalHits
// hits[index].previewURL
// hits[index].tag
// hits[index].user

