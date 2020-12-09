import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {DummyBath} from '../../assets';
import {Button, Header, HeaderProfile, ListItem} from '../../components';

const Home = ({navigation}) => {
  return (
    <View>
      <Header title="Home" headertype="no-icon" />
      <View>
        <HeaderProfile />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <ListItem point={20} title="Bath" avatar={DummyBath} time="07:00" />
          <ListItem point={20} title="Bath" avatar={DummyBath} time="08:00" />
          <ListItem point={20} title="Bath" avatar={DummyBath} time="08:00" />
          <ListItem point={20} title="Bath" avatar={DummyBath} time="08:00" />
          <ListItem point={20} title="Bath" avatar={DummyBath} time="08:00" />
          <ListItem point={20} title="Bath" avatar={DummyBath} time="08:00" />
          <ListItem point={20} title="Bath" avatar={DummyBath} time="08:00" />
        </View>
      </ScrollView>
      <View style={styles.floatbutton}>
        <Button
          type="icon-plus"
          onPress={() => navigation.navigate('TaskAdd')}
        />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 200,
  },
  floatbutton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 720,
    right: 10,
  },
});
