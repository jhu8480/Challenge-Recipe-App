//global variables
const meals = document.getElementById('meals');
const storageArray = getIdMealsFromLS();
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
searchBtn.addEventListener('click', async () => {
  const searched = searchTerm.value;
  const searchResult = await getMealsBySearch(searched);
  showSearchResult(searchResult);
});



// Execution

getRandomMeal();
setInterval(reload, 20000);
fetchFromLS();



// function declarations
function reload() {
  meals.innerHTML = '';
  getRandomMeal();
}


// --> Random meals section
async function getRandomMeal() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const responseData = await response.json();
  const randomMeal = responseData.meals[0];
  addMeal(randomMeal, true);
}

function addMeal(mealData, random = false) {
  const meal = document.createElement('div');
  meal.classList.add('meal');
  meal.innerHTML = `
  <div class="meal-header">
    ${random ? `<span class="random">Random recipe</span>`: ''}
    <a href="${mealData.strSource}" target="_blank">
      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </a>
  </div>
  <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
      <i class="fa fa-heart"></i>
    </button>
  </div>`;

  const btn = meal.querySelector('.meal-body .fav-btn');
  btn.addEventListener("click", function () {
    if(btn.classList.contains('active')) {
      removeIdMealFromLS(mealData.idMeal);
      btn.classList.remove('active');
    } else {
      addIdMealToLS(mealData.idMeal);
      btn.classList.add('active');
    }
    
    document.getElementById('fav-list').innerHTML = '';
    fetchFromLS()
  });

  meals.appendChild(meal);
}

function getIdMealsFromLS() {
  const IdMeals = JSON.parse(localStorage.getItem('IdMeals'));
  return IdMeals === null ? [] : IdMeals;
}

function addIdMealToLS(IdMeal) {
  const IdMeals = getIdMealsFromLS();
  localStorage.setItem('IdMeals', JSON.stringify([...IdMeals, IdMeal]));
}

function removeIdMealFromLS(IdMeal) {
  const IdMeals = getIdMealsFromLS();
  const newArray = IdMeals.filter((element) => element !== IdMeal);
  localStorage.setItem('IdMeals', JSON.stringify(newArray));
}


// --> my favorite meals section
async function getMealById(id) {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
  const responseData = await response.json();
  const meal = responseData.meals[0];
  return meal;
}

async function fetchFromLS() {
  const IdMeals = getIdMealsFromLS();
  for (let i = 0; i < IdMeals.length; i++) {
    let favMeal = await getMealById(IdMeals[i]);
    addMealToFav(favMeal);
  }
}

function addMealToFav(favMeal) {
  const favList = document.getElementById('fav-list');
  const newListItem = document.createElement('li');
  newListItem.innerHTML = `
  <a href="${favMeal.strYoutube}" target="_blank">
    <img src="${favMeal.strMealThumb}" alt="${favMeal.strMeal}">
  </a> 
  <span>
    ${favMeal.strMeal.slice(0, 10).toUpperCase()}
  </span>
  <button class="clear">
    <i class="fa-solid fa-square-minus"></i>
  </button>`;

  const btn = newListItem.querySelector('.clear');
  btn.addEventListener('click', () => {
    removeIdMealFromLS(favMeal.idMeal);
    document.getElementById('fav-list').innerHTML = '';
    fetchFromLS();
  });

  favList.appendChild(newListItem);
}



// --> search bar section
async function getMealsBySearch(term) {
  const searchResponse = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

  const responseData = await searchResponse.json();
  const meals = responseData.meals;
  console.log(meals)
  return meals;
}

function showSearchResult(searchResult) {
  const randomContainer = document.getElementById('meals');
  randomContainer.innerHTML = '';
  const newDiv = document.createElement('div');
  newDiv.classList.add('meal');
  newDiv.innerHTML = `
  <div class="meal-header">
    ${`<span class="random">Search Result</span>`}
    <a href="${searchResult[0].strSource}" target="_blank">
      <img src="${searchResult[0].strMealThumb}" alt="${searchResult[0].strMeal}">
    </a>
  </div>
  <div class="meal-body">
    <h4>${searchResult[0].strMeal}</h4>
    <button class="fav-btn">
      <i class="fa fa-heart"></i>
    </button>
  </div>`;

  const button = newDiv.querySelector('.fav-btn');
  button.addEventListener('click', () => {
    if(button.classList.contains('active')) {
      removeIdMealFromLS(searchResult[0].idMeal);
      button.classList.remove('active');
    } else {
      addIdMealToLS(searchResult[0].idMeal);
      button.classList.add('active');
    }
    
    document.getElementById('fav-list').innerHTML = '';
    fetchFromLS()
  })
  
  
  console.log(searchResult);
  randomContainer.appendChild(newDiv);
}




