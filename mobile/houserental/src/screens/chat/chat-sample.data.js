/**
 * This class must be deleted after test completed
 */
export default class ChatSampleData {
    static listAllChatTopics() {
        // http://localhost:8080/app/API/chat/listtopic/13 (userId)
        const values =
            [
                {
                    "topicId": "a8dc65b1-b957-4c70-bf13-567ed19f7788",
                    "userId": 15,
                    "userName": "Chi Vy",
                    "userProfile": "http://172.16.15.243:8059/ersys-cdn/ws/api/getFile?bucketName=ersys-testing-storage/kwizko/cdn&path=hr/people/15/photo/15/IMG_1867.HEIC",
                    "recipientName": "Chi Vy",
                    "recipientId": 14,
                    "recipientProfile": null,
                    "lastMessage": "This is my last message",
                    "sentDate": 1592558200840,
                    "unreadCount": 2
                },
                {
                    "topicId": "06f9cc53-260e-48b4-b7d6-fddd1c3c193d",
                    "userId": 15,
                    "userName": "Chi Vy",
                    "userProfile": "http://172.16.15.243:8059/ersys-cdn/ws/api/getFile?bucketName=ersys-testing-storage/kwizko/cdn&path=hr/people/15/photo/15/IMG_1867.HEIC",
                    "recipientName": "Nida Van",
                    "recipientId": 16,
                    "recipientProfile": "http://172.16.15.243:8059/ersys-cdn/ws/api/getFile?bucketName=ersys-testing-storage/kwizko/cdn&path=hr/people/16/photo/16/image-81850433-c6ba-435a-973d-823d4a60e6ef.jpg",
                    "lastMessage": null,
                    "sentDate": null,
                    "unreadCount": 0
                }
            ];
        return values;
    }

    static listAllMessagesByTopicId() {
        // http://localhost:8080/app/API/chat/listmessage/9670a894-2aa3-47b4-bfa0-2b43e122cb5a (topicID)
        const allMessages =
            [
                {
                    "id": "946de669-5c7d-4851-b351-43137cb9522f",
                    "topicId": "a8dc65b1-b957-4c70-bf13-567ed19f7788",
                    "fromUserId": 15,
                    "fromUserName": "Chi Vy",
                    "profileImage": "http://172.16.15.243:8059/ersys-cdn/ws/api/getFile?bucketName=ersys-testing-storage/kwizko/cdn&path=hr/people/15/photo/15/IMG_1867.HEIC",
                    "message": "This is my last message",
                    "recipientId": 14,
                    "recipientName": "Chi Vy",
                    "sentDate": 1592558200840,
                    "readDate": 1592559907305,
                    "attachmentUrl": null
                },
                {
                    "id": "7a440a49-06ba-487f-a963-6a1ea4a9a9ff",
                    "topicId": "a8dc65b1-b957-4c70-bf13-567ed19f7788",
                    "fromUserId": 14,
                    "fromUserName": "Chi Vy",
                    "profileImage": null,
                    "message": "This is my last message",
                    "recipientId": 15,
                    "recipientName": "Chi Vy",
                    "sentDate": 1592558146284,
                    "readDate": null,
                    "attachmentUrl": null
                },
                {
                    "id": "269ac4db-e687-419b-822a-ccbb3d905aab",
                    "topicId": "a8dc65b1-b957-4c70-bf13-567ed19f7788",
                    "fromUserId": 14,
                    "fromUserName": "Chi Vy",
                    "profileImage": null,
                    "message": "This is my last message",
                    "recipientId": 15,
                    "recipientName": "Chi Vy",
                    "sentDate": 1592558123765,
                    "readDate": null,
                    "attachmentUrl": null
                }
            ];
        return allMessages;
    }

    static getMessageById() {
        //http://localhost:8080/app/API/chat/message/3d917316-be51-4424-8c93-2274d2f954b6 (messageID)
        return {
            "id": "946de669-5c7d-4851-b351-43137cb9522f",
            "topicId": "a8dc65b1-b957-4c70-bf13-567ed19f7788",
            "fromUserId": 15,
            "fromUserName": "Chi Vy",
            "profileImage": "http://172.16.15.243:8059/ersys-cdn/ws/api/getFile?bucketName=ersys-testing-storage/kwizko/cdn&path=hr/people/15/photo/15/IMG_1867.HEIC",
            "message": "This is my last message",
            "recipientId": 14,
            "recipientName": "Chi Vy",
            "sentDate": 1592558200840,
            "readDate": 1592559907305,
            "attachmentUrl": null
        };
    }

    static notifictationData() {
        return {
            "app_id":"efb27d7a-5a5d-40ea-b57b-28cc029557ac",
            "filters":[
               {
                  "field":"tag",
                  "key":"user_id",
                  "relation":"=",
                  "value":"14"
               }
            ],
            "data":{
               "id":"c0216370-fc75-4a57-b5fb-d07807967b83",
               "topicId":"a8dc65b1-b957-4c70-bf13-567ed19f7788",
               "fromUserId":15,
               "fromUserName":"Chi Vy",
               "profileImage":"http://172.16.15.243:8059/ersys-cdn/ws/api/getFile?bucketName=ersys-testing-storage/kwizko/cdn&path=hr/people/15/photo/15/IMG_1867.HEIC",
               "message":"This is my last message",
               "recipientId":14,
               "recipientName":"Chi Vy",
               "sentDate":1592561313910,
               "readDate":null,
               "unreadCount": 2,
               "attachmentUrl":null
            },
            "contents":{
               "en":"This is my last message"
            },
            "headings":{
               "en":"Chi Vy"
            }
         };
    }
}