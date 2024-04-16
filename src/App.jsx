import './assets/sass/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "@/pages/Auth/Login.jsx";
import AuthMiddleware from "./middleware/auth.middleware.jsx";
import useStateContext from "@/hooks/useStateContext.jsx";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import Students from "@/pages/Admin/Students.jsx";
import Applications from "@/pages/Admin/Applications.jsx";
import StudentApplications from "@/pages/Student/Applications.jsx";
import StudentProfile from "@/pages/Student/Profile.jsx";

function App() {

    const { state } = useStateContext();

    return (
        <>
            <AuthMiddleware>
                <Routes>
                    <Route
                        path="/auth/login"
                        element={ <Login/> }
                    />

                    <Route
                        path="/"
                        element={ <AdminLayout/> }
                    >
                        { state.authUser?.roles.includes('admin') && (
                            <>
                                <Route
                                    index
                                    element={ <Applications/> }
                                />
                                <Route
                                    path='students'
                                    element={ <Students/> }
                                />
                            </>

                        ) }

                        { state.authUser?.roles.includes('student') && (
                            <>
                                <Route
                                    index
                                    element={ <StudentProfile/> }
                                />
                                <Route
                                    path='applications'
                                    element={ <StudentApplications/> }
                                />
                            </>
                        )}
                    </Route>
                </Routes>
            </AuthMiddleware>


            <ToastContainer
                position="bottom-right"
                autoClose={ 5000 }
                hideProgressBar={ false }
                newestOnTop={ false }
                closeOnClick
                rtl={ false }
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default App
