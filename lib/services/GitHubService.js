const jwt = require('jsonwebtoken');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = class GitHubService {
    static async signIn(code){
        const token = await exchangeCodeForToken(code);
        const { username, email, avatar_url } = await getGithubProfile(token);
        let user = await GithubUser.findByUsername(username);
  
        if (!user)
          user = await GithubUser.insert({
            username,
            email,
            avatar: avatar_url,
          });
  
        const payload = jwt.sign({ ...user }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        });

        return payload;
    }
}