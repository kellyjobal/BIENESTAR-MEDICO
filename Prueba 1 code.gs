// ==================== CONFIG ====================

// Asegúrate de que SPREADSHEET_ID esté declarada en otra parte de tu proyecto o como una constante global.

const CONTROL_SHEET_NAME = "Control";



// ==================== SERVIR HTML - CORREGIDO ====================

// Esta función sirve el archivo 'index.html' con los modos de compatibilidad necesarios.

function doGet() {

  return HtmlService.createHtmlOutputFromFile('index')

      .setTitle('Dashboard Control Documentos Médicos')

      .setSandboxMode(HtmlService.SandboxMode.IFRAME) 

      .addMetaTag('viewport', 'width=device-width, initial-scale=1') 

      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); 

}



// ==================== OBTENER DATOS ====================

// Esta función lee todos los datos, calcula el resumen y prepara los arrays para el gráfico.

function getControlData() {

  // Nota: Asumo que SPREADSHEET_ID es una constante accesible en tu entorno de Apps Script.

  try {

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const sheet = ss.getSheetByName(CONTROL_SHEET_NAME);

    if (!sheet) throw new Error("La hoja '" + CONTROL_SHEET_NAME + "' no existe.");



    const values = sheet.getDataRange().getValues();

    if (values.length < 2) return {

      especialidades: [],

      promedioCumplimiento: [],

      totalMedicos: 0,

      promedioGeneral: '0',

      detalleMedicos: []

    };



    // Fila 2: cabecera

    const headers = values[1]; 

    // Desde fila 3 en adelante

    const data = values.slice(2); 



    const resumen = {};

    const detalleMedicos = [];



    data.forEach(row => {

      // Columna A (índice 0)

      const especialidad = row[0] || "NO REGISTRA"; 

      // Columna B

      const cedula = row[1] || ""; 

      // Columna C

      const nombre = row[2] || ""; 

      // Última columna (Cumplimiento)

      const cumplimiento = parseFloat((row[row.length - 1] || "0").replace("%", "")); 



      // Datos para resumen por especialidad

      if (!resumen[especialidad]) resumen[especialidad] = { total: 0, sumCumpl: 0 };

      resumen[especialidad].total++;

      resumen[especialidad].sumCumpl += cumplimiento;



      // Datos para tabla de detalle

      detalleMedicos.push({

        especialidad,

        nombre,

        cedula,

        cumplimiento: cumplimiento.toFixed(1) + "%"

      });

    });



    // Preparar datos para gráficos y métricas

    const especialidades = [];

    const promedioCumplimiento = [];

    let sumPromedio = 0;



    for (let esp in resumen) {

      const promedio = resumen[esp].sumCumpl / resumen[esp].total;

      especialidades.push(esp);

      promedioCumplimiento.push(promedio.toFixed(1));

      sumPromedio += promedio;

    }



    const totalMedicos = data.length;

    const promedioGeneral = (especialidades.length > 0 ? (sumPromedio / especialidades.length) : 0).toFixed(1);



    return {

      especialidades,

      promedioCumplimiento,

      totalMedicos,

      promedioGeneral,

      detalleMedicos

    };



  } catch (e) {

    Logger.log("Error en getControlData: " + e.message);

    throw new Error("Error al procesar los datos de la hoja: " + e.message);

  }

}
