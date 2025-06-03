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

Le <ins>**premier selecteur**</ins> permet de choisir une région dans laquelle le jeu est disponible. Ces régions étant fermées les unes aux autres, il est important que chacune possède leur propre visualisation (deux joueurs de régions différentes ne peuvent pas jouer ensemble). Les régions disponibles dans le selecteur sont inspiré de la variable `region`, soit : `Europe`, `Etats-Unis`, `Chine`, `Taïwan` et `Corée du Sud`.

Le <ins>**deuxième selecteur**</ins> définie le nombre d'instance, autrement dit le nombre de donjon qui sera utilisé pour construire le réseau. Si on sélectionne le nombre d'instance 100, cela veut dire que le réseau contient les 100 meilleurs premiers donjons du classement raider.io. Le nombre minimum est 20 et s'incrémente de 20 en 20 jusqu'à atteindre 200 (20, 40, 60, ..., 200). 20 correspond au nombre maximum de donjon que l'on peut recolter en une fois avec une requête de l'api raider.io


## Mise à jour des données

## A propos du Reseau World of Warcraft mythique+

## Auteurs
