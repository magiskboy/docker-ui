import React, { useState } from 'react';
import { createRootRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import {GoContainer, GoPackage } from 'react-icons/go';
import { Button, Layout, Menu, theme, Image, Flex, Divider } from 'antd';
import logo from '../assets/images/logo.png';
import { LuNetwork } from 'react-icons/lu';
import { MdOutlineStorage, MdOutlineSpaceDashboard } from 'react-icons/md';


const { Header, Sider } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG, padding, paddingXS, marginXS },
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
              key: '/',
              label: 'Dashboard',
              icon: <MdOutlineSpaceDashboard />,
              onClick: () => navigate({to: '/'}),
            },
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
        <Header style={{ background: colorBgContainer, padding: 0 }}>
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
        <Flex
          vertical
          style={{
            margin: marginXS,
            padding: `${paddingXS}px ${padding}px`,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            height: '100%',
            overflow: 'scroll'
          }}
        >
          <Outlet />
        </Flex>
      </Layout>
      <TanStackRouterDevtools />
    </Layout>
  );
};

export const Route = createRootRoute({
  component: AppLayout,
})
