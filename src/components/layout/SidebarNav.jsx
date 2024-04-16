import { FaChevronUp } from 'react-icons/fa6'
import { useContext, useEffect, useState } from 'react'
import { Accordion, AccordionContext, Nav } from 'react-bootstrap'
import { useAccordionButton } from 'react-bootstrap/AccordionButton'
import classNames from 'classnames'
import { Link, useLocation } from "react-router-dom";

const SidebarNavItem = (props) => {
    const {
        Icon,
        children,
        href,
        current,
        show = false,
    } = props

    return show && (
        <Nav.Item>
            <Link
                to={ href }
                className={ classNames("nav-link py-2 d-flex align-items-center", {
                    "active": current === href,
                }) }
            >
                { Icon ? <Icon className="nav-icon"/>
                    : <span className="nav-icon ms-n3"/> }
                { children }
            </Link>
        </Nav.Item>
    )
}

const SidebarNavTitle = ({ children, show = false }) => {

    return show && (
        <li className="nav-title px-2 py-2 mt-3 text-uppercase fw-bold">{ children }</li>
    )
}

const SidebarNavGroupToggle = (props) => {
    const { activeEventKey } = useContext(AccordionContext)
    const { eventKey, Icon, children, setIsShow, } = props

    const decoratedOnClick = useAccordionButton(eventKey)

    const isCurrentEventKey = activeEventKey === eventKey

    useEffect(() => {
        setIsShow(activeEventKey === eventKey)
    }, [activeEventKey, eventKey, setIsShow])

    return (
        <Nav.Item>
            <Nav.Link
                className={ classNames('d-flex align-items-center py-2 pe-3', {
                    collapsed: !isCurrentEventKey,
                }) }
                onClick={ decoratedOnClick }
            >
                <Icon className="nav-icon"/>
                { children }
                <div className="nav-chevron ms-auto text-end">
                    <FaChevronUp/>
                </div>
            </Nav.Link>
        </Nav.Item>
    )
}

const SidebarNavGroup = (props) => {
    const {
        toggleIcon,
        toggleText,
        show = false,
        children,
    } = props

    const [isShow, setIsShow] = useState(false)

    return show && (
        <Accordion
            as="div"
            bsPrefix="nav-group"
            className={ classNames('nav-group', { show: isShow }) }
        >
            <SidebarNavGroupToggle
                Icon={ toggleIcon }
                eventKey="0"
                setIsShow={ setIsShow }
            >
                { toggleText }
            </SidebarNavGroupToggle>
            <Accordion.Collapse eventKey="0">
                <ul className="nav-group-items list-unstyled ps-4">
                    { children }
                </ul>
            </Accordion.Collapse>
        </Accordion>
    )
}

export default function SidebarNav({ items }) {
    const { pathname } = useLocation();

    return (
        <ul className="list-unstyled pt-2">
            {
                items.length && items.map((item, index) => (
                    item.children && item.children.length ? (
                        <SidebarNavGroup
                            key={ index }
                            toggleIcon={ item.icon }
                            toggleText={ item.title }
                            show={ item.show }
                        >
                            {
                                item.children.map((child, childIndex) => (
                                    <SidebarNavItem
                                        key={ childIndex }
                                        href={ child.href }
                                        Icon={ child.icon }
                                        current={ pathname }
                                        show={ child.show }
                                    >
                                        { child.title }
                                    </SidebarNavItem>
                                ))
                            }
                        </SidebarNavGroup>
                    ) : item.href ? (
                        <SidebarNavItem
                            key={ index }
                            Icon={ item.icon }
                            href={ item.href }
                            current={ pathname }
                            show={ item.show }
                        >
                            { item.title }
                        </SidebarNavItem>
                    ) : (
                        <SidebarNavTitle
                            key={ index }
                            show={ item.show }
                        >
                            { item.title }
                        </SidebarNavTitle>
                    )
                ))
            }
        </ul>
    )
}
