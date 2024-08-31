import { Button, Image, Text, Textarea, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
import askicon from '@/common/assets/img/publishQuestion/ask.png';
import { Course } from '@/common/assets/types';
import { get, post } from '@/common/utils/fetch';

import './index.scss';

export interface UserInfo {
  avatarUrl: string; // 用户头像的URL
  nickName: string; // 用户昵称
}

export interface ResponseUser {
  code?: number;
  data: WebUserProfileVo;
  msg?: string;
}

export interface WebUserProfileVo {
  avatar: string;
  ctime: number;
  grade_sharing_is_signed?: boolean;
  id: number;
  /**
   * 是否为新用户，新用户尚未编辑过个人信息
   */
  new: boolean;
  nickname: string;
  studentId: string;
  title_ownership: { [key: string]: boolean };
  using_title: string;
  utime?: number;
}

const getCurrentDate = () => {
  // 创建一个新的Date对象，它将被初始化为当前日期和时间
  const now = new Date();

  // 获取年、月、日
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() 返回的月份是从0开始的
  const day = now.getDate();

  // 格式化为 YYYY-MM-DD
  const formattedDate = `${year}年${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;

  return formattedDate;
};

export default function Index() {
  const [course, setCourse] = useState<Course | null>(null);

  const courseId = 2347; //先用概率统计A来调试吧！

  //用户个人身份信息
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [nickName, setNickName] = useState<string>('昵称');

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const getCourseData = async () => {
      try {
        void get(`/courses/${courseId}/detail`, true).then((res) => {
          console.log(res);
          // 检查 res 是否有 data 属性，并且断言其类型
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          setCourse(res?.data as Course);
        });
      } catch (error) {
        // 错误处理，例如弹出提示
        console.error('Failed to fetch course data:', error);
      }
    };

    if (courseId) void getCourseData().then((r) => console.log(r));
  }, [courseId]); // 在courseId变化时运行

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = '/users/profile';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response: ResponseUser = await get(url);
        if (
          typeof response?.data?.nickname == 'string' &&
          typeof response?.data?.avatar == 'string'
        ) {
          setNickName(response?.data?.nickname);
          setAvatarUrl(response?.data?.avatar);
        }
      } catch (error) {
        console.error('Error fetching collection data:', error);
      }
    };
    void fetchProfile();
  }, []); //仅在挂载时运行一次

  const [question, setQuestion] = useState<string>('');

  const countContent = (e) => {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { value } = e?.detail ?? {};
    if (typeof value === 'string') {
      setQuestion(value);
    } else {
      console.error('Expected a string but received a different type');
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    // const length = value.length;
    // setLength(length);
  };

  const postQuestion = () => {
    const questionobj = {
      biz: 'Course',
      biz_id: courseId,
      content: question,
    };
    post(`/questions/publish`, questionobj)
      .then((res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (res?.code === 0) {
          // 打印成功信息，但最好使用其他日志记录方式，而不是 console.log
          // 例如：this.setState({ message: '发布课评成功' });
          void Taro.showToast({ title: '发布问题成功', icon: 'success' });
          // console.log('发布课评成功');
          // 使用 redirectTo 跳转
          // void Taro.redirectTo({
          //   url: '/pages/main/index', // 页面路径
          // });
        } else {
          // 处理其他响应代码，可能需要给用户一些反馈
          void Taro.showToast({ title: '发布课评失败', icon: 'none' });
        }
      })
      .catch((error) => {
        // 处理可能出现的错误情况
        void Taro.showToast({ title: '发布失败，请稍后重试', icon: 'none' });
        console.error('发布问题请求失败:', error);
      });
  };
  return (
    <View>
      <View className="theClassnme">{course?.name}</View>
      <View className="teacherName">
        {course?.school} {course?.teacher}
      </View>
      <View className="publishView">
        <View className="publish-header">
          <Image src={avatarUrl ?? ''} className="avatar" />
          <View className="nameDate">
            <Text className="nickname">{nickName}</Text>
            <View className="currentDate">{getCurrentDate()}</View>
          </View>
        </View>
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          <Image src={askicon} className="askicon"></Image>
        }
        <Textarea
          maxlength={450}
          onInput={countContent}
          placeholderStyle="font-size: 25rpx;"
          placeholder="关于课程你有什么要了解的？"
          className="quesionContent"
        ></Textarea>
      </View>
      <Button onClick={postQuestion} className="publishBtn">
        提交
      </Button>
    </View>
  );
}
