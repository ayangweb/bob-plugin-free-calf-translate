var config = require("./config");

function supportLanguages() {
	return config.languages.map(([language]) => language);
}

async function translate(query, completion) {
	try {
		const { text: src_text, detectFrom, detectTo } = query;

		// 获取请求参数中的语种
		const getLanguage = (detect) => {
			return config.languages.find(
				(language) => language[0] === detect
			)[1];
		};

		const from = getLanguage(detectFrom);

		const to = getLanguage(detectTo);

		const result = await $http.get({
			url: "https://test.niutrans.com/NiuTransServer/testaligntrans",
			body: {
				src_text,
				from,
				to,
				dictNo: "",
				memoryNo: "",
				isUseDict: 0,
				isUseMemory: 0,
				time: +new Date(),
			},
			header: {
				Cookie: "sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22186a038e167410-021c9252a1823c-1f525634-1930176-186a038e1681b08%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.google.com%2F%22%7D%2C%22%24device_id%22%3A%22186a038e167410-021c9252a1823c-1f525634-1930176-186a038e1681b08%22%7D; Hm_lvt_b0622cd752283bf08fa70c966ac2c3cd=1677725327,1677733929,1678171308; Hm_lpvt_b0622cd752283bf08fa70c966ac2c3cd=1678171308",
				Origin: "https://niutrans.com",
				Referer: "https://niutrans.com/",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
			},
			timeout: 1000 * 60,
		});

		if (!result?.data) {
			throw new Error({});
		}

		const { error_code, tgt_text } = result.data;

		if (error_code) {
			throw new Error({
				type: "unsupportedLanguage",
				message: "不支持该语种",
			});
		}

		completion({
			result: {
				from,
				to,
				toParagraphs: tgt_text.split("\n"),
			},
		});
	} catch ({ type = "unknown", message = "未知错误" }) {
		completion({
			error: {
				type,
				message,
				addtion: "如果多次请求失败，请联系插件作者！",
			},
		});
	}
}

module.exports = {
	supportLanguages,
	translate,
};
