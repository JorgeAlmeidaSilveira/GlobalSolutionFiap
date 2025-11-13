document.addEventListener("DOMContentLoaded", function () {

    const taskForm = document.querySelector(".new-task-form");
    const taskInput = document.querySelector("#new-task-input");
    const taskList = document.querySelector(".task-list");
    const priorityButtons = document.querySelectorAll(".p-btn");
    const hiddenInput = document.querySelector("#selected-priority");
    const deleteCompletedBtn = document.getElementById("delete-completed-btn");

   // --- Função Principal de Ordenação ---
    function reorderTasks() {
        // Pega todos os itens atuais da lista (li)
        const itemsArray = Array.from(taskList.children);

        itemsArray.sort((a, b) => {
            // A. CRITÉRIO DE CONCLUSÃO (Status)
            const aCompleted = a.classList.contains("completed");
            const bCompleted = b.classList.contains("completed");

            // Se um está concluído e o outro não, o não-concluído vem primeiro
            if (aCompleted && !bCompleted) return 1; // a vai para o fim
            if (!aCompleted && bCompleted) return -1; // a vem para o começo

            // B. CRITÉRIO DE PRIORIDADE (Se o status for igual)
            // Vamos atribuir valores numéricos: Alta=3, Média=2, Baixa=1
            const getVal = (item) => {
                // Busca o texto dentro do span .task-category
                const priorityText = item.querySelector(".task-category").innerText.trim();
                if (priorityText === "Alta") return 3;
                if (priorityText === "Média") return 2;
                return 1; // Baixa ou padrão
            };

            const valA = getVal(a);
            const valB = getVal(b);

            // Queremos do maior para o menor (3 -> 2 -> 1)
            return valB - valA; 
        });

        // Reinsere os itens na lista na nova ordem
        itemsArray.forEach(item => taskList.appendChild(item));
    }

    // --- Lógica de Seleção dos Botões ---
    priorityButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            // 1. Remove a classe 'selected' de TODOS os botões
            priorityButtons.forEach(b => b.classList.remove("selected"));
            // 2. Adiciona a classe 'selected' APENAS no botão clicado
            this.classList.add("selected");
            // 3. Atualiza o input escondido com o valor (Baixa, Média ou Alta)
            hiddenInput.value = this.getAttribute("data-value");
        });
    });

    // --- Adicionar Nova Tarefa ---
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        const priorityValue = hiddenInput.value; // Pega valor do input escondido

        if (taskName !== "") {

            let priorityClass = "";
            // Define as cores da TAG na lista (igual antes)
            if (priorityValue === "Alta") {
                priorityClass = "high-priority";
            } else if (priorityValue === "Média") {
                priorityClass = "medium-priority";
            } else {
                priorityClass = "low-priority";
            }

            const taskHTML = `
                <li class="task-item">
                    <label class="task-checkbox">
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <div class="task-details">
                        <p class="task-name">${taskName}</p>
                        <span class="task-category ${priorityClass}">${priorityValue}</span>
                    </div>
                    <button class="task-delete-btn" title="Excluir tarefa">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </li>
            `;

            taskList.insertAdjacentHTML("beforeend", taskHTML);
            reorderTasks();
            // Resetar o formulário
            taskInput.value = "";
            taskInput.focus();
        }
    });

    // Lógica de cliques na lista
    taskList.addEventListener("click", function (e) {
        const clickedElement = e.target;
        const taskItem = clickedElement.closest(".task-item");
        if (!taskItem) return;
        if (clickedElement.closest(".task-delete-btn")) {
            taskItem.remove();
        }
        else if (clickedElement.matches("input[type='checkbox']")) {
            taskItem.classList.toggle("completed");
            setTimeout(() => {
                reorderTasks();
            }, 150); 
        }
    });

    // Limpar Tarefas Concluídas
    deleteCompletedBtn.addEventListener("click", function() {
        // 1. Seleciona todos os itens que têm a classe 'completed'
        const completedTasks = document.querySelectorAll(".task-item.completed");

        if (completedTasks.length > 0) {
            // (Opcional) Pergunta de segurança
            if (confirm("Tem certeza que deseja excluir todas as tarefas concluídas?")) {
                
                completedTasks.forEach(task => {
                    // Animaçãozinha opcional antes de remover (UX melhor)
                    task.style.opacity = "0";
                    task.style.transform = "translateX(20px)";
                    
                    // Espera a animação (300ms) e remove do DOM
                    setTimeout(() => {
                        task.remove();
                    }, 300);
                });
            }
        } else {
            alert("Nenhuma tarefa concluída para limpar!");
        }
    });

});