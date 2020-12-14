import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {IconAddPhoto, IconRemovePhoto, ILNullTask} from '../../assets';
import {Button, Gap, Header, Input, Loading} from '../../components';
import {colors, fonts} from '../../utils';

const TaskEdit = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);

  const taskItem = route.params;
  const [task, setTask] = useState({
    task_title: '',
    desc: '',
    points: '',
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
        setIcon({uri: tasks.icon});
        setHasIcon(true);
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
    setTimeFrom(moment(datetime).format('HH:mm'));
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
    setTimeTo(moment(datetime).format('HH:mm'));
    hideDatePickerTo();
  };

  // untuk ganti photo preview
  const [icon, setIcon] = useState(ILNullTask);
  // untuk memunculkan icon remove
  const [hasIcon, setHasIcon] = useState(false);
  // upload photo
  const [iconDB, setIconDB] = useState('');

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
          setIconDB(`data: ${response.type};base64, ${response.data}`);
          setIcon(source);
          setHasIcon(true);
        }
      },
    );
  };

  const update = () => {
    // setLoading(true);
    const dataUpdate = task;
    dataUpdate.icon = iconDB;
    dataUpdate.from = timeFrom;
    dataUpdate.to = timeTo;
    dataUpdate.date = dateTask;
    console.log('data sebelum update', dataUpdate);
    // const updateDbRef = firestore()
    //   .collection('tasks')
    //   .doc(taskItem);

    // updateDbRef
    //   .set(dataUpdate)
    //   .then(() => {
    //     setLoading(false);
    //     console.log('success');
    //     navigation.navigate('MainApp');
    //   })
    //   .catch(error => {
    //     setLoading(false);
    //     showMessage({
    //       message: error,
    //       type: 'default',
    //       backgroundColor: colors.red1,
    //     });
    //   });
  };

  // data date dan time untuk update
  const getTimeFromId = () => {
    if (!timeFrom) {
      return <Text style={styles.label}>From: {task.from}</Text>;
    } else {
      return <Text style={styles.label}>From: {timeFrom}</Text>;
    }
  };

  const getTimeToId = () => {
    if (!timeTo) {
      return <Text style={styles.label}>To: {task.to}</Text>;
    } else {
      return <Text style={styles.label}>To: {timeTo}</Text>;
    }
  };

  const getDateId = () => {
    if (!dateTask) {
      return <Text style={styles.label}>Date: {task.date}</Text>;
    } else {
      return <Text style={styles.label}>Date: {dateTask}</Text>;
    }
  };

  const remove = () => {
    Alert.alert(
      'Delete reward',
      'Are you sure?',
      [
        {text: 'Yes', onPress: () => removeAction()},
        {
          text: 'No',
          onPress: () => console.log('No item was removed'),
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const removeAction = () => {
    const dbRef = firestore()
      .collection('rewards')
      .doc(rewardItem);
    dbRef.delete().then(() => {
      console.log('data deleted success');
      navigation.navigate('Reward');
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Header title="Edit Task" onPress={() => navigation.goBack()} />
        <View style={styles.page}>
          <View style={styles.task}>
            <View style={styles.iconBorder}>
              <TouchableOpacity style={styles.avatarBorder} onPress={getImage}>
                <Image source={icon} style={styles.avatar} />
                {hasIcon && <IconRemovePhoto style={styles.addPhoto} />}
                {!hasIcon && <IconAddPhoto style={styles.addPhoto} />}
              </TouchableOpacity>
            </View>
          </View>
          <Gap height={24} />
          <Input
            label="Task Title"
            value={task.task_title}
            onChangeText={value => changeText('task_title', value)}
          />
          <Gap height={24} />
          <Input
            label="Description"
            value={task.desc}
            onChangeText={value => changeText('desc', value)}
          />
          <Gap height={24} />
          <Input
            label="Number of Points"
            value={task.points}
            onChangeText={value => changeText('points', value)}
            keyboardType="numeric"
          />
          <Gap height={24} />
          <View>
            {getTimeFromId()}
            <Button
              type="btn-modal"
              title="Pick time from"
              onPress={showDatePickerFrom}
            />
            <DateTimePickerModal
              isVisible={timePickerVisibleFrom}
              mode="time"
              onConfirm={handleConfirmFor}
              onCancel={hideDatePickerFrom}
            />
          </View>
          <Gap height={24} />
          <View>
            {getTimeToId()}
            <Button
              type="btn-modal"
              title="Pick time to"
              onPress={showDatePickerTo}
            />
            <DateTimePickerModal
              isVisible={timePickerVisibleTo}
              mode="time"
              onConfirm={handleConfirmTo}
              onCancel={hideDatePickerTo}
            />
          </View>
          <Gap height={24} />
          <View>
            {getDateId()}
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
            <Button title="Save Changes" onPress={update} />
            <Gap height={24} />
            <Button title="Delete" type="secondary" onPress={remove} />
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
