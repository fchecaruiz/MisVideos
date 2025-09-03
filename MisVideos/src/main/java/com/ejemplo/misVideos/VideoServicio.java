package com.ejemplo.misVideos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VideoServicio {

    @Autowired
    private VideoRepositorio videoRepositorio;

    public List<Video> listarTodos() {
        return videoRepositorio.findAll();
    }

    public Video guardar(Video video) {
        return videoRepositorio.save(video);
    }

    public Video buscarPorId(Long id) {
        return videoRepositorio.findById(id).orElse(null);
    }
    
    public void eliminar(Long id) {
        videoRepositorio.deleteById(id);
    }
}