import Notiflix from "notiflix";
import simpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const API = '27914818-5e05e7f617900cef74ea356f6';

const button = document.querySelector('.button');
const loadMore = document.querySelector('.load-more');
const input = document.querySelector('.input');
const kudaSuda = document.querySelector('.aww-shit-here-we-go-again');
function galleryRender (kek) {
    return kek.map(el=>`<div class="photo-card">
        <img src="${el.previewURL}" alt="${el.tags}" data="${el.largeImageURL}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b style='font-size: 18px'>Likes: ${el.likes}</b>
          </p>
          <p class="info-item">
            <b style='font-size: 18px'>Views: ${el.views}</b>
          </p>
          <p class="info-item">
            <b style='font-size: 18px'>Comments: ${el.comments}</b>
          </p>
          <p class="info-item">
            <b style='font-size: 18px'>Downloads: ${el.downloads}</b>
          </p>
        </div>
      </div>`).join("")
}
let userInput = null;
let pages = 1;
button.addEventListener('click', event=>{
    userInput = input.value;
    kudaSuda.innerHTML = '';
    
    fetch(`https://pixabay.com/api/?key=${API}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pages}`)
    .then(resp => {
        if (!resp.ok) {
            Notiflix.Notify.failure('some error')
            throw new Error(resp.status)
        }
        return resp.json()
    })
    .then (data => {
        if (data.hits.length === 0) {
            Notiflix.Notify.failure('no variants');
        }
        loadMore.style.display = 'block';
        Notiflix.Notify.success('ok');
        return galleryRender(data.hits)})
    .then(kek=>kudaSuda.insertAdjacentHTML("beforeend", kek))
    .catch(err => console.log(err));
})
loadMore.addEventListener('click', event=>{
    pages+=1;
    fetch(`https://pixabay.com/api/?key=${API}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pages}`)
        .then(resp => resp.json)
        .then (data => {
            // loadMore.style.display = 'block';
            Notiflix.Notify.success('ok');
            return galleryRender(data.hits)})
        .then(kek=>kudaSuda.insertAdjacentHTML("beforeend", kek))
        .catch(err => console.log(err));
})