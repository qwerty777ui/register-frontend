import useStateContext from "@/hooks/useStateContext";
import {ACTIONS} from "../utils/constants.js";
import appAxios from "../utils/axios.js";


const useRefreshToken = () => {
    const {dispatch} = useStateContext();

    return async () => {
        const response = await appAxios.get('/auth/refresh');
        dispatch({
            type: ACTIONS.SET_ACCESS_TOKEN,
            payload: response.data.access_token
        })
        return response.data.access_token
    };
};

export default useRefreshToken;
