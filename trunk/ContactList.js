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
    var firstName, lastName;
    Object.defineProperties(this, {
        "firstName": {
            get: function () {
                return firstName;
            },
            set: function (value) {
                firstName = value;
            }
        },
        "lastName": {
            get: function () {
                return lastName;
            },
            set: function (value) {
                lastName = value;
            }
        }
    });
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
                this.firstName = null;
                this.lastName = null;
                this.similarContacts = false;
            }
        } else if (this.contacts.length === 0) {
            this.firstName = contact.firstName;
            this.lastName = contact.lastName;
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
            var duplicates = {};
            for (var i = 0; i < this.contactNumber; i++) {
                var key = this.contacts[i].firstName + "." + this.contacts[i].lastName;
                if (!(key in duplicates)) {
                    duplicates[key] = new ContactList();
                    duplicates[key].firstName = this.contacts[i].firstName;
                    duplicates[key].lastName = this.contacts[i].lastName;
                }
                duplicates[key].addContact(this.contacts[i]);
            }
            for (var p in duplicates) {
                if (duplicates[p].contactNumber <= 1) {
                    delete duplicates[p];
                }
            }
            return duplicates;
        } else {
            throw {name: 'SimilarContacts', type: "error", message: "La liste de contacts est déjà une liste de profils similaires !"};
        }
    } else {
        throw {name: 'ContactNumber', type: "error", message: "La liste de contacts doit contenir au moins deux contacts !"};
    }
};

ContactList.prototype.conflicts = function () {
    if (this.similarContacts) {
        var conflicts = {};
        var properties = ["organisation", "title", "phone", "cellPhone", "email"];
        for (var i = 0; i < this.contactNumber; i++) {
            for (var j = 0; j < properties.length; j++) {
                if (!(properties[j] in conflicts)) {
                    conflicts[properties[j]] = [];
                }
                if (this.contacts[i][properties[j]] instanceof Array) {
                    if (properties[j] === "phone") {
                        for (var k in this.contacts[i][properties[j]]) {
                            var phone = this.contacts[i][properties[j]][k];
                            conflicts[properties[j]].push(phone["type"] + ": " + phone["number"]);
                        }
                    } else {
                        for (var k in this.contacts[i][properties[j]]) {
                            conflicts[properties[j]].push(this.contacts[i][properties[j]][k]);
                        }
                    }
                } else {
                    conflicts[properties[j]].push(this.contacts[i][properties[j]]);
                }
            }
        }
        for (var p in conflicts) {
            conflicts[p] = uniq(conflicts[p]);
            if (conflicts[p].length < 2) {
                delete conflicts[p];
            }
        }

        return conflicts;
    } else {
        throw {name: 'SimilarContacts', type: "error", message: "La liste de contacts doit contenir des profils similaires !"};
    }
};

ContactList.prototype.displayConflicts = function () {
    var conflicts = this.conflicts();
    if (Object.size(conflicts) > 0) {
        var chalk = require('chalk');
        var Table = require('cli-table');
        var table = new Table({
            head: [chalk.blue('Champ(s)'), chalk.blue('Conflits')]
        });
        var title = "Voici la liste des conflits pour " +
                chalk.blue(this.firstName) + " " + chalk.blue(this.lastName);
        var ref = {
            "organisation": "Organisation",
            "title": "Fonction",
            "phone": "Téléphone Fixe",
            "cellPhone": "Téléphone Portable",
            "email": "Adresse Email"
        };
        for (var i in conflicts) {
            table.push([chalk.bold(ref[i]), conflicts[i].join("\n")]);
        }

        console.log(title);
        console.log(table.toString());
    } else {
        throw {name: 'NoneToDisplay', type: "info", message: "Aucun conflit n'a été détecté pour " + this.firstName + " " + this.lastName + " !"};
    }
};

ContactList.prototype.merge = function (choices) {
    var Contact = require("./Contact.js");
    var mergedContact = new Contact();
    var conflicts = this.conflicts();
    var properties = ["organisation", "title", "phone", "cellPhone", "email"];
    mergedContact.firstName = this.firstName;
    mergedContact.lastName = this.lastName;
    if (choices.hasOwnProperty("phone")) {
        for (var i = 0; i < choices["phone"].length; i++) {
            var phone = choices["phone"][i].split(": ");
            choices["phone"][i] = {"type": phone[0], "number": phone[1]};
        }
    }
    for (var i in properties) {
        if (conflicts.hasOwnProperty(properties[i])) {
            mergedContact[properties[i]] = choices[properties[i]];
        } else {
            mergedContact[properties[i]] = this.contacts[0][properties[i]];
        }
    }
    console.log("Contacts Fusionés !");
    console.log(mergedContact.toString());
    return mergedContact;
};

ContactList.prototype.export = function (file, format) {
    var fs = require("fs");
    if (!/.(csv|vcf)$/i.file) {
        file += "." + format.toLowerCase();
    }
    switch (format.toUpperCase()) {
        case "CSV":
            var json2csv = require('json2csv');
            var fields = ["NOM", "PRENOM", "ORGANISATION", "FONCTION", "TELEPHONE", "MOBILE", "EMAIL"];
            var contacts = [];
            for (var i = 0; i < this.contacts.length; i++) {
                contacts.push(this.contacts[i].toJSON());
            }

            json2csv({data: contacts, fields: fields}, function (err, csv) {
                if (err) {
                    throw err;
                }
                fs.writeFile(file, csv, function (err) {
                    if (err) {
                        throw err;
                    } else {
                        console.log("L'export de la liste de contacts en CSV a réussi ! " + file + " a été Sauvegardé !");
                    }
                });
            });
            break;
        case "VCF":
            vcard = "";
            for (var i = 0; i < this.contacts.length; i++) {
                vcard += this.contacts[i].toVCardString();
                if (i !== this.contacts.length - 1) {
                    vcard += "\r\n";
                }
            }
            fs.writeFile(file, vcard, function (err) {
                if (err) {
                    throw err;
                }
                console.log("L'export de la liste de contacts en vCard a réussi ! " + file + " a été Sauvegardé !");
            });
            break;
        default:
            throw {name: "formatValue", type: "error", message: "Veuillez choisir le format CSV ou VCARD"};
            break;
    }
};

ContactList.prototype.toString = function () {
    var s = "";
    for (var i = 0; i < this.contacts.length; i++) {
        s += this.contacts[i].toString() + "\n\n";
    }
    return s;
};

Object.size = function (obj) {
  return Object.keys(obj).length;
};

function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

module.exports = ContactList;
