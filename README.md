# Reseau World of Warcraft mythique+

## Description
Visualisation [D3JS](https://d3js.org/) en réseau des joueurs de mythique+ dans World of Warcraft d'après les données de [raider.io](https://raider.io).

![Dashboard view](/figures/dash1.png)

## Données raider.io
Raider.io est un site communautaire, spécialisé dans le suivi et le classement des performances en donjons mythique+ et en raids. Il est largement utilisé par les joueurs pour évaluer leur progression personnelle, rechercher des groupes ou des guildes, et suivre les classements mondiaux. Le site possède sa propre api, nommé Raider.IO Developer API (https://raider.io/api), qui a été utilisé afin d'extraire les informations des meilleurs donjons mythique+. Ce mode de jeu est le plus populaire parmis les joueurs. Chaque groupe peut être constitué de maximum 5 joueurs avec en général 1 tank, 1 soigneur et 3 dps. Les donjons mythique+ possèdent un niveau de difficulté croissant et la réussite du défi offre la possiblité de passer au niveau supérieur. L'objectif pour les joueurs est de tuer 100% des ennemis requis dans l'instance ainsi que l'entierté des boss avant la fin du temps imparti. Le classement est généré en fonction du niveau du donjon et du temps ayant été nécessaire à sa complétion, avec une nette priorité sur le niveau de difficulté.

## Base de données
Chaque entrée de la base de données représente un donjon, chaque donjon possède les variables suivantes : `rank`, `dungeon` et `roster`. Et à l'intérieur du `roster` on a les variables suivantes : `id`, `playerName`, `role`, `classe`, `race`, `faction`, `realm` et `region` pour chaque joueur ayant participé au donjon.

`rank` : classement du donjon.

`dungeon` : nom du donjon.

`roster` : groupe des personnages ayant effectué le donjon.
- `id` : id du personnage.
- `playerName` : nom du personnage.
- `role` : role du personnage, 3 possiblités :
  - Tank
  - Heal
  - DPS
- `classe` : classe du personne, 13 possiblités :
  - Guerrier (warrior)
  - Chasseur (hunter)
  - Mage (mage)
  - Voleur (rogue)
  - Prêtre (priest)
  - Démoniste (warlock)
  - Paladin (paladin)
  - Druide (druid)
  - Chaman (shaman)
  - Moine (monk)
  - Chasseur de démon (demon hunter)
  - Chevalier de la mort (death knight)
  - Evocateur (evoker)
- `race` : race du personnage, 25 possiblités :
  - Humain
  - Nain
  - Elfe de la nuit
  - Gnome
  - Draenaï
  - Worgen
  - Pandaren
  - Elfe du vide
  - Draeneï sancteforce
  - Nain sombrefer
  - Terrestre
  - Kultirassien
  - Mécagnome
  - Dracthyr
  - Orc
  - Mort-vivant
  - Tauren
  - Troll
  - Elfe de sang
  - Gobelin
  - Sacrenuit
  - Tauren de Haut-Roc
  - Orc mag'har
  - Troll zandlari
  - Vulpérin
- `faction` :
  - Alliance
  - Horde
- `realm` : nom du serveur en jeu du personnage.
- `region` : nom region du personnage, 5 possiblités :
  - Europe
  - United States & Oceania
  - China
  - Taiwan
  - Korea (sud)

Pour une visualisation en réseau, il est essentiel d'avoir des <ins>**noeuds**</ins> et des <ins>**liens**</ins>. 

Les <ins>**noeuds**</ins> représentent tous les personnages ayant effectué un donjon. Les données proviennent de l'objet `roster` directement :
- `id`, `playerName`, `role`, `classe`, `race`, `faction`, `realm` et `region`

Les <ins>**liens**</ins> correspondent au donjon. Un lien existe entre deux joueurs à partir du moment qu'ils ont effectué un donjon ensemble. Voici une illustration en guise d'exemple :
| `Source`  | `Target` | `Rank` | `Dungeon` |
| ------------- | ------------- | ------------- |------------- |
| id player1  | id player2  | 1  | dungeonName1 |
| id player1  | id player3  | 1  | dungeonName1 |
| id player1  | id player4  | 1  | dungeonName1 |
| id player1  | id player5  | 1  | dungeonName1 |
| id player2  | id player3  | 1  | dungeonName1 |
| id player2  | id player4  | 1  | dungeonName1 |
| id player2  | id player5  | 1  | dungeonName1 |
| id player3  | id player4  | 1  | dungeonName1 |
| id player3  | id player5  | 1  | dungeonName1 |
| id player4  | id player5  | 1  | dungeonName1 |
| id player1  | id player2  | 2  | dungeonName2 |
| ...  | ...  | ...  | ... |

## Interface & Fonctionnalités

L'interface est composé d'un titre, de deux selecteurs, d'une légende des classes, d'une indication sur les fonctionnalités claviers d'interaction ainsi que de l'espace reservé au réseau.

### Les Selecteurs
![Dashboard view](/figures/dash2.png)

Le <ins>**premier selecteur**</ins> permet de <ins>**choisir une région</ins>** dans laquelle le jeu est disponible. Ces régions étant fermées les unes aux autres, il est important que chacune possède leur propre visualisation (deux joueurs de régions différentes ne peuvent pas jouer ensemble). Les régions disponibles dans le selecteur sont inspiré de la variable `region`, soit : `Europe`, `Etats-Unis`, `Chine`, `Taïwan` et `Corée du Sud`.

Le <ins>**deuxième selecteur**</ins> définie le <ins>**nombre d'instance</ins>**, autrement dit le nombre de donjon qui sera utilisé pour construire le réseau. Si on sélectionne le nombre d'instance 160, cela veut dire que le réseau contient les 160  premiers donjons du classement raider.io selon leur classement. Le nombre minimum est 20 et s'incrémente de 20 jusqu'à atteindre 200 (20, 40, 60, ..., 200). 20 correspond au nombre maximum de donjon que l'on peut recolter en une fois avec une requête de l'api raider.io.

### Les Fonctionnalités clavier
![Dashboard view](/figures/dash3.png)

- Press `1` : Changement de la taille des noeuds à partir d'un tableau contenant 3 possiblités préconfigurés [4, 6, 8].
- Press `2` : Changement de la taille de la taille des liens à partir d'un tableau contenant 3 possiblités préconfigurés [0.5, 1.5, 2.5] et de la couleur des liens selon le tableau des couleurs suivant ["rgba(204,204,204,0.6)", "rgba(102,102,102,0.9)", "#000000"].
- Press `3` : Changement de la la force de collisiion des noeuds à partir d'un tableau contenant 3 possiblités préconfigurés [10, 15, 20].

### Les Fonctionnalités d'exploration
![Dashboard view](/figures/dash4.png)

- <ins>**Zoom</ins>** à l'aide de la molette de la souris
- <ins>**Déplacement du réseau</ins>** sur la page à l'aide d'un clic-gauche sur la page avec un mouvement de souris.
- Au survol de la souris sur une node / un joueur, vous pouvez faire ressortir son <ins>**sous-réseau</ins>** (tous les autres joueurs ayant effectué au moins un donjon avec le joueuer) ainsi que les <ins>**informations du joueur</ins>** (nom, classe, race, rôle, royaume, région et faction).
- <ins>**Déplacement d'un joueur<ins>** dans le réseau en gardant le clic-gauche enfoncé sur sa node avec un mouvement de souris.

## Installation
Ce projet n'est pas hébergé sur un serveur, il faut donc le faire tourner localement sur votre machine. Voici un exemple pour le lancer à partir du logiciel Visual Studio Code :

Windows et Mac OS :
- Installer [Visual Studio Code](https://code.visualstudio.com/) selon votre OS.
- Télécharger le projet "reseau-wow-raiderio" en ZIP et l'extraire.
- Ajouter l'extension "Live Server" dans Visual Studio Code.
- Ouvrir le dossier r"eseau-wow-raider-io-main" dans Visual Studio Code.
- Appuyer sur "Go Live" en bas à droite dans Visual Studio Code.

<ins>**AUCUNE CLEF API N'EST NECESSAIRE POUR LANCER LA VISUALISATION</ins>**.

## Mise à jour des données
Le choix par défaut au premier lancement est Europe pour la région et 20 pour le nombre d'instance. A l'initialisation de la page ainsi qu'à chaque changement dans l'un des deux selecteurs, les données sont automatiquement récupérées et actualisées grâce à l'envoie des requêtes API adéquates. Le chargement de la visualisation peut avoir une latence de 1-2 secondes selon sa taille.

## A propos du Reseau World of Warcraft mythique+

## Auteurs

Jonathan Marquez, master en Humanités numériques, évaluation finale du cours "Visualisation de données" du professeur Isaac Pante et l'assistant Loris Rimaz de l'Université de Lausanne pour le semestre d'Automne 2024 - 2025.
