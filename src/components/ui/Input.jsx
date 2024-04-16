import classNames from "classnames";
import { useRef } from "react";

const Input = ({
    label,
    id,
    type = "text",
    placeholder,
    required = true,
    disabled = false,
    Icon,
    errors,
    className,
    value,
    maxLength = 128,
    register,
    append,
    onKeyPress,
}) => {
    const appendRef = useRef(null);

    return (
        <div className="input-group mb-3">
            <div className="d-flex w-100">
                { Icon ? <span className="input-group-text"><Icon/></span> : "" }
                <input
                    type={ type }
                    className={ classNames("form-control", className, {
                        "is-invalid": errors[id],
                    }) }
                    placeholder={ placeholder }
                    aria-label={ label }
                    id={ id }
                    { ...register(id, { required, maxLength }) }
                    required={ required }
                    disabled={ disabled }
                    value={ value }
                    style={{ paddingRight: appendRef ? `${appendRef.current?.offsetWidth}px` : "" }}
                    onKeyPress={(e) => {onKeyPress ? onKeyPress(e) : e.key === "Enter" && e.preventDefault()}}
                />
                { append && <div ref={appendRef} className="position-absolute end-0 top-50 translate-middle-y">
                    { append }
                </div> }
            </div>
            { errors[id] && (
                <div className="invalid-feedback">
                    { errors[id]?.message }
                </div>
            ) }
        </div>
    );
};

export default Input;