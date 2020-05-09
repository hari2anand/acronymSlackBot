const dictURL= process.env.DICT_URL;
const dictAppID= process.env.DICT_APPID;
const dictAppKey= process.env.DICT_KEY;
const dictLangCode = "en-gb";

module.exports= (queryInp)=> {
    return new Promise((resolve, reject) => {
        var request = require("request");
        var options = {
            method: "GET",
            url: `${dictURL}/${dictLangCode}/${queryInp.toLowerCase()}`,
            headers: {
                app_id: dictAppID,
                app_key: dictAppKey,
            },
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            //console.debug(response.body);
            resolve(response.body);
        });
    });
}