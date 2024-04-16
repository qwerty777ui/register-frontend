import React, { useState } from "react";
import "../Styles/message.css"
import Arrow from "../svg/arrow_up.svg?react";
import { Button } from "react-bootstrap";

const Message = ({application}) => {
    const [active, setActive] = useState(true)
    return(
        <div className={active ? 'mes active' : 'mes'} active={active} setactive = {setActive}>
            <div className="mes-header">

                <div className="mes-head-wrap">

                <div className="mes-info">

                    <div className="mes-heading">
                        <p>{
                            `${application.last_name} ${application.first_name} ${application.middle_name}`
                        }</p>
                    </div>
                    <div className="mes-date">
                        <p>{application.created_at}</p>
                    </div>

                </div>

                </div>


                <div className="arrow" onClick={() => setActive(!active)}>
                <Arrow/>
                </div>

            </div>
            <div className="mes-body">
                <p>City: {application.city}</p>
                <p>Region: {application.region}</p>
                <p>Mahalla: {application.district}</p>
                <p>Address: {application.address}</p>
                <p>Employer: {application.is_entrepreneur ? 'Yes' : 'No'}</p>
                <p>Status: {application.status}</p>
                <p>Email: {application.email}</p>
                <p>{application.message}</p>

                <div className="d-flex justify-content-end mt-4">
                    <Button className="me-2">
                        Деактивировать
                    </Button>
                    <Button variant="danger">Удалить</Button>
                </div>
            </div>
        </div>
    )
}

export default Message;