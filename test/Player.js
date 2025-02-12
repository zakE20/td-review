import ObjectGraphique from "./ObjectGraphique.js";
import { drawCircleImmediat } from "./utils.js";   

export default class Player extends ObjectGraphique {
    constructor(x, y) {
        super(x, y, 50, 50);
        this.vitesseX = 0;
        this.vitesseY = 0;
        this.couleur = "blue";
        this.angle = 0;
    }

    draw(ctx) {
        // Ici on dessine un monstre
        ctx.save();

        // on déplace le systeme de coordonnées pour placer
        // le monstre en x, y.Tous les ordres de dessin
        // dans cette fonction seront par rapport à ce repère
        // translaté
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        // on recentre le monstre. Par défaut le centre de rotation est dans le coin en haut à gauche
        // du rectangle, on décale de la demi largeur et de la demi hauteur pour 
        // que le centre de rotation soit au centre du rectangle.
        // Les coordonnées x, y du monstre sont donc au centre du rectangle....
        ctx.translate(-this.w / 2, -this.h / 2);
        ctx.scale(0.5, 0.5);



        // tete du monstre
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(40, 40, 40, 0, 2 * Math.PI);
        ctx.fill();

        
        // yeux
        drawCircleImmediat(ctx, 15, 20, 10, "black");
        drawCircleImmediat(ctx, 60, 20, 10, "black");
        //nez
        drawCircleImmediat(ctx, 40, 40, 5, "black");

        // bouche
        ctx.fillStyle = "black";
        ctx.fillRect(25, 60, 30, 10);
        
        // Les bras
        ctx.fillStyle = "blue";
        ctx.fillRect(5, 50, 10, 40);
        ctx.fillRect(65,50,10,40);

        // restore
        ctx.restore();

        // super.draw() dessine une croix à la position x, y
        // pour debug
        super.draw(ctx);
    }

    move() {
        this.x += this.vitesseX;
        this.y += this.vitesseY;
    }
}