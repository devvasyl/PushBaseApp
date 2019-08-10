import React from 'react'
import { StyleSheet, View, ImageBackground, Image} from 'react-native'
import _ from 'lodash'; 
import { Layout, Colors } from '../../constants';
import { Logo, Statusbar } from '../../components';
import imgs from '../../assets/images';
import {
  Container,
  Content,
  Icon,
  Text,
  Button,
  Form,
  Item,
  Label,
  Input,
  Spinner, Row, Col
} from 'native-base';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userActions from "../../actions/user";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import appStyles from '../../theme/appStyles';
import styles from './styles';
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
    };
  }

  onSubmit(){
    this.login();
  }

  onSignupButtonPressHandler(){
    this.props.navigation.navigate('signupScreen')
  }

  onForgotpasswordPressHandler(){
    this.props.navigation.navigate('forgotpasswordScreen')
  }

  login(){
    const user = {
      username: this.state.username,
      password: this.state.password,
    }
    this.setState({
      isLoading: true,
    })
    this.props.authenticate(user)
      .then(res => {
        if(res.status == 200){
          this.props.navigation.navigate('homeStack')
        }else{
          this.setState({
            isLoading: false,
          })     
        }
      })
      .catch(error => {
        const messages = _.get(error, 'response.data.error')
        message = (_.values(messages) || []).join(',')
        if (message){
         this.setState({
           error: message,
           isLoading: false,
         })
       }
       console.log(`
          Error messages returned from server:`, messages )
      });
  }

  render(){
    return (
      <Container style={appStyles.container}>
        <ImageBackground 
            source={imgs.bg} 
            style={ { width: Layout.window.width, height: Layout.window.height }}>
          <KeyboardAwareScrollView>
            <View style={{flexDirection: 'column', flex:1}}>
              <View style={{flex: 0.8,height: Layout.window.height-80,}}>
                <View style={appStyles.rowXcenter}>
                  <Logo style={appStyles.loginLogo} />
                  <Text style={appStyles.loginMidText}>Login to Get Started!</Text>
                </View> 

                <View style={styles.loginBox}>
                  <Text transparent style={styles.formMsg}>{this.state.error}</Text>
                  <Form>
                      <Item style={styles.itemStyle} floatingLabel >
                        <Input
                          placeholder="Email"
                          placeholderTextColor="#FFFFFF"
                          keyboardType={'email-address'}
                          autoCapitalize="none"
                          style={appStyles.textbox}
                          maxLength={100}
                          numberOfLines={1}
                          onChangeText={ (username)=> this.setState({username}) }
                          spellCheck={false}
                          autoCorrect={false}
                        />
                      </Item>
                      <Item style={styles.itemStyle} floatingLabel >
                        <Input
                          placeholder="Password"
                          placeholderTextColor="#FFFFFF"
                          autoCapitalize="none"
                          style={appStyles.textbox}
                          maxLength={30}
                          numberOfLines={1}
                          secureTextEntry={true}
                          onChangeText={ (password)=> this.setState({password}) }
                          spellCheck={false}
                          autoCorrect={false}
                        />
                      </Item>
                  </Form>
                  <Row>
                    <Col>
                      <Button transparent full  
                        onPress={() => this.onSignupButtonPressHandler()}
                        style={{justifyContent:'flex-start'}}
                      >
                        <Text style={[styles.linkText,appStyles.textLeft]} > Create Account </Text>
                      </Button> 
                    </Col>
                    <Col>
                      <Button transparent full  
                        onPress={() => this.onForgotpasswordPressHandler()}
                        style={{justifyContent:'flex-end'}}
                      >
                        <Text style={[styles.linkText,appStyles.textRight]} > Forgot Password </Text>
                      </Button>
                    </Col>
                  </Row>
                </View>
              </View>  
              <View style={{flex: 0.2,height: 80,}}> 
                { this.state.isLoading ? 
                   <Spinner color={Colors.secondary} /> : 
                    <Button
                      full
                      primary
                      style={styles.button}
                      onPress={() => this.onSubmit()}
                    >
                      <Text> Log in</Text>
                    </Button>
                }
              </View>  
            </View>          
          </KeyboardAwareScrollView>
         </ImageBackground>
      </Container>
     
    );
  }
}
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  console.log('State  1:', state);

  // Redux Store --> Component
  return {
    loggedIn: state.authReducer.loggedIn,
  };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
  // Action
    return {
      // Login
      reduxLogin: (payload) => dispatch({
        type: 'LOGGED_IN',
        payload: payload,
      }),
   };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Login);