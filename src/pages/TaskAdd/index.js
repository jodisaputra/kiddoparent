import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {IconAddPhoto, ILNullTask} from '../../assets';
import {Gap, Header, Input} from '../../components';
import {colors} from '../../utils';

const TaskAdd = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
      <Header title="Add New Task" onPress={() => navigation.goBack()} />
      <View style={styles.page}>
        <View style={styles.titleContent}>
          <View style={styles.iconBorder}>
            <Image source={ILNullTask} style={styles.icon} />
            <IconAddPhoto style={styles.addIcon} />
          </View>
        </View>
        <Gap height={24} />
        <Input label="Task Title" />
        <Gap height={24} />
        <Input label="Description" />
        <Gap height={24} />
        <Input label="Number of Points" />
        <Gap height={24} />
      </View>
    </ScrollView>
  );
};

export default TaskAdd;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white1},
  page: {padding: 20},
  icon: {width: 90, height: 90},
  iconBorder: {
    width: 110,
    height: 110,
    borderColor: colors.gray2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 110 / 2,
  },
  titleContent: {alignItems: 'center'},
  addIcon: {position: 'absolute', bottom: 8, right: 6},
});
