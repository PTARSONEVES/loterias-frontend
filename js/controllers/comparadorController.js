// ============================================================
// js/controllers/comparadorController.js
// ============================================================

async function comparar() {
  const input = document.getElementById('inputNumeros');
  const div = document.getElementById('resultadoComparador');

  const numerosRaw = input.value.trim();
  if (!numerosRaw) {
    div.innerHTML = '<div style="color:red">Digite os números separados por vírgula.</div>';
    return;
  }

  const numeros = numerosRaw.split(',').map(n => parseInt(n.trim()));
  if (numeros.some(isNaN) || numeros.length !== 6) {
    div.innerHTML = '<div style="color:red">Digite 6 números válidos para a Mega-Sena.</div>';
    return;
  }

  div.innerHTML = 'Analisando...';

  try {
    const dados = await api.compararMega(numeros);
    if (dados.erro) {
      div.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }
    div.innerHTML = views.tabelas.renderizarTabelaComparacao(dados);
  } catch (erro) {
    div.innerHTML = `Erro de conexão: ${erro.message}`;
  }
}

// Expõe para o HTML
window.controllers = window.controllers || {};
window.controllers.comparador = { comparar };
window.comparar = controllers.comparador.comparar;