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
            ok: response.data,
        }
    } catch (error) {
        const response = error.response;
        console.log(response);
        BoardData = {
            isSuceess: false,
            defaultMessage: response.data.map(fieldError => fieldError.defaultMessage),
        }
    }

    return BoardData;
}