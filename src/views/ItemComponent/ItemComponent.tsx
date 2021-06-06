import * as React from "react";
import "./ItemComponent.css";
export interface ItemComponentProps {
  imagePath: string;
  offset: number;
  shouldAnimate: boolean;
}

const ItemComponent: React.FunctionComponent<ItemComponentProps> = ({
  imagePath,
  offset,
  shouldAnimate,
}) => {
  return (
    <img
      className="item-component"
      src={imagePath}
      style={{
        left: offset,
        ...(shouldAnimate && { transition: "left 300ms" }),
      }}
    />
  );
};

export default ItemComponent;
