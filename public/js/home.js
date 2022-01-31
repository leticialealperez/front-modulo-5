const url="https://backend-modulo-5.herokuapp.com"
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let mostralistaRecados = document.querySelector('#lista-recados'); 

document.getElementById("button-logout").addEventListener("click", logout);

checkLogged();
getMessages();

function checkLogged(){
    if(session){
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if(!logged){
        window.location.href = "index.html";
    }

    const dataUser = localStorage.getItem(logged);

    if(dataUser){
        data = JSON.parse(dataUser);
    }

}

function logout(){
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

//ADICIONAR RECADO
document.getElementById("button-save").addEventListener("click", function(e){
    e.preventDefault();

    const description = document.getElementById("input-title").value;
    const details = document.getElementById("input-description").value;
    const userKey = getUid(logged);

    if(!(description && details)) return alert("Os campos DESCRIÇÃO e DETALHES precisam ser preenchidos!");

    const newTask = {
        description: description,
        details: details,
        userKey: userKey
    };
    
    axios.post(`${url}/task`, newTask)
    .then(response => {
        alert("Recado adicionado com sucesso.");
        getMessages();
        cancel();   
    })
    .catch(error => console.log({error}))

});

//MOSTRAR RECADOS...
function getMessages(){
    mostralistaRecados.innerHTML = ``;
    const user_uid = getUid(logged);

    axios.get(`${url}/task/user/${user_uid}`)
    .then(response => {
        const data = response.data.data;
        console.log(data);
        for(i = 0; i < data.length; i++){
            mostralistaRecados.innerHTML += `
                                                <tr>
                                                    <th scope="row" class="text-center">${i+1}</th>
                                                    <td>${data[i].description}</td>
                                                    <td>${data[i].details}</td>
                                                    <td class="text-center">
                                                        <button type="button" class="btn btn-success" id="update-message" onclick="preparingMessage('${data[i].uid}')">Editar</button>
                                                        <button type="button" class="btn btn-danger" id="delete-message" onclick="deleteMessage('${data[i].uid}')">Apagar</button>
                                                    </td>
                                                </tr>
                                             `
        }
        
    })
    .catch(error => console.log(error, "algo de errado não está certo"))  
}

//DELETAR UM RECADO...
function deleteMessage(uidMessage){
    if(confirm(`Ao confirmar você excluirá permanentemente o recado da lista. Deseja mesmo fazer isso?`)){
        
        axios.delete(`${url}/task/${uidMessage}`)
        .then(response => {
            console.log(JSON.stringify(response.data));
            confirm(`Recado excluido`);
            getMessages();
        })
        .catch(error => console.log(error))    
    }
    
}


//PREPARAR EDIÇÃO DE UM RECADO...
function preparingMessage(uidMessage){
    
    axios.get(`${url}/task/${uidMessage}`)
    .then(response => {
        const data = response.data.data;
        document.getElementById("input-title").value = data.description;
        document.getElementById("input-description").value = data.details;
        document.getElementById("button-save").setAttribute('style', 'display: none');
        document.getElementById("button-update").setAttribute('style', 'display: block');
        document.getElementById("button-update").setAttribute('onclick', `updateMessage('${data.uid}')`);

    })
    .catch(error => console.log(error))
}

//ATUALIZAR RECADOS...
function updateMessage(uidMessage){

    const description = document.getElementById("input-title").value;
    const details = document.getElementById("input-description").value;
    const userKey= getUid(logged);

    const taskUpdate = {
        description: description,
        details: details,
        userKey: userKey
    };

    axios.put(`${url}/task/${uidMessage}`, taskUpdate)
    .then(response => {
        alert(`Recado atualizado com sucesso!`);
        getMessages();
        cancel();
    })
    .catch(error => console.log(error))

}

//CANCELAR ADIÇÃO OU ATUALIZAÇÃO DE UM RECADO...
function cancel(){
    document.getElementById("input-title").value = '';
    document.getElementById("input-description").value = '';
    document.getElementById("button-save").setAttribute('style', 'display: block');
    document.getElementById("button-update").setAttribute('style', 'display: none');

}

function getUid(key){
    const account = localStorage.getItem(key);

    if(account){
        return JSON.parse(account);
    }

    return "";
}