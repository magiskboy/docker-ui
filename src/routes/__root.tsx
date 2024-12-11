import React, { useState } from 'react';
import { createRootRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import {GoContainer, GoPackage } from 'react-icons/go';
import { Button, Layout, Menu, theme, Image, Flex, Divider } from 'antd';
import logo from '../assets/images/logo.png';
import { LuNetwork } from 'react-icons/lu';
import { MdOutlineStorage } from 'react-icons/md';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, padding, paddingXS },
  } = theme.useToken();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Layout style={{ height: "100%"}}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{paddingTop: padding }}>
        <Flex justify='center' align='center' style={{ padding: paddingXS }}>
          <Image src={logo} width={150} preview={false} />
        </Flex>
        <Divider />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/images']}
          selectedKeys={[pathname]}
          items={[
            {
              key: '/images',
              label: 'Images',
              icon: <GoPackage />,
              onClick: () => navigate({to: '/images'}),
            },
            {
              key: '/containers',
              label: 'Containers',
              icon: <GoContainer />,
              onClick: () => navigate({to: '/containers'}),
            },
            {
              key: '/networks',
              label: 'Networks',
              icon: <LuNetwork />,
              onClick: () => navigate({to: '/networks'}),
            },
            {
              key: '/volumes',
              label: 'Volumes',
              icon: <MdOutlineStorage />,
              onClick: () => navigate({to: '/volumes'}),
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'scroll',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <TanStackRouterDevtools />
    </Layout>
  );
};

export const Route = createRootRoute({
  component: AppLayout,
})
