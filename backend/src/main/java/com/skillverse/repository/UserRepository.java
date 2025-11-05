package com.skillverse.repository;

import com.skillverse.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
}