import "../Styles/Capcha.css"
import { useState } from "react";

export default function Capcha({onValidateCaptcha}) {
    const [num1] = useState(Math.floor(Math.random() * 10));
    const [num2] = useState(Math.floor(Math.random() * 10));

    const handleChange = (event) => {
        onValidateCaptcha((num1 + num2) === +event.target.value);
    };

    return(
        <div className="capcha">
            <label>Введите ответ примера на картинке</label>
            {num1} + {num2} =
            <input type="text" onChange={handleChange} />
        </div>
    )
}