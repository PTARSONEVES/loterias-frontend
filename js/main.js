// ============================================================
// js/main.js
// ============================================================

async function carregar(tipo, loteria) {
  const div = document.getElementById('conteudo');
  div.innerHTML = 'Carregando...';

  try {
    let dados;
    if (tipo === 'ultimos') {
      if (loteria === 'megasena') dados = await api.buscarUltimosSorteios();
      else if (loteria === 'lotofacil') dados = await api.buscarUltimosSorteiosLotofacil();
      else if (loteria === 'quina') dados = await api.buscarUltimosSorteiosQuina();
      div.innerHTML = views.tabelas.renderizarTabelaSorteios(dados);
    } else if (tipo === 'frequencia') {
      if (loteria === 'megasena') dados = await api.buscarFrequencia();
      else if (loteria === 'lotofacil') dados = await api.buscarFrequenciaLotofacil();
      else if (loteria === 'quina') dados = await api.buscarFrequenciaQuina();
      views.graficos.renderizarGraficoFrequencia(div, dados);
    } else {
      div.innerHTML = 'Tipo de consulta não implementado.';
    }
  } catch (erro) {
    div.innerHTML = `Erro: ${erro.message}`;
  }
}
// Expõe para o HTML
window.carregar = carregar;