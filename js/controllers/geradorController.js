// ============================================================
// geradorController.js
// ============================================================
async function gerar() {
 
  const nivel = document.getElementById('nivelRisco').value;
  const loteria = document.getElementById('loteria').value;
  const div = document.getElementById('resultadoGeracao');

  div.innerHTML = 'Gerando apostas...';

  try {
    const dados = await api.gerarApostas(loteria, nivel);
    if (dados.erro) {
      div.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }
    div.innerHTML = views.tabelas.renderizarTabelaGeracao(dados);
  } catch (erro) {
    div.innerHTML = `Erro de conexão: ${erro.message}`;
  }
}

// Exporta para o HTML
window.controllers = window.controllers || {};
window.controllers.gerador = { gerar };