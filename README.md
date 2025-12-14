Precision Parking – Projet de Jeu 2D
1. Présentation du projet

Precision Parking est un jeu 2D développé en JavaScript à l’aide de la bibliothèque p5.js.
L’objectif principal du jeu est de simuler des manœuvres de stationnement en mettant l’accent sur la précision, la gestion de l’espace et le contrôle du véhicule.

Le joueur contrôle une voiture vue de dessus et doit la garer correctement dans une place définie, tout en respectant des contraintes de temps, de vitesse et de positionnement.
La difficulté augmente progressivement à travers plusieurs niveaux.

2. Objectifs pédagogiques

Ce projet a été réalisé dans un cadre académique avec les objectifs suivants :

Comprendre la gestion du mouvement à l’aide de vecteurs

Implémenter une logique de collision simple

Manipuler des coordonnées et des transformations géométriques

Structurer un jeu avec plusieurs niveaux

Gérer le temps, le score et les conditions de réussite ou d’échec

Mettre en place une interface utilisateur simple et lisible

3. Technologies utilisées

JavaScript

p5.js (dessin, animation, gestion du clavier)

p5.sound (gestion des sons et de la musique)

HTML / CSS (structure de base)

Images et fichiers audio externes (assets)

4. Principe du jeu

Le joueur contrôle la voiture à l’aide des touches directionnelles :

Flèche haut : accélération

Flèche bas : recul

Flèche gauche / droite : rotation de la voiture

Chaque niveau possède :

Une position de départ pour la voiture

Une place de parking à atteindre

Un temps limité

Des obstacles (plots) selon le niveau

Le parking est validé uniquement si :

La voiture est entièrement dans la place

La vitesse est faible

L’orientation est correcte (notamment pour les places verticales)

5. Description des niveaux
Niveau 1 : Approche libre

Aucun obstacle complexe

Objectif : comprendre les contrôles

Parking horizontal

Collision uniquement avec les bords de l’écran

Niveau 2 : Slalom vertical simple

Une ligne verticale de plots

Les obstacles remplissent l’écran de haut en bas

Objectif : apprendre à gérer la précision et la trajectoire

Niveau 3 : Slalom vertical multiple + parking

Plusieurs lignes verticales de plots

Décalages verticaux différents pour chaque ligne

Parcours plus complexe avant d’atteindre une place de parking verticale

Exige un bon contrôle de la vitesse et de l’orientation

6. Gestion du temps et du score

Chaque niveau dispose d’un chronomètre.
Si le temps est écoulé avant le stationnement, le niveau est échoué.

Le score dépend du temps restant au moment du stationnement :

Plus le joueur est rapide, plus il obtient d’étoiles

Chaque étoile rapporte un certain nombre de points

Le score total est conservé entre les niveaux.

7. Système d’alerte de proximité

Le jeu calcule en permanence la distance entre la voiture et les obstacles les plus proches.

Lorsque la voiture s’approche trop près d’un obstacle :

Un message d’avertissement est affiché

Une indication visuelle informe le joueur de la distance restante

Cela permet d’améliorer la précision sans collision immédiate

8. Gestion des sons

Le projet intègre :

Une musique de fond jouée pendant le jeu

Un son de réussite lors du stationnement

Un son d’échec en cas de collision ou de dépassement du temps

Les sons sont activés uniquement après une interaction utilisateur, conformément aux règles des navigateurs.

9. Structure du projet
/assets
  ├── car.png
  ├── music.mp3
  ├── success.wav
  ├── crash.wav

/sketch.js
/vehicle.js
/obstacle.js
/index.html


sketch.js : logique principale du jeu

vehicle.js : gestion du mouvement et affichage de la voiture

obstacle.js : gestion des obstacles et collisions

assets/ : images et sons

10. Conclusion

Ce projet a permis de mettre en pratique plusieurs notions importantes liées au développement de jeux 2D, à la logique mathématique et à la programmation événementielle.
Il constitue une base solide pour des améliorations futures telles que :

Ajout de nouveaux niveaux

Génération procédurale des obstacles

Amélioration graphique

Sauvegarde du score
