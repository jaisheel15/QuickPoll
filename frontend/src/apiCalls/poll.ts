import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const getAllPolls = async () => {
    const res = await axios.get('/api/polls')
    return res.data
}

export const createPoll = async (question:string, options:any[]) => {
    const res = await axios.post('/api/polls', { question, options })
    return res.data
}

export const votePoll = async (pollId:string, optionIndex:number) => {
    const res = await axios.post(`/api/polls/${pollId}/vote`, { optionIndex })
    return res.data
}
export const getPollById = async (pollId:string) => {
    const res = await axios.get(`/api/polls/${pollId}`)
    return res.data
}
