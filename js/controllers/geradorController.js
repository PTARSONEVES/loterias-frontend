// ============================================================
// js/controllers/geradorController.js
// ============================================================

function atualizarOpcao() {
  const modelo = document.getElementById('modelo').value;
  const campoOpcao = document.getElementById('campoOpcao');

  if (modelo === '1') {
    campoOpcao.style.display = 'block';
  } else {
    campoOpcao.style.display = 'none';
  }
}

async function gerar() {
  const modelo = document.getElementById('modelo').value;
  const opcao = modelo === '1' ? document.getElementById('opcao').value : 0;
  const loteria = document.getElementById('loteria').value;
  const div = document.getElementById('resultadoGeracao');

  div.innerHTML = '⏳ Gerando apostas... Aguarde.';

  try {
    const dados = await api.gerarApostas(loteria, modelo, opcao);
    if (dados.erro) {
      div.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }
    div.innerHTML = views.tabelas.renderizarTabelaGeracao(dados);
  } catch (erro) {
    div.innerHTML = `Erro de conexão: ${erro.message}`;
  }
}

// Expõe para o HTML
window.controllers = window.controllers || {};
window.controllers.gerador = { gerar, atualizarOpcao };

// Aplica o comportamento inicial ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarOpcao);