package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Board;
import lombok.Data;

@Data
public class ReqWriteBoardDto {
    private String title;
    private String content;

    public Board toEntity(Long id){
        return Board.builder()
                .title(title)
                .content(content)
                .userId(id)
                .build();
    }
}
