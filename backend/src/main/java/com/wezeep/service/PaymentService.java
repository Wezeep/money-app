package com.wezeep.service;

import com.wezeep.domain.model.PaymentMethod;
import com.wezeep.domain.model.Transaction;
import com.wezeep.domain.model.User;
import com.wezeep.domain.model.Wallet;
import com.wezeep.domain.repository.PaymentMethodRepository;
import com.wezeep.domain.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final WalletRepository walletRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    
    @Value("${wezeep.fintech.payment.retry-attempts:3}")
    private int retryAttempts;
    
    @Value("${wezeep.fintech.payment.fallback-enabled:true}")
    private boolean fallbackEnabled;

    public PaymentService(WalletRepository walletRepository, PaymentMethodRepository paymentMethodRepository) {
        this.walletRepository = walletRepository;
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @Transactional
    public boolean verifyBalance(UUID userId, String paymentMethodType, BigDecimal amount) {
        if ("WEEZEEP_WALLET".equals(paymentMethodType)) {
            Wallet wallet = walletRepository.findByUserIdAndCurrency(userId, "USD")
                    .orElseThrow(() -> new RuntimeException("Wallet not found"));
            return wallet.hasSufficientBalance(amount);
        }
        
        // For other payment methods, integrate with external providers
        // This is a placeholder - in production, call actual payment provider APIs
        return true;
    }

    @Transactional
    public boolean processPayment(UUID userId, String paymentMethodType, BigDecimal amount, String currency) {
        if ("WEEZEEP_WALLET".equals(paymentMethodType)) {
            Wallet wallet = walletRepository.findByUserIdAndCurrency(userId, currency)
                    .orElseGet(() -> createWallet(userId, currency));
            
            if (!wallet.hasSufficientBalance(amount)) {
                return false;
            }
            
            wallet.subtractBalance(amount);
            walletRepository.save(wallet);
            return true;
        }
        
        // For external payment methods, integrate with payment providers
        // This would call Stripe, PayPal, or other payment gateways
        return processExternalPayment(userId, paymentMethodType, amount, currency);
    }

    @Transactional
    public boolean processExternalPayment(UUID userId, String paymentMethodType, BigDecimal amount, String currency) {
        // Placeholder for external payment processing
        // In production, this would integrate with Stripe, PayPal, etc.
        try {
            // Simulate payment processing
            Thread.sleep(100);
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    @Transactional
    public boolean processPaymentWithFallback(UUID userId, List<String> paymentMethods, BigDecimal amount, String currency) {
        for (String paymentMethod : paymentMethods) {
            try {
                if (processPayment(userId, paymentMethod, amount, currency)) {
                    return true;
                }
            } catch (Exception e) {
                // Log error and try next method
                continue;
            }
        }
        return false;
    }

    @Transactional
    public void creditRecipient(UUID recipientId, BigDecimal amount, String currency, String deliveryMethod) {
        if ("WEEZEEP_WALLET".equals(deliveryMethod)) {
            Wallet wallet = walletRepository.findByUserIdAndCurrency(recipientId, currency)
                    .orElseGet(() -> createWallet(recipientId, currency));
            wallet.addBalance(amount);
            walletRepository.save(wallet);
        } else {
            // For other delivery methods, process external transfers
            processExternalTransfer(recipientId, amount, currency, deliveryMethod);
        }
    }

    private void processExternalTransfer(UUID recipientId, BigDecimal amount, String currency, String deliveryMethod) {
        // Placeholder for external transfer processing
        // In production, this would integrate with banking APIs, mobile money providers, etc.
    }

    private Wallet createWallet(UUID userId, String currency) {
        Wallet wallet = Wallet.builder()
                .user(User.builder().id(userId).build())
                .currency(currency)
                .balance(BigDecimal.ZERO)
                .build();
        return walletRepository.save(wallet);
    }

    public List<PaymentMethod> getAvailablePaymentMethods(UUID userId) {
        return paymentMethodRepository.findByUserIdAndIsActiveTrueOrderByIsDefaultDesc(userId);
    }
}
