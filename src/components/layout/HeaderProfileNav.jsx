import { Dropdown, Nav, NavItem } from 'react-bootstrap'
import {
    FaPowerOff,
} from 'react-icons/fa6'

import { useNavigate } from "react-router-dom";
import useStateContext from "@/hooks/useStateContext.jsx";
import { useMutation } from "@tanstack/react-query";
import appAxios from "@/utils/axios.js";


export default function HeaderProfileNav() {
    const navigate = useNavigate()
    const { state: { authUser }, dispatch } = useStateContext()

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            await appAxios.get('/auth/logout')
        },
        onSuccess: () => {
            dispatch({ type: 'LOGOUT', payload: null })
            navigate("/")
        }
    })

    return (
        <Nav>
            <Dropdown
                as={ NavItem }
                id='0'
            >
                <Dropdown.Toggle
                    variant="outline-primary"
                    className="py-2 px-3 rounded-5"
                    id="dropdown-profile"
                >
                    { authUser?.username }
                </Dropdown.Toggle>
                <Dropdown.Menu className="pt-1">
                    <Dropdown.Item onClick={ () => logout() }>
                        <FaPowerOff className="me-2"/>Выйти
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Nav>
    )
}
