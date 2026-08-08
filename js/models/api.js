// ============================================================
// js/models/api.js
// ============================================================

const API_BASE = 'http://localhost:3000/api';

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

async function gerarMega(nivelRisco) {
  const resposta = await fetch(`${API_BASE}/megasena/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nivelRisco })
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

async function gerarLotofacil(nivelRisco) {
  const resposta = await fetch(`${API_BASE}/lotofacil/gerar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nivelRisco })
  });
  return resposta.json();
}

async function gerarApostas(loteria, nivelRisco) {
  if (loteria === 'megasena') {
    return await gerarMega(nivelRisco);
  } else if (loteria === 'lotofacil') {
    return await gerarLotofacil(nivelRisco);
  }
}

// Expõe para outros módulos
window.api = {
  buscarUltimosSorteios,
  buscarFrequencia,
  buscarUltimosSorteiosLotofacil,
  buscarFrequenciaLotofacil,
  compararLotofacil,
  gerarLotofacil,
  compararMega,
  gerarMega,
  gerarApostas
};