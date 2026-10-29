package com.localservicefinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Entry Point for Local Service Finder Application.
 * Spring Boot + Spring MVC + Spring Data JPA + Hibernate.
 */
@SpringBootApplication
public class LocalServiceFinderApplication {

    public static void main(String[] args) {
        SpringApplication.run(LocalServiceFinderApplication.class, args);
        System.out.println("=================================================");
        System.out.println("🚀 Local Service Finder Backend is running!");
        System.out.println("🌐 Port: http://localhost:8080");
        System.out.println("📡 API Base: http://localhost:8080/api");
        System.out.println("=================================================");
    }
}
