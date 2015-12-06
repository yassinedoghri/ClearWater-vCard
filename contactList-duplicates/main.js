/**
 * @file Fichier principal main.js
 * @source: https://sourceforge.net/projects/dionysos-gl02/
 *
 * @author Yassine DOGHRI <yassine.doghri@utt.fr>
 * @author Valentin HACHET <valentin.hachet@utt.fr>
 * @author Youssef Nassim AZIZ <youssef_nassim.aziz@utt.fr>
 * @author Ayoub BAKKALI EL KASMI <ayoub.bakkali_el_kasmi@utt.fr>
 * 
 * Copyright (C) 2015 Atlantis
 */

var colors = require('colors');
var prettyjson = require('prettyjson');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

var prettyJsonOptions = {
    noColor: false
};

var fs = require('fs');
var vCardParser = require('./vCardParser.js');
var Contact = require('./Contact.js');
var ContactList = require('./ContactList.js');

var file = "test/sample.vcf";

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    analyzer = new vCardParser(data);
    analyzer.parseToJSON();
    var jsonData = analyzer.jsonData;

    var contactList = new ContactList();

    for (var i = 0; i < jsonData.length; i++) {
        var contact = new Contact();
        contact.firstName = jsonData[i]['firstName'];
        contact.lastName = jsonData[i]['lastName'];
        contact.organisation = jsonData[i]['organisation'];
        contact.title = jsonData[i]['title'];
        contact.phone = jsonData[i]['phone'];
        contact.cellPhone = jsonData[i]['cellPhone'];
        contact.email = jsonData[i]['email'];

        contactList.addContact(contact);
    }

//    console.log(prettyjson.render(contactList, prettyJsonOptions));
    try {
        var duplicateContacts = contactList.duplicates();
        for (var j in duplicateContacts) {
            console.log(j + "\r\n" + prettyjson.render(duplicateContacts[j], prettyJsonOptions));
        }
    } catch (e) {
        console.log("Error : " + e.message);
    }

});