import * as React from "react";
import { View } from "react-native";

interface Props {}

export const LayoutTemplate: React.SFC<Props> = props => {
  return (
    <View>
      <View>{props.children}</View>
    </View>
  );
};
