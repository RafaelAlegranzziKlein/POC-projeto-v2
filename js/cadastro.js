import { db } from './fireStoreDB.js';
import {collection,addDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Create -- cadastro do produtor

function getInputs() {
  return {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    senha: document.getElementById("senha"),
    telefone: document.getElementById("telefone"),
    cnpj: document.getElementById("cnpj"),
  };
}

function getValores({ nome, email, senha, telefone, cnpj }) {
  return {
    nome: nome.value.trim(),
    email: email.value.trim(),
    senha: senha.value.trim(),
    telefone: telefone.value.trim(),
    cnpj: cnpj.value.trim(),
  };
}

function limpar({ nome, email, senha, telefone, cnpj }) {
  nome.value = "";
  email.value = "";
  senha.value = "";
  telefone.value = "";
  cnpj.value = "";
}

// cadastrar produtor
document
  .getElementById("btn-cadastro")
  .addEventListener("click", async function () {
    const Inputs = getInputs();
    const dados = getValores(Inputs);

    console.log("Inputs :", Inputs);
    console.log("Dados :", dados);

    if (!dados.nome ||!dados.email || !dados.senha || !dados.telefone || !dados.cnpj) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const ref = await addDoc(collection(db, "produtores"), dados);
      console.log("ID do documento : ", ref.id);
      limpar(Inputs);
      alert("Produtor cadastrado com sucesso :");
    } catch (e) {
      console.log("Error: ", e);
    }
  });