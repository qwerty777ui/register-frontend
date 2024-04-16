import { useState, useCallback, useEffect } from "react"
import "../Styles/SendMessage.css"
import CheckMessage from "../components/CheckMessage";
import Instructions from "../components/Inst"
import Instructions2 from "../components/inst2"
import CheckMark from "../svg/check-mark-svgrepo-com.svg?react"
import Capcha from "../components/Capcha.jsx";
import MessageForm from "./MessageForm.jsx";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { formatDate } from "../utils/helper.js";
import appAxios from "../utils/axios.js";
import useStateContext from "@/hooks/useStateContext.jsx";

export default function SendMessage() {
    const {state} = useStateContext();
    const [isFirstStep, setIsFirstStep] = useState(true);
    const [isFirstStepCaptchaCorrect, setIsFirstStepCaptchaCorrect] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    useEffect(() => {
        if(state.authUser) {
            setValue('document_serial', state.authUser.student.passport_number.slice(0, 2));
            setValue('document_number', state.authUser.student.passport_number.slice(2));
            setValue('birth_date', state.authUser.student.birth_date);
            setValue('first_name', state.authUser.student.first_name);
            setValue('last_name', state.authUser.student.last_name);
            setValue('middle_name', state.authUser.student.middle_name);
            setValue('gender', state.authUser.student.gender);
            setValue('email', state.authUser.student.email);
        }
    }, [state]);

    const onSubmitFirstStep = (data) => {
        if(
            !data.document_type ||
            !data.document_serial ||
            !data.document_number ||
            !data.birth_date
        ) {
            return toast.error("Заполните все поля!")
        }
        if(!isFirstStepCaptchaCorrect) return toast.error("Неверный ответ на пример!");

        setIsFirstStep(false);
    }

    const backToMain = useCallback(() => {
        setIsFirstStep(true);
        setIsFirstStepCaptchaCorrect(false);
    }, []);

    function SuccessDialog ({id, check_code}) {
        return <div>Ваше обращение успешно отправлено! <br/> Номер обращения: <strong>{id}</strong> <br/> Код проверки обращения: <strong>{check_code}</strong></div>
    }

    const onSubmitSecondStep = async (data) => {
        const response = await appAxios.post('/applications', data);

        toast.success(<SuccessDialog id={response.data.data.id} check_code={response.data.data.check_code}/>, {
            draggable: false,
            autoClose: false,
            closeOnClick: false,
        })
    }

    return (

        <div className="mes-wrap">
            {
                isFirstStep ? (
                    <>
                        <p className="header-wrap">Способ отправки сообщенинй</p>

                        <div className="mes-container">

                            <div className="instructions-header">
                                <Instructions color="#0095F6"/>
                                <Instructions color="green"/>
                                <Instructions2/>
                            </div>

                            <div className="body">

                                <div className="text">

                                    <p className="blueHeader">Просим ввести данные, удостоверяющие <br/>
                                        Вашу личность</p>

                                    <p className="redHeader">Введенная персональная информация не будет разглашена и
                                        распространена
                                        третьим лицам!</p>

                                    <p className="paragraphHeader">Введенние данных, удостоверяющих личность
                                        представляет следующие
                                        удобства:</p>

                                    <div>
                                        <CheckMark/>
                                        <p>часть формы отправки обращения будет заполнена автоматически</p>
                                    </div>

                                    <div>
                                        <CheckMark/>
                                        <p>отправленное обращение будет сохраненно на Ваше имя и будет доступно в любое
                                            время при
                                            входе в систему через сервис id.egov.uz</p>
                                    </div>

                                    <div>
                                        <CheckMark/>
                                        <p>предотвращаются случаи необоснованного оставления отобращения без
                                            разсмотрения</p>
                                    </div>

                                </div>

                                <form
                                    className="form"
                                    onSubmit={handleSubmit(onSubmitFirstStep)}
                                >
                                    <header>Данные документа, удостоверяющего личность*:</header>

                                    <div className="radioButton">
                                        <input
                                            type="radio"
                                            id="option1"
                                            name="document_type"
                                            value="passport"
                                            {...register('document_type')}
                                            checked={true}
                                        />
                                        <label htmlFor="option1">Паспорт, ID-карта и загранпаспорт гражданина</label>
                                    </div>

                                    <div className="radioButton">
                                        <input
                                            type="radio"
                                            id="option2"
                                            name="document_type"
                                            value="birthday_certificate"
                                            {...register('document_type')}
                                        />
                                        <label htmlFor="option2">Свидетельство о рождении</label>
                                    </div>

                                    <div>
                                        <label htmlFor="seria">Серия</label>
                                        <input
                                            type="text"
                                            id="seria"
                                            { ...register("document_serial", {
                                                onChange: (e) => setValue('document_serial',
                                                    e.target.value.match(/^[A-Za-z]+$/g) ? e.target.value.toUpperCase() : ''
                                                )
                                            }) }
                                        />

                                        <label htmlFor="nomer">Номер</label>
                                        <input
                                            type="text"
                                            id="Nomer"
                                            { ...register("document_number") }
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="data">Дата рождения</label>
                                        <input
                                            type="text"
                                            id="data"
                                            placeholder="день | месяц | год"
                                            { ...register("birth_date", {
                                                onChange: (e) => setValue('birth_date', formatDate(e.target.value))
                                            })
                                            }
                                            maxLength="10"
                                        />
                                    </div>

                                    <Capcha onValidateCaptcha={(result) => setIsFirstStepCaptchaCorrect(result)}/>

                                    <input
                                        type="submit"
                                        value="Отправить"
                                    />

                                </form>


                            </div>

                            <CheckMessage/>

                        </div>
                    </>
                ) : (
                    <MessageForm
                        backToMain={() => backToMain()}
                        formState={{ errors, register, handleSubmit, setValue }}
                        submit={(data) => onSubmitSecondStep(data)}
                    />
                )
            }


        </div>
    )
}