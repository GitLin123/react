// src/components/LoginForm.jsx
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { userLogin } from '../../api/user.api';
import Register from './Register';
import store from '../../store/index';
import { actionType } from '../../store/actionType';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isInRegister, setIsInRegister] = useState(false);
  const navigate = useNavigate();
  const onValueChange = (value) => {
    setIsInRegister(value)
  }
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { token, user } = await userLogin(values);
      
      // 存储令牌
      localStorage.setItem('token', token);
      
      // 显示欢迎信息
      message.success(`欢迎回来，${user.username}！`);

      store.dispatch({type:actionType.update_info,...user})

      navigate('/')
    } catch (error) {
      message.error(error.response?.data?.error || '请检查账号和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={{display:'flex',justifyContent:'center',height:'60vh',alignItems:'center'}}>
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