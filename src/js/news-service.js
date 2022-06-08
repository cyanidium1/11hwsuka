import axios from 'axios';

export class UnsplashApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '27891159-be6e7cac58428882c4b36c938';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        q: this.searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: this.page,
      },
    });
  }

  incrementPage() {
    this.page += 1;
  }

  newPage() {
    this.page = 1;
  }
}
