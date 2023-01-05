let canvas;
let ctx;
let rafId;
let particleArray = [];
let mouseX = -10;
let mouseY = -10;
let armCount = 2;
let radiusDistance = 0;
let speedMult = 1;
let spinRotat = 2;
let angle = 0;
let angleD = 0;
let spawnerSpeed = 10;
let gameStarted = false;
let clickedOnScreen = false;

function onLoad() {
    canvas = document.getElementById("maincanvas");
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    ctx = canvas.getContext("2d");
    let canvasSize = 640;
    let canvasOrigin = canvasSize / 2;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    class Particle {
        constructor(x, y, parent = 0, spin = 0, xv, yv, partAngle = 0) {
            this.x = x;
            this.y = y;
            this.r = radiusDistance;

            this.xv = xv;
            this.yv = yv;
            this.angle = partAngle;

            this.ox = x;
            this.oy = y;

            this.vr = spawnerSpeed / 100;
            this.spin = spin;

            this.vs = spinRotat;

            this.parent = parent;
            this.arms = armCount;
            this.size = 8;
            this.graze = 4;
            this.color = `hsl(${this.parent * 20},50%,50%)`;


        }

        draw() {

            //Particle Despawn
            if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                //particleArray.splice(particleArray.indexOf(this),1)
                return;
            }

            //Draw Particles
            if(this.parent !== 0){
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.size / 2, this.size / 4, this.angle, 0, 2 * Math.PI);
                ctx.fill();
            }

            if (this.parent == 0) {
                this.x = this.ox + this.r * Math.cos(this.spin)
                this.y = this.oy + this.r * Math.sin(this.spin)
                this.spin += this.vr;
            }

            for (let index = 0; index < this.arms; index++) {
                if (this.parent == index + 1) {
                    this.x += this.xv;
                    this.y += this.yv;
                }
            }

            if (this.parent == 0) {
                for (let index = 0; index < this.arms; index++) {
                    particleArray.push(new Particle(this.x, this.y, index + 1, this.spin, this.vs * Math.cos(angle + ((index + 1) / this.arms) * 2 * Math.PI), this.vs * Math.sin(angle + ((index + 1) / this.arms) * 2 * Math.PI), angle + ((index + 1) / this.arms) * 2 * Math.PI));

                }
            }


        }
    }

    function animate() {

        angle += angleD;
        angleD += (speedMult * Math.PI / 32768);
        angle = angle % (2 * Math.PI);
        angleD = angleD % (2 * Math.PI);
        rafId = requestAnimationFrame(animate)
        //animation below
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        particleArray.forEach(e => e.draw())
    }

    particleArray.push(new Particle(canvasOrigin, canvasOrigin, 0, 0));
    animate()
}


function onClick(e) {

    canvas.title = "";
    gameStarted = true;

    clickedOnScreen = true;
}

function onMouseMove(e) {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;
    if (clickedOnScreen)
        gameStarted = true;
}

function onMouseLeave() {
    mouseX = -10;
    mouseY = -10;
    gameStarted = false;
}

function handleRestart() {
    armCount = document.getElementById("armInput").value;
    radiusDistance = document.getElementById("radiusInput").value;
    speedMult = document.getElementById("speedMult").value;
    spinRotat = document.getElementById("spinRotat").value;
    spawnerSpeed = document.getElementById("spawnerSpeed").value;

    angleD = document.getElementById("startAngleD").value * Math.PI / 32768;

    angle = 0;

    //Restarts the simulation
    cancelAnimationFrame(rafId)
    particleArray = [];
    onLoad()
}


function saveCanvas() {      
        
        var imageObject = new Image();
        imageObject.src = canvas.toDataURL("image/png");   
        
 
        // Saving it locally automatically
        let link = document.createElement("a");
        link.setAttribute('download', "bowapJS" + Date.now())
        link.href= imageObject.src
        link.click()               
     
}