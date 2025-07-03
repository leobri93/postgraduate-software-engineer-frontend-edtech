/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo aluno na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = (nomeAluno, emailAluno, dataNascimento) => {
    const formData = new FormData();
    formData.append('nome', nomeAluno);
    formData.append('email', emailAluno);
    formData.append('data_nascimento', dataNascimento);
    
    let url = 'http://127.0.0.1:8080/alunos'
    fetch(url, {
        method: 'POST',
        body: formData
    })
      .then((response) => response.json()) 
        .then((data) => { 
            console.log('Dados do aluno enviados com sucesso:', data);
            insertList(data.id_aluno, data.nome, data.email, data.data_nascimento, data.data_cadastro);
        })
        .catch((error) => {
            console.error('Erro ao enviar dados do aluno:', error);
        });
}

/*
  --------------------------------------------------------------------------------------
  Funções para criar um botão close e um de iniciar atividade para cada item da lista
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

const insertButtonAtividade = (parent) => {
  let button = document.createElement("button");
  let txt = document.createTextNode("Iniciar Atividade");
  button.className = "btn btn-success btn-sm";
  button.id = "startActivity";
  button.type = "button";
  button.appendChild(txt);
  parent.appendChild(button);
};

//criar mais um botão para visualizar atividade de um aluno

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

/*
  --------------------------------------------------------------------------------------
  Função para iniciar uma atividade para o aluno de acordo com o click no botão iniciar atividade
  --------------------------------------------------------------------------------------
*/
const startActivity = () => {
  let start = document.getElementsByClassName("btn btn-success btn-sm");
  let i;
  for (i = 0; i < start.length; i++) {
    start[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML;
      if(confirm("Tem certeza que deseja iniciar a atividade para o aluno?")) {
        startStudentActivity(idItem)
        alert("Atividade iniciada!")
      }
    } 
  }
}


function formatarDataBR(dataISO) {
    if (!dataISO) return '';
    // Aceita tanto 'YYYY-MM-DD' quanto 'YYYY-MM-DDTHH:mm:ss'
    const data = new Date(dataISO);
    if (isNaN(data)) return dataISO; // Se não for data válida, retorna original
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}


// Função para inserir um novo aluno na tabela
function insertList(id_aluno, nome, email, data_nascimento, data_cadastro) {
    const tabela = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    // Inserindo as células
    novaLinha.insertCell(0).innerText = id_aluno;
    novaLinha.insertCell(1).innerText = nome;
    novaLinha.insertCell(2).innerText = email;
    novaLinha.insertCell(3).innerText = formatarDataBR(data_nascimento);
    novaLinha.insertCell(4).innerText = formatarDataBR(data_cadastro);

    // Célula de ações
    const cellAcoes = novaLinha.insertCell(-1);
    insertButtonAtividade(cellAcoes);
    insertButtonDelete(cellAcoes);
    
    removeElement()
    startActivity()
}

// Função para lidar com o envio do formulário de cadastro de aluno
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtém os valores dos campos
            const nome = form.querySelector('input[id="nomeAluno"]').value.trim();
            const email = form.querySelector('input[id="emailAluno"]').value.trim();
            const dataNascimento = form.querySelector('input[id="dataNascimento"]').value.trim();

            // Exemplo de uso: exibe no console (substitua por sua lógica de requisição)
            console.log('Nome:', nome);
            console.log('Email:', email);
            console.log('Data de Nascimento:', dataNascimento);
            postItem(nome, email, dataNascimento);


            form.querySelector('input[id="nomeAluno"]').value = '';
            form.querySelector('input[id="emailAluno"]').value = '';
            form.querySelector('input[id="dataNascimento"]').value = '';

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

  fetch(`http://127.0.0.1:8080/alunos?id_aluno=${id_aluno}`, {
    method: 'DELETE'
  })
    .then((response) => response.json())
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao deletar aluno.');
    });
}
/*
  --------------------------------------------------------------------------------------
  Função para iniciar uma atividade para o aluno via requisição POST
  --------------------------------------------------------------------------------------
*/
const startStudentActivity = (id_aluno) => {

  fetch(`http://127.0.0.1:8080/atividades?id_aluno=${id_aluno}`, {
    method: 'POST'
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Atividade iniciada com sucesso:', data);
      alert('Atividade iniciada com sucesso!');
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao iniciar atividade.');
    });
}

//recuperar atividade de um aluno