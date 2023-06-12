import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import {  Avatar } from '@rneui/themed';
import { FontAwesome5 } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Main() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const DATA = [
        { id: '1', iconName: 'tools', description: 'Ordem de Serviço', nagation: 'ServiceOrdens' },
        { id: '2', iconName: 'calendar-check', description: 'Agenda',nagation: '' },
        { id: '3', iconName: 'tasks', description: 'Tarefas',nagation: 'Tasks' },
        { id: '4', iconName: 'dollar-sign', description: 'Validação/Orçamento',nagation: 'Validation' },
        { id: '5', iconName: 'file-export', description: 'Nota Fiscal',nagation: '' },
        { id: '6', iconName: 'comment-dots', description: 'Entre em contato',nagation: '' },
    ]
    
    function primeiraLetraMaiuscula(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    async function getUserData() {
        try {
          const userData = await AsyncStorage.getItem('userData');

          if (userData) {
            const data = JSON.parse(userData);
            const nomeUser = primeiraLetraMaiuscula(data);
            return nomeUser;
          }
          return null;

        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
          return null; 
        }
      }

    useEffect(() => {
        async function fetchUserData() {
          const userData = await getUserData();
          setUser(userData);
        }
      
        fetchUserData();
    }, []);

    const Item = ({ iconName, description, onPress }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.item} onPress={onPress}>
                {iconName ? (
                  <FontAwesome5 name={iconName} size={40} color="black" />
                ) : (
                  <View style={styles.emptyIcon} />
                )}
            </TouchableOpacity>
          <Text style={styles.description}>{description}</Text>
        </View>
    );
    
    const renderItem = ({ item }) => (
        <Item iconName={item.iconName}
              description={item.description}
              onPress={() => navigation.navigate(item.nagation)}
        />
    );

    return(
        <View style={styles.container}>
            <Animatable.View animation="fadeInLeft" delay={500}style={styles.containerHeader}>
            <View style={styles.avatar}>
                <Avatar
                  size={58}
                  rounded
                  source={{ uri: "https://randomuser.me/api/portraits/men/36.jpg" }}
                  avatarStyle={{
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: 'white',
                  }}
                />
                <View style={{ marginLeft: 10 }}>
                <Text style={styles.titleMessage}>Bem-vindo!</Text>
                {user !== null && (
                  <Text style={styles.subTitleMessage}>{user}</Text>
                )}
                </View>
                <View style={{ marginLeft: '40%'}}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                        <FontAwesome5 name="sign-out-alt" size={25} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
            </Animatable.View>

            <Animatable.View animation="fadeInLeft" style={styles.containerForm}>
                <Text style={styles.title}>Opções</Text>
                <FlatList style={styles.list}
                    data={DATA}
                    contentContainerStyle={styles.listContent}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                />
            
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#33CCFF',
    },
    containerHeader: {
        marginBottom: 30,
        paddingStart: 5,
        // marginBottom: 8,
    },
    containerForm: {
        backgroundColor: '#FFF',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: 0,
        paddingEnd: 0,
    },
    item: {
        backgroundColor: '#FFFF',
        marginHorizontal: '1.0%',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#33CCFF',
        width: '50%',
        aspectRatio: 1,
        shadowColor: 'rgba(1, 1, 1, 1)',
        shadowOffset: {
            width: 30,
            height: 100,
        },
        shadowOpacity: 3,
        shadowRadius: 5,
        elevation: 15,
    },
      listContent: {
        justifyContent: 'space-between', // Distribuir os itens igualmente no eixo principal (horizontal)
        alignItems: 'center', // Centralizar horizontalmente os itens dentro do FlatList
        flexDirection: 'row', // Organizar os itens em uma linha
        flexWrap: 'wrap', // Quebrar a linha quando não houver espaço suficiente
        paddingHorizontal: '0%', // Adicionar espaçamento horizontal externo para centralizar os itens
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
    },
    list: {
        marginTop: '10%',
        marginRight: 5,
        marginLeft: -10
    },
    titleMessage: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: '2%'
    },
    subTitleMessage: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: '2%'
    },
    description: {
        alignSelf: 'center', // Centraliza verticalmente a descrição
        marginTop: 5,
        marginBottom: 5,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold', 
    },
    itemContainer: {
        alignItems: 'center',
        marginBottom: 10, // Adicione espaçamento entre cada item e sua descrição
    },
    listContent: {
        justifyContent: 'center', // Distribui os itens igualmente no eixo principal (vertical)
        alignItems: 'center', // Centraliza horizontalmente os itens dentro do FlatList
    },
    emptyIcon: {
        width: 24,
        height: 24,
    },
    avatar: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: '4%', 
        marginBottom: '5%',
        marginLeft: '2%'
    },
    button: {
        elevation: 2,
    },
});
