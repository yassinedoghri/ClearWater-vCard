/**
 * vCardParser Class
 * Analyse des données sous la structure vCard
 * et permet de les reformater en JSON
 *
 * @class vCardParser
 * @param {String} rawData Données vCard brutes
 * @property {Array} jsonData Tableau contenant les données sous format JSON
 */
function vCardParser(rawData) {
    this.rawData = rawData;
    this.fieldAssociations = {
        "VERSION": "version",
        "N": "name",
        "ORG": "organisation",
        "TITLE": "title",
        "TEL": "phone",
        "EMAIL": "email"
    };
    this.jsonData = [];
}

vCardParser.prototype.parseToJSON = function () {
    var regex = /END:VCARD?(\r\n)BEGIN:VCARD/;
    var dataArr = this.rawData.split(regex);
    var dataArr = dataArr.filter(function (val, idx) {
        return !val.match(/^\r\n$/);
    });

    for (var i = 0; i < dataArr.length; i++) {
        if (!dataArr[i].startsWith("BEGIN:VCARD")) {
            dataArr[i] = "BEGIN:VCARD" + dataArr[i];
        } else if (!dataArr[i].endsWith("END:VCARD")) {
            dataArr[i] += "END:VCARD";
        }
    }

    for (var i = 0; i < dataArr.length; i++) {
        var json = {};
        var phones = [];
        var cellPhones = [];
        data = this.tokenize(dataArr[i], /(\r\n)/);
        for (var j = 0; j < data.length; j++) {
            if (!data[j].match(/(:VCARD)/)) {

                if (data[j].startsWith("TEL;")) {
                    var d = this.tokenize(data[j], /(;TYPE=|:tel:|,voice;VALUE=)/);
                    if (/^(work|home)$/.test(d[1])) {
                        phones.push({
                            "type": d[1],
                            "number": d[3]
                        });
                    } else if (/^(cell)$/.test(d[1])) {
                        cellPhones.push(d[3]);
                    } else {
                        throw {name: "phoneType", type: "error", message: "Type de téléphone invalide !"};
                    }
                } else if (data[j].startsWith("N:")) {
                    var d = this.tokenize(data[j], /(:|;)/);
                    json["firstName"] = d[2];
                    json["lastName"] = d[1];
                } else if (data[j].startsWith("ORG:") || data[j].startsWith("TITLE:")) {
                    var d = this.tokenize(data[j], /(:|;)/);
                    var key = d.shift(); // enlever le premier élément du tableau
                    json[this.fieldAssociations[key]] = d;
                } else {
                    var d = data[j].split(":");
                    json[this.fieldAssociations[d[0]]] = d[1];
                }
            }
        }
        json[this.fieldAssociations["TEL"]] = phones;
        json["cellPhone"] = cellPhones;
        this.jsonData.push(json);
    }
};

vCardParser.prototype.tokenize = function (data, separator) {
    data = data.split(separator);
    data = data.filter(function (val, idx) {
        return !val.match(separator);
    });
    return data;
};

String.prototype.startsWith = function (prefix) {
    return this.slice(0, prefix.length) === prefix;
};

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

module.exports = vCardParser;