const postItem = async (nomeAluno, emailAluno, dataAtual) => {
    
    //rever url do fetch 
    await fetch('http://127.0.0.1:5501/alunos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nomeAluno, email: emailAluno, dataCadastro: dataAtual })
    }).then((response) => response.json())
        .catch((error) => {
            console.error('Erro ao enviar dados do aluno:', error);
        });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButtonDelete = (parent) => {
  let button = document.createElement("button");
  let txt = document.createTextNode("Deletar");
  button.className = "btn btn-danger btn-sm";
  button.id = "deleteStudent";
  button.type = "button"; 
  button.appendChild(txt);
  parent.appendChild(button);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("btn btn-danger btn-sm");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Tem certeza que deseja excluir o aluno?")) {
        div.remove()
        deleteStudentById(idItem)
        alert("Removido!")
      }
    }
  }
}

// Função para inserir um novo aluno na tabela
function insertList(nome, email, dataAtual) {
    const tabela = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    // Número da linha (incremental)
    const numero = tabela.rows.length;

    // Inserindo as células
    novaLinha.insertCell(0).innerText = numero;
    novaLinha.insertCell(1).innerText = nome;
    novaLinha.insertCell(2).innerText = email;
    novaLinha.insertCell(3).innerText = dataAtual;
    // Botão de deletar aluno
    insertButtonDelete(novaLinha.insertCell(-1));
    
    removeElement()
}

// Função para lidar com o envio do formulário de cadastro de aluno
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtém os valores dos campos
            const nome = form.querySelector('input[id="NomeAluno"]').value.trim();
            const email = form.querySelector('input[id="emailAluno"]').value.trim();

            // Data atual formatada
            const dataAtual = new Date();
            const dia = String(dataAtual.getDate()).padStart(2, '0');
            const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
            const ano = dataAtual.getFullYear();
            const dataFormatada = `${dia}/${mes}/${ano}`;

            // Exemplo de uso: exibe no console (substitua por sua lógica de requisição)
            console.log('Nome:', nome);
            console.log('Email:', email);
            postItem(nome, email, dataFormatada);
            insertList(nome, email, dataFormatada);


            form.querySelector('input[id="NomeAluno"]').value = '';
            form.querySelector('input[id="emailAluno"]').value = '';

            // Fechar o modal após o envio
            const modalElement = document.getElementById('exampleModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        });
    }
});

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteStudentById = (id_aluno) => {
  if (!confirm("Tem certeza que deseja deletar este aluno?")) return;

  fetch(`http://127.0.0.1:5501/alunos/${id_aluno}`, {
    method: 'DELETE'
  })
    .then((response) => response.json())
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao deletar aluno.');
    });
}
//recuperar atividade