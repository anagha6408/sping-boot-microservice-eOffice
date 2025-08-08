package com.anagha.staffclientservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.anagha.staffclientservice.CustomUserDetailsService;
import com.anagha.staffclientservice.admin.Player;
import com.anagha.staffclientservice.admin.PlayerRepository;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;

@EnableWebSecurity
@EnableMethodSecurity
@Configuration
public class SecurityConfig {
	
	@Bean
	public CommandLineRunner insertAdmin(PlayerRepository playerRepo, PasswordEncoder encoder) {
	    return args -> {
	    	Player admin = playerRepo.findByUsername("admin").orElse(new Player());
	        admin.setUsername("admin");
	        admin.setPassword(encoder.encode("admin")); 
	        admin.setRole("ADMIN");
	        playerRepo.save(admin);
	    };
	}

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { 
        http
            .csrf(csrf -> csrf.disable())
            .cors(withDefaults()) // **Crucial Line: Tells Spring Security to use your CORS config**
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/eOffice/welcome").permitAll()
                .requestMatchers("/staffs").authenticated()
                .requestMatchers("/clients").authenticated()
                .requestMatchers("/login").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Your CORS configuration bean
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}