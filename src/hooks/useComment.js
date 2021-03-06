import { useState, useCallback, useRef } from "react";
import { parseISO, compareDesc } from "date-fns";

import {
  postComment,
  getReportComments,
  getReportFiles,
} from "../services/index";

export default function useComment() {
  const [reportComments, setReportComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [errorLoadingComment, setErrorLoadingComment] = useState(false);
  const [errorCreateComment, setErrorCreateComment] = useState(false);

  const mounted = useRef(true);

  const loadReportComments = useCallback(async (reportId) => {
    setIsLoadingComments(true);
    try {
      let data = await getReportComments(reportId);
      let filesData = await getReportFiles(reportId);
      // Adicionando arquivos na lista de comentarios
      filesData.map((file) => (file.comment = "O"));
      data = [...data, ...filesData];
      if (mounted.current) {
        data = data.sort((firstComment, secondComment) => {
          const firstDate = parseISO(firstComment.date);
          const secondDate = parseISO(secondComment.date);
          return compareDesc(firstDate, secondDate);
        });
        setReportComments(data);
        setIsLoadingComments(false);
      }
    } catch (error) {
      console.log("Erro a load");
      if (mounted.current) {
        console.log(error);
        setIsLoadingComments(false);
        setErrorLoadingComment(true);
      }
    }
    return;
  }, []);

  const createComment = async (newComment) => {
    setIsLoadingComments(true);
    try {
      const response = await postComment(newComment);
      setReportComments([response.data, ...reportComments]);
      setIsLoadingComments(false);
    } catch (error) {
      console.log("Erro ao tentar adicionar o novo comentário: ", newComment);
      console.log(error);
      setErrorCreateComment(true);
      setIsLoadingComments(false);
    }
  };

  /* Adiona um comentário e os arquivos na lista */
  const updateCommentList = async (newComment, fileList) => {
    setIsLoadingComments(true);
    try {
      const response = await postComment(newComment);

      fileList.map((file) => (file.comment = "O"));
      let data = [...reportComments, ...fileList];
      data = data.sort((firstComment, secondComment) => {
        const firstDate = parseISO(firstComment.date);
        const secondDate = parseISO(secondComment.date);
        return compareDesc(firstDate, secondDate);
      });

      setReportComments([response.data, ...data]);
      setIsLoadingComments(false);
    } catch (error) {
      console.log("Erro ao tentar adicionar o novo comentário: ", newComment);
      console.log(error);
      setErrorCreateComment(true);
      setIsLoadingComments(false);
    }
  }

  const addFilesToCommentList = (fileList) => {
    // Adicionando arquivos na lista de comentarios
    fileList.map((file) => (file.comment = "O"));
    let data = [...reportComments, ...fileList];
    data = data.sort((firstComment, secondComment) => {
      const firstDate = parseISO(firstComment.date);
      const secondDate = parseISO(secondComment.date);
      return compareDesc(firstDate, secondDate);
    });
    console.debug("Novos comentario: ", data);
    setReportComments(data);
  }
  
  return {
    reportComments,
    loadReportComments,
    createComment, // rever
    isLoadingComments,
    errorLoadingComment,
    setErrorLoadingComment,
    errorCreateComment,
    setErrorCreateComment,
    updateCommentList,
    addFilesToCommentList // rever
  };
}
