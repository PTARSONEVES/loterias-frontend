async function carregarTipos() {
  const msg = document.getElementById('msg');
  const lista = document.getElementById('lista-tipos');

  try {
    const res = await fetch('/tipos-aposta', { credentials: 'include' });
    if (!res.ok) throw new Error('Falha ao carregar');

    const data = await res.json();
    msg.textContent = '';

    if (data.tipos.length === 0) {
      msg.textContent = 'Nenhum tipo de aposta ativo.';
      return;
    }

    for (const tipo of data.tipos) {
      const li = document.createElement('li');

      const strong = document.createElement('strong');
      strong.textContent = tipo.nome;

      const spanJogo = document.createElement('span');
      spanJogo.textContent = ` (${tipo.jogo} · ${tipo.modelo}) `;

      const spanDez = document.createElement('span');
      spanDez.textContent = `${tipo.dezenas_min} a ${tipo.dezenas_max} dezenas `;

      const link = document.createElement('a');
      link.href = `/gerar/${tipo.jogo}`;
      link.textContent = 'Gerar aposta';

      li.append(strong, spanJogo, spanDez, link);
      lista.appendChild(li);
    }
  } catch (e) {
    msg.textContent = 'Erro ao carregar tipos de aposta.';
  }
}

carregarTipos();