"use client";

import { Editor } from "novel";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useReducer, useState } from "react";
import { useRouter } from "next/navigation";

interface Blog {
  id?: string;
  title: string;
  description?: string;
  content: string;
}

export default function BlogForm({
  id,
  value,
}: {
  id?: string;
  value?: Blog | null;
}) {
  const router = useRouter();

  const [blogForm, setBlogForm] = useReducer(
    (prev: Blog, next: Blog) => ({ ...prev, ...next }),
    {
      title: value?.title || "",
      content: value?.content || "",
      description: value?.description || "",
    }
  );

  const updateContent = useCallback((data: any) => {
    setBlogForm({ ...blogForm, content: data?.getJSON() });
  }, []);

  const onSubmit = async () => {
    let req;
    if (id) {
      req = await fetch(`/api/blogs?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogForm),
      });
    } else {
      req = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogForm),
      });
    }

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
          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
        />
      </div>
      <div className=" mt-5">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          placeholder="description"
          value={blogForm.description}
          onChange={(e) =>
            setBlogForm({ ...blogForm, description: e.target.value })
          }
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
