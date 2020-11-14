import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { checkQuantity } from "../utils";
import { ProductType } from "../Model";

const ButtonGroup = (props: { product: ProductType, onQtyChange: (qty: number) => void }) => {

  const [quantity, setQuantity] = useState<number>(0)
  const [openModal, setOpenModal] = useState<boolean>(false)

  useEffect(() => {
    if(props.product?.qty){
      setQuantity(props.product?.qty)
    }
    else if (props.product?.minQty) {
      let qty = parseInt(props.product?.minQty)
      if(!qty){
        qty = 1
      }
      setQuantity(qty)
    }
  }, [props.product])

  useEffect(() => {
    const timeout = setTimeout(() => {
      let minQty = parseInt(props.product?.minQty)
      let maxQty = parseInt(props.product?.maxQty)
      let stock = parseInt(props.product?.stock)
      let qty = checkQuantity({ value: quantity, minQty, maxQty, stock })
      setQuantity(qty)
      props.onQtyChange(qty)
    }, 300)
    return () => clearTimeout(timeout)
  }, [quantity])

  useEffect(() => {
    if(openModal){
      setTimeout(() => setOpenModal(false), 1000)
    }
  }, [openModal])

  const handleAdd = () => {
    setQuantity(quantity + 1)
  }

  const handleMinus = () => {
    setQuantity(quantity - 1)
  }

  const handleTypeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setQuantity(parseInt(value))
  }

  return (
    <div className="btn-group">
      <div>
        <Button
          icon="minus"
          compact
          disabled={quantity === parseInt(props.product?.minQty) || quantity === 1}
          onClick={handleMinus}
        />
        <input type="number" value={quantity} onChange={handleTypeQty} />
        <Button icon="plus"
          compact
          onClick={handleAdd}
          disabled={(parseInt(props.product?.maxQty) !== 0 && (quantity === parseInt(props.product?.maxQty))) || quantity === parseInt(props.product?.stock)}
        />
      </div>&ensp;&ensp;
    </div>
  )
}

ButtonGroup.defaultProps = {
  onQtyChange: () => {}
}

export default ButtonGroup;