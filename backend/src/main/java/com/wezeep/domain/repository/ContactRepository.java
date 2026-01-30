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
    List<Contact> findByUser_IdOrderByLastUsedAtDesc(UUID userId);

    @Query("SELECT c FROM Contact c WHERE c.user.id = :userId " +
           "AND (LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.wezeepId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "c.phoneNumber LIKE CONCAT('%', :query, '%')) " +
           "ORDER BY c.lastUsedAt DESC")
    List<Contact> searchContacts(@Param("userId") UUID userId, @Param("query") String query);

    Optional<Contact> findByUser_IdAndWezeepId(UUID userId, String wezeepId);
    Optional<Contact> findByUser_IdAndPhoneNumber(UUID userId, String phoneNumber);

    List<Contact> findFirst3ByUser_IdOrderByLastUsedAtDesc(UUID userId);
}
