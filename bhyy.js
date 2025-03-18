const axios = require("axios");
const http = require("http");
const https = require("https");

const _http = axios.create({
  timeout: 15 * 1000,
  httpsAgent: new https.Agent({ keepAlive: true, rejectUnauthorized: false }),
  httpAgent: new http.Agent({ keepAlive: true }),
  baseURL: "https://py.doube.eu.org/spider?site=BaHaoTV", //替换成其他地址
});

// 添加拦截器来设置User-Agent头部
_http.interceptors.request.use(config => {
  config.headers['User-Agent'] = 'okhttp/5.0.0-alpha.14';
  return config;
}, error => {
  return Promise.reject(error);
});

// 例子请求
_http.get('/some-endpoint')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });


const fetch = async (req) => {
  delete req.query["token"];
  const { flag, play } = req.query;
  if (
    play &&
    /\.(m3u8|mp4|rmvb|avi|wmv|flv|mkv|webm|mov|m3u)(?!\w)/i.test(play)
  ) {
    return {
      url: play,
      jx: 0,
      parse: 0,
    };
  }

  const ret = await _http("", {
    params: req.query,
  });
  return ret.data;
};

const meta = {
  key: "bhyy", //key不能与其他site冲突
  name: "八号影院",
  type: 4,
  api: "/video/bhyy", //使用相对地址，服务会自动处理，不能与其他site冲突
  searchable: 1,
  quickSearch: 1,
  changeable: 0,
};

module.exports = async (app, opt) => {
  app.get(meta.api, fetch);
  opt.sites.push(meta);
};
