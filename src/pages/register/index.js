import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Button,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../../config/config.json";

export default function Register() {
  const navigation = useNavigation();
  const [mostrarConcluido, setInput] = useState(false);

  const schemaRegister = yup.object({
    username: yup.string().required("Informe seu Nome e Sobrenome"),
    email: yup.string().email("E-mail Invalido").required("Informe seu e-mail"),
    password: yup
      .string()
      .min(6, "Sua senha deter pelo menos 6(seis) digitos")
      .required("Informe sua senha"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Senhas não conferem"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaRegister),
  });

  const [idUser, setIdUser] = useState("");
  async function saveRegidter(data) {
    try {
      let response = await fetch(`${config.urlRootNode}/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      let result = await response.json();

      if (result.success === true) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.username));
        setIdUser(result.bodyParser);
        setInput(true);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  function limparValores() {
    setInput(false);
    navigation.navigate("Enterprise", {
      paramKey: idUser,
    });
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <Animatable.View
          animation="fadeInLeft"
          delay={600}
          style={styles.containerHeader}
        >
          <Text style={styles.titleMessage}>Cadastro de Usuário</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          <Text style={styles.titleForm}>Informe Seu Nome</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe nome e sobrenome"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.username && (
            <Text style={styles.labelError}>{errors.username?.message}</Text>
          )}

          <Text style={styles.titleForm}>E-mail</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="informe seu e-mail"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.labelError}>{errors.email?.message}</Text>
          )}

          <Text style={styles.titleForm}>Senha</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe uma senha"
                secureTextEntry={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Text style={styles.titleForm}>Confirme a Senha</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Confirme sua senha"
                secureTextEntry={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={styles.labelError}>
              {errors.confirmPassword?.message}
            </Text>
          )}

          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={handleSubmit(saveRegidter)}
            >
              Cadastrar
            </Text>
          </TouchableOpacity>

          <Modal
            style={styles.bxModal}
            animationType="slide"
            transparent={mostrarConcluido}
            visible={mostrarConcluido}
          >
            <View style={styles.bxModal}>
              <Text style={styles.txtModal}> Usuário Cadastrado </Text>
              <Button
                title="Fechar"
                onPress={() => limparValores()}
                color="#33CCFF"
              />
            </View>
          </Modal>
        </Animatable.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#33CCFF",
  },
  containerHeader: {
    marginBottom: "14%",
    padding: "14%",
  },
  titleMessage: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
  },
  containerForm: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  titleForm: {
    fontSize: 18,
    marginTop: 28,
  },
  register: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  password: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  confirmPassword: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#33CCFF",
    width: "95%",
    borderRadius: 4,
    paddingVertical: 8,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  labelError: {
    alignSelf: "flex-start",
    color: "#FF375B",
    marginBottom: 8,
  },
  bxModal: {
    backgroundColor: "#FFFF",
    margin: 20,
    padding: 20,
    marginTop: 220,
    borderRadius: 7,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.7,
    borderColor: "#33CCFF",
  },
  txtModal: {
    fontSize: 17,
    fontWeight: "bold",
    padding: 20,
  },
});
