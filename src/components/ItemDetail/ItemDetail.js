////Elements and modules

import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

//Components

import ItemCount from "../ItemCount/ItemCount";
import Spinner from "../Spinner/Spinner";

//Styles

import "./ItemDetail.scss";

function ItemDetail({ loading, itemDetail, initial }) {
  const { addItem } = useContext(CartContext);

  const [quantity, setQuantity] = useState(0);

  const [itemID, setItemID] = useState();

  const onAdd = (quantity, itemID) => {
    setQuantity(quantity);
    setItemID(itemID);
    addItem(itemDetail, quantity)
  };


  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="card mb-3">
            <h1 className="card-title">{itemDetail.title}</h1>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={itemDetail.image}
                  alt="Imagen del producto"
                  className="imagenItem"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h3>Descripción:</h3>
                  <p className="card-text">{itemDetail.description}</p>
                  <h4>Cantidad de items en stock:</h4>
                  <p className="card-text">{itemDetail.rating.count}</p>
                  <h4>Precio total por unidad:</h4>
                  <p className="card-text">{itemDetail.price}</p>

                  {quantity === 0 ? (
                    <ItemCount
                      initial={initial}
                      itemId={itemDetail.id}
                      onAdd={onAdd}
                      stock={itemDetail.rating.count}
                    />
                  ) : (
                    <>
                      <Modal.Dialog>
                        <Modal.Body>
                          <p>
                            Se agregaron {quantity} {itemDetail.title} al
                            carrito{" "}
                          </p>
                        </Modal.Body>
                      </Modal.Dialog>
                      <Button variant="success" className="itemButton">
                        <Link to="/cart" className="linkButton">
                          Finalizar mi compra
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ItemDetail;
