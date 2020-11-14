import React, { ReactChild } from 'react';
import { Icon } from "semantic-ui-react";
import { useHistory } from 'react-router-dom';

const TopBar = (props: { children?: ReactChild }) => {

  const history = useHistory();

  const handleGotoHome = () => {
    history.push("/");
  }

  const handleGotoBasketSummary = () => {
    history.push("/basket-summary");
  }

  return (
    <div>
      <div className="menu-bar">
        <h2 onClick={handleGotoHome}>Simple Web Shop</h2>
        <Icon onClick={handleGotoBasketSummary} name="shopping basket" size="large" />
      </div>
      {props.children}
  </div>
  )
}

export default TopBar;