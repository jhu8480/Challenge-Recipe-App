//global variables
const meals = document.getElementById('meals');


// Execution
getRandomMeal();
fetchFromLS();


// function declarations

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
    ${random ? `<span class="random">check this recipe</span>`: ''}
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
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
  localStorage.setItem('IdMeals', JSON.stringify(IdMeals.filter((id) => {
    id !== IdMeal;
  })));
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
  for (let IdMeal of IdMeals) {
    let favMeal = await getMealById(IdMeal);
    console.log(favMeal);
    addMealToFav(favMeal);
  }
}

function addMealToFav(favMeal) {
  const favList = document.getElementById('fav-list');
  const newListItem = document.createElement('li');
  newListItem.innerHTML = `<img src="${favMeal.strMealThumb}" alt="${favMeal.strMeal}"> <span>${favMeal.strMeal.slice(0, 10).toUpperCase()}</span>`;
  favList.appendChild(newListItem);
}

// --> search bar section
async function getMealsBySearch(term) {
  const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
}


