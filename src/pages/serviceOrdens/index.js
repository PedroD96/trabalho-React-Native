import * as React from 'react';
import { useState, useEffect } from 'react';
import { View,
         Text,
         StyleSheet,
         Image,
         TouchableOpacity,
         FlatList,
         TextInput,
         ScrollView,
         KeyboardAvoidingView,
         Modal,
         Button } from "react-native";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as Animatable from "react-native-animatable"
import * as ImagePicker from 'expo-image-picker'
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';
import config from "../../../config/config.json";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ServiceOrdens() {
    const schemaRegister = yup.object({
        typeService: yup.string().required("Informe o tipo de serviço"),
        sector: yup.string().required("Informe o setor"),
        description: yup.string().required("Informe os detalhes da solicitação")
      });

    const navigation = useNavigation();

    const [idEnterprise, setIdEnterprise] = useState('');
    AsyncStorage.getItem('idEnterprise')
                        .then((idEnterprise) => {
                          setIdEnterprise(idEnterprise)
                        })

    const [mostrarConclusao, setInputCadastroOS] = useState(false);
    function limparValores()
    {
      setInputCadastroOS(false);
      reset();
      navigation.navigate("Main");
    };

    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);


    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    if(hasGalleryPermission === false)
    {
        return <Text>No access to Internal Storage</Text>
    }

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schemaRegister),
    });

    async function saveOS(data)
    {
        try {
            let response = await fetch(`${config.urlRootNode}/create-orderService`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
              body: JSON.stringify({
                typeService: data.typeService,
                step: 1,
                sector: data.sector,
                descriptionService: data.description,
                enterpriseId: idEnterprise,
                image: image,
              }),
            });
            let result = await response.json();
      
            if (result.success === true)
            {
                setInputCadastroOS(true);
            } 
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
                <Animatable.View animation="fadeInLeft" delay={500}style={styles.containerHeader}>
                    <Text style={styles.titleMessage}>Gerando Ordem de Serviço   </Text>
                    <FontAwesome5 name="wpforms" size={44} color="white" style={{ marginTop: '1%' }}  />
                </Animatable.View>
            

                <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.titleForm}>Tipo de Serviço</Text>
                <Controller
                    control={control}
                    name="typeService"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View>
                            <Picker
                                style={styles.picker}
                                selectedValue={value}
                                onBlur={onBlur}
                                onValueChange={onChange}
                                value={value}
                            >
                                <Picker.Item label="Selecione a categoria" value="" />
                                <Picker.Item label="Eletrônicos" value="Eletronicos" />
                                <Picker.Item label="Manutenção Geral" value="Manutenção     Geral" />
                                <Picker.Item label="Vestuário" value="vestuário" />
                            </Picker>
                        </View>
                        )}
                />
                {errors.typeService && (
                    <Text style={styles.labelError}>{errors.typeService?.message}</Text>
                )}

                <Text style={styles.titleForm}>Setor</Text>
                <Controller
                  control={control}
                  name="sector"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <Picker
                        style={styles.picker}
                        selectedValue={value}
                        onBlur={onBlur}
                        onValueChange={onChange}
                        value={value}
                      >
                        <Picker.Item label="Selecione a categoria" value="" />
                        <Picker.Item label="Eletrônicos" value="Eletrônicos" />
                        <Picker.Item label="Eletrodomésticos" value="Eletrodomésticos" />
                        <Picker.Item label="Móveis" value="Móveis" />
                        <Picker.Item label="Informática" value="Informática" />
                        <Picker.Item label="Telefonia" value="Telefonia" />
                        <Picker.Item label="Moda" value="Moda" />
                        <Picker.Item label="Beleza e Saúde" value="Beleza e Saúde" />
                        <Picker.Item label="Games e Entretenimento" value="Games e Entretenimento" />
                        <Picker.Item label="Esportes e Lazer" value="Esportes e Lazer" />
                        <Picker.Item label="Livros e Papelaria" value="Livros e Papelaria" />
                        <Picker.Item label="Administrativo" value="Administrativo" />
                      </Picker>
                    </View>
                  )}
                />
                {errors.sector && (
                    <Text style={styles.labelError}>{errors.sector?.message}</Text>
                )}

                <Text style={styles.titleForm}>Descrição</Text>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.descricao}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            value={value}
                            editable={true}
                            multiline={true}
                            textAlignVertical="top"
                        />
                    )}
                    />
                    {errors.description && (
                        <Text style={styles.labelError}>{errors.description?.message}</Text>
                    )}

                <View style={styles.anexoContainer}>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => pickImage()}>
                        <Text style={styles.anexo}>Anexe uma imagem</Text>
                        {image && <Image source={{ uri: image }} style={styles.image}/>}
                    </TouchableOpacity>
                    <AntDesign name="paperclip" size={24} color="#006400" />
                  </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit(saveOS)}>
                        <Text style={styles.txtButton}>Enviar</Text>
                </TouchableOpacity>

                <Modal style = {styles.bxModal}
                         animationType = 'slide'
                         transparent = { mostrarConclusao }
                         visible = { mostrarConclusao }
                         >
                  <View style = {styles.bxModal}>
                    <Text style = { styles.txtModal }> Ordem de Serviço cadastrada{'\n              '} com sucesso! </Text>
                    <Button
                        title = 'Ok'
                        onPress = { () => limparValores() }
                    />
                  </View>
                </Modal>


            </Animatable.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#33CCFF',
    },
    containerHeader: {
        flexDirection: 'row',
        marginBottom: 30,
        paddingStart: 5,
        // marginBottom: 8,
    },
    containerForm:{
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
    }, 
    titleMessage: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: '2%',
        marginTop: '3%'

    },
    titleForm: {
        fontSize: 18,
        marginTop: 28,
        fontSize: 17,
        fontWeight: 'bold',
    },
    descricao: {
        height: 100,
        borderWidth: 0,
    },
    button: {
        backgroundColor: '#33CCFF',
        width: '95%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: '10%',
        marginBottom: '10%',
        marginLeft: '2.5%',
    },
    txtButton:{
        color: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
    },
    picker: {
        flex: 1,
        height: 50,
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
    anexoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    anexo: {
        color: '#006400',
        fontSize: 17,
        marginRight: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
