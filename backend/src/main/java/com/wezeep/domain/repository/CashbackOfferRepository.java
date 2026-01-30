package com.wezeep.domain.repository;

import com.wezeep.domain.model.CashbackOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface CashbackOfferRepository extends JpaRepository<CashbackOffer, UUID> {
    @Query("SELECT c FROM CashbackOffer c WHERE c.isActive = true " +
           "AND (c.startDate IS NULL OR c.startDate <= :now) " +
           "AND (c.endDate IS NULL OR c.endDate >= :now)")
    List<CashbackOffer> findActiveOffers(@Param("now") Instant now);
    
    @Query("SELECT c FROM CashbackOffer c WHERE c.isActive = true " +
           "AND (c.applicableCountry IS NULL OR c.applicableCountry = :country) " +
           "AND (c.startDate IS NULL OR c.startDate <= :now) " +
           "AND (c.endDate IS NULL OR c.endDate >= :now)")
    List<CashbackOffer> findActiveOffersByCountry(@Param("country") String country, @Param("now") Instant now);
}
