import { css } from '@emotion/react';
import React, { useCallback, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { storage } from '../../../firebase/firebase';
import { CircleLoader } from 'react-spinners';
import { boardApi } from '../../../apis/boardApi';
import { useQueryClient } from 'react-query';

Quill.register('modules/ImageResize', ImageResize);
/** @jsxImportSource @emotion/react */

const layout = css`
    box-sizing: border-box;
    padding-top: 30px;
    margin: 0 auto;
    width: 1100px;
`;

const editorLayout = css`
    box-sizing: border-box;
    margin-bottom: 42px;
    width: 100%;
    height: 700px;
`;

const header = css`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 10px 0px;

    & > h1 {
        margin: 0;
    }

    & > button {
        box-sizing: border-box;
        border: 1px solid #dbdbdb;
        padding: 6px 15px;
        font-size: 12px;
        font-weight: 600;
        background-color: white;
        color: #333;
        cursor: pointer;
        &:hover {
            background-color: #fafafa;
        }
        &:active {
            background-color: #eeeeee;
        }
    }
`;

const loadingLayout = css`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #00000066;
`;

const titleInput = css`
    box-sizing: border-box;
    margin-bottom: 10px;
    border: 1px solid #c0c0c0;
    outline: none;
    padding: 12px 15px;
    width: 100%;
    font-size: 16px;
`;

function WritePage(props) {
    const queryClient = useQueryClient();
    const userInfoState = queryClient.getQueryState("userInfoQuery");
    const [board, setBoard] = useState({
        title: "",
        content: "",
    });
    const quillRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleWriteSubmitOnClick = async () => {
        // Check if the content is empty before sending the request
        if (quillRef.current.getEditor().getText().trim() === "") {
            alert("내용이 비어있습니다. 내용을 입력해주세요.");
            setBoard({
                ...board,
                content: ""
            });
            return;
        }

        const boardData = await boardApi(board);

        if (!boardData.isSuceess) {
            alert(`${boardData.defaultMessage}`);
        } else {
            alert(`${userInfoState.data?.data.name}님 ${boardData.ok}번째 게시물 작성완료!!!`);
        }
        setBoard({
            title: "",
            content: "",
        });
    };

    const handleTitleInputOnChange = (e) => {
        setBoard(board => ({
            ...board,
            [e.target.name]: e.target.value
        }));
    };

    const handleQuillValueOnChange = (value) => {
        setBoard(board => ({
            ...board,
            content: value,
        }));
    };

    const handleImageLoad = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        input.onchange = () => {
            const editor = quillRef.current.getEditor();
            const files = Array.from(input.files);
            const imgFile = files[0];

            const editPoint = editor.getSelection(true);

            const storageRef = ref(storage, `board/img/${uuid()}_${imgFile.name}`);
            const task = uploadBytesResumable(storageRef, imgFile);
            task.on(
                "state_changed",
                () => {},
                () => {},
                async () => {
                    const url = await getDownloadURL(storageRef);
                    editor.insertEmbed(editPoint.index, "image", url);
                    editor.setSelection(editPoint.index + 1);
                    editor.insertText(editPoint.index + 1, "\n");
                    setIsUploading(false);
                },
            );
        }
    }, []);

    const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'color': [] }, { 'background': [] }, { 'align': [] }],          // dropdown with defaults from theme
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        ['link', 'image', 'video', 'formula'],
        ['blockquote', 'code-block'],
    ];

    return (
        <div css={layout}>
            <header css={header}>
                <h1>Quill Edit</h1>
                <button onClick={handleWriteSubmitOnClick}>작성하기</button>
            </header>
            <input
                css={titleInput}
                type="text"
                name='title'
                onChange={handleTitleInputOnChange}
                value={board.title}
                placeholder='게시글의 제목을 입력하세요.'
            />
            <div css={editorLayout}>
                {
                    isUploading &&
                    <div css={loadingLayout}>
                        <CircleLoader />
                    </div>
                }
                <ReactQuill
                    ref={quillRef}
                    style={{
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%"
                    }}
                    onChange={handleQuillValueOnChange}
                    modules={{
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: handleImageLoad,
                            }
                        },
                        ImageResize: {
                            parchment: Quill.import('parchment')
                        },
                    }}
                    value={board.content}
                />
            </div>
            <button onClick={handleWriteSubmitOnClick}>확인</button>
        </div>
    );
}

export default WritePage;
