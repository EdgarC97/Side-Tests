// Obtienes el elemento canvas del DOM. Esto te permite dibujar gráficos 2D en él.
const canvas = document.getElementById('canvas');

// Obtienes el contexto de renderizado 2D para el canvas. Este objeto te permite dibujar en el canvas.
const ctx = canvas.getContext('2d');

// Ajustas el ancho y alto del canvas al tamaño de la ventana. Esto asegura que el canvas ocupe toda la pantalla.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Inicializas un array vacío para almacenar las partículas. Cada partícula será un objeto que representará un punto que se moverá en el canvas.
let spots = [];

// Inicializas una variable para el tono de color. Esta variable se incrementará con el tiempo para cambiar el color de las partículas.
let hue = 0;

// Creas un objeto para almacenar las coordenadas del mouse. Estas coordenadas se actualizarán cada vez que el mouse se mueva.
const mouse = {
    x: undefined,
    y: undefined
}

// Agregas un evento de movimiento del mouse al canvas. Cuando el mouse se mueve, actualizas las coordenadas del mouse y creas nuevas partículas.
canvas.addEventListener('mousemove' , function(event){
    let rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    for (let i = 0; i < 3; i++){
        spots.push(new Particle());
    }
})

// Definición de la clase Particle. Cada partícula tiene su propia posición (x, y), tamaño, velocidad y color.
class Particle {
    constructor(){
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = 'hsl(' + hue + ' , 100%, 50%)';
    }
    // Método para actualizar la posición y el tamaño de la partícula.
    update () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.1) this.size -= 0.03;
    }
    
    // Método para dibujar la partícula en el canvas.
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Función para manejar las partículas. Actualiza, dibuja y elimina las partículas según sea necesario.
function handLeParticle() {
    for (let i  = 0; i < spots.length; i++){
        spots[i].update();
        spots[i].draw();
        for (let j = i; j < spots.length; j++){
            const dx = spots[i].x - spots[j].x;
            const dy = spots[i].y - spots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 90){
                ctx.beginPath();
                ctx.strokeStyle = spots[i].color;
                ctx.lineWidth = spots[i].size / 10;
                ctx.moveTo(spots[i].x, spots[i].y);
                ctx.lineTo(spots[i].x, spots[i].y);
                ctx.stroke();
            }
        }
        if (spots[i].size <= 0.3){
            spots.splice(i, 1); i--;
        }
    }
}

// Función para animar las partículas. Limpia el canvas, maneja las partículas, incrementa el tono y solicita la próxima animación.
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handLeParticle();
    hue++;
    requestAnimationFrame(animate);
}

// Eventos para manejar el cambio de tamaño de la ventana y el movimiento del mouse fuera de la ventana.
window.addEventListener('resize' , function(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})
window.addEventListener('mouseout' , function(){
    mouse.x = undefined;
    mouse.y = undefined;
})

// Inicia la animación.
animate();
