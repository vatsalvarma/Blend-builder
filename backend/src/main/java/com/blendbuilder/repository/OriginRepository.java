package com.blendbuilder.repository;

import com.blendbuilder.entity.Origin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OriginRepository extends JpaRepository<Origin, String> {
    List<Origin> findByInStockTrue();
}
