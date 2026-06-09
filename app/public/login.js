document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    correo: document.getElementById('correo').value,
    contrasena: document.getElementById('contrasena').value
  };

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = '/dashboard'; // página principal después del login
  } else {
    alert(data.mensaje);
  }
});