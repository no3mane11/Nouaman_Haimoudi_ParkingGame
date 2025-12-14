// =========================================================
// obstacle.js — Version corrigée et commentée
// Collision basée sur la taille réelle du véhicule
// =========================================================

class Obstacle {
    // Constructeur : initialise la position, la taille et le type d'obstacle
    constructor(x, y, w, h, type = "wall") {
        this.pos = createVector(x, y); // Position (point de départ pour les murs, centre pour les cônes)
        this.w = w;                    // Largeur (Width)
        this.h = h;                    // Hauteur (Height)
        this.type = type;              // Type d'obstacle : "wall" (Mur rectangulaire) | "cone" (Plot circulaire)
    }

    // Affiche l'obstacle sur le canvas
    show() {
        push();
        noStroke(); // Les obstacles n'ont pas de contour

        if (this.type === "wall") {
            // Affichage des murs (rectangles gris)
            fill(120);
            // Les murs sont dessinés à partir du coin supérieur gauche (mode par défaut de rect)
            rect(this.pos.x, this.pos.y, this.w, this.h);
        } 
        else if (this.type === "cone") {
            // Affichage des plots (cercles orange)
            fill(255, 165, 0); // Orange
            // Les plots sont dessinés à partir de leur centre (mode par défaut de ellipse)
            ellipse(this.pos.x, this.pos.y, this.w); 
        }

        pop();
    }

    // ===============================
    // 🔥 COLLISION CORRIGÉE
    // Vérifie si la voiture entre en collision avec cet obstacle
    // ===============================
    hits(car) {
        // Le rayon de la voiture est considéré comme un quart de sa largeur (pour la zone de collision)
        const carRadius = car.width * 0.25; // ≈ 15 pixels

        // --- Mur : collision cercle / rectangle (Méthode de la distance minimale) ---
        if (this.type === "wall") {
            // 1. Trouver le point du rectangle le plus proche du centre de la voiture (car.pos)
            const closestX = constrain(
                car.pos.x,
                this.pos.x,
                this.pos.x + this.w // Borne X par rapport aux bords du mur
            );
            const closestY = constrain(
                car.pos.y,
                this.pos.y,
                this.pos.y + this.h // Borne Y par rapport aux bords du mur
            );

            // 2. Vérifier si la distance entre le centre de la voiture et ce point est inférieure au rayon de la voiture
            return dist(car.pos.x, car.pos.y, closestX, closestY) < carRadius;
        }

        // --- Plot : collision cercle / cercle ---
        if (this.type === "cone") {
            const coneRadius = this.w / 2; // Rayon du plot (moitié de sa largeur)
            // Collision si la distance entre les deux centres est inférieure à la somme de leurs rayons
            return (
                dist(car.pos.x, car.pos.y, this.pos.x, this.pos.y) <
                carRadius + coneRadius
            );
        }

        return false; // Par défaut, pas de collision
    }

    // ===============================
    // 📏 CALCUL DE LA DISTANCE (Pour l'alerte de proximité)
    // Retourne la distance entre la voiture et l'obstacle (sans la marge de collision).
    // ===============================
    distanceTo(car) {
        // Utilise un rayon de voiture légèrement plus petit pour le calcul d'alerte visuelle/sonore
        const carRadius = 14; 

        if (this.type === "wall") {
            // Comme dans hits(), trouve le point le plus proche sur le mur
            let cx = constrain(car.pos.x, this.pos.x, this.pos.x + this.w);
            let cy = constrain(car.pos.y, this.pos.y, this.pos.y + this.h);
            // La distance réelle est la distance entre les centres moins le rayon de la voiture
            return dist(car.pos.x, car.pos.y, cx, cy) - carRadius;
        }

        if (this.type === "cone") {
            const coneRadius = this.w / 2;
            // La distance réelle est la distance entre les centres moins (rayon voiture + rayon cône)
            return dist(car.pos.x, car.pos.y, this.pos.x, this.pos.y) -
                   (carRadius + coneRadius);
        }

        return Infinity; // Retourne l'infini si le type n'est pas reconnu
    }
}