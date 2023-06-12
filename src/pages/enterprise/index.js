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

export default function Register(route) {
  const [idEnterprise, setIdEnterprise] = useState("");
  const navigation = useNavigation();
  const [mostrarConcluido, setInput] = useState(false);


  const schemaRegister = yup.object({
    branch: yup.string().required("Informe o Nome da Empresa"),
    number: yup
      .number()
      .typeError("Número inválido")
      .required("Informe o Número"),
    street: yup.string().required("Informe a Rua"),
    neighborhood: yup.string().required("Informe o Bairro"),
    city: yup.string().required("Informe a Cidade"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaRegister),
  });

  async function saveRegidter(data) {
    try {
      let response = await fetch(`${config.urlRootNode}/create-enterprise`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: data.branch,
          number: data.number,
          street: data.street,
          neighborhood: data.neighborhood,
          city: data.city,
          userId: route.route.params.paramKey,
        }),
      });
      let result = await response.json();

      if (result.success === true)
      {
        setInput(true);
        await AsyncStorage.setItem('idEnterprise', JSON.stringify(result.bodyParser));
      } 
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  }

  function limparValores() {
    setInput(false);
    navigation.navigate("Main");
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Animatable.View
          animation="fadeInLeft"
          delay={600}
          style={styles.containerHeader}
        >
          <Text style={styles.titleMessage}>Cadastrar empresa</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
          {/* Input Branch */}
          <Text style={styles.titleForm}>Nome da empresa</Text>
          <Controller
            control={control}
            name="branch"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe o nome da empresa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.branch && (
            <Text style={styles.labelError}>{errors.branch?.message}</Text>
          )}

          {/* Input Number */}
          <Text style={styles.titleForm}>Número</Text>
          <Controller
            control={control}
            name="number"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe o Número"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
              />
            )}
          />
          {errors.number && (
            <Text style={styles.labelError}>{errors.number?.message}</Text>
          )}

          {/* Input Street */}
          <Text style={styles.titleForm}>Rua</Text>
          <Controller
            control={control}
            name="street"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe a Rua"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.street && (
            <Text style={styles.labelError}>{errors.street?.message}</Text>
          )}

          {/* Input Neighborhood */}
          <Text style={styles.titleForm}>Bairro</Text>
          <Controller
            control={control}
            name="neighborhood"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe o bairro"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.neighborhood && (
            <Text style={styles.labelError}>
              {errors.neighborhood?.message}
            </Text>
          )}

          {/* Input City */}
          <Text style={styles.titleForm}>Cidade</Text>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.user}
                placeholder="Informe a cidade"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.city && (
            <Text style={styles.labelError}>{errors.city?.message}</Text>
          )}

          {/* Botão */}
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={handleSubmit(saveRegidter)}
            >
              Cadastrar
            </Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal
            style={styles.bxModal}
            animationType="slide"
            transparent={mostrarConcluido}
            visible={mostrarConcluido}
          >
            <View style={styles.bxModal}>
              <Text style={styles.txtModal}> Empresa Cadastrada </Text>
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
    marginTop: 15.5,
  },
  user: {
    fontSize: 15.5,
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
