package com.wezeep.domain.repository;

import com.wezeep.domain.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, UUID> {
    List<PaymentMethod> findByUserIdAndIsActiveTrueOrderByIsDefaultDesc(UUID userId);
    Optional<PaymentMethod> findByUserIdAndIsDefaultTrue(UUID userId);
    List<PaymentMethod> findByUserId(UUID userId);
}
