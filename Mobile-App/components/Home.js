import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  AsyncStorage,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { VictoryPie } from "victory-native";
import { Icon } from "react-native-elements";

const fullGraphicColor = [
  "#77DD77",
  "#A8CCD7",
  "#676767",
  "#E8E2C4",
  "#AC9D8E",
  "#FFB347",
  "#4B4B4C",
]; // Colors
defaultGraphicColor = ["#F2F2F2"];

const wantedGraphicData = [{ x: " ", y: 100 }]; // Data that we want to display
const defaultGraphicData = [
  { x: "organtic", y: 0 },
  { x: "cardboard", y: 0 },
  { x: "glass", y: 0 },
  { x: "metal", y: 0 },
  { x: "paper", y: 0 },
  { x: "plastic", y: 0 },
  { x: "trash", y: 0 },
]; // Data used to make the animate prop work

export default function Home({ navigation }) {
  const [graphicData, setGraphicData] = useState(defaultGraphicData);
  const [graphicColor, setGraphicColor] = useState(defaultGraphicColor);

  useEffect(() => {
    setGraphicData(wantedGraphicData); // Setting the data that we want to display
  }, []);

  async function clearLocalData() {
    await AsyncStorage.setItem("@cardboard", JSON.stringify(0));
    await AsyncStorage.setItem("@glass", JSON.stringify(0));
    await AsyncStorage.setItem("@metal", JSON.stringify(0));
    await AsyncStorage.setItem("@organtic", JSON.stringify(0));
    await AsyncStorage.setItem("@paper", JSON.stringify(0));
    await AsyncStorage.setItem("@plastic", JSON.stringify(0));
    await AsyncStorage.setItem("@trash", JSON.stringify(0));
  }

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
    setGraphicColor(fullGraphicColor);
    return [
      { x: "Organic", y: organticPrecent },
      { x: "Glass", y: glassPrecent },
      { x: "Metal", y: metalPrecent },
      { x: "Paper", y: paperPrecent },
      { x: "Cardboard", y: cardboardPrecent },
      { x: "Plastic", y: plasticPrecent },
      { x: "Trash", y: trashPrecent },
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
      <StatusBar hidden />
      <Text
        style={{
          fontSize: 50,
          marginBottom: 10,
          color: "#60a05b",
          fontWeight: "bold",
        }}
      >
        <Icon name="leaf" type="entypo" size={50} color="#618a3d" />
        ReGreen
      </Text>
      <View
        style={{
          flex: 0.2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <Button title="" />
      <Text
        style={{
          fontSize: 30,
          color: "black",
          fontWeight: "bold",
        }}
      >
        Your Weekly Output:
      </Text>
      <TouchableOpacity
        onPress={async () => {
          let data = await buildData();
          setGraphicData(data);
        }}
        activeOpacity={1}
      >
        <VictoryPie
          animate={{ easing: "exp", duration: 2000 }}
          data={graphicData}
          width={340}
          height={300}
          colorScale={graphicColor}
          innerRadius={55}
        />
      </TouchableOpacity>
      <View
        style={{
          flex: 0.2,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></View>
      <View
        style={{
          flex: 0.25,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: 10,
            backgroundColor: "#abcabb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              padding: 15,
              fontSize: 20,
              color: "black",
              fontWeight: "bold",
            }}
            onPress={() => navigation.push("Camera")}
          >
            Scan Now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
