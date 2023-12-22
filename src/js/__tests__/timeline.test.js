import Timeline from "../timeline";

test.each([
  ["51.50851, -192345.12572", "Значение долготы не должно быть ниже -180."],
  ["dasdasdas", "Поле не должно содержать букв или специальных символов."],
  ["", "Поле не может быть пустым."],
  ["0", "Убедитесь, что поле содержит два значения: широту и долготу."],
  ["21251.50851, -0.12572", "Значение широты не должно превышать 90."],
])("testing if coords are invalid", (value, expected) => {
  const timeline = new Timeline();

  timeline.checkGeoValidation(value);
  const receivedMessage = timeline.checkGeoValidation(value).message;

  expect(receivedMessage).toBe(expected);
});

test("testing if coords are valid", () => {
  const timeline = new Timeline();

  const value = "51.50851, -0.12572";
  const received = timeline.checkGeoValidation(value);

  expect(received.valid).toBeTruthy();
});
