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

var prettyjson = require('prettyjson');
var chalk = require('chalk');
var prettyJsonOptions = {
    noColor: false
};
var fs = require('fs');
var inquirer = require("inquirer");
var vCardParser = require('./vCardParser.js');
var Contact = require('./Contact.js');
var ContactList = require('./ContactList.js');
var file = "test/sample_c.vcf";
fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    analyzer = new vCardParser(data);
    analyzer.parseToJSON();
    var jsonData = analyzer.jsonData;
    var contactList = new ContactList();
    for (var i = 0; i < jsonData.length; i++) {
        try {
            var contact = new Contact();
            contact.firstName = jsonData[i]['firstName'];
            contact.lastName = jsonData[i]['lastName'];
            contact.organisation = jsonData[i]['organisation'];
            contact.title = jsonData[i]['title'];
            contact.phone = jsonData[i]['phone'];
            contact.cellPhone = jsonData[i]['cellPhone'];
            contact.email = jsonData[i]['email'];
            contactList.addContact(contact);
        } catch (e) {
            handleException(e);
        }
    }

//    console.log(prettyjson.render(contactList, prettyJsonOptions));
//    try {
//        var duplicateContacts = contactList.duplicates();
//        console.log(duplicateContacts);
//        for (var j in duplicateContacts) {
//            console.log(j + "\r\n" + duplicateContacts[j]);
//        }
//    } catch (e) {
//        handleException(e);
//    }

    // Si on a des contacts similaires (à tester avec sample_c.vcf)
//    try {
//        contactList.displayConflicts();
//    } catch (e) {
//        handleException(e);
//    }
//    inquirer.prompt(mergeForm(contactList), function (answers) {
//        contactList.merge(answers);
//    });

    try {
        contactList.export("test/new", "csv");
    } catch (e) {
        handleException(e);
    }
});

function mergeForm(contactList) {
    var conflicts = contactList.conflicts();
    var form = [];
    var formRef = {
        organisation: {type: "checkbox", message: "l'/les organisation(s)"},
        title: {type: "checkbox", message: "la ou les fonction(s)"},
        phone: {type: "list", message: "le numero telephone"},
        cellPhone: {type: "list", message: "le numero de télephone portable"},
        email: {type: "list", message: "l'adresse mail"}
    };
    for (var p in conflicts) {
        var question = {
            type: formRef[p]["type"],
            name: p,
            message: "Choisissez " + formRef[p]["message"] + " que vous souhaitez conserver",
            choices: conflicts[p]
        };
        form.push(question);
    }
    return form;
}

function handleException(e) {
    var error = chalk.white.bgRed.bold;
    var errorMsg = chalk.bold.red;
    var info = chalk.white.bgBlue.bold;
    var infoMsg = chalk.bold.blue;
    if (e.type === "info") {
        console.log(info(" " + e.type + " ") + " " + infoMsg(e.message));
    } else {
        console.log(error(" " + e.type + " ") + " " + errorMsg(e.message));
        console.log(chalk.gray("Stoping process..."));
        process.exit();
    }
}
