package com.study.SpringSecurityMybatis.exception;

import java.rmi.AccessException;

public class AccessTokenValidException extends AccessException {
    public AccessTokenValidException(String s) {
        super(s);
    }
}
