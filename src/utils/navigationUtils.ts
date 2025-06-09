import type { NavigateFunction } from 'react-router-dom';

export const navigateToThoughtsAndRefresh = async (
  navigate: NavigateFunction,
  refreshThoughts: () => Promise<void>
) => {
  // 导航到首页
  navigate('/');
  // 刷新数据
  await refreshThoughts();
  // 滚动到顶部
  const scrollContainer = document.querySelector('.scrollable-content');
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
};