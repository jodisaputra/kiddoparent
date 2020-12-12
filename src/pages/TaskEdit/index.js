import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {IconAddPhoto, IconRemovePhoto, ILNullTask} from '../../assets';
import {Gap, Header, Input, Button, Loading} from '../../components';
import {colors, fonts, useForm} from '../../utils';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import {getData} from '../../utils/localstorage';

const TaskEdit = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const [timePickerVisibleFrom, setTimePickerVisibleFrom] = useState(false);
  const [timePickerVisibleTo, setTimePickerVisibleTo] = useState(false);
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  // from
  const showDatePickerFrom = () => {
    setTimePickerVisibleFrom(true);
  };
  const hideDatePickerFrom = () => {
    setTimePickerVisibleFrom(false);
  };
  const handleConfirmFor = datetime => {
    setTimeFrom(moment(datetime).format('MMMM, Do YYYY HH:mm'));
    hideDatePickerFrom();
  };

  // to
  const showDatePickerTo = () => {
    setTimePickerVisibleTo(true);
  };
  const hideDatePickerTo = () => {
    setTimePickerVisibleTo(false);
  };
  const handleConfirmTo = datetime => {
    setTimeTo(moment(datetime).format('MMMM, Do YYYY HH:mm'));
    hideDatePickerTo();
  };

  // untuk ganti photo preview
  const [photo, setPhoto] = useState(ILNullTask);
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

  // deklarasi form
  const [form, setForm] = useForm({
    task_title: '',
    desc: '',
    points: '',
  });

  const saveTask = () => {
    setLoading(true);
    getData('admin').then(res => {
      const email = res.email;
      const data = {
        task_title: form.task_title,
        desc: form.desc,
        points: form.points,
        from: timeFrom,
        to: timeTo,
        icon: photoDB,
        added_by: email,
        status: 'not done',
      };
      firestore()
        .collection('tasks')
        .add(data)
        .then(() => {
          setLoading(false);
          navigation.navigate('MainApp');
        })
        .catch(error => {
          setLoading(false);
          showMessage({
            message: error,
            type: 'default',
            backgroundColor: colors.errorMessage,
          });
          console.log('error Save Task', errorMessage);
          navigation.navigate('MainApp');
        });
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Header title="Add New Task" onPress={() => navigation.goBack()} />
        <View style={styles.page}>
          <View style={styles.task}>
            <View style={styles.iconBorder}>
              <TouchableOpacity style={styles.avatarBorder} onPress={getImage}>
                <Image source={photo} style={styles.avatar} />
                {hasPhoto && <IconRemovePhoto style={styles.addPhoto} />}
                {!hasPhoto && <IconAddPhoto style={styles.addPhoto} />}
              </TouchableOpacity>
            </View>
          </View>
          <Gap height={24} />
          <Input
            label="Task Title"
            onChangeText={value => setForm('task_title', value)}
          />
          <Gap height={24} />
          <Input
            label="Description"
            onChangeText={value => setForm('desc', value)}
          />
          <Gap height={24} />
          <Input
            label="Number of Points"
            onChangeText={value => setForm('points', value)}
            keyboardType="numeric"
          />
          <Gap height={24} />
          <View>
            <Text style={styles.label}>From: {timeFrom}</Text>
            <Button
              type="btn-modal"
              title="Pick date time from"
              onPress={showDatePickerFrom}
            />
            <DateTimePickerModal
              isVisible={timePickerVisibleFrom}
              mode="datetime"
              onConfirm={handleConfirmFor}
              onCancel={hideDatePickerFrom}
            />
          </View>
          <Gap height={24} />
          <View>
            <Text style={styles.label}>To: {timeTo}</Text>
            <Button
              type="btn-modal"
              title="Pick date time to"
              onPress={showDatePickerTo}
            />
            <DateTimePickerModal
              isVisible={timePickerVisibleTo}
              mode="datetime"
              onConfirm={handleConfirmTo}
              onCancel={hideDatePickerTo}
            />
          </View>
          <Gap height={50} />
          <View style={styles.button}>
            <Button title="Save Task" onPress={saveTask} />
          </View>
        </View>
      </ScrollView>
      {loading && <Loading />}
    </>
  );
};

export default TaskEdit;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white1},
  page: {padding: 20},
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
  task: {alignItems: 'center'},
  addIcon: {position: 'absolute', bottom: 8, right: 6},
  label: {fontSize: 16, fontFamily: fonts.primary[300], marginBottom: 6},
  button: {alignItems: 'center'},
});
