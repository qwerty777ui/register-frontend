import { useCallback, useEffect } from "react";
import {useMutation} from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Input from "@/components/ui/Input.jsx";
import { FaRightToBracket, FaUser } from "react-icons/fa6";
import InputPassword from "@/components/ui/InputPassword.jsx";
import appAxios from "@/utils/axios.js";
import { ACTIONS, MESSAGES } from "@/utils/constants.js";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/Auth.schema.js";
import useStateContext from "@/hooks/useStateContext.jsx";
import useRefreshToken from "@/hooks/useRefreshToken.js";

const LoginPage = () => {
    const {state, dispatch} = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();
    const refresh = useRefreshToken();

    const next = location.search.split('?next=')[1] ?? '/'

    useEffect(() => {
        refresh()
    }, []);

    useEffect( () => {
        if (state.access_token) {
            refresh()
                .then(() => {
                    navigate(next);
                })
        }
    }, [state.access_token, navigate, next]);


    const {
        register,
        setFocus,
        setError,
        reset,
        handleSubmit,
        formState: {isSubmitSuccessful, errors},
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const {mutate: login, isLoading} = useMutation({
        mutationFn: async (user) => {
            const response = await appAxios.post('/auth/login', user);
            return response.data;
        },
        onSuccess: data => {
            dispatch({
                type: ACTIONS.LOGIN,
                payload: data
            })
            navigate(next)
        },
        onError: (error) => {
            if (error.response) {
                if (error.response.data.message === MESSAGES.INVALID_CREDENTIALS) {
                    setError('username', {
                        type: 'custom',
                        message: ''
                    })
                    setError('password', {
                        type: 'custom',
                        message: 'Неверное имя пользователя или пароль'
                    })
                    setTimeout(() => {
                        setFocus('username')
                    }, 100)
                    return
                }
                toast.error(error.response.data.message)
            } else {
                toast.error(error.message === 'Network Error' ? 'Ошибка сети' : error.message)
            }
        }
    });

    useEffect(() => {
        setFocus('username');
    }, [setFocus]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const onKeyPressEnter = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit((data) => login(data))();
        }
    }, [handleSubmit, login]);

    return (
        <div className="auth-layout min-vh-100 d-flex flex-row align-items-center">
            <div
                className="auth-container animate__animated animate__fast animate__fadeIn bg-white shadow p-4 position-relative">
                <Row className="align-items-center">
                    <Col xs={12} md={12} className="p-3">
                        <div className="auth-layout-form">
                            <div className="auth-layout-header mb-4">
                                <h3 className="text-danger">KIUT CABINET</h3>
                                <p className="text-muted">
                                    Войдите в свой аккаунт, чтобы продолжить
                                </p>
                            </div>
                            <Form onSubmit={handleSubmit((data) => login(data))}>
                                <Input
                                    label="Username"
                                    id="username"
                                    register={register}
                                    Icon={FaUser}
                                    disabled={isLoading}
                                    placeholder="Имя пользователя"
                                    errors={errors}
                                />

                                <InputPassword
                                    id={'password'}
                                    register={ register }
                                    errors={ errors }
                                    isLoading={ isLoading }
                                    onKeyPress={ onKeyPressEnter }
                                />

                                <div className="d-grid">
                                    <button className="btn btn-primary text-white" type="submit"
                                            disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Spinner animation="border" variant="white" size="sm" className="me-2"/>
                                                Загрузка...
                                            </>
                                        ) : (
                                            <>
                                                <FaRightToBracket className="me-2"/>
                                                Войти
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default LoginPage;