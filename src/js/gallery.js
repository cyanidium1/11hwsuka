import { UnsplashApi } from './news-service';
// import createGalleryCards from '../templates/gallery-card.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const unsplashApi = new UnsplashApi();
loadMoreBtnEl.style.display = 'none';
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const onSearchFormSubmit = async event => {
  event.preventDefault();
  //    loadMoreBtnEl.classList.remove('is-hidden');
  galleryListEl.innerHTML = '';
  unsplashApi.searchQuery = event.currentTarget.elements.searchQuery.value;
  unsplashApi.page = 1;

  try {
    const { data } = await unsplashApi.fetchPhotos();

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtnEl.style.display = 'none';
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

      makeMarkup(data.hits);
      lightbox.refresh();
      loadMoreBtnEl.style.display = 'none';
      loadMoreBtnEl.style.display = 'block';
    }
  } catch (error) {
    console.log('error :', error);
  }
  unsplashApi.incrementPage();
};

const onLoadMoreBtnElClick = async event => {
  try {
    const { data } = await unsplashApi.fetchPhotos();

    let totalPages = Math.ceil(data.totalHits / data.hits.length);

    if (totalPages === unsplashApi.page + 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtnEl.style.display = 'none';
      makeMarkup(data.hits);
      lightbox.refresh();
    } else {
      makeMarkup(data.hits);
      lightbox.refresh();
      unsplashApi.incrementPage();
    }
  } catch (err) {
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);

function makeMarkup(hits) {
  let markup = hits
    .map(hit => {
      return `<li class="photo-card">
        <a class="gallery__item" href="${hit.largeImageURL}">
        <img class="photo-card__img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width=300 height=190/>
  </a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b>
            ${hit.likes}
          </p>
          <p class="info-item">
            <b>Views:</b>
            ${hit.views}
          </p>
          <p class="info-item">
            <b>Comments:</b>
            ${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b>
            ${hit.downloads}
          </p>
        </div>
      </li>`;
    })
    .join('');
  return galleryListEl.insertAdjacentHTML('beforeend', markup);
}
