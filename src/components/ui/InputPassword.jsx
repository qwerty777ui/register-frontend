import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import Input from "@/components/ui/Input.jsx";

const InputPassword = (props) => {
    const { register, errors, isLoading, id } = props;
    const [show, setShow] = useState(false);
    const toggle = (e) => {
        e.preventDefault();
        setShow(!show)
    };

    return (
        <div className="input-password">
            <Input
                label="Password"
                id={id}
                register={register}
                Icon={FaLock}
                disabled={isLoading}
                placeholder="Пароль"
                errors={errors}
                type={show ? "text" : "password"}
                append={(
                    <button
                        className="btn"
                        autoFocus={false}
                        onClick={toggle}
                    >
                        {show ? <FaEyeSlash/> : <FaEye/>}
                    </button>
                )}
                onKeyPress={props.onKeyPress ? (e) => props.onKeyPress(e) : undefined}
            />
        </div>
    );
}

export default InputPassword;