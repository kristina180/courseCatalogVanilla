import "../css/styles.scss";

import { cards } from "./data_card";

const filterElements = document.querySelectorAll(".catalog-filters__button");
const searchInput = document.getElementById("catalog-search-input");
const searchForm = document.querySelector(".catalog-search");
const loadMoreBtn = document.getElementById("load-more-btn");

const departmentColors = {
  Marketing: "rgba(3, 206, 164, 1)",
  Design: "rgba(245, 47, 110, 1)",
  Development: "rgba(119, 114, 241, 1)",
  Management: "rgba(90, 135, 252, 1)",
  "HR & Recruting": "rgba(248, 152, 40, 1)",
};

const cardsPerPage = 9;
let currentIndex = 0;
let filteredCards = cards;
let currentFilter = "all";
let currentSearch = "";

createCardsList();
updateFilterCounts(cards);

searchForm.addEventListener("submit", (e) => e.preventDefault());
filterElements.forEach((btn) => {
  btn.addEventListener("click", () => handleClickFilters(btn));
});
searchInput.addEventListener("input", handleSearchInput);
loadMoreBtn.addEventListener("click", createCardsList);

//обработчик для события изменения инпута (поиск)
function handleSearchInput() {
  currentSearch = searchInput.value.toLowerCase();
  const searchFilteredCards = getSearchedCards();
  updateFilterCounts(searchFilteredCards);
  updateCards();
}

//обработчик нажатия на кнопки фильтров
function handleClickFilters(btn) {
  removeActiveFilter();
  btn.classList.add("catalog-filters__button--active");
  currentFilter = btn.dataset.filter.toLowerCase();
  updateCards();
}

// создание карточки курса
function createCardItem({ image, department, title, price, name }) {
  const card = document.createElement("article");
  card.classList.add("card");

  const img = document.createElement("img");
  img.classList.add("card__image");
  img.src = image;
  img.alt = "Товар";
  card.appendChild(img);

  const info = document.createElement("div");
  info.classList.add("card__info");

  const departmentElement = document.createElement("div");
  departmentElement.classList.add("card__department");
  departmentElement.textContent = department;
  departmentElement.style.backgroundColor =
    departmentColors[department] || "#ccc";
  info.appendChild(departmentElement);

  const titleElement = document.createElement("p");
  titleElement.classList.add("card__title");
  titleElement.textContent = title;
  info.appendChild(titleElement);

  const infoPrice = document.createElement("div");
  infoPrice.classList.add("card__info-price");

  const priceElement = document.createElement("p");
  priceElement.classList.add("card__price");
  priceElement.innerHTML = `$<span class="card__price-number">${price}</span>`;
  infoPrice.appendChild(priceElement);

  const separator = document.createElement("p");
  separator.textContent = " | ";
  infoPrice.appendChild(separator);

  const authorElement = document.createElement("p");
  authorElement.classList.add("card__author");
  authorElement.innerHTML = `by <span class="card__author-name">${name}</span>`;
  infoPrice.appendChild(authorElement);

  info.appendChild(infoPrice);

  card.appendChild(info);

  return card;
}

//отрисовка отфильтрованных карточек или информации об отсутсвии карточек
//отрисовка кнопки Load more в зависимости от условий
function createCardsList() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  if (filteredCards.length === 0) {
    const noCards = document.createElement("div");
    noCards.classList.add("catalog__nocards");
    noCards.textContent = "There are no suitable courses";
    container.appendChild(noCards);
    document.getElementById("load-more-btn").style.display = "none";
    return;
  }

  const cardsToShow = filteredCards.slice(0, currentIndex + cardsPerPage);

  cardsToShow.forEach((data) => {
    const card = createCardItem(data);
    container.appendChild(card);
  });

  currentIndex += cardsPerPage;

  if (currentIndex >= filteredCards.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "flex";
  }
}

//фильтрация карточек по поиску и фильтрам
function updateCards() {
  filteredCards = getSearchedCards();

  if (currentFilter !== "all") {
    filteredCards = filteredCards.filter(
      (card) => card.department.toLowerCase() === currentFilter
    );
  }

  currentIndex = 0;
  createCardsList(filteredCards);
}

//фильтрация карточек по поиску
function getSearchedCards() {
  const query = currentSearch.trim().toLowerCase();

  if (!query) return cards;

  const words = query.split(" ");
  return cards.filter((card) => {
    const searchableText = `
      ${card.title}
      ${card.department}
      ${card.name}
    `.toLowerCase();

    return words.every((word) => searchableText.includes(word));
  });
}

//отрисовка количества на кнопках фильтров
function updateFilterCounts(cardsList) {
  const filtersCount = document.querySelectorAll(".catalog-filters__button");

  filtersCount.forEach((btn) => {
    const filterValue = btn.dataset.filter.toLowerCase();
    let count;

    if (filterValue === "all") {
      count = cardsList.length;
    } else {
      count = cardsList.filter(
        (card) => card.department.toLowerCase() === filterValue
      ).length;
    }

    const countSpan = btn.querySelector(".catalog-filters__button-count");
    countSpan.textContent = ` ${count}`;
  });
}

//удаление класса active у всех кнопок с фильтрами
function removeActiveFilter() {
  const filterElements = document.querySelectorAll(".catalog-filters__button");
  filterElements.forEach((item) => {
    item.classList.remove("catalog-filters__button--active");
  });
}
