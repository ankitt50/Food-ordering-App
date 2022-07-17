import CartContext from "./cart-context";
import { useReducer } from "react";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};
const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    /*
    const updatedItems = state.items.concat(action.item); //concat function
    //returns a new array and don't change the existing array.
    */
    let updatedItems = [];
    let itemAlreadyExists = false;
    let itemIdx = 0;
    let currIdx = 0;
    state.items.forEach((item) => {
      if (item.id === action.item.id) {
        itemAlreadyExists = true;
        itemIdx = currIdx;
      }
      currIdx++;
    });
    if (itemAlreadyExists) {
      updatedItems = state.items;
      let updatesItem = updatedItems[itemIdx];
      updatesItem.amount = updatesItem.amount + action.item.amount;
      updatedItems[itemIdx] = updatesItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    const updatedTotalAmount =
      state.totalAmount + action.item.amount * action.item.price;
    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }
  if (action.type === "REMOVE") {
    /*
    const updatedItems = state.items.concat(action.item); //concat function
    //returns a new array and don't change the existing array.
    */

    let updatedItems = state.items;
    let itemIdx = 0;
    let currIdx = 0;
    state.items.forEach((item) => {
      if (item.id === action.id) {
        itemIdx = currIdx;
      }
      currIdx++;
    });

    let updatesItem = updatedItems[itemIdx];

    updatesItem.amount = updatesItem.amount - 1;

    const updatedTotalAmount = state.totalAmount - updatesItem.price;

    if (updatesItem.amount !== 0) {
      updatedItems[itemIdx] = updatesItem;
    } else {
      updatedItems.splice(itemIdx, 1);
    }

    return { items: updatedItems, totalAmount: updatedTotalAmount };
  }
  return defaultCartState;
};
const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };
  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};
export default CartProvider;
