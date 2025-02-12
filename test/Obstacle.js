import ObjectGraphique from "./ObjectGraphique.js";

export default class Obstacle extends ObjectGraphique {
    constructor(x, y, w, h, couleur) {
        super(x, y, w, h, couleur);
        //this.vitesseX=3;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
    }
    move(ctx){
        this.x += 3;
        if (this.x <= 0 || this.x + this.w >= ctx.canvas.width) {
            this.x = Math.max(0, Math.min(ctx.canvas.width - this.w, this.x)); 
            //this.vitesseX = -this.vitesseX; // Inverser la direction
        }
    }
    
}