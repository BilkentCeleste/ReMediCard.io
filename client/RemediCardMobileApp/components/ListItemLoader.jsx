import React from "react";
import { View } from "react-native";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";

const ListItemLoader = ({ width = 380 }) => (
  <View style={{ padding: 10 }}>
    <ContentLoader
      speed={1.5}
      width={width}
      height={80}
      viewBox={`0 0 ${width} 80`}
      backgroundColor="#f3f3f3"
      foregroundColor="#454444"
    >
      <Rect x="80" y="20" rx="4" ry="4" width="200" height="10" />
      <Rect x="80" y="40" rx="3" ry="3" width="150" height="10" />
    </ContentLoader>
  </View>
);

export default ListItemLoader;
