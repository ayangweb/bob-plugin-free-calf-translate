// 引入 koa 框架
const Koa = require("koa2");

// 引入处理 post 数据的插件
const bodyParser = require("koa-bodyparser");

// 引入 koa 路由
const KoaRouter = require("koa-router");

// 引入 axios
const axios = require("axios");

// 创建服务器实例
const app = new Koa();

// 创建路由实例
const router = new KoaRouter();

// 使用bodyParser
app.use(bodyParser());

// 使用路由
app.use(router.routes(), router.allowedMethods());

// 监听端口
app.listen("5678", () => {
	console.log("端口号为 5678 的服务器已经启动！");
});

// 翻译 api
router.post("/translate", async (ctx) => {
	// body 传 src_text 为要翻译的内容
	const { body } = ctx.request;

	const params = {
		...body,
		source: "text",
		time: +new Date(),
	};

	// 文本语言
	const { data: textLanguage } = await axios.get(
		"https://test.niutrans.com/NiuTransServer/language",
		{
			params,
		}
	);

	if (!textLanguage?.language) return;

	const from = textLanguage?.language;

	// 获取翻译结果
	const to = from === "zh" || "yue" || "cht" ? "en" : "zh";

	const { data: translateResult } = await axios.get(
		"https://test.niutrans.com/NiuTransServer/testaligntrans",
		{
			params: {
				...params,
				from,
				to,
				dictNo: "",
				memoryNo: "",
				isUseDict: 0,
				isUseMemory: 0,
			},
			headers: {
				Cookie: "Hm_lvt_b0622cd752283bf08fa70c966ac2c3cd=1677307242; Hm_lpvt_b0622cd752283bf08fa70c966ac2c3cd=1677307242; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22186874d6535169-089667c53ac5cb-1f525634-1930176-186874d65361a2d%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com.hk%2F%22%7D%2C%22%24device_id%22%3A%22186874d6535169-089667c53ac5cb-1f525634-1930176-186874d65361a2d%22%7D",
				Origin: "https://niutrans.com",
				Referer: "https://niutrans.com/",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
			},
		}
	);

	if (!translateResult?.tgt_text) return;

	ctx.body = translateResult.tgt_text;
});
