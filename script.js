let tempo = 1500;
let intervalo;

const frases = [
"Pequenos passos levam longe.",
"Estude hoje para agradecer amanhã.",
"Consistência vence talento.",
"Cada página lida é progresso.",
"Você está mais perto do que ontem."
];

document.getElementById("frase").textContent =
frases[Math.floor(Math.random()*frases.length)];

function atualizarTimer(){

let min = Math.floor(tempo/60);
let seg = tempo%60;

document.getElementById("timer").textContent =
`${String(min).padStart(2,"0")}:${String(seg).padStart(2,"0")}`;
}

function iniciar(){

if(intervalo) return;

intervalo = setInterval(()=>{

tempo--;

atualizarTimer();

if(tempo<=0){
clearInterval(intervalo);
alert("Pomodoro concluído!");
}

},1000);
}

function resetar(){
clearInterval(intervalo);
intervalo=null;
tempo=1500;
atualizarTimer();
}

let total=0;
let feitas=0;

function adicionar(){

const texto =
document.getElementById("tarefa").value;

if(texto==="") return;

const li = document.createElement("li");

li.innerHTML=`
<span>${texto}</span>
<button>✓</button>
`;

const btn = li.querySelector("button");

btn.onclick=()=>{

if(!li.classList.contains("concluida")){
li.classList.add("concluida");
feitas++;
atualizarProgresso();
}
};

document.getElementById("lista")
.appendChild(li);

total++;

atualizarProgresso();

document.getElementById("tarefa").value="";
}

function atualizarProgresso(){

let porcentagem =
total===0 ? 0 :
Math.round((feitas/total)*100);

document.getElementById("preenchimento")
.style.width = porcentagem+"%";

document.getElementById("porcentagem")
.textContent = porcentagem+"%";
}

atualizarTimer();

function trocarTema(){
    document.body.classList.toggle("escuro");

    let btn = document.getElementById("temaBtn");

    if(document.body.classList.contains("escuro")){
        btn.textContent = "☀️ Claro";
    }else{
        btn.textContent = "🌙 Escuro";
    }
}

function criarFlashcard(){

    const pergunta =
    document.getElementById("pergunta").value;

    const resposta =
    document.getElementById("resposta").value;

    if(pergunta === "" || resposta === ""){
        return;
    }

    const card =
    document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
        <h4>${pergunta}</h4>
        <p class="resposta">${resposta}</p>
    `;

    card.addEventListener("click", () => {

        const resp =
        card.querySelector(".resposta");

        if(resp.style.display === "block"){
            resp.style.display = "none";
        }else{
            resp.style.display = "block";
        }

    });

    document
    .getElementById("areaFlashcards")
    .appendChild(card);

    document.getElementById("pergunta").value="";
    document.getElementById("resposta").value="";
}