package com.wezeep.domain.repository;

import com.wezeep.domain.model.Referral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReferralRepository extends JpaRepository<Referral, UUID> {
    Optional<Referral> findByReferralCode(String referralCode);
    List<Referral> findByReferrerId(UUID referrerId);
    Optional<Referral> findByReferredUserId(UUID referredUserId);
    boolean existsByReferralCode(String referralCode);
}
