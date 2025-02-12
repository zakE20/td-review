import Player from "./Player.js";
import Obstacle from "./Obstacle.js";
import ObjetSouris from "./ObjetSouris.js";
import { rectsOverlap } from "./Collisions.js";
import { initListeners } from "./ecouteurs.js";

export default class Game {
    objetsGraphiques = [];
    niveau = 1; 
    VitesseObstacle = 3;

    constructor(canvas) {
        this.canvas = canvas;
        // etat du clavier
        this.inputStates = {
            mouseX: 0,
            mouseY: 0,
        };
    }

    async init(canvas) {
        this.ctx = this.canvas.getContext("2d");

        this.player = new Player(100, 100);
        this.objetsGraphiques.push(this.player);

        // Un objet qui suit la souris, juste pour tester
        this.objetSouris = new ObjetSouris(100, 200, 25, 25, "orange");
        this.objetsGraphiques.push(this.objetSouris);

        // On crée des obstacles
        let obstacle1 = new Obstacle(200, 0, 40, 400, "red");
        this.objetsGraphiques.push(obstacle1);

        // On ajoute la sortie 
        this.sortie = new Obstacle(this.canvas.width - 40, this.canvas.height - 40, 50, 50, "green");
        this.objetsGraphiques.push(this.sortie);

        // On initialise les écouteurs de touches, souris, etc.
        initListeners(this.inputStates, this.canvas);

        console.log("Game initialisé");
    }

    start() {
        console.log("Game démarré");

        // On démarre une animation à 60 images par seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    mainAnimationLoop() {
        // 1 - on efface le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2 - on dessine les objets à animer dans le jeu
        // ici on dessine le joueur, obstacles, etc.
        this.drawAllObjects();

        // 3 - On regarde l'état du clavier, manette, souris et on met à jour
        // l'état des objets du jeu en conséquence
        this.updateObstacles();
        this.movePlayer();
        this.testCollisionPlayerObstacles();
        this.iswin();

        // 4 - on demande au navigateur d'appeler la fonction mainAnimationLoop
        // à nouveau dans 1/60 de seconde
        requestAnimationFrame(this.mainAnimationLoop.bind(this));
    }

    drawAllObjects() {
        // Dessine tous les objets du jeu
        this.objetsGraphiques.forEach(obj => {
            obj.draw(this.ctx);
        });
    }

    updateObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Obstacle && obj !== this.sortie) { 
                obj.x += this.VitesseObstacle;
                 if (obj.x <= 0 || obj.x + obj.w >= this.canvas.width) {
                    obj.x = Math.max(0, Math.min(this.canvas.width - obj.w, obj.x)); 
                    this.VitesseObstacle = -this.VitesseObstacle; // Inverser la direction
                }

                //  si l'obstacle entre en collision avec le joueur
                if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    // Collision avec l'obstacle
                    this.player.x = this.player.previousX;
                    this.player.y = this.player.previousY;
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                    console.log("Collision avec obstacle");
                }
            }
        });
    }

    movePlayer() {
        this.player.previousX = this.player.x;
        this.player.previousY = this.player.y;

        this.player.vitesseX = 0;
        this.player.vitesseY = 0;
        
        // Déplacement du joueur avec les touches fléchées
        if(this.inputStates.ArrowRight) {
            this.player.vitesseX = 3;
        } 
        if(this.inputStates.ArrowLeft) {
            this.player.vitesseX = -3;
        } 

        if(this.inputStates.ArrowUp) {
            this.player.vitesseY = -3;
        } 

        if(this.inputStates.ArrowDown) {
            this.player.vitesseY = 3;
        } 

        this.player.move();

        // Tester les collisions du joueur avec les obstacles
        this.testCollisionsPlayer();
    }

    testCollisionsPlayer() {
        // Teste collision avec les bords du canvas
        this.testCollisionPlayerBordsEcran();

        // Teste collision avec les obstacles
        this.testCollisionPlayerObstacles();
    }

    testCollisionPlayerBordsEcran() {
        // Rappel : le x, y du joueur est en son centre, pas dans le coin en haut à gauche!
        if(this.player.x - this.player.w/2 < 0) {
            // On stoppe le joueur
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.player.w/2;
        }
        if(this.player.x + this.player.w/2 > this.canvas.width) {
            this.player.vitesseX = 0;
            // on le remet au point de contact
            this.player.x = this.canvas.width - this.player.w/2;
        }

        if(this.player.y - this.player.h/2 < 0) {
            this.player.vitesseY = 0;
            this.player.y = this.player.h / 2;
        }
       
        if(this.player.y + this.player.h/2 > this.canvas.height) {
            this.player.vitesseY = 0;
            this.player.y = this.canvas.height - this.player.h / 2;
        }
    }

    testCollisionPlayerObstacles() {
        this.objetsGraphiques.forEach(obj => {
            if (obj instanceof Obstacle && obj !== this.sortie) { 
                if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, obj.x, obj.y, obj.w, obj.h)) {
                    this.player.x = this.player.previousX;
                    this.player.y = this.player.previousY;
                    this.player.vitesseX = 0;
                    this.player.vitesseY = 0;
                    console.log("Collision avec obstacle");
                }
            }
        });
    }

    iswin() {
        if (rectsOverlap(this.player.x - this.player.w / 2, this.player.y - this.player.h / 2, this.player.w, this.player.h, this.sortie.x, this.sortie.y, this.sortie.w, this.sortie.h)) {
            console.log("niveau terminé ");
            this.niveauSuivante();
        }
    }

    niveauSuivante() {
        this.player.x = 100;
        this.player.y = 100;
        console.log("Passage au niveau suivant,bravo");
        this.niveau++;
        this.LevelSuivant();
    }

    LevelSuivant() {
        this.objetsGraphiques = [this.player, this.objetSouris];

        for (let i = 0; i < this.niveau; i++) {
            let obstacle = new Obstacle(
                Math.random() * (this.canvas.width - 50),
                Math.random() * (this.canvas.height - 50),
                40,
                40,
                "red"
            );
            this.objetsGraphiques.push(obstacle);
        }

        this.sortie = new Obstacle(this.canvas.width - 50, this.canvas.height - 50, 50, 50, "green");
        this.objetsGraphiques.push(this.sortie);

        console.log("Nouveau niveau cree");
    }
}
