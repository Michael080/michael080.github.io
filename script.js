//DOM Selectors
//carousel
const carousel = document.querySelector('.carousel');
//buttons
const previous = document.querySelector('#carousel-button-previous');
const next = document.querySelector('#carousel-button-next');
//images
const imageCollection = document.querySelectorAll('.carousel-image');
const description = document.querySelector('.description');
//description
const title = document.querySelector('.title');
const published = document.querySelector('.published');
const director = document.querySelector('.director');
const starring = document.querySelector('.starring');
let infoAnimation = document.querySelector('.info-animation');
//progress bar
const progressBars = document.querySelectorAll('.bar');
//TODO --- Remove- after progress-bar refactored
//Reference values
let counter = 0;  //for iteration
let start = 0;
let end = imageCollection.length - 1;

//Images & image data
let imageData = Array();

//Store state information
class Carousel {
    constructor(current, previous, next, image, description, transition, progBar) {
        this.current = current;
        this.previous = previous;
        this.next = next;
        this.image = image;
        this.description = description;
        this.transition = transition;
        this.progBar = progBar;
    }

    getCurrent(){
        return this.current;
    }

    setCurrent(slide){
        this.current = slide;
    }

    setPrev() {
        this.previous = this.current.previousSlide;
    }

    setNext() {
        this.next = this.current.nextSlide;
    }

    // Update previous/next properties
    updateActions(){
        this.setPrev();
        this.setNext();
    }
}

class Film {
    constructor(
        title, year, director, starring, imdbLink, image, previousSlide, nextSlide,
                previousBar, nextBar, currentSlide, filmInfoDOM, value, state, filmID
    ) {
        this.title = title;
        this.year = year;
        this.director = director;
        this.starring = starring;
        this.imdbLink = imdbLink;
        this.image = image;
        this.previousSlide = previousSlide;
        this.nextSlide = nextSlide;
        this.previousBar = previousBar;
        this.nextBar = nextBar;
        this.currentSlide = currentSlide;
        this.filmInfoDOM = filmInfoDOM;
        this.value = false;
        this.state = '!currentSlide'; //state can be either '!currentSlide' || 'currentSlide'
        this.filmID = filmID; //create w/ saveFilmArray()
    }

    findAdjacent(slidesArray = slideStore){
        const firstIndex = 0;
        const lastIndex = slidesArray.length - 1;
        const firstSlide = slidesArray[firstIndex];
        const lastSlide = slidesArray[lastIndex];

        if (this.filmID === firstIndex) {
            this.previousSlide = lastSlide;
            this.nextSlide = slidesArray[this.filmID+1];
        } else if (this.filmID === lastIndex) {
            this.previousSlide = slidesArray[this.filmID-1];
            this.nextSlide = firstSlide;
        }else {
            this.previousSlide = slidesArray[this.filmID-1];
            this.nextSlide = slidesArray[this.filmID+1];
        }
    }

    adjacentProgBars(slidesArray = slideStore){
            this.nextBar = this.nextSlide.progBar;
            this.previousBar = this.previousSlide.progBar;
    }

    set setImage(setImage) {
        this.image = setImage;
    }
}

let joker = new Film(
    'Joker', 2019, 'Todd Phillips', 'Joaquin Phoenix',
    'https://www.imdb.com/title/tt7286456/'
);

let babyDriver = new Film(
    'Baby Driver', 2017, 'Edgar Wright', 'Ansel Elgort',
    'https://www.imbd.com/title/tt3890160/'
);

let unknown = new Film(
    'unknown', "n/a", 'Who Knows', 'Creepy Family',
    "n/a"
);

let slideshow = () => toggleSlides('next');

let changeSlide = (event) => {
    let clicked = event.target.classList[0]; //ID which button was clicked
    //Update slide display
    toggleSlides(clicked);
}

let toggleSlides = (action) => {
    // Hide current
    let current = carouselState.getCurrent();
    toggleClass(current.image);
    toggleClass(current.filmInfoDOM, 'description-visible');
    toggleClass(current.progBar, 'active');
    // Display target
    let target = carouselState[action];
    toggleClass(target.image);
    toggleClass(target.filmInfoDOM, 'description-visible');
    toggleClass(target.progBar, 'active');
    // Update carouselState.current
    carouselState.setCurrent(target);
    carouselState.updateActions();
}

let makeDescription = (film) => {
    let descriptionDiv = makeElement('div', 'description', 'info-animation');
    descriptionDiv.id = 'image-info';
    descriptionDiv.innerHTML =
        `<h3 class="title">${film.title}<span class="published"></span></h3>
        <ul class="details">
            <li class="director"><span class="sub-title">Director: </span>${film.director}</li>
            <li class="starring"><span class="sub-title">Starring: </span>${film.starring}</li>
            <li class="imdb"><a class="imdb-link" href="${film.imdbLink}"><img src="logos/imdb_logo.png" alt="IMDB logo and link to film page" class="imdb-logo"></a></li>
        </ul>`;
    return descriptionDiv;
}

// Create description and add to DOM
let createFilmDescription = (film, slidesArray = slideStore) => {
   let descriptionDiv = makeDescription(film);
    //make info for first slide visible
    let firstSlide = slidesArray[0];
    if (film === firstSlide) {
        toggleClass(descriptionDiv, 'description-visible');
    }
    return descriptionDiv;
}

let makeElement = (type, ...htmlClasses) => {
    let elem = document.createElement(type);
    htmlClasses.forEach(clss => elem.classList.add( clss ));
    return elem;
}

let updateDOM = element => carousel.appendChild(element);

let addDescriptionsToDOM = (array = slideStore) => {
    array.forEach(slide => updateDOM(slide.filmInfoDOM));
}

let toggleClass = (elem, propValue = 'carousel-item-visible') => {
    if (elem.tagName === 'IMG'){
        elem.parentNode.classList.toggle(propValue);
    } else {
        elem.classList.toggle(propValue);
    }
}

//Add object/s to array
let addToArray = (array, ...objects) => objects.forEach(obj => array.push(obj));

let slideStore = new Array;  // for containing each slide object
addToArray(slideStore, joker, babyDriver, unknown);

//update IDs, and set image,previousSlide/nextSlide on each object
for (let slide of slideStore) {
    let currentIndex = slideStore.indexOf(slide);
    slide.progBar = progressBars[currentIndex];
    slide.filmID = currentIndex; // set filmID property
    slide.filmInfoDOM = createFilmDescription(slide, slideStore); // create innerHTML (title, director, etc,.)
    slide.setImage = imageCollection[slide.filmID]; // set image property
    slide.findAdjacent();
}

for (let slide of slideStore) {
    slide.adjacentProgBars();  // set previousSlide & nextSlide properties
}

let carouselState = new Carousel(joker);
carouselState.updateActions(); // update next/previous properties

addDescriptionsToDOM(slideStore);  // Update DOM w/ descriptions
let descriptions = document.querySelectorAll('.description');

previous.addEventListener('click', changeSlide);
next.addEventListener('click', changeSlide);

//Transition 'slides' automatically via timer
let autoSlideTransition = setInterval(slideshow, 10000);