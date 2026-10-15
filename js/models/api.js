// ============================================================
// js/models/api.js
// ============================================================

//const API_BASE = 'http://localhost:3000/api';
const API_BASE = '/api';

async function buscarUltimosSorteios() {
  const resposta = await fetch(`${API_BASE}/megasena/ultimos-sorteios`);
  return resposta.json();
}

async function buscarFrequencia() {
  const resposta = await fetch(`${API_BASE}/megasena/frequencia-colunas`);
  return resposta.json();
}

async function compararMega(numeros) {
  const resposta = await fetch(`${API_BASE}/megasena/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numeros })
  });
  return resposta.json();
}

async function buscarUltimosSorteiosLotofacil() {
  const resposta = await fetch(`${API_BASE}/lotofacil/ultimos-sorteios`);
  return resposta.json();
}

async function buscarFrequenciaLotofacil() {
  const resposta = await fetch(`${API_BASE}/lotofacil/frequencia-colunas`);
  return resposta.json();
}

async function compararLotofacil(numeros) {
  const resposta = await fetch(`${API_BASE}/lotofacil/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numeros })
  });
  return resposta.json();
}

async function gerarApostas(loteria, modelo, opcao) {
  const resposta = await fetch(`${API_BASE}/${loteria}/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelo, opcao })
  });
  return resposta.json();
}

async function buscarUltimosSorteiosQuina() {
  const resposta = await fetch(`${API_BASE}/quina/ultimos-sorteios`);
  return resposta.json();
}

async function buscarFrequenciaQuina() {
  const resposta = await fetch(`${API_BASE}/quina/frequencia-colunas`);
  return resposta.json();
}

async function compararQuina(numeros) {
  const resposta = await fetch(`${API_BASE}/quina/comparar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numeros })
  });
  return resposta.json();
}


// Expõe para outros módulos
window.api = {
  buscarUltimosSorteios,
  buscarFrequencia,
  buscarUltimosSorteiosLotofacil,
  buscarFrequenciaLotofacil,
  compararLotofacil,
  compararMega,
  buscarUltimosSorteiosQuina,
  buscarFrequenciaQuina,
  compararQuina,
  gerarApostas
};