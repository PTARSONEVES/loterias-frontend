// ============================================================
// geracao.js - Renderização da tela de geração
// ============================================================

function renderizarResultadoGeracao(dados) {
  return views.tabelas.renderizarTabelaGeracao(dados);
}

// Expõe para outros módulos
window.views = window.views || {};
window.views.geracao = {
  renderizarResultadoGeracao
};