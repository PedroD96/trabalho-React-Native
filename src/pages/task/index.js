import * as React from 'react';
import { useState, useEffect } from 'react';
import { View,
        Text,
        StyleSheet,
        Image,
        TouchableOpacity,
        SectionList,
        TextInput,
        ScrollView,
        KeyboardAvoidingView,
        Modal,
        Button} from "react-native";
import * as Animatable from "react-native-animatable"
import { Icon } from 'react-native-elements';
import { FontAwesome5 } from '@expo/vector-icons';
import config from "../../../config/config.json";
    
export default function Tasks() {
    const [lista, setLista] = useState([]);
    useEffect(() => {
        async function carregarOrdens() {
            try {
                let response = await fetch(`${config.urlRootNode}/read-orderServicesAproved`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                let result = await response.json();

                if(result !== null)
                {
                    setLista(result)
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
            }
        }
    
        carregarOrdens();
    }, []);

    async function carregarOrdens() {
        try {
            let response = await fetch(`${config.urlRootNode}/read-orderServices`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let result = await response.json();

            if(result !== null)
            {
                setLista(result)
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView>
                <Animatable.View animation="fadeInLeft" delay={500}style={styles.containerHeader}>
                    <Text style={styles.titleMessage}>Lista de Tarefas</Text>
                </Animatable.View>
                <Animatable.View animation="fadeInUp" style={styles.containerForm}>
                    {lista.length > 0 ? (
                        <SectionList 
                          sections={[{ data: lista }]}
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) => (
                            <View style={styles.itens}>
                                <View style={styles.titulos}>
                                    <Text style={styles.text}> Id Ordem de Servico: {item.id}</Text>
                                    <Text style={styles.text}> IdEmpresa: {item.enterpriseId}</Text>
                                    <Text style={styles.text}> Sector: {item.sector}</Text>
                                    <Text style={styles.text}> TypeService: {item.typeService}</Text>
                                    <Text style={[styles.text, {marginBottom: 12}]}> DescriptionProblem: {item.descriptionService}</Text>      
                                </View>
                            </View>
                          )}
                        />
                      ) : (
                        <Text>Nenhum dado disponível</Text>
                      )}
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
    },
    titleMessage: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFF',
      marginLeft: '2%',
      marginTop: '3%',
    },
    containerForm: {
      backgroundColor: '#FFF',
      flex: 1,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingStart: '5%',
      paddingEnd: '5%',
    },
    itens: {
        backgroundColor: "#F8F8F8",
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 5, 
        borderWidth: 2, 
        borderColor: "#33CCFF", 
        shadowColor: "#000", 
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.2, 
        shadowRadius: 2,
        elevation: 2, 
      },
    titulos: {
      flex: 1,
    },
    text: {
      fontSize: 14,
      marginTop: 5,
      flexWrap: 'wrap',
    },
    botoes: {
      flexDirection: 'row',
      marginBottom: 0,
      marginLeft: 1,
      alignItems: 'center',
    },
    botao: {
        width: 42,
        margin: 3,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
  });
  