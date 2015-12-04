/**
 *
 * @source: https://sourceforge.net/projects/dionysos-gl02/
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2015 Atlantis
 * @author Yassine DOGHRI <yassine.doghri@utt.fr>
 * @author Valentin HACHET <valentin.hachet@utt.fr>
 * @author Youssef Nassim AZIZ <youssef_nassim.aziz@utt.fr>
 * @author Ayoub BAKKALI EL KASMI <ayoub.bakkali_el_kasmi@utt.fr>
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
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

fs.readFile("test/sample.vcf", 'utf8', function (err, data) {
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
    
    console.log(prettyjson.render(contactList, prettyJsonOptions));
});