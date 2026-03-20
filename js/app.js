function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuariosUAM")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuariosUAM", JSON.stringify(usuarios));
}

function mostrarMensaje(id, tipo, texto) {
    const caja = document.getElementById(id);
    if (!caja) return;

    caja.className = `alert alert-${tipo}`;
    caja.textContent = texto;
    caja.classList.remove("d-none");
}

function validarPassword(password) {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneSimbolo = /[^A-Za-z0-9]/.test(password);
    const longitudValida = password.length >= 8;

    return tieneMayuscula && tieneNumero && tieneSimbolo && longitudValida;
}

document.addEventListener("DOMContentLoaded", function () {
    const registroForm = document.getElementById("registroForm");
    const loginForm = document.getElementById("loginForm");
    const recuperarForm = document.getElementById("recuperarForm");

    if (registroForm) {
        registroForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim().toLowerCase();
            const nombre = document.getElementById("nombre").value.trim();
            const matricula = document.getElementById("matricula").value.trim();
            const password = document.getElementById("password").value;

            if (!validarPassword(password)) {
                mostrarMensaje(
                    "mensajeRegistro",
                    "danger",
                    "La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo."
                );
                return;
            }

            const usuarios = obtenerUsuarios();
            const existe = usuarios.some(usuario => usuario.email === email);

            if (existe) {
                mostrarMensaje("mensajeRegistro", "warning", "Ese correo ya está registrado.");
                return;
            }

            usuarios.push({
                email,
                nombre,
                matricula,
                password
            });

            guardarUsuarios(usuarios);
            mostrarMensaje("mensajeRegistro", "success", "Usuario registrado correctamente.");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const correo = document.getElementById("correo").value.trim().toLowerCase();
            const password = document.getElementById("password").value;

            const usuarios = obtenerUsuarios();
            const usuario = usuarios.find(
                u => u.email === correo && u.password === password
            );

            if (!usuario) {
                mostrarMensaje("mensajeLogin", "danger", "Correo o contraseña incorrectos.");
                return;
            }

            localStorage.setItem("sesionUAM", JSON.stringify(usuario));
            mostrarMensaje("mensajeLogin", "success", "Inicio de sesión correcto.");

            setTimeout(() => {
                window.location.href = "panel.html";
            }, 1000);
        });
    }

    if (recuperarForm) {
        recuperarForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const correo = document.getElementById("correoRecuperar").value.trim().toLowerCase();
            const usuarios = obtenerUsuarios();
            const usuario = usuarios.find(u => u.email === correo);

            if (!usuario) {
                mostrarMensaje("mensajeRecuperar", "danger", "No se encontró una cuenta con ese correo.");
                return;
            }

            mostrarMensaje(
                "mensajeRecuperar",
                "success",
                `Cuenta encontrada. Tu contraseña registrada es: ${usuario.password}`
            );
        });
    }

    const nombre = document.getElementById("datoNombre");
    const correo = document.getElementById("datoCorreo");
    const matricula = document.getElementById("datoMatricula");

    if (nombre && correo && matricula) {
        const sesion = JSON.parse(localStorage.getItem("sesionUAM"));

        if (!sesion) {
            window.location.href = "index.html";
            return;
        }

        nombre.textContent = sesion.nombre;
        correo.textContent = sesion.email;
        matricula.textContent = sesion.matricula;
    }
});

function cerrarSesion() {
    localStorage.removeItem("sesionUAM");
    window.location.href = "index.html";
}
