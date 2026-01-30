package com.wezeep.domain.repository;

import com.wezeep.domain.model.RewardRedemption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RewardRedemptionRepository extends JpaRepository<RewardRedemption, UUID> {
    List<RewardRedemption> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
