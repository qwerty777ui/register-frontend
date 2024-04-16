import useStateContext from "@/hooks/useStateContext.jsx";
import { Card } from "react-bootstrap";
import { useMemo } from "react";

const Profile = () => {

    const { state } = useStateContext();

    const student = useMemo(() => {
        return state.authUser?.student;
    }, [state.authUser]);

    return (
        <Card>
            <Card.Header>
                <h3 className="mb-0">{ student?.last_name } { student?.first_name } { student?.middle_name }</h3>
            </Card.Header>
            <Card.Body>
                <p>Идентификатор: <strong>{ student?.identifier }</strong></p>
                <p>Факультет: <strong>{ student?.faculty }</strong></p>
                <p>Группа: <strong>{ student?.group }</strong></p>
                <p>Серия паспорта: <strong>{ student?.passport_number }</strong></p>
                <p className="mb-0">Почта: <strong>{ student?.email }</strong></p>
            </Card.Body>
        </Card>
    );
}

export default Profile;