import * as React from "react";

interface Props {}

export const LayoutTemplate: React.SFC<Props> = props => {
  return (
    <div>
      <div>{props.children}</div>
    </div>
  );
};
