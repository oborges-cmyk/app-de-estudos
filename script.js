let concluidas = 0;

function adicionarTarefa(){

    const input = document.getElementById("tarefa");
    const texto = input.value.trim();

    if(texto === ""){
        alert("Digite uma tarefa!");
        return;
    }

    const lista = document.getElementById("lista");

    const li = document.createElement("li");

    li.innerHTML = `
        <span>${texto}</span>

        <div class="botoes">
            <button class="concluir">✓</button>
            <button class="excluir">✕</button>
        </div>
    `;

    const btnConcluir = li.querySelector(".concluir");
    const btnExcluir = li.querySelector(".excluir");
    const span = li.querySelector("span");

    btnConcluir.addEventListener("click", () => {

        if(!span.classList.contains("concluida")){
            span.classList.add("concluida");
            concluidas++;
            atualizarContador();
        }

    });

    btnExcluir.addEventListener("click", () => {
        li.remove();
    });

    lista.appendChild(li);

    input.value = "";
}

function atualizarContador(){
    document.getElementById("contador").textContent =
    `Concluídas: ${concluidas}`;
}

function trocarTema(){
    document.body.classList.toggle("escuro");

    let btn = document.getElementById("temaBtn");

    if(document.body.classList.contains("escuro")){
        btn.textContent = "☀️ Claro";
    }else{
        btn.textContent = "🌙 Escuro";
    }
}