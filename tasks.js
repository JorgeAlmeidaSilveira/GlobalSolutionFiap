document.addEventListener("DOMContentLoaded", function () {

    const taskForm = document.querySelector(".new-task-form");
    const taskInput = document.querySelector("#new-task-input");
    const taskList = document.querySelector(".task-list");
    const priorityButtons = document.querySelectorAll(".p-btn");
    const hiddenInput = document.querySelector("#selected-priority");
    const deleteCompletedBtn = document.getElementById("delete-completed-btn");

    // Lógica de Seleção dos Botões
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

    // Adicionar Nova Tarefa
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const taskName = taskInput.value.trim();
        const priorityValue = hiddenInput.value; // Pega valor do input escondido

        if (taskName !== "") {

            let priorityClass = "";
            // Define as cores da TAG na lista
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

            // Resetar o formulário
            taskInput.value = "";
            taskInput.focus();

            reorderTasksByPriority();
            reorderTasksByChecked();
        }
    });

    // Lógica de cliques na lista
    taskList.addEventListener("click", function (e) {
        const clickedElement = e.target;
        const taskItem = clickedElement.closest(".task-item");
        if (!taskItem) return;
        if (clickedElement.closest(".task-delete-btn")) {
            taskItem.remove();
        } else if (clickedElement.matches("input[type='checkbox']")) {
            taskItem.classList.toggle("completed");
            setTimeout(() => {
                reorderTasksByPriority();
                reorderTasksByChecked();
            }, 300);
        }
    });

    // Limpar Tarefas Concluídas
    deleteCompletedBtn.addEventListener("click", function() {
        // 1. Seleciona todos os itens que têm a classe 'completed'
        const completedTasks = document.querySelectorAll(".task-item.completed");

        if (completedTasks.length > 0) {
            if (confirm("Tem certeza que deseja excluir todas as tarefas concluídas?")) {
                completedTasks.forEach(task => {
                    task.remove();
                })
            }
        } else {
            alert("Nenhuma tarefa concluída para limpar!");
        }
    });

    // Função de ordenacao por conclusao de item
    function reorderTasksByChecked() {
        // Pega todos os itens atuais da lista (li)
        const itemsArray = Array.from(taskList.children);

        itemsArray.sort((a, b) => {
            const aCompleted = a.classList.contains("completed");
            const bCompleted = b.classList.contains("completed");

            // Se um está concluído e o outro não, o não-concluído vem primeiro
            if (aCompleted && !bCompleted) return 1; // a vai para o fim
            if (!aCompleted && bCompleted) return -1; // a vem para o começo
            return 0; // Mantém a ordem se ambos forem iguais (concluídos ou não)
        });

        // Reinsere os itens na lista na nova ordem
        itemsArray.forEach(item => taskList.appendChild(item));
    };

    // Função de ordenacao por prioridade
    function reorderTasksByPriority() {
        // Pega todos os itens atuais da lista (li)
        const itemsArray = Array.from(taskList.children);

        // Função auxiliar para descobrir o peso de uma tarefa
        const getWeight = (item) => {
            // Pega o texto dentro da etiqueta de categoria (ex: "Alta")
            // ✅ CORREÇÃO: Converte para MAIÚSCULO para garantir a comparação
            const priorityText = item.querySelector(".task-category").innerText.trim().toUpperCase();

            if (priorityText === "ALTA") return 3;
            if (priorityText === "MÉDIA") return 2;
            if (priorityText === "BAIXA") return 1;
            return 0; // Segurança caso não tenha prioridade
        };

        // Ordena o Array
        itemsArray.sort((taskA, taskB) => {
            const weightA = getWeight(taskA);
            const weightB = getWeight(taskB);

            // Ordem Decrescente (do maior para o menor): B - A
            return weightB - weightA;
        });

        // Coloca os itens de volta no HTML na nova ordem
        itemsArray.forEach(item => taskList.appendChild(item));
    }

});