document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    nombre: document.getElementById('nombre').value,
    correo: document.getElementById('correo').value,
    telefono: document.getElementById('telefono').value,
    contrasena: document.getElementById('contrasena').value
  };

  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = '/?registro=exitoso';
  } else {
    alert(data.mensaje);
  }
});