import { useMutation, useQuery } from "@tanstack/react-query";
import appAxios from "@/utils/axios.js";
import { Accordion, Alert, Badge, Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostApplicationSchema } from "@/schemas/Application.schema.js";
import { FaX } from "react-icons/fa6";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const StudentApplications = () => {
    const [modal, setModal] = useState('');
    const [selectedIdx, setSelectedIdx] = useState(null);

    const { data: applications, refetch } = useQuery({
        queryKey: ['applications'],
        initialData: [],
        queryFn: async () => {
            const { data } = await appAxios.get('/applications');
            return data.data;
        },
        select: data => data.applications
    })

    const { register, setFocus, handleSubmit, reset, setError, formState: { errors } } = useForm({
        resolver: zodResolver(PostApplicationSchema),
        defaultValues: {
            message: ''
        }
    })

    const actionCreate = useCallback(() => {
        setModal("create")
        setFocus('message')
    }, [setModal, setFocus])

    const {
        mutate: createMutation,
        isLoading: createLoading
    } = useMutation({
        mutationFn: async (data) => {
            const response = await appAxios.post(`/applications`, data)
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
            } else {
                toast.error(error.response?.data.message || error.message)
            }
        }
    })

    const modalClose = useCallback(() => {
        setModal("")
        setSelectedIdx(null)
        reset()
    }, [setModal, setSelectedIdx, reset])

    return (
        <div className="d-flex flex-column w-100">
            <div className="d-flex">
                <h2 className="mb-4">Заявки</h2>

                <div className="ms-auto">
                    <button
                        className="btn btn-primary"
                        onClick={ actionCreate }
                    >
                        Отправить заявку
                    </button>
                </div>
            </div>

            <Accordion>
                { applications?.length ?
                    applications?.map(application => (
                        <Accordion.Item
                            key={ application.id }
                            eventKey={ application.id }
                        >
                            <Accordion.Header>
                                <div className="d-flex align-items-center flex-grow-1 pe-4">
                                    <Badge
                                        bg={ application.status === 'pending' ? 'warning' : 'success'}
                                        className="me-3"
                                    >
                                        { application.status === 'pending' ? 'В ожидании' : 'Отвечено' }
                                    </Badge>
                                    <p className="mb-0">{ application.message }</p>
                                    <small className="d-flex ms-auto">{ format(new Date(application.created_at), 'dd MMMM yyyy HH:mm') }</small>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {
                                    application.response ? (
                                        <div className="d-flex align-items-center pe-5">
                                            <p className="mb-0 me-5">{ application.response }</p>
                                            <small className="d-flex ms-auto text-nowrap">{ format(new Date(application.updated_at), 'dd MMMM yyyy HH:mm') }</small>
                                        </div>
                                    ) : (
                                        <p className="mb-0">Ответа пока нет</p>
                                    )
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                    : (
                        <Alert variant="info">
                            Заявок нет
                        </Alert>
                    )
                }
            </Accordion>

            <Modal
                show={ ['create'].includes(modal) }
                onHide={ modalClose }
                centered
                animation
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <h5>
                        { modal === 'create' ? 'Создать' : 'Изменить' } заявку
                    </h5>
                </Modal.Header>

                <Form
                    onSubmit={ handleSubmit(formData => createMutation(formData)) }
                >
                    <Modal.Body>
                        <FloatingLabel
                            controlId="message"
                            label="Текст заявки"
                            className={ `mb-3 ${ errors.message ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                as="textarea"
                                rows={ 5 }
                                disabled={ createLoading }
                                { ...register('message') }
                                style={ { "minHeight": '200px' } }
                            />
                            { errors.message &&
                                <Form.Text className="text-danger">{ errors.message.message }</Form.Text> }
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            type="button"
                            disabled={ createLoading }
                            className="center gap-2 py-2 px-3"
                            onClick={ modalClose }
                        >
                            <FaX/> Отменить
                        </Button>
                        <Button
                            variant={ modal === 'create' ? "success" : "primary" }
                            type="submit"
                            disabled={ createLoading }
                            className="center gap-2 py-2 px-3"
                        >
                            { modal === 'create' ? <><FaPlus/> Создать</> : <><FaEdit/> Изменить</> }
                        </Button>
                    </Modal.Footer>
                </Form>

            </Modal>
        </div>
    )
}

export default StudentApplications;