package com.ejemplo.misVideos;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity                   // Marca la clase como una entidad JPA
@Data                     // Genera getters, setters, toString, equals, hashCode
@NoArgsConstructor        // Genera constructor vacío
@AllArgsConstructor       // Genera constructor con todos los atributos
public class Video {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String titulo;
    
    private String urlVideo;
}