/**
 * Contact class
 * Définit un objet contact en renseignant son prénom, nom, entreprise,
 * fonction, numéros de téléphone(fixe et portable) et son email.
 *
 * @class Contact
 * @property {String} firstName Prénom du contact
 * @property {String} lastName Nom du contact
 * @property {Array} organisation Entreprise(s) dans laquelle travaille le contact
 * @property {Array} title Fonction(s) du contact
 * @property {Array} phone Numéro(s) de téléphone fixe (travail ou domicile) du contact
 * @property {Array} cellPhone Numéro(s) de téléphone portable du contact
 * @property {String} email Adresse mail du contact
 */
function Contact() {
    var firstName, lastName, organisation,
            title, phone, cellPhone, email;
    Object.defineProperties(this, {
        "firstName": {
            get: function () {
                return firstName;
            },
            set: function (value) {
                var matched = value.match(/[\wàéèêîù'\s]+/i);
                if (matched) {
                    firstName = matched[0];
                } else {
                    throw {name: "firstNameValue", type: "error", message: "Le format du Prénom est incorrect pour '" + value + "'"};
                }
            }
        },
        "lastName": {
            get: function () {
                return lastName;
            },
            set: function (value) {
                var matched = value.match(/[\wàéèêîù'\s]+/i);
                if (matched) {
                    lastName = matched[0];
                } else {
                    throw {name: "lastNameValue", type: "error", message: "Le format du Nom est incorrect pour pour '" + value + "'"};
                }
            }
        },
        "organisation": {
            get: function () {
                return organisation;
            },
            set: function (value) {
                organisation = [];
                for (var i = 0; i < value.length; i++) {
                    var matched = value[i].match(/[\wàéèêîù'\s]+/i);
                    if (matched) {
                        organisation.push(matched[0]);
                    } else {
                        throw {name: "orgValue", type: "error", message: "Le format de/des Compagnie(s) est incorrect pour '" + value[i] + "'"};
                    }
                }
            }
        },
        "title": {
            get: function () {
                return title;
            },
            set: function (value) {
                title = [];
                for (var i = 0; i < value.length; i++) {
                    var matched = value[i].match(/[\wàéèêîù'\s]+/i);
                    if (matched) {
                        title.push(matched[0]);
                    } else {
                        throw {name: "titleValue", type: "error", message: "Le format de la/des fonction(s) est incorrect pour '" + value[i] + "'"};
                    }
                }
            }
        },
        "phone": {
            get: function () {
                return phone;
            },
            set: function (value) {
                phone = [];
                for (var i = 0; i < value.length; i++) {
                    var matched = value[i]['number'].match(/^(\+\d{11})$/);
                    if (matched) {
                        phone.push(value[i]);
                    } else {
                        throw {name: "phoneValue", type: "error", message: "Le format du numéro de Téléphone fixe est incorrect pour '" + value['number'] + "'"};
                    }
                }
            }
        },
        "cellPhone": {
            get: function () {
                return cellPhone;
            },
            set: function (value) {
                cellPhone = [];
                for (var i = 0; i < value.length; i++) {
                    var matched = value[i].match(/^(\+\d{11})$/);
                    if (matched) {
                        cellPhone.push(matched[0]);
                    } else {
                        throw {name: "cellPhoneValue", type: "error", message: "Le format du numéro de Téléphone Portable est incorrect pour '" + value + "'"};
                    }
                }
            }
        },
        "email": {
            get: function () {
                return email;
            },
            set: function (value) {
                var matched = value.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
                if (matched) {
                    email = matched[0];
                } else {
                    throw {name: "emailValue", type: "error", message: "Le format de l'Adresse Mail est incorrect pour '" + value + "'"};
                }
            }
        }
    });
}

Contact.prototype.toJSON = function () {
    var phoneS = "";
    for (var i = 0; i < this.phone.length; i++) {
        phoneS += this.phone[i].number + "(" + this.phone[i]["type"] + ")";
        if (i < this.phone.length - 1) {
            phoneS += "/";
        }
    }
    var obj = {
        NOM: this.lastName,
        PRENOM: this.firstName,
        ORGANISATION: this.organisation.join("/"),
        FONCTION: this.title.join("/"),
        TELEPHONE: phoneS,
        MOBILE: this.cellPhone.join("/"),
        EMAIL: this.email
    };
    return obj;
};

Contact.prototype.toVCardString = function () {
    var phoneS = "";
    for (var i = 0; i < this.phone.length; i++) {
        phoneS += "TEL;TYPE=" + this.phone[i]["type"] + ",voice;VALUE=uri:tel:" + this.phone[i]["number"];
        if (i < this.phone.length - 1) {
            phoneS += "\r\n";
        }
    }

    var cellPhoneS = "";
    for (var i = 0; i < this.cellPhone.length; i++) {
        cellPhoneS += "TEL;TYPE=cell,voice;VALUE=uri:tel:" + this.cellPhone[i];
        if (i < this.cellPhone.length - 1) {
            cellPhoneS += "\r\n";
        }
    }
    var vCardArray = [
        "BEGIN:VCARD",
        "VERSION:4.0",
        "N:" + this.lastName + ";" + this.firstName,
        "ORG:" + this.organisation.join(";"),
        "TITLE:" + this.title.join(";"),
        phoneS,
        cellPhoneS,
        "EMAIL:" + this.email,
        "END:VCARD"
    ];
    return vCardArray.join("\r\n");
};

Contact.prototype.toString = function () {
    var chalk = require("chalk");
    var phoneS = "";
    for (var i = 0; i < this.phone.length; i++) {
        phoneS += "\n\t- " + this.phone[i]["number"] + " (" + this.phone[i]["type"] + ")";
    }

    var cellPhoneS = "";
    for (var i = 0; i < this.cellPhone.length; i++) {
        cellPhoneS += "\n\t- " + this.cellPhone[i];
    }
    return chalk.green("Nom Contact : ") + this.firstName + " " + this.lastName +
            chalk.green("\nCompagnie : ") + this.organisation.join(', ') +
            chalk.green("\nFonction : ") + this.title.join(', ') +
            chalk.green("\nNuméro(s) Téléphone : ") + phoneS +
            chalk.green("\nNuméro(s) Portable : ") + cellPhoneS +
            chalk.green("\nEmail : ") + this.email;
};

module.exports = Contact;