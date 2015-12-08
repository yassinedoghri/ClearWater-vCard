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
 * @property {Object} phone Numéro de téléphone fixe (travail ou domicile) du contact
 * @property {String} cellPhone Numéro de téléphone portable du contact
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
                    throw {name: "firstNameValue", type: "error", message: "Le format du Prénom est incorrect"};
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
                    throw {name: "lastNameValue", type: "error", message: "Le format du Nom est incorrect"};
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
                        throw {name: "orgValue", type: "error", message: "Le format de/des Compagnie(s) est incorrect"};
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
                        throw {name: "titleValue", type: "error", message: "Le format de la/des fonction(s) est incorrect"};
                    }
                }
            }
        },
        "phone": {
            get: function () {
                return phone;
            },
            set: function (value) {
                phone = {};
                var matched = value['number'].match(/^(\+\d{11})$/);
                if (matched) {
                    phone = value;
                } else {
                    throw {name: "phoneValue", type: "error", message: "Le format du numéro de Téléphone fixe est incorrect"};
                }
            }
        },
        "cellPhone": {
            get: function () {
                return cellPhone;
            },
            set: function (value) {
                var matched = value.match(/^(\+\d{11})$/);
                if (matched) {
                    cellPhone = matched[0];
                } else {
                    throw {name: "cellPhoneValue", type: "error", message: "Le format du numéro de Téléphone Portable est incorrect"};
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
                    throw {name: "emailValue", type: "error", message: "Le format de l'Adresse Mail est incorrect"};
                }
            }
        }
    });
}

Contact.prototype.toJSON = function () {
    var obj = {
        NOM: this.lastName,
        PRENOM: this.firstName,
        ORGANISATION: this.organisation.join("/"),
        FONCTION: this.title.join("/"),
        TELEPHONE: this.phone.number,
        MOBILE: this.cellPhone,
        EMAIL: this.email
    };
    return obj;
};

Contact.prototype.toVCardString = function () {
    var vCardArray = [
        "BEGIN:VCARD",
        "VERSION:4.0",
        "N:" + this.lastName + ";" + this.firstName,
        "ORG:" + this.organisation.join(";"),
        "TITLE:" + this.title.join(";"),
        "TEL;TYPE=" + this.phone["type"] + ",voice;VALUE=uri:tel:" + this.phone["number"],
        "TEL;TYPE=cell,voice;VALUE=uri:tel:" + this.cellPhone,
        "EMAIL:" + this.email,
        "END:VCARD"
    ];
    return vCardArray.join("\r\n");
};

Contact.prototype.toString = function () {
    return "Nom Contact : " + this.firstName + " " + this.lastName +
            "\nCompagnie : " + this.organisation.join(', ') +
            "\nFonction : " + this.title.join(', ') +
            "\nNuméro Téléphone (" + this.phone.type + ") : " + this.phone.number +
            "\nNuméro Portable : " + this.cellPhone +
            "\nEmail : " + this.email;
};

module.exports = Contact;