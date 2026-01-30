package com.wezeep.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import java.util.function.Function;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long jwtExpiration;
    private final long refreshExpiration;

    public JwtTokenProvider(
            @Value("${wezeep.security.jwt.secret}") String secret,
            @Value("${wezeep.security.jwt.expiration}") long jwtExpiration,
            @Value("${wezeep.security.jwt.refresh-expiration}") long refreshExpiration) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpiration = jwtExpiration;
        this.refreshExpiration = refreshExpiration;
    }

    public String generateToken(UUID userId, String email) {
        return generateToken(userId, email, jwtExpiration);
    }

    public String generateRefreshToken(UUID userId, String email) {
        return generateToken(userId, email, refreshExpiration);
    }

    private String generateToken(UUID userId, String email, long expiration) {
        Instant now = Instant.now();
        Instant expiryDate = now.plusMillis(expiration);

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiryDate))
                .signWith(secretKey)
                .compact();
    }

    public UUID getUserIdFromToken(String token) {
        return UUID.fromString(getClaimFromToken(token, Claims::getSubject));
    }

    public String getEmailFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("email", String.class));
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public Boolean validateToken(String token, UUID userId) {
        final UUID tokenUserId = getUserIdFromToken(token);
        return (tokenUserId.equals(userId) && !isTokenExpired(token));
    }
}
