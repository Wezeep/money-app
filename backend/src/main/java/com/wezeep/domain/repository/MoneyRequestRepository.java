package com.wezeep.domain.repository;

import com.wezeep.domain.model.MoneyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MoneyRequestRepository extends JpaRepository<MoneyRequest, UUID> {
    List<MoneyRequest> findByRequesterIdOrderByCreatedAtDesc(UUID requesterId);
    List<MoneyRequest> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId);
    Optional<MoneyRequest> findByShareableLink(String shareableLink);
    
    @Query("SELECT mr FROM MoneyRequest mr WHERE mr.expiresAt < :now AND mr.status = 'PENDING'")
    List<MoneyRequest> findExpiredRequests(@Param("now") Instant now);
}
