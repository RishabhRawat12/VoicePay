import axios from "axios";

const base_url="http://127.0.0.1:5000";

export const registerUser= async(userData)=>{
    try{
        const response= await axios.post(`${base_url}/register`,userData);
        return response.data;
    }

    catch(error){
        if(error.response){
            return {error:error.response.data.message};
        }
        return {error:error.message};
    }
};

export const loginUser=async(loginData)=>{
    try{
        const response=await axios.post(`${base_url}/login`,loginData);
        return response.data;
    }
    catch(error){
        if(error.response){
            return {error:error.response.data.message};
        }
        return {error:error.message};
    }
};

export const getUser= async(userId)=>{
    try{
        const response=await axios.get(`${base_url}/user/${userId}`);
        return response.data;
    }
    catch(error){
        if(error.response){
            return {error:error.response.data.message};
        }
        return {error:error.message};
    }
};

export const createTransaction= async(transactionData)=>{
    try{
        const response=await axios.post(`${base_url}/transaction`,transactionData);
        return response.data;
    }
    catch(error){
        if(error.response){
            return {error:error.response.data.message};
        }
        return {error:error.message};
    }
};

export const voiceTransaction= async(voiceData)=>{
    try{
        const response=await axios.post(`${base_url}/voice-transaction`,voiceData);
        return response.data;
    }
    catch(error){
        if(error.response){
            return {error:error.response.data.message};
        }
        return {error:error.message};
    }
};

export const getTransaction= async(userId)=>{
    try{
        const response=await axios.get(`${base_url}/transactions/${userId}`);
        return response.data;
    }
    catch(error){
        if(error.response){
            return {error:error.response.data.message};
        }
        return {error:error.message};
    }
};

export const parseVoiceCommand = async (voiceData) => {
    try {
        const response = await axios.post(`${base_url}/parse-voice-command`, voiceData);
        return response.data;
    } catch (error) {
        if (error.response) {
            return { error: error.response.data.message };
        }
        return { error: error.message };
    }
};