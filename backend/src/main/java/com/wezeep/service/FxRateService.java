package com.wezeep.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FxRateService {

    private final WebClient webClient;
    private final Map<String, BigDecimal> rateCache = new ConcurrentHashMap<>();
    private final Map<String, Long> rateTimestamps = new ConcurrentHashMap<>();
    
    @Value("${wezeep.fintech.fx.api-url}")
    private String fxApiUrl;
    
    @Value("${wezeep.fintech.fx.update-interval-seconds}")
    private long updateIntervalSeconds;
    
    @Value("${wezeep.fintech.fx.rate-change-threshold}")
    private BigDecimal rateChangeThreshold;

    public FxRateService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.exchangerate-api.com")
                .build();
    }

    @Cacheable(value = "exchangeRates", key = "#fromCurrency + '_' + #toCurrency")
    public BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        if (fromCurrency.equals(toCurrency)) {
            return BigDecimal.ONE;
        }

        String cacheKey = fromCurrency + "_" + toCurrency;
        Long lastUpdate = rateTimestamps.get(cacheKey);
        
        if (lastUpdate != null && (System.currentTimeMillis() - lastUpdate) < (updateIntervalSeconds * 1000)) {
            return rateCache.getOrDefault(cacheKey, fetchRateFromApi(fromCurrency, toCurrency));
        }

        return fetchRateFromApi(fromCurrency, toCurrency);
    }

    private BigDecimal fetchRateFromApi(String fromCurrency, String toCurrency) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri("/v4/latest/{base}", fromCurrency)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(5))
                    .block();

            if (response != null && response.containsKey("rates")) {
                @SuppressWarnings("unchecked")
                Map<String, Double> rates = (Map<String, Double>) response.get("rates");
                Double rate = rates.get(toCurrency);
                
                if (rate != null) {
                    BigDecimal exchangeRate = BigDecimal.valueOf(rate).setScale(6, RoundingMode.HALF_UP);
                    String cacheKey = fromCurrency + "_" + toCurrency;
                    rateCache.put(cacheKey, exchangeRate);
                    rateTimestamps.put(cacheKey, System.currentTimeMillis());
                    return exchangeRate;
                }
            }
        } catch (Exception e) {
            // Fallback to cached rate if available
            String cacheKey = fromCurrency + "_" + toCurrency;
            if (rateCache.containsKey(cacheKey)) {
                return rateCache.get(cacheKey);
            }
        }

        // Default fallback rate (1:1)
        return BigDecimal.ONE;
    }

    public boolean hasRateChanged(BigDecimal oldRate, BigDecimal newRate) {
        if (oldRate == null || newRate == null) {
            return false;
        }
        
        BigDecimal change = newRate.subtract(oldRate).abs().divide(oldRate, 4, RoundingMode.HALF_UP);
        return change.compareTo(rateChangeThreshold) > 0;
    }

    @Scheduled(fixedRateString = "${wezeep.fintech.fx.update-interval-seconds:60}000")
    public void refreshRates() {
        // Pre-fetch common currency pairs
        refreshRatePair("USD", "EUR");
        refreshRatePair("USD", "GBP");
        refreshRatePair("USD", "NGN");
        refreshRatePair("USD", "KES");
        refreshRatePair("USD", "GHS");
    }

    private void refreshRatePair(String from, String to) {
        fetchRateFromApi(from, to);
    }
}
