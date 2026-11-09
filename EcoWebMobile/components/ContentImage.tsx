import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, ImageProps, StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";

/** Preserva o espaço da imagem quando o conteúdo está ausente ou o link falha. */
export function ContentImage({ source, style, onError, ...props }: ImageProps) {
  const [failedUri, setFailedUri] = useState<string>();
  const uri = Array.isArray(source) ? source[0]?.uri : source && typeof source === "object" ? source.uri : undefined;
  if (typeof source !== "number" && (!uri || failedUri === uri)) {
    return <View style={[style, styles.placeholder]} accessible={false}><Ionicons name="image-outline" size={28} color={Colors.primary} /></View>;
  }
  return <Image {...props} source={source} style={style} onError={(event) => { setFailedUri(uri); onError?.(event); }} />;
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: Colors.neutral, alignItems: "center", justifyContent: "center" },
});
