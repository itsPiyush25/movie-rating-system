package com.movierating.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "persons")
public class Person {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Column(name = "death_date")
    private LocalDate deathDate;
    
    @Column(columnDefinition = "TEXT")
    private String biography;
    
    @Column(name = "profile_url")
    private String profileUrl;
    
    @Column(name = "imdb_id")
    private String imdbId;
    
    @Column(name = "tmdb_id")
    private String tmdbId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonType personType;
    
    @ManyToMany(mappedBy = "directors")
    private Set<Content> directedContents = new HashSet<>();
    
    @ManyToMany(mappedBy = "cast")
    private Set<Content> actedContents = new HashSet<>();
    
    public Person() {}
    
    public Person(String name, PersonType personType) {
        this.name = name;
        this.personType = personType;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public LocalDate getBirthDate() {
        return birthDate;
    }
    
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
    
    public LocalDate getDeathDate() {
        return deathDate;
    }
    
    public void setDeathDate(LocalDate deathDate) {
        this.deathDate = deathDate;
    }
    
    public String getBiography() {
        return biography;
    }
    
    public void setBiography(String biography) {
        this.biography = biography;
    }
    
    public String getProfileUrl() {
        return profileUrl;
    }
    
    public void setProfileUrl(String profileUrl) {
        this.profileUrl = profileUrl;
    }
    
    public String getImdbId() {
        return imdbId;
    }
    
    public void setImdbId(String imdbId) {
        this.imdbId = imdbId;
    }
    
    public String getTmdbId() {
        return tmdbId;
    }
    
    public void setTmdbId(String tmdbId) {
        this.tmdbId = tmdbId;
    }
    
    public PersonType getPersonType() {
        return personType;
    }
    
    public void setPersonType(PersonType personType) {
        this.personType = personType;
    }
    
    public Set<Content> getDirectedContents() {
        return directedContents;
    }
    
    public void setDirectedContents(Set<Content> directedContents) {
        this.directedContents = directedContents;
    }
    
    public Set<Content> getActedContents() {
        return actedContents;
    }
    
    public void setActedContents(Set<Content> actedContents) {
        this.actedContents = actedContents;
    }
    
    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", personType=" + personType +
                '}';
    }
}

enum PersonType {
    DIRECTOR,
    ACTOR,
    WRITER,
    PRODUCER,
    COMPOSER,
    CINEMATOGRAPHER,
    EDITOR,
    OTHER
}