import { instance } from "./util/instance";

export const oauth2MergeApi = async (data) => {
    let mergeData = {
        isSuceess: false,
        fieldErrors: [
            {
                field: "",
                defaultMessage: ""
            }
        ]
    }
    try {
        const response = await instance.post("/auth/oauth2/merge", data);
        mergeData = {
            isSuceess: true,
        }
    } catch (error) {
        const response = error.response;
        
        mergeData = {
            isSuceess: false,
        }

        if(typeof(response.data) === 'string') {
            mergeData['errorStatus'] = "loginError";
            mergeData['error'] = response.data;
        }else {
            mergeData['errorStatus'] = "fieldError";
            mergeData['error'] = response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            }));
        }
    }

    return mergeData;
};

export const oauth2JoinApi = async (data) => {
    let joinData = {
        isSuceess: false,
        fieldErrors: [
            {
                field: "",
                defaultMessage: ""
            }
        ]
    }
    try {
        const response = await instance.post("/auth/oauth2/join", data);
        joinData = {
            isSuceess: true,
        }
    } catch (error) {
        const response = error.response;
        joinData = {
            isSuceess: false,
            fieldErrors: response.data.map(fieldError => ({
                field: fieldError.field, 
                defaultMessage: fieldError.defaultMessage
            })),
        }
    }

    return joinData;
};