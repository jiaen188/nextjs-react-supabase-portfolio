"use client";

import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Blog } from "@/type";

interface Response {
  data: Blog[];
  loading: boolean;
}

export default function blogsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [response, setResponse] = useReducer(
    (prev: Response, next: Response) => {
      return { ...prev, ...next }; // 合并对象
    },
    {
      data: [],
      loading: true,
    }
  );

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const response = await res.json();
    setResponse({ data: response.data, loading: false });
  };

  const blogDelete = async (id: string) => {
    setIsLoading(true);
    const res = await fetch("/api/blogs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response?.status === 204) {
      fetchBlogs();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <div className="flex mb-5">
        <div>{/* <h2 className="text-2xl font-bold">Blogs</h2> */}</div>
      </div>
      {response.loading ? (
        <div className="animate-pulse">
          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1 mt-3"></div>
        </div>
      ) : (
        <div className="mt-8">
          {response.data.map((blog, index: number) => (
            <div
              key={index.toString()}
              className="mb-6 flex justify-between group"
            >
              <div>
                <Link
                  href={`/admin/blogs/${blog.id}`}
                  className="text-2xl font-normal text-blue-400"
                >
                  {blog.title}
                </Link>
                <p className="mt-2 text-slate-500">{blog.description}</p>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"secondary"}
                      className="opacity-0 group-hover:opacity-80"
                    >
                      <TrashIcon></TrashIcon>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete confirmation</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete <b>{blog.title}</b>?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-5">
                      <Button
                        type="submit"
                        onClick={() => blogDelete(blog.id as string)}
                        variant={"destructive"}
                      >
                        {isLoading ? (
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
