import { Button, Input, InputNumber, Modal } from "antd";
import React, { useState } from "react";

import styles from "./BooksList.module.css";
import { Book } from "../../models/book";
import { addBook } from "../../api";

const date = new Date();
const defaultYear = String(date.getFullYear());

const initialForm = {
  title: "",
  author: "",
  year: defaultYear,
  language: "",
  country: "",
  pages: "",
  link: "",
  id: 0,
};

const isFormValid = (form: Book) => {
  if (form.title === "") {
    return false;
  }
  if (form.author === "") {
    return false;
  }
  if (form.year === "" || !isNaN(Number(form.year))) {
    return false;
  }
  if (form.language === "") {
    return false;
  }
  if (form.country === "") {
    return false;
  }
  if (form.pages === "" || !isNaN(Number(form.pages))) {
    return false;
  }
  if (form.link === "") {
    return false;
  }

  return true;
};

export default function AddBookModal({ onAdd }: { onAdd: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Book>(initialForm);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      if (!isFormValid(form)) {
        // TODO: show toast.
        return;
      }
      await addBook(form);
      onAdd();
    } catch (err) {
      console.error(err);
      // TODO: show toast.
    } finally {
      setForm(initialForm);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add to Books List
      </Button>
      <Modal
        title="Add Book"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className={styles.formContainer}>
          <span>
            <label>Title</label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </span>
          <span>
            <label>Author</label>
            <Input
              value={form.author}
              onChange={(e) =>
                setForm((f) => ({ ...f, author: e.target.value }))
              }
            />
          </span>
          <span>
            <label>Year</label>
            <InputNumber
              className={styles.number}
              value={form.year}
              onChange={(value) =>
                setForm((f) => ({ ...f, year: value as string }))
              }
            />
          </span>
          <span>
            <label>Language</label>
            <Input
              value={form.language}
              onChange={(e) =>
                setForm((f) => ({ ...f, language: e.target.value }))
              }
            />
          </span>
          <span>
            <label>Country</label>
            <Input
              value={form.country}
              onChange={(e) =>
                setForm((f) => ({ ...f, country: e.target.value }))
              }
            />
          </span>
          <span>
            <label>Pages</label>
            <InputNumber
              className={styles.number}
              value={form.pages}
              onChange={(value) =>
                setForm((f) => ({ ...f, pages: value as string }))
              }
            />
          </span>
          <span>
            <label>Link</label>
            <Input
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
            />
          </span>
        </div>
      </Modal>
    </>
  );
}
