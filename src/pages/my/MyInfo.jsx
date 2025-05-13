import React, { useEffect, useState } from "react";
import { Avatar, message, Image, Layout, Menu, Descriptions, Modal, Form, Input, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined, HomeOutlined, LogoutOutlined, HomeFilled, DropboxOutlined, FormOutlined } from "@ant-design/icons";
import { clearUser } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { getUserImage } from "../../api/user.api";

const { Content, Footer, Sider } = Layout;

const MyInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [collapsed, setCollapsed] = useState(false); // 控制侧边栏折叠状态
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // 控制修改资料弹窗显示状态
  const [isApiModalVisible, setIsApiModalVisible] = useState(false); // 控制API设置弹窗显示状态
  const [selectedKeys, setSelectedKeys] = useState(["home"]); // 当前激活的导航项
  const user = useSelector((state) => state.user?.data);

  const items = [
    {
      key: "1",
      label: "昵称",
      children: user?.full_name,
    },
    {
      key: "2",
      label: "电话号码",
      children: user?.phone_number,
    },
    {
      key: "3",
      label: "邮箱",
      children: user?.email,
    },
    {
      key: "4",
      label: "地址",
      children: user?.address,
    },
  ];

  // 如果未登录，转到登录页
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      message.warning("还未登录！");
      navigate("/login");
    }
    const fetchUserImages = async () => {
      try {
        const response = await getUserImage(user?.id);
        setImages(response.images);
      } catch (error) {
        console.error("获取用户图库失败:", error);
      }
    };
    fetchUserImages();
  }, [navigate, user?.id]);

  // 退出登录
  function handleLogout() {
    localStorage.removeItem("token"); // 清除 token
    dispatch(clearUser());
    message.success("成功退出登录！");
    navigate("/");
  }

  // 菜单点击事件
  const handleMenuClick = (key) => {
    setSelectedKeys([key]); // 设置当前激活的导航项
    switch (key) {
      case "home":
        navigate("/home"); // 跳转到个人主页
        break;
      case "api":
        setIsApiModalVisible(true); // 打开API设置弹窗
        break;
      case "change":
        setIsEditModalVisible(true); // 打开修改资料弹窗
        break;
      case "backhome":
        navigate("/"); // 跳转到首页
        break;
      case "logout":
        handleLogout(); // 退出登录
        break;
      default:
        break;
    }
  };

  // 修改资料弹窗提交逻辑
  const handleEditModalOk = () => {
    message.success("资料修改成功！");
    setIsEditModalVisible(false);
    setSelectedKeys(["home"]); // 激活第一个导航项
  };

  // 修改资料弹窗取消逻辑
  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setSelectedKeys(["home"]); // 激活第一个导航项
  };

  // API设置弹窗提交逻辑
  const handleApiModalOk = () => {
    message.success("API 设置保存成功！");
    setIsApiModalVisible(false);
    setSelectedKeys(["home"]); // 激活第一个导航项
  };

  // API设置弹窗取消逻辑
  const handleApiModalCancel = () => {
    setIsApiModalVisible(false);
    setSelectedKeys(["home"]); // 激活第一个导航项
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边导航栏 */}
      <Sider
        theme="light" // 设置侧边栏主题为白色
        style={{
          overflow: "auto", // 使侧边栏可以滚动
          height: "100vh", // 固定高度
          position: "fixed", // 固定在左侧
          left: 0,
          top: 0,
          bottom: 0,
          background: "#fff", // 设置背景颜色为白色
          borderRight: "1px solid #ddd", // 添加右侧边框以区分内容区域
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ height: 64, margin: 16, textAlign: "center" }}>
          <Avatar src={user?.avatar} shape="square" size={collapsed ? 44 : 68} icon={<UserOutlined />} />
        </div>
        <Menu
          theme="light" // 设置菜单主题为白色
          selectedKeys={selectedKeys} // 当前激活的导航项
          mode="inline"
          onClick={(e) => handleMenuClick(e.key)}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            个人主页
          </Menu.Item>
          <Menu.Item key="api" icon={<DropboxOutlined />}>
            API 设置
          </Menu.Item>
          <Menu.Item key="change" icon={<FormOutlined />}>
            修改资料
          </Menu.Item>
          <Menu.Item key="backhome" icon={<HomeFilled />}>
            返回首页
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            退出登录
          </Menu.Item>
        </Menu>
      </Sider>

      {/* 主内容区域 */}
      <Layout style={{ marginLeft: collapsed ? 60 : 200 }}>
        <Content
          style={{
            margin: "16px",
            padding: 24,
            background: "#fff",
            minHeight: 360,
            overflow: "auto", // 使内容区域可以滚动
          }}
        >
          <h2>{`${user.full_name || "NewFish"}的信息`}</h2>
          <Descriptions title="" items={items} layout="horizontal" bordered="true" />
          <h2>{`${user.full_name || "NewFish"}的图库`}</h2>
          {/* 照片墙展示 */}
          <div className="photo-wall" style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {images?.map((url, index) => (
              <div
                key={url}
                className="photo-card"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  textAlign: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Image src={url} alt={`生成结果 ${index + 1}`} width={200} height={150} />
              </div>
            ))}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}> zhouyu©2025 Created by yuzhouzhou</Footer>
      </Layout>

      {/* 修改资料弹窗 */}
      <Modal
        title="修改资料"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="昵称">
            <Input placeholder="请输入新的昵称" value={user?.full_name} />
          </Form.Item>
          <Form.Item label="邮箱">
            <Input placeholder="请输入新的邮箱" value={user?.email} />
          </Form.Item>
          <Form.Item label="电话号码">
            <Input placeholder="请输入新的电话号码" value={user?.phone_number} />
          </Form.Item>
          <Form.Item label="地址">
            <Input placeholder="请输入新的地址" value={user?.address} />
          </Form.Item>
          <Form.Item label="头像">
          <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      
      >
         <img src={user.avatar} alt="avatar" style={{ width: '100%' }} />
      </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* API设置弹窗 */}
      <Modal
        title="API 设置"
        open={isApiModalVisible}
        onOk={handleApiModalOk}
        onCancel={handleApiModalCancel}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical">
          <Form.Item label="API Key">
            <Input placeholder="请输入 API Key" />
          </Form.Item>
          <Form.Item label="API Secret">
            <Input placeholder="请输入 API Secret" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MyInfo;