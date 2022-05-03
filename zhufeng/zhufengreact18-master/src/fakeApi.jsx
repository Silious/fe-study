

export function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //resolve({ id, name: '用户名' + id });
      reject({ errMsg: '数据获取失败' });
    }, 1000);
  });
}