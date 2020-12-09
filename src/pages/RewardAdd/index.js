import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Gap, Header, Input, Loading} from '../../components';
import {colors, useForm} from '../../utils';
import {getData} from '../../utils/localstorage';

const RewardAdd = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useForm({
    name: '',
    cost: '',
  });

  const saveReward = () => {
    // setLoading(true);
    // getData('admin').then(res => {
    //   const email = res.email;
    //   const data = {
    //     name: form.name,
    //     cost: form.cost,
    //     added_by: email,
    //     claimed: 'no',
    //   };
    //   // console.log('user data', data);
    //   Fire.database()
    //     .ref('/rewards')
    //     .push(data);
    //   setLoading(false);
    //   navigation.navigate('Reward');
    // });
  };
  return (
    <>
      <ScrollView style={styles.container}>
        <Header title="Add New Reward" onPress={() => navigation.goBack()} />
        <View style={styles.page}>
          <Input
            label="Reward Name"
            onChangeText={value => setForm('name', value)}
          />
          <Gap height={20} />
          <Input
            label="Cost"
            onChangeText={value => setForm('cost', value)}
            keyboardType="numeric"
          />
          <Gap height={20} />
          <View style={styles.button}>
            <Button title="Save" onPress={saveReward} />
          </View>
        </View>
      </ScrollView>
      {loading && <Loading />}
    </>
  );
};

export default RewardAdd;

const styles = StyleSheet.create({
  container: {backgroundColor: colors.white1, flex: 1},
  page: {paddingHorizontal: 30, paddingVertical: 16},
  button: {alignItems: 'center'},
});
