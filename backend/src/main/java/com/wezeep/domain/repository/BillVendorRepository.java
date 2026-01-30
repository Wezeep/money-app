package com.wezeep.domain.repository;

import com.wezeep.domain.model.BillVendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BillVendorRepository extends JpaRepository<BillVendor, UUID> {
    List<BillVendor> findByCategoryOrderByNameAsc(String category);
}
