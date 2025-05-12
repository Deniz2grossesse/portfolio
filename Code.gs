/**
 * Portfolio Management Dashboard
 * Application backend pour Google Apps Script
 * Design modernisé avec dégradés orange et turquoise
 */

// ID du fichier Google Sheets
const SPREADSHEET_ID = '10QxgzOtwTq3zAcuV8YQxtIJd7dzwAgvADq1QaiFp30E';

// Adresse email de destination pour les notifications
const EMAIL_DESTINATION = "votre_email@exemple.com";

// Adresse(s) CC pour les notifications (séparées par des virgules)
const EMAIL_CC = "cc1@example.com, cc2@example.com"; 

// Lien vers l'application pour les mises à jour
const UPDATE_LINK = "https://votre-lien-application.com";

/**
 * Fonction exécutée à l'ouverture de l'application web
 * @return {HtmlOutput} - Page HTML générée
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portfolio Management Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Sauvegarde les données simplifiées et envoie un email
 * @param {Object} data - Données à sauvegarder (version simplifiée)
 * @return {Object} - Succès ou échec avec ID
 */
function saveSimpleRequest(data) {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getActiveSheet();

    if (!sheet) throw new Error("Feuille introuvable ou inaccessible");

    var idValues = sheet.getRange("A4:A").getValues();
    var nonEmptyIds = idValues.filter(row => row[0] !== "");

    var newId = 1;
    if (nonEmptyIds.length > 0) {
      var lastId = parseInt(nonEmptyIds[nonEmptyIds.length - 1][0], 10);
      if (!isNaN(lastId)) newId = lastId + 1;
    }

    var nextRow = nonEmptyIds.length + 4;
    var rowData = [
      newId,
      data.requestor || "",
      data.dinPortfolio || "",
      data.dinFocalPoint || "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
    ];

    var range = sheet.getRange(nextRow, 1, 1, rowData.length);
    range.setValues([rowData]);

    var success = sendNotificationEmail(newId, data);

    Logger.log("Données sauvegardées avec succès pour l'ID " + newId);
    return { success: true, id: newId };
  } catch (error) {
    Logger.log("Erreur lors de la sauvegarde des données: " + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Envoie un email de notification pour une nouvelle demande avec CC
 * @param {Number} id - ID de la demande
 * @param {Object} data - Données de la demande
 * @return {Boolean} - True si envoi réussi, False sinon
 */
function sendNotificationEmail(id, data) {
  try {
    var subject = "NEW request " + id + " created for DIN Portfolio management";
    var body = "Dear users,\n\n" +
      "A new request is now created as ID " + id + ". " +
      "You can find below information linked to it.\n\n" +
      "Requestor/customer: " + data.requestor + "\n" +
      "DIN portfolio: " + data.dinPortfolio + "\n" +
      "DIN focal point: " + data.dinFocalPoint + "\n\n" +
      "Please click on this [link](" + UPDATE_LINK + ") to show the updates.\n\n" +
      "Thanks & Regards.";

    var emailOptions = {
      cc: EMAIL_CC
    };

    GmailApp.sendEmail(EMAIL_DESTINATION, subject, body, emailOptions);
    Logger.log("Email envoyé avec succès à " + EMAIL_DESTINATION + " avec CC : " + EMAIL_CC);
    return true;
  } catch (error) {
    Logger.log("Erreur lors de l'envoi de l'email: " + error.toString());
    return false;
  }
}
