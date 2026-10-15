document.getElementById('form-login')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = Object.fromEntries(fd.entries());

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',        // ← envia/recebe o cookie
    body: JSON.stringify(body),
  });

  const data = await res.json();
  const msg = document.getElementById('msg');

  if (res.ok) {
    msg.textContent = `Bem-vindo, ${data.user.nome || data.user.email}`;
    // redirecionar para a home depois
  } else {
    msg.textContent = 'Email ou senha inválidos';
  }
});