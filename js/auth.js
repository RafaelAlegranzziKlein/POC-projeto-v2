import { db, app, auth } from './fireStoreDB.js'
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
//Cadastrar Usuário
const emailCadastroInput = document.getElementById("email-cadastro");
const senhaCadastroInput = document.getElementById("senha-cadastro");
const btnCadastro = document.getElementById("btn-cadastro");
const mensagemCadastro = document.getElementById("mensagemCadastro");

async function cadastradoUsuario(email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth,email,senha);
    console.log(userCredential.user)
    return userCredential.user;
  } catch (error) {
    console.log("erro ao cadastrar: ", error.code, error.message);
    let mensgemErro = "Ocorreu um erro ao cadastrar. Tente novamente.";
    switch (error.code) {
      case 'auth/email-already-in-use':
        mensgemErro = "Este email já está em uso.";
        break;
      case 'auth/invalid-email':
        mensgemErro = "Formato de email inválido.";
        break;
      case 'auth/weak-password':
        mensgemErro = "A senha deve ter pelo menos 6 caracteres.";
        break;
    }
    throw { message: mensgemErro };
  }
}

if(btnCadastro) {

    btnCadastro.addEventListener('click' ,async function(){
        const email = emailCadastroInput.value;
        const senha = senhaCadastroInput.value;
        mensagemCadastro.textContent = '';

        if (!email || !senha){
            mensagemCadastro.textContent = 'Por favor, preencha todos os campos.';

            return;
        }
        try{
            const user = await cadastradoUsuario(email , senha);
            console.log('Usuário cadastrado:', email , senha);
            mensagemCadastro.textContent = 'Cadastro realizado com sucesso!';
            setTimeout(function(){
                window.location.href = ('./login.html');
            }, 3000);
        } catch (error){
            mensagemCadastro.textContent = `Erro no cadstro: ${error.message}`;
        }
    });
}







//login
//get
const emailLoginInput = document.getElementById("email-login")
const senhaLoginInput = document.getElementById("senha-login")
const btnLogin = document.getElementById("btn-login")
const mensagemLogin = document.getElementById("mensagemLogin")

//função de login de senha e email
async function loginUsuario(email , senha) {
  try{
    const userCredential = await signInWithEmailAndPassword(auth , email ,senha);
    console.log(userCredential)
    return userCredential.user;
  }catch(error){
    console.log("Erro ao logar: ", error.code , error.message);
    mensagemLogin.textContent = "Erro ao logar: " + error.message;
    throw { message: "Erro ao logar: coloque email e senha corretos" };
  }
}

if(btnLogin){
  btnLogin.addEventListener('click' , async function () {
    const email = emailLoginInput.value;
    const senha = senhaLoginInput.value;
    mensagemLogin.textContent = '';

    if(!email || !senha){
      mensagemLogin.textContent = "por favor preencha todos os campos !!!"
      return;
    }  

    try{
      const user = await loginUsuario ( email , senha);
      console.log('usuario Logado: ' ,user);
      mensagemLogin.textContent="logado com sucesso"
      setTimeout (function(){
        window.location.href = ('./menus.html');
      }, 3000);
    }catch(error){
    mensagemLogin.textContent = error.message  
    }
  });
}