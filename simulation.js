class Simulation{
    resolution = 4
    elementBlockSize = 40
    drawing = false
    particleDrawingInterval = null
    updated = false
    element = new Particle("SAND", "yellow", 5, "sand", new Traits(0, 10))
    elements = {
        0: new Particle("SAND", "yellow", 5, "sand", new Traits(0, 10)),
        1: new Particle("SALT", "#D6E2E6", 5, "sand", new Traits(0, 10)),
        2: new Particle("WATER", "lightblue", 3, "water",new Traits(0, 10), "extinguishable"),
        3: new Particle("BLOCK", "black", 50, null),
        4: new Particle("OIL", "#5e5248", 2, "water", new Traits(8, 10)),
        5: new Particle("ASH", "#cfcac6", 2.5, "sand", new Traits(0, 10)),
        6: new Particle("SMOKE", "#a3a3a3", 1, "smoke", new Traits(0, 0), null, new Particle("AIR", "grey", 0, null), 50),
        7: new Particle("AIR", "grey", 0, null),
        8: new Particle("FIRE", "#fa301e", 2, "smoke", new Traits(0, 0), "flammable", new Particle("SMOKE", "#a3a3a3", 1, "smoke", new Traits(0, 0), null, new Particle("AIR", "grey", 0, null), 50), 8),
        9: new Particle("ACID", "#90fe09", 30, "water", new Traits(0, 0), "acid"),
        10: new Particle("FUSE", "brown", 10, null, new Traits(10, 10)),
        11: new Particle("BRICK", "#AA4A44", 5, "block", new Traits(0, 10)),
    }
    particles = []
    oldFrame = []
    constructor(width, height){
        this.width = width
        this.height = height
    }

    make2Darray(){
        let new2DArray = []
        for(let size=0; size<Math.floor(this.height / this.resolution); size++){
            let row = []
            for(let l = 0; l <Math.floor(this.width / this.resolution); l++){
                row.push(new Particle("AIR", "grey", 0, null))
            }
            new2DArray.push(row)
        }
        return new2DArray
    }

    initialDraw(){
        for(let y=0; y<this.height ; y+= this.resolution){
            for(let x=0; x<this.width; x+= this.resolution){
                ctx.fillStyle = this.particles[Math.floor(y / this.resolution)][Math.floor(x / this.resolution)].color
                ctx.fillRect(x, y, this.resolution, this.resolution)
            }
        }
    }

    setEveryParticleToUpdated(){
        for(let i = 0; i < Math.floor(this.height / this.resolution); i++){
            for(let j = 0; j < Math.floor(this.width / this.resolution); j++){
                this.particles[i][j].updated = this.updated
            }
        }
    }

    simulateTraits(y, x, secondY, secondX){
        if(this.particles[y][x].type == this.particles[secondY][secondX].type){
            return
        }
        if(this.particles[y][x].traits.traits[this.particles[secondY][secondX].effect] > Math.floor(Math.random()*10)){
            switch(this.particles[secondY][secondX].effect){
                case "flammable":
                    let newFire = new Particle("FIRE", "#fa301e", 2, "smoke", new Traits(0, 0), "flammable", new Particle("SMOKE", "#a3a3a3", 1, "smoke", new Traits(0, 0), null, new Particle("AIR", "grey", 0, null), 50), 8)
                    this.particles[y][x].changeParticle(newFire)
                    this.particles[y][x].updated = this.updated
                    break
                case "acid":
                    let newAir = new Particle("AIR", "grey", 0, null)
                    this.particles[y][x].changeParticle(newAir)
                    this.particles[secondY][secondX].changeParticle(newAir)
                    this.particles[secondY][secondX].updated = this.updated
                    this.particles[y][x].updated = this.updated
                    break
                default:
                    break

            }
        }
    }

    inRange(y, x){
        return y >= 0 && x >= 0 && y < this.height / this.resolution && x < this.width / this.resolution
    }

    simulatePhysics(){
        this.drawElements()
        for(let y=this.height-this.resolution; y>=0 ; y-= this.resolution){
            for(let x=this.width -this.resolution; x>=0; x-= this.resolution){
                let newY = Math.floor(y / this.resolution)
                let newX = Math.floor(x / this.resolution)
                if(this.particles[newY][newX].type == "AIR"){
                    continue
                }
                if(this.particles[newY][newX].lifeTimeUpdate != this.updated){
                    this.particles[newY][newX].lifeTime--
                    if(this.particles[newY][newX].lifeTime == 0){
                        this.particles[newY][newX].changeParticle(this.particles[newY][newX].replace)
                    }
                    this.particles[newY][newX].lifeTimeUpdate = this.updated
                }
                if(this.particles[newY][newX].updated == this.updated){
                    continue
                }
                else{
                    this.particles[newY][newX].updated = !this.particles[newY][newX].updated
                }

                if(this.particles[newY][newX].effect == "flammable"){
                    for(let i=-1; i<2; i++){
                        for(let j=-1; j <2; j++){
                            if(this.inRange(newY+i, newX+j)){
                                this.simulateTraits(newY+i, newX+j, newY, newX)
                            }
                        }
                    }
                }

                if(this.inRange(newY+1, newX)){
                    if(this.particles[newY+1][newX].effect == "acid"){
                        this.simulateTraits(newY, newX, newY+1, newX)
                    }
                }

                if(this.inRange(newY, newX+1)){
                    if(this.particles[newY][newX+1].effect == "acid"){
                        this.simulateTraits(newY, newX, newY, newX+1)
                    }
                }

                if(this.inRange(newY, newX-1)){
                    if(this.particles[newY][newX-1].effect == "acid"){
                        this.simulateTraits(newY, newX, newY, newX-1)
                    }
                }


                switch (this.particles[newY][newX].physic) {
                    case "sand":
                        this.sandLike(newY, newX)
                        break
                    case "water":
                        this.waterLike(newY, newX)
                        break
                    case "smoke":
                        this.smokeLike(newY, newX)
                    case "block":
                        this.brickLike(newY, newX)
                        break
                    default:
                        break
                }
            }
        }
    }

    drawElements(){
        for(let ind in this.elements){
            ctx.fillStyle = this.elements[ind].color
            ctx.fillRect(ind * this.elementBlockSize, this.height, this.elementBlockSize, this.elementBlockSize)
            if(this.element.color == this.elements[ind].color){
                ctx.beginPath()
                ctx.lineWidth = "3"
                ctx.strokeStyle = "green"
                ctx.rect(ind*this.elementBlockSize + 3, this.height + 3, 34, 34)
                ctx.stroke()
            }
            ctx.font = "10px Arial";
            ctx.fillText(this.elements[ind].type, ind * this.elementBlockSize, this.height+this.elementBlockSize+10);
        }
    }

    drawSimulation(){
        simulation.simulatePhysics()
        for(let y=0; y<simulation.height ; y+= simulation.resolution){
            for(let x=0; x<simulation.width; x+= simulation.resolution){
                if(simulation.particles[Math.floor(y / simulation.resolution)][Math.floor(x / simulation.resolution)].color !=
                simulation.oldFrame[Math.floor(y / simulation.resolution)][Math.floor(x / simulation.resolution)].color){
                    simulation.oldFrame[Math.floor(y / simulation.resolution)][Math.floor(x / simulation.resolution)].color = simulation.particles[Math.floor(y / simulation.resolution)][Math.floor(x / simulation.resolution)].color
                    ctx.fillStyle = simulation.particles[Math.floor(y / simulation.resolution)][Math.floor(x / simulation.resolution)].color
                    ctx.fillRect(x, y, simulation.resolution, simulation.resolution)
                }
            }
        }
        simulation.setEveryParticleToUpdated()
        simulation.updated = !simulation.updated
    }

    downMove(y, x){
        if(this.particles[y+1][x].level < this.particles[y][x].level 
            && this.particles[y+1][x].updated != this.updated){
                this.swapParticles(y+1, x, y, x)
        }
        else if( x > 0 && this.particles[y+1][x-1].level < this.particles[y][x].level
            && this.particles[y+1][x-1].updated != this.updated){
                this.swapParticles(y+1, x-1, y, x)
        }
        else if( x < Math.floor(this.width / this.resolution)-1 
            && this.particles[y+1][x+1].level < this.particles[y][x].level
            && this.particles[y+1][x+1].updated != this.updated){
            this.swapParticles(y+1, x+1, y, x)
        }
    }

    waterDownMove(y, x, orientation){
        if(this.particles[y+orientation][x].level < this.particles[y][x].level 
            && this.particles[y+orientation][x].updated != this.updated){
                this.swapParticles(y+orientation, x, y, x)
        }
        else if( x > 0 && this.particles[y+orientation][x-1].level < this.particles[y][x].level 
            && this.particles[y+orientation][x-1].updated != this.updated){
                this.swapParticles(y+orientation, x-1, y, x)
        }
        else if( x < Math.floor(this.width / this.resolution)-1 
            && this.particles[y+orientation][x+1].level < this.particles[y][x].level
            && this.particles[y+orientation][x+1].updated != this.updated){
            this.swapParticles(y+orientation, x+1, y, x)
        }
        else{
            this.sideMove(y, x)
        }
    }
    

    sideMove(y, x){
        if (this.particles[y][x].leftDirection){
            if( x > 0 && this.particles[y][x-1].level < this.particles[y][x].level
                && this.particles[y][x-1].updated != this.updated){
                    this.swapParticles(y, x-1, y, x)
            }
            else{
                this.particles[y][x].leftDirection = !this.particles[y][x].leftDirection
            }
        }
        else{
            if( x < Math.floor(this.width / this.resolution)-1 
                && this.particles[y][x+1].level < this.particles[y][x].level
                && this.particles[y][x+1].updated != this.updated){
                    this.swapParticles(y, x+1, y, x)
            }
            else{
                this.particles[y][x].leftDirection = !this.particles[y][x].leftDirection
            }
        }
    }

    brickLike(y, x){
        if(y < Math.floor(this.height / this.resolution)-1 
            && this.particles[y+1][x].level < this.particles[y][x].level
            && this.particles[y+1][x].updated != this.updated){
                this.swapParticles(y+1, x, y, x)
        }
    }

    sandLike(y, x){
        if(y < Math.floor(this.height / this.resolution)-1){
            this.downMove(y, x)
        }
    }

    waterLike(y, x){
        if(y < Math.floor(this.height / this.resolution)-1){
            this.waterDownMove(y, x, 1)
        }
        else{
            this.sideMove(y, x)
        }
    }

    smokeLike(y, x){
        if(y > 0){
            this.waterDownMove(y, x, -1)
        }
        else{
            this.sideMove(y, x)
        }
    }

    replaceParticle(y, x, newParticle){
        this.particles[y][x] = newParticle
    }

    swapParticles(firstY, firstX, secondY, secondX){
        if(this.particles[secondY][secondX].effect == "acid"){
            this.simulateTraits(firstY, firstX, secondY, secondX)
        }
        let tempParticle = this.particles[firstY][firstX]
        this.particles[firstY][firstX] = this.particles[secondY][secondX]
        this.particles[secondY][secondX] = tempParticle

        this.particles[firstY][firstX].updated = this.updated
        this.particles[secondY][secondX].updated = this.updated
    }
}