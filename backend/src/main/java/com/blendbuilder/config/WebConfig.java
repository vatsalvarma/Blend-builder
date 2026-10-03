package com.blendbuilder.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward all frontend routes to index.html so React Router handles them
        registry.addViewController("/admin/**").setViewName("forward:/index.html");
        registry.addViewController("/admin").setViewName("forward:/index.html");
        registry.addViewController("/feedback/**").setViewName("forward:/index.html");
        registry.addViewController("/privacy").setViewName("forward:/index.html");
        // Also map root if needed
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}
