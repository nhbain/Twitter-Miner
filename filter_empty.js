// API: https://www.npmjs.com/package/twitter
const autolinker = require('text-autolinker')
const Twitter = require('twitter')
const moment = require('moment')
const fs = require('fs')

//Variables
var inputname = "ComboStream-9-1.json"
var waitTime = 1 * 60 * 1001 //added 15 extra milliseconds just to be safe on the limit window
var tweets = []

function init(){
	
	var contents = fs.readFileSync(inputname)
	var data = JSON.parse(contents)
	
	//for(j = 0; j < data.length; j++){
	//		tweets.push({
	//			followers: data[j].followers,
	//			following: data[j].following,
	//		})
	//}
	console.log(data.length)
	for(j = 0; j < data.length; j++){
		if(data[j].hashtag != ""){
			tweets.push({
				id: data[j].id,
				rt_overtime: data[j].rt_overtime,
				fav_overtime: data[j].fav_overtime,
				time: data[j].time,
				user: data[j].user,
				user_location: data[j].user_location,
				profile_pic: data[j].profile_pic,
				followers: data[j].followers,
				following: data[j].following,
				text: data[j].text,
				fixed_text: data[j].fixed_text,
				hashtag: data[j].hashtag,
				coordinates: data[j].coordinates,
			})
		}
	}
	console.log(tweets.length)
//dump to new file
	output()
}

const output = () => {
	var json = JSON.stringify(tweets, null, 4)
	var filename = 'filtered_' + inputname
	fs.writeFile(filename, json, 'utf8', (error) => {
		if (error) throw error
		console.log('File saved as: ' + filename)
		process.exit()
	})
}

init()