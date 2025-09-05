package com.ejemplo.misVideos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller   // 👈 antes era @RestController
@RequestMapping("/videos")
public class VideoControlador {

    @Autowired
    private VideoServicio videoServicio;

    // 👉 Cargar la vista videos.html
    @GetMapping
    public String listarVideos(Model model) {
        model.addAttribute("listaVideos", videoServicio.listarTodos());
        return "videos"; // devuelve videos.html
    }

    // 👉 Endpoints REST
    @ResponseBody
    @PostMapping
    public Video crearVideo(@RequestBody Video video) {
        return videoServicio.guardar(video);
    }

    @ResponseBody
    @GetMapping("/{id}")
    public Video obtenerPorId(@PathVariable Long id) {
        return videoServicio.buscarPorId(id);
    }
    
    @ResponseBody
    @DeleteMapping("/{id}")
    public void eliminarVideo(@PathVariable Long id) {
        videoServicio.eliminar(id);
    }
    
    @ResponseBody
    @PutMapping("/{id}")
    public Video actualizarVideo(@PathVariable Long id, @RequestBody Video video) {
        video.setId(id);
        return videoServicio.guardar(video);
    }
}