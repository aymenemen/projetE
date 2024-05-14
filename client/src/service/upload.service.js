import axios from 'axios'



export default class FilesService {
  constructor() {
    this.apiHandler = axios.create({
      baseURL: `http://localhost:4000/api/files`,
      withCredentials: true
    })
  }

  uploadImage = imageForm => this.apiHandler.post('/upload', imageForm)
}