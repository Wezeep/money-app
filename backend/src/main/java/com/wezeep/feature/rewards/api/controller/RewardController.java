package com.wezeep.feature.rewards.api.controller;

import com.wezeep.feature.rewards.api.dto.RewardRedemptionRequest;
import com.wezeep.domain.model.RewardAccount;
import com.wezeep.domain.model.RewardRedemption;
import com.wezeep.domain.repository.RewardAccountRepository;
import com.wezeep.domain.repository.RewardRedemptionRepository;
import com.wezeep.security.UserPrincipal;
import com.wezeep.feature.rewards.service.RewardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    private final RewardService rewardService;
    private final RewardAccountRepository rewardAccountRepository;
    private final RewardRedemptionRepository redemptionRepository;

    public RewardController(
            RewardService rewardService,
            RewardAccountRepository rewardAccountRepository,
            RewardRedemptionRepository redemptionRepository) {
        this.rewardService = rewardService;
        this.rewardAccountRepository = rewardAccountRepository;
        this.redemptionRepository = redemptionRepository;
    }

    @GetMapping("/account")
    public ResponseEntity<RewardAccount> getRewardAccount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        RewardAccount account = rewardAccountRepository.findByUserId(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Reward account not found"));
        return ResponseEntity.ok(account);
    }

    @PostMapping("/redeem")
    public ResponseEntity<RewardRedemption> redeemRewards(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody RewardRedemptionRequest request) {
        RewardRedemption redemption = rewardService.redeemRewards(
                userPrincipal.getId(),
                request.getRedemptionType(),
                request.getPoints()
        );
        return ResponseEntity.ok(redemption);
    }

    @GetMapping("/redemptions")
    public ResponseEntity<List<RewardRedemption>> getRedemptions(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<RewardRedemption> redemptions = redemptionRepository.findByUserIdOrderByCreatedAtDesc(userPrincipal.getId());
        return ResponseEntity.ok(redemptions);
    }
}
