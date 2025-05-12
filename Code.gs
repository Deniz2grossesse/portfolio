
/**
 * Portfolio Management Dashboard
 * Application backend pour Google Apps Script
 * Design modernisé avec dégradés orange et turquoise
 */

// ID du fichier Google Sheets
const SPREADSHEET_ID = '10QxgzOtwTq3zAcuV8YQxtIJd7dzwAgvADq1QaiFp30E';

// Adresse email de destination pour les notifications
const EMAIL_DESTINATION = "votre_email@exemple.com";

// Lien vers l'application pour les mises à jour
const UPDATE_LINK = "https://votre-lien-application.com";

// Fonction exécutée à l'ouverture de l'application web
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portfolio Management Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fonction pour obtenir les données des menus déroulants
 * @return {Object} Objet contenant toutes les options des menus déroulants
 */
function getDropdownOptions() {
  return {
    dinPortfolio: [
      "Digital workspace", "Cyber security", "Roof", "Div", "Affiliate", 
      "DI-infrastructure", "LAN", "SECURITY", "Wireless & industry", 
      "Infra & deploy", "WAN", "Asiapac", "North america", "GE", "UK", "SP", "FR"
    ],
    goNoGo: [
      "Waiting", "Go pending budget", "GO", "No GO", "Canceled"
    ]
  };
}

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
    
    // Trouver toutes les valeurs de la colonne A à partir de la ligne 4
    var idValues = sheet.getRange("A4:A").getValues();
    
    // Filtrer pour ne garder que les cellules qui contiennent des données
    var nonEmptyIds = idValues.filter(function(row) {
      return row[0] !== "";
    });
    
    // Calculer le nouvel ID
    var newId = 1;
    if (nonEmptyIds.length > 0) {
      // Prendre la dernière valeur d'ID et l'incrémenter
      var lastId = nonEmptyIds[nonEmptyIds.length - 1][0];
      
      // S'assurer que c'est un nombre
      if (typeof lastId === 'number') {
        newId = lastId + 1;
      } else {
        // Si ce n'est pas un nombre, essayer de le convertir
        var parsedId = parseInt(lastId, 10);
        if (!isNaN(parsedId)) {
          newId = parsedId + 1;
        }
      }
    }
    
    // Préparation des données à insérer
    var rowData = [
      newId,
      data.requestor || "",
      data.dinPortfolio || "",
      data.dinFocalPoint || "",
      "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "" // Champs vides pour le reste
    ];
    
    // Trouver la prochaine ligne vide pour l'insertion
    var nextRow = nonEmptyIds.length + 4;
    
    // Écriture des données
    var range = sheet.getRange(nextRow, 1, 1, rowData.length);
    range.setValues([rowData]);
    
    // Envoyer l'email de notification
    var success = sendNotificationEmail(newId, data);
    
    // Journal de succès
    Logger.log("Données sauvegardées avec succès pour l'ID " + newId);
    
    return {success: true, id: newId};
  } catch (error) {
    Logger.log("Erreur lors de la sauvegarde des données: " + error.toString());
    return {success: false, error: error.toString()};
  }
}

/**
 * Envoie un email de notification pour une nouvelle demande
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
      "A new request is now created as " + id + ". " +
      "You can find below information linked to it.\n\n" +
      "Requestor/customer: " + data.requestor + "\n" +
      "DIN portfolio: " + data.dinPortfolio + "\n" +
      "DIN focal point: " + data.dinFocalPoint + "\n\n" +
      "Please click on this [link](" + UPDATE_LINK + ") to show the updates.\n\n" +
      "Thanks & Regards.";
    
    // Envoi de l'email
    GmailApp.sendEmail(EMAIL_DESTINATION, subject, body);
    
    Logger.log("Email envoyé avec succès à " + EMAIL_DESTINATION);
    return true;
  } catch (error) {
    Logger.log("Erreur lors de l'envoi de l'email: " + error.toString());
    return false;
  }
}

/**
 * Sauvegarde les données dans Google Sheets
 * @param {Object} data - Données à sauvegarder
 * @return {Boolean} - True si sauvegarde réussie, False sinon
 */
function saveData(data) {
  try {
    // Accès au fichier Google Sheets spécifié par l'ID
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getActiveSheet();
    
    // Trouver toutes les valeurs de la colonne A à partir de la ligne 4
    var idValues = sheet.getRange("A4:A").getValues();
    
    // Filtrer pour ne garder que les cellules qui contiennent des données
    var nonEmptyIds = idValues.filter(function(row) {
      return row[0] !== "";
    });
    
    // Calculer le nouvel ID
    var newId = 1;
    if (nonEmptyIds.length > 0) {
      // Prendre la dernière valeur d'ID et l'incrémenter
      var lastId = nonEmptyIds[nonEmptyIds.length - 1][0];
      
      // S'assurer que c'est un nombre
      if (typeof lastId === 'number') {
        newId = lastId + 1;
      } else {
        // Si ce n'est pas un nombre, essayer de le convertir
        var parsedId = parseInt(lastId, 10);
        if (!isNaN(parsedId)) {
          newId = parsedId + 1;
        }
      }
    }
    
    // Préparation des données à insérer
    var rowData = [
      newId,
      data.requestor || "",
      data.dinPortfolio || "",
      data.dinFocalPoint || "",
      data.initiativeName || "",
      data.initiativeDeliverables || "",
      data.year || "",
      data.sourceDemand || "",
      data.ppmId || "",
      data.category || "",
      data.workloadPsl || "",
      data.transversal || "",
      data.status || "",
      data.teamMember || "",
      data.goNoGo || "",
      data.prioDin || "",
      data.dinLead || "",
      data.budgetEstimated || "",
      data.budgetValidated || "",
      data.cpn || "",
      data.impactRcDin || "",
      data.statusFinal || "",
      data.dinsNeeded || "",
      data.dinsComment || "",
      data.dinsLink || ""
    ];
    
    // Trouver la prochaine ligne vide pour l'insertion
    var nextRow = nonEmptyIds.length + 4;
    
    // Écriture des données
    var range = sheet.getRange(nextRow, 1, 1, rowData.length);
    range.setValues([rowData]);
    
    // Journal de succès
    Logger.log("Données sauvegardées avec succès pour l'ID " + newId);
    
    return true;
  } catch (error) {
    Logger.log("Erreur lors de la sauvegarde des données: " + error.toString());
    return false;
  }
}

/**
 * Fonction de test pour vérifier que l'application fonctionne
 * @return {String} Message indiquant si la connexion est réussie
 */
function testConnection() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    return "Connection successful to spreadsheet: " + spreadsheet.getName();
  } catch (error) {
    return "Connection error: " + error.toString();
  }
}

/**
 * Obtenir toutes les données pour l'affichage dans un tableau
 * @return {Array} Tableau de toutes les entrées
 */
function getAllData() {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    // Supprimer l'en-tête
    data.shift();
    
    return data;
  } catch (error) {
    Logger.log("Erreur lors de la récupération des données: " + error.toString());
    return [];
  }
}
