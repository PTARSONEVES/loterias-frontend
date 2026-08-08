// ============================================================
// atualizacaoController.js
// ============================================================
console.log('🟢 Botão Atualizar Dados clicado!');
async function atualizarDados() {
  // Cria um modal simples de feedback
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6); display: flex; align-items: center;
    justify-content: center; z-index: 9999;
  `;
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
      <div style="font-size: 40px;">🔄</div>
      <h2>Atualizando dados...</h2>
      <p>Por favor, aguarde. Isso pode levar alguns minutos.</p>
    </div>
  `;
  document.body.appendChild(modal);

  try {
    const resultado = await api.atualizarDados();
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
        <div style="font-size: 40px;">${resultado.sucesso ? '✅' : '❌'}</div>
        <h2>${resultado.sucesso ? 'Atualização concluída!' : 'Erro na atualização'}</h2>
        <p>${resultado.sucesso ? 'Os dados foram atualizados com sucesso.' : resultado.erro || 'Tente novamente.'}</p>
        <button onclick="this.closest('div').parentElement.remove()" style="padding: 8px 20px; margin-top: 15px;">Fechar</button>
      </div>
    `;
  } catch (erro) {
    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
        <div style="font-size: 40px;">❌</div>
        <h2>Erro de conexão</h2>
        <p>${erro.message}</p>
        <button onclick="this.closest('div').parentElement.remove()" style="padding: 8px 20px; margin-top: 15px;">Fechar</button>
      </div>
    `;
  }
}

// Exporta para o HTML
window.controllers = window.controllers || {};
window.controllers.atualizacao = { atualizarDados };