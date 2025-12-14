// =========================================================
// vehicle.js — Version stable et cohérente et commentée
// Véhicule avec image, ombre, dimensions réelles et alerte visuelle
// =========================================================

class Vehicle {
    constructor(x, y) {
        // 1. PROPRIÉTÉS PHYSIQUES (Vecteurs)
        this.pos = createVector(x, y); // Position (p5.Vector)
        this.vel = createVector(0, 0); // Vitesse (Velocity)
        this.acc = createVector(0, 0); // Accélération

        // 2. PARAMÈTRES DE CONDUITE
        this.angle = 0;              // Angle de la voiture (en radians)
        this.maxSpeed = 5;           // Vitesse maximale
        this.accForce = 0.25;        // Force d'accélération appliquée
        this.friction = 0.97;        // Facteur de friction (ralentissement progressif)

        // 3. DIMENSIONS
        this.width = 60;  // Largeur réelle du véhicule (utilisée pour collision et affichage)
        this.height = 30; // Hauteur réelle du véhicule
    }

    // Ajoute une force au vecteur d'accélération
    applyForce(force) {
        this.acc.add(force);
    }

    // 🔄 Mise à jour de la position et de la physique
    update() {
        // Vitesse = Vitesse + Accélération
        this.vel.add(this.acc);
        // Limite la vitesse
        this.vel.limit(this.maxSpeed);
        // Applique la friction (ralentissement)
        this.vel.mult(this.friction);
        // Position = Position + Vitesse
        this.pos.add(this.vel);
        // Réinitialise l'accélération pour le prochain cycle
        this.acc.mult(0);
    }

    // 🧭 Rotation de la voiture
    steer(direction) {
        // direction: -1 (gauche) ou 1 (droite)
        this.angle += direction * 0.05;
    }

    // 🚀 Accélération dans la direction de l'angle actuel
    accelerate(power) {
        // Crée un vecteur dans la direction de l'angle actuel
        const force = p5.Vector.fromAngle(this.angle);
        force.mult(power); // Applique la puissance (positive ou négative)
        this.applyForce(force);
    }

    // ===============================
    // 🌍 LIMITES ÉCRAN
    // Vérifie si la voiture sort des limites (murs invisibles des niveaux)
    // ===============================
    checkEdges() {
        // Détection de sortie des limites (haut, bas, gauche)
        if (
            this.pos.x < 0 ||
            this.pos.y < 0 ||
            this.pos.y > height
        ) {
            return true; // Collision détectée
        }

        // Correction de dépassement à droite
        if (this.pos.x > width) {
            this.pos.x = width; // Ramène la voiture au bord
        }

        return false; // Pas de collision
    }

    // ===============================
    // 🎨 AFFICHAGE IMAGE + OMBRE + ALERTE VISUELLE
    // ===============================
    show(img) {
        push();
        translate(this.pos.x, this.pos.y); // Déplace le système de coordonnées au centre de la voiture
        rotate(this.angle);                // Fait pivoter le système de coordonnées

        // ✨ Ombre
        noStroke();
        fill(0, 0, 0, 80); // Noir semi-transparent
        // Dessine une ellipse légèrement décalée (simule l'ombre)
        ellipse(5, 5, this.width * 0.9, this.height * 0.9);

        // 🔥 ALERTE VISUELLE (BONUS)
        // Vérifie si les variables globales de proximité (définies dans sketch.js) existent
        if (typeof closestDistance !== "undefined" &&
            closestDistance < dangerDistance &&
            closestDistance > 0) {

            // 1. Calcul de l'opacité dynamique (plus proche = plus opaque)
            let alpha = map(
                closestDistance,
                dangerDistance, // Distance maximale pour l'alerte
                0,              // Distance de contact (0)
                50,             // Opacité min (quand dangerDistance est atteint)
                150             // Opacité max (quand la voiture est très proche)
            );

            // 2. Ajout du clignotement (basé sur sin pour un effet pulsé)
            let pulse = sin(frameCount * 0.3) * 20; 
            alpha += pulse;
            alpha = constrain(alpha, 50, 200); // Borne l'opacité

            fill(255, 80, 0, alpha); // Couleur Orange-Rouge + Opacité calculée
            noStroke();
            
            // Dessine l'ellipse d'alerte autour de la voiture (plus grande que la voiture)
            ellipse(0, 0, this.width + 30, this.height + 30);
        }

        // 🚗 Image voiture
        imageMode(CENTER); // Centre l'image sur le point (0, 0) du système translaté
        image(img, 0, 0, this.width, this.height);

        // 👉 Direction (optionnel - ligne verte indiquant l'avant)
        stroke(0, 255, 0);
        strokeWeight(2);
        line(0, 0, this.width / 2, 0); // Ligne du centre vers l'avant (axe X)

        pop(); // Restaure les paramètres de dessin précédents
    }
}