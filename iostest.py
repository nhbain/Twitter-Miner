# Import the necessary package to process data in JSON format
try:
    import json
except ImportError:
    import simplejson as json

# Load File ----------------------------------------
filename = 'ftn_pypoll_ComboStream-21.json'
with open(filename) as data_file:
    tweets = json.load(data_file)
# Load File ----------------------------------------

# Output Function ----------------------------------------
def output(data, outfn):
    print "Writing to file. . ."
    outputFile = 'Final_' + outfn + filename
    with open(outputFile, 'w') as outfile:
        json.dump(data, outfile, indent=4)
    return
# Output Function ----------------------------------------

minute = 60000
data1 = []
data2 = []
data3 = []
data4 = []
data5 = []

#Split Function ----------------------------------------
def split():
	minTime = int(tweets[0]['time'][0]) + minute/2
	firstCut = minTime + minute
	secondCut = minTime + (2*minute)
	thirdCut = minTime + (3*minute)
	fourthCut =  minTime + (4*minute)
	
	for tweet in tweets:
		if(int(tweet['time'][0]) > minTime and int(tweet['time'][0]) <= firstCut):
			data1.append(tweet)

		if(int(tweet['time'][0]) > firstCut and int(tweet['time'][0]) <= secondCut):
			data2.append(tweet)

		if(int(tweet['time'][0]) > secondCut and int(tweet['time'][0]) <= thirdCut):
			data3.append(tweet)

		if(int(tweet['time'][0]) > thirdCut and int(tweet['time'][0]) <= fourthCut):
			data4.append(tweet)

		if(int(tweet['time'][0]) > fourthCut):
			data5.append(tweet)
#Split Function ----------------------------------------

split()
print data1
# output(data1, 'first_minute_')
# output(data2, 'second_minute_')
# output(data3, 'third_minute_')
# output(data4, 'fourth_minute_')
# output(data5, 'fifth_minute_')