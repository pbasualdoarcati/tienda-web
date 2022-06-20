//Elements and modules
import React, { useState, useContext } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import swal from "sweetalert";

//Components
import { CartContext } from "../../context/CartContext";
import { db, app } from "../../firebase/firebaseConfig";

//Style
import "./Shop.scss";

function Shop({ showShop, product, total }) {
  const { setShow, clearCart, user, setUser } = useContext(CartContext);
  const [miSesion, setMiSesion] = useState(true);
  const [showModal, setShowModal] = useState(showShop);
  const [order, setOrder] = useState("");
  const auth = getAuth(app);
  let today = new Date();
  const initialState = {
    buyer: [
      {
        name: "",
        surname: "",
        email: "",
        password: "",
      },
    ],
    items: [
      {
        id: " ",
        title: " ",
        price: " ",
      },
    ],
    date: "",
    total: "",
  };

  const userInitialState = {
    user: [
      {
        email: "",
        password: "",
      },
    ],
  };

  const [values, setValues] = useState(initialState);
  const [userInitial, setUserInitial] = useState(userInitialState);

  onAuthStateChanged(auth, (usuarioFirebase) => {
    if (usuarioFirebase) {
      setUser(usuarioFirebase);
    } else {
      setUser(null);
    }
  });

  async function login(email, password) {
    // eslint-disable-next-line no-unused-vars
    const user = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then((usuarioFirebase) => {
      return usuarioFirebase;
    });
  }

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      buyer: [{ ...values.buyer[0], [name]: value }],
      items: product,
      total: Number(total),
      date: today,
    });
  };

  const handleOnChangeSession = (e) => {
    const { name, value } = e.target;
    setUserInitial({
      ...userInitial,
      user: [{ ...userInitial.user[0], [name]: value }],
    });
    setValues({
      ...values,
      buyer: [{ ...values.buyer[0], [name]: value }],
      items: product,
      total: Number(total),
      date: today,
    });
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "Orders"), values);
    if (!miSesion) {
      login(values.buyer[0].email, values.buyer[0].password);
    }
    setOrder(docRef.id);
    setValues(initialState);
  };
  const onSubmitSesion = async (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-unused-vars
    const user = await signInWithEmailAndPassword(
      auth,
      userInitial.user[0].email,
      userInitial.user[0].password
    ).catch(() => {
      swal({
        title: "Usuario o contraseña incorrectos",
        icon: "error",
        button: "Aceptar",
      });
    });
    const docRef = await addDoc(collection(db, "Orders"), values);
    setOrder(docRef.id);
  };
  const handleClose = () => {
    setShowModal(false);
    setShow(false);
  };
  const handleRegister = () => {
    setMiSesion(false);
  };

  return (
    <>
      <Modal className="cardForm" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Formulario de orden de compra</Modal.Title>
        </Modal.Header>
        {miSesion ? (
          <>
            {order ? (
              <>
                <Card className="cardForm">
                  <Card.Title>Orden enviada </Card.Title>
                  <Card.Body>
                    <Card.Text> Usuario: {user.email} </Card.Text>
                    <Card.Text>Su número de orden es: {order}</Card.Text>
                    <Card.Footer className="text-muted d-flex justify-content-around">
                      ¡Muchas gracias por su compra!
                    </Card.Footer>
                  </Card.Body>
                  <Button
                    variant="danger"
                    onClick={() => clearCart()}
                    onFocus={() => signOut(auth)}
                    className="btnForm"
                  >
                    Salir
                  </Button>
                </Card>
              </>
            ) : (
              <>
                <h1 className="title">Iniciar Sesión</h1>
                <Form onSubmit={onSubmitSesion} className="form">
                  <Form.Group className="mb-3 inputForm">
                    <Form.Label className="labelForm">Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="labelForm"
                      placeholder="Email"
                      name="email"
                      value={userInitial.email}
                      onChange={handleOnChangeSession}
                      required={true}
                    />
                    <Form.Label className="labelForm">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      className="labelForm"
                      placeholder="Contraseña"
                      name="password"
                      value={userInitial.password}
                      onChange={handleOnChangeSession}
                      required={true}
                    />
                    <div className="btnSession">
                      <Button
                        variant="success"
                        type="submit"
                        className="btnForm btnSession"
                      >
                        {" "}
                        Iniciar Sesión{" "}
                      </Button>
                    </div>
                    <div className="labelRegister">
                      <Form.Label>¿No tienes cuenta?</Form.Label>
                      <Button
                        variant="info"
                        onClick={handleRegister}
                        className="btnRegister"
                      >
                        Registrarse
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </>
            )}
          </>
        ) : (
          <>
            {order ? (
              <>
                <Card className="cardForm">
                  <Card.Title>Orden enviada </Card.Title>
                  <Card.Body>
                    <Card.Text> Usuario: {user.email} </Card.Text>
                    <Card.Text>Su número de orden es: {order}</Card.Text>
                    <Card.Footer className="text-muted d-flex justify-content-around">
                      ¡Muchas gracias por su compra!
                    </Card.Footer>
                  </Card.Body>
                  <Button
                    variant="danger"
                    onClick={() => clearCart()}
                    onFocus={() => signOut(auth)}
                    className="btnForm"
                  >
                    Salir
                  </Button>
                </Card>
              </>
            ) : (
              <>
                <Form className="form" onSubmit={onSubmitRegister}>
                  <Form.Group className="mb-3 inputForm">
                    <h1 className="title">Registrarse</h1>
                    <Form.Label className="labelForm">Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      className="labelForm"
                      placeholder="Nombre"
                      name="name"
                      value={values.name}
                      onChange={handleOnChange}
                      minLength="3"
                      required={true}
                      pattern="[a-zA-Z]{3,}"
                      title="Debe contener al menos 3 letras"
                    />
                    <Form.Text className="text-muted labelForm">
                      Ej: Juan
                    </Form.Text>
                    <Form.Label className="labelForm">Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      className="labelForm"
                      placeholder="Nombre"
                      name="surname"
                      value={values.surname}
                      onChange={handleOnChange}
                      minLength="3"
                      required={true}
                      pattern="[a-zA-Z]{3,}"
                      title="Solo se permiten letras"
                    />
                    <Form.Text className="text-muted labelForm">
                      Ej: Juan
                    </Form.Text>

                    <Form.Label className="labelForm">Email</Form.Label>
                    <Form.Control
                      type="email"
                      className="labelForm"
                      placeholder="Email"
                      name="email"
                      value={values.email}
                      onChange={handleOnChange}
                      required={true}
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
                      title="Debe ser un email válido"
                    />
                    <Form.Text className="text-muted labelForm">
                      Ej: example@example.com
                    </Form.Text>
                    <Form.Label className="labelForm">Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      className="labelForm"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      onChange={handleOnChange}
                      minLength="6"
                      required={true}
                      pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}"
                      title="Debe contener al menos 6 caracteres, una mayúscula, una minúscula, un número y un caracter especial"
                    />
                    <Form.Text className="text-muted labelForm">
                      Ej: Ejemplo.123
                    </Form.Text>
                  </Form.Group>
                  <Button type="submit" variant="success" className="btnForm">
                    {" "}
                    Enviar{" "}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleClose}
                    className="btnForm"
                  >
                    Salir
                  </Button>
                </Form>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
}

export default Shop;
