# Reseau World of Warcraft mythique+

## Description
Visualisation en réseau des joueurs de mythique+ dans World of Warcraft d'après les données de raider.io (https://raider.io).

![Dashboard view](/figures/dash1.png)

## Données raider.io
Raider.io est un site communautaire, spécialisé dans le suivi et le classement des performances en donjons mythique+ et en raids. Il est largement utilisé par les joueurs pour évaluer leur progression personnelle, rechercher des groupes ou des guildes, et suivre les classements mondiaux. Le site possède sa propre api, nommé Raider.IO Developer API (https://raider.io/api), qui a été utilisé afin d'extraire les informations des meilleurs donjons mythique+. Ce mode de jeu est le plus populaire parmis les joueurs. Chaque groupe peut être constitué de maximum 5 joueurs avec en général 1 tank, 1 soigneur et 3 dps. Les donjons mythique+ possèdent un niveau de difficulté croissant et la réussite du défi offre la possiblité de passer au niveau supérieur. L'objectif pour les joueurs est de tuer 100% des ennemis requis dans l'instance ainsi que l'entierté des boss avant la fin du temps imparti. Le classement est généré en fonction du niveau du donjon et du temps ayant été nécessaire à sa complétion, avec une nette priorité sur le niveau de difficulté.

## Base de données
Chaque entré de la base de données représente un donjon

`rank` : classement du donjon (int)

`dungeon` : nom du donjon (char)

`roster` : id groupe des personnages ayant effectué le donjon
- `id` : id du personnage

- `playerName` : nom du personnage
  
  `role` : role du personnage, 3 possiblités :
  - Tank
  - Heal
  - DPS
  
  `classe` : classe du personne, 13 possiblités :
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
    
  `race` : race du personnage, 25 possiblités :
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

`faction` :
- Alliance
- Horde
