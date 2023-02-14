let submitForm = document.querySelector('#search-form');
const pixaBayURL = "https://pixabay.com/api/";
const apiKey = "33442830-1287a161e55eee9cb5de1bced";
const image_type = "photo";
const contentTemplate = document.querySelector('#content-template'); // remove id etc
contentTemplate.remove();
contentTemplate.removeAttribute('id');
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

    let url = buildUrl();

    searchResponse = await fetch(url);
    responseJson = await searchResponse.json();

    // Loads first page if response contains hits
    if (responseJson.totalHits !== 0) {
        pageState.pageNumber = 1;
        pageState.pageMax = Math.ceil(responseJson.totalHits / per_page);
        loadImages(responseJson);
    }
    else {
        pageState.pageNumber = 0;
        pageState.pageMax = 0;
        mainElement.textContent = 'No search result...';

        nextButton.setAttribute('hidden', '');
        previousButton.setAttribute('hidden', '');
    }
}

// Loads images from a respons
function loadImages(responseJson) {
    while (mainElement.firstChild) {
        mainElement.removeChild(mainElement.firstChild);
    }

    // Builds the id attribute for each hit
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

// Set button attributes depending on page state
// Runs when images are loaded into the page
function setButtonAttributes() {
    if (pageState.pageNumber === 1) {
        nextButton.removeAttribute('hidden');

        if (pageState.pageNumber !== pageState.pageMax) {
            nextButton.removeAttribute('disabled');
        }
        else {
            nextButton.setAttribute('disabled', '');
        }

        previousButton.removeAttribute('hidden');
        previousButton.setAttribute('disabled', '');
    }
    else if (pageState.pageNumber < pageState.pageMax && pageState.pageNumber > 1) {
        nextButton.removeAttribute('disabled');
        previousButton.removeAttribute('disabled');
    }
    else if (pageState.pageNumber === pageState.pageMax) {
        nextButton.removeAttribute('hidden');
        nextButton.setAttribute('disabled', '');
        previousButton.removeAttribute('hidden');
        previousButton.removeAttribute('disabled');
    }
}

// Updates page state and fetches the next 'page' of images
nextButton.onclick = async clickEvent => {
    pageState.pageNumber++;

    let url = buildUrl();

    searchResponse = await fetch(url);
    responseJson = await searchResponse.json();

    loadImages(responseJson);
}

previousButton.onclick = async clickEvent => {
    pageState.pageNumber--;

    let url = buildUrl();

    searchResponse = await fetch(url);
    responseJson = await searchResponse.json();

    loadImages(responseJson);
}

function buildUrl() {
    let url = 'https://pixabay.com/api/?' +
        '&q=' + searchWord +
        '&image_type=' + image_type +
        '&per_page=' + per_page +
        '&key=' + apiKey;

    if(pageState.pageNumber !== 0) {
        url += '&page=' + pageState.pageNumber;
    }

    if (chosenColor !== "any-color") {
        url += '&colors=' + chosenColor;
    }

    return url;
}
