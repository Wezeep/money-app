package com.wezeep.api.controller;

import com.wezeep.domain.model.Referral;
import com.wezeep.domain.model.User;
import com.wezeep.domain.repository.ReferralRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.security.UserPrincipal;
import com.wezeep.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    private final ReferralRepository referralRepository;
    private final UserRepository userRepository;
    private final RewardService rewardService;

    public ReferralController(
            ReferralRepository referralRepository,
            UserRepository userRepository,
            RewardService rewardService) {
        this.referralRepository = referralRepository;
        this.userRepository = userRepository;
        this.rewardService = rewardService;
    }

    @GetMapping("/code")
    public ResponseEntity<Map<String, String>> getReferralCode(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(Map.of("referralCode", user.getReferralCode() != null ? user.getReferralCode() : ""));
    }

    @GetMapping
    public ResponseEntity<List<Referral>> getReferrals(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Referral> referrals = referralRepository.findByReferrerId(userPrincipal.getId());
        return ResponseEntity.ok(referrals);
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, String>> applyReferralCode(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam String referralCode) {
        
        Referral referral = referralRepository.findByReferralCode(referralCode)
                .orElseThrow(() -> new RuntimeException("Invalid referral code"));

        if (referral.getReferrer().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("Cannot use your own referral code");
        }

        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getReferredBy() != null) {
            throw new RuntimeException("Referral code already applied");
        }

        referral.setReferredUser(user);
        referralRepository.save(referral);

        // Award points to referrer when referred user completes first transaction
        // This would be triggered when the referred user makes their first transaction

        return ResponseEntity.ok(Map.of("message", "Referral code applied successfully"));
    }
}
