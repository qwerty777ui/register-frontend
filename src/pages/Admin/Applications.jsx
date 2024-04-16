import "@/Styles/MessageBlock.css"
import { useMutation, useQuery } from "@tanstack/react-query";
import appAxios from "@/utils/axios.js";
import { Accordion, Alert, Badge, Button, FloatingLabel, Form, Modal, Nav } from "react-bootstrap";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReplyApplicationSchema } from "@/schemas/Application.schema.js";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Applications() {
    const [activeTab, setActiveTab] = useState(1);
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

    const filteredApplications = useMemo(() => {
        return applications?.filter(application => {
            if (activeTab === 1) return true;

            return application.status === "pending";
        })
    }, [applications, activeTab]);

    const { register, setFocus, reset, formState: { errors }, handleSubmit } = useForm({
        resolver: zodResolver(ReplyApplicationSchema),
        defaultValues: {
            response: ''
        }
    })

    const actionReply = useCallback((id) => {
        setSelectedIdx(id);
        setModal('reply');
        setFocus('response');
    }, [setModal, setFocus]);

    const modalClose = useCallback(() => {
        setModal("")
        setSelectedIdx(null)
        reset()
    }, [setModal, setSelectedIdx, reset])

    const {
        mutate: replyMutation,
        isLoading: replyLoading
    } = useMutation({
        mutationFn: async (data) => {
            const response = await appAxios.patch(`/applications/${ selectedIdx }`, data)
            return response.data
        },
        onSuccess: () => {
            setModal("")
            reset()
            toast.success("Ответ успешно отправлен")
            refetch()
        },
    })

    return (
        <div className="d-flex flex-column w-100">
            <h2 className="mb-4">Заявки</h2>

            <Nav
                activeKey={ activeTab }
                variant="pills"
                onSelect={ (eventKey) => setActiveTab(+eventKey) }
                className="mb-4"
            >
                <Nav.Item>
                    <Nav.Link eventKey={ 1 }>Все</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={ 2 }>Неотвеченные</Nav.Link>
                </Nav.Item>
            </Nav>

            <Accordion>
                { filteredApplications?.length ? filteredApplications?.map(application => (
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
                                    <p className="mb-0">{ application.student.last_name } { application.student.first_name } { application.student.middle_name }</p>
                                    <small className="d-flex ms-auto">{ format(new Date(application.created_at), 'dd MMMM yyyy HH:mm') }</small>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <h3>Вопрос:</h3>
                                <p>{ application.message }</p>

                                <h3>Ответ:</h3>
                                <p>{ application.response || (<i>Ответа пока нет</i>) }</p>

                                { application.status === 'pending' &&
                                    <Button
                                        className="d-flex ms-auto"
                                        onClick={ () => actionReply(application.id) }
                                    >
                                        Ответить
                                    </Button> }
                            </Accordion.Body>
                        </Accordion.Item>
                    )) : (
                        <Alert variant="info">Заявок нет</Alert>
                    )
                }
            </Accordion>

            <Modal
                show={ ['reply'].includes(modal) }
                onHide={ modalClose }
                centered
                animation
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ответить на заявку</Modal.Title>
                </Modal.Header>
                <Form onSubmit={ handleSubmit(data => replyMutation(data)) }>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="response"
                            label="Текст ответа"
                            className={ `mb-3 ${ errors.response ? 'is-invalid' : '' }` }
                        >
                            <Form.Control
                                as="textarea"
                                rows={ 5 }
                                disabled={ replyLoading }
                                { ...register('response') }
                                style={ { "minHeight": '200px' } }
                            />
                            { errors.response &&
                                <Form.Text className="text-danger">{ errors.response.message }</Form.Text> }
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={ modalClose }
                        >
                            Закрыть
                        </Button>
                        <Button
                            variant="primary"
                            onClick={ handleSubmit(data => replyMutation(data)) }
                        >
                            Отправить
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}