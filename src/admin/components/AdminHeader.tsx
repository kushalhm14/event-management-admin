import React from 'react';
import { View } from 'react-native';
import { Appbar, Menu, Divider } from 'react-native-paper';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightActions,
}) => {
  const { logout } = useAdminAuth();
  const [menuVisible, setMenuVisible] = React.useState(false);

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
  };

  return (
    <Appbar.Header>
      {showBack && onBack && (
        <Appbar.BackAction onPress={onBack} />
      )}
      
      <Appbar.Content 
        title={title}
        subtitle={subtitle}
      />
      
      {rightActions}
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="account-circle"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item
          leadingIcon="account"
          title="Admin Profile"
          onPress={() => {
            setMenuVisible(false);
            // Navigate to admin profile if needed
          }}
        />
        <Divider />
        <Menu.Item
          leadingIcon="logout"
          title="Logout"
          onPress={handleLogout}
        />
      </Menu>
    </Appbar.Header>
  );
};

export default AdminHeader;
