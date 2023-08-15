import {
  Text,
  View,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import { gql, useQuery, useMutation } from "@apollo/client";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Entypo, AntDesign } from "@expo/vector-icons";
import PostComponent from "./PostComp";
import { useState } from "react";

export default function Main() {
  const Posts = gql`
    query Posts {
      getPosts {
        text
      }
    }
  `;

  const CREATE_POST = gql`
    mutation CreatePost($postCreateInput: PostInput!) {
      createPost(PostCreateInput: $postCreateInput) {
        text
      }
    }
  `;

  const { data } = useQuery(Posts);
  console.log("data", data);
  const [createPost] = useMutation(CREATE_POST, {
    refetchQueries: [Posts],
  });

  const [text, setText] = useState("");
  const [id, setId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#cccccc",
        overflow: "scroll-x",
      }}
    >
      <ScrollView>
        {data?.getPosts.map((el, i) => {
          return <PostComponent text={el.text} id={el._id} key={i} />;
        })}
      </ScrollView>
      <StatusBar style="auto" />
      <TouchableOpacity activeOpacity={0.2}>
        <View
          style={{
            width: 60,
            height: 60,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            backgroundColor: "green",
            position: "absolute",
            right: 10,
            bottom: 50,
          }}
        >
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => [setModalVisible(true)]}
          >
            <AntDesign name="plus" size={24} color="white" />
          </Pressable>
        </View>
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
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
                onChangeText={(el) => setText(el)}
                value={text}
              />
              <TouchableOpacity activeOpacity={0.1}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() =>
                    createPost({
                      variables: {
                        postCreateInput: {
                          text: text,
                        },
                      },
                    })
                  }
                >
                  <Text style={styles.textStyle}>
                    <AntDesign name="plus" size={24} color="white" />
                  </Text>
                </Pressable>
              </TouchableOpacity>
              <Button
                title="Close"
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              ></Button>
            </View>
          </View>
        </Modal>
      </TouchableOpacity>
    </SafeAreaView>
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
