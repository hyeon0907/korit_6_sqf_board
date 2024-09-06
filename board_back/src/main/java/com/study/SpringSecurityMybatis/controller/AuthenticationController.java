package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.aspect.annotation.ValidAop;
import com.study.SpringSecurityMybatis.dto.request.*;
import com.study.SpringSecurityMybatis.dto.response.RespSignupDto;
import com.study.SpringSecurityMybatis.entity.OAuth2User;
import com.study.SpringSecurityMybatis.exception.AccessTokenValidException;
import com.study.SpringSecurityMybatis.exception.SignupException;
import com.study.SpringSecurityMybatis.service.BoardService;
import com.study.SpringSecurityMybatis.service.OAuth2Service;
import com.study.SpringSecurityMybatis.service.TokenService;
import com.study.SpringSecurityMybatis.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@Slf4j
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private OAuth2Service oAuth2Service;

    @Autowired
    private BoardService boardService;

    @ValidAop
    @PostMapping("/auth/signup")

    public ResponseEntity<?> signup(@Valid @RequestBody ReqSignupDto dto, BindingResult bindingResult) throws SignupException {
        return ResponseEntity.ok().body(userService.insertUserAndUserRoles(dto));
    }

    @Autowired
    private TokenService tokenService;

    @ValidAop
    @PostMapping("/auth/signin")
    public ResponseEntity<?> signin(@Valid @RequestBody ReqSigninDto dto, BindingResult bindingResult) {
        return ResponseEntity.ok().body(userService.getGeneratedAccessToken(dto));
    }

    @ValidAop
    @PostMapping("/auth/oauth2/merge")
    public ResponseEntity<?> oAuth2Merge(@Valid @RequestBody ReqAuth2MergeDto dto, BindingResult bindingResult){
        OAuth2User oAuth2User = userService.mergeSignin(dto);
        oAuth2Service.merge(oAuth2User);
        return ResponseEntity.ok().body(true);
    }

    @ValidAop
    @PostMapping("auth/oauth2/join")
    public ResponseEntity<?> oAuth2Join(@Valid @RequestBody ReqAuth2JoinDto dto, BindingResult bindingResult) throws SignupException {
        RespSignupDto dtos = userService.insertUserAndUserRoles(dto.toEntity());
        oAuth2Service.signin(dto, dtos.getUser().getId());
        return ResponseEntity.ok().body(true);
    }

    @GetMapping("/auth/access")
    public ResponseEntity<?> access(ReqAccessDto dto) throws AccessTokenValidException {
        return ResponseEntity.ok().body(tokenService.isValidAccessToken(dto.getAccessToken()));
    }

    @ValidAop
    @PostMapping("/auth/board")
    public ResponseEntity<?> board(@Valid @RequestBody ReqWriteBoardDto dto, BindingResult bindingResult){
        log.info("{}", dto);
        return ResponseEntity.ok().body(boardService.write(dto));
    }
}
