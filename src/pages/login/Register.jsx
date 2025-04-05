import { useState } from 'react';
import { Button, Checkbox, Form, Input, message, Result } from 'antd';
import { createUser } from '../../api/user.api';

const Register = ({onValueChange}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [showResult, setShowResult] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);

  const handleChange = () => {
    // 调用父组件回调更新值
    onValueChange(false);
  };

  const onFinish = async (values) => {
    try {
      const res = await createUser(values);
      if (res) {
        // 保存账号信息用于展示
        setAccountInfo({
          username: values.username,
          password: values.password
        });
        setShowResult(true);
        form.resetFields(); // 清空表单
      }
    } catch (error) {
      messageApi.error('注册失败: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {contextHolder}
      
      {!showResult ? (
        <Form
          form={form}
          name="register"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ 
              required: true, 
              message: '请输入账号',
              whitespace: true 
            }]}
          >
            <Input placeholder="4-16位字母数字组合" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input placeholder="example@domain.com" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password placeholder="至少6位字符" />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            wrapperCol={{ offset: 4, span: 24 }}
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject('请阅读并接受协议'),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <a href="#">用户协议</a>
            </Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 24 }}>
            <Button type="primary" htmlType="submit" block>
              立即注册
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4, span: 24 }}>
            <Button block onClick={handleChange}>
              返回登录
            </Button>
          </Form.Item>
          
        </Form>
      ) : (
        <Result
          status="success"
          title="注册成功！"
          subTitle="请妥善保管您的账户信息"
          extra={[
            <Button 
              type="primary" 
              key="login"
              onClick={handleChange}
            >
              立即登录
            </Button>,
            <Button 
              key="again"
              onClick={() => setShowResult(false)}
            >
              继续注册
            </Button>,
          ]}
        >
          <div style={{ textAlign: 'left', margin: '24px 0' }}>
            <p>用户名: {accountInfo.username}</p>
            <p>初始密码: {accountInfo.password}</p>
            <p style={{ color: '#ff4d4f' }}>
              * 建议登录后立即修改初始密码
            </p>
          </div>
        </Result>
      )}
    </div>
  );
};

export default Register;