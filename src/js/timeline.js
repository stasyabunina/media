import Card from "./card";

export default class Timeline {
  constructor(element) {
    this.element = element;
    this.list = [];
    this.coords = {};
  }

  init() {
    this.listElement = this.element.querySelector(".timeline__list");
    this.input = this.element.querySelector(".timeline__input");
    this.form = this.element.querySelector(".timeline__form");
    this.createCardBtnEventListener();
  }

  createCardBtnEventListener() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.input.value.trim() === "") {
        this.showCreateCardInputError();
      } else {
        if (Object.keys(this.coords).length === 0) {
          this.checkGeoLocation();
        } else {
          this.createCard(this.coords.latitude, this.coords.longitude);
        }
      }
    });
  }

  showCreateCardInputError() {
    if (this.element.querySelector(".timeline__error")) {
      this.element.querySelector(".timeline__error").remove();
    }

    const error = document.createElement("span");
    error.classList.add("timeline__error");
    error.textContent = "Поле не может быть пустым.";

    this.form.after(error);
    this.form.classList.add("timeline__form_error");
  }

  createCard(latitude, longitude) {
    const newCard = new Card(this.listElement);
    newCard.createElement(this.input, latitude, longitude);
    this.list.push(newCard);

    this.form.reset();

    if (this.element.querySelector(".timeline__error")) {
      this.element.querySelector(".timeline__error").remove();
      this.form.classList.remove("timeline__form_error");
    }
  }

  checkGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.createCard(latitude, longitude);
        },
        (position) => {
          this.createModal();
          console.error(position.message);
        }
      );
    } else {
      this.createModal();
    }
  }

  createModal() {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal__container");

    const title = document.createElement("h2");
    title.classList.add("modal__title");
    title.textContent = "Что-то пошло не так";

    const errorText = document.createElement("p");
    errorText.classList.add("modal__error-text");
    errorText.textContent =
      "К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.";

    const form = document.createElement("form");
    form.classList.add("modal__form");

    const label = document.createElement("label");
    label.classList.add("modal__label");

    const coordsText = document.createElement("span");
    coordsText.classList.add("modal__coords-text");
    coordsText.textContent = "Широта и долгота через запятую";

    const input = document.createElement("input");
    input.classList.add("modal__input");
    input.placeholder = "Например: 51.50834, -0.23124";

    const modalBtns = document.createElement("div");
    modalBtns.classList.add("modal__btns");

    const submitBtn = document.createElement("button");
    submitBtn.classList.add("modal__submit");
    submitBtn.textContent = "ОК";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.classList.add("modal__cancel");
    cancelBtn.textContent = "Отмена";

    document.body.append(modal);
    modal.append(modalContainer);
    modalContainer.append(title);
    modalContainer.append(errorText);
    modalContainer.append(form);
    form.append(label);
    label.append(coordsText);
    label.append(input);
    form.append(modalBtns);
    modalBtns.append(cancelBtn);
    modalBtns.append(submitBtn);

    this.modalElement = modal;

    cancelBtn.addEventListener("click", () => {
      this.modalElement = null;
      modal.remove();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const obj = this.checkGeoValidation(input.value);

      if (obj.valid) {
        this.createCard(obj.latitude, obj.longitude);
        this.coords = { latitude: obj.latitude, longitude: obj.longitude };
        this.modalElement = null;
        modal.remove();
      } else {
        this.showCoordsInputError(obj.message);
      }
    });
  }

  showCoordsInputError(value) {
    if (this.modalElement.querySelector(".modal__error")) {
      this.modalElement.querySelector(".modal__error").remove();
      this.modalElement
        .querySelector(".modal__input")
        .classList.remove("modal__input_error");
    }

    const error = document.createElement("span");
    error.classList.add("modal__error");
    error.textContent = value;

    this.modalElement.querySelector(".modal__input").after(error);
    this.modalElement
      .querySelector(".modal__input")
      .classList.add("modal__input_error");
  }

  checkGeoValidation(coords) {
    if (coords.trim().indexOf(",") !== -1) {
      let latNewValue;
      let longNewValue;

      const coordsArr = coords.trim().split(",");

      if (coordsArr[0].startsWith("[")) {
        latNewValue = coordsArr[0].slice(1, coordsArr[0].length);
      } else {
        latNewValue = coordsArr[0];
      }

      if (coordsArr[1].endsWith("]")) {
        longNewValue = coordsArr[1].slice(0, coordsArr[1].length - 1);
      } else {
        longNewValue = coordsArr[1];
      }

      const latitudeValue = parseFloat(latNewValue.trim());
      const longitudeValue = parseFloat(longNewValue.trim());

      if (
        /^-?[0-9]*[.]{0,1}[0-9]+$/.test(latitudeValue) === false ||
        /^-?[0-9]*[.]{0,1}[0-9]+$/.test(longitudeValue) === false
      ) {
        return {
          valid: false,
          message: `Поле не должно содержать букв или специальных символов. ${coordsArr}`,
        };
      } else if (latitudeValue > 90) {
        return {
          valid: false,
          message: "Значение широты не должно превышать 90.",
        };
      } else if (latitudeValue < -90) {
        return {
          valid: false,
          message: "Значение широты не должно быть ниже -90.",
        };
      } else if (longitudeValue > 180) {
        return {
          valid: false,
          message: "Значение долготы не должно превышать 180.",
        };
      } else if (longitudeValue < -180) {
        return {
          valid: false,
          message: "Значение долготы не должно быть ниже -180.",
        };
      } else if (coordsArr.length > 2 || coordsArr.length < 2) {
        return {
          valid: false,
          message:
            "Убедитесь, что поле содержит два значения: широту и долготу.",
        };
      } else {
        return {
          valid: true,
          latitude: latitudeValue,
          longitude: longitudeValue,
        };
      }
    } else if (coords.trim() === "") {
      return { valid: false, message: "Поле не может быть пустым." };
    } else if (/^-?[0-9]*[.]{0,1}[0-9]+$/.test(coords.trim()) === false) {
      return {
        valid: false,
        message: "Поле не должно содержать букв или специальных символов.",
      };
    } else {
      return {
        valid: false,
        message: "Убедитесь, что поле содержит два значения: широту и долготу.",
      };
    }
  }
}
