import "../Styles/MessageForm.css";
import CategoryChose from "../components/CategoryChose.jsx";
import { formatDate } from "../utils/helper.js";

export default function MessageForm({ backToMain, formState, submit }) {

    const region = [
        { value: "Сергели", label: "Сергели" },
        { value: "Новза", label: "Новза" },
        { value: "Юнусабад", label: "Юнусабад" },
        { value: "Мирабад", label: "Мирабад" },
        { value: "Чиланзар", label: "Чиланзар" },
    ];
    const city = [
        { value: "Ташкент", label: "Ташкент" },
        { value: "Навои", label: "Навои" },
        { value: "Самарканд", label: "Самарканд" },
        { value: "Бухара", label: "Бухара" },
    ];
    const status = [
        { value: "Активный", label: "Активный" },
        { value: "Неактивный", label: "Неактивный" },
    ];

    return (
        <div className="mesForm-wrap">

            <form
                action=""
                className="mesForm-Form"
            >

                <div className="mesForm-container">

                    <div className="mesForm-1row">

                        <div className="mesForm-item">
                            <label htmlFor="name">Имя</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Name"
                                { ...formState.register('first_name') }
                            />
                        </div>

                        <div className="mesForm-item">
                            <label htmlFor="secondname">Фамилия</label>
                            <input
                                type="text"
                                id="secondname"
                                placeholder="Second Name"
                                { ...formState.register('last_name') }
                            />
                        </div>

                        <div className="mesForm-item">
                            <label htmlFor="surname">Отчество</label>
                            <input
                                type="text"
                                id="surname"
                                placeholder="Surname"
                                { ...formState.register('middle_name') }
                            />
                        </div>

                        <div className="mesForm-item">
                            <label htmlFor="region">Регион</label>
                            <CategoryChose
                                isMulti
                                options={ region }
                                setValue={(value) => formState.setValue('region', value)}
                            />
                        </div>

                        <div className="mesForm-item">
                            <label>Город</label>
                            <CategoryChose
                                isMulti
                                options={ city }
                                setValue={(value) => formState.setValue('city', value)}
                            />
                        </div>

                        <div className="mesForm-item">
                            <label htmlFor="mahalla">Махалля</label>
                            <input
                                type="text"
                                id="mahalla"
                                { ...formState.register('district') }
                            />
                        </div>

                        <div className="mesForm-item">
                            <label htmlFor="adress">Адрес</label>
                            <input
                                type="text"
                                id="adress"
                                { ...formState.register('address') }
                            />
                        </div>

                        <div className="mesForm-item">
                            <label>Пол</label>
                            <div>
                                <input
                                    type="radio"
                                    name="sex"
                                    id="female"
                                    value="female"
                                    {...formState.register('gender')}
                                />
                                <label htmlFor="female">Женшина</label>
                                <input
                                    type="radio"
                                    name="sex"
                                    id="male"
                                    value="male"
                                    {...formState.register('gender')}
                                />
                                <label htmlFor="male">Мужчина</label>
                            </div>
                        </div>

                        <div className="mesForm-item">
                            <label htmlFor="dateOfBirth">Дата Рождения</label>
                            <input
                                type="text"
                                id="data"
                                placeholder="день | месяц | год"
                                { ...formState.register("birth_date", {
                                    onChange: (e) => formState.setValue('birth_date', formatDate(e.target.value))
                                })
                                }
                                maxLength="10"
                            />

                        </div>

                        <div className="mesForm-2row">

                            <div className="mesForm-item">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    { ...formState.register('email') }
                                />
                            </div>

                            <div className="mesForm-item">
                                <label htmlFor="status">Статус</label>
                                <CategoryChose
                                    isMulti
                                    options={ status }
                                    setValue={(value) => formState.setValue('status', value)}
                                />
                            </div>

                            <div className="mesForm-item">
                                <label>Открытость Сообщений</label>
                                <div>
                                    <input
                                        type="radio"
                                        name="openMessage"
                                        id="yes"
                                        value="true"
                                        {...formState.register('is_private')}
                                    />
                                    <label htmlFor="yes">Да</label>
                                    <input
                                        type="radio"
                                        name="openMessage"
                                        id="no"
                                        value="false"
                                        {...formState.register('is_private')}
                                    />
                                    <label htmlFor="no">Нет</label>
                                </div>
                            </div>

                            <div className="mesForm-item">
                                <label htmlFor="employer">Предприниматель</label>
                                <input
                                    type="checkbox"
                                    id="employer"
                                    {...formState.register('is_entrepreneur')}
                                />
                                <label htmlFor="employer">Представляться как субъект предпринимательства, <br/>
                                    если Вы действительно отправляете обращение в <br/>
                                    качестве субъекта предпринимательства</label>
                            </div>

                            <div>
                                <input
                                    type="button"
                                    value="Загрузить файл"
                                    className="downloadButton"
                                    id="downBut"
                                />
                                <label
                                    htmlFor="downBut"
                                    className="downBut-label"
                                >
                                    Размер одного файла не должен превышать 10мб в количестве 10 файлов
                                </label>
                            </div>


                        </div>

                    </div>

                </div>

                <div className="textArea">
                    <p>Текст Обращения</p>
                    <textarea
                        rows=""
                        cols=""
                        className="mesFrom-textarea"
                        {...formState.register('message')}
                    />
                </div>

                <div className="bottomContent">

                    <div>
                        <input
                            type="checkbox"
                            id="policy"
                        />
                        <label htmlFor="policy">Я принимаю <a>правила</a> отправки сообщений</label>
                    </div>

                    <input
                        type="reset"
                        value="Назад"
                        onClick={ () => backToMain() }
                    />

                    <input
                        type="submit"
                        onClick={formState.handleSubmit((data) => submit(data))}
                    />

                </div>
            </form>

        </div>
    )
}