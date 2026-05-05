package com.movierating.service;

import com.movierating.config.SecurityConfig;
import com.movierating.security.JwtUtils;
import com.movierating.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {SecurityConfig.class})
@ActiveProfiles("test")
public class UserServicePasswordEncoderTest {

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testPasswordEncoderBeanExists() {
        assertThat(passwordEncoder).isNotNull();
    }

    @Test
    public void testPasswordEncoderEncodesPassword() {
        String rawPassword = "testPassword123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        assertThat(encodedPassword).isNotBlank();
        assertThat(encodedPassword).isNotEqualTo(rawPassword);
        
        // Verify the encoded password matches the raw password
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        assertThat(matches).isTrue();
        
        // Verify wrong password doesn't match
        boolean wrongMatches = passwordEncoder.matches("wrongPassword", encodedPassword);
        assertThat(wrongMatches).isFalse();
    }
}