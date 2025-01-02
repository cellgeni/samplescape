import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { LaptopOutlined, NotificationOutlined, ApartmentOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { ItemType } from 'antd/es/menu/interface';
import { Header } from 'antd/es/layout/layout';


const { Sider, Content } = Layout;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [breadcrumbs, _] = useState(['samplescape']);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    const menuItems: ItemType[] = [
        {
            key: 'menu-item-home',
            label: <Link to="/">Home</Link>,
            icon: <LaptopOutlined />,
        },
        {
            key: "menu-item-studies",
            icon: <ApartmentOutlined />,
            label: <Link to="/studies">Studies</Link>,
        },
        {
            key: "menu-item-samples",
            icon: <AppstoreAddOutlined />,
            label: <Link to="/samples">Samples</Link>,
        },
        {
            key: "menu-item-about",
            icon: <NotificationOutlined />,
            label: <Link to="/about">About</Link>,
        }
    ];


    return (
        <Layout style={{ minHeight: '100vh', minWidth: '100vw', borderRadius: borderRadiusLG }}>
            {/* Left-Side Menu */}
            <Sider
                style={{ background: colorBgContainer }}
                collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="seqsearch-logo-vertical" />
                <Menu
                    selectedKeys={[location.pathname]}
                    style={{ flex: 1, minWidth: 0 }}
                    items={menuItems}>
                </Menu>
            </Sider>
            {/* Main Content Area */}
            <Layout>
                <Header style={{ margin: '2px', backgroundColor: colorBgContainer, borderRadius: borderRadiusLG }}>
                    <Breadcrumb style={{ padding: '16px' }} items={breadcrumbs.map(b => { return { title: b }; })} />
                </Header>
                <Content style={{ margin: '2px', backgroundColor: colorBgContainer, borderRadius: borderRadiusLG }} >
                    <Outlet />
                </Content>
            </Layout>
        </Layout >
    );
};

export default AppLayout;