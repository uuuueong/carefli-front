import { createAction, handleActions } from "redux-actions";
import { userAPI } from "../../Shared/api";


// 액션 
const SET_USER = "SET_USER";
const GET_USER = "GET_USER";
// 액션 생성
const setUser = createAction(SET_USER, (user) => ({ user }));
const getUser = createAction(GET_USER, (user) => ({ user }));

// 초기값
const initialState = {
  user: null,
  isLogin: false,
}

// 미들웨어 
const logInDB = (username, password) => {
  return function (dispatch, getState, { history }) {
    userAPI
      .login(username, password)
      .then((response) => {
        //localStorage에 토큰 저장
        localStorage.setItem ("token", response.headers.authorization);
        dispatch(isLoginDB());
        history.replace('/home');
      }).catch((err) => {
        if(err.status === 496 || err.status === 495){
          localStorage.removeItem('token');
          history.replace('/');
        }else{
          console.log("logInDB : error", err.response);
          // window.alert("이메일 혹은 비밀번호를 다시 확인해주세요.");
          return;
        }
      });
  }
};

const isLoginDB = () => {
  return function (dispatch, getState, {history}) {
    userAPI
      .isLogin()
      .then((res) => {
        dispatch(getUser(res.data));
        localStorage.setItem('nickname', res.data.nickname);
      })
      .catch((err) => {
        if(err.status === 496 || err.status === 495){
          localStorage.removeItem('token');
          history.replace('/');
        }else{
          console.log("isLogin : error", err);
          return;
        }
      })
  }
}

//카카오로그인
const kakaoLogInDB = (code) => {
  return function (dispatch, getState, {history}){
    userAPI
      .kakaoLogIn(code)
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.email);
        dispatch(setUser({
          username: res.data.email
        }
        ))
        history.push('/home');
        window.location.reload();
      })
      .catch((error) => {
        console.log("error: ", error);
        // window.alert('로그인에 실패하였습니다. ')
        history.goBack();
      })
  }
}

export { actionCreators };