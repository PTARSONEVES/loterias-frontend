// ============================================================
// tema.js - Controle de tema claro/escuro
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
}

// Aplica tema salvo ao carregar
(function aplicarTema() {
  const tema = localStorage.getItem('tema');
  const botao = document.getElementById('toggleTheme');
  if (!botao) {
    setTimeout(aplicarTema, 100);
    return;
  }
  if (tema === 'escuro') {
    document.body.classList.add('dracula-mode');
    botao.innerHTML = '☀️ Modo Claro';
  } else {
    document.body.classList.remove('dracula-mode');
    botao.innerHTML = '🌙 Modo Escuro';
  }
})();

// Expõe para outros módulos
window.tema = {
  alternarTema
};