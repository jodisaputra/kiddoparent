import React, {useState, useEffect} from 'react';
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

const TaskEdit = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  const taskItem = route.params;
  const [task, setTask] = useState({
    task_title: '',
    desc: '',
    from: '',
    to: '',
    date: '',
  });

  const changeText = (key, value) => {
    setTask({
      // copy data lama
      ...task,
      [key]: value,
    });
  };

  useEffect(() => {
    const dbRef = firestore()
      .collection('tasks')
      .doc(taskItem);
    dbRef.get().then(result => {
      if (result.exists) {
        const tasks = result.data();
        console.log('get task id:', tasks);
        setTask(tasks);
      } else {
        showMessage({
          message: 'tasks does not exist',
          type: 'default',
          backgroundColor: colors.red1,
        });
      }
    });
  }, []);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisibleFrom, setTimePickerVisibleFrom] = useState(false);
  const [timePickerVisibleTo, setTimePickerVisibleTo] = useState(false);
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [dateTask, setDateTask] = useState('');

  // date
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const handleConfirmDate = date => {
    setDateTask(moment(date).format('MMMM, Do YYYY'));
    hideDatePicker();
  };

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
            value={task.task_title}
            onChangeText={value => changeForm('task_title', value)}
          />
          <Gap height={24} />
          <Input
            label="Description"
            value={task.desc}
            onChangeText={value => changeForm('desc', value)}
          />
          <Gap height={24} />
          <Input
            label="Number of Points"
            value={task.points}
            onChangeText={value => changeForm('points', value)}
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
          <Gap height={24} />
          <View>
            <Text style={styles.label}>Date: {dateTask}</Text>
            <Button
              type="btn-modal"
              title="Pick date"
              onPress={showDatePicker}
            />
            <DateTimePickerModal
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={hideDatePicker}
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
