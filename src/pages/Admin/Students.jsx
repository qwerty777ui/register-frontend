import { Button, Card, Container, InputGroup, Modal, Form, FloatingLabel } from "react-bootstrap";
import { useCallback, useMemo, useState } from "react";
import { FaRepeat, FaX } from "react-icons/fa6";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import useInfinityRequest from "@/hooks/useInfinityRequest.js";
import { useMutation } from "@tanstack/react-query";
import { DotLoader } from "react-spinners";
import DataTable from "@/components/ui/DataTable.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@/schemas/Student.schema.js";
import appAxios from "@/utils/axios.js";
import defaultPhoto from "@/assets/images/default.jpg";

const Students = () => {
    const [modal, setModal] = useState("");
    const [selectedIdx, setSelectedIdx] = useState(null);

    const {
        objects,
        isFetching,
        isError,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        onSearch,
        onSort,
        sortBy,
        order,
        search,
        searchBy
    } = useInfinityRequest({
        url: '/students',
        key: 'students'
    });

    const { register, setValue, setError, setFocus, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            identifier: "",
            first_name: "",
            last_name: "",
            middle_name: "",
            passport_number: "",
            pinfl: null,
            birth_date: null,
            email: null,
            group: "",
            faculty: "",
        }
    })

    const {
        mutate: createMutation,
        isLoading: createLoading
    } = useMutation({
        mutationFn: async (data) => {
            const response = await appAxios.post(`/students`, data)
            return response.data
        },
        onSuccess: () => {
            setModal("")
            reset()
            toast.success("Студент успешно создан")
            refetch()
        },
        onError: (error) => {
            if (Array.isArray(error.response?.data.errors)) {
                error.response?.data.errors.forEach((error) => {
                    setError(error.path[error.path.length - 1], { message: error.message })
                })
            }
            else {
                toast.error(error.response?.data.message || error.message)
            }
        }
    })

    const {
        mutate: updateMutation,
        isLoading: updateLoading
    } = useMutation({
        mutationFn: async (data) => {
            const response = await appAxios.patch(`/students/${ selectedIdx }`, data)
            return response.data
        },
        onSuccess: () => {
            setModal("")
            reset()
            setSelectedIdx(null)
            toast.success("Студент успешно обновлен")
            refetch()
        },
        onError: (error) => {
            if (Array.isArray(error.response?.data.errors)) {
                error.response?.data.errors.forEach((error) => {
                    setError(error.path[error.path.length - 1], { message: error.message })
                })
            }
            else {
                toast.error(error.response?.data.message || error.message)
            }
        }
    })

    const {
        mutate: deleteMutation,
        isLoading: deleteLoading
    } = useMutation({
        mutationFn: async () => {
            await appAxios.delete(`/students/${ selectedIdx }`)
        },
        onSuccess: () => {
            setModal("")
            setSelectedIdx(null)
            refetch()
            toast.success("Студент успешно удален")
        },
        onError: (error) => {
            toast.error(error.response?.data.message || error.message)
        }
    })

    const actionUpdate = useCallback((idx) => {
        setSelectedIdx(idx)
        const student = objects?.find((student) => student.id === idx)
        if (student) {
            setModal("update")
            setValue('identifier', student.identifier)
            setValue('first_name', student.first_name)
            setValue('last_name', student.last_name)
            setValue('middle_name', student.middle_name)
            setValue('passport_number', student.passport_number)
            setValue('pinfl', student.pinfl)
            setValue('gender', student.gender)
            setValue('email', student.email)
            setFocus('first_name')
            setTimeout(() => {
                setValue('birth_date', student.birth_date)
                setValue('group', student.group)
                setValue('faculty', student.faculty)
            }, 100)
        }
    }, [objects, setValue, setFocus])

    const actionCreate = useCallback(() => {
        setModal("create")
        setFocus('last_name')
    }, [setModal, setFocus])

    const actionDelete = useCallback((idx) => {
        setSelectedIdx(idx)
        setModal("delete")
    }, [])

    const modalClose = useCallback(() => {
        setModal("")
        setSelectedIdx(null)
        reset()
    }, [setModal, setSelectedIdx, reset])

    const tableHeaders = useMemo(() => {
        return [
            {
                key: "identifier",
                label: "ID",
                searchable: () => (
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по ID"
                            value={ searchBy === 'identifier' ? search : "" }
                            onChange={ e => onSearch('identifier', e.target.value) }
                        />
                    </InputGroup>
                ),
                render: (row) => (
                    <div className="d-flex align-items-center gap-2">
                        <img
                            src={ defaultPhoto }
                            width={ 50 }
                            height={ 50 }
                            className="rounded-circle shadow object-fit-cover"
                            alt=""
                        />
                        { row.identifier }
                    </div>
                )
            },
            {
                key: 'last_name',
                searchable: () => (
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по фамилию"
                            value={ searchBy === 'last_name' ? search : "" }
                            onChange={ e => onSearch('last_name', e.target.value) }
                        />
                    </InputGroup>
                )
            },
            {
                key: 'first_name',
                searchable: () => (
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по имени"
                            value={ searchBy === 'first_name' ? search : "" }
                            onChange={ e => onSearch('first_name', e.target.value) }
                        />
                    </InputGroup>
                )
            },
            {
                key: 'middle_name',
                searchable: () => (
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по отчеству"
                            value={ searchBy === 'middle_name' ? search : "" }
                            onChange={ e => onSearch('middle_name', e.target.value) }
                        />
                    </InputGroup>
                )
            },
            {
                key: 'group',
                render: (row) => (
                    <div className="d-flex align-items-center justify-content-center text-nowrap">
                        { row.group }
                    </div>
                ),
                searchable: () => (
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по группе"
                            value={ searchBy === 'group' ? search : "" }
                            onChange={ e => onSearch('group', e.target.value) }
                        />
                    </InputGroup>
                )
            },
            {
                key: 'passport_number',
                searchable: () => (
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по паспорт серии"
                            value={ searchBy === 'passport_number' ? search : "" }
                            onChange={ e => onSearch('passport_number', e.target.value) }
                        />
                    </InputGroup>
                )
            },
            {
                key: 'actions',
                label: "Действия",
                className: "text-end",
                render: (row) => (
                    <div className="d-flex align-items-center justify-content-end gap-2">
                            <Button
                                variant="info"
                                onClick={ () => actionUpdate(row.id) }
                                disabled={ updateLoading }
                                className="btn-icon"
                            >
                                <FaEdit/>
                            </Button>
                            <Button
                                variant="danger"
                                disabled={ deleteLoading }
                                onClick={ () => actionDelete(row.id) }
                                className="btn-icon"
                            >
                                <FaTrash/>
                            </Button>
                    </div>
                )
            },
        ]
    }, [sortBy, order, onSort, onSearch, searchBy, search, actionUpdate, actionDelete, updateLoading, deleteLoading]);

    return (
        <>
            <Modal
                show={ ['update', 'create'].includes(modal) }
                onHide={ modalClose }
                centered
                animation
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <h5>
                        { modal === 'create' ? 'Создать' : 'Изменить' } студента
                    </h5>
                </Modal.Header>

                <Form
                    onSubmit={ handleSubmit(formData => modal === 'create' ? createMutation(formData) : updateMutation(formData)) }
                >
                    <Modal.Body>
                        <FloatingLabel
                            controlId="identifier"
                            label="Идентификатор"
                            className={ `mb-3 ${ errors.identifier ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('identifier') }
                            />
                            { errors.identifier &&
                                <Form.Text className="text-danger">{ errors.identifier.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="last_name"
                            label="Фамилия"
                            className={ `mb-3 ${ errors.last_name ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('last_name') }
                            />
                            { errors.last_name &&
                                <Form.Text className="text-danger">{ errors.last_name.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="first_name"
                            label="Имя"
                            className={ `mb-3 ${ errors.first_name ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('first_name') }
                            />
                            { errors.first_name &&
                                <Form.Text className="text-danger">{ errors.first_name.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="middle_name"
                            label="Отчество"
                            className={ `mb-3 ${ errors.middle_name ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('middle_name') }
                            />
                            { errors.middle_name &&
                                <Form.Text className="text-danger">{ errors.middle_name.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="faculty"
                            label="Факультет"
                            className={ `mb-3 ${ errors.faculty ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('faculty') }
                            />
                            { errors.faculty &&
                                <Form.Text className="text-danger">{ errors.faculty.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="group"
                            label="Группа"
                            className={ `mb-3 ${ errors.group ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('group') }
                            />
                            { errors.group &&
                                <Form.Text className="text-danger">{ errors.group.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="passport_number"
                            label="Номер паспорта"
                            className={ `mb-3 ${ errors.passport_number ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                disabled={ updateLoading || createLoading }
                                { ...register('passport_number') }
                            />
                            { errors.passport_number &&
                                <Form.Text className="text-danger">{ errors.passport_number.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="pinfl"
                            label="ПИНФЛ"
                            className={ `mb-3 ${ errors.pinfl ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="text"
                                maxLength={ 14 }
                                disabled={ updateLoading || createLoading }
                                { ...register('pinfl') }
                            />
                            { errors.pinfl &&
                                <Form.Text className="text-danger">{ errors.pinfl.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="email"
                            label="Электронная почта"
                            className={ `mb-3 ${ errors.email ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="email"
                                disabled={ updateLoading || createLoading }
                                { ...register('email') }
                            />
                            { errors.email &&
                                <Form.Text className="text-danger">{ errors.email.message }</Form.Text> }
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="birth_date"
                            label="Дата рождения"
                            className={ `mb-3 ${ errors.birth_date ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                type="date"
                                disabled={ updateLoading || createLoading }
                                { ...register('birth_date', { valueAsDate: true }) }
                            />
                            { errors.birth_date &&
                                <Form.Text className="text-danger">{ errors.birth_date.message }</Form.Text> }
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            type="button"
                            disabled={ updateLoading || createLoading }
                            className="center gap-2 py-2 px-3"
                            onClick={ modalClose }
                        >
                            <FaX/> Отменить
                        </Button>
                        <Button
                            variant={ modal === 'create' ? "success" : "primary" }
                            type="submit"
                            disabled={ updateLoading || createLoading }
                            className="center gap-2 py-2 px-3"
                        >
                            { modal === 'create' ? <><FaPlus/> Создать</> : <><FaEdit/> Изменить</> }
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>
            <Modal
                show={ modal === "delete" }
                onHide={ () => setModal("") }
                centered
                animation
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <h5>
                        Удалить студента
                    </h5>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить студента?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        type="button"
                        disabled={ deleteLoading }
                        className="center gap-2 py-2 px-3"
                        onClick={ () => setModal("") }
                    >
                        <FaX/> Отменить
                    </Button>
                    <Button
                        variant="danger"
                        type="button"
                        disabled={ deleteLoading }
                        className="center gap-2 py-2 px-3"
                        onClick={ () => deleteMutation(selectedIdx) }
                    >
                        <FaTrash/> Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container fluid="lg">
                <Card className="animate__animated animate__faster animate__fadeIn shadow">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5>Студенты</h5>
                        <div className="d-flex gap-2">
                            <Button
                                variant="success"
                                className="btn-icon"
                                onClick={ actionCreate }
                            >
                                <FaPlus/>
                            </Button>
                            <Button
                                variant="info"
                                className="btn-icon"
                                onClick={ () => refetch() }
                            >
                                <FaRepeat/>
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <InfiniteScroll
                            dataLength={ objects.length }
                            next={ fetchNextPage }
                            hasMore={ hasNextPage || false }
                            loader={
                                <div className="d-flex align-items-center justify-content-center my-3">
                                    <DotLoader
                                        color="#0096db"
                                        size={ 40 }
                                    />
                                </div>
                            }
                        >
                            <DataTable
                                headers={ tableHeaders }
                                data={ objects }
                                isFetching={ isFetching }
                                isError={ isError }
                                error={ error }
                            />
                        </InfiniteScroll>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default Students;