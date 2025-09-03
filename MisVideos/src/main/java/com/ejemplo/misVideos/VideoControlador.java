package com.ejemplo.misVideos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/videos")
public class VideoControlador {

    @Autowired
    private VideoServicio videoServicio;

    @GetMapping
    public List<Video> listarVideos() {
        return videoServicio.listarTodos();
    }

    @PostMapping
    public Video crearVideo(@RequestBody Video video) {
        return videoServicio.guardar(video);
    }

    @GetMapping("/{id}")
    public Video obtenerPorId(@PathVariable Long id) {
        return videoServicio.buscarPorId(id);
    }
    
    @DeleteMapping("/{id}")
    public void eliminarVideo(@PathVariable Long id) {
        videoServicio.eliminar(id);
    }
    
    @PutMapping("/{id}")
    public Video actualizarVideo(@PathVariable Long id, @RequestBody Video video) {
        video.setId(id); // Asegurar que el ID coincide
        return videoServicio.guardar(video); // El mismo método save() sirve para crear y actualizar
    }

}