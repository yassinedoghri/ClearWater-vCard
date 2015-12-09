/* global Function */

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
var inquirer = require('inquirer');
var async = require('async');
var readMultipleFiles = require('read-multiple-files');
var vCardParser = require('./vCardParser.js');
var Contact = require('./Contact.js');
var ContactList = require('./ContactList.js');

var contactList = new ContactList();
var mergedContacts = new ContactList();
var duplicates = {};

console.log("-------------------------------------------------------------------");
console.log("***             Bienvenue sur l'application ClearWater !        ***");
console.log("-------------------------------------------------------------------");
start();

function start() {
    var choices = [
        {value: 1, name: "Importer Contacts"},
        new inquirer.Separator(),
        {value: 0, name: "Quitter"}
    ];
    if (contactList.contactNumber > 0) {
        choices.splice(1, 0, {value: 2, name: "Continuer avec les contacts déjà importés"});
        choices.splice(-1, 0, {value: 4, name: "Réinitialiser"});
    }
    if (mergedContacts.contactNumber > 0) {
        choices.splice(2, 0, {value: 3, name: "Exporter la liste des contacts fusionnés"});
    }
    inquirer.prompt([
        {
            type: "list",
            name: "start",
            message: "CLEARWATER - Veuillez choisir une option :",
            choices: choices
        }
    ], function (answers) {
        switch (answers.start) {
            case 1:
                askVCards();
                break;
            case 2:
                importContacts();
                break;
            case 3:
                exportForm(start);
                break;
            case 4:
                reset();
                break;
            default:
                exit();
                break;
        }
    });
}

function askVCards() {
    inquirer.prompt([
        {
            type: "input",
            name: "vCards",
            message: "Veuillez renseigner un ou plusieurs fichiers vCards (séparés par une virgule) ou tapez 'r' pour revenir :",
            validate: function (input) {
                var done = this.async();

                var inputA = [];
                var errorMsg = "";
                if (input.indexOf(',') > -1) {
                    inputA = input.split(',');
                    errorMsg = "Vérifiez que les fichiers soient au format vCard (.vcf) !";
                } else {
                    inputA.push(input);
                    errorMsg = "Vous devez renseigner des fichiers vCard (.vcf) !";
                }

                setTimeout(function () {
                    for (var i = 0; i < inputA.length; i++) {
                        if (!/^r$|(.vcf)$/.test(inputA[i])) {
                            done(errorMsg);
                            return;
                        }
                    }
                    // Pass the return value in the done callback 
                    done(true);
                }, 0);
            }
        }
    ], function (answers) {
        switch (answers.vCards) {
            case "r":
                start();
                break;
            default:
                try {
                    var vcards = answers.vCards.split(',');
                    vcards = vcards.map(Function.prototype.call, String.prototype.trim);
                    async.map(vcards, readAsync, function (err, results) {
                        if (err) {
                            var error = chalk.white.bgRed.bold;
                            var errorMsg = chalk.bold.red;
                            console.log(error(" error ") + " " + errorMsg("Fichier(s) vCard introuvable(s) : vérifiez l'orthographe !"));
                            setTimeout(function () {
                                askVCards();
                            }, 100);
                            return false;
                        }
                        var rawData = results.join("\r\n");

                        analyzer = new vCardParser(rawData);
                        analyzer.parseToJSON();
                        var jsonData = analyzer.jsonData;
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
                                handleException(e, start);
                                return false;
                            }
                        }
                        console.log("L'importation des contacts à réussie !");
                        importContacts();
                    });
                } catch (e) {
                    console.log(e);
                }
                break;
        }
    });
}

function readAsync(file, callback) {
    fs.readFile(file, 'utf8', callback);
}

function importContacts() {
    var pre2;
    if (Object.keys(duplicates).length === 0 &&
            mergedContacts.contacts.length === 0) {
        pre2 = "Rechercher les p";
    } else {
        pre2 = "P";
    }
    var choices = [
        {value: 1, name: "Afficher les contacts importés"},
        {value: 2, name: pre2 + "rofils similaires"},
        new inquirer.Separator(),
        {value: 4, name: "Retour"},
        {value: 0, name: "Quitter"}
    ];
    if (mergedContacts.contactNumber > 0) {
        choices.splice(2, 0, {value: 3, name: "Exporter la liste des contacts fusionnés"});
    }
    inquirer.prompt([
        {
            type: "list",
            name: "contactsImport",
            message: "CONTACTS IMPORTÉS - Que voulez-vous faire ?",
            choices: choices
        }
    ], function (answers) {
        switch (answers.contactsImport) {
            case 1:
                for (var i = 0; i < contactList.contacts.length; i++) {
                    console.log(contactList.contacts[i].toString() + "\n");
                }
                importContacts();
                break;
            case 2:
                try {
                    if (Object.keys(duplicates).length === 0 &&
                            mergedContacts.contacts.length === 0) {
                        duplicates = contactList.duplicates();
                        console.log("Profils similaires trouvés !");
                    }
                    findDuplicates();
                } catch (e) {
                    duplicates[contactList.firstName + '.' + contactList.lastName] = contactList;
                    handleException(e, findDuplicates);
                }
                break;
            case 3:
                exportForm(importContacts);
                break;
            case 4:
                start();
                break;
            default:
                exit();
                break;
        }
    });
}

function findDuplicates() {
    var choices = [
        {value: 1, name: "Afficher les profils similaires"},
        {value: 2, name: "Afficher les conflits"},
        {value: 3, name: "Fusionner les profils similaires"},
        new inquirer.Separator(),
        {value: 6, name: "Retour"},
        {value: 0, name: "Quitter"}
    ];
    if (mergedContacts.contactNumber > 0) {
        choices.splice(3, 0, new inquirer.Separator());
        choices.splice(4, 0, {value: 4, name: "Afficher les contacts fusionnés"});
        choices.splice(5, 0, {value: 5, name: "Exporter les contacts fusionnés"});
    }
    var msg = '';
    if (Object.keys(duplicates).length === 0) {
        choices.splice(0, 4);
        msg = "[Il n'y a plus de profils similaires !]";
    }

    inquirer.prompt([
        {
            type: "list",
            name: "test",
            message: "PROFILS SIMILAIRES - Que voulez-vous faire ? " + msg,
            choices: choices
        }
    ], function (answers) {
        switch (answers.test) {
            case 1:
                for (var p in duplicates) {
                    console.log(duplicates[p].firstName + " " + duplicates[p].lastName);
                    console.log("--------------------------------------------");
                    for (var i = 0; i < duplicates[p].contacts.length; i++) {
                        console.log(duplicates[p].contacts[i].toString() + "\n");
                    }
                    console.log("--------------------------------------------");
                }
                findDuplicates();
                break;
            case 2:
                displayConflictsForm();
                break;
            case 3:
                mergeDuplicatesForm();
                break;
            case 4:
                for (var i = 0; i < mergedContacts.contacts.length; i++) {
                    console.log(mergedContacts.contacts[i].toString() + "\n");
                }
                findDuplicates();
                break;
            case 5:
                exportForm(findDuplicates);
                break;
            case 6:
                importContacts();
                break;
            default:
                exit();
                break;
        }
    });
}

function getContactNames(duplicates) {
    var choices = [];
    for (var p in duplicates) {
        var name = p.replace('.', ' ');
        choices.push(name);
    }
    choices.push(new inquirer.Separator());
    choices.push("Retour");
    return choices;
}

function displayConflictsForm() {
    inquirer.prompt([
        {
            type: "list",
            name: "test",
            message: "AFFICHER CONFLITS - Pour quel contact ?",
            choices: getContactNames(duplicates)
        }
    ], function (answers) {
        switch (answers.test) {
            case "Retour":
                findDuplicates();
                break;
            default:
                var name = answers.test.replace(/\s/, '.');
                duplicates[name].displayConflicts();
                findDuplicates();
                break;
        }
    });
}

function mergeDuplicatesForm() {
    inquirer.prompt([
        {
            type: "list",
            name: "test",
            message: "FUSION DE CONTACTS - Veuillez choisir un contact :",
            choices: getContactNames(duplicates)
        }
    ], function (answers) {
        switch (answers.test) {
            case "Retour":
                findDuplicates();
                break;
            default:
                var name = answers.test.replace(/\s/, '.');
                inquirer.prompt(mergeForm(duplicates[name]), function (answers) {
                    mergedContacts.addContact(duplicates[name].merge(answers));
                    delete duplicates[name];
                    findDuplicates();
                });
                break;
        }
    });
}

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
        if (question["type"] === "checkbox") {
            question["validate"] = function (answer) {
                if (answer.length < 1) {
                    return "Vous devez faire au moins un choix ;)";
                }
                return true;
            };
        }
        form.push(question);
    }
    return form;
}

function exportForm(previous) {
    inquirer.prompt([
        {
            type: "list",
            name: "format",
            message: "EXPORTATION - Quel format pour l'export ?",
            choices: [
                {value: 1, name: "CSV"},
                {value: 2, name: "vCard"},
                new inquirer.Separator(),
                {value: 0, name: "Retour"}
            ] // generate list of names to choose from + return option
        }
    ], function (answers) {
        var today = getDateNow();
        var fileName = "merged-contacts_" + today;
        switch (answers.format) {
            case 1:
                var dir = './exports';

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                mergedContacts.export(dir + "/" + fileName, "csv");
                setTimeout(function () {
                    previous();
                }, 100);
                break;
            case 2:
                var dir = './exports';

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                mergedContacts.export(dir + "/" + fileName, "vcf");
                setTimeout(function () {
                    previous();
                }, 100);
                break;
            default:
                previous();
                break;
        }
    });
}

function getDateNow() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd + "_" + today.getTime();
}

function reset() {
    contactList = new ContactList();
    mergedContacts = new ContactList();
    duplicates = [];
    setTimeout(function () {
        console.log("Réinitialisation...");
    }, 1000);
    setTimeout(function () {
        process.stdout.write('\033c');
        console.log(chalk.green("OK !"));
        start();
    }, 1100);
}

function exit() {
    console.log("\n\n\n\n");
    console.log("                            A bientôt !");
    console.log("-------------------------------------------------------------------");
    console.log("|      Copyright (c) Atlantis 2015 - ClearWater_Dionysos v1.0     |");
    console.log("-------------------------------------------------------------------");
    process.exit();
}

function handleException(e, previous) {
    var error = chalk.white.bgRed.bold;
    var errorMsg = chalk.bold.red;
    var info = chalk.white.bgBlue.bold;
    var infoMsg = chalk.bold.blue;
    if (e.type === "info") {
        console.log(info(" " + e.type + " ") + " " + infoMsg(e.message));
    } else {
        console.log(error(" " + e.type + " ") + " " + errorMsg(e.message) + " " + info("Lire Readme"));
        previous();
    }
}