import React, {useState, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import config from '../../../config/config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from "yup";

const schemaLogin = yup.object({
    email: yup.string().email('E-mail Invalido').required('Informe seu e-mail'),
    password: yup.string().min(6, 'Sua senha deter pelo menos 6(seis) digitos').required('Informe sua senha')
});

export default function Login() {
    const [mostrarErro, setInputErro] = useState(false)
    const navigation = useNavigation();
    const { control, handleSubmit, reset, formState: {errors}} = useForm({
        resolver: yupResolver(schemaLogin)
    });

    async function SignIn(data) {
        try {
                let response = await fetch(`${config.urlRootNode}/read/${encodeURIComponent(data.email)}`, {
                    method: 'GET',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                });
                let result = await response.json();
                console.log(result)

                if (result.idUser)
                {
                    await AsyncStorage.setItem('userData', JSON.stringify(result.user));
                    await AsyncStorage.setItem('idEnterprise', JSON.stringify(result.idEnterprise));
                    reset();
                    navigation.navigate('Main');
                }
                else if (!result.idUser)
                    return setInputErro(true);
                else
                    console.error('Erro na requisição:', response.statusText);
            } 
            catch (error) {
                console.error('Erro na requisição:', error);
            }
    };

    function limparValores()
    {
      setInputErro(false);
    };

    return(
        <View style={styles.container}>

            <Animatable.View animation="fadeInLeft" delay={500}style={styles.containerHeader}>
                <Text style={styles.message}>Bem vindo</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" style={styles.containerForm}>

                <Text style={styles.title}>E-mail</Text>
                <Controller
                 control={control}
                 name='email'
                 render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput 
                     style={styles.user} 
                     placeholder='Digite seu usuario'
                     onBlur={onBlur}
                     clearButtonMode='while-editing'
                     onChangeText={onChange}
                     value={value}
                    />
                 )}
                />
                {errors.email && <Text style={styles.labelError}>{errors.email?.message}</Text>}

                <Text style={styles.title}>Senha</Text>
                <Controller
                 control={control}
                 name='password'
                 render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput 
                     style={styles.user} 
                     placeholder='Digite sua senha'
                     secureTextEntry={true}
                     onBlur={onBlur}
                     onChangeText={onChange}
                     value={value}
                    />
                 )}
                />
                {errors.password && <Text style={styles.labelError}>{errors.password?.message}</Text>}


                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText} onPress={handleSubmit(SignIn)}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonRegister}>
                    <Text style={styles.RegisterText} onPress={() => navigation.navigate('Register')}>
                        Cadastre-se
                    </Text>
                </TouchableOpacity>
                <Modal 
                       style = {styles.bxModal}
                       animationType = 'slide'
                       transparent = { mostrarErro }
                       visible = { mostrarErro }> 
                                           
                    <View style = {styles.bxModal}>
                        <Text style = { styles.txtModal }> Usuário/Senha Incorretos! </Text>
                        <Button
                             title = 'Fechar'
                             onPress = { () => limparValores() }
                             color="#33CCFF"
                        />

                    </View>
                </Modal>
            </Animatable.View>

        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#33CCFF',
    },
    containerHeader: {
        marginBottom: '14%',
        paddingStart: '5%',
        marginBottom: '8%',
    },
    message: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    containerForm:{
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    }, 
    title: {
        fontSize: 20,
        marginTop: 28,
    },
    user: {
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#33CCFF',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonRegister: {
        marginTop: 14,
        alignSelf: 'center',
    },
    RegisterText: {
        color: '#A1A1A1',
    },
    labelError: {
        alignSelf: 'flex-start',
        color: '#FF375B',
        marginBottom: 8,
    },
    bxModal: {
        backgroundColor: '#FFFF',
        margin: 20,
        padding: 20,
        marginTop: 220,
        borderRadius: 7,
        elevation: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2.7,
        borderColor: '#33CCFF',
    },
    txtModal: {
        fontSize: 17,
        fontWeight: 'bold',
        padding: 20,
    },
});
