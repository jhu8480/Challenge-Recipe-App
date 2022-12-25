//global variables
const meals = document.getElementById('meals');


// Execution
getRandomMeal();


// function declarations
async function getRandomMeal() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const responseData = await response.json();
  const randomMeal = responseData.meals[0];

  console.log(randomMeal);
  addMeal(randomMeal, true);
}

async function getMealById(id) {
  const meal = await fetch('www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);
}

async function getMealsBySearch(term) {
  const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);
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

  meals.appendChild(meal);
}