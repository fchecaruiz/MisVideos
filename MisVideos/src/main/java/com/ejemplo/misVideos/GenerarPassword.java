package com.ejemplo.misVideos;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarPassword {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String passwordReal = "1234";
        String passwordCifrada = encoder.encode(passwordReal);
        
        System.out.println("Password real: " + passwordReal);
        System.out.println("Password cifrada: " + passwordCifrada);
    }
}