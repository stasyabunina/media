export default class Card {
  constructor(list) {
    this.list = list;
    this.coords = {};
  }

  createElement(input, latitude, longitude) {
    this.coords.latitude = latitude;
    this.coords.longitude = longitude;

    const li = document.createElement("li");
    li.classList.add("timeline__item");

    const text = document.createElement("p");
    text.classList.add("timeline__text");
    text.textContent = input.value;

    const now = this.formatData();
    const nowArr = now.split(", ");
    const timeElement = document.createElement("span");
    timeElement.classList.add("timeline__time");
    timeElement.textContent = nowArr[0] + " " + nowArr[1].slice(0, -3);

    const coordinates = document.createElement("span");
    coordinates.classList.add("timeline__coords");
    coordinates.textContent = `[${latitude}, ${longitude}]`;

    this.list.prepend(li);
    li.append(timeElement);
    li.append(text);
    li.append(coordinates);

    this.element = li;
  }

  formatData() {
    const date = new Date();
    const formattedDate = date.toLocaleString("ru-RU");

    return formattedDate;
  }
}
