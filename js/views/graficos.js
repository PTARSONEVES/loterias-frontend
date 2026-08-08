// ============================================================
// js/views/graficos.js
// ============================================================

let graficoAtual = null;

function renderizarGraficoFrequencia(container, dados) {
  // Verifica se dados é um array
  if (!Array.isArray(dados)) {
    container.innerHTML = '<p style="color:red;">Dados inválidos.</p>';
    return;
  }

  // Limpa o container
  container.innerHTML = '<h3>📊 Frequência por Coluna</h3><canvas id="graficoFrequencia" style="max-height: 400px;"></canvas>';

  // Agrupa por coluna
  const colunas = {};
  dados.forEach(item => {
    if (!colunas[item.coluna]) colunas[item.coluna] = [];
    colunas[item.coluna].push({ numero: item.numero, frequencia: item.frequencia });
  });

  // AGORA MOSTRA TODAS AS COLUNAS (sem slice)
  const colunasKeys = Object.keys(colunas);
  const datasets = colunasKeys.map((col, index) => {
    const dadosOrdenados = colunas[col].sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
    const cores = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf', '#e7e9ed'];
    const cor = cores[index % cores.length];
    return {
      label: `Coluna ${col.replace('coluna', '')}`,
      data: dadosOrdenados.map(d => d.frequencia),
      backgroundColor: cor,
      borderColor: cor,
      borderWidth: 1,
      borderRadius: 4
    };
  });

  const labels = colunas[colunasKeys[0]].sort((a, b) => parseInt(a.numero) - parseInt(b.numero)).map(d => d.numero);

  if (graficoAtual) graficoAtual.destroy();

  const ctx = document.getElementById('graficoFrequencia').getContext('2d');
  const isDark = document.body.classList.contains('dracula-mode');
  graficoAtual = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: isDark ? '#f8f8f2' : '#2c3e50' }
        },
        title: {
          display: true,
          text: 'Frequência por Coluna',
          color: isDark ? '#f8f8f2' : '#2c3e50'
        }
      },
      scales: {
        x: { ticks: { color: isDark ? '#f8f8f2' : '#2c3e50' } },
        y: { ticks: { color: isDark ? '#f8f8f2' : '#2c3e50' }, beginAtZero: true }
      }
    }
  });
}

// Expõe para outros módulos
window.views = window.views || {};
window.views.graficos = { renderizarGraficoFrequencia };