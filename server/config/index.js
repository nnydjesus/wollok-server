require('dotenv').config({ path: './.env' });

export default {
	env: process.env.NODE_ENV || 'development',
	server:{
		port: process.env.PORT || 3033
	},
	jwt:{
		secret: process.env.JWT_SECRET
	},
	logger: {
		host: process.env.LOGGER_HOST, // Papertrail Logging Host
		port: process.env.LOGGER_PORT, // Papertrail Logging Port
	},
	github:{
		token: process.env.GITHUB_TOKEN,
		clientId: process.env.GITHUB_CLIENT_ID,
		secret: process.env.GITHUB_SECRET
	},
	email: {
		sender: {
			default: {
				name: process.env.EMAIL_SENDER_DEFAULT_NAME, // Your Name
				email: process.env.EMAIL_SENDER_DEFAULT_EMAIL, // nick@your-domain.com
			},
			support: {
				name: process.env.EMAIL_SENDER_SUPPORT_NAME, // API Support
				email: process.env.EMAIL_SENDER_SUPPORT_EMAIL, // support@your-domain.com
			},
		},
		sendgrid: {
			secret: process.env.EMAIL_SENDGRID_SECRET, // SendGrid API Secret
		},
	},
	stream: {
		appId: process.env.STREAM_APP_ID, // Stream Credentials – https://getstream.io
		apiKey: process.env.STREAM_API_KEY, // Stream Credentials – https://getstream.io
		apiSecret: process.env.STREAM_API_SECRET, // Stream Credentials – https://getstream.io
	},
	database:{
		uri: process.env.MONGO_URI
	},
	facebook:{
		appId: process.env.FACEBOOK_APP_ID,
		secret: process.env.FACEBOOK_SECRET
	},
	google:{
		clientId: process.env.GOOGLE_CLIENT_ID,
		secret: process.env.GOOGLE_CLIENT_SECRET
	}
};
