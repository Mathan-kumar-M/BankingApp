package com.example.BankingSystem.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Map the root URL to index.html
        registry.addViewController("/").setViewName("forward:/index.html");
        
        // Map any other non-API routes to index.html to support single-page application routing (if needed)
        // registry.addViewController("/{x:[\\w\\-]+}").setViewName("forward:/index.html");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Explicitly tell Spring to serve static resources from the static folder
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
