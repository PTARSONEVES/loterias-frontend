// ============================================================
// 0. FUNÇÕES DE FORMATAÇÃO
// ============================================================

// Formata data no padrão DD-MM-AAAA
function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  if (isNaN(data.getTime())) return dataISO; // se não for data válida, retorna original
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
}

// Formata número para padrão brasileiro (2 casas decimais)
function formatarDecimal(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  // Converte para número e formata com 2 casas decimais, separador de milhar e vírgula decimal
  const num = parseFloat(valor);
  if (isNaN(num)) return valor;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Formata número inteiro (sem decimais)
function formatarInteiro(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const num = parseInt(valor);
  if (isNaN(num)) return valor;
  return num.toLocaleString('pt-BR');
}

// ============================================================
// 1. FUNÇÕES DE CONSULTA (Últimos Sorteios e Frequência)
// ============================================================

async function carregar(tipo, loteria) {
  const div = document.getElementById('conteudo');
  div.innerHTML = 'Carregando...';

  try {
    let url = '';
    if (tipo === 'ultimos') 
      url = `http://localhost:3000/api/${loteria}/ultimos-sorteios`;
    if (tipo === 'frequencia') 
      url = `http://localhost:3000/api/${loteria}/frequencia-colunas`;

    const resposta = await fetch(url);
    const dados = await resposta.json();
    
    if (dados.erro) {
      div.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }

    // Se for frequência, desenha gráfico; senão, tabela normal
    if (tipo === 'frequencia') {
      desenharGrafico(div, dados, loteria);
    } else {
      div.innerHTML = montarTabela(dados, tipo);
    }
  } catch (erro) {
    div.innerHTML = `Erro de conexão: ${erro.message}`;
  }
}

// Função para montar a tabela (apenas para últimos sorteios)
function montarTabela(dados, tipo) {
  if (!dados || dados.length === 0) return 'Nenhum dado encontrado.';

  // Lista de campos que NÃO devem ser exibidos
  const camposOcultos = ['id', 'created_at', 'updated_at','observacoes'];

  // Lista de colunas que são dezenas (devem ter fonte maior)
  const colunasDezenas = ['bl01', 'bl02', 'bl03', 'bl04', 'bl05', 'bl06', 'bl07', 'bl08', 'bl09', 'bl10', 'bl11', 'bl12', 'bl13', 'bl14', 'bl15', 'bl1', 'bl2', 'bl3', 'bl4', 'bl5', 'bl6'];

  // Lista de colunas monetárias (devem ser alinhadas à direita e sem R$)
  const colunasMonetarias = ['rateio6', 'rateio5', 'rateio4', 'rateio15', 'rateio14', 'rateio13', 'rateio12', 'rateio11', 'acumulado', 'arrecadacao', 'estimativa', 'acummegavirada', 'acumindependencia'];

  // Lista de colunas numéricas (inteiros) que devem ser alinhadas à direita
  const colunasNumericas = ['numfacil', 'nummega', 'numganha6', 'numganha5', 'numganha4', 'numganha15', 'numganha14', 'numganha13', 'numganha12', 'numganha11'];

  // Filtra as colunas que serão exibidas
  const todasColunas = Object.keys(dados[0]);
  const colunas = todasColunas.filter(col => !camposOcultos.includes(col));

  let html = '<table><tr>';
  
  // Cabeçalho
  colunas.forEach(col => {
    let nomeColuna = col;
    // Nomes amigáveis
    if (col === 'numfacil') nomeColuna = 'Concurso';
    else if (col === 'datafacil') nomeColuna = 'Data';
    else if (col === 'nummega') nomeColuna = 'Concurso';
    else if (col === 'datamega') nomeColuna = 'Data';
    else if (col === 'local') nomeColuna = '📍';
    else if (col === 'observacoes') nomeColuna = 'Obs.';
    else if (col === 'rateio6') nomeColuna = 'Prêmio 6';
    else if (col === 'rateio5') nomeColuna = 'Prêmio 5';
    else if (col === 'rateio4') nomeColuna = 'Prêmio 4';
    else if (col === 'rateio15') nomeColuna = 'Prêmio 15';
    else if (col === 'rateio14') nomeColuna = 'Prêmio 14';
    else if (col === 'rateio13') nomeColuna = 'Prêmio 13';
    else if (col === 'rateio12') nomeColuna = 'Prêmio 12';
    else if (col === 'rateio11') nomeColuna = 'Prêmio 11';
    else if (col === 'acumulado') nomeColuna = 'Acumulado';
    else if (col === 'arrecadacao') nomeColuna = 'Arrecadação';
    else if (col === 'estimativa') nomeColuna = 'Estimativa';
    else if (col === 'acummegavirada') nomeColuna = 'Acum. Virada';
    else if (col === 'acumindependencia') nomeColuna = 'Acum. Indep.';
    html += `<th>${nomeColuna}</th>`;
  });
  html += '</tr>';

  // Linhas
  dados.forEach(linha => {
    html += '<tr>';
    colunas.forEach(col => {
      let valor = linha[col];
      let classe = '';
      
      // Verifica se é coluna de dezena (fonte maior)
      if (colunasDezenas.includes(col)) {
        classe = 'col-dezena';
      }
      
      // Verifica se é coluna monetária (alinhar à direita, sem R$)
      if (colunasMonetarias.includes(col)) {
        classe += ' align-right';
        valor = formatarDecimal(valor);
      }
      // Verifica se é coluna numérica inteira (alinhar à direita)
      else if (colunasNumericas.includes(col)) {
        classe += ' align-right';
        valor = formatarInteiro(valor);
      }
      // Formatação especial para datas
      if (col === 'datafacil' || col === 'datamega') {
        valor = formatarData(valor);
      } else if (col === 'local') {
        // Transforma em ícone com tooltip
        const cidade = valor || 'Não informado';
        valor = `<span title="${cidade}" style="cursor:help; font-size:1.2rem;">📍</span>`;
      }     // Qualquer outro número decimal (ex: se aparecer algum)
      else if (typeof valor === 'number' && !Number.isInteger(valor)) {
        classe += ' align-right';
        valor = formatarDecimal(valor);
      }
      
      html += `<td class="${classe.trim()}">${valor}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
}
// ============================================================
// 2. FUNÇÃO DE GRÁFICO (Chart.js)
// ============================================================

let graficoAtual = null; // Para destruir gráfico antigo antes de desenhar novo

function desenharGrafico(container, dados, loteria) {
  // Limpa o container e cria um canvas para o gráfico
  container.innerHTML = '<h3>📊 Frequência por Coluna</h3><canvas id="graficoFrequencia" style="max-height: 400px;"></canvas>';

  // Agrupa os dados por coluna
  const colunas = {};
  dados.forEach(item => {
    if (!colunas[item.coluna]) colunas[item.coluna] = [];
    colunas[item.coluna].push({ numero: item.numero, frequencia: item.frequencia });
  });

  // Prepara os datasets para o gráfico (apenas as 5 primeiras colunas para não poluir)
  const tituloColunas = colunasKeys.map(col => col.replace('coluna', 'Coluna '));
  const colunasKeys = Object.keys(colunas).slice(0, 5);
  const datasets = colunasKeys.map((col, index) => {
    // Ordena por número para o eixo X ficar crescente
    const dadosOrdenados = colunas[col].sort((a, b) => parseInt(a.numero) - parseInt(b.numero));
    
    // Cores diferentes para cada coluna (ciclo)
    const cores = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'];
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

  // Eixo X: números (ex: 01, 02, 03...)
    const labels = colunas[colunasKeys[0]].sort((a, b) => parseInt(a.numero) - parseInt(b.numero)).map(d => d.numero);

  // Destroi gráfico anterior se existir
  if (graficoAtual) {
    graficoAtual.destroy();
  }

  // Cria novo gráfico
  const ctx = document.getElementById('graficoFrequencia').getContext('2d');
  graficoAtual = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: document.body.classList.contains('dracula-mode') ? '#f8f8f2' : '#2c3e50'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw} vezes`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: document.body.classList.contains('dracula-mode') ? '#f8f8f2' : '#2c3e50'
          }
        },
        y: {
          ticks: {
            color: document.body.classList.contains('dracula-mode') ? '#f8f8f2' : '#2c3e50'
          },
          beginAtZero: true
        }
      }
    }
  });
}


// ============================================================
// 3. FUNÇÃO DE ALTERNÂNCIA DE TEMA (Claro / Dracula)
// ============================================================

function alternarTema() {
  const body = document.body;
  const botao = document.getElementById('toggleTheme');
  
  if (body.classList.contains('dracula-mode')) {
    body.classList.remove('dracula-mode');
    botao.innerHTML = '🌙 Modo Escuro';
    localStorage.setItem('tema', 'claro');
  } else {
    body.classList.add('dracula-mode');
    botao.innerHTML = '☀️ Modo Claro';
    localStorage.setItem('tema', 'escuro');
  }

  // Se houver um gráfico desenhado, redesenha com as novas cores
  if (graficoAtual) {
    const div = document.getElementById('conteudo');
    const loteria = document.getElementById('loteria').value;
    carregar('frequencia', loteria);
  }
}

// Verifica preferência salva no navegador ao carregar a página
(function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem('tema');
  const botao = document.getElementById('toggleTheme');
  
  if (!botao) {
    setTimeout(aplicarTemaSalvo, 100);
    return;
  }

  if (temaSalvo === 'escuro') {
    document.body.classList.add('dracula-mode');
    botao.innerHTML = '☀️ Modo Claro';
  } else {
    document.body.classList.remove('dracula-mode');
    botao.innerHTML = '🌙 Modo Escuro';
  }
})();

// ============================================================
// 4. FUNÇÃO DE COMPARADOR
// ============================================================
async function comparar() {
  const input = document.getElementById('inputNumeros');
  const divTabela = document.getElementById('tabelaComparador');
  const divGrafico = document.getElementById('graficoPizzaContainer');
  const loteria = document.getElementById('loteria').value;

  // Limpa e valida
  const numerosRaw = input.value.trim();
  if (!numerosRaw) {
    divTabela.innerHTML = '<div style="color:red">Digite os números separados por vírgula.</div>';
    divGrafico.style.display = 'none';
    return;
  }

  const numeros = numerosRaw.split(',').map(n => parseInt(n.trim()));
  if (numeros.some(isNaN)) {
    divTabela.innerHTML = '<div style="color:red">Digite apenas números válidos (ex: 5,12,23).</div>';
    divGrafico.style.display = 'none';
    return;
  }

  divTabela.innerHTML = 'Analisando...';
  divGrafico.style.display = 'none';

  try {
    const resposta = await fetch(`http://localhost:3000/api/${loteria}/comparar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numeros })
    });

    const dados = await resposta.json();

    if (dados.erro) {
      divTabela.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }

    // --- GRÁFICO DE PIZZA ---
    desenharGraficoPizza(divGrafico, dados.numeros);

    // --- TABELA DE RESULTADOS ---
    let html = `<h3>📊 Resultado da Análise</h3>`;
    html += `<p><strong>Média de frequência:</strong> ${formatarDecimal(dados.mediaFrequencia)} vezes por número</p>`;
    
    html += `<table><tr><th>Coluna</th><th>Número</th><th>Frequência</th><th>Status</th></tr>`;
    dados.numeros.forEach(item => {
      const corStatus = item.status === 'Quente' ? '#27ae60' : item.status === 'Morno' ? '#f39c12' : '#e74c3c';
      html += `<tr>
        <td class="col-dezena">${item.coluna.replace('coluna', 'Coluna ')}</td>
        <td class="col-dezena">${item.numero}</td>
        <td class="align-right">${formatarInteiro(item.frequencia)}</td>
        <td style="color:${corStatus}; font-weight:bold; text-align:center;">${item.status}</td>
      </tr>`;
    });
    html += `</table>`;

    // --- SUGESTÕES INTELIGENTES (por coluna) ---
    if (dados.sugestoes && dados.sugestoes.length > 0) {
      html += `<h4>💡 Sugestões de substituição (por coluna)</h4>`;
      html += `<p>Troque números <span style="color:#e74c3c;">frios</span> por estes números <span style="color:#27ae60;">quentes</span> da mesma coluna:</p>`;
      html += `<ul style="list-style-type: none; padding: 0;">`;
      dados.sugestoes.forEach(sug => {
        const cor = sug.status === 'Quente' ? '#27ae60' : '#f39c12';
        html += `<li style="padding: 5px 0;">
          <strong>Coluna ${sug.coluna.replace('coluna', '')}</strong>: 
          substitua <span style="color:#e74c3c;">${sug.numeroOriginal}</span> 
          por <span style="color:${cor}; font-weight:bold;">${sug.numeroSugerido}</span> 
          (frequência: ${formatarInteiro(sug.frequencia)})
        </li>`;
      });
      html += `</ul>`;
    }

    divTabela.innerHTML = html;
  } catch (erro) {
    divTabela.innerHTML = `Erro de conexão: ${erro.message}`;
    divGrafico.style.display = 'none';
  }
}
// ============================================================
// 5. FUNÇÃO DE GRÁFICO DE PIZZA (Comparador)
// ============================================================

let graficoPizzaAtual = null;

function desenharGraficoPizza(container, dados) {
  // Conta quantos de cada status
  const quentes = dados.filter(item => item.status === 'Quente').length;
  const mornos = dados.filter(item => item.status === 'Morno').length;
  const frios = dados.filter(item => item.status === 'Frio').length;

  // Se todos os números forem iguais, não desenha
  if (quentes === 0 && mornos === 0 && frios === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = '<h4>📊 Distribuição dos Status</h4><canvas id="graficoPizza" style="max-height: 250px;"></canvas>';

  // Destroi gráfico anterior se existir
  if (graficoPizzaAtual) {
    graficoPizzaAtual.destroy();
  }

  const ctx = document.getElementById('graficoPizza').getContext('2d');
  const isDark = document.body.classList.contains('dracula-mode');

  graficoPizzaAtual = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Quente', 'Morno', 'Frio'],
      datasets: [{
        data: [quentes, mornos, frios],
        backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
        borderColor: isDark ? '#282a36' : '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDark ? '#f8f8f2' : '#2c3e50',
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.raw / total) * 100).toFixed(1);
              return `${context.label}: ${context.raw} números (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// ============================================================
// GERADOR DE APOSTAS
// ============================================================

async function simular() {
  const nivel = document.getElementById('nivelRisco').value;
  const divSimulacao = document.getElementById('resultadoSimulacao');
  const divGeracao = document.getElementById('resultadoGeracao');
  const loteria = document.getElementById('loteria').value;

  divSimulacao.innerHTML = 'Simulando...';
  divGeracao.innerHTML = '';

  try {
    const resposta = await fetch(`http://localhost:3000/api/${loteria}/simular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nivelRisco: nivel,
        nciclos: 1,
        njogos: 100,
        intervalo: 9,
        seqbase: 0
      })
    });

    const dados = await resposta.json();

    if (dados.erro) {
      divSimulacao.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }

    // Exibe o resultado da simulação
    let html = `
      <div style="background: var(--bg-secondary); padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);">
        <p><strong>Nível escolhido:</strong> ${dados.nivel}</p>
        <p><strong>Critério:</strong> ${dados.criterio}</p>
        <p><strong>Quantidade de cartões gerados:</strong> ${dados.quantidade}</p>
        <p>${dados.mensagem}</p>
    `;

    if (dados.quantidade > 0) {
      html += `
        <button onclick="gerarApostas()" style="margin-top: 10px; padding: 8px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer;">
          ✅ Aceitar e gerar cartões
        </button>
        <button onclick="simular()" style="margin-top: 10px; margin-left: 10px; padding: 8px 20px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">
          🔄 Tentar outro nível
        </button>
      `;
    } else {
      html += `<p style="color: #e74c3c;">Tente outro nível de risco.</p>`;
    }

    html += `</div>`;
    divSimulacao.innerHTML = html;
  } catch (erro) {
    divSimulacao.innerHTML = `Erro de conexão: ${erro.message}`;
  }
}

async function gerarApostas() {
  const nivel = document.getElementById('nivelRisco').value;
  const divGeracao = document.getElementById('resultadoGeracao');
  const loteria = document.getElementById('loteria').value;

  divGeracao.innerHTML = 'Gerando apostas...';

  try {
    const resposta = await fetch(`http://localhost:3000/api/${loteria}/gerar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nivelRisco: nivel,
        nciclos: 1,
        njogos: 1000,
        intervalo: 7,
        seqbase: 3
      })
    });

    const dados = await resposta.json();

    if (dados.erro) {
      divGeracao.innerHTML = `<div style="color:red">Erro: ${dados.erro}</div>`;
      return;
    }

    // Exibe as apostas geradas
    let html = `<h3>📋 Apostas geradas (${dados.quantidade} cartões)</h3>`;
    html += `<div style="max-height: 400px; overflow-y: auto;">`;
    html += `<table><tr><th>#</th><th>Dezenas</th><th>Nº de bolas</th></tr>`;

    dados.apostas.forEach((aposta, index) => {
      html += `<tr>
        <td>${index + 1}</td>
        <td class="col-dezena">${aposta.dezenas}</td>
        <td>${aposta.numbolas}</td>
      </tr>`;
    });

    html += `</table></div>`;
    html += `<button onclick="copiarApostas()" style="margin-top: 15px; padding: 8px 20px; background: #2980b9; color: white; border: none; border-radius: 4px; cursor: pointer;">📋 Copiar todas</button>`;

    divGeracao.innerHTML = html;
  } catch (erro) {
    divGeracao.innerHTML = `Erro de conexão: ${erro.message}`;
  }
}

function copiarApostas() {
  const tabela = document.querySelector('#resultadoGeracao table');
  if (!tabela) return;

  let texto = '';
  const linhas = tabela.querySelectorAll('tr');
  linhas.forEach((linha, index) => {
    if (index === 0) return; // pula cabeçalho
    const colunas = linha.querySelectorAll('td');
    if (colunas.length >= 2) {
      // Pega a coluna das dezenas (índice 1)
      texto += colunas[1].textContent.trim() + '\n';
    }
  });

  navigator.clipboard.writeText(texto).then(() => {
    alert('Apostas copiadas para a área de transferência!');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Apostas copiadas!');
  });
}
// ============================================================
// CONTROLE DE ATUALIZAÇÃO
// ============================================================

// Variável para controlar o intervalo de progresso
let intervaloProgresso = null;

// Função para mostrar o modal
function mostrarModalAtualizacao() {
  const modal = document.getElementById('modalAtualizacao');
  const barra = document.getElementById('barraProgresso');
  const status = document.getElementById('statusAtualizacao');
  
  modal.style.display = 'flex';
  barra.style.width = '0%';
  status.textContent = 'Iniciando...';
  
  // Simula progresso (enquanto o processo real roda)
  let progresso = 0;
  intervaloProgresso = setInterval(() => {
    progresso += Math.random() * 5;
    if (progresso > 90) progresso = 90;
    barra.style.width = progresso + '%';
    if (progresso < 30) status.textContent = 'Desbloqueando arquivos...';
    else if (progresso < 60) status.textContent = 'Convertendo dados...';
    else if (progresso < 90) status.textContent = 'Atualizando banco de dados...';
  }, 300);
}

// Função para esconder o modal
function esconderModalAtualizacao(sucesso = true) {
  if (intervaloProgresso) {
    clearInterval(intervaloProgresso);
    intervaloProgresso = null;
  }
  
  const modal = document.getElementById('modalAtualizacao');
  const barra = document.getElementById('barraProgresso');
  const status = document.getElementById('statusAtualizacao');
  
  if (sucesso) {
    barra.style.width = '100%';
    status.textContent = '✅ Atualização concluída!';
    setTimeout(() => {
      modal.style.display = 'none';
      // Recarrega os dados automaticamente
      carregar('ultimos', document.getElementById('loteria').value);
    }, 1500);
  } else {
    status.textContent = '❌ Erro na atualização. Tente novamente.';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 3000);
  }
}

// Função principal: executa a atualização via API
async function executarAtualizacao() {
  // Mostra o modal
  mostrarModalAtualizacao();
  
  try {
    // Chama a rota de atualização no back-end
    const resposta = await fetch('http://localhost:3000/api/atualizar', {
      method: 'POST'
    });
    
    const dados = await resposta.json();
    
    if (dados.erro) {
      esconderModalAtualizacao(false);
      console.error('Erro na atualização:', dados.erro);
    } else {
      esconderModalAtualizacao(true);
    }
  } catch (erro) {
    esconderModalAtualizacao(false);
    console.error('Erro de conexão:', erro);
  }
}

// ============================================================
// 6. EXPOR FUNÇÕES GLOBALMENTE
// ============================================================

window.comparar = comparar;
window.carregar = carregar;
window.montarTabela = montarTabela;
window.alternarTema = alternarTema;
window.executarAtualizacao = executarAtualizacao;

console.log('✅ Script com gráficos carregado!');