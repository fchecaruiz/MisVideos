"use strict";

window.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("formVideo");
    const tabla = document.querySelector("table");
    const btnGuardar = document.getElementById("btnGuardar");
    const btnCancelar = document.getElementById("btnCancelar");
    
    let modoEdicion = false;
    let idEditando = null;
	
	// Función para mostrar notificaciones personalizadas
	function mostrarNotificacion(mensaje, tipo) {
	    const notificacionesContainer = document.getElementById("notificaciones");
	    const notificacion = document.createElement("div");
	    notificacion.classList.add("notificacion", tipo);
	    notificacion.textContent = mensaje;

	    notificacionesContainer.appendChild(notificacion);

	    // Forzar reflow para que la transición funcione
	    void notificacion.offsetWidth; 
	    notificacion.classList.add("show");

	    // Eliminar la notificación después de 3 segundos
	    setTimeout(() => {
	        notificacion.classList.remove("show");
	        notificacion.addEventListener("transitionend", () => {
	            notificacion.remove();
	        }, { once: true });
	    }, 3000);
	}

    // ---- GUARDAR/ACTUALIZAR VIDEO ----
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const titulo = document.getElementById("titulo").value.trim();
        const urlVideo = document.getElementById("urlVideo").value.trim();

        // --- VALIDACIONES ---
        if (titulo === "" || urlVideo === "") {
            mostrarNotificacion("⚠️ Debes rellenar todos los campos.", "info");
            return;
        }

        const esYouTube = urlVideo.startsWith("https://www.youtube.com/watch?v=") 
                       || urlVideo.startsWith("https://youtu.be/");

        if (!esYouTube) {
            mostrarNotificacion("❌ La URL debe ser un enlace de YouTube válido.\nEjemplo: https://www.youtube.com/watch?v=ABC123", "error");
            return;
        }

        const nuevoVideo = {
            titulo: titulo,
            urlVideo: urlVideo
        };

        // ---- DECIDIR SI ES CREAR O ACTUALIZAR ----
        if (modoEdicion) {
            // ACTUALIZAR VIDEO EXISTENTE
            fetch(`/videos/${idEditando}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoVideo)
            })
            .then(response => response.json())
            .then(data => {
                console.log("Actualizado correctamente:", data);
                mostrarNotificacion("✅ Video actualizado con éxito!", "exito");
                
                // Actualizar la fila en la tabla
                const filaEditando = document.querySelector(`[data-id="${idEditando}"]`).closest("tr");
                filaEditando.cells[1].textContent = data.titulo; 
                
                // Actualizar iframe
                const iframe = filaEditando.querySelector("iframe");
                iframe.src = `https://www.youtube.com/embed/${data.urlVideo.split('v=')[1] || data.urlVideo.split('/').pop()}`;
                
                // Actualizar datos del botón editar
                const btnEditar = filaEditando.querySelector(".editar-btn");
                btnEditar.setAttribute("data-titulo", data.titulo);
                btnEditar.setAttribute("data-urlvideo", data.urlVideo);
                
                // Salir del modo edición
                salirModoEdicion();
            })
            .catch(error => {
                console.error("Error al actualizar:", error);
                mostrarNotificacion("❌ Hubo un error al actualizar el vídeo.", "error");
            });
        } else {
            // CREAR NUEVO VIDEO
            fetch("/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoVideo)
            })
            .then(response => response.json())
            .then(data => {
                console.log("Guardado correctamente:", data);
                form.reset();
                mostrarNotificacion("✅ Video agregado con éxito!", "exito");

                // Crear nueva fila en la tabla
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${data.id}</td>
                    <td>${data.titulo}</td>
                    <td>
                        <iframe src="https://www.youtube.com/embed/${data.urlVideo.split('v=')[1] || data.urlVideo.split('/').pop()}"
                                width="400" height="250"
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </td>
                    <td>
                        <button class="editar-btn" 
                                data-id="${data.id}" 
                                data-titulo="${data.titulo}" 
                                data-urlvideo="${data.urlVideo}">
                            ✏️ Editar
                        </button>
                        <button class="eliminar-btn" data-id="${data.id}">🗑️ Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            })
            .catch(error => {
                console.error("Error al guardar:", error);
                mostrarNotificacion("❌ Hubo un error al guardar el vídeo.", "error");
            });
        }
    });

    // ---- EDITAR VIDEO ----
    tabla.addEventListener("click", function(event) {
        if (event.target.classList.contains("editar-btn")) {
            const id = event.target.getAttribute("data-id");
            const titulo = event.target.getAttribute("data-titulo");
            const urlVideo = event.target.getAttribute("data-urlvideo");

            // Rellenar formulario con datos actuales
            document.getElementById("titulo").value = titulo;
            document.getElementById("urlVideo").value = urlVideo;

            // Cambiar a modo edición
            modoEdicion = true;
            idEditando = id;
            btnGuardar.textContent = "Actualizar Video";
            btnGuardar.classList.add("btn-actualizar");
            btnCancelar.style.display = "inline-block";

            form.scrollIntoView({ behavior: "smooth" });
        }

        // ---- ELIMINAR VIDEO ----
        if (event.target.classList.contains("eliminar-btn")) {
            const id = event.target.getAttribute("data-id");

            if (confirm("¿Seguro que deseas eliminar este vídeo?")) {
                fetch(`/videos/${id}`, { method: "DELETE" })
                .then(() => {
                    console.log("Vídeo eliminado:", id);
                    mostrarNotificacion("✅ Vídeo eliminado correctamente!", "exito");
                    event.target.closest("tr").remove();
                })
                .catch(error => {
                    console.error("Error eliminando vídeo:", error);
                    mostrarNotificacion("❌ Error al eliminar el vídeo.", "error");
                });
            }
        }
    });

    // ---- CANCELAR EDICIÓN ----
    btnCancelar.addEventListener("click", function() {
        salirModoEdicion();
    });

    // ---- FUNCIÓN AUXILIAR ----
    function salirModoEdicion() {
        modoEdicion = false;
        idEditando = null;
        btnGuardar.textContent = "Guardar Video";
        btnGuardar.classList.remove("btn-actualizar"); // 👉 se quita clase al cancelar
        btnCancelar.style.display = "none";
        form.reset();
    }
	
	// ---- BUSCADOR ----
	    const buscador = document.getElementById("buscador");

	    buscador.addEventListener("keyup", function() {
	        const filtro = buscador.value.toLowerCase();
	        const filas = tabla.getElementsByTagName("tr");

	        // Recorremos todas las filas menos la cabecera
	        for (let i = 1; i < filas.length; i++) {
	            const columnas = filas[i].getElementsByTagName("td");
	            if (columnas.length > 0) {
	                const textoTitulo = columnas[1].textContent.toLowerCase();
	                const textoURL = columnas[2].textContent.toLowerCase();

	                if (textoTitulo.includes(filtro) || textoURL.includes(filtro)) {
	                    filas[i].style.display = "";
	                } else {
	                    filas[i].style.display = "none";
	                }
	            }
	        }
	    });
});