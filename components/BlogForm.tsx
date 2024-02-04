"use client";

import { Editor } from "novel";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";

export default function BlogForm() {
  const router = useRouter();
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const updateContent = useCallback((data: any) => {
    setBlogContent(data?.getJSON());
  }, []);

  const onSubmit = async () => {
    const req = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: blogTitle, content: blogContent }),
    });

    const response = await req.json();
    if (response?.data?.id) {
      router.push("/admin/blogs");
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="email">title</Label>
        <Input
          type="email"
          placeholder="Email"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
      </div>
      <div className=" mt-5">
        <Label htmlFor="content">content</Label>
        <Editor
          editorProps={{}}
          onDebouncedUpdate={updateContent}
          defaultValue={blogContent}
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
