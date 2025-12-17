/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo aluno na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = (nomeAluno, emailAluno, dataNascimento, cepAluno) => {
  const formData = new FormData();
  formData.append('nome', nomeAluno);
  formData.append('email', emailAluno);
  formData.append('data_nascimento', dataNascimento);

  // Sanitiza o CEP: remove qualquer caractere que não seja dígito
  const cepDigits = cepAluno ? String(cepAluno).replace(/\D/g, '') : '';
  formData.append('cep', cepDigits);
    
  let url = 'http://127.0.0.1:8080/alunos'
  fetch(url, {
    method: 'POST',
    body: formData
  })
    .then((response) => response.json()) 
    .then((data) => { 
      insertList(data.id_aluno, data.nome, data.email, data.data_nascimento, data.data_cadastro, data.cep, data.cidade, data.estado);
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
  let trashIcon = document.createElement("i");
  trashIcon.className = "bi bi-trash";
  button.className = "btn btn-danger btn-sm";
  button.id = "deleteStudent";
  button.type = "button"; 
  button.setAttribute("data-bs-toggle", "tooltip");
  button.setAttribute("data-bs-placement", "top");
  button.setAttribute("data-bs-trigger", "hover");
  button.setAttribute("title", "Deletar Aluno");
  button.appendChild(trashIcon);
  parent.appendChild(button);
}

const insertButtonStartActivity = (parent) => {
  let button = document.createElement("button");
  let playIcon = document.createElement("i");
  playIcon.className = "bi bi-play-fill";
  button.className = "btn btn-success btn-sm";
  button.id = "startActivity";
  button.type = "button";
  button.setAttribute("data-bs-toggle", "tooltip");
  button.setAttribute("data-bs-placement", "top");
  button.setAttribute("data-bs-trigger", "hover");
  button.setAttribute("title", "Iniciar Atividade");
  button.appendChild(playIcon);
  parent.appendChild(button);
};

const insertButtonListActivity = (parent) => {
  let button = document.createElement("button");
  let infoIcon = document.createElement("i");
  infoIcon.className = "bi bi-info-circle";
  button.className = "btn btn-secondary btn-sm";
  button.id = "listActivity";
  button.type = "button";
  button.setAttribute("data-bs-toggle", "modal tooltip");
  button.setAttribute("data-bs-target", "#atividadesModal");
  button.setAttribute("data-bs-placement", "top");
  button.setAttribute("data-bs-trigger", "hover");
  button.setAttribute("title", "Listar Atividades");
  button.appendChild(infoIcon);
  parent.appendChild(button);
};

const insertButtonEdit = (parent) => {
  let button = document.createElement("button");
  let editIcon = document.createElement("i");
  editIcon.className = "bi bi-pencil";
  button.className = "btn btn-warning btn-sm editAddressBtn";
  button.id = "editAddress";
  button.type = "button";
  button.setAttribute("title", "Editar Endereço");
  button.appendChild(editIcon);
  parent.appendChild(button);
};

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

/*
  --------------------------------------------------------------------------------------
  Função para listar uma atividade de um aluno de acordo com o click no botão listar atividade
  --------------------------------------------------------------------------------------
*/
const listActivity = () => {
  let list = document.getElementsByClassName("btn btn-secondary btn-sm");
  let i;
  for (i = 0; i < list.length; i++) {
    list[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML;
      liststudentActivity(idItem)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para abrir modal de edição de endereço e preencher os campos
  --------------------------------------------------------------------------------------
*/
const editAddress = () => {
  let edits = document.getElementsByClassName("editAddressBtn");
  for (let i = 0; i < edits.length; i++) {
    edits[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idItem = div.getElementsByTagName('td')[0].innerHTML;
      const cep = div.getElementsByTagName('td')[5].innerText || '';
      const cidade = div.getElementsByTagName('td')[6].innerText || '';
      const estado = div.getElementsByTagName('td')[7].innerText || '';

      document.getElementById('editAlunoId').value = idItem;
      document.getElementById('cepEdit').value = cep;
      document.getElementById('cidadeEdit').value = cidade;
      document.getElementById('estadoEdit').value = estado;
      document.getElementById('ruaEdit').value = '';

      const modalElement = document.getElementById('editAddressModal');
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para enviar PUT para /alunos/endereco e atualizar a tabela
  --------------------------------------------------------------------------------------
*/
const updateAddress = () => {
  const id_aluno = document.getElementById('editAlunoId').value;
  let cep = document.getElementById('cepEdit').value || '';
  // Sanitiza CEP
  const cepDigits = cep ? String(cep).replace(/\D/g, '') : '';
  const rua = document.getElementById('ruaEdit').value != "" ? document.getElementById('ruaEdit').value : '';
  const cidade = document.getElementById('cidadeEdit').value != "" ? document.getElementById('cidadeEdit').value : '';
  const estado = document.getElementById('estadoEdit').value != "" ? document.getElementById('estadoEdit').value : '';

  const formData = new FormData();
  formData.append('cep', cepDigits);
  formData.append('rua', rua);
  formData.append('cidade', cidade);
  formData.append('estado', estado);

  fetch(`http://127.0.0.1:8080/alunos/endereco?id_aluno=${id_aluno}`, {
    method: 'PUT',
    body: formData
  })
    .then(response => response.json())
    .then((data) => {
      // Atualiza a linha da tabela com os novos dados retornados ou com os enviados
      const tabela = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
      for (let i = 0; i < tabela.rows.length; i++) {
        const row = tabela.rows[i];
        if (row.cells[0].innerText == id_aluno) {
          row.cells[5].innerText = data.cep || cepDigits || '';
          row.cells[6].innerText = data.cidade || cidade || '';
          row.cells[7].innerText = data.estado || estado || '';
          break;
        }
      }

      // Fecha o modal
      const modalElement = document.getElementById('editAddressModal');
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.hide();
      alert('Endereço atualizado com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao atualizar endereço:', error);
      alert('Erro ao atualizar endereço.');
    });
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


/*
  --------------------------------------------------------------------------------------
  Função para inserir um novo aluno na tabela
  --------------------------------------------------------------------------------------
*/
const insertList = (id_aluno, nome, email, data_nascimento, data_cadastro, cep, cidade, estado) => {
  const tabela = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
  const novaLinha = tabela.insertRow();

  // Inserindo as células
  novaLinha.insertCell(0).innerText = id_aluno;
  novaLinha.insertCell(1).innerText = nome;
  novaLinha.insertCell(2).innerText = email;
  novaLinha.insertCell(3).innerText = formatarDataBR(data_nascimento);
  novaLinha.insertCell(4).innerText = formatarDataBR(data_cadastro);
  novaLinha.insertCell(5).innerText = cep || '';
  novaLinha.insertCell(6).innerText = cidade || '';
  novaLinha.insertCell(7).innerText = estado || '';

  // Célula de ações
  const cellAcoes = novaLinha.insertCell(-1);
  insertButtonEdit(cellAcoes);
  insertButtonStartActivity(cellAcoes);
  insertButtonDelete(cellAcoes);
  insertButtonListActivity(cellAcoes);
    
  removeElement()
  startActivity()
  listActivity()
  editAddress()
}

/*
  --------------------------------------------------------------------------------------
  Função para carregar a lista de alunos do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getAlunos = () => {
  fetch('http://127.0.0.1:8080/alunos', {
    method: 'GET'
  })
    .then(response => response.json())
    .then((data) => {
      const tabela = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];
      tabela.innerHTML = '';
      if(data.alunos.length === 0) {
        const novaLinha = tabela.insertRow();
        const cell = novaLinha.insertCell(0);
        cell.colSpan = 9; 
        cell.innerText = 'Nenhum aluno cadastrado.';
      }
      else
      {
        data.alunos.forEach(aluno => {
        insertList(aluno.id_aluno, aluno.nome, aluno.email, aluno.data_nascimento, aluno.data_cadastro, aluno.cep, aluno.cidade, aluno.estado);
        });
      }
    
    })
    .catch(error => {
      console.error('Erro ao obter a lista de alunos:', error);
      alert('Erro ao carregar a lista de alunos.');
    });
}

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
      alert('Atividade iniciada com sucesso!');
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao iniciar atividade.');
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para listar a atividade de um aluno via requisição GET
  --------------------------------------------------------------------------------------
*/
const liststudentActivity = (id_aluno) => {
  const modalElement = document.getElementById('atividadesModal');
  const modalBody = modalElement.querySelector('.modal-body');
  modalBody.innerHTML = ''; // Limpa o conteúdo anterior

  fetch(`http://127.0.0.1:8080/atividades?id_aluno=${id_aluno}`, {
    method: 'GET'
  })
    .then(response => {
      if(response.status === 404){
        modalBody.textContent = 'Nenhuma atividade encontrada para este aluno.';
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
        modalInstance.show();
      } 
      return response.json();
  })
    .then((data) => {
      data.atividades.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.innerHTML = `<b>Atividade ID:</b> ${activity.id_atividade} <br> <b>Status:</b> ${activity.status} <br> <b>Data Inicio:</b> ${formatarDataBR(activity.data_inicio)} <br> <b>Hora Inicio:</b> ${activity.hora_inicio} <br> <b>Duração:</b> ${activity.duracao} <br>`;
        modalBody.appendChild(activityItem);
      });
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
      modalInstance.show();
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Chama a função de recuperar alunos ao carregar a página
document.addEventListener('DOMContentLoaded', getAlunos);

/*
  --------------------------------------------------------------------------------------
  Função para lidar com o evento de envio do formulário
  --------------------------------------------------------------------------------------
*/
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Obtém os valores dos campos
            const nome = form.querySelector('input[id="nomeAluno"]').value.trim();
            const email = form.querySelector('input[id="emailAluno"]').value.trim();
            const dataNascimento = form.querySelector('input[id="dataNascimento"]').value.trim();
            const cep = form.querySelector('input[id="cepAluno"]').value.trim();

            postItem(nome, email, dataNascimento, cep);

            form.querySelector('input[id="nomeAluno"]').value = '';
            form.querySelector('input[id="emailAluno"]').value = '';
            form.querySelector('input[id="dataNascimento"]').value = '';
            form.querySelector('input[id="cepAluno"]').value = '';

            // Fechar o modal após o envio
            const modalElement = document.getElementById('exampleModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
        });
          // Handler para o botão salvar do modal de editar endereço
          const saveBtn = document.getElementById('saveAddressBtn');
          if (saveBtn) {
              saveBtn.addEventListener('click', function (event) {
                  event.preventDefault();
                  updateAddress();
              });
          }
    }
});