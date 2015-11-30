var fs = require('fs');
//var myArgs = process.argv.slice(2);
//var fileToParse = myArgs[0];
fs.readFile("./test/sample.vcf", 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    analyzer = new vCardParser();
    analyzer.parse(data);
    console.log("fileToParse is a valid vcf file");
    console.log(analyzer.parsedContact);
});
// vCardParser
var vCardParser = function () {
    // The list of Contact parsed from the input file.
    this.parsedContact = [];
    this.symb = ["BEGIN:VCARD", "VERSION", "N", "ORG", "TITLE", "TEL", "TEL", "EMAIL", "REV", "END:VCARD"];
};
// Parser procedure

// tokenize : tranform the data input into a list
// <eol> = CRLF
vCardParser.prototype.tokenize = function (data) {
    //return data.split(/(\r\n|: )/);
    var separator = /(\r\n|:)/;
    data = data.split(separator);
    data = data.filter(function (val, idx) {
        return !val.match(separator);
    });
    return data;
};
// parse : analyze data by calling the first non terminal rule of the grammar
vCardParser.prototype.parse = function (data) {
    var tData = this.tokenize(data);
    console.log(tData);
    this.listContact(tData);
};
// Parser operand
vCardParser.prototype.err = function (msg, input) {
    console.log("Parsing Error ! on " + input[0] + " -- msg : " + msg);
    process.exit(0);
};
// Read and return a symbol from input
vCardParser.prototype.next = function (input) {
    var curS = input.shift();
    //console.log(curS);
    return curS;
};
// accept : verify if the arg s is part of the language symbols.
vCardParser.prototype.accept = function (s) {
    var idx = this.symb.indexOf(s);
    // index 0 exists
    if (idx === -1) {
        this.err("symbol " + s + " unknown", [" "]);
        return false;
    }
    return idx;
};
// check : check whether the arg elt is on the head of the list
vCardParser.prototype.check = function (s, input) {
    if (this.accept(input[0]) === this.accept(s)) {
        return true;
    }
    return false;
};
// expect : expect the next symbol to be s.
vCardParser.prototype.expect = function (s, input) {
    if (s === this.next(input)) {
        console.log("Reckognized! " + s);
        return true;
    } else {
        this.err("symbol " + s + " doesn't match", input);
    }
    return false;
};
// Parser rules

// <liste_contact> = *(<contact>) "$$"
vCardParser.prototype.listContact = function (input) {
    this.contact(input);
    this.expect("END:VCARD", input);
};
// <contact> = "START_Contact" <eol> <body> <eol> "END_Contact"
vCardParser.prototype.contact = function (input) {
    if (this.check("BEGIN:VCARD", input)) {
        this.expect("BEGIN:VCARD", input);
        var args = this.body(input);
        var p = new Contact(args.name, args.org, args.title, args.phone, args.mobilePhone, args.email);
        this.note(input, p);
        this.expect("END_Contact", input);
        this.parsedContact.push(p);
        this.contact(input);
        return true;
    } else {
        return false;
    }
};
// <body> = <name> <eol> <latlng> <eol> <optional>
vCardParser.prototype.body = function (input) {
    var fn = this.name(input).split(";");
    var firstName = fn[1];
    var lastName = fn[0];
    var org = this.organisation(input);
    var title = this.title(input);
    var phone = this.phone(input);
    var mobilePhone = this.phone(input, "cell");
    var email = this.email(input);
    var contact = {
        firstName: firstName,
        lastName: lastName,
        org: org,
        title: title,
        phone: phone,
        mobilePhone: mobilePhone,
        email: email
    };

    return contact;
};
// <name> = "N:" 1*WCHAR; 1*WCHAR
vCardParser.prototype.name = function (input) {
    this.expect("N", input);
    var curS = this.next(input);
    if (matched = curS.match(/[\wàéèêîù'\s]+;[\wàéèêîù'\s]+/i)) {
        return matched[0];
    } else {
        this.err("Invalid name", input);
    }
};

// <org> = "ORG:" 1*WCHAR *(';' 1*WCHAR)
vCardParser.prototype.organisation = function (input) {
    this.expect("ORG", input);
    var curS = this.next(input);
    if (matched = curS.match(/[\wàéèêîù'\s]+/i)) {
        return matched[0];
    } else {
        this.err("Invalid name", input);
    }
};

// <title> = "TITLE:" 1*WCHAR *(';' 1*WCHAR)
vCardParser.prototype.title = function (input) {
    this.expect("TITLE", input);
    var curS = this.next(input);
    if (matched = curS.match(/[\wàéèêîù'\s]+/i)) {
        return matched[0];
    } else {
        this.err("Invalid name", input);
    }
};

// <latlng> = "latlng: " 1*3DIGIT "." 1*DIGIT", " 1*3DIGIT "." 1*DIGIT
vCardParser.prototype.latlng = function (input) {
    this.expect("latlng", input);
    var curS = this.next(input);
    if (matched = curS.match(/(\d+(\.\d+)?);(\d+(\.\d+)?)/)) {
        return {lat: matched[1], lng: matched[3]};
    } else {
        this.err("Invalid latlng", input);
    }
};
// <optional> = *(<note>)
// <note> = "note: " 1DIGIT
vCardParser.prototype.note = function (input, curPoi) {
    if (this.check("note", input)) {
        this.expect("note", input);
        var curS = this.next(input);
        if (matched = curS.match(/\d/)) {
            curPoi.addRating(matched[0]);
            this.note(input, curPoi);
        } else {
            this.err("Invalid note");
        }
    };
};

module.exports = vCardParser;
exports.vCardParser = vCardParser;