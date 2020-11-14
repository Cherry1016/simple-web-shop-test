import React, { useState, useEffect, useContext } from "react";
import { Modal, Icon, Header, Button } from "semantic-ui-react";
import { ProductType } from "../Model";
import { AppContext } from "../Context/AppContext";
import { APP_REDUCER_ACTION } from "../utils/constant";
import { ButtonGroup } from "../components";

const ButtonWithAddBasket = (props: { product: ProductType }) => {

  const [quantity, setQuantity] = useState<number>(0)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [ context, dispatchContext ] = useContext(AppContext)

  useEffect(() => {
    if(openModal){
      setTimeout(() => setOpenModal(false), 500)
    }
  }, [openModal])

  const handleAddToBasket = () => {
    dispatchContext({ type: APP_REDUCER_ACTION.ADD_TO_BASKET, item: props.product, qty: quantity })
    setOpenModal(true)
  }

  const handleQtyChange = (qty: number) => {
    setQuantity(qty)
  }

  return (
    <>
      <Modal open={openModal} basic>
        <Header icon>
          <Icon name="check"/>
            Product has been added to your basket
          </Header>
      </Modal>
      <div className="btn-group">
        <ButtonGroup product={props.product} onQtyChange={handleQtyChange}/>
        <Button content="Add to basket" color="orange" onClick={handleAddToBasket}/>
      </div>
    </>
  )
}

export default ButtonWithAddBasket;