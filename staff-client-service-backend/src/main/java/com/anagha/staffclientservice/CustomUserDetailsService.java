package com.anagha.staffclientservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.anagha.staffclientservice.admin.Player;
import com.anagha.staffclientservice.admin.PlayerRepository;
import com.anagha.staffclientservice.client.Client;
import com.anagha.staffclientservice.client.ClientRepository;
import com.anagha.staffclientservice.staff.Staff;
import com.anagha.staffclientservice.staff.StaffRepository;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PlayerRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Search staff
        Optional<Staff> staff = staffRepository.findByUsername(username);
        if (staff.isPresent()) {
            Staff s = staff.get();
            return User.builder()
                    .username(s.getUsername())
                    .password(s.getPassword())
                    .roles("STAFF")
                    .build();
        }

        // Search client
        Optional<Client> client = clientRepository.findByUsername(username);
        if (client.isPresent()) {
            Client c = client.get();
            return User.builder()
                    .username(c.getUsername())
                    .password(c.getPassword())
                    .roles("CLIENT")
                    .build();
        }

        // Search user
        Optional<Player> player = userRepository.findByUsername(username);
        if (player.isPresent()) {
            Player p = player.get();
            return User.builder()
                    .username(p.getUsername())
                    .password(p.getPassword())
                    .roles("ADMIN")
                    .build();
        }

        throw new UsernameNotFoundException("User not found");
    }
}

