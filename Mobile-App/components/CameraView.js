import React, { useState, useEffect } from "react";
import {
  Text,
  StatusBar,
  View,
  TouchableOpacity,
  Alert,
  AsyncStorage,
} from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { Icon } from "react-native-elements";
import * as ImageManipulator from "expo-image-manipulator";

export default function CameraView({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  async function uploadImage(uri) {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        { crop: { originX: 0, originY: 0, width: 2376, height: 3168 } },
        { rotate: 90 },
        { resize: { width: 512, height: 384 } },
      ],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: "base64",
    });

    let data = {
      method: "PUT",
      body: JSON.stringify({
        data: base64,
      }),
    };
    let response = await fetch("http://192.168.1.73:12387/image_upload", data);
    return await response.json();
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
        autoFocus="on"
      >
        <View
          style={{
            flex: 0.2,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="left" type="antdesign" size={50} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 0.1,
              alignSelf: "flex-end",
              alignItems: "center",
            }}
          ></View>
        </View>
        <View
          style={{
            flex: 0.3,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignSelf: "flex-end",
              alignItems: "center",
            }}
            onPress={async () => {
              if (cameraRef) {
                let photo = await cameraRef.takePictureAsync("photo");

                let res = await uploadImage(photo.uri);
                Alert.alert("Predicted: " + res.predicted_class);

                if (res.predicted_class == "cardboard") {
                  let key = parseInt(await AsyncStorage.getItem("@cardboard"));
                  console.log(key)
                  await AsyncStorage.setItem("@cardboard", JSON.stringify(key + 1));
                } else if (res.predicted_class == "glass") {
                  let key = parseInt(await AsyncStorage.getItem("@glass"));
                  await AsyncStorage.setItem("@glass", JSON.stringify(key + 1));
                } else if (res.predicted_class == "metal") {
                  let key = parseInt(await AsyncStorage.getItem("@metal"));
                  await AsyncStorage.setItem("@metal", JSON.stringify(key + 1));
                } else if (res.predicted_class == "organtic") {
                  let key = parseInt(await AsyncStorage.getItem("@organtic"));
                  await AsyncStorage.setItem("@organtic", JSON.stringify(key + 1));
                } else if (res.predicted_class == "paper") {
                  let key = parseInt(await AsyncStorage.getItem("@paper"));
                  await AsyncStorage.setItem("@paper", JSON.stringify(key + 1));
                } else if (res.predicted_class == "plastic") {
                  let key = parseInt(await AsyncStorage.getItem("@plastic"));
                  await AsyncStorage.setItem("@plastic", JSON.stringify(key + 1));
                } else if (res.predicted_class == "trash") {
                  let key = parseInt(await AsyncStorage.getItem("@trash"));
                  await AsyncStorage.setItem("@trash", JSON.stringify(key + 1));
                }
              }
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "stretch",
                backgroundColor: "transparent",
                width: "100%",
              }}
            >
              <Icon
                name="ios-add-circle-outline"
                size={100}
                type="ionicon"
                color="#77dd77"
              />
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
