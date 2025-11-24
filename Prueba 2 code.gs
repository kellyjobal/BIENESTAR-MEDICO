/********************************************
 * Renderiza el index.html
 ********************************************/
function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Control Documental")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/********************************************
 * Incluye archivos HTML (CSS / JS)
 ********************************************/
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/********************************************
 * Obtiene todos los datos de la hoja "Control"
 * Encabezados en fila 2
 * Datos desde fila 3 hacia abajo
 ********************************************/
function getControlData() {
  const ss = SpreadsheetApp.openById("1eoul6TueVAURkXZF35orUPwsIbtpL5O_RUoFP4E0Z_I");
  const sheet = ss.getSheetByName("Control");

  const lastRow = sheet.getLastRow();
  const lastCol = 22; // Columnas A → V

  if (lastRow < 2) {
    return {
      headers: [],
      data: []
    };
  }

  // Encabezados en fila 2 → columnas A–V
  const headers = sheet.getRange(2, 1, 1, lastCol).getValues()[0];

  // Datos desde fila 3 → columnas A–V
  const data = sheet.getRange(3, 1, lastRow - 2, lastCol).getValues();

  return {
    headers,
    data
  };
}
