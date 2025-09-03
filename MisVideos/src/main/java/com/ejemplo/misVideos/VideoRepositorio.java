package com.ejemplo.misVideos;

import org.springframework.data.jpa.repository.JpaRepository;

// Repositorio para manejar la entidad Video
public interface VideoRepositorio extends JpaRepository<Video, Long> {
    
    // Ejemplo: buscar videos por titulo
    Video findByTitulo(String titulo); //Titulo es el nombre del atributo o propiedad en la clase Video y da igualque este con mayusculas o minusculas
}