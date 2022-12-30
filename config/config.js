var config = {
  webName: "http://api.technologymaze.com",
  webLogo: "https://www.spyfleet.com/wp-content/uploads/2016/10/logo-2.png",
  secret:
    "DLQTEf1apfzyapw6CfAWbRziQGrWrUR5Tb05HoMqV1nEAqr238OFh4uppV3UUTpvUwJtxWw1eYeh0srP0Gk7dR8MpaV2a1EWff6i",
  someSalt:
    "so4BntKqgaW4Mu1jpInnAKiPb3yDDYFeqqk67bZ9daS6JXKDkts955xULoOs9R7W8x5CUMmHEUJkye1hGani0I2TvyAYnEm6c0lQ",
  FACEBOOK_APP_ID: 228438620911171,
  FACEBOOK_APP_SECRET: "5cf3125b314fb470ef86faf742064be9",
  FACEBOOK_CALLBACK_URL: "http://plan.tidbits.in/auth/facebook/callback",
  mainWebHttpSuccessLoginCallback: "/#/fb_login/",
  mainWebHttpFailedLoginCallback: "http://localhost:4000/failed",
  mainWebHttpUnRegisteredLoginCallback: "/#/register",
  memcachedInfo: "memcached:11211",
  expirationTime: 43200,
  googleClientID:
    "    995689320203-sudrr19a9pf2h62j5up14f31srhjnm0t.apps.googleusercontent.com",
  googleClientSecret: "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",
  emailerURL: "smtp.mailgun.org",
  emailerUSER: "postmaster@ridelimos.com",
  emailerPASSWORD: "be90d9e67ccbdcede4b0bdd4316ab7b7",
  emailerPORT: 465,
  emailerSCHEMA: "ssl",
  emailerFROM: {
    email: "noreply@ridelimos.com",
    name: "Transit Planner Administration",
    signature: "Regards,<br>TidBits.in Team",
  },
  webAppBaseURL: "http://api.technologymaze.com",
  mapBoxToken:
    "pk.eyJ1IjoidGVjaG5vbG9neW1hemUiLCJhIjoiY2lzNnVtM3ptMDE1dzJ6cGtybW56djF3aSJ9.H2GCXKEeLniz3FclslXGsg",
  fullDatePattern: "YYYY-MM-DD HH:mm",
};

module.exports = config;
