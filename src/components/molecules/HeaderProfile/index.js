import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {ILNullPhoto} from '../../../assets';
import {colors, fonts} from '../../../utils';
import {getData} from '../../../utils/localstorage';

const HeaderProfile = () => {
  const [profile, setProfile] = useState({
    photo: ILNullPhoto,
    name: '',
  });
  useEffect(() => {
    getData('admin').then((res) => {
      const data = res;
      data.photo = {uri: res.photo};
      setProfile(res);
    });
  }, []);
  return (
    <View style={styles.container}>
      <Image source={profile.photo} style={styles.avatar} />
      <View style={styles.text}>
        <Text style={styles.greeting}>Hello, </Text>
        <Text style={styles.name}>{profile.name}</Text>
      </View>
    </View>
  );
};

export default HeaderProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 45,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  avatar: {width: 50, height: 50, borderRadius: 50 / 2, marginRight: 12},
  greeting: {
    fontFamily: fonts.primary[100],
    fontSize: 24,
    color: colors.white1,
  },
  name: {
    fontFamily: fonts.primary[100],
    fontSize: 24,
    color: colors.yellow1,
    textTransform: 'capitalize',
  },
  text: {flexDirection: 'row'},
});
