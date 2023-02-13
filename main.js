let submitForm = document.querySelector('#search-form');
const pixaBayURL = "https://pixabay.com/api/";
const apiKey = "33442830-1287a161e55eee9cb5de1bced";
const image_type = "photo";
const contentTemplate = document.querySelector('#content-template'); // remove id etc
contentTemplate.remove();
// doesnt work
delete contentTemplate.id;

let mainElement = document.querySelector('main');
let previousButton = document.querySelector('#previous-button');
let nextButton = document.querySelector('#next-button');
const per_page = 10;

let responseJson;
let searchWord;
let chosenColor;
let pageState = {
    pageNumber: 0,
    pageMax: 0
}

submitForm.onsubmit = async event => {
    event.preventDefault();

    searchWord = submitForm.searchField.value;
    chosenColor = submitForm.colorSelection.value;

    let url = 'https://pixabay.com/api/?' +
        '&q=' + searchWord +
        '&image_type=' + image_type +
        '&per_page=' + per_page +
        '&key=' + apiKey;

    if (chosenColor !== "any-color") {
        url += '&colors=' + chosenColor;
    }

    searchResponse = await fetch(url);
    responseJson = await searchResponse.json();

    if (responseJson.totalHits !== 0) {
        pageState.pageNumber = 1;
        pageState.pageMax = Math.ceil(responseJson.totalHits/per_page);
        loadImages(responseJson, pageState.pageNumber);
    }
}

function loadImages(responseJson, pageNumber) {
    while (mainElement.firstChild) {
        mainElement.removeChild(mainElement.firstChild);
    }

    for (let [i, hit] of responseJson.hits.entries()) {
        let newPost = contentTemplate.cloneNode(true);

        newPost.setAttribute('id', 'hit-' + i);

        let postImage = newPost.querySelector('img');
        let postTags = newPost.querySelector('.tags');
        let postPhotographer = newPost.querySelector('span');

        postImage.setAttribute('src', hit.largeImageURL);
        postTags.textContent = hit.tags;
        postPhotographer.textContent = hit.user;

        mainElement.append(newPost);
    }

    setButtonAttributes();
}

function setButtonAttributes() {
    if (pageState.pageNumber === 1) {
        nextButton.removeAttribute('hidden');
        if (pageState.pageNumber !== pageState.pageMax) {
            nextButton.removeAttribute('disabled');
        }
        previousButton.removeAttribute('hidden');
        previousButton.setAttribute('disabled', '');
    }
    if (pageState.pageNumber < pageState.pageMax && pageState.pageNumber > 1) {
        nextButton.removeAttribute('disabled');
        previousButton.removeAttribute('disabled');
    }

    if (pageState.pageNumber === pageState.pageMax) {
        nextButton.removeAttribute('hidden');
        nextButton.setAttribute('disabled', '');
        previousButton.removeAttribute('hidden');
        previousButton.removeAttribute('disabled');
    }
}

nextButton.onclick = async clickEvent => {
    pageState.pageNumber ++;

    let url = 'https://pixabay.com/api/?' +
        '&q=' + searchWord +
        '&image_type=' + image_type +
        '&per_page=' + per_page +
        '&key=' + apiKey +
        '&page=' + pageState.pageNumber ;

    if (chosenColor !== "any-color") {
        url += '&colors=' + chosenColor;
    }

    searchResponse = await fetch(url);
    responseJson = await searchResponse.json();

    loadImages(responseJson, pageState.pageNumber);
}

previousButton.onclick = async clickEvent => {
    pageState.pageNumber --;

    let url = 'https://pixabay.com/api/?' +
        '&q=' + searchWord +
        '&image_type=' + image_type +
        '&per_page=' + per_page +
        '&key=' + apiKey +
        '&page=' + pageState.pageNumber ;

    if (chosenColor !== "any-color") {
        url += '&colors=' + chosenColor;
    }

    searchResponse = await fetch(url);
    responseJson = await searchResponse.json();

    loadImages(responseJson, pageState.pageNumber);
}


// parameters:
// key
// q (str) - A URL encoded search term. If omitted, all images are returned. May not exceed 100 characters.
// image_type (str)
// colors (str)
// page (int) - Returned search results are paginated. Use this parameter to select the page number. Default: 1
// per_page (int) - Determine the number of results per page.

// Response:
// totalHits
// hits[index].previewURL
// hits[index].tag
// hits[index].user

