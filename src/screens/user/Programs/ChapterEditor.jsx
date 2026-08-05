import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import ProgramContentEditor from "./ProgramContentEditor";
import {
  createChapter,
  updateChapter,
  publishProgram,
} from "../../../services/allServices";

export default function ChapterEditor({
  program,
  chapter,
  fetchProgram,
  setProgram,
  isEditing,
  setIsEditing,
  programId,
  navigation,
}) {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.chapter_name || "");
      setSubTitle(chapter.sub_title || "");
      setDescription(chapter.description || "");
    } else {
      setTitle("");
      setSubTitle("");
      setDescription("");
    }
  }, [chapter, isEditing]);

  const handleDraft = async () => {
    let res;
    if (chapter) {
      res = await updateChapter(chapter.chapter_id, {
        chapter_name: title,
        sub_title: subTitle,
        description,
      });
    } else {
      res = await createChapter({
        program_id: programId,
        chapter_name: title,
        sub_title: subTitle,
        description,
      });
    }

    if (res?.success) {
      Toast.show({ type: "success", text1: res.message || "Chapter saved" });
      if (!chapter) {
        setProgram((prev) => [...prev, res.data]);
      }
      await fetchProgram();
      setIsEditing(false);
    } else {
      Toast.show({ type: "error", text1: res?.message || "Failed to save" });
    }
  };

  const handleCancel = () => {
    if (chapter) {
      setTitle(chapter.chapter_name || "");
      setSubTitle(chapter.sub_title || "");
      setDescription(chapter.description || "");
    } else {
      setTitle("");
      setSubTitle("");
      setDescription("");
    }
    setIsEditing(false);
  };

  const handlePublishProgram = async () => {
    if (!programId) return;
    try {
      const res = await publishProgram(programId);
      if (res?.success) {
        Toast.show({ type: "success", text1: res.message });
        await fetchProgram();
        navigation.goBack();
      } else {
        Toast.show({ type: "error", text1: res?.message });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Something went wrong" });
    }
  };

  return (
    <ProgramContentEditor
    title={title}
    setTitle={setTitle}
    subTitle={subTitle}
    setSubTitle={setSubTitle}
    description={description}
    setDescription={setDescription}
    onDraft={handleDraft}
    onCancel={handleCancel}
    isEditing={isEditing}
    setIsEditing={setIsEditing}
    titleLabel="Chapter Name"
    publishProgram={handlePublishProgram}
    isNew={!chapter}
  />
  );
}