/********************************************
 * Renderiza index.html
 ********************************************/
function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Control Documental")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/********************************************
 * Importar otros archivos HTML
 ********************************************/
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/********************************************
 * Obtener datos desde la hoja "Control"
 * A → V (22 columnas)
 * Fila 2 = encabezados
 * Fila 3→ = datos
 ********************************************/
function getControlData() {
  const ss = SpreadsheetApp.openById("1eoul6TueVAURkXZF35orUPwsIbtpL5O_RUoFP4E0Z_I");
  const sheet = ss.getSheetByName("Control");

  if (!sheet) {
    return { headers: [], data: [] };
  }

  const lastRow = sheet.getLastRow();
  const lastCol = 22;  // Columnas A–V

  if (lastRow < 3) {
    return { headers: [], data: [] };
  }

  // Encabezados (fila 2)
  const headers = sheet.getRange(2, 1, 1, lastCol).getDisplayValues()[0];

  // Datos desde fila 3 → última fila
  // ¡Aquí está el ajuste importante!
  // getDisplayValues() respeta el formato DD/MM/YYYY
  const data = sheet.getRange(3, 1, lastRow - 2, lastCol).getDisplayValues();

  return {
    headers,
    data
  };
}
