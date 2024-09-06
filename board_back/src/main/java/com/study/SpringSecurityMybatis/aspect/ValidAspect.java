package com.study.SpringSecurityMybatis.aspect;

import com.study.SpringSecurityMybatis.dto.request.ReqAuth2JoinDto;
import com.study.SpringSecurityMybatis.dto.request.ReqSignupDto;
import com.study.SpringSecurityMybatis.dto.request.ReqWriteBoardDto;
import com.study.SpringSecurityMybatis.exception.ValidException;
import com.study.SpringSecurityMybatis.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;

@Aspect
@Component
@Slf4j
public class ValidAspect {

    @Autowired
    private UserService userService;

    @Pointcut("@annotation(com.study.SpringSecurityMybatis.aspect.annotation.ValidAop)")
    public void pointCut() {};

    @Around("pointCut()")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object[] args = proceedingJoinPoint.getArgs();
        BeanPropertyBindingResult bindingResult = null;

        for(Object arg : args) {
            if(arg.getClass() == BeanPropertyBindingResult.class) {
                bindingResult = (BeanPropertyBindingResult) arg;
                break;
            }
        }

        switch (proceedingJoinPoint.getSignature().getName()) {
            case "signup":
                validSignupDto(args, bindingResult);
                break;
            case "oAuth2Join":
                validOAuth2SignupDto(args, bindingResult);
                break;
            case "board":
                ValidationCheck(args, bindingResult);
                break;
        }

        if(bindingResult.hasErrors()) {
            throw new ValidException("유효성 검사 오류", bindingResult.getFieldErrors());
        }

        return proceedingJoinPoint.proceed();
    }

    private void validSignupDto(Object[] args, BeanPropertyBindingResult bindingResult) {
        for(Object arg : args) {
            if(arg.getClass() == ReqSignupDto.class) {
                ReqSignupDto dto = (ReqSignupDto) arg;
                if(!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError = new FieldError("checkPassword", "checkPassword", "비밀번호가 일치하지 않습니다.");
                    bindingResult.addError(fieldError);
                }
                if(userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError = new FieldError("username", "username", "이미 존재하는 사용자 이름 입니다.");
                    bindingResult.addError(fieldError);
                }
                break;
            }
        }
    }

    private void validOAuth2SignupDto(Object[] args, BeanPropertyBindingResult bindingResult) {
        for(Object arg : args) {
            if (arg.getClass() == ReqAuth2JoinDto.class) {
                ReqAuth2JoinDto dto = (ReqAuth2JoinDto) arg;
                if (!dto.getPassword().equals(dto.getCheckPassword())) {
                    FieldError fieldError = new FieldError("checkPassword", "checkPassword", "비밀번호가 일치하지 않습니다.");
                    bindingResult.addError(fieldError);
                }
                if (userService.isDuplicateUsername(dto.getUsername())) {
                    FieldError fieldError = new FieldError("username", "username", "이미 존재하는 사용자 이름 입니다.");
                    bindingResult.addError(fieldError);
                }
                break;
            }
        }
    }

    private void ValidationCheck(Object[] args, BeanPropertyBindingResult bindingResult) {
        for(Object arg : args) {
            if (arg.getClass() == ReqWriteBoardDto.class) {
                ReqWriteBoardDto dto = (ReqWriteBoardDto) arg;
                if (dto.getTitle().isBlank() || dto.getContent().isBlank()) {
                    log.info("{}", dto);
                    FieldError fieldError = new FieldError("blank", "blank", "제목이나 내용이 빈칸입니다.");
                    bindingResult.addError(fieldError);
                }
                break;
            }
        }
    }
}
