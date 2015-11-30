/**
 * Contact class
 * Defines a contact by 
 *
 * @class Contact
 * @param {String} firstName The contact's first name
 * @param {String} lastName The contact's last name
 * @param {String} organisation The contact's company
 * @param {String} title The contact's job title
 * @param {String} phone The contact's phone
 * @param {String} mobilePhone The contact's mobile phone
 * @param {String} email The contact's email
 */
function Contact(firstName, lastName, organisation, title, phone, mobilePhone, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.compagny = organisation;
    this.position = title;
    this.phone = phone;
    this.mobilePhone = mobilePhone;
    this.email = email;
}

Contact.prototype.fusion = function (contact1, contact2) {
    // To Do
};

Contact.prototype.getName = function () {
    return this.name;
};

Contact.prototype.getLastName = function () {
    return this.lastName;
};

Contact.prototype.getCompagny = function () {
    return this.compagny;
};

Contact.prototype.getPosition = function () {
    return this.position;
};

Contact.prototype.getPhone = function () {
    return this.phone;
};

Contact.prototype.getMobile = function () {
    return this.mobile;
};

Contact.prototype.getEmail = function () {
    return this.email;
};



var contactList = [];

// AjouterContact
contactList.prototype.addContact = function (contact, contactList) {
    this.push(contact);
};

//Supprimer Contact
contactList.prototype.removeContact = function (contact) {
    for(var i = 0; i < this.length; i++) {
        if (contact === this[i]) {
            // remove
        }
    }
};

//Number Of Contacts
contactList.prototype.size = function () {
    return this.length;
};

module.exports = Contact;