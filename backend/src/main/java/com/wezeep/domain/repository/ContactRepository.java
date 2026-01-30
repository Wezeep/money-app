package com.wezeep.domain.repository;

import com.wezeep.domain.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findByUserIdOrderByLastUsedAtDesc(UUID userId);
    
    @Query("SELECT c FROM Contact c WHERE c.userId = :userId " +
           "AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.wezeepId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "c.phoneNumber LIKE CONCAT('%', :query, '%')) " +
           "ORDER BY c.lastUsedAt DESC")
    List<Contact> searchContacts(@Param("userId") UUID userId, @Param("query") String query);
    
    Optional<Contact> findByUserIdAndWezeepId(UUID userId, String wezeepId);
    Optional<Contact> findByUserIdAndPhoneNumber(UUID userId, String phoneNumber);
    
    @Query("SELECT c FROM Contact c WHERE c.userId = :userId " +
           "ORDER BY c.lastUsedAt DESC LIMIT 3")
    List<Contact> findRecentContacts(@Param("userId") UUID userId);
}
