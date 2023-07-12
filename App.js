import * as React from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput, Dimensions, TouchableHighlight, StatusBar, Alert, Linking } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import db from './db/quran.json';
import { SimpleLineIcons } from '@expo/vector-icons';

function Surah({ navigation, route }){
  const { surah } = route.params;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.header}>{surah.name}</Text>
      <Text style={styles.header}>{surah.transliteration}</Text>
      <Text style={styles.text}>{surah.translation}</Text>
      <Text style={styles.text}>{surah.type}</Text>
      <Text style={styles.text}>{surah.total_verses} verses</Text>
      {
        surah.verses?.map((verse,index) => (
          <View style={styles.body}
          key={index}>
            <Text style={styles.center}>{verse.id}</Text>
            <Text style={styles.bodyText}>{verse.text}</Text>
            <Text style={styles.bodyText}>{verse.translation}</Text>
            </View>
        ))
      }
    </ScrollView>
  )
}


function SearchBar({navigation}){
  const [data,setData] = React.useState([...db]);
  const [originalData,setOriginalData] = React.useState([...db]);

  function filterData(query){
    if (query) {
      let upperQuery = query.toUpperCase();
    let filteredArray = []
    originalData.filter((surahObj) => {
      let upperBody = (surahObj.name + surahObj.translation + surahObj.transliteration + surahObj.type);
      let context = ''
      surahObj.verses.forEach((verse) => {
        context += verse.translation
      })
      let wholeQuery = (upperBody + context).toUpperCase()
      if (wholeQuery.includes(upperQuery)) {
        filteredArray.push(surahObj)
      }
    })
    setData(filteredArray)
    }else{
      setData(originalData)
    }
  }


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:() => <TextInput autoCorrect={false} onChangeText={(query) => filterData(query)} placeholder='Search...' style={styles.searchBar} />,
      headerRight:() => <SimpleLineIcons onPress={() => Alert.alert('Need more information?',`Do you have any comment about the book?`,[
        {
          text:'Yes',
          onPress:() => Linking.openURL(`https://www.techmaktab.com/quran`)
        },
        {
          text:'No'
        }
      ])} name="question" size={20} color="black" style={{marginRight:10}} />
    })
  },[navigation])

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.searchContainer}>
        {
          data.map((surah,index) => (
            <TouchableHighlight 
            underlayColor={'#228b22'}
            onPress={() => navigation.navigate(`${surah.id + '. ' +  surah.translation}`,{surah})}
            key={index}>
              <View 
            style={styles.searchItem}
            >
              <Text style={styles.header}>{surah.id}. {surah.translation} {surah.name}</Text>
              <Text style={styles.text}>{surah.transliteration} {surah.total_verses} verses</Text>
            </View>
            </TouchableHighlight>
          ))
        }
      </View>
    </ScrollView>
  )
}

const Drawer = createDrawerNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};


export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Drawer.Navigator screenOptions={{
        headerStyle:{
          backgroundColor:'#faf0e6'
        }
      }}>
      <Drawer.Screen 
            key={0.1} 
            name={'Search'} 
            component={SearchBar} 
             />
        {
          db.map((surah,index) => (
            <Drawer.Screen 
            key={index} 
            name={surah.id + '. ' + surah.translation} 
            component={Surah} 
            options={{ headerTitle:surah.translation }} 
            initialParams={{surah}} />
          ))
        }
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#faf0e6'
  },
  header:{
    fontSize:18,
    textAlign:'center',
    fontWeight:'bold'
  },
  text:{
    fontSize:18,
    textAlign:'center'
  },
  body:{
    padding:10,
    borderBottomWidth:0.5
  },
  bodyText:{
    fontSize:18
  },
  center:{
    fontSize:18,
    textAlign:'center',
    marginBottom:10
  },
  searchBar:{
    borderWidth:0.3,
    width:200,
    padding:10,
    borderRadius:5
  },
  searchContainer:{
    flexDirection:'column',
    gap:5,
    paddingTop:10
  },
  searchItem:{
    width:Dimensions.get('screen').width,
    padding:10,
    borderWidth:0.3,
    borderRadius:10,
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    width:Dimensions.get('screen').width
  }
})