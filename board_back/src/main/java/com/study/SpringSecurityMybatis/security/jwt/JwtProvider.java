package com.study.SpringSecurityMybatis.security.jwt;

import com.study.SpringSecurityMybatis.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@Slf4j
public class JwtProvider {

    private final Key key;

    // Key 값 만드는 작업
    public JwtProvider(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    // 완료시간 리턴하기
    public Date getExpireDate() {
        return new Date(new Date().getTime() + (1000l * 60 * 60 * 24 * 30)); // 1000l * 60 * 60 : 한시간
    }

    // 토큰 만드는 작업
    public String generateAccessToken(User user) {
        return Jwts.builder()
                .claim("userId", user.getId())
                .expiration(getExpireDate()) // 완료시간
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String removeBearer(String bearerToken){
        if(bearerToken == null){
            throw new RuntimeException();
        }
        int bearerLength = "bearer ".length();
        return bearerToken.substring(bearerLength);
    }

    public Claims getClaims(String token){
        JwtParser jwtParser = Jwts.parser()
                .setSigningKey(key)
                .build();
        return jwtParser.parseClaimsJws(token).getPayload();
    }
}
