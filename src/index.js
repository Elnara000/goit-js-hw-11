import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchImages from './fetchImages';

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('[name="searchQuery"]'),
    button: document.querySelector('[type="submit"]'),
    container: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}


refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let pageNumber = 1;
let inputValue =''
 
async function onSearch(e) {
    e.preventDefault();
    try {        
        refs.loadMoreBtn.classList.remove("is-hidden");
        inputValue = e.currentTarget.elements.searchQuery.value;
        
        const response = await fetchImages(inputValue, pageNumber) 
        if (!response.hits[0]) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')        
        }
        clearHitsContainer()
        renderPhotoCards(response);
        
        pageNumber = 1
    } catch (error) {
        console.log(error.name);
    }
}

async function onLoadMore() {
    try {
        pageNumber += 1
        const response = await fetchImages(inputValue, pageNumber)
        appendMarkup(response)
        const totalPages = Math.ceil(response.totalHits / 40);

        if (pageNumber >= totalPages) {
        refs.loadMoreBtn.classList.add("is-hidden");
        Notify.info("We're sorry, but you've reached the end of search results.")
        };
    } catch (error) {
        console.log(error.name);
    }
    
}

function renderPhotoCards(photos) {
    refs.container.innerHTML = renderMarkup(photos);

}

function  appendMarkup(photos) {
    refs.container.insertAdjacentHTML('beforeend', renderMarkup(photos))
}

function renderMarkup(photos) {
    return photos.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width = '200'/>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>`)
    .join('');
}

function clearHitsContainer() {
    refs.container.innerHTML = '';
}
