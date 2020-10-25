import React, { useState, useEffect } from "react";
import { View, Button, Text, AsyncStorage } from "react-native";
import { VictoryPie } from "victory-native";

const graphicColor = ["#388087", "#6fb3b8", "#badfe7", "#abcdef"]; // Colors
const wantedGraphicData = [
  { x: "cardboard", y: 0 },
  { x: "glass", y: 0 },
  { x: "metal", y: 20 },
  { x: "organtic", y: 20 },
  { x: "paper", y: 20 },
  { x: "plastic", y: 20 },
  { x: "trash", y: 20 },
]; // Data that we want to display
const defaultGraphicData = [
  { x: "cardboard", y: 0 },
  { x: "glass", y: 0 },
  { x: "metal", y: 0 },
  { x: "organtic", y: 0 },
  { x: "paper", y: 0 },
  { x: "plastic", y: 0 },
  { x: "trash", y: 0 },
]; // Data used to make the animate prop work

export default function Home({ navigation }) {
  const [graphicData, setGraphicData] = useState(defaultGraphicData);

  useEffect(() => {
    setGraphicData(wantedGraphicData); // Setting the data that we want to display
  }, []);

  async function buildData() {
    const valueCardboard = parseInt(await AsyncStorage.getItem("@cardboard"));
    const valueGlass = parseInt(await AsyncStorage.getItem("@glass"));
    const valueMetal = parseInt(await AsyncStorage.getItem("@metal"));
    const valueOrgantic = parseInt(await AsyncStorage.getItem("@organtic"));
    const valuePaper = parseInt(await AsyncStorage.getItem("@paper"));
    const valuePlastic = parseInt(await AsyncStorage.getItem("@plastic"));
    const valueTrash = parseInt(await AsyncStorage.getItem("@trash"));

    const total =
      valueCardboard +
      valueGlass +
      valueMetal +
      valueOrgantic +
      valuePaper +
      valuePlastic +
      valueTrash;
    console.log("TOTAL" + total);
    const cardboardPrecent = (100 * valueCardboard) / total;
    const glassPrecent = (100 * valueGlass) / total;
    const metalPrecent = (100 * valueMetal) / total;
    const organticPrecent = (100 * valueOrgantic) / total;
    const paperPrecent = (100 * valuePaper) / total;
    const plasticPrecent = (100 * valuePlastic) / total;
    const trashPrecent = (100 * valueTrash) / total;

    const totalPercent =
      cardboardPrecent +
      glassPrecent +
      metalPrecent +
      organticPrecent +
      paperPrecent +
      plasticPrecent +
      trashPrecent;

    console.log("TOTAL PERCENT" + totalPercent);

    return [
      { x: "cardboard", y: cardboardPrecent },
      { x: "glass", y: glassPrecent },
      { x: "metal", y: metalPrecent },
      { x: "organtic", y: organticPrecent },
      { x: "paper", y: paperPrecent },
      { x: "plastic", y: plasticPrecent },
      { x: "trash", y: trashPrecent },
    ];
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 50,
          marginBottom: 10,
          color: "black",
          fontWeight: "bold",
        }}
      >
        HELLO WORLD
      </Text>
      <View
        style={{
          flex: 0.2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <Button
        title="INVIS"
        onPress={async () => {
          let data = await buildData();
          setGraphicData(data);
        }}
      />
      <Text
        style={{
          fontSize: 30,
          color: "black",
          fontWeight: "bold",
        }}
      >
        Your Weekly Output:
      </Text>
      <VictoryPie
        animate={{ easing: "exp", duration: 2000 }}
        data={graphicData}
        width={250}
        height={250}
        colorScale={graphicColor}
        innerRadius={50}
      />
      <Button
        title="Change chart data"
        onPress={async () => {
          let data = await buildData();
          setGraphicData(data);
        }}
      />
      <Button
        title="Classify Now!"
        color="#841584"
        onPress={() => navigation.push("Camera")}
      />
    </View>
  );
}
