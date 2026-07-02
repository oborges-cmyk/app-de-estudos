let tempo = 1500;
let tempoInicial = 1500;
let intervalo = null;
let pausado = false;
let xp = Number(localStorage.getItem("xp")) || 0;
let feitas = 0;
let total = 0;
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let arquivo = JSON.parse(localStorage.getItem("arquivo")) || [];
let calendario = JSON.parse(localStorage.getItem("calendario")) || {};

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

            alert("Tempo encerrado! Você ganhou 5 XP.");
            xp += 5;
            localStorage.setItem("xp", xp);
            atualizarXpDisplay();

            registrarNoCalendario(new Date(), {tipo: 'pomodoro', xp:5});

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
    const texto = document.getElementById("tarefa").value.trim();

    if (texto === "") return;

    const item = {
        texto: texto,
        concluida: false
    };

    tarefas.push(item);
    salvarTarefas();

    renderTarefas();

    document.getElementById("tarefa").value = "";
}

function renderTarefas(){
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    feitas = 0;
    total = tarefas.length;

    tarefas.forEach((t, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `\n            <span>${t.texto}</span>\n        `;

        if (t.concluida) {
            li.classList.add("concluida");
            feitas++;
        }

        const btn = document.createElement('button');
        btn.textContent = '✓';
        btn.onclick = () => {
            const was = t.concluida;
            t.concluida = !t.concluida;
            if (t.concluida) {
                li.classList.add("concluida");
            } else {
                li.classList.remove("concluida");
            }
            feitas = tarefas.filter(x => x.concluida).length;
            // dar XP apenas quando marcar como concluída
            if(!was && t.concluida){
                xp += 10;
                atualizarXpDisplay();
                registrarNoCalendario(new Date(), {tipo:'tarefaconcluida', texto: t.texto, xp:10});
            }
            salvarTarefas();
            atualizarProgresso();
            atualizarEstatisticas();
        };

        const btnArch = document.createElement('button');
        btnArch.textContent = '📦';
        btnArch.title = 'Arquivar';
        btnArch.onclick = () => {
            archiveTask(idx);
        };

        li.appendChild(btn);
        li.appendChild(btnArch);
        lista.appendChild(li);
    });

    atualizarProgresso();
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


// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    const temaBtn = document.getElementById("temaBtn");

    // carregar tema salvo (usa a classe 'dark-mode')
    if (localStorage.getItem("tema") === "true") {
        document.body.classList.add("dark-mode");
    }

    temaBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("tema", document.body.classList.contains("dark-mode"));
    });

    // atualizar timer e lista
    atualizarTimer();
    renderTarefas();
    renderArquivo();
    atualizarXpDisplay();
    atualizarEstatisticas();

    // menu
    const menuBtn = document.getElementById('menuBtn');
    if(menuBtn){
        menuBtn.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });
    }

    // navegação simples: esconder/mostrar seções por padrão
    const arquivoEl = document.getElementById('arquivo');
    const estatEl = document.getElementById('estatisticas');
    const calEl = document.getElementById('calendario');
    if(arquivoEl) arquivoEl.style.display = 'none';
    if(estatEl) estatEl.style.display = 'none';
    if(calEl) calEl.style.display = 'none';
});

function atualizarXpDisplay(){
    const el = document.getElementById('xpValue');
    if(el) el.textContent = xp;
    const statXp = document.getElementById('statXp');
    if(statXp) statXp.textContent = xp;
}

function salvarTudo(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('arquivo', JSON.stringify(arquivo));
    localStorage.setItem('calendario', JSON.stringify(calendario));
    localStorage.setItem('xp', xp);
}

function archiveTask(index){
    const item = tarefas.splice(index,1)[0];
    if(!item) return;
    const registro = {
        texto: item.texto,
        concluida: item.concluida || false,
        data: new Date().toISOString()
    };
    arquivo.push(registro);
    salvarTudo();
    renderTarefas();
    renderArquivo();
    atualizarEstatisticas();
}

function renderArquivo(){
    const ul = document.getElementById('listaArquivo');
    if(!ul) return;
    ul.innerHTML = '';
    arquivo.forEach((a, idx)=>{
        const li = document.createElement('li');
        li.textContent = `${a.texto} — ${new Date(a.data).toLocaleString()}`;
        const btnRestore = document.createElement('button');
        btnRestore.textContent = 'Restaurar';
        btnRestore.onclick = ()=>{
            tarefas.push({texto:a.texto, concluida:a.concluida});
            arquivo.splice(idx,1);
            salvarTudo();
            renderTarefas();
            renderArquivo();
            atualizarEstatisticas();
        };
        const btnDel = document.createElement('button');
        btnDel.textContent = 'Excluir';
        btnDel.onclick = ()=>{
            if(confirm('Excluir permanentemente?')){
                arquivo.splice(idx,1);
                salvarTudo();
                renderArquivo();
                atualizarEstatisticas();
            }
        };
        li.appendChild(btnRestore);
        li.appendChild(btnDel);
        ul.appendChild(li);
    });
}

function limparArquivo(){
    if(confirm('Limpar todo o arquivo?')){
        arquivo = [];
        salvarTudo();
        renderArquivo();
        atualizarEstatisticas();
    }
}

function atualizarEstatisticas(){
    const totalT = tarefas.length + arquivo.length;
    const concl = tarefas.filter(t=>t.concluida).length + arquivo.filter(a=>a.concluida).length;
    const taxa = totalT>0? Math.round((concl/totalT)*100):0;
    const elTotal = document.getElementById('statTotal');
    if(elTotal) elTotal.textContent = totalT;
    const elFeitas = document.getElementById('statFeitas');
    if(elFeitas) elFeitas.textContent = concl;
    const elTaxa = document.getElementById('statTaxa');
    if(elTaxa) elTaxa.textContent = taxa+'%';
    const elXp = document.getElementById('statXp');
    if(elXp) elXp.textContent = xp;
    const elStreak = document.getElementById('statStreak');
    if(elStreak) elStreak.textContent = calcularStreak();
}

function calcularStreak(){
    const dias = Object.keys(calendario).sort().reverse();
    if(dias.length===0) return 0;
    let streak = 0;
    let hoje = new Date();
    hoje.setHours(0,0,0,0);
    for(let i=0;i<dias.length;i++){
        const d = new Date(dias[i]);
        d.setHours(0,0,0,0);
        const diff = Math.round((hoje - d)/(1000*60*60*24));
        if(diff===streak){
            streak++;
        }
    }
    return streak;
}

function registrarNoCalendario(date, entry){
    const key = new Date(date).toISOString().slice(0,10);
    if(!calendario[key]) calendario[key]=[];
    calendario[key].push(entry);
    salvarTudo();
}

function mostrarPorData(){
    const input = document.getElementById('dataCalendario');
    const key = input.value;
    const ul = document.getElementById('listaPorData');
    ul.innerHTML = '';
    if(!key) return;
    const itens = calendario[key] || [];
    itens.forEach(it=>{
        const li = document.createElement('li');
        li.textContent = JSON.stringify(it);
        ul.appendChild(li);
    });
}

function salvarTarefas(){
    salvarTudo();
}