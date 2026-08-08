// ============================================================
// js/views/tabelas.js
// ============================================================

function renderizarTabelaSorteios(dados) {
  if (!dados || dados.length === 0) return '<p>Nenhum dado encontrado.</p>';

  // Colunas ocultas (campos internos)
  const camposOcultos = ['id', 'created_at', 'updated_at', 'observacoes'];
  const colunas = Object.keys(dados[0]).filter(col => !camposOcultos.includes(col));

  let html = '<table><tr>';
  colunas.forEach(col => {
    let nome = col;
    if (col === 'nummega' || col === 'numfacil') nome = 'Concurso';
    else if (col === 'datamega' || col === 'datafacil') nome = 'Data';
    else if (col === 'local') nome = '📍';
    else if (col.startsWith('rateio')) nome = 'Prêmio ' + col.replace('rateio', '');
    else if (col === 'acumulado') nome = 'Acumulado';
    else if (col === 'arrecadacao') nome = 'Arrecadação';
    else if (col === 'estimativa') nome = 'Estimativa';
    else if (col === 'acummegavirada') nome = 'Acum. Virada';
    else if (col === 'acumindependencia') nome = 'Acum. Indep.';
    html += `<th>${nome}</th>`;
  });
  html += '</tr>';

  dados.forEach(linha => {
    html += '<tr>';
    colunas.forEach(col => {
      let valor = linha[col];
      let classe = '';

      // Formatação de datas
      if (col === 'datamega' || col === 'datafacil') {
        valor = formatadores.formatarData(valor);
      }
      // Formatação de campos monetários e numéricos
      else if (col.startsWith('rateio') || ['acumulado', 'arrecadacao', 'estimativa', 'acummegavirada', 'acumindependencia'].includes(col)) {
        classe = ' align-right';
        valor = formatadores.formatarDecimal(valor);
      }
      // Formatação de inteiros
      else if (['nummega', 'numfacil', 'numganha6', 'numganha5', 'numganha4'].includes(col)) {
        classe = ' align-right';
        valor = formatadores.formatarInteiro(valor);
      }
      // Coluna local com tooltip
      else if (col === 'local') {
        valor = `<span title="${valor || ''}" style="cursor:help;">📍</span>`;
      }

      // Adiciona classe para dezenas (fonte maior)
      if (col.startsWith('bl') || col.startsWith('b')) {
        classe += ' col-dezena';
      }

      html += `<td class="${classe}">${valor}</td>`;
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