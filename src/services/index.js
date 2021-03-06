import axios from "axios";
import { getToken } from "./auth";
import { statusCharToString, statusStringToChar } from "../utils/statusConverter";
import { format } from "date-fns";
const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL
});

const apiDev = axios.create({
  baseURL: process.env.REACT_APP_JSON_SERVER
});

/* Adicionando o token de autenticação no cabeçalho de cada request */
api.interceptors.request.use(async config => {
  const token = getToken();
  if (token && token !== "TOKEN") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/******** Denúncias ********/
export async function getReports(){
  const response = await api.get('/denuncias');
  const reports = response.data;
  
  const data = reports.map((report, key) => {
    return {
      "id": report.id,
      "description": report.descricao,
      "address": report.endereco,
      "animal": report.especie,
      "breeds": report.raca,
      "status": statusCharToString(report.status),
      "isAnonymous": report.indAnonimo,
      "lat": report.latitude,
      "lng": report.longitude,
      "author": report.author,
      "date": report.data,
      "userId": report.usuarioId
    }
  });
  return data;
}

export async function postReport(report){  
  const obj = {
    "descricao": report.description,
    "endereco": report.address,
    "especie": report.animal,
    "raca": report.breeds,
    "status": statusStringToChar(report.status),
    "indAnonimo": report.isAnonymous,
    "longitude": report.lng,
    "latitude": report.lat,
    "data": report.date,
    "author": report.author,
    "usuarioId": report.userId
  }
  return api.post('/denuncias', obj);
}

export async function putReport(report, id){
  const obj = {
    "id": id,
    "descricao": report.description,
    "endereco": report.address,
    "especie": report.animal,
    "raca": report.breeds,
    "status": statusStringToChar(report.status),
    "indAnonimo": report.isAnonymous,
    "longitude": report.lng,
    "latitude": report.lat,
    "data": report.date,
    "author": report.author,
    "usuarioId": report.userId
  }
  return api.put('/denuncias', obj);
}

export async function deleteReport(id){
  return api.delete('/denuncias/' + id);  
}

export async function postUpdateStatus(obj){  
  console.log("POST: ", obj);
  return api.post('/denuncias/atualizarStatus', obj);
}

/******** Comentários ********/
export async function getComments(){
  return (await api.get('/comment')).data;
}

export async function postComment(comment){
  comment.date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
  return api.post('/comment', comment);
}

export async function getReportComments(reportId){
  const response = await api.get(`/comment/${reportId}`);
  return response.data;
}

/******** Arquivos ********/
export async function postFile(file){
  file.date =  format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS");
  return api.post('/files', file);
}

export async function getReportFiles(reportId){
  const response = await api.get(`/files/reports/${reportId}`);
  return response.data;
}

export async function deleteFile(id){
  return api.delete('/files/' + id);  
}

/******** Login ********/
export async function postSignIn(signIn){
  const obj = {
    email: signIn.email,
    password: signIn.password
  }
  const response = await api.post('/authenticate', obj);
  const data = response.data;
  return { 
    token: data.jwt,
    username: data.nome,
    email: data.email,
    isAdmin: data.admin  
  };
}

export async function postSignUp(signUp){
  const obj = {
    nome: signUp.name,
    email: signUp.email,
    senha: signUp.password
  }
  const data = (await api.post('/cadastro', obj)).data;
  return { 
    token: data.jwt,
    username: data.nome,
    email: data.email,
    isAdmin: data.admin  
  };
}

export async function postGoogleSignIn(signIn) {
  const obj = {
    email: signIn.email,
    nome: signIn.name
  }
  const response = await api.post('/authenticate/google', obj);
  const data = response.data;
  return { 
    token: data.jwt,
    username: data.nome,
    email: data.email,
    isAdmin: data.admin  
  };
}

/******** Denúncias JSON SERVER ********/
export async function getReportsDev(){
  return (await apiDev.get('/reports')).data;
}

export async function postReportDev(report){
  return apiDev.post('/reports', report);
}

export async function putReportDev(id){
  return;
}

export async function deleteReportDev(id){
  return;
}

/******** Comentários ********/
export async function getCommentsDev(){
  return (await apiDev.get('/comments')).data;
}

export async function postCommentDev(comment){
  comment.date = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
  return apiDev.post('/comments', comment);
}

export async function getReportCommentsDev(reportId){
  const response = await apiDev.get('/comments', { params: { reportId} });
  return response.data;
}

/******** Arquivos ********/
export async function postFileDev(file){
  file.date =  format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSSSS");
  return apiDev.post('/files', file);
}

export async function getReportFilesDev(reportId){
  const response = await apiDev.get('/files', { params: { reportId } });
  return response.data;
}

export async function deleteFileDev(id){
  return apiDev.delete('/files/' + id);  
}

/******** Funções fake de login e cadastro ********/
export async function postSignInDev(signIn){
  console.log("Login: ", signIn);
  console.log("...");
  await delay(2000);
  console.log("ok");
  return { data: { token: "TOKEN"} };
}

export async function postSignUpDev(signUp){
  console.log("Novo cadastro: ", signUp);
  console.log("...");
  await delay(2000);
  console.log("ok");
  return;
}

export async function postGoogleSignInDev(signIn) {
  console.log("Login via Google: ", signIn);
  await delay(2000);
  return { data: { token: signIn.token }};
}

/******** útil ********/
const delay = ms => new Promise(res => setTimeout(res, ms));