// ============================================================
// formatadores.js - Funções de formatação
// ============================================================

function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  if (isNaN(data.getTime())) return dataISO;
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}-${mes}-${ano}`;
}

function formatarDecimal(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const num = parseFloat(valor);
  if (isNaN(num)) return valor;
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatarInteiro(valor) {
  if (valor === null || valor === undefined || valor === '') return '';
  const num = parseInt(valor);
  if (isNaN(num)) return valor;
  return num.toLocaleString('pt-BR');
}

// Expõe para outros módulos
window.formatadores = {
  formatarData,
  formatarDecimal,
  formatarInteiro
};