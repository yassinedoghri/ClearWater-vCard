var ContactList = function () {
    this.contacts = [];
};

ContactList.prototype.addContact = function (contact) {
    this.contacts.push(contact);
};

ContactList.prototype.removeContact = function (contact) {
    return this.contacts.filter(function (c) {
        return c !== contact;
    });
};

ContactList.prototype.duplicates = function () {
    // TO DO
    // Identifier tous les doublons entre au moins deux contacts
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