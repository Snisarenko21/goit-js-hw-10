import './css/styles.css';
// ===именованый импорт файла fetchCountries
import { fetchCountries } from './fetchCountries';
//  ===добавила библиотеки notiflix и lodash
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// ===переменная для задержки вызова функции после события===
const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.style.backgroundColor = 'LightGray';

// ==== повесила слушатель события инпут на поле для ввода с задержкой выполнения функции через 300мс после ввода ===
refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
//  ==== функция для рисования разметки списка стран с оформлением =====
function createListCountryEl(countries) {
  return countries.map(country => `<li style = "list-style-type: none; display:flex; align-items: center" > 
    <img src="${country.flags.svg}" alt="flag" width = "44px" heigth = "auto" /> 
    <p style = "margin-left: 20px; color: blue"> ${country.name.common} </p></li>`,)
    .join('');
}
// ==== функция для рисования разметки карточки одной страны с оформлением ====
function createCardCountryEl(countryName) {
  return countryName.map(country => `<img src="${country.flags.png}" alt="" width ="80px" /> 
    <h2 style = "color: red; font-size: 36px "> ${country.name.official}</h2>
    <p style = "color: green" > Capital: ${country.capital}</p>
    <p style = "color: purple"> Population: ${country.population}</p>
    <p style = "color: blue"> Languages: ${Object.values(country.languages).join(', ')}</p>`,)
    .join('');
}
// ==== функция которая очищает поле для ввода перед новым запросом ====
function clearSearchResult() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
// ======= функция-обработчик события инпут ====
function onInput(e) {
  // ===== запрет браузеру на перезагрузку страницы ===
  e.preventDefault();
  // === проверка на пробелы в поле для ввода вначале и вконце - метод трим ===
  const countryName = e.target.value.trim();
  console.log(countryName);
 // ==== вызываю функцию для очистки поля для ввода ===
  clearSearchResult();
  //  проверяю, если поле пуcтое, то запрос не выполняется ===
  if (countryName === '') {
    return;
  }
fetchCountries(countryName)
  //  ==== обрабатываем вернувшийся результат (промис) с бекенда ===
    .then(countries => {
      console.log(countries);
      //  ==== если вернулось больше 10 стран - выводим сообщение, используя нотифликс ===
      if (countries.length >= 10) {
        console.log('Too many matches found. Please enter a more specific name.');
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');

        // ===если вернулось от 2 до 10 стран - создаем список стран с флагом и названием страны ===
      } else if ((countries.length >= 2) & (countries.length < 10)) {
        // console.log('флаг и имя страны');
        // ===== вызываю функцию создания разметки списка стран и записываю ее результат в переменную =====
        const renderCountryName = createListCountryEl(countries);
        // ===== рендер разметки =====
        refs.countryListEl.insertAdjacentHTML('beforeend', renderCountryName);
        // ==== если вернулась одна страна - создаю карточку с выбраными параметрами:
        // официальное название, флаг, столица, население, языки =====
      } else if (countries.length === 1) {
        // console.log('карточка страны');
        // ===== вызываю функцию создания разметки карточки стран и записываю ее результат в переменную =====
        const renderCountryCard = createCardCountryEl(countries);
        // --------------рендер разметки -------------
        refs.countryInfoEl.insertAdjacentHTML('beforeend', renderCountryCard);
      }
    })
    // === цепляю метод для обработки ошибки ===
    .catch(onFetchError);
}
// === функция для обработки ошибки ====
function onFetchError(error) {
  console.error(error);
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
