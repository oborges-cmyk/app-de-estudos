let tempo = 1500;
let tempoInicial = 1500;
let intervalo = null;
let pausado = false;
let texto = 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let feitas = 0;
let total = 0;
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

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

    if(intervalo != null) return;

    pausado = false;
    document.getElementById("btnPausar").textContent = "Pausar";

    intervalo = setInterval(() => {

        tempo--;

        atualizarTimer();

        if(tempo <= 0){

            clearInterval(intervalo);
            intervalo = null;

            alert("Tempo encerrado!");

        }

    },1000);

}

function pausar(){

    const botao = document.getElementById("btnPausar");

    if(!pausado){

        clearInterval(intervalo);
        intervalo = null;

        pausado = true;
        botao.textContent = "Continuar";

    }else{

        iniciar();

        pausado = false;
        botao.textContent = "Pausar";

    }

}

function resetar(){

    clearInterval(intervalo);
    intervalo = null;

    tempo = tempoInicial;
    pausado = false;

    document.getElementById("btnPausar").textContent = "Pausar";

    atualizarTimer();

}

function modo2510(){

    clearInterval(intervalo);
    intervalo = null;

    tempoInicial = 25 * 60;
    tempo = tempoInicial;

    atualizarTimer();

}

function modo5010(){

    clearInterval(intervalo);
    intervalo = null;

    tempoInicial = 50 * 60;
    tempo = tempoInicial;

    atualizarTimer();

}

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

document.getElementById("tarefa").value="";
}

function atualizarProgresso(){

    let porcentagem = 0;

    if(total > 0){
        porcentagem = (feitas / total) * 100;
    }

    document.getElementById("preenchimento").style.width =
    porcentagem + "%";

    document.getElementById("porcentagem").textContent =
    Math.round(porcentagem) + "%";
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


// script.js
document.addEventListener("DOMContentLoaded", () => {
    const temaBtn = document.getElementById("temaBtn");

    temaBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
});

if(localStorage.getItem("tema")=="true"){

    document.body.classList.add("dark");

}

localStorage.setItem(
    "tema",
    document.body.classList.contains("dark")
    );

function salvarTarefas(){
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

tarefas.push({

    texto:texto,
    concluida:false

});

salvarTarefas();