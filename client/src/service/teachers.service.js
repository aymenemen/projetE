import runtimeEnv from "@mars/heroku-js-runtime-env"
import axios from 'axios'

const env = runtimeEnv()

export default class TeacherService {

    constructor() {
        this.apiHandler = axios.create({
            baseURL: `http://localhost:4000/api/teachers`,
            withCredentials: true
        })
    }

    getTeachers = () => this.apiHandler.get('/getAllTeachers')
    getTheTeacher = teacherId => this.apiHandler.get(`/getTheTeacher/${teacherId}`)
    getTeacher = userId => this.apiHandler.get(`/getOneTeacher/${userId}`)
    saveTeacher = teacherInfo => this.apiHandler.post(`/newTeacher/`, teacherInfo)
    editTeacher = (teacherId, teacherInfo) => this.apiHandler.put(`/editTeacher/${teacherId}`, teacherInfo)
    deleteTeacher = teacherId => this.apiHandler.delete(`/deleteTeacher/${teacherId}`)
}