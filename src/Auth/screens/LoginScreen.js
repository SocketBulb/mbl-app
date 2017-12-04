import React from 'react';
import { View, TextInput, TouchableHighlight, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  Container,
  Header,
  Title,
  Left,
  Right,
  Grid,
  Row,
  Col,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Footer,
  Icon,
  H1
} from 'native-base';

import { PasswordInput } from '../components';
import styles from '../../constants/Colors';
const { primaryColor } = styles;

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    var form =  {
      email: "admin",
      password: "admin"
    };
    var errors = Object.keys(form).reduce((obj, key) => {
      obj[key] = false; // set all errors false
      return obj;
    }, {});

    this.state = {
      showPassword: false,
      form,
      errors: (new Map() : Map<string, boolean>),
      focused: null,
    }

    this._focusNextInput = this._focusNextInput.bind(this);

    // stores refs to the inputs for auto focusing
    this.inputRefs = {};
  }
  _togglePasswordVisibility = _ => { this.setState({ showPassword: !this.state.showPassword }); }
  _updatePassword = password => {
    this.setState({
      form: Object.assign(this.state.form, { password })
    });
  }
  _updateEmail = email => {
    this.setState({ form: Object.assign(this.state.form, { email }) });
  }
  _focusNextInput = (key) => { this.inputRefs[key].focus(); }
  _tryLogin = (email, pw) => {
    // send network request for authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email !== 'admin' && pw !== "admin") return reject({ message: "Sorry" });
        // nav to main
        return resolve({ user: 'admin', accessToken: '42' });
      }, 200);
    });
  }
  _submitLogin = () => {
    // submit login information
    this._tryLogin(this.state.form.email, this.state.form.password)
      .then((data) => {
        // save auth session

        // move into app
        const action = NavigationActions.reset({
          index: 0,
          key: null,
          actions: [ NavigationActions.navigate({ routeName : 'App' }) ]
        });
        this.props.navigation.dispatch(action);
      }, (err) => {
        this.setState((state) => {
          const errors = new Map(state.errors);
          // set errors on
          errors.set('email', true);
          errors.set('password', true);
          return { errors };
        })
      })
  }
  _goToForgotPwScreen = () => {
    // navigate to forgot pw page
    this.props.navigation.navigate('ForgotPassword');
  }
  _goToRegisterScreen = () => {
    console.log("Going to registration screen...");
    // navigate to register page
    const action = NavigationActions.navigate({
      routeName: 'Register'
    });
    console.log(this.props.navigation);
    this.props.navigation.dispatch(action);
  }
  render() {
    return (
      <Container style={{ backgroundColor: "#fff"}}>
        <Content>
          <View style={{ alignItems : 'center', justifyContent: 'center', height: 256, marginTop: 32 }}>
            <Image style={{ width: 128, height: 128 }} source={require('../../assets/icons/app-icon.png')} />
            <H1 style={{ fontWeight: "700", color: primaryColor }}>CASTLE</H1>
          </View>
          <Form>
            <Item error={this.state.errors.get('email')} stackedLabel>
              <Label style={{ color: "#777"}}>Email</Label>
              <Input
                placeholder="your.email@website.com"
                placeholderTextColor="#ccc"
                autoCapitalize="none"
                keyboardType="email-address"
                value={this.state.form.email}
                onChangeText={this._updateEmail}
                blurOnSubmit={false}
                returnKeyType="next"
                ref={input => {
                  this.inputRefs["email"] = input;
                }}
                onSubmitEditing={_ => { this._focusNextInput("pw"); }}
              />
            </Item>
            <Item error={this.state.errors.get('password')} stackedLabel last>
              <Label style={{ color: "#777"}}>Password</Label>
              <PasswordInput
                placeholder="password"
                placeholderTextColor="#ccc"
                value={this.state.form.password}
                onChangeText={this._updatePassword}
                showPassword={this.state.showPassword}
                onTogglePassword={this._togglePasswordVisibility}
                returnKeyType="done"
                ref={input => (this.inputRefs["pw"] = input)}
                onSubmitEditing={this._submitLogin}
              />
            </Item>
          </Form>
          <View style={{ padding: 16, marginBottom: 0 }}>
            <Button block onPress={this._submitLogin}>
              <Text>Login</Text>
            </Button>
            <Button full transparent onPress={this._goToForgotPwScreen}>
              <Text>I forgot my password</Text>
            </Button>  
          </View>
        </Content>
        <View>
          <Button full transparent onPress={this._goToRegisterScreen}>
            <Text>I don't have an account</Text>
          </Button>  
        </View>  
      </Container>
    )
  }
}