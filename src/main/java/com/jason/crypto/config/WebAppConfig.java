package com.jason.crypto.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebAppConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/whale.html");
        registry.addViewController("/whale").setViewName("forward:/whale.html");
        registry.addViewController("/light").setViewName("forward:/light.html");
    }

}