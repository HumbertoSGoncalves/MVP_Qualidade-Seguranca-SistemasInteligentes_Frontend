/*
  --------------------------------------------------------------------------------------
  Obtenção da lista atual do servidor por meio de uma solicitação GET.
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/pacientes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.pacientes.forEach(item => insertList(item.name, 
                                                item.rad, 
                                                item.tex,
                                                item.per,
                                                item.area,
                                                item.smooth,
                                                item.diagnosis
                                              ))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Acionamento da função para carregamento inicial dos dados.
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------------------
  Implementação da função para adicionar um item à lista do servidor através de uma requisição POST.
  --------------------------------------------------------------------------------------------------
*/
const postItem = async (inputPatient, inputRad, inputTex,
                        inputPer, inputArea, inputSmooth) => {
    
  const formData = new FormData();
  formData.append('name', inputPatient);
  formData.append('rad', inputRad);
  formData.append('tex', inputTex);
  formData.append('per', inputPer);
  formData.append('area', inputArea);
  formData.append('smooth', inputSmooth);

  let url = 'http://127.0.0.1:5000/paciente';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Implementação da função para criar um botão de fechar para cada item na lista.
  --------------------------------------------------------------------------------------
*/
const insertDeleteButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Implementação da função para remover um item da lista ao clicar no botão de fechar.
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Está certo disto?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Excluído!")
      }
    }
  }
}


/*
  ----------------------------------------------------------------------------------------------------
  Implementação da função para excluir um item da lista do servidor por meio de uma requisição DELETE.
  ----------------------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/paciente?name='+item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  ------------------------------------------------------------------------------------
  Implementação da função para adicionar um novo item, incluindo os dados necessários.
  ------------------------------------------------------------------------------------
*/
const newItem = async () => {
  let inputPatient = document.getElementById("newInput").value;
  let inputRad = document.getElementById("newRad").value;
  let inputTex = document.getElementById("newTex").value;
  let inputPer = document.getElementById("newPer").value;
  let inputArea = document.getElementById("newArea").value;
  let inputSmooth = document.getElementById("newSmooth").value;

  // Verifique se o nome do produto já existe antes de adicionar
  const checkUrl = `http://127.0.0.1:5000/pacientes?nome=${inputPatient}`;
  fetch(checkUrl, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.pacientes && data.pacientes.some(item => item.name === inputPatient)) {
        alert("O paciente já existente.\nO nome não pode ser repetido.");
      } else if (inputPatient === '') {
        alert("O nome do paciente é mandatório.");
      } else if (isNaN(inputRad) || isNaN(inputTex) || isNaN(inputPer) || isNaN(inputArea) || isNaN(inputSmooth)) {
        alert("Os campos são numéricos.");
      } else {
        insertList(inputPatient, inputRad, inputTex, inputPer, inputArea, inputSmooth);
        postItem(inputPatient, inputRad, inputTex, inputPer, inputArea, inputSmooth);
        alert("Incluído com sucesso.");

        // Recarregar a página após meio segundo
        setTimeout(function() {
          location.reload();
        }, 500);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Implementação da função para inserir itens na lista apresentada.
  --------------------------------------------------------------------------------------
*/
const insertList = (namePatient, rad, tex, per, area, smooth, diagnosis) => {
  var item = [namePatient, rad, tex,per, area, smooth, diagnosis];
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cell = row.insertCell(i);
    cell.textContent = item[i];
  }

  var deleteCell = row.insertCell(-1);
  insertDeleteButton(deleteCell);

  document.getElementById("newInput").value = "";
  document.getElementById("newRad").value = "";
  document.getElementById("newTex").value = "";
  document.getElementById("newPer").value = "";
  document.getElementById("newArea").value = "";
  document.getElementById("newSmooth").value = "";

  removeElement();
}