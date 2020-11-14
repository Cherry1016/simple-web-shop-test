import React, { useState, useEffect, useContext } from "react";
import { Button, Segment, Header, Icon } from "semantic-ui-react";
import { AppContext } from "../Context/AppContext";
import { BasketItemType, ProductType } from "../Model";
import { ButtonGroup } from "../components";
import { APP_REDUCER_ACTION, MOMENT_DAY } from "../utils/constant";
import moment from "moment";
import { calculateUpcomingDay, formatComma } from "../utils";
import { useHistory } from "react-router-dom";

const BasketSummary = (props: any) => {

  const [basketItem, setBasketItem] = useState<BasketItemType>({})
  const [context, dispatchContext] = useContext(AppContext)
  const [deliveryDate, setDeliveryDate] = useState(moment())
  const [maxShippingDay, setMaxShippingDay] = useState<number>(0);
  const [receivingDate, setReceivingDate] = useState(moment());
  const history = useHistory();

  useEffect(() => {
    if (context?.products) {
      setBasketItem(context.products)
    } else {
      setBasketItem({})
    }
  }, [context?.products])

  useEffect(() => {
    findMaxShippingDay()
  }, [basketItem, deliveryDate])

  useEffect(() => {
    let upcomingTues = calculateUpcomingDay({ day: MOMENT_DAY.TUESDAY })
    setDeliveryDate(upcomingTues)
  }, [])

  useEffect(() => {
    if (deliveryDate && maxShippingDay) {
      findReceivingDate()
    }
  }, [maxShippingDay, deliveryDate])

  const findMaxShippingDay = () => {
    let arr = Object.values(basketItem).map((item) => parseInt(item.shippingDay))
    if (arr.length > 0) {
      setMaxShippingDay(Math.max(...arr))
    }
  }
  
  const findReceivingDate = ({ dayAdd }: { dayAdd?: number } = {}) => {
    let shippingDay = maxShippingDay
    if (dayAdd) {
      shippingDay = dayAdd
    }
    let date = deliveryDate.clone().add(shippingDay, "days")
    if (date.day() === MOMENT_DAY.SATURDAY || date.day() === MOMENT_DAY.SUNDAY) {
      findReceivingDate({ dayAdd: shippingDay + 1 })
    } else {
      setReceivingDate(date)
    }
  }

  const handleUpdateQty = ({ qty, item }: { qty: number, item: ProductType }) => {
    dispatchContext({ type: APP_REDUCER_ACTION.ADD_TO_BASKET, item, qty: qty })
  }

  const handleDeleteProduct = (id: string) => {
    dispatchContext({ type: APP_REDUCER_ACTION.REMOVE_ITEM_IN_BASKET, itemId: id })
  }

  const calculateTotalPrice = () => {
    let totalPrice = 0
    for (let item of Object.keys(basketItem)) {
      totalPrice = totalPrice + parseFloat(basketItem[item].totalPrice ?? "0")
    }
    return formatComma(totalPrice.toFixed(2))
  }

  const handleGoToHome = () => {
    history.push("/")
  }

  return (
    <div className={`basket-summary ${Object.keys(basketItem).length === 0 ? "no-content" : ""}`}>
      {Object.keys(basketItem).length > 0 ?
        (
          <>
          <h1>Basket Summary</h1>
            <div className="summary-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price per piece</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(basketItem).map((itemId => {
                    const { price, totalPrice, name } = basketItem[itemId]
                    return (
                      <tr key={itemId}>
                        <td>{name}</td>
                        <td className="price">{formatComma(parseFloat(price).toFixed(2))}</td>
                        <td className="qty">
                          <ButtonGroup
                            key={itemId}
                            product={basketItem[itemId]}
                            onQtyChange={(qty) => handleUpdateQty({ qty, item: basketItem[itemId] })}
                          />
                        </td>
                        <td className="price">{formatComma((parseFloat(totalPrice ?? "0")).toFixed(2))}</td>
                        <td><Button color="red" icon="minus" compact onClick={() => handleDeleteProduct(itemId)} /></td>
                      </tr>
                    )
                  }))}
                </tbody>
              </table>
            </div>
            <Segment>
              <h1>Total Price: {`${calculateTotalPrice()}`}</h1>
              <h1>Delivery Date: {`${deliveryDate.format("dddd, MMMM Do YYYY")}`}</h1>
              <h1>Receiving Date: {`${receivingDate.format("dddd, MMMM Do YYYY")}`}</h1>
            </Segment>
          </>)
        : (
          <Segment placeholder basic>
            <Header as="h1" icon>
              <Icon name="shopping basket" />
              No Product in the basket.
            </Header>
            <Button size="massive" onClick={handleGoToHome}>Go Shop</Button>
        </Segment>
        )}
    </div>
  )
}

export default (BasketSummary)