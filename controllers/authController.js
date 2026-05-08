import { client } from "../config/redis.js";
import axios, { create } from "axios";
import { GithubConnection, Repository } from "../models/index.js";
import { where } from "sequelize";
class Auth {
    static async connect(req, res) {
        try {
            const state = Math.floor(Math.random() * 100000);
            await client.set("state", state, {
                EX: 300,
            });
            console.log("state", state);
            const CLIENT_ID = process.env.CLIENT_ID;
            const response_type = "code";
            const redirect_url = "http://localhost:3000/auth/callback";
            const gitUrl =
                `https://github.com/login/oauth/authorize` +
                `?state=${state}` +
                `&client_id=${CLIENT_ID}` +
                `&response_type=${response_type}` +
                `&redirect_uri=${redirect_url}`;
            res.redirect(gitUrl);
        } catch (error) {
            throw error;
        }
    }
    static async callback(req, res) {
        try {
            const { code, state } = req.query;

            const getState = await client.get("state");
            console.log(getState);
            if (state !== getState) {
                return res.send("invalid state");
            }
            const CLIENT_ID = process.env.CLIENT_ID;
            const response = await axios.post(
                `https://github.com/login/oauth/access_token`,
                {
                    code: code,
                    client_id: CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                },
                {
                    headers: {
                        Accept: "application/json",
                    },
                },
            );
            const { access_token } = response.data;
            console.log("acesstoken", access_token);
            const user = await axios.get("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const {data}=user
            console.log('da',data)
            await GithubConnection.create({
                user_id:'1',
                github_user_id:data.id,
                access_token:access_token,
                status:"active"

            })
            return res.send({
                success:true,
                data:user.data
            })
        } catch (error) {
            throw error;
        }
    }

    static async getRepo(req,res){

        const user = await GithubConnection.findOne({where:{user_id:1}})
        // console.log(user)
        const {access_token}= user
        // console.log(access_token)
        const repoData = await axios.get("https://api.github.com/user",{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        })
        const {repos_url}= repoData.data
        const repos = await axios.get("https://api.github.com/user/repos",{
            headers:{
                Authorization:`Bearer ${access_token}`
            }
        })
        // console.log(repos_url)
        // console.log('repoi',repos)

        for(let r  of repos.data){
            await Repository.create({
                github_repo_id:r.id,
                connection_id:user.id,
                name:r.name,
                full_name:r.full_name,
                private:r.private,
                stars:r.stargazers_count,
                created_at:r.created_at,
                updated_at:r.updated_at
            })
        }

        return res.send({
            success:true,
            data:repos.data
        })
    }
}

export default Auth;
