// ============================================================
// js/views/tabelas.js
// ============================================================

function renderizarTabelaSorteios(dados) {
  if (!dados || dados.length === 0) return '<p>Nenhum dado encontrado.</p>';

  // Colunas ocultas (campos internos)
  const camposOcultos = ['id', 'created_at', 'updated_at', 'observacoes'];
  const colunas = Object.keys(dados[0]).filter(col => !camposOcultos.includes(col));

  // Detecta dinamicamente quais são as colunas de dezenas
  // Considera dezena qualquer coluna que comece com "bl" seguido de número
  const isDezena = (col) => /^bl\d+$/.test(col);

  // Detecta dinamicamente as colunas monetárias
  const isMonetaria = (col) => 
    col.startsWith('rateio') || 
    ['acumulado', 'arrecadacao', 'estimativa', 'acummegavirada', 'acumindependencia', 'quinasaojoao'].includes(col);

  // Detecta dinamicamente as colunas numéricas inteiras
  const isInteira = (col) => 
    ['nummega', 'numfacil', 'numquina', 'numganha6', 'numganha5', 'numganha4', 
     'numganha15', 'numganha14', 'numganha13', 'numganha12', 'numganha11',
     'numganha3', 'numganha2'].includes(col);

  // Detecta dinamicamente as colunas de data
  const isData = (col) => 
    ['datamega', 'datafacil', 'dataquina'].includes(col);

  let html = '<table><tr>';
  colunas.forEach(col => {
    let nome = col;
    if (col === 'nummega' || col === 'numfacil' || col === 'numquina') nome = 'Concurso';
    else if (col === 'datamega' || col === 'datafacil' || col === 'dataquina') nome = 'Data';
    else if (col === 'local') nome = '📍';
    else if (col.startsWith('rateio')) nome = 'Prêmio ' + col.replace('rateio', '');
    else if (col === 'acumulado') nome = 'Acumulado';
    else if (col === 'arrecadacao') nome = 'Arrecadação';
    else if (col === 'estimativa') nome = 'Estimativa';
    else if (col === 'acummegavirada') nome = 'Acum. Virada';
    else if (col === 'acumindependencia') nome = 'Acum. Indep.';
    else if (col === 'quinasaojoao') nome = 'Quina São João';
    html += `<th>${nome}</th>`;
  });
  html += '</tr>';

  dados.forEach(linha => {
    html += '<tr>';
    colunas.forEach(col => {
      let valor = linha[col];
      let classe = '';

      if (isData(col)) {
        valor = formatadores.formatarData(valor);
      } else if (isMonetaria(col)) {
        classe = ' align-right';
        valor = formatadores.formatarDecimal(valor);
      } else if (isInteira(col)) {
        classe = ' align-right';
        valor = formatadores.formatarInteiro(valor);
      } else if (col === 'local') {
        valor = `<span title="${valor || ''}" style="cursor:help;">📍</span>`;
      }

      if (isDezena(col)) {
        classe += ' col-dezena';
      }

      html += `<td class="${classe.trim()}">${valor}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
}

function renderizarTabelaComparacao(dados) {
  let html = `<h3>📊 Resultado da Análise</h3>`;
  html += `<p><strong>Média de frequência:</strong> ${formatadores.formatarDecimal(dados.mediaFrequencia)} vezes por número</p>`;

  html += `<table><tr><th>Coluna</th><th>Número</th><th>Frequência</th><th>Status</th></tr>`;
  dados.numeros.forEach(item => {
    const corStatus = item.status === 'Quente' ? '#27ae60' : item.status === 'Morno' ? '#f39c12' : '#e74c3c';
    html += `<tr>
      <td class="col-dezena">${item.coluna}</td>
      <td class="col-dezena">${item.numero}</td>
      <td class="align-right">${formatadores.formatarInteiro(item.frequencia)}</td>
      <td style="color:${corStatus}; font-weight:bold; text-align:center;">${item.status}</td>
    </tr>`;
  });
  html += `</table>`;

  if (dados.sugestoes && dados.sugestoes.length > 0) {
    html += `<h4>💡 Sugestões de substituição</h4>`;
    html += `<p>Troque números frios por estes números quentes da mesma coluna:</p>`;
    html += `<ul style="list-style-type: none; padding: 0;">`;
    dados.sugestoes.forEach(sug => {
      html += `<li style="padding: 5px 0;">
        <strong>${sug.coluna}</strong>:
        substitua <span style="color:#e74c3c;">${sug.numeroOriginal}</span>
        por <span style="color:#27ae60; font-weight:bold;">${sug.numeroSugerido}</span>
        (frequência: ${formatadores.formatarInteiro(sug.frequencia)})
      </li>`;
    });
    html += `</ul>`;
  }

  return html;
}

function renderizarTabelaGeracao(dados) {
  let html = `<h3>📋 Apostas geradas (${dados.quantidade})</h3>`;
  html += `<table><tr><th>#</th><th>Dezenas</th></tr>`;
  dados.apostas.forEach((aposta, index) => {
    html += `<tr><td>${index + 1}</td><td class="col-dezena">${aposta.dezenas}</td></tr>`;
  });
  html += `</table>`;
  html += `<button onclick="copiarApostas()" style="margin-top:15px; padding:8px 20px; background:#2980b9; color:white; border:none; border-radius:4px; cursor:pointer;">📋 Copiar todas</button>`;
  return html;
}

// Expõe para outros módulos
window.views = window.views || {};
window.views.tabelas = {
  renderizarTabelaSorteios,
  renderizarTabelaComparacao,
  renderizarTabelaGeracao
};