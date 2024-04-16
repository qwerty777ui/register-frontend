import { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import { Button, Image } from 'react-bootstrap'
import SidebarNav from '@/components/layout/SidebarNav.jsx'
import { FaAngleLeft, FaGauge, FaUserGroup, FaUsers, FaUserTie } from "react-icons/fa6";
import logo from "@/assets/images/white-logo.png";
import logoNarrow from "@/assets/images/white-logo-narrow.png";
import useStateContext from "@/hooks/useStateContext.jsx";

export const Sidebar = ({ isShow, isShowMd }) => {
    const { state: { authUser } } = useStateContext();

    const [isNarrow, setIsNarrow] = useState(false);

    const toggleIsNarrow = () => {
        const newValue = !isNarrow
        localStorage.setItem('isNarrow', newValue ? 'true' : 'false')
        setIsNarrow(newValue)
    }

    // On first time load only
    useEffect(() => {
        if (localStorage.getItem('isNarrow')) {
            setIsNarrow(localStorage.getItem('isNarrow') === 'true')
        }
    }, [setIsNarrow])

    const navItems = useMemo(() => {
        if (!authUser) return [];

        return [
            {
                title: 'Профиль',
                icon: FaUserTie,
                href: '/',
                show: authUser.roles.includes('student'),
            },
            {
                title: 'Заявки',
                icon: FaGauge,
                href: '/',
                show: authUser.roles.includes('admin'),
            },
            {
                title: 'Заявки',
                icon: FaGauge,
                href: '/applications',
                show: authUser.roles.includes('student'),
            },
            {
                title: 'Студенты',
                icon: FaUserGroup,
                href: '/students',
                show: authUser.roles.includes('admin'),
            },
        ]
    }, [authUser])

    return (
        <div
            className={ classNames('sidebar d-flex flex-column position-fixed h-100 shadow', {
                'sidebar-narrow': isNarrow,
                show: isShow,
                'md-hide': !isShowMd,
            }) }
        >
            <div className="sidebar-brand d-none d-md-flex align-items-center justify-content-center shadow">
                <Image
                    src={ logo }
                    className="sidebar-brand-full"
                    alt="KIUT Transfer"
                    height={ 54 }
                />
                <Image
                    src={ logoNarrow }
                    className="sidebar-brand-narrow d-none"
                    alt="KIUT Transfer"
                    height={ 54 }
                />
            </div>

            <div className="sidebar-nav flex-fill">
                <SidebarNav items={ navItems }/>
            </div>

            <Button
                variant="link"
                className="sidebar-toggler d-none d-md-inline-block rounded-0 text-end pe-4 fw-bold shadow-none"
                onClick={ toggleIsNarrow }
                type="button"
                aria-label="sidebar toggler"
            >
                <FaAngleLeft
                    className="sidebar-toggler-chevron"
                    size={ 24 }
                />
            </Button>
        </div>
    )
}

export const SidebarOverlay = (props) => {
    const { isShowSidebar, toggleSidebar } = props;

    return (
        <div
            tabIndex={ -1 }
            aria-hidden
            className={ classNames('sidebar-overlay position-fixed top-0 bg-dark w-100 h-100 opacity-50', {
                'd-none': !isShowSidebar,
            }) }
            onClick={ toggleSidebar }
        />
    )
}
