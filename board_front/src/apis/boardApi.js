import { instance } from "./util/instance"

export const boardApi = async (data) => {
    
    let BoardData = {
        isSuceess: false,
        ok: "",
        defaultMessage: "",
    }
    try {
        const response = await instance.post("/auth/board", data);
        BoardData = {
            isSuceess: true,
            boardId: response.data,
        }
    } catch (error) {
        const response = error.response;
        BoardData = {
            isSuceess: false,
            defaultMessage: response.status === 404? response.data: response.data.map(fieldError => fieldError.defaultMessage),
        }
        
    }

    return BoardData;
}