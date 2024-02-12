"use client";

import { Editor } from "novel";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useCallback, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { Textarea } from "@/components/ui/textarea";
import { Blog } from "@/type";

const blogsTags = [
  {
    label: "HTML",
    value: "HTML",
    name: "HTML",
  },
  {
    label: "CSS",
    value: "CSS",
    name: "CSS",
  },
  {
    label: "JavaScript",
    value: "JavaScript",
    name: "JavaScript",
  },
];

type Variants = "blog" | "project";

export default function BlogForm({
  id,
  value,
  variant = "blog",
}: {
  id?: string;
  variant?: Variants;
  value?: Blog;
}) {
  const router = useRouter();

  const [blogForm, setBlogForm] = useReducer(
    (prev: Blog, next: Blog) => ({ ...prev, ...next }),
    {
      title: value?.title || "",
      content: value?.content || "",
      description: value?.description || "",
      tags: value?.tags || [],
      cover_url: value?.cover_url || "",
    }
  );

  const updateContent = useCallback((data: any) => {
    setBlogForm({ ...blogForm, content: data?.getJSON() });
  }, []);

  const onSubmitBlog = async () => {
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

  const onSubmitProject = async () => {
    console.log("project...", id, blogForm);
    let req;
    if (id) {
      req = await fetch(`/api/projects?id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogForm),
      });
    } else {
      req = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogForm),
      });
    }

    const response = await req.json();
    if (response?.data?.id) {
      router.push("/admin/projects");
    }
  };

  const uploadCoverImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    console.log("upload...", file, file?.type, file?.name);
    if (file) {
      const response = await fetch(`/api/upload`, {
        method: "POST",
        headers: {
          "Content-type": file.type,
          "X-Vercel-Filename": file.name,
        },
        body: file,
      }).then((res) => res.json());

      setBlogForm({ ...blogForm, cover_url: response?.url });
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="title" className="capitalize">
          {" "}
          {variant} Title
        </Label>
        <Input
          type="text"
          placeholder="title"
          value={blogForm.title}
          onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
          className="mt-2"
        />
      </div>
      <div className=" mt-5">
        <Label htmlFor="description" className="capitalize">
          {" "}
          {variant} Description
        </Label>
        <Textarea
          placeholder="description"
          value={blogForm.description}
          onChange={(e: { target: { value: any } }) =>
            setBlogForm({ ...blogForm, description: e.target.value })
          }
          className="mt-2"
        />
      </div>
      <div className="mt-5">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="picture" className="capitalize">
            {variant} Cover Image
          </Label>
          <div className="max-w-[120px]">
            {blogForm.cover_url && (
              <img
                src={blogForm.cover_url}
                className="w-full h-auto rounded-md"
              />
            )}
          </div>
          <Input id="picture" type="file" onChange={uploadCoverImage} />
        </div>
      </div>
      <div className=" mt-5">
        <Label htmlFor="content" className="capitalize">
          {variant} Content
        </Label>
        <Editor
          editorProps={{}}
          onDebouncedUpdate={updateContent}
          defaultValue={blogForm.content}
          className="border rounded pb-8 mt-2"
          disableLocalStorage
        ></Editor>
      </div>
      <div className="mt-4">
        <Label htmlFor="tags" className="capitalize">
          {variant} Tags
        </Label>
        <Select
          isMulti
          name="tags"
          value={blogForm?.tags?.map((item) => ({
            name: item,
            label: item,
            value: item,
          }))}
          options={blogsTags}
          onChange={(e) => {
            setBlogForm({ ...blogForm, tags: e.map((item) => item.name) });
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        ></Select>
      </div>
      <div className="mt-4 text-right">
        <Button
          variant={"secondary"}
          onClick={() => {
            variant === "blog"
              ? router.push("/admin/blogs")
              : router.push("/admin/projects");
          }}
        >
          Cancel
        </Button>
        <Button
          className="ml-5"
          onClick={() =>
            variant === "blog" ? onSubmitBlog() : onSubmitProject()
          }
        >
          <CheckIcon className="mr-2" />
          Save
        </Button>
      </div>
    </>
  );
}
