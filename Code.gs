const SPREADSHEET_ID = 'VOTRE_ID_DE_FEUILLE';
const EMAIL_DESTINATAIRE = 'destinataire@example.com';
const LIEN_SUIVI = 'https://example.com';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('DIN Portfolio Management')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitRequest(data) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    const lastRow = sheet.getLastRow();
    const id = lastRow >= 4 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;

    // Enregistrer les données
    sheet.appendRow([id, data.requestor, data.dinPortfolio, data.dinFocalPoint]);

    // Envoyer l'email
    const sujet = `NEW request ${id} created for DIN Portfolio management`;
    const corps = `Dear users,\n\nA new request is now created as ${id}.\nRequestor/Customer: ${data.requestor}\nDIN Portfolio: ${data.dinPortfolio}\nDIN Focal Point: ${data.dinFocalPoint}\n\nClick here: ${LIEN_SUIVI}\n\nThanks & Regards.`;

    MailApp.sendEmail(EMAIL_DESTINATAIRE, sujet, corps);

    return id;
  } catch (error) {
    Logger.log("Erreur lors de la sauvegarde : " + error.message);
    return false;
  }
}
