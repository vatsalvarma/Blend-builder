package com.blendbuilder.repository;

import com.blendbuilder.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    // We will use pagination for listing orders in the admin panel.
}
