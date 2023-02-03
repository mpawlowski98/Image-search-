import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const input = document.querySelector('input');
const btn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const more = document.querySelector('.load-more');
const moreDiv = document.querySelector('.load-btn');

let page;

const parameters = {
  KEY: '32273532-93ec3ca64628767a4a46a9f0b',
  IMG_TYPE: 'photo',
  ORIENTATION: 'horizontal',
  SAFE_SEARCH: 'true',
  PER_PAGE: 40,
};

const { KEY, IMG_TYPE, ORIENTATION, SAFE_SEARCH, PER_PAGE } = parameters;

let simple = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

async function takeData(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${KEY}&q=${input.value}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&per_page=${PER_PAGE}}&page=${page}`
  );
  const ArrayOfObjects = await response.data;
  if (ArrayOfObjects.total == 0) {
    moreDiv.style.display = 'none';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    moreDiv.style.display = 'flex';
    Notiflix.Notify.success(`We find ${ArrayOfObjects.totalHits} images !!`);
  }
  const itemsMap = ArrayOfObjects.hits
    .map(item => {
      return `<div class="img__card"><a href="${item.largeImageURL}">
    <img class ="img__open" src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: ${item.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${item.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${item.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${item.downloads}</b>
      </p>
    </div>
  </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', itemsMap);
  simple.refresh();
}

async function nextPage(e) {
  e.preventDefault();
  page += 1;
  const response = await axios.get(
    `https://pixabay.com/api/?key=${KEY}&q=${input.value}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFE_SEARCH}&per_page=${PER_PAGE}}&page=${page}`
  );
  const ArrayOfObjects = await response.data;
  if (ArrayOfObjects.totalHits <= PER_PAGE) {
    moreDiv.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const itemsMap = ArrayOfObjects.hits
    .map(item => {
      return `<div class="img__card">
      <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${item.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${item.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${item.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${item.downloads}</b>
        </p>
      </div>
    </div>`;
    })
    .join('');
  simple.refresh();
  gallery.insertAdjacentHTML('beforeend', itemsMap);
}

btn.addEventListener('click', takeData);
more.addEventListener('click', nextPage);
