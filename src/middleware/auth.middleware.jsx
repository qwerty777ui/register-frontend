import { useCallback, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken.js";
import { useNavigate } from "react-router-dom";
import useStateContext from "@/hooks/useStateContext.jsx";
import { useQuery } from "@tanstack/react-query";
import appAxios from "@/utils/axios.js";
import { ACTIONS } from "@/utils/constants.js";
import { toast } from "react-toastify";
import FullScreenLoader from "@/components/ui/FullScreenLoader.jsx";

const AuthMiddleware = ({children}) => {
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const {state, dispatch} = useStateContext();

    useEffect(() => {
        refresh()
            .then((data) => {
                if(!data) {
                    navigate(`/auth/login?next=${location.pathname !== '/access-denied' ? location.pathname : '/'}`);
                }
            })
            .catch(() => {
                navigate('/auth/login')
            });
    }, []);

    const {data, error, isError, isFetching} = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const { data } = await appAxios.get('/users/me');
            return data;
        },
        enabled: !!state.access_token,
        staleTime: 0,
        cacheTime: 0,
        select: ({ data }) => data.user,
    });

    useEffect(() => {
        if (data) {
            dispatch({type: ACTIONS.SET_USER, payload: data});
        }
    }, [data]);

    useEffect(() => {
        if(!state.access_token) {
            navigate('auth/login')
        }
    }, [state.access_token]);

    useEffect(() => {
        if (isError) {
            toast.error((error).response?.data.message || (error).message);
        }
    }, [dispatch, error, isError, location.pathname, navigate]);

    if (isFetching) {
        return <FullScreenLoader/>;
    }

    return children;
}

export default AuthMiddleware;