import Capcha from "./Capcha";
import "../Styles/CheckMessage.css"

export default function CheckMessage() {
    return(
        <div className="checkMes-wrap">
            <div className="checkMes-container">

                <h2>Проверить состояние обращений</h2>

                <form action="" className="checkMes-form">

                <label htmlFor="admissionNumber">Номер обращениня</label>
                <input type="text" id="admissionNumber"/>

                <label htmlFor="checkCode">Код проверки состояния</label>
                <input type="text" id="checkCode"/>

                <Capcha/>

                <input type="submit" value="Проверить"/>

                </form>
            </div>
        </div>
    )
}