import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View, Alert} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Button, Gap, Header, Input, Loading} from '../../components';
import {colors} from '../../utils';
import firestore from '@react-native-firebase/firestore';

const RewardEdit = ({route, navigation}) => {
  const [loading, setLoading] = useState(false);
  const rewardItem = route.params;

  const [reward, setReward] = useState({
    name: '',
    cost: '',
  });

  useEffect(() => {
    const dbRef = firestore()
      .collection('rewards')
      .doc(rewardItem);
    dbRef.get().then(result => {
      if (result.exists) {
        const reward = result.data();
        setReward(reward);
      } else {
        showMessage({
          message: 'reward does not exist',
          type: 'default',
          backgroundColor: colors.red1,
        });
      }
    });
  }, []);

  const update = () => {
    setLoading(true);
    const updateDbRef = firestore()
      .collection('rewards')
      .doc(rewardItem);

    updateDbRef
      .set(reward)
      .then(() => {
        setLoading(false);
        console.log('success');
        navigation.navigate('Reward');
      })
      .catch(error => {
        setLoading(false);
        showMessage({
          message: error,
          type: 'default',
          backgroundColor: colors.red1,
        });
      });
  };

  const changeText = (key, value) => {
    setReward({
      // copy data lama
      ...reward,
      [key]: value,
    });
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
        <Header title="Edit Reward" onPress={() => navigation.goBack()} />
        <View style={styles.page}>
          <Input
            label="Reward Name"
            value={reward.name}
            onChangeText={value => changeText('name', value)}
          />
          <Gap height={20} />
          <Input
            label="Cost"
            value={reward.cost}
            keyboardType="numeric"
            onChangeText={value => changeText('cost', value)}
          />
          <Gap height={20} />
          <View style={styles.button}>
            <Button title="Save Changes" onPress={update} />
            <Gap height={20} />
            <Button title="Delete" type="secondary" onPress={remove} />
          </View>
        </View>
      </ScrollView>
      {loading && <Loading />}
    </>
  );
};

export default RewardEdit;

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white1, flex: 1},
  page: {paddingHorizontal: 30, paddingVertical: 16},
  button: {alignItems: 'center'},
});
