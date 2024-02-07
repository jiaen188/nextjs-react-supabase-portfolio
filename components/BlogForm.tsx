"use client";

import { Editor } from "novel";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useReducer, useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogForm({ id }: { id?: string }) {
  const router = useRouter();

  const [blogForm, setBlogForm] = useReducer(
    (prev, next) => ({ ...prev, ...next }),
    {
      title: "",
      content: "",
      description: "",
    }
  );

  const updateContent = useCallback((data: any) => {
    setBlogForm({ content: data?.getJSON() });
  }, []);

  const onSubmit = async () => {
    const req = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogForm),
    });

    const response = await req.json();
    if (response?.data?.id) {
      router.push("/admin/blogs");
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          placeholder="title"
          value={blogForm.title}
          onChange={(e) => setBlogForm({ title: e.target.value })}
        />
      </div>
      <div className=" mt-5">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          placeholder="description"
          value={blogForm.description}
          onChange={(e) => setBlogForm({ description: e.target.value })}
        />
      </div>
      <div className=" mt-5">
        <Label htmlFor="content">Content</Label>
        <Editor
          editorProps={{}}
          onDebouncedUpdate={updateContent}
          defaultValue={blogForm.content}
          className="border rounded pb-8 mt-2"
          disableLocalStorage
        ></Editor>
      </div>
      <div className="mt-4 text-right">
        <Button variant={"secondary"}>Cancel</Button>
        <Button className="ml-5" onClick={onSubmit}>
          <CheckIcon className="mr-2" />
          Save
        </Button>
      </div>
    </>
  );
}
