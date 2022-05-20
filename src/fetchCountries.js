
export function fetchCountries(name) {
  // переменная для параметров запроса
  const params = 'name,capital,population,flags,languages';
  const url = `https://restcountries.com/v3.1/name/${name}?fields=${params}`;
  return fetch(url).then(response => {
    // проверяю, если статус респонса не ок - то создаем новую ошибку
    if (!response.ok) {
      throw new Error(response.message);
    }
    return response.json();
  });
}