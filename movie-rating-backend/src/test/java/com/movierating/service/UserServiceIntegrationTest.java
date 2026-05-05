package com.movierating.service;

import com.movierating.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Test
    public void testUserServiceCanAutowirePasswordEncoder() {
        // This test verifies that UserService can be autowired and uses PasswordEncoder
        // Create a test user
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setDisplayName("Test User");
        
        // Register the user - this will use PasswordEncoder internally
        User registeredUser = userService.registerUser(testUser);
        
        assertThat(registeredUser).isNotNull();
        assertThat(registeredUser.getId()).isNotNull();
        assertThat(registeredUser.getPassword()).isNotEqualTo("password123"); // Should be encoded
        assertThat(registeredUser.getUsername()).isEqualTo("testuser");
        assertThat(registeredUser.getEmail()).isEqualTo("test@example.com");
        assertThat(registeredUser.getIsActive()).isTrue();
        
        // Test authentication - this also uses PasswordEncoder.matches()
        Optional<User> authenticatedUser = userService.authenticateUser("test@example.com", "password123");
        assertThat(authenticatedUser).isPresent();
        assertThat(authenticatedUser.get().getId()).isEqualTo(registeredUser.getId());
        
        // Test wrong password
        Optional<User> wrongPasswordUser = userService.authenticateUser("test@example.com", "wrongpassword");
        assertThat(wrongPasswordUser).isEmpty();
        
        // Test change password - uses PasswordEncoder.matches() and encode()
        boolean passwordChanged = userService.changePassword(registeredUser.getId(), "password123", "newpassword456");
        assertThat(passwordChanged).isTrue();
        
        // Verify old password no longer works
        Optional<User> oldPasswordAuth = userService.authenticateUser("test@example.com", "password123");
        assertThat(oldPasswordAuth).isEmpty();
        
        // Verify new password works
        Optional<User> newPasswordAuth = userService.authenticateUser("test@example.com", "newpassword456");
        assertThat(newPasswordAuth).isPresent();
    }
    
    @Test
    public void testUserServiceMethodsUsePasswordEncoder() {
        // Create a user
        User user = new User();
        user.setUsername("encoderuser");
        user.setEmail("encoder@example.com");
        user.setPassword("plaintext");
        user.setDisplayName("Encoder User");
        
        User saved = userService.registerUser(user);
        
        // Verify password was encoded
        assertThat(saved.getPassword()).isNotEqualTo("plaintext");
        assertThat(saved.getPassword()).startsWith("$2a$"); // BCrypt prefix
        
        // Test authentication uses PasswordEncoder.matches()
        Optional<User> auth = userService.authenticateUser("encoderuser", "plaintext");
        assertThat(auth).isPresent();
        
        // Test authentication with wrong password
        Optional<User> wrongAuth = userService.authenticateUser("encoderuser", "wrong");
        assertThat(wrongAuth).isEmpty();
    }
}