package com.skillverse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This makes the /api/files/** URLs map to the uploads directory on the filesystem
        registry.addResourceHandler("/api/files/**")
                .addResourceLocations("file:./uploads/");
    }
}