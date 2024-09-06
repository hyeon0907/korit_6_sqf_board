/** @jsxImportSource @emotion/react */
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../../apis/util/instance";
import { css } from "@emotion/react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const layout = css`
    box-sizing: border-box;
    margin: 50px auto 0px;
    width: 1100px;
`;

const header = css`
    box-sizing: border-box;
    border: 1px solid #dbdbdb;
    padding: 10px 15px;
    & > h1 {
        margin: 0;
        margin-bottom: 15px;
        font-size: 38px;
        cursor: default;
    }
`;

const titleAndLike = css`
    display: flex;
    justify-content: space-between;
    align-items: center;

    & button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        background-color: #ffffff;
        cursor: pointer;

        & > svg {
            font-size: 30px;
        }
    }
`;

const boardInfoContainer = css`
    display: flex;
    justify-content: space-between;

    & span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 600;
        cursor: default;
    }

    & button {
        box-sizing: border-box;
        margin-left: 5px;
        border: 1px solid #dbdbdb;
        padding: 5px 20px;
        background-color: white;
        font-size: 12px;
        font-weight: 600;
        color: #333333;
        cursor: pointer;
        &:hover {
            background-color: #fafafa;
        }
        &:active {
            background-color: #eeeeee;
        }
    }
`;

const contentBox = css`
    box-sizing: border-box;
    margin-top: 5px;
    border: 1px solid #dbdbdb;
    padding: 0px 15px;
    & img:not(img[width]) {
        width: 100%;
    }
`;

const navigationButtons = css`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    & button {
        border: 1px solid #dbdbdb;
        background-color: #ffffff;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        &:disabled {
            color: #aaa;
            cursor: not-allowed;
        }
    }
`;

function DetailPage() {
    const navigate = useNavigate();
    const params = useParams();
    const boardId = parseInt(params.boardId, 10);
    const queryClient = useQueryClient();
    const userInfoData = queryClient.getQueryData("userInfoQuery");

    const board = useQuery(
        ["boardQuery", boardId],
        async () => {
            return instance.get(`/board/${boardId}`);
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    const boardLike = useQuery(
        ["boardLikeQuery", boardId],
        async () => {
            return instance.get(`/board/${boardId}/like`);
        },
        {
            refetchOnWindowFocus: false,
            retry: 0,
        }
    );

    const likeMutation = useMutation(
        async () => {
            return await instance.post(`/board/${boardId}/like`);
        },
        {
            onSuccess: () => {
                boardLike.refetch();
            }
        }
    );

    const dislikeMutation = useMutation(
        async () => {
            return await instance.delete(`/board/like/${boardLike.data?.data.boardLikeId}`);
        },
        {
            onSuccess: () => {
                boardLike.refetch();
            }
        }
    );

    const handleLikeOnClick = () => {
        if (!userInfoData?.data) {
            if (window.confirm("로그인 후 이용 가능합니다. 로그인 페이지로 이동하시겠습니까?")) {
                navigate("/user/login");
            }
            return;
        }
        likeMutation.mutateAsync();
    };

    const handleDislikeOnClick = () => {
        dislikeMutation.mutateAsync();
    };

    const handlePrevious = () => {
        if (boardId > 1) {
            navigate(`/board/detail/${boardId - 1}`);
        }
    };

    const handleNext = () => {
        navigate(`/board/detail/${boardId + 1}`);
    };

    return (
        <div css={layout}>
            <Link to={"/"}><h1>사이트 로고</h1></Link>
            {
                board.isLoading && <p>로딩 중...</p>
            }
            {
                board.isError && <h1>{board.error.response.data}</h1>
            }
            {
                board.isSuccess &&
                <>
                    <div css={header}>
                        <div css={titleAndLike}>
                            <h1>{board.data.data.title}</h1>
                            <div>
                                {
                                    !!boardLike?.data?.data?.boardLikeId
                                        ?
                                        <button onClick={handleDislikeOnClick}>
                                            <IoMdHeart />
                                        </button>
                                        :
                                        <button onClick={handleLikeOnClick}>
                                            <IoMdHeartEmpty />
                                        </button>
                                }
                            </div>
                        </div>
                        <div css={boardInfoContainer}>
                            <div>
                                <span>
                                    작성자: {board.data.data.writerUsername}
                                </span>
                                <span>
                                    조회: {board.data.data.viewCount}
                                </span>
                                <span>
                                    추천: {boardLike?.data?.data.likeCount}
                                </span>
                            </div>
                            <div>
                                {
                                    board.data.data.writerId === userInfoData?.data.userId &&
                                    <>
                                        <button>수정</button>
                                        <button>삭제</button>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div css={contentBox} dangerouslySetInnerHTML={{
                        __html: board.data.data.content
                    }}></div>
                    <div css={navigationButtons}>
                        <button onClick={handlePrevious} disabled={boardId <= 1}>
                            <FaArrowLeft /> 이전
                        </button>
                        <button onClick={handleNext}>
                            다음 <FaArrowRight />
                        </button>
                    </div>
                </>
            }
        </div>
    );
}

export default DetailPage;
