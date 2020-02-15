const request = require('request');

const byteApi = 'https://api.byte.co/'
const byteAgent = 'byte/0.2 (co.byte.video; build:145; iOS 13.2.0) Alamofire/4.9.1'
const authKey = ''
const comment = ''


function byteRequest() {
    const options = {
		method: 'GET',
		url: `${byteApi}feed/global`,
		headers: {
            'Content-Type': 'application/json',
            'User-Agent': byteAgent,
            'Authorization': authKey,
        },
	};
	request(options, function(err, response, body) {
		if (err) {
			console.log(err);
		}
		else {
            parseByteFeed(body);
		}
	});
}
byteRequest();

function parseByteFeed(body) {
    let parsedBody = JSON.parse(body)
    let posts = parsedBody.data

    delete posts.cursor
    for (let [catergory, value] of Object.entries(posts)) {
		for(let i = 0, l = value.length; i < l; i++) {
            let byteId = value[i].id;
            postComment(byteId)
        }
    }
} 

function timeout(byteId) {
    setTimeout(() => {
        postComment(byteId)
      }, Math.floor(Math.random() * 18321) + 10321)
}


function postComment(byteId) {
    const options = {
		method: 'POST',
		url: `${byteApi}post/id/${byteId}/feedback/comment`,
		headers: {
            'Content-Type': 'application/json',
            'User-Agent': byteAgent,
            'Authorization': authKey,
        },
        json: true,
        body: {
            "postID": byteId,
            "body": comment,
        },
	};
	request(options, function(err, response, body) {
		if (err) {
			console.log(err);
		}
		else {
            if (response.statusCode === 200) {
                console.log(response.statusCode, 'comment sent')
            }
            else if (response.statusCode === 429)
                console.log(response.statusCode, 'ratelimit')
            }
            timeout(byteId)
            console.log(body)
	});
}
