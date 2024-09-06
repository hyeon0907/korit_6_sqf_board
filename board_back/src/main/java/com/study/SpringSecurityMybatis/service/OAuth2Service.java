package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqAuth2JoinDto;
import com.study.SpringSecurityMybatis.dto.request.ReqAuth2MergeDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSignupDto;
import com.study.SpringSecurityMybatis.dto.response.RespSignupDto;
import com.study.SpringSecurityMybatis.entity.User;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.repository.OAuth2UserMapper;
import com.study.SpringSecurityMybatis.security.handler.OAuth2SuccessHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OAuth2Service implements OAuth2UserService {

    @Autowired
    private DefaultOAuth2UserService defaultOAuth2UserService;

    @Autowired
    private OAuth2UserMapper oAuth2UserMapper;


    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();


        Map<String, Object> oAuth2Attributes = new HashMap<>();
        oAuth2Attributes.put("provider", userRequest.getClientRegistration().getClientName());

        switch (userRequest.getClientRegistration().getClientName()) {
            case "Google":
                oAuth2Attributes.put("id", attributes.get("sub").toString());
                break;
            case "Naver":
                attributes = (Map<String, Object>) attributes.get("response");
                oAuth2Attributes.put("id", attributes.get("id").toString());
                break;
            case "Kakao":
                oAuth2Attributes.put("id", attributes.get("id").toString());
                break;
        }

        return new DefaultOAuth2User(new HashSet<>(), oAuth2Attributes, "id");
    }

    public void merge(com.study.SpringSecurityMybatis.entity.OAuth2User oAuth2User){
        oAuth2UserMapper.save(oAuth2User);
    }

    public void signin(ReqAuth2JoinDto dto, Long id){
        com.study.SpringSecurityMybatis.entity.OAuth2User oAuth2User = com.study.SpringSecurityMybatis.entity.OAuth2User.builder()
                .userId(id)
                .oAuth2Name(dto.getOauth2Name())
                .provider(dto.getProvider())
                .build();
        oAuth2UserMapper.save(oAuth2User);
    }
}
