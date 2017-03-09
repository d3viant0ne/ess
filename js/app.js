// main config
app.constant("Config", {
  "ApiUrl": "data/feed.json",
  "PhotoUrl": "data/photos.json",
  "CommentUrl": "data/comments.json",
  "FriendsUrl": "data/friends.json",
  //"TestDataUrl": "data/testData.json" //move test data to cloud for ease of update
    "TestDataUrl": "https://dl.dropboxusercontent.com/u/74710899/BMW%20Test%20Data/testData.json"
})
// this is left over from the template
// config contact
app.constant("ConfigContact", {
  "EmailId": "weblogtemplatesnet@gmail.com",
  "ContactSubject": "Contact"
})
// config admon
app.constant("ConfigAdmob", {
  "interstitial": "ca-app-pub-3940256099942544/1033173712",
  "banner": "ca-app-pub-3940256099942544/6300978111"
})
// push notification
app.constant("PushNoti", {
  "senderID": "senderID",
})
