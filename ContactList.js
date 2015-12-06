/**
 * ContactList Class
 * Définit une liste de contacts où des contacts peuvent être ajoutés ou retirés.
 * Permet d'effectuer des opérations pour trouver des doublons, des conflits
 * mais aussi d'exporter la liste dans différents formats (CSV ou vCard).
 * 
 * @class ContactList
 * @property {Array} contacts Tableau contenant les objets Contact
 */
var ContactList = function () {
    this.contacts = [];
    this.similarContacts = true;
    this.contactNumber = 0;
};

ContactList.prototype.addContact = function (contact) {
    var Contact = require("./Contact.js");
    // Tests if contact is an instance of the Contact Class
    // before adding it to the list
    if (contact instanceof Contact) {
        if (this.contacts.length > 0 && this.similarContacts) {
            // Check if contacts are similar when adding a contact
            // to an already filled ContactList (same First and Last Name)
            if (this.contacts[0].firstName !== contact.firstName ||
                    this.contacts[0].lastName !== contact.lastName) {
                this.similarContacts = false;
            }
        }
        this.contacts.push(contact);
        this.contactNumber++;
    }
};

ContactList.prototype.removeContact = function (contact) {
    var newContacts = this.contacts.filter(function (c) {
        return c !== contact;
    });
    this.contactNumber = this.contacts.newContacts;
    return this.contacts = newContacts;
};

ContactList.prototype.duplicates = function () {
    // Identifier tous les doublons entre au moins deux contacts
    if (this.contactNumber > 1) {
        if (this.similarContacts === false) {
            var duplicates = [];
            for (var i = 0; i < this.contactNumber; i++) {
                var key = this.contacts[i].firstName + "." + this.contacts[i].lastName;
                if (!(key in duplicates)) {
                    duplicates[key] = new ContactList();
                    duplicates.similarContacts = true;
                }
                duplicates[key].addContact(this.contacts[i]);
            }
            return duplicates;
        } else {
            throw {name: 'SimilarContacts', message: "La liste de contacts est déjà une liste de profils similaires !"};
        }
    } else {
        throw {name: 'ContactNumber', message: "La liste de contacts doit contenir au moins deux contacts !"};
    }
};

ContactList.prototype.conflicts = function() {
    // TO DO
};

ContactList.prototype.displayConflicts = function () {
    // TO DO
    // Affiche les informations différentes pour une liste de contact ayant le
    // même profil (au moins même nom et prénom)
};

ContactList.prototype.fusion = function () {
    // TO DO
    // Créé un nouveau contact avec les informations choisies par l'utilisateur
    // en s'appuyant sur la méthode displayConflicts
};

ContactList.prototype.export = function (format) {
    // TO DO
    // exporte la liste de contact en CSV (.csv) ou en vCard (.vcf)
};

ContactList.prototype.toString = function () {
    var s = "";
    for (var i = 0; i < this.contacts.length; i++) {
        s += this.contacts[i].toString() + "\n\n";
    }
    return s;
};

module.exports = ContactList;