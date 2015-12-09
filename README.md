ClearWater, Dionysos - Projet GL02
==============

### Description : 

L'application ClearWater a été développé à partir du cahier des charges soumis par le groupe Dionysos dans le cadre de l’UV GL02 à l’UTT. Cette solution logicielle permet d’importer une liste de contacts fournis au format vcf (vCard), d’effectuer des opérations dessus et renvoyer une nouvelle liste au format csv. Conformément au cahier des charges, la solution logicielle a pour première fonctionnalité de pouvoir traiter des fichiers vCard en entrée. Par ailleurs, la deuxième fonctionnalité de cette solution consiste à identifier les doublons présents au sein des profils. Ensuite, la fonctionnalité suivante vise à trouver des incohérences au sein des profils jumelés. A cela s’ajoute une quatrième qui consiste à fusionner les profils similaires. La cinquième fonctionnalité de cette solution vise à permettre à l’utilisateur de choisir quelles informations sont à conserver lorsqu’il demande la fusion de plusieurs profils entre eux. Enfin, la dernière fonctionnalité de cette solution correspond à l’exportation de la nouvelle liste de contacts traités au format CSV. 

***

### Format des données 

Afin d’assurer le bon fonctionnement de la solution logicielle, il est demandé à l’utilisateur de présenter les contacts au sein de la liste fournie conformément au format d’entrée (précisé ci-dessous). 

###### Les données en entrée seront au format suivant : 

*VCARD* 	=	‘BEGIN:VCARD’ CRLF ’VERSION:4.0’ CRLF CONTACT ’END:VCARD’ CRLF

*CONTACT* 	= 	NP CRLF ORGANISATION CRLF FONCTION CRLF 1*TELEPHONE CRLF 1*MOBILE CRLF COURRIEL

*NP* 		= 	’N:’ TEXT ‘;’ TEXT

*ORGANISATION*	=	ORG:’ TEXT *(‘;’TEXT)

*FONCTION*	= 	‘TITLE:’ TEXT *(‘;’TEXT)

*TELEPHONE*	= 	‘TEL;TYPE=‘.(‘home’/‘work’).’,voice;uri=:tel: +’ 11DIGIT

*COURRIEL*	= 	‘EMAIL:’ 1*VCHAR.’@‘1*VCHAR’.’1*VCHAR

*TEXT*		= 	1*(WSP/VCHAR)

###### Les données en sortie seront au format suivant : 

*CSV* 		= 	COLONNES CRLF *(LIGNE)

*COLONNES* 	= 	‘NOM, PRENOM, ORGANISATION, FONCTION, TELEPHONE, MOBILE, COURRIEL’

*LIGNE* 	= 	TEXT.’,’.TEXT.’,’.TEXTORGA_FONC.’,’.TEXTORGA_FONC.’,’.TEXTTEL.’,’.TEXTTEL.’,’.TEXT

*TEXT* 		=	1*(WSP/VCHAR) 

*TEXTORGA_FONC*	= 	TEXT *(‘/’ TEXT)

*TEXTTEL* 	= 	1*(‘+’.11DIGIT)

##### Exportation :
Les fichiers exportés seront sauvegardés dans un dossier *exports* qui sera créé s'il n'existe pas.
Leur nom sera sous la forme suivante : **[yyyy-mm-dd]_[time]_merge-contacts.(csv|vcf)**


### Mode d’Emploi
Lancez le fichier main.js qui se trouve dans le répertoire du projet avec Nodejs comme suit:

```
$ node main.js
```

L'application NodeJs se lancera et proposera plusieurs choix à l'utilisateur :
- **Import de fichier(s) .vcf (vCard)** : l'utilisateur pourra renseigner un ou plusieurs fichiers afin de les importer
- **Afficher les contacts importés** : l'utilisateur pourra afficher les contacts qu'il aura importé depuis un fichier .vcf
- **Rechercher les profils similaires** : l'utilisateur pourra lancer une opération pour détéerminer les profils similaires dans les contacts qu'il a importé, il pourra aussi les afficher
- **Afficher les incohérences pour des profils similaires** : l'utilisateur pourra afficher les conflits pour des mêmes profils
- **Fusionner des profils similaires** : l'utilisateur pourra fusionner des contacts dont les prénoms et noms sont similaires en choisissant les informations correctes
- **Exporter les contacts fusionnés** : l'utilisateur pourra exporter au format CSV ou vCard les profils qu'il aura préalablement fusionné

L'utilisateur pourra naviguer facilement avec les opérations **Retour** et **Quitter**.
Il peut aussi **Réinitialiser** ses importations. 

***

### Dépendances :
**Node.js** >= v5.1.1

Les modules à installer sont les suivants :
- *chalk*
- *prettyjson*
- *inquirer*
- *cli-table*
- *json2csv*
- *async*

L’installation des modules doit être réalisé dans le dossier du projet.
Pour installer un module, utiliser la commande suivante :

```
$ npm install <nom_du_module>
```

***

### Fichiers joints :
Des échantillons de données sont joints à cette solution logicielle. Ces échantillons de données permettront de tester fonctionnellement la solution proposée en fonction des données que l’utilisateur rentrera dans les différents champs.
Ils se trouvent dans le répertoire *sample* du projet.

### Liste des contributeurs
Yassine DOGHRI <yassine.doghri@utt.fr>
Valentin HACHET <valentin.hachet@utt.fr>
Youssef Nassim AZIZ <youssef_nassim.aziz@utt.fr>
Ayoub BAKKALI EL KASMI <ayoub.bakkali_el_kasmi@utt.fr>

***
Copyright © Atlantis 2015 | ClearWater-Dionysos v1.0