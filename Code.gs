/**
 * Portfolio Management Dashboard
 * Application backend pour Google Apps Script
 * Design modernisé avec dégradés orange et turquoise
 */

// ID du fichier Google Sheets
const SPREADSHEET_ID = '10QxgzOtwTq3zAcuV8YQxtIJd7dzwAgvADq1QaiFp30E';

// Adresse email de destination pour les notifications
const EMAIL_DESTINATION = "votre_email@exemple.com";

// Adresse(s) CC pour les notifications
const EMAIL_CC = "cc1@example.com, cc2@example.com"; // Ajoute ici les emails séparés par une virgule

// Lien vers l'application pour les mises à jour
const UPDATE_LINK = "https://votre-lien-application.com";

/**
 * Sauvegarde les données simplifiées et envoie un email
 * @param {Object} data - Données à sauvegarder (version simplifiée)
 * @return {Boolean} - True si sauvegarde réussie, False sinon
 */
function saveSimpleRequest(data) {
  try {
    // Accès au fichier Google Sheets spécifié par l'ID
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getActiveSheet();

    // Vérifier que la feuille est bien accessible
    if (!sheet) throw new Error("Feuille introuvable ou inaccessible");

    // Récupérer toutes les valeurs de la colonne A à partir de la ligne 4
    var idValues = sheet.getRange("A4:A").getValues();

    // Filtrer pour ne garder que les cellules non vides
    var nonEmptyIds = idValues.filter(function(row) {
      return row[0] !== "";
    });

    // Calculer le nouvel ID (en prenant le maximum existant)
    var newId = 1;
    if (nonEmptyIds.length > 0) {
      var lastId = parseInt(nonEmptyIds[nonEmptyIds.length - 1][0], 10);
      if (!isNaN(lastId)) {
        newId = lastId + 1;
      }
    }

    // Calcul de la prochaine ligne vide (à partir de la ligne 4)
    var nextRow = nonEmptyIds.length + 4;

    // Préparation des données à insérer
    var rowData = [
      newId,
      data.requestor || "",
      data.dinPortfolio || "",
      data.dinFocalPoint || "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" // Champs vides
    ];

    // Écrire les données dans la feuille à partir de la ligne 4
    var range = sheet.getRange(nextRow, 1, 1, rowData.length);
    range.setValues([rowData]);

    // Envoyer l'email de notification
    var success = sendNotificationEmail(newId, data);

    // Journal de succès
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
    // Construction de l'objet de l'email
    var subject = "NEW request " + id + " created for DIN Portfolio management";
    
    // Construction du corps de l'email
    var body = "Dear users,\n\n" +
      "A new request is now created as ID " + id + ". " +
      "You can find below information linked to it.\n\n" +
      "Requestor/customer: " + data.requestor + "\n" +
      "DIN portfolio: " + data.dinPortfolio + "\n" +
      "DIN focal point: " + data.dinFocalPoint + "\n\n" +
      "Please click on this [link]()
