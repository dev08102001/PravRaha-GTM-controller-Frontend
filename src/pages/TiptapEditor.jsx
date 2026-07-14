import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { uploadImage } from "../services/uploadService";
export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Underline,

      Image,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value || "",

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) return null;

  // const addImage = () => {
  //   const url = window.prompt("Enter Image URL");

  //   if (url) {
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // };

     
    //  import { uploadImage } from "../services/uploadService";

const addImage = async () => {
  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);

      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
        })
        .run();
    } catch (err) {
      console.error(err);
      alert(err.message || "Image upload failed");
    }
  };

  input.click();
};
  return (
    <div className="border border-[#2A3550] rounded-lg overflow-hidden bg-[#151D2E]">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border-b border-[#2A3550] bg-[#10182B]">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bold")
              ? "bg-cyan-600 text-white"
              : "bg-[#1d2742] text-gray-300"
          }`}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic")
              ? "bg-cyan-600 text-white"
              : "bg-[#1d2742] text-gray-300"
          }`}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("underline")
              ? "bg-cyan-600 text-white"
              : "bg-[#1d2742] text-gray-300"
          }`}
        >
          <u>U</u>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-1 rounded bg-[#1d2742] text-gray-300"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-3 py-1 rounded bg-[#1d2742] text-gray-300"
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="px-3 py-1 rounded bg-[#1d2742] text-gray-300"
        >
          Left
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="px-3 py-1 rounded bg-[#1d2742] text-gray-300"
        >
          Center
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="px-3 py-1 rounded bg-[#1d2742] text-gray-300"
        >
          Right
        </button>

        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded bg-[#1d2742] text-gray-300"
        >
          Image
        </button>
      </div>

      {/* Editor */}

      <EditorContent
        editor={editor}
        className="prose prose-invert max-w-none min-h-[250px] p-4 text-white focus:outline-none"
      />
    </div>
  );
}