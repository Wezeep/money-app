package com.wezeep.domain.repository;

import com.wezeep.domain.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Page<Transaction> findBySenderIdOrderByCreatedAtDesc(UUID senderId, Pageable pageable);
    Page<Transaction> findByRecipientIdOrderByCreatedAtDesc(UUID recipientId, Pageable pageable);
    List<Transaction> findBySenderIdAndStatus(UUID senderId, Transaction.TransactionStatus status);
    List<Transaction> findByRecipientIdAndStatus(UUID recipientId, Transaction.TransactionStatus status);
    
    @Query("SELECT t FROM Transaction t WHERE t.sender.id = :userId OR t.recipient.id = :userId " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByUserId(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE (t.sender.id = :userId OR t.recipient.id = :userId) " +
           "AND t.createdAt >= :startDate AND t.createdAt <= :endDate " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findByUserIdAndDateRange(@Param("userId") UUID userId, 
                                                 @Param("startDate") Instant startDate,
                                                 @Param("endDate") Instant endDate);
}
