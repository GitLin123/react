// src/components/LoginForm.jsx
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { userLogin } from '../../api/user.api';
import Register from './Register';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, updateToken } from '../../store/userSlice';
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isInRegister, setIsInRegister] = useState(false);
  const navigate = useNavigate();

  // 如果已经登录跳转到个人页
useEffect(()=> {
  if(localStorage.getItem('token')) {
    message.success('已登录！')
    navigate('/my');
    console.log('移除')
  }  
},[navigate])

  const onValueChange = (value) => {
    setIsInRegister(value)
  }
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { token, user } = await userLogin(values);
  
      // 原子化更新
      dispatch(setUser(user));
      dispatch(updateToken(token));
  

      message.success(`欢迎回来${user.username}`);
      // 同步存储
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      // 导航前确保状态更新
      setTimeout(() => {
        navigate('/my');
      }, 10);
    } catch (error) {
      // alert("error")
      message.error(error.response?.data?.error || '请检查账号和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={{display:'flex',marginTop:'3rem',justifyContent:'center',height:'60vh',alignItems:'center'}}>
    {!isInRegister?(<Form 
    form={form}
    onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="用户名"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="密码"
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          block
        >
          登录
        </Button>
      </Form.Item>
      <Form.Item>
        <Button  
          block
          onClick={()=>setIsInRegister(true)}
        >
          注册
        </Button>
      </Form.Item>
    </Form>):<Register onValueChange={onValueChange} />
    }
  </div>
  );
};

export default Login;