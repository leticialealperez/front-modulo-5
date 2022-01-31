const url="https://backend-modulo-5.herokuapp.com"
const myModal = new bootstrap.Modal("#register-modal")
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

checkLogged();

// CRIAR CONTA
document.getElementById("create-form").addEventListener("submit", function(e){
    e.preventDefault();

    const email = document.getElementById("email-create-input").value;
    const password = document.getElementById("password-create-input").value;
    
    if(email.length < 10){
        alert("Preencha o campo com um e-mail valido.");
        return;
    }

    if(password.length < 4){
        alert("Preencha a senha com no mínimo 4 dígitos.");
        return;
    }

    saveAccount({
        login: email,
        password: password,
    });

});

//LOGAR NO SISTEMA
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const login = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    const checkSession = document.getElementById("session-check").checked;
    
    const userKey = getAccount(login);

    console.log(userKey);

    axios.get(`${url}/user/${userKey}`)
    .then(response => {
        if(response.data.data.password !== password){
            alert("Oops! verifique o usuário ou a senha.");
            return;
        } 

        saveSession(login, checkSession);
        window.location.href = "home.html";
    })
    .catch(error => alert("Oops! verifique o usuário ou a senha."))  

});

function checkLogged(){
    if(session){
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if(logged){
        saveSession(logged, session);

        window.location.href = "home.html";
    }
}

function saveAccount(data){
    const newUser = {
        login: data.login,
        password: data.password
    }

    axios.post(`${url}/user`, newUser)
    .then(response => {
        localStorage.setItem(response.data.data.login, JSON.stringify(response.data.data.uid));
        console.log(JSON.stringify(response.data));
        alert("Conta criada com sucesso.");
        myModal.hide();
    })
    .catch(error => alert("Usuário já cadastrado"))   
}

function saveSession(data, saveSession){
    if(saveSession){
        localStorage.setItem("session", data);
    }

    sessionStorage.setItem("logged", data);
}

function getAccount(key){
    const account = localStorage.getItem(key);

    if(account){
        return JSON.parse(account);
    }

    return "";
}
