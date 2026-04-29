/**
 * 统一的日期格式化工具
 */

/**
 * 将 Date 对象格式化为 "YYYY-MM-DD" 字符串
 */
export const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 获取当前日期的格式化字符串
 */
export const getTodayString = () => {
  return formatDateString(new Date());
};

/**
 * 计算日期之间的天数差
 */
export const getDaysDiff = (startDate, endDate = new Date()) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * 获取指定天数后的日期字符串
 */
export const getDateAfterDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return formatDateString(result);
};

/**
 * 比较两个日期字符串是否相等（忽略格式差异）
 */
export const isSameDate = (dateStr1, dateStr2) => {
  const normalize = (str) => {
    if (!str) return '';
    return str.trim().replace(/[/-]/g, '-').split(' ')[0];
  };
  return normalize(dateStr1) === normalize(dateStr2);
};
