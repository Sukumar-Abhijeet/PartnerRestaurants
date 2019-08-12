import { StyleSheet, Dimensions, StatusBar } from 'react-native';
// import { Constants } from 'expo';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#CD2121',
  },
  block1: {
    flex: 2,
  },
  heading: {
    fontSize: 20, color: 'white', padding: 10,
  },
  block2: {
    flex: 3,
    alignItems: 'center',
  },
  block3: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width - 80,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingBottom: 50,
    borderRadius: 15,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'yellow',
    fontSize: 15,
    paddingBottom: 15,
    textAlign: 'center'
  },
  scrollViewStyle: {
    flex: 1,
    backgroundColor: '#EBEBEC',
  },
  listcontainer: {
    flex: 1,
    margin: 6,
    marginBottom: 3,
    marginTop: 3,
    flexDirection: 'row',
  },
  dir: {
    flexDirection: 'column',
  },
  dirRow: {
    flexDirection: 'row',
  },
  listcontainerNewOrder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    backgroundColor: '#fff',
    margin: 4,
    padding: 10,
    width: Dimensions.get('window').width - 10,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  splitcontainer1: {
    flex: 1,
    padding: 5,
  },
  splitcontainer2: {
    flex: 9,
    padding: 10,
  },
  splitcontainer3: {
    flex: 1,
    paddingRight: 3,
  },
  splitcontainer4: {
    flex: 8,
    padding: 10,
  },
  splitcontainer5: {
    flex: 2,
    padding: 10,
    paddingRight: 2,
  },
  boxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 4,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width - 10,
  },
  align: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontColorSize: {
    fontSize: 16,
    color: '#555',
  },


  //after Routing
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    //marginTop: StatusBar.currentHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#d8d8d8',
    borderBottomWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
    shadowRadius: 1, elevation: 1,

  },
  // Orderdetails modal
  orderDetailsModalContainer:
  {
    width: null,
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: 0
  },
  otpContainer:
  {
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    height: Dimensions.get('window').height / 2,
    flexDirection: 'column',
    padding: 0, alignItems: 'center',
  },
  mainHeaderContainer:
  {
    // marginTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomColor: '#d8d8d8',
    borderBottomWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
    shadowRadius: 1, elevation: 1,

  },
  modalheader: {
    padding: 10,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalBody: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    paddingBottom: 0
  },
  textBig: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  textWhite: {
    color: '#fff'
  },
  itemItem: {
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.3,
    shadowRadius: 2, elevation: 1,
    marginBottom: 5,
  },
  ratingArea: {
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderRadius: 4,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.3,
    shadowRadius: 2, elevation: 1,
    marginBottom: 5
  },
  textArea: {
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderRadius: 4,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.3,
    shadowRadius: 2, elevation: 1,
    marginBottom: 5,
    padding: 10,
  },
  modalFooter: {
    backgroundColor: '#cd2121',
  },
  box: {
    backgroundColor: '#ebebeb', justifyContent: 'center', alignItems: 'center', borderRadius: 4, padding: 5, marginTop: 5
  },

  //Login Screen
  layer1:
  {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'
  },
  layer1_1:
  {
    flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60
  },
  logo:
  {
    width: 250,
    height: 250,
  },
  bmftext:
  {
    color: '#0000e5', padding: 10, fontSize: 22, fontWeight: '500'
  },
  layer1_2:
  {
    flex: 2, justifyContent: 'center', alignItems: 'center'
  },

  phn_num:
  {
    height: 20, width: 250, marginLeft: 10, letterSpacing: 2
  },
  pass:
  {
    height: 20, width: 250, marginLeft: 10, letterSpacing: 2
  },

  bmftextcpy:
  {
    color: 'red', marginTop: 20, fontSize: 8
  },
  promptmessage: {
    color: '#fff',
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 4,
    marginTop: 2
    ,
  },
  loginCard: {
    backgroundColor: '#fff', marginTop: 10
    , borderRadius: 5, shadowColor: '#000', shadowOpacity: .58, height: 150,
    shadowRadius: 16, elevation: 24, padding: 10,
    shadowOffset: {
      height: 12,
      width: 12
    },
    justifyContent: 'center', alignItems: 'center',
    width: Dimensions.get('window').width - 30
  },
  cameraTop:
  {
    flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 15,
  },
  cameraBottom:
  {
    flex: 9, justifyContent: 'center', alignItems: 'center', padding: 20, flexDirection: 'row'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  networkRequest: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
module.exports = styles;