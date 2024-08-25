import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { memo } from 'react';
import { AtIcon } from 'taro-ui';

import './index.scss';

// eslint-disable-next-line import/first
import useActiveButtonStore, { ActiveButtonType } from '@/common/hooks/useActiveNav';

interface TabBarProps {}

const TAB_LIST: Array<{ pagePath: string; name: string; icon?: string }> = [
  { pagePath: '/pages/main/index', name: 'Home', icon: 'streaming' },
  { pagePath: '/pages/123/index', name: 'Download', icon: 'download-cloud' },
  { pagePath: '/pages/456/index', name: '+' },
  { pagePath: '/pages/789/index', name: 'Massage', icon: 'message' },
  { pagePath: '/pages/personalPage/index', name: 'Profile', icon: 'user' },
];

const TabBar: React.FC<TabBarProps> = memo(() => {
  const { activeButton, setActiveButton } = useActiveButtonStore();

  return (
    <View className="guild_line">
      {TAB_LIST.map((item, index) => (
        <>
          {item.name === '+' ? (
            <View className="add_button">
              <View className="add_sign">+</View>
            </View>
          ) : (
            <AtIcon
              key={index}
              value={item.icon as string}
              size="35"
              color={activeButton === item.name ? '#f18900' : '#FFD777'}
              onClick={() => {
                void Taro.switchTab({ url: item.pagePath });
                setActiveButton(item.name as ActiveButtonType);
              }}
            ></AtIcon>
          )}
        </>
      ))}
    </View>
  );
});

export default TabBar;
