package com.study.SpringSecurityMybatis.dto.request;

import com.study.SpringSecurityMybatis.entity.Board;
import lombok.Data;

@Data
public class ReqModifyBoardDto {
    private String title;
    private String content;

    public Board toEntity(Long boardId){
        return Board.builder()
                .id(boardId)
                .title(title)
                .content(content)
                .build();
    }
}
