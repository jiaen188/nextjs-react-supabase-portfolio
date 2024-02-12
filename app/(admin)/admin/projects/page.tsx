"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  MagnifyingGlassIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
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
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

interface Response {
  data: Blog[];
  loading: boolean;
  searchTerm: string;
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
      searchTerm: "",
    }
  );

  const fetchProjects = async (searchTerm = "") => {
    const res = await fetch(`/api/projects?term=${searchTerm}`).then((res) =>
      res.json()
    );
    setResponse({ ...response, data: res.data, loading: false });
  };

  const projectDelete = async (id: string) => {
    setIsLoading(true);
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const response = await res.json();
    if (response?.status === 204) {
      fetchProjects();
    }
    setIsLoading(false);
  };

  const debounceAPI = useCallback(
    debounce((value: string) => fetchProjects(value), 1000),
    []
  );

  const onChangeSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setResponse({ ...response, searchTerm: e.target.value });
    debounceAPI(e.target.value);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <div className="flex mb-5">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute top-[10px] left-[10px] text-gray-400" />
          <Input
            type="text"
            placeholder="Enter blog title"
            className="pl-8"
            onChange={onChangeSearchTerm}
          />
        </div>{" "}
      </div>
      {response.loading ? (
        <div className="animate-pulse">
          <div className="h-2 bg-slate-200 rounded col-span-2"></div>
          <div className="h-2 bg-slate-200 rounded col-span-1 mt-3"></div>
        </div>
      ) : (
        <div className="mt-8">
          {response.data.map((project, index: number) => (
            <div
              key={index.toString()}
              className="mb-6 flex justify-between group"
            >
              <div>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-2xl font-normal text-blue-400"
                >
                  {project.title}
                </Link>
                <p className="mt-2 text-slate-500">{project.description}</p>
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
                        Are you sure you want to delete <b>{project.title}</b>?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-5">
                      <Button
                        type="submit"
                        onClick={() => projectDelete(project.id as string)}
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
