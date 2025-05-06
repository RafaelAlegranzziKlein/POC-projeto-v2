import { db } from './fireStoreDB.js';
import { collection, getDocs, deleteDoc, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


//LISTAGENS
async function buscarProdutos() {
    const dadosBanco = await getDocs(collection(db, "Produtos"));
    const produtos = [];
    for (const doc of dadosBanco.docs) {
        produtos.push({ id: doc.id, ...doc.data() });
    }
    return produtos;
}

const listaProdutosDiv = document.getElementById("listar-produtos");

async function carregarListaDeProdutos() {
    listaProdutosDiv.innerHTML = '<p> Carregando lista de produtos... </p>';
    try {
        const produtos = await buscarProdutos();
        console.log(produtos);
        renderizarListaDeProdutos(produtos);
    } catch (error) {
        console.log("Erro ao carregar a lista de produtos: ", error);
        listaProdutosDiv.innerHTML = '<p> Erro ao carregar a lista de produtos... </p>';
    }
}

function renderizarListaDeProdutos(produtos) {
    listaProdutosDiv.innerHTML = '';

    if (produtos.length === 0) {
        listaProdutosDiv.innerHTML = '<p> Nenhum Funcionário cadastrado ainda ;( </p> ';
        return;
    }
    for (let produto of produtos) {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto-item');
        produtoDiv.innerHTML = `
            <strong> Nome: </strong> ${produto.nome} <br>
            <strong> Validade: </strong> ${produto.validade} <br>
            <strong> Valor: </strong> ${produto.valor} <br>
            <button class="btn-Excluir" data-id="${produto.id}"> Excluir </button>
            <button class="btn-Editar" data-id="${produto.id}"> Editar </button>
        `;
        listaProdutosDiv.appendChild(produtoDiv);
    }
        // Adicionar listeners de ação APÓS a renderização da lista
    adicionarListenersDeAcao();
}


// DELETE - EXCLUIR OS DADOS DE FUNCIONÁRIO
async function excluirProduto(idProduto) {
    try {
        const documentoDeletar = doc(db, "Produtos", idProduto);
        await deleteDoc(documentoDeletar);
        console.log("Produto com ID" + idProduto + "foi excluído.");
        return true;
    } catch (erro) {
        console.log("Erro ao excluir o produto", erro);
        alert("Ocorreu um erro ao excluir produto. Tente novamente");
        return false;
    }
}

async function lidarClique(eventoDeClique) {
    const btnExcluir = eventoDeClique.target.closest('.btn-Excluir');
    if (btnExcluir) {
        const certeza = confirm("Tem certeza que deseja fazer essa exclusão?")
        if (certeza) {
            const idProduto = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirProduto(idProduto);

            if (exclusaoBemSucedida) {
                carregarListaDeProdutos();
                alert('produto excluído com sucesso!');
            }
        } else {
            alert("Exclusão cancelada");
        }
    }


const btnEditar = eventoDeClique.target.closest('.btn-Editar');
    if (btnEditar) {
        const idProduto = btnEditar.dataset.id;
        const produto = await buscarProdutoPorId(idProduto);
        console.log(produto.nome)

        const edicao = getValoresEditar()

        edicao.editarNome.value = produto.nome;
        edicao.editarValidade.value = produto.validade;
        edicao.editarValor.value = produto.valor;
        edicao.editarId.value = produto.id;

        edicao.formularioEdicao.style.display = 'block';
    }

}

// UPDATE - EDITAR OS DADOS DE FUNCIONÁRIO
function getValoresEditar() {
    return {
        editarNome: document.getElementById("editar-nome"),
        editarValidade: document.getElementById("editar-validade"),
        editarValor: document.getElementById("editar-valor"),
        editarId: document.getElementById("editar-id"),
        formularioEdicao: document.getElementById("formulario-edicao")
    }
}

async function buscarProdutoPorId(id) {
    try {
        const produtoDoc = doc(db, "Produtos", id);
        const snapshot = await getDoc(produtoDoc);
        if (snapshot.exists()) {
            console.log(snapshot)
            return { id: snapshot.id, ...snapshot.data() };
        } else {
            console.log("produto não encontrado com o ID:", id);
            return null;
        }
    } catch (error) {
        console.log("Erro ao buscar produto por ID:", error);
        alert("Erro ao buscar produto para edição.");
        return null;
    }
}

document.getElementById('btn-salvar-edicao').addEventListener('click', async () => {
    const edicao = getValoresEditar()
    const id = edicao.editarId.value;
    const novosDados = {
        nome: edicao.editarNome.value,
        validade: edicao.editarValidade.value,
        valor: parseInt(edicao.editarValor.value)
    };

    try {
        const ref = doc(db, "Produtos", id);
        await setDoc(ref, novosDados);
        alert("produto atualizado com sucesso!");
        edicao.formularioEdicao.style.display = 'none';
        carregarListaDeProdutos();
    } catch (error) {
        console.log("Erro ao salvar edição:", error);
        alert("Erro ao atualizar produto.");
    }
});

document.getElementById('btn-cancelar-edicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none';
});

function adicionarListenersDeAcao() {
    listaProdutosDiv.addEventListener('click', lidarClique);
}

document.addEventListener("DOMContentLoaded", carregarListaDeProdutos);