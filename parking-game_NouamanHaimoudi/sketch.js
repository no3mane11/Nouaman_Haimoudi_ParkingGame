// =========================================================
// Precision Parking — VERSION TEST (Final avec Full Screen, Retour Menu & Niveaux Corrigés)
// =========================================================

// =========================================================
// 🌐 VARIABLES GLOBALES D'ÉTAT DU JEU
// Ces variables gèrent le déroulement général et les informations essentielles.
// =========================================================

// ---------- GAME STATE ----------
let gameState = "menu"; // 🎮 État actuel du jeu : "menu" (écran d'accueil) ou "play" (en cours)

// ---------- OBJECTS ----------
let car;         // 🚗 Objet représentant la voiture jouable (Instance de la classe Vehicle)
let parkingSpot; // 🅿️ Objet définissant la zone de stationnement cible
let obstacles = []; // 🧱 Tableau contenant tous les obstacles (Instances de la classe Obstacle)

// ---------- FLAGS (Drapeaux d'état) ----------
let parked = false;  // Indique si la voiture est correctement stationnée
let crashed = false; // Indique si la voiture a percuté un obstacle ou les bords (Niveau 1)
let level = 1;       // Niveau actuel du jeu
let maxLevel = 3;    // Nombre total de niveaux

// ---------- TIME & SCORE ----------
let startTime;    // Moment (en millis) où le niveau a commencé (pour le chrono)
let timeLimit = 25; // Limite de temps pour chaque niveau (en secondes)
let score = 0;      // Score total du joueur
let stars = 0;      // Nombre d'étoiles obtenues à la fin d'un niveau (non utilisé pour le score)

// ---------- UI (Interface Utilisateur) ----------
let parkingMessage = ""; // Message affiché à l'écran concernant l'objectif du niveau

// ---------- ASSETS (Ressources chargées) ----------
let carImg;          // Image de la voiture
let bgMusic, successSound, crashSound, alertSound; // Objets sonores
let successPlayed = false; // Flag pour ne jouer le son de succès qu'une seule fois
let crashPlayed = false;   // Flag pour ne jouer le son de crash qu'une seule fois

// ---------- PROXIMITÉ ET AUDIO ----------
let dangerDistance = 25; // 📐 Distance maximale (en pixels) à laquelle l'alerte visuelle/sonore s'active
let closestDistance = Infinity; // Distance au cône ou mur le plus proche (mise à jour dans draw())

// VARIABLE AUDIO
let audioUnlocked = false; // 🔓 Indique si l'interaction utilisateur a débloqué l'API Web Audio
let proximityVolume = 0;   // 🔊 Volume calculé en fonction de closestDistance


// =========================================================
// PRELOAD
// Chargement de toutes les ressources (images, sons) avant le démarrage de setup().
// =========================================================
function preload() {
    carImg = loadImage("assets/car.png");

    soundFormats("mp3", "wav");
    bgMusic = loadSound("assets/music.mp3");
    successSound = loadSound("assets/success.wav");
    crashSound = loadSound("assets/crash.wav");
}

// =========================================================
// SETUP
// Initialisation de l'environnement p5.js et des objets de base.
// =========================================================
function setup() {
    // Crée le canvas en taille initiale (800x600)
    createCanvas(800, 600); 
    angleMode(RADIANS); // Utilisation des radians pour les rotations (standard p5.js)

    // Initialisation des propriétés de base de la place de parking
    parkingSpot = {
        pos: createVector(700, height / 2),
        w: 60,
        h: 30,
        angle: 0
    };
}

// =========================================================
// MAIN LOOP (draw)
// Boucle principale du jeu, appelée 60 fois par seconde.
// Gère l'état du jeu, les mises à jour et l'affichage.
// =========================================================
function draw() {
    // 1. GESTION DU MENU
    if (gameState === "menu") {
        drawMenu();
        return; // S'arrête ici si on est dans le menu
    }
    
    // 2. JEU EN COURS
    background(30); // Fond sombre

    // ⏱ TIME LIMIT (Fin du jeu si le temps est écoulé)
    if (!parked && !crashed && getRemainingTime() <= 0) {
        crashed = true;
    }

    drawParkingSpot(); // Dessine la place de parking cible

    // 3. GESTION DES COLLISIONS et PROXIMITÉ
    let hit = false;
    // Vérifie les collisions avec les bords d'écran (uniquement au niveau 1)
    if (level === 1 && car.checkEdges()) hit = true;

    closestDistance = Infinity; // Réinitialisation de la distance la plus proche

    for (let obs of obstacles) {
        obs.show(); // Affiche l'obstacle

        // Calcule la distance de la voiture à cet obstacle
        let d = obs.distanceTo(car); 
        if (d < closestDistance) {
            closestDistance = d; // Met à jour la distance la plus proche
        }

        // Vérifie la collision physique
        if (obs.hits(car) && !parked) {
            hit = true;
        }
    }

    // CALCUL ET APPLICATION DU VOLUME (Basé sur la distance)
    if (closestDistance < dangerDistance) {
        // La fonction 'map' crée une valeur proportionnelle entre 0.0 et 1.0
        proximityVolume = map(
            closestDistance,
            dangerDistance,  // Si la distance est dangerDistance, volume = 0.0
            0,               // Si la distance est 0, volume = 1.0
            0.0,
            1.0
        );
        proximityVolume = constrain(proximityVolume, 0, 1); // S'assure que la valeur reste entre 0 et 1
    } else {
        proximityVolume = 0;
    }

    // 4. MISE À JOUR DE L'ÉTAT CRASHÉ
    if (hit && !parked) crashed = true;

    // 🔊 Son de crash (joué une seule fois)
    if (crashed && !crashPlayed) {
        crashSound.play();
        crashPlayed = true;
    }

    // 5. MISE À JOUR DE LA VOITURE (Contrôles et mouvement)
    if (!parked && !crashed) {
        handleControls(); // Applique la force selon les touches pressées
        car.update();     // Met à jour la position, vitesse et accélération de la voiture
    }

    // 6. LOGIQUE DE FIN DE NIVEAU
    checkParking();      // Vérifie si la voiture est bien garée
    car.show(carImg);    // Affiche la voiture (avec l'alerte visuelle gérée dans Vehicle.show)
    drawHUD();           // Affiche l'interface utilisateur (temps, score, messages)
}

// =========================================================
// MENU
// Dessine l'écran d'accueil.
// =========================================================
function drawMenu() {
    background(15);
    fill(255);
    textAlign(CENTER);
    textSize(42);
    text("🚗 Precision Parking", width / 2, height / 2 - 80); 

    textSize(18);
    fill(180);
    text("Manœuvre, précision et patience", width / 2, height / 2 - 40);

    // Effet de pulsation sur le bouton "DÉMARRER"
    let pulse = sin(frameCount * 0.05) * 8; 
    fill(0, 180, 255);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 40, 240 + pulse, 50, 12); 

    fill(0);
    textSize(20);
    text("▶ DÉMARRER", width / 2, height / 2 + 45);
    
    fill(200);
    textSize(14);
    text("F : Plein écran", width / 2, height - 30); // Indication du plein écran
}

// =========================================================
// LEVEL SETUP
// Configure le niveau de jeu actuel.
// =========================================================
function setupLevel() {
    // Réinitialisation des drapeaux et des listes
    parked = false;
    crashed = false;
    successPlayed = false;
    crashPlayed = false;
    obstacles = [];

    // Création d'une nouvelle voiture et du chrono
    car = new Vehicle(0, 0); // La position de départ sera ajustée par niveau
    car.angle = 0;
    startTime = millis();

    // Démarrage de la musique
    if (!bgMusic.isPlaying()) {
        bgMusic.loop();
        bgMusic.setVolume(0.3);
    }

    // Mise à jour de la position de la place de parking (dépend des dimensions actuelles du canvas)
    parkingSpot.pos.set(width - 100, height / 2);

    // --- LOGIQUE SPÉCIFIQUE À CHAQUE NIVEAU ---
    
    // ---------- NIVEAU 1 ----------
    if (level === 1) {
        parkingMessage = "NIVEAU 1 | Approche libre";
        // Configuration simple de la place de parking
        parkingSpot.w = 80;
        parkingSpot.h = 40;
        parkingSpot.angle = 0;
        car.pos.set(150, height / 2);

        // Ajout des murs (obstacles invisibles pour tester checkEdges)
        obstacles.push(new Obstacle(-100, 0, 100, height));
        obstacles.push(new Obstacle(0, -100, width, 100));
        obstacles.push(new Obstacle(0, height, width, 100));
    }

    // ---------- NIVEAU 2 (Slalom) ----------
    if (level === 2) {
        parkingMessage = "NIVEAU 2 | Slalom vertical";
        parkingSpot.w = 60;
        parkingSpot.h = 30;
        parkingSpot.angle = 0;
        car.pos.set(100, height / 2);

        const x = width / 2;
        const size = 30;
        const gap = 90;

        const startY = size;
        const endY = height - size;

        // Génération automatique des cônes pour le slalom
        for (let y = startY; y <= endY; y += gap) {
            obstacles.push(
                new Obstacle(x, y, size, size, "cone")
            );
        }
    }


    // ---------- NIVEAU 3 (Complexe) ----------
    if (level === 3) {
        parkingMessage = "NIVEAU 3 | Slalom vertical multiple + parking (aléatoire)";

        // Place de parking verticale (nécessite une rotation pour la validation)
        parkingSpot.w = 45;
        parkingSpot.h = 60;
        parkingSpot.angle = PI / 2; // Angle de 90 degrés

        car.pos.set(100, height / 2);

        const baseX = width / 2 - 150;
        const lineSpacing = 90;
        const gap = 90;
        const size = 30;
        const baseOffsetsY = [80, -100, 80, -100, 80];
        const startY = size;
        const endY = height - size;

        // Génération du slalom complexe avec aléatoire
        for (let line = 0; line < baseOffsetsY.length; line++) {
            const x = baseX + line * lineSpacing + random(-15, 15);
            const offsetY = baseOffsetsY[line] + random(-30, 30);

            for (let y = startY + offsetY; y <= endY + offsetY; y += gap) {
                // Création d'un trou aléatoire (20% de chance de sauter un cône)
                if (random() < 0.2) continue;

                obstacles.push(
                    new Obstacle(
                        x + random(-10, 10), // Micro zigzag sur les cônes
                        y,
                        size,
                        size,
                        "cone"
                    )
                );
            }
        }
    }
}

// =========================================================
// PARKING LOGIC
// Vérifie si la voiture est correctement garée.
// =========================================================
function checkParking() {
    if (parked || crashed) return;

    let speedOK = car.vel.mag() < 0.3; // La voiture doit être presque à l'arrêt
    
    // 1. CALCUL DE LA POSITION LOCALE
    // Déplace le système de coordonnées à la place de parking, puis le fait tourner
    let local = p5.Vector.sub(car.pos, parkingSpot.pos);
    local.rotate(-parkingSpot.angle); // Applique la rotation inverse de la place

    // 2. VÉRIFICATION DANS LA ZONE
    // Vérifie si la voiture est dans les limites de la place de parking (avec une petite marge)
    let inside =
        abs(local.x) < parkingSpot.w / 2 - 6 &&
        abs(local.y) < parkingSpot.h / 2 - 6;

    let angleOK = true;

    // 3. VÉRIFICATION DE L'ANGLE (obligatoire pour le Niveau 3)
    if (level === 3) {
        // Calcule la différence angulaire entre la voiture et la place (PI/2 ou -PI/2 pour vertical)
        let d1 = abs(car.angle - PI / 2);
        let d2 = abs(car.angle + PI / 2);
        angleOK = min(d1, d2) < 0.15; // Tolérance d'angle
    }

    // 4. VALIDATION FINALE
    if (inside && speedOK && angleOK) {
        parked = true;

        if (!successPlayed) {
            successSound.play();
            successPlayed = true;
        }

        let t = getRemainingTime();
        stars = 3; // Système d'étoiles simple (toujours 3 si réussi)
        score += stars * 100;
    }
}

// =========================================================
// HUD
// Dessine l'interface utilisateur.
// =========================================================
function drawHUD() {
    // Bandeau noir semi-transparent en haut
    fill(0, 0, 0, 180);
    rect(0, 0, width, 60);

    fill(255);
    textSize(16);
    
    // Affichage du temps
    textAlign(LEFT, CENTER);
    text(`⏱ ${getRemainingTime().toFixed(1)}s`, 20, 30);

    // Affichage du score
    textAlign(CENTER, CENTER);
    text(`⭐ Score : ${score}`, width / 2, 30);

    // Affichage du niveau
    textAlign(RIGHT, CENTER);
    text(`Niveau ${level}/${maxLevel}`, width - 20, 30);

    // Messages de fin de jeu
    if (parked) {
        fill(0, 255, 0);
        textSize(28);
        textAlign(CENTER);
        text("RÉUSSI", width / 2, height / 2 - 20);
        text("⭐".repeat(stars), width / 2, height / 2 + 20);
    }

    if (crashed) {
        fill(255, 0, 0);
        textSize(28);
        textAlign(CENTER);
        text("ÉCHEC", width / 2, height / 2);
    }
    
    // Affichage de la proximité et du volume (Alerte)
    if (closestDistance < dangerDistance && closestDistance > 0) {
        fill(255, 165, 0);
        textSize(14);
        textAlign(CENTER);
        text(`⚠️ Proximité: ${closestDistance.toFixed(1)} px | Volume: ${proximityVolume.toFixed(2)}`,
            width / 2, 80);
    }

    // Instructions
    fill(200);
    textSize(14);
    textAlign(CENTER);
    text("Flèches : conduire | E : Menu | R : reset | F : Plein écran", width / 2, height - 20);
}

// =========================================================
// UTILS
// Fonctions utilitaires simples.
// =========================================================
function getRemainingTime() {
    // Calcule le temps restant en secondes
    return max(0, timeLimit - (millis() - startTime) / 1000);
}

function drawParkingSpot() {
    // Dessine la place de parking avec sa position et son angle
    push();
    translate(parkingSpot.pos.x, parkingSpot.pos.y);
    rotate(parkingSpot.angle);
    stroke(255);
    noFill();
    rectMode(CENTER);
    rect(0, 0, parkingSpot.w, parkingSpot.h);
    pop();
}

function handleControls() {
    // Applique les forces de contrôle à la voiture en fonction des touches fléchées
    if (keyIsDown(UP_ARROW)) car.accelerate(car.accForce);
    if (keyIsDown(DOWN_ARROW)) car.accelerate(-car.accForce * 0.5);
    if (keyIsDown(LEFT_ARROW)) car.steer(-1);
    if (keyIsDown(RIGHT_ARROW)) car.steer(1);
}

// =========================================================
// INPUT
// Gestion des interactions utilisateur (clavier et souris).
// =========================================================

function resetGameToMenu() {
    // Remet le jeu à l'état initial
    gameState = "menu";
    level = 1;
    score = 0;
}

function keyPressed() {

    // 🔊 DÉBLOQUER L’AUDIO
    // Obligatoire dans les navigateurs modernes: l'audio doit être déclenché par une action utilisateur
    if (!audioUnlocked) {
        userStartAudio();
        audioUnlocked = true;
        console.log("🔊 Audio activé (key)");
    }
    
    // 🎯 GESTION DU PLEIN ÉCRAN (Touche F)
    if (key === 'f' || key === 'F') {
        let fs = fullscreen();
        fullscreen(!fs);
        // windowResized() sera appelée automatiquement après le changement pour adapter le canvas
        return; 
    }
    
    // 🚪 RETOUR AU MENU PRINCIPAL (Touche E)
    if ((key === 'e' || key === 'E') && gameState === "play") {
        resetGameToMenu();
        return;
    }


    if (gameState === "menu") {
        // Début du jeu
        gameState = "play";
        setupLevel();
        return;
    }

    // R : Reset du niveau
    if (key === 'r' || key === 'R') setupLevel();

    // ESPACE : Passer au niveau suivant si garé
    if (key === ' ' && parked) {
        level++;
        if (level > maxLevel) level = 1; // Recommence au niveau 1 après le dernier
        setupLevel();
    }
}

function mousePressed() {
    // Déblocage de l'audio via clic souris si nécessaire
    if (!audioUnlocked) {
        userStartAudio();
        audioUnlocked = true;
        console.log("🔊 Audio activé (mouse)");
    }
}

// =========================================================
// 🔄 REDIMENSIONNEMENT DU CANVAS
// Fonction appelée automatiquement par p5.js quand la fenêtre change de taille (ex: Plein Écran)
// =========================================================
function windowResized() {
    // Redimensionne le canvas pour prendre toute la fenêtre du navigateur
    resizeCanvas(windowWidth, windowHeight); 

    // Réinitialise le niveau pour repositionner correctement tous les éléments (place de parking, obstacles) 
    // par rapport aux nouvelles dimensions (width et height).
    if (gameState === "play") {
        setupLevel(); 
    }
}