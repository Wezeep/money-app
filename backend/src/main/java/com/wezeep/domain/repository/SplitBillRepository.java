package com.wezeep.domain.repository;

import com.wezeep.domain.model.SplitBill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SplitBillRepository extends JpaRepository<SplitBill, UUID> {
    List<SplitBill> findByCreatorIdOrderByCreatedAtDesc(UUID creatorId);
    Optional<SplitBill> findByGroupLink(String groupLink);
    
    @Query("SELECT sb FROM SplitBill sb JOIN sb.participants p WHERE p.userId = :userId " +
           "ORDER BY sb.createdAt DESC")
    List<SplitBill> findByParticipantId(@Param("userId") UUID userId);
}
