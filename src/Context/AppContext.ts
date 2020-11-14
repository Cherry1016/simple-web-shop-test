import React, { createContext } from 'react';
import { BasketItemType, ProductType } from "../Model";
import { APP_REDUCER_ACTION } from "../utils/constant";

interface AppReducerStateTypes {
  products: BasketItemType
}

interface AddToBasketAction{
  type: typeof APP_REDUCER_ACTION.ADD_TO_BASKET
  item: ProductType
  qty: number
}

interface RemoveItemInBasketAction{
  type: typeof APP_REDUCER_ACTION.REMOVE_ITEM_IN_BASKET
  itemId: string
}

type AppReducerDispatchAction =
| AddToBasketAction
| RemoveItemInBasketAction


export const AppContext = createContext<[
  AppReducerStateTypes,
  React.Dispatch<AppReducerDispatchAction>
]>([{products: {}}, {} as React.Dispatch<AppReducerDispatchAction>]);

export const AppReducer = (state: AppReducerStateTypes, action: AppReducerDispatchAction) => {
  let newState: AppReducerStateTypes  = { ...state, products: { ...state.products } }
  switch (action.type) {
    case APP_REDUCER_ACTION.ADD_TO_BASKET:
      newState.products[action.item?.id] = {
        ...newState.products[action.item?.id],
        ...action.item,
        qty: action.qty,
        totalPrice: (action.qty * parseFloat(action.item?.price)).toString()
      }
      return newState;
    case APP_REDUCER_ACTION.REMOVE_ITEM_IN_BASKET:
      delete newState.products[action.itemId];
      return newState
    default:
      return state;
  }
};