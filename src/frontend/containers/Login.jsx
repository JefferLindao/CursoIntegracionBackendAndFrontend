/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Header from '../components/Header'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../actions';
import googleIcon from '../assets/static/google-icon.png';
import twitterIcon from '../assets/static/twitter-icon.png';
import '../assets/style/components/Login.scss';

const Login = (props) => {
  const [form, setValues] = useState({
    email: '',
    id: '',
    name: ''
  });

  const handleInput = (event) => {
    setValues({
      ...form,
      [event.target.name]: event.target.value
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    props.loginUser(form, '/');
  };
  return (
    <>
      <Header isLogin />
      <section className="login">
        <section className="login__container">
          <h2>Inicia sesión</h2>
          <form className="login__container--form" onSubmit={handleSubmit}>
            <input
              name="email"
              className="input"
              type="text"
              placeholder="Correo"
              onChange={handleInput}
            />
            <input
              name="password"
              className="input"
              type="password"
              placeholder="Contraseña"
              onChange={handleInput}
            />
            <button type="submit" className="button">Iniciar sesión</button>
            <div className="login__container--remember-me">
              <label>
                <input type="checkbox" id="cbox1" value="first_checkbox" />
                Recuérdame
              </label>
              <a href="/">Olvidé mi contraseña</a>
            </div>
          </form>
          <section className="login__container--social-media">
            <div>
              <img src={googleIcon} alt="Icon-Google" />
              Inicia sesión con Google
            </div>
            <div>
              <img src={twitterIcon} alt="Icon-Twitter" />
              Inicia sesión con Twitte
            </div>
          </section>
          <p className="login__container--register">
            No tienes ninguna cuenta&nbsp;
            <Link to="/register">
              Regístrate
            </Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  loginUser
};
Login.propTypes = {
  loginUser: PropTypes.func
}
export default connect(null, mapDispatchToProps)(Login);
