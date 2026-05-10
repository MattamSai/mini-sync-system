import { configDotenv } from "dotenv";
import { client } from "../config/redis.js";
import axios, { create } from "axios";
import { GithubConnection, Repository } from "../models/index.js";
import { where } from "sequelize";
configDotenv()
class Auth {
    static async connect(req, res) {
        try {
            const state = Math.floor(Math.random() * 100000);
            await client.set("state", state, {
                EX: 300,
            });
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
            const user = await axios.get("https://api.github.com/user", {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            const {data}=user
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
        const {access_token}= user
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


        const respositories = repos.data.map((r)=>({
                github_repo_id:r.id,
                connection_id:user.id,
                name:r.name,
                full_name:r.full_name,
                private:r.private,
                stars:r.stargazers_count,
                created_at:r.created_at,
                updated_at:r.updated_at
        }))

        await Repository.bulkCreate(respositories,{
            updateOnDuplicate:[
                'name',
                'full_name',
                'private',
                'stars',
                'updated_at'
            ]
        })

        user.last_synced_at=new Date()
        await user.save()

        return res.send({
            success:true,
            data:repos.data
        })
    }
}

export default Auth;
