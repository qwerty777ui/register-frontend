import {Button, Container, Image} from 'react-bootstrap'
import {FaBars} from "react-icons/fa6";
import {Link} from "react-router-dom";
import logoNarrow from "@/assets/images/white-logo-narrow.png";

const Header = ({toggleSidebar, toggleSidebarMd, children}) => {
    return (
        <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom shadow-sm">
            <Container fluid className="header-navbar d-flex align-items-center">
                <Button
                    variant="link"
                    className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none"
                    type="button"
                    onClick={toggleSidebar}
                >
                    <FaBars/>
                </Button>
                <Button
                    variant="link"
                    className="header-toggler d-none d-md-inline-block px-md-0 me-md-3 rounded-0 shadow-none"
                    type="button"
                    onClick={toggleSidebarMd}
                >
                    <FaBars/>
                </Button>
                <Link to="/" className="header-brand d-md-none">
                    <Image src={logoNarrow} height={54} alt="KIUT Transfer"/>
                </Link>
                <div className="header-nav ms-auto">
                    {children}
                </div>
            </Container>
            <Container fluid>

            </Container>
        </header>
    )
}

export default Header
