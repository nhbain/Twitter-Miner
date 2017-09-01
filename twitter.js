// API: https://www.npmjs.com/package/twitter
const autolinker = require('text-autolinker')
const Twitter = require('twitter')
const moment = require('moment')
const fs = require('fs')


// Timing variables
// NOTE: May want a seprate timeout for killing streaming
// 	this way polling may continue on a limited subset instead of an ever increasing set
var streamingWindow = 4 * 60 * 1000
var location = ''

//-----------------------------------------------------------------------------------------------

//Twitter API access info -NHB
const client = new Twitter({
	consumer_key: 'iCqI27Unu8I8z8X8ktqkqdekS',
	consumer_secret: 'w7TqSQfdHQnGaF1NZEWZO18ahW7gFArIXfjKLTNhQ4lPxqf4m8',
	access_token_key: '835131198108282880-RsY3sTnIiIUZMfSQfBap9BYFAqe5pLa',
	access_token_secret: 'R3kPEA1lyFwdjzFw3RtoFuF0US9fBmpD3g2x1Sb9ztwRD'
})

//Twitter API access info -ZC
// const client = new Twitter({
// 	consumer_key: 'gvo7T1pUunt1GNI2Cwgbfo9m2',
// 	consumer_secret: 'dOBoQkxkPj1PrkDZlcfZp9HDrD4EhpHhI4fiFaZLxtHmoecSD6',
// 	access_token_key: '513238808-OB5OlMjXL3mIcaEnwbCvQK3FjPM4c32qTY1iCl1K',
// 	access_token_secret: 'HLzvjVzgrMcp11p2yjCO3pC9NlZzDCVQFJicRaviefJcU'
// })

//-----------------------------------------------------------------------------------------------

// Pull all statuses relating to specified keyword (track:'keyword')
// Streaming message types: https://dev.twitter.com/streaming/overview/messages-types
// https://dev.twitter.com/streaming/overview/request-parameters
// NOTE: For tracking comma function as logical OR while space functions as logical AND
// NOTE: Location requires bounding box Easy way to get bbox
//  1. Go to http://boundingbox.klokantech.com/
//  2. Set copy/paste to csv raw
const stream = client.stream('statuses/filter', {
	track: '#19YearsLater,#HelloSeptember,#honestyhour,#CollegeColorDay,#ForceFriday' //ComboStream-9-1
	// track: '#4WordEmbarrasment,#NationalDogDay,#SomeDayIWill,#prayfortexas,#SaturdayMorning,#USA' //ComboStream-8-26	
	// track: '#FridayFeeling,#FlashbackFriday,#Harvey2017,#IfComedyDidntExist,#JavaScript,#USA' //ComboStream-8-25	
	// track: '#SundayMorning,#FakeAirlineFacts,#ShakespeareSunday,#ElClasico,#NYCvORL' //ComboStream-23
	// track: '#marchforscience,#saturdaymorning,EarthDay,#satchat' ComboStream-22
	//track: '#RIPPrince,#FridayFeeling,#FlashbackFriday,#poweroutage,#nationalteaday,EarthDay' ComboStream-21
	//locations: '-117.4699401855,33.9883491527,-117.0991516113,34.1941975383' <- this is the location for the festival
})

// Reference to example response
// https://dev.twitter.com/rest/reference/get/statuses/show/id

//-----------------------------------------------------------------------------------------------
// var keys = ['FridayFeeling','FlashbackFriday','Harvey2017', 'IfComedydidntExist','JavaScript','USA']
// var keys = ['4WordEmbarrassment','NationalDogDay','SomeDayIWill', 'prayfortexas','SaturdayMorning','USA']
var keys = ['19YearsLater','HelloSeptember','honestyhour', 'CollegeColorDay','ForceFriday']
var data = []
var tempData = []
stream.on('data', (tweet) => {
	// console.log(tweet.entities.hashtags)
	var hashtag = ''
	for(i = 0; i < tweet.entities.hashtags.length; i++){
		// console.log(tweet.entities.hashtags[i].text)

		for(j = 0; j < keys.length; j++){
			if(tweet.entities.hashtags[i].text == keys[j]){
				hashtag = keys[j]
				console.log(keys[j] + "  MATCH")
			}
		}
	}
	//https://twitter.com/search?q=%23test&src=typd
	// Process collected data
	// NOTE: Using try-catch to handle errors near end of stream
	try {
		autolinker.parse(tweet, function(err,result){
			var text = result.html
			data.push({
				id: tweet.id_str,
				rt_overtime: [tweet.retweet_count],
				fav_overtime: [tweet.favorite_count],
				time: [tweet.timestamp_ms],
				user: tweet.user.screen_name,
				user_location: tweet.user.location,
				profile_pic: tweet.user.profile_image_url,
				followers: tweet.user.followers_count,
				following: tweet.user.friends_count,
				text: tweet.text,
				fixed_text: text,
				hashtag: hashtag,
				coordinates: tweet.coordinates
			})
		});
	} catch (e) {}
})

stream.on('error', (error) => {
	throw error
})

//-----------------------------------------------------------------------------------------------


const output = () => {
	// Dump to file
	var json = JSON.stringify(data, null, 4)
	var filename = 'ComboStream-9-1' + '.json'
	fs.writeFile(filename, json, 'utf8', (error) => {
		if (error) throw error
		console.log('File saved as: ' + filename)
		process.exit()
	})
}

//-----------------------------------------------------------------------------------------------


const endStreaming = () => {
	console.log('Ending streaming . . .' + moment().format('LLLL'))
	stream.destroy()
	console.log('Writing to file . . .')
	output()
}

//-----------------------------------------------------------------------------------------------


// First: run stream then end it
var startMoment = moment().millisecond()
console.log('Starting streaming . . .' + moment().format('LLLL'))
setTimeout(endStreaming, streamingWindow)
