package com.skillverse.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String name;

    @NotNull
    @Email
    @Column(unique = true)
    private String email;

    @NotNull
    private String password;

    private String bio;

    private String avatarUrl;

    @NotNull
    @Column(precision = 19, scale = 2)
    private BigDecimal tokenBalance = BigDecimal.valueOf(100.00);

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_offered", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skillsOffered = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_skills_wanted", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skillsWanted = new ArrayList<>();

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}