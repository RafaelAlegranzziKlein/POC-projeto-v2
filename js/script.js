import { db } from './fireStoreDB.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getInputs(){
    return{
        nome: document.getElementById("nome-produto"),
        validade: document.getElementById("validade-produto"),
        valor: document.getElementById("valor-produto")
    };
}

function getValores({nome, validade, valor}){
    return{
        nome: nome.value.trim(),
        validade: validade.value.trim(),
        valor: parseInt(valor.value.trim())

    }//erro
}

function limpar({nome, validade, valor}){
    nome.value = ''
    validade.value = ''
    valor.value = ''
}

document.getElementById("btn-salvar").addEventListener('click', async function(){
    const inputs = getInputs();
    const dados = getValores(inputs);

    console.log("Inputs:", inputs);
    console.log("Dados:", dados);

    if(!dados.validade || !dados.nome || !dados.valor){
        alert("Preencha todos os campos.");
        return
    }

    try{
        const ref = await addDoc(collection(db, "Produtos"), dados);
        console.log("ID do documento", ref.id);
        limpar(inputs)
        alert("Produto cadastro com sucesso: ")
    }catch (e){
        console.log("Erro: ", e)
    };

})




