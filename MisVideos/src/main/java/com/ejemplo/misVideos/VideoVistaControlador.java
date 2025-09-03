package com.ejemplo.misVideos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VideoVistaControlador {

    @Autowired
    private VideoServicio videoServicio;

    @GetMapping("/vista/videos")
    public String listarVideos(Model modelo) {
        // Enviamos la lista de videos a la vista Thymeleaf
        modelo.addAttribute("listaVideos", videoServicio.listarTodos());
        return "videos"; // busca el archivo videos.html en /templates
    }
}