import { db } from "./fireStoreDB.js";
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
//Consulta do banco de dados

async function BuscarProdutores() {
  const dadosBanco = await getDocs(collection(db, "produtores"));
  const produtores = [];
  for (const doc of dadosBanco.docs) {
    produtores.push({ id: doc.id, ...doc.data() });
  }
  return produtores;
}

//listar produtores

const listarProdutoresDiv = document.getElementById("listagem-produtor");

async function carregarListaProdutores() {
  listarProdutoresDiv.innerHTML = "<p>carregando lista de produtores ...</p>";
  try {
    const produtores = await BuscarProdutores();
    console.log(produtores);
    renderizarListaDeProdutor(produtores);
  } catch (error) {
    console.log("Erro ao carregar a lista de Produtores :", error);
    listarProdutoresDiv.innerHTML =
      "<p>Erro ao carregar a lista de Produtores ...</p>";
  }
}

// carrega a lista de produtores

function renderizarListaDeProdutor(produtores) {
  listarProdutoresDiv.innerHTML = "";

  if (produtores.length === 0) {
    listarProdutoresDiv.innerHTML = "<p>Nenhum Produtor foi cadastrado ainda</p>";
    return;
  }
  for (let produtor of produtores) {
    const produtorDiv = document.createElement("div");
    produtorDiv.classList.add("produtor-item");
    produtorDiv.innerHTML = `
    
        <strong> Nome  : </strong>${produtor.nome}<br>
        <strong> E-mail: </strong>${produtor.email}<br>
        <strong> Senha: </strong>${produtor.senha}<br>
        <strong> Telefone :</strong>${produtor.telefone}<br>
        <strong> CNPJ :</strong>${produtor.cnpj}<br>
        <div class="botao">
           <button class= "btn-Excluir" data-id = "${produtor.id}">Excluir</button>
           <button class= "btn-Editar" data-id = "${produtor.id}">Editar</button>
        </div>
        `;
        listarProdutoresDiv.appendChild(produtorDiv)
  }
  adicionarListenersDeAcao();
}

//Deletar produtor


async function excluirProdutor(idprodutor) {
    try{
        const deletarProdutor = doc(db , "produtores", idprodutor);
        await deleteDoc(deletarProdutor)
        console.log("Produtor com o id de : " +idprodutor + "foi excluído com sucesso")
        return true;
    }catch (erro){
        console.log("Erro ao excluir produtor : ",erro);
        alert("Ocorreu um erro ao deletar o produtor");
        return false;
    }
}


// função clicque

async function lidarClique(eventoDeClique) {
    const btnExcluir = eventoDeClique.target.closest('.btn-Excluir');
    if (btnExcluir) {
        const certeza = confirm("Tem certeza que deseja fazer essa exclusão?")
        if (certeza) {
            const idprodutor = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirProdutor(idprodutor);

            if (exclusaoBemSucedida) {
                carregarListaProdutores();
                alert('Produtor excluído com sucesso!');
            }
        } else {
            alert("Exclusão cancelada");
        }
    }

// botão editar
const btnEditar = eventoDeClique.target.closest('.btn-Editar');

if(btnEditar){
    const idprodutor = btnEditar.dataset.id;
    const produtor = await BuscarProdutoresPorID(idprodutor)

    const edicao = getValoresEditar()
    
    edicao.editarNome.value = produtor.nome;
    edicao.editarEmail.value = produtor.email;
    edicao.editarSenha.value = produtor.senha;
    edicao.editarTelefone.value = produtor.telefone;
    edicao.editarCnpj.value = produtor.cnpj;
    edicao.editarId.value = produtor.id;

    edicao.formularioEdicao.style.display = 'block';
}
}
//Edição de dados

function getValoresEditar() {
    return {
        editarNome: document.getElementById("editar-nome"),
        editarEmail: document.getElementById("editar-email"),
        editarSenha: document.getElementById("editar-senha"),
        editarTelefone: document.getElementById("editar-telefone"),
        editarCnpj: document.getElementById("editar-cnpj"),
        editarId : document.getElementById("editar-id"),

        formularioEdicao: document.getElementById("formulario-edicao")
      };
}

async function BuscarProdutoresPorID(id) {
    try {
        const produtorDoc = doc(db, "produtores", id);
        const snapshot = await getDoc(produtorDoc);
        if (snapshot.exists()) {
            return { id: snapshot.id, ...snapshot.data() };
        } else {
            console.log("Produtor não encontrado com o ID:", id);
            return null;
        }
    } catch (error) {
        console.log("Erro ao buscar Produtor por ID:", error);
        alert("Erro ao buscar produtor para edição.");
        return null;
    }
}

document.getElementById('btn-salvar-edicao').addEventListener('click', async () => {
    const edicao = getValoresEditar()
    const id = edicao.editarId.value;
    const novosDados = {
        nome: edicao.editarNome.value.trim(),
        email: edicao.editarEmail.value.trim(),
        senha: edicao.editarSenha.value.trim(),
        telefone: edicao.editarTelefone.value.trim(),
        cnpj: edicao.editarCnpj.value.trim()
    }
    try {
        const ref = doc(db, "produtores", id);
        await setDoc(ref, novosDados);
        alert("Produtor atualizado com sucesso!");
        edicao.formularioEdicao.style.display = 'none';
        carregarListaProdutores();
    } catch (error) {
        console.log("Erro ao salvar edição:", error);
        alert("Erro ao atualizar produtor.");
    }
});
document.getElementById('btn-cancelar-edicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none';
});

function adicionarListenersDeAcao() {
    listarProdutoresDiv.addEventListener('click', lidarClique);
}

document.addEventListener("DOMContentLoaded", carregarListaProdutores);