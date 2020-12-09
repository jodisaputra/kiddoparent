import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-picker';
import {IconAddPhoto, IconRemovePhoto, ILNullPhoto} from '../../assets';
import {Button, Gap, Header, Input, Loading} from '../../components';
import {colors, useForm} from '../../utils';
import {storeData} from '../../utils/localstorage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Register = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  // untuk ganti photo preview
  const [photo, setPhoto] = useState(ILNullPhoto);
  // untuk memunculkan icon remove
  const [hasPhoto, setHasPhoto] = useState(false);
  // upload photo
  const [photoDB, setPhotoDB] = useState('');

  const getImage = () => {
    ImagePicker.launchImageLibrary(
      {quality: 0.5, maxWidth: 300, maxHeight: 300},
      response => {
        console.log('response:', response);
        if (response.didCancel || response.error) {
          showMessage({
            message: 'upss, it looks like you are not uploading a photo',
            type: 'default',
            backgroundColor: colors.errorMessage,
          });
        } else {
          const source = {uri: response.uri};
          setPhotoDB(`data: ${response.type};base64, ${response.data}`);
          setPhoto(source);
          setHasPhoto(true);
        }
      },
    );
  };

  const [form, setForm] = useForm({
    name: '',
    email: '',
    password: '',
  });

  const submitForm = () => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(form.email, form.password)
      .then(success => {
        setLoading(false);
        // reset form setelah daftar
        setForm('reset');
        const data = {
          name: form.name,
          email: form.email,
          uid: success.user.uid,
          photo: photoDB,
        };
        firestore()
          .collection('admin')
          .doc(success.user.uid)
          .set(data);
        // simpan ke local storage
        storeData('admin', data);
        navigation.navigate('Login');
        // console.log('register success', success);
      })
      .catch(error => {
        setLoading(false);
        var errorMessage = error.message;
        showMessage({
          message: errorMessage,
          type: 'default',
          backgroundColor: colors.errorMessage,
        });
        console.log('error register', errorMessage);
      });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Header onPress={() => navigation.goBack()} title="Register" />
        <View style={styles.page}>
          <View style={styles.profile}>
            <TouchableOpacity style={styles.avatarBorder} onPress={getImage}>
              <Image source={photo} style={styles.avatar} />
              {hasPhoto && <IconRemovePhoto style={styles.addPhoto} />}
              {!hasPhoto && <IconAddPhoto style={styles.addPhoto} />}
            </TouchableOpacity>
          </View>
          <Gap height={24} />
          <View style={styles.content}>
            <Input
              label="Name"
              value={form.name}
              onChangeText={value => setForm('name', value)}
            />
            <Gap height={24} />
            <Input
              label="Email"
              value={form.email}
              onChangeText={value => setForm('email', value)}
            />
            <Gap height={24} />
            <Input
              label="Password"
              secureTextEntry
              value={form.password}
              onChangeText={value => setForm('password', value)}
            />
          </View>
          <Gap height={20} />
          <View style={styles.button}>
            <Button title="Sign Up" onPress={submitForm} />
          </View>
        </View>
      </ScrollView>
      {loading && <Loading />}
    </>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white1, flex: 1},
  page: {paddingVertical: 20},
  content: {padding: 40, paddingTop: 0},
  button: {alignItems: 'center'},
  avatar: {width: 110, height: 110, borderRadius: 110 / 2},
  avatarBorder: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 130 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {position: 'absolute', bottom: 8, right: 6},
  profile: {alignItems: 'center'},
});
