package com.wezeep.domain.repository;

import com.wezeep.domain.model.SocialAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SocialAuthRepository extends JpaRepository<SocialAuth, UUID> {
    Optional<SocialAuth> findByProviderAndProviderUserId(SocialAuth.SocialProvider provider, String providerUserId);
    Optional<SocialAuth> findByUserId(UUID userId);
    boolean existsByProviderAndProviderUserId(SocialAuth.SocialProvider provider, String providerUserId);
}
