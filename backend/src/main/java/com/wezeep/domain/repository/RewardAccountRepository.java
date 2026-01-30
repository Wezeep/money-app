package com.wezeep.domain.repository;

import com.wezeep.domain.model.RewardAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RewardAccountRepository extends JpaRepository<RewardAccount, UUID> {
    Optional<RewardAccount> findByUserId(UUID userId);
}
