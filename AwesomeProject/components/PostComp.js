import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Button,
} from "react-native";
import { Image } from "expo-image";

import { gql, useQuery, useMutation } from "@apollo/client";

import { Entypo } from "@expo/vector-icons";

import { useState } from "react";

const Posts = gql`
  query Posts {
    getPosts {
      text
      _id
    }
  }
`;
const DELETE_POST = gql`
  mutation DeletePost($postDeleteInput: ID!) {
    deletePost(id: $postDeleteInput)
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($updatePostId: ID!, $postUpdateInput: PostInput!) {
    updatePost(id: $updatePostId, PostUpdateInput: $postUpdateInput) {
      text
    }
  }
`;

export default function PostComponent({ text, id }) {
  const { data } = useQuery(Posts);
  const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [Posts] });
  const [updatePost] = useMutation(UPDATE_POST, { refetchQueries: [Posts] });
  const [modVisible, setModVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [updateText, setUpdateText] = useState("");
  const [menu, setMenu] = useState();

  return (
    <View
      style={{
        width: "100%",
        height: 150,
        marginTop: 10,
        backgroundColor: "white",
        flex: 1,
        flexDirection: "",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: "row",
          height: "60%",
        }}
      >
        <Image
          source={{
            uri: "https://robohash.org/203.98.77.187.png",
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 15,
            backgroundColor: "#cccccc",
          }}
        />
        <View>
          <Text>Corner</Text>
          <Text style={{ color: "#a9a9a9" }}>6 минутын өмнө</Text>
        </View>
        <View style={{ width: "20%", height: "auto" }}></View>

        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setMenu(!menu)}>
            <Entypo name="dots-three-vertical" size={24} color="#cccccc" />
          </TouchableOpacity>
          <View
            style={{
              display: menu ? "flex" : "none",
              position: "absolute",
              width: 100,
              right: 0,
              top: 30,
              borderWidth: 1,
              backgroundColor: "#ffffff",
              height: 80,
            }}
          >
            <TouchableOpacity activeOpacity={0.2}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setModVisible(!modVisible);
                }}
                style={{ width: "100%", height: 500 }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TextInput
                      style={{
                        height: 50,
                        width: 200,
                        margin: 12,
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 10,
                      }}
                      placeholder="Text"
                      onChangeText={(el) => setUpdateText(el)}
                      value={updateText}
                    />
                    <TouchableOpacity activeOpacity={0}>
                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => Update(_id)}
                      >
                        <Text style={styles.textStyle}>Update</Text>
                      </Pressable>
                    </TouchableOpacity>
                    <Button
                      title="Close"
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModVisible(!modVisible)}
                    ></Button>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>

            <TouchableOpacity
              onClick={() =>
                deletePost({
                  variables: {
                    postCreateInput: id,
                  },
                })
              }
              style={{
                padding: 10,
                borderWidth: 1,
                width: "100%",
                height: "60%",
                backgroundColor: "#ccc",
              }}
            >
              <Text>🗑</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          width: 60,
          height: 60,
          paddingLeft: "8%",
          paddingRight: "8%",
          flex: 1,
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          height: "40%",
          width: "100%",
        }}
      >
        <Text style={{ fontSize: 20 }}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    flex: 1,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    border: "1px solid black",
  },
});
