package com.movierating.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.WebContentInterceptor;
import org.springframework.http.CacheControl;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebContentInterceptor interceptor = new WebContentInterceptor();
        // Disable caching for all API endpoints to ensure fresh data for profile and statistics
        interceptor.addCacheMapping(CacheControl.noStore().mustRevalidate(), "/**");
        registry.addInterceptor(interceptor);
    }
}
